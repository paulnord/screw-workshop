# Screw Workshop for iPhone — development project

An iPhone-only, portrait iOS 16+ app using UIKit and WKWebView. The complete 80-puzzle game, physics engine, artwork, and Matter.js license are bundled inside the app. There is no remote website dependency, server, analytics, advertising, purchase system, timer, or audio. This is source for an app, **not a signed installable download or an App Store release**.

## Open and build on a Mac

1. Open `ios/ScrewWorkshop.xcodeproj` in Xcode 16 or newer.
2. Choose the shared **ScrewWorkshop** scheme and an installed iPhone simulator; Run. No Apple account is needed for simulator development.
3. For a physical iPhone, select your own existing signing team in Signing & Capabilities and connect the phone. The placeholder bundle identifier is `com.paulnord.ScrewWorkshop`; adjust it if your signing setup requires a unique identifier. No team, signing credential, provisioning profile, paid membership, or store upload is included.

An unsigned simulator build can be checked explicitly:

```sh
xcodebuild -project ios/ScrewWorkshop.xcodeproj -scheme ScrewWorkshop \
  -configuration Debug -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath /tmp/ScrewWorkshopBuild CODE_SIGNING_ALLOWED=NO build
```

There is no CocoaPods, Swift package resolution, web server, npm installation, or Xcode shell build phase. The checked-in `ios/Web` folder is copied intact as a bundle resource.

## Keep the game in sync

`dist/` remains the single source of truth for gameplay. Do not edit generated `ios/Web` files. After any game change:

```sh
node scripts/build-ios-web.mjs
node scripts/build-ios-web.mjs --check
node test.mjs
node test-progress.mjs
node test-pack.mjs
node test-expansion.mjs
node test-campaign80.mjs
# Optional integration test, in an environment with Playwright and Chromium:
node test-ios-web.mjs
```

The small dependency-free bundler supports this project's named-export modules only and rejects unsupported syntax. It makes classic scripts to avoid `file://` ES-module cross-origin restrictions without private WebKit preferences, a local HTTP server, or a third-party native wrapper. Generated resource hashes live in `Web/manifest.json`. Levels, physics, move targets, and efficiency stars are unchanged.

## Native behavior

- The web view is constrained to UIKit safe areas; normal scrolling keeps controls reachable on small phones. Touch targets and reduced-motion behavior remain those of the original game.
- A document-start bridge supplies the saved progress before the game starts. Progress is normalized by the existing game code and written atomically to the app's private Application Support directory whenever the selected puzzle, completion, best, or pack unlock changes. It does not depend on `file://` localStorage behavior. There is no Safari-save import or cloud sync; deleting the app removes the save. System backups may include app data.
- Going inactive pauses physics and saves progression; becoming active resumes the same in-memory attempt without a background-time jump. Force-quit or a WebKit process recovery restores progression and the selected puzzle, **not** the interrupted attempt's positions/undo history. This matches the original game’s restart-on-reload behavior.
- Native messages accept only bounded JSON from the bundled main frame. Navigation is limited to the bundled entry point. The generated HTML's Content Security Policy blocks network connections and external resources. No private WebKit switches or broad transport exceptions are used.
- The game remains intentionally silent, so it needs no audio session, microphone permission, or background-audio mode. Existing music is not deliberately interrupted.
- A native save failure reports a visible status rather than silently claiming it saved. A malformed/missing save starts fresh through normal progress normalization.

## Verification status and required Mac/device checks

Prepared and tested in Linux, where Xcode, Apple SDKs, signing and simulator/device runtimes are unavailable. The six existing Node suites and generated-bundle freshness check pass. The added Playwright suite is syntax-checked but could not execute here: Chromium socket creation was denied, and the scoped escalation failed in the execution infrastructure. Browser tests are not WKWebView device tests. Native compilation, installation, App Store eligibility/review and distribution have **not** been established.

Before distributing, run the unsigned build above and then verify on simulator and a real iPhone:

- Cold launch in airplane mode; all eight packs / 80 puzzle choices appear (locks are normal).
- Complete a puzzle; terminate and relaunch; best, stars, selected level and earned packs survive.
- Pause mid-swing with Home, lock screen and Control Center; return without a time jump. Test repeated interruptions.
- Exercise Undo, Restart confirmation/cancel, hints, pack locks and modal Close repeatedly.
- Check notched and small screens, home indicator/status bar, scrolling, VoiceOver labels, larger text and Reduce Motion.
- Verify the app stays silent and existing music continues; repeat after interruption.
- Simulate WebKit process recovery; confirm completed progress returns and the active attempt restarts clearly.
- Verify branding, icon, privacy disclosure, licensing and signing before considering distribution. No TestFlight/App Store publication is authorized by this project.

## Public API references

- [Apple WKWebView local file loading](https://developer.apple.com/documentation/webkit/wkwebview/loadfileurl(_:allowingreadaccessto:))
- [Apple WKUserScript](https://developer.apple.com/documentation/webkit/wkuserscript)
- [Apple WKScriptMessageHandler](https://developer.apple.com/documentation/webkit/wkscriptmessagehandler)
- [Apple safe-area layout](https://developer.apple.com/documentation/uikit/positioning-content-relative-to-the-safe-area)
- [Apple scene lifecycle](https://developer.apple.com/documentation/uikit/uiscenedelegate)
