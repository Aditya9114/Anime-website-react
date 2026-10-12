# Anime Website — Updated Developer Guide

This folder explains the application as it is implemented now. It is intended to be a practical learning guide: each page connects a browser action to the React component, HTTP request, Express route, controller, and MongoDB model that handle it.

> These documents describe the current repository, including its AniList migration. Older notes in `docs/interview-prep` still contain Jikan-era explanations; use this folder when you want the current data flow.

## Reading path

1. [Architecture at a glance](./01-architecture.md) — the system boundaries and how the pieces talk.
2. [Frontend walkthrough](./02-frontend-walkthrough.md) — app startup, routing, state, API calls, and rendering.
3. [Component guide](./03-component-guide.md) — what each page and reusable component is responsible for.
4. [Backend walkthrough](./04-backend-walkthrough.md) — Express setup, middleware, routes, controllers, and persistence.
5. [Data models and API contracts](./05-data-models-and-api-contracts.md) — MongoDB shapes and every app API endpoint.
6. [Authentication and sessions](./06-authentication-and-sessions.md) — password hashing, JWT cookies, refresh, and authorization.
7. [Feature and request flows](./07-feature-and-request-flows.md) — worked examples for search, saving anime, comments, and more.
8. [Run, configure, and troubleshoot](./08-running-and-troubleshooting.md) — local commands, environment variable names, and common failure clues.

## The project in one sentence

The browser renders a React single-page app, reads public anime information directly from AniList’s GraphQL API, and calls an Express API backed by MongoDB for accounts, favourites, watchlists, and comments.

## Start with these source files

- Frontend entry point: [`Frontend/src/main.jsx`](../Frontend/src/main.jsx)
- Route table and page wiring: [`Frontend/src/App.jsx`](../Frontend/src/App.jsx)
- AniList service: [`Frontend/src/services/anilist.js`](../Frontend/src/services/anilist.js)
- Backend assembly: [`Backend/src/app.js`](../Backend/src/app.js)
- Backend startup: [`Backend/src/index.js`](../Backend/src/index.js)
- User and comment schemas: [`Backend/src/models/user.models.js`](../Backend/src/models/user.models.js), [`Backend/src/models/comments.models.js`](../Backend/src/models/comments.models.js)

## Safety note

Environment files contain credentials. This guide names configuration variables but does not include their values. Any variable beginning with `VITE_` is compiled into frontend code and must not contain a private server secret.
