# PWA in Practice

Example Vue App for my related Talk:

"PWA in practice - The good, the bad and the ugly parts"

## Features
- Offline support by ServiceWorker and indexedDB as source of truth
    - Toggle and remove ToDo's
    - Cache internal and external resources with Workbox

- Update the PWA without closing it (for simple use cases)
- Configure a http timeout to prevent long running requests caused by liefy

- Prepare PWA with a dedicated Worker
    - Fetch Data from API and persist
    - Fetch Media like images and cache it

## Installation

Copy and rename `server/db.json.default` to `server/db.json`

```
npm run install
```

## Run the Frontend Applikation

```
npm run serve
```

## Run the JSON Server (REST API)

```
npm run server
```

## Run the Frontend as static site (to enable the included service worker)

```
npm run build
npm run serve:build
```