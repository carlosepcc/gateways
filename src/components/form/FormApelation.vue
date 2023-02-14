<template>
  <BaseForm v-show="true" formTitle="Apelación">
    <template v-slot:header>REALIZAR APELACIÓN</template>
    <p class="text-dark">
      Apelación para el caso disciplinario<br />
      <strong>Tentativa de fraude en examen parcial de Matemática I </strong>
    </p>
    <q-editor
      v-model="formObj.description"
      :toolbar="[['bold', 'italic', 'strike', 'underline']]"
    />
    <template v-slot:footer>
      <q-btn-group spread>
        <q-btn form="formularioBase" type="reset" label="Cancelar" no-caps />
        <q-btn
          form="formularioBase"
          type="submit"
          :size="state.dense ? 'sm' : 'md'"
          color="primary"
          label="Enviar apelación"
          no-caps
        />
      </q-btn-group>
    </template>
  </BaseForm>
</template>

<script setup>
import { ref } from "vue";
import BaseForm from "@/components/BaseForm.vue";
const formObj = ref({});
</script>
