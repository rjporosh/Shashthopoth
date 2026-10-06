# Verification scripts (dev-only, not part of the product)

Headless checks used to verify the prototype in an environment with no real browser.
The product itself has no build step and no dependencies.

```bash
cd docs/verification
npm init -y && npm i jsdom fake-indexeddb    # dev-only; do not commit node_modules
node logic.test.js   # tokens, queues, routing, red flags, follow-up rules (fake IndexedDB)
node e2e.test.js     # whole kiosk -> display -> doctor -> follow-up journey (real index.html + scripts in jsdom)
node live.test.js    # live auto-refresh; an open follow-up form is not clobbered
```

Limits: jsdom is not a browser. It does not check layout, fonts, print output, speech APIs or cross-tab BroadcastChannel.
