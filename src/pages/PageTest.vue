<script setup lang="ts">
import state from "composables/useState";
import BaseForm from "src/components/BaseForm.vue";
import { useDenunciationStore } from "src/stores/denunciationStore";\
const denunciationStore = useDenunciationStore();
const declaracionObject = ref({});
const showForms = true;
</script>
<template>
  <q-page padding>
    <h5>Pruebas</h5>
    <BaseForm v-model="showForms" formTitle="Declaracion">
      <template v-slot:default>
        <!-- Nombre declaracion -->
        <q-select
          v-model="declaracionObject.idDenuncia"
          :dense="state.dense"
          :options="denuncias"
          :rules="[val || 'Por favor, seleccione una opción']"
          filled
          lazy-rules
          map-options
          emit-value
          label="Caso disciplinario"
          behavior="dialog"
          :option-label="(d) => d.descripcion.slice(0, 50) + '(...)'"
          option-value="id"
        />
        <q-select
          v-model="declaracionObject.usuario"
          :options="usersArr"
          :dense="state.dense"
          :rules="[val || 'Por favor, seleccione un usuario']"
          label="Usuario a declarar"
          lazy-rules
          filled
          map-options
          emit-value
          option-label="nombre"
          option-value="usuario"
        />
      </template>
    </BaseForm>
  </q-page>
</template>
