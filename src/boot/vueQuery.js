import { boot } from "quasar/wrappers";
import { VueQueryPlugin } from "vue-query";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */ { app }) => {
  // something to do
  app.use(VueQueryPlugin);
});
