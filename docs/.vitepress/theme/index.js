import DefaultTheme from "vitepress/theme";
import "./custom.css";
import Mermaid from "./Mermaid.vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app, router }) {
    app.component("Mermaid", Mermaid);
  },
};
