<template>
  <q-page padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      formTitle="Declaración"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="showForm = false"
      :is-modifying="update"
    >
      <template v-slot:default>
        <!-- Nombre declaration -->
        <q-select
          :readonly="auth.isStudent || auth.isWorker"
          :borderless="auth.isStudent || auth.isWorker"
          :filled="!auth.isStudent && !auth.isWorker"
          v-model="formObj.denunciation"
          :dense="state.dense"
          :options="denunciationStore.array"
          :rules="[val || 'Por favor, seleccione una opción']"
          lazy-rules
          map-options
          emit-value
          label="Caso disciplinario"
          behavior="dialog"
          option-label="subject"
          option-value="id"
        />
        <q-select
          v-if="!isDeclarer"
          :readonly="auth.isStudent || auth.isWorker"
          :borderless="auth.isStudent || auth.isWorker"
          :filled="!auth.isStudent && !auth.isWorker"
          v-model="formObj.declarer"
          :options="userStore.array"
          :dense="state.dense"
          :rules="[val || 'Por favor, seleccione un usuario']"
          label="Usuario a declarar"
          lazy-rules
          map-options
          emit-value
          option-label="name"
          option-value="id"
        />
        <q-input
          label="Título"
          :readonly="isDeclarer || auth.isStudent || auth.isWorker"
          :borderless="isDeclarer || auth.isStudent || auth.isWorker"
          :filled="!auth.isStudent && !auth.isWorker"
          :dense="state.dense"
          v-model.trim="formObj.title"
          :rules="[val || 'Por favor, escriba un título']"
        />
        <!-- Descripción declaración -->
        <q-input
          :readonly="!isDeclarer && update"
          label="Descripción"
          :v-show="false"
          v-model.trim="formObj.description"
          :dense="state.dense"
          :rules="[
            (val) =>
              (val && val.length > 0) || 'Este campo no puede estar vacío',
          ]"
          autogrow
          clearable
          filled
          lazy-rules
        />
        <DevInfo>
          formObj: {{ formObj }}<br />
          declarationStore.array: {{ s.array }}
        </DevInfo>
      </template>
    </BaseForm>
    <ListPage
      :columns="declarationFields"
      :rows="s.array"
      heading="Declarations"
      rowKey="id"
      @updateList="s.refresh()"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => s.del(selectedRows)"
      :can-create="auth.isTeacher"
    ></ListPage>
  </q-page>
</template>
<script setup>
import { computed, ref } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import state from "src/composables/useState.js";
import { useDenunciationStore } from "src/stores/denunciationStore";
import { useUserStore } from "src/stores/userStore";
import { useDeclarationStore } from "src/stores/declarationStore";
import { useAuthStore } from "src/stores/authStore";
import roles from "src/composables/useRoles";
const auth = useAuthStore();
const userStore = useUserStore();
const denunciationStore = useDenunciationStore();
const s = useDeclarationStore();
s.refresh();
userStore.refresh();
denunciationStore.refresh();
const showForm = ref(false);

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const formObj = ref({ title: "Declaración del " });

const isDeclarer = computed(
  () => formObj.value.declarer?.id === auth.loggedUser.id
);
const update = computed(() => formObj.value.id !== undefined);
//openForm triggered on: Nueva entrada, Modificar
function openForm(obj = { title: "Declaración del " }) {
  formObj.value = obj;
  showForm.value = true;
}

//SUBMIT
function submitFormData() {
  s.save(formObj.value);
  resetFormData();
  showForm.value = false;
}
//RESET
function resetFormData() {
  formObj.value = {};
}

const declarationFields = ref([
  {
    name: "declarer",
    required: true,
    label: "Declarante",
    align: "left",
    field: (d) => d.declarer.name,
    sortable: true,
  },
  {
    name: "denunciation",
    required: true,
    label: "Caso",
    align: "left",
    field: (dec) => dec.denunciation.subject,
    sortable: true,
  },
  {
    name: "status",
    required: true,
    label: "Estado",
    align: "left",
    field: "status",
    sortable: true,
  },
  {
    name: "date",
    required: true,
    label: "Fecha",
    align: "left",
    field: "date",
    sortable: true,
  },
]);
</script>
