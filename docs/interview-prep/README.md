# Anime-website Interview Preparation

This folder explains the project as it exists today. It is written for interview preparation: each topic explains the code path, the reason for the design, alternatives, examples, and likely failure scenarios.

## Reading order

1. [01 - Architecture Overview](./01-architecture-overview.md)
2. [02 - Backend Walkthrough](./02-backend-walkthrough.md)
3. [03 - Frontend Walkthrough](./03-frontend-walkthrough.md)
4. [04 - Authentication and Sessions](./04-authentication-and-sessions.md)
5. [05 - Data Models and API Contract](./05-data-models-and-api-contract.md)
6. [06 - Feature Request Flows](./06-feature-request-flows.md)
7. [07 - Interview Questions and Answers](./07-interview-questions-and-answers.md)
8. [08 - What I Would Improve](./08-what-i-would-improve.md)

## Project in one sentence

OtakuIndex is a React anime browser that reads public anime metadata from the Jikan API and uses an Express, MongoDB, and JWT backend for accounts and user-owned data such as favourites, watchlists, and comments.

## Source anchors

- Frontend entry: [`Frontend/src/main.jsx`](../../Frontend/src/main.jsx)
- Frontend routes: [`Frontend/src/App.jsx`](../../Frontend/src/App.jsx)
- Backend application: [`Backend/src/app.js`](../../Backend/src/app.js)
- Backend startup and database connection: [`Backend/src/index.js`](../../Backend/src/index.js) and [`Backend/src/db/index.js`](../../Backend/src/db/index.js)

## Important note

Environment files contain secrets and connection strings. The examples in these documents use placeholders and never reproduce secret values.
