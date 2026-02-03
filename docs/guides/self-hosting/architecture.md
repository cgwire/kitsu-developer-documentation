## Architecture

Kitsu is based on the [Vue.js](https://vuejs.org/guide/) framework. The Vue.js documentation is exhaustive and very clear. We encourage you to read it before making significant changes to the code.

The architecture is based on [Vuex](https://vuex.vuejs.org) and [vue-router](https://router.vuejs.org). Their documentation is also very good, and we recommend reading it. The main idea is that:

* URL routes give the main context.
* Views are described in components through HTML, CSS, and small pieces of JavaScript.
* Shared state is stored inside stores, which are modified through mutations (a kind of event bus to request state changes) and actions.
* Actions are similar to mutations but allow asynchronous operations. Mainly, actions fire mutations and send requests to the server.
* Stores provide getters to access state properties from components.
* Local change logic is kept inside components.
* Getters, actions, and mutations must be testable without a browser.
