import UIKit
import WebKit

// A local-only shell. No remote site, server, tracking, purchases, or credentials.
final class GameViewController: UIViewController, WKNavigationDelegate {
    private var webView: WKWebView!
    private let progress = ProgressStore()
    private var active = true
    private var indexURL: URL?

    override var preferredStatusBarStyle: UIStatusBarStyle { .lightContent }

    override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = UIColor(red: 23 / 255, green: 46 / 255, blue: 43 / 255, alpha: 1)
        let configuration = WKWebViewConfiguration()
        configuration.websiteDataStore = .default()
        configuration.userContentController.add(progress, name: "progress")
        webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = self
        webView.isOpaque = false
        webView.backgroundColor = view.backgroundColor
        webView.scrollView.backgroundColor = view.backgroundColor
        webView.scrollView.contentInsetAdjustmentBehavior = .never
        webView.scrollView.bounces = false
        webView.allowsBackForwardNavigationGestures = false
        webView.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(webView)
        NSLayoutConstraint.activate([
            webView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            webView.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
            webView.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor),
            webView.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor)
        ])
        loadGame()
    }

    private func loadGame() {
        guard let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web") else {
            showError("The bundled game is missing. Rebuild the app with its Web resources.")
            return
        }
        indexURL = url.standardizedFileURL
        progress.allowedURL = indexURL
        let scripts = webView.configuration.userContentController
        scripts.removeAllUserScripts()
        // JSONSerialization escapes values; no save content is interpreted as source code.
        let source = """
        window.ScrewWorkshopNative = {
          savedProgress: \(progress.seedJSON()),
          saveProgress(value) { window.webkit.messageHandlers.progress.postMessage(value); }
        };
        """
        scripts.addUserScript(WKUserScript(source: source, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        webView.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
    }

    func setActive(_ value: Bool) {
        active = value
        webView?.evaluateJavaScript("window.dispatchEvent(new CustomEvent('screw-workshop-lifecycle', {detail: {active: \(value)}}))", completionHandler: nil)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) { setActive(active) }

    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        // Only our initial/recovery load is navigable. Links, frames and remote URLs
        // never open a browser or replace the trusted save-bridge document.
        let url = navigationAction.request.url
        let allowed = navigationAction.targetFrame?.isMainFrame == true
            && navigationAction.navigationType == .other
            && url?.isFileURL == true && url?.standardizedFileURL == indexURL
        decisionHandler(allowed ? .allow : .cancel)
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) { loadGame() }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        if (error as NSError).code != NSURLErrorCancelled { showError("The game could not open. Close and reopen the app to try again.") }
    }

    private func showError(_ message: String) {
        // Also works for a missing-resource error during viewDidLoad, before a
        // modal presentation would have a window to present from.
        let label = UILabel()
        label.text = message
        label.textColor = .white
        label.numberOfLines = 0
        label.textAlignment = .center
        label.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(label)
        NSLayoutConstraint.activate([
            label.centerYAnchor.constraint(equalTo: view.centerYAnchor),
            label.leadingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.leadingAnchor, constant: 24),
            label.trailingAnchor.constraint(equalTo: view.safeAreaLayoutGuide.trailingAnchor, constant: -24)
        ])
    }
}

// Separate handler avoids a WKUserContentController -> view controller retain cycle.
private final class ProgressStore: NSObject, WKScriptMessageHandler {
    var allowedURL: URL?
    private let maximumBytes = 128 * 1024

    private func saveURL() throws -> URL {
        let directory = try FileManager.default.url(for: .applicationSupportDirectory,
            in: .userDomainMask, appropriateFor: nil, create: true)
        return directory.appendingPathComponent("screw-workshop-progress.json")
    }

    func seedJSON() -> String {
        guard let url = try? saveURL(), let data = try? Data(contentsOf: url), data.count <= maximumBytes,
              let object = try? JSONSerialization.jsonObject(with: data), valid(object),
              let text = String(data: data, encoding: .utf8) else { return "null" }
        return text
    }

    private func valid(_ object: Any) -> Bool {
        guard let value = object as? [String: Any] else { return false }
        return value["campaign"] as? String == "shapes-80"
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "progress", message.frameInfo.isMainFrame,
              message.frameInfo.request.url?.standardizedFileURL == allowedURL,
              valid(message.body), JSONSerialization.isValidJSONObject(message.body),
              let data = try? JSONSerialization.data(withJSONObject: message.body), data.count <= maximumBytes else { return }
        do {
            try data.write(to: saveURL(), options: [.atomic, .completeFileProtectionUntilFirstUserAuthentication])
        } catch {
            // Report persistence failure without pretending a score was saved.
            message.webView?.evaluateJavaScript("window.dispatchEvent(new Event('screw-workshop-save-error'))", completionHandler: nil)
        }
    }
}
