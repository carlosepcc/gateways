<template>
  <q-page padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      formTitle="Conclusión"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
    >
      <div>
        <div class="text-dark text-caption">Infractor</div>
        {{ formObj.infractor.name }}
      </div>
      <div>
        <div class="text-dark text-caption">Denuncia</div>
        <strong>{{ formObj.denunciation.subject }}</strong>
        <p>
          {{ formObj.denunciation.description }}
        </p>
      </div>
      <q-input filled v-model="formObj.fault" label="Falta" autogrow />

      <!-- QUALIFICATION -->
      <q-select
        v-model="formObj.qualification"
        :dense="state.dense"
        :options="res.qualificationLabels"
        :rules="[val || 'Por favor, seleccione una comisión']"
        filled
        lazy-rules
        label="Calificación de la falta"
      />
      <!-- Atenunantes -->
      <q-select
        v-model="formObj.atenuantes"
        multiple
        :dense="state.dense"
        :options="res.atenuantes"
        :rules="[val || 'Por favor, seleccione atenuantes']"
        filled
        lazy-rules
        map-options
        emit-value
        label="Atenunantes"
        behavior="dialog"
      />
      <!-- Agravantes -->
      <q-select
        v-model="formObj.agravantes"
        multiple
        :dense="state.dense"
        :options="res.agravantes"
        :rules="[val || 'Por favor, seleccione agravantes']"
        filled
        lazy-rules
        map-options
        emit-value
        label="Agravantes"
        behavior="dialog"
      />

      <DevInfo>
        {{ formObj }}
      </DevInfo>
    </BaseForm>
    <ListPage
      :columns="cols"
      :rows="s.arrayUi"
      heading="Conclusiones de la Comisión Disciplinaria"
      @updateList="s.refresh()"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => s.del(selectedRows)"
      printable
      @print="(row) => s.print(row)"
      :can-create="false"
      :can-delete="false"
    ></ListPage>
    <DevInfo>
      {{ s.array }}
    </DevInfo>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed } from "vue";
import res from "src/composables/useRegulation";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import state from "src/composables/useState.js";
import { useConclusionStore } from "stores/conclusionStore";
const s = useConclusionStore();
s.refresh();
const conclusion = ref({
  fault: "Tentativa de fraude",
  date: "2022-10-3",
  denunciation: {
    description:
      "El estudiante fue sorprendido intentando cometer fraude durante el examen parcial de Programación ",
  },
  qualification: {
    article: 5,
    inciso: "c",
    text: "Muy Grave",
  },
  sanction: {
    text: "Separación de 3 a 5 cursos de la Educación Superior.",
    inciso: "a1",
  },
  atenuantes: ["c", "d", "e"],
  agravantes: ["a"],
  prescription: 5,
  infractor: {
    name: "Adalberto Pérez González",
    position: "estudiante",
    group: "4301",
  },
  declaraciones: [
    {
      title: "Declaración del infractor",
      description:
        "La Comisión Disciplinaria se entrevistó con el estudiante, el cual, en su comparecencia, explica lo sucedido, afirma se siente mal por ello y que querría pedir disculpas a los profesores.",
    },
    {
      title: "Opinión del Profesor Guía",
      description:
        "Tiene resultados académicos regulares, y buen comportamiento. No asiste a la mayoría de actividades de la brigada.",
    },
  ],
  recordRevision:
    "El estudiante no ha sido sancionado anteriormente. Resultados docentes regulares. Su evaluación de integralidad es de R.",
  commission: {
    members: [
      {
        position: "profesor",
        role: "PRESIDENT",
        name: "Ana del Carmen Sosa",
        gender: "F",
        scientificCategory: "Dra.C",
      },
      {
        position: "profesor",
        role: "SECRETARY",
        name: "José Hernández de la Concepción",
        gender: "M",
        scientificCategory: "Mt.C",
      },
      {
        position: "estudiante",
        role: "VOCAL DE LA FEU",
        name: "Armando Paredes del Castillo",
        gender: "M",
        scientificCategory: "Est",
      },
    ],
  },
});
const formObj = ref({});
const update = computed(() => formObj.value.id !== undefined);

const showForm = ref(false);
function openForm(obj = {}) {
  Object.assign(formObj.value, obj);

  showForm.value = true;
}
const closeForm = () => {
  showForm.value = false;
  resetFormData();
  s.refresh();
};

//SUBMIT
function submitFormData() {
  s.update(formObj.value);
  resetFormData();
  closeForm();
}
//RESET
function resetFormData() {
  formObj.value = {};
}
const cols = ref([
  {
    name: "infractor",
    required: true,
    label: "Infractor",
    field: (c) => c.infractor.name,
    sortable: true,
  },
  {
    name: "denunciation",
    required: true,
    label: "Denuncia",
    field: (c) => c.denunciation.subject,
    sortable: true,
  },
  {
    name: "fault",
    required: true,
    label: "Falta",
    field: "fault",
    sortable: true,
  },
  {
    name: "qualification",
    required: true,
    label: "Calificación",
    field: "qualification",
    sortable: true,
  },
  {
    name: "abierto",
    required: true,
    label: "Abierto",
    field: "abierto",
    format: (abierto) => (abierto ? "Sí" : "No"),
    sortable: true,
  },
]);
</script>
