<template>
  <q-page padding>
    <TemplateConclusion />
    <TemplateResolution />
  </q-page>
</template>

<script setup>
import { useAuthStore } from "src/stores/authStore.js";
import TemplateConclusion from "components/templates/TemplateConclusion.vue";
import TemplateResolution from "src/components/templates/TemplateResolution.vue";
const auth = useAuthStore();
let u = auth.loggedUserUi;
</script>
<style lang="sass">
iframe
  width: 100%
  max-width: 800px
  height: 80vh
  padding: 1cm
  background: #fff
</style>
