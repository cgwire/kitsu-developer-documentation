## Architecture

Kitsu is divided into two parts: the Kitsu app, and Zou (Kitsu API).

## 1. Kitsu App Frontend

Kitsu is based on the [Vue.js](https://vuejs.org/guide/) framework. The Vue.js documentation is exhaustive and very clear. We encourage you to read it before making significant changes to the code.

The frontend architecture is based on [Vuex](https://vuex.vuejs.org) and [vue-router](https://router.vuejs.org). Their documentation is also very good, and we recommend reading it. The main idea is that:

* URL routes give the main context.
* Views are described in components through HTML, CSS, and small pieces of JavaScript.
* Shared state is stored inside stores, which are modified through mutations (a kind of event bus to request state changes) and actions.
* Actions are similar to mutations but allow asynchronous operations. Mainly, actions fire mutations and send requests to the server.
* Stores provide getters to access state properties from components.
* Local change logic is kept inside components.
* Getters, actions, and mutations must be testable without a browser.

## 2. Zou: Kitsu API Backend

Zou is a Python application implemented with the Flask web framework. Nginx acts as a reverse proxy.

Zou exposes a Flask Restful API that handles all core production data while a companion event service, also Flask-based, provides real-time updates over WebSockets so clients can receive live notifications when data changes.

The primary database is PostgreSQL, which stores structured production data and enforces relational integrity, while Redis is used both as a cache and as a pub/sub backbone to power asynchronous jobs and real-time event broadcasting.

Media processing like preview transcoding is handled by FFmpeg.

We use Meilisearch for full-text search & advanced indexing.
