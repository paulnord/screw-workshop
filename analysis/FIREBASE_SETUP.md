# Optional account sync — setup and verification gate

Status: implementation is reviewable, **not configured or deployed**. `dist/firebase-config.mjs` defaults to `enabled:false`. No Firebase SDK is downloaded merely by opening the game. Guest play and its saves remain available without an account. A real account login/project inspection was blocked by Google sign-in; no production backend, keys, providers or billing were changed.

## Owner setup (free Spark only)

1. Sign into [Firebase console](https://console.firebase.google.com/) with the owner account. Select/create the intended project on **Spark**, without linking billing or upgrading to Identity Platform. Analytics is not needed. Stop if the console requires a paid plan.
2. Register a web app. Copy its public `apiKey`, `authDomain`, `projectId`, and `appId` configuration into the disabled config object. These identify the web app; they are not Admin credentials. Never paste service-account JSON, passwords, private keys or access tokens into this repository.
3. Enable **Email/Password** in Authentication. This release does not request social OAuth grants, phone/SMS auth or Identity Platform. Review authorized domains: `paulnord.github.io` and `screw-workshop-paul.paranord.chatgpt.site` for the two existing deployments. Add only an actual testing origin when required; do not use wildcards.
4. Create the default Cloud Firestore database in production mode and choose a suitable region deliberately. Do not accept open/test-mode rules. Deploy the repository's reviewed `firebase/firestore.rules` (confirm exact filename in `firebase.json`), using the project's explicit ID. Never deploy emulator/demo configuration to an unrelated project.
5. Run the credential-free rules emulator tests and adapter/core/UI tests. Then test two real user accounts: cross-user read/write denial; guest sign-in without automatic import; explicit merge; revision-specific best moves across two browsers; offline pending queue; sign-out isolation; export; recent-password-confirmed deletion and deletion retry on interrupted network.
6. Only after the above is verified, set `enabled:true` and publish the reviewed web release. The account button must stay absent while disabled. Do not claim deployed sync while the configuration or real account checks are missing.

Spark has quotas rather than an unlimited service guarantee. Do not add a payment method, enable Blaze, paid extensions/functions, or Identity Platform as a workaround. Check the current [Firebase pricing](https://firebase.google.com/pricing) and [Firestore quotas](https://firebase.google.com/docs/firestore/quotas) before enabling, and monitor usage. Failure/limit messages must retain local progress and pending writes instead of silently losing a score.

## Data and privacy contract

Cloud documents live only at `users/{uid}/progress/{kind}__{puzzleId}__{revision}`. They contain schema version, puzzle identity/revision, completion, best move count and server update time. No leaderboard, analytics or email-address fields are stored in Firestore. Auth itself stores the email/password account through Firebase; the application never persists passwords.

The SDK is pinned to 13.1.0. Authentication uses session persistence, not a bespoke token store. Firestore uses memory cache, not IndexedDB persistence shared between accounts. Reads explicitly request the server; writes use an online transaction that retains the minimum moves only for an identical puzzle revision. The application's separate UID-specific pending queue handles offline scores and retries; it must never upload guest scores without the explicit import action.

Account deletion reauthenticates first, writes an irreversible owner-only tombstone at `users/{uid}/control/account`, then drains outstanding writes, purges owned progress in pages of at most 400 and removes Auth last. Rules reject progress creates/updates after the tombstone, including from other devices. The small tombstone remains after account deletion to block still-valid old credentials; it contains only `deleting:true` and server update time, not email or scores. Once the flag is committed, deletion cannot be canceled and sync cannot resume for that UID. If a step fails, retry account deletion to finish; do not clear the flag. Export before deleting if a backup is wanted. Retrying with no progress remaining is supported.

The lower-level `deleteAll(uid,password)` API only clears progress, does not set a tombstone, and is not offered as an account reset UI. Another active device could recreate scores after such a progress-only purge. Use `deleteAccount(password)` for the coordinated deletion workflow.

Rules protect account ownership and data shape, not honest gameplay. Because clients report move counts, this is private progress backup, not a cheat-resistant competitive score service.

## Adapter API

`isFirebaseConfigured(config)`; `createFirebaseAdapter({config, loadSDK?})` lazily initializes the client. Adapter methods: `currentUser()`, `onAuth(callback)` (unsubscribe returned), `signIn(email,password)`, `signUp(email,password)`, `resetPassword(email)`, `signOut()`, `readAll(uid)`, `putBest(uid,record)`, `deleteAll(uid,password)`, `deleteAccount(password)`, `exportData(uid)`.

Do not call initialization during page import. The UI owns the explicit Account action and pending-state handling. Check the current user around asynchronous boundaries; failed or canceled operations must not reopen a dismissed dialog or switch another account's data.

Native iOS integration is separate. This web adapter does not relax WKWebView networking restrictions or claim native sign-in/device testing.

## Primary references

- [Web SDK setup](https://firebase.google.com/docs/web/setup)
- [Email/password authentication](https://firebase.google.com/docs/auth/web/start)
- [Session persistence](https://firebase.google.com/docs/auth/web/auth-state-persistence)
- [Reauthentication and user deletion](https://firebase.google.com/docs/auth/web/manage-users)
- [Transactions: retry behavior and offline failure](https://firebase.google.com/docs/firestore/manage-data/transactions)
- [Firestore API, including memory cache](https://firebase.google.com/docs/reference/js/firestore)
