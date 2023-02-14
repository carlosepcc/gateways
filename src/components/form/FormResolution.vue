<template>
  <BaseForm
    v-model="showForm"
    v-show="showForm"
    formTitle="Resolución"
    @submit="submitFormData"
    @reset="resetFormData"
    @close-form="closeForm"
    :isModifying="update"
  >
    <template v-slot:header v-if="update">VER RESOLUCIÓN</template>
    <template v-slot:footer v-if="update">
      <q-btn
        flat
        no-caps
        :size="state.dense ? 'sm' : 'md'"
        label="Cerrar"
        icon="r_close"
        class="full-width"
        @click="closeForm"
      />
    </template>

    <q-input
      v-model="formObj.number"
      :borderless="update"
      :dense="state.dense"
      label="Número"
      :readonly="update"
      max-length="13"
      class="q-mb-md"
    />

    <q-input
      :borderless="!auth.isDecano && !auth.isSu"
      readonly
      :filled="auth.isDecano || auth.isSu"
      label="Fecha de activación"
      v-model="formObj.dateActivation"
      :rules="[val || 'Por favor, seleccione una fecha']"
      class="cursor-pointer"
    >
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-date
          :readonly="!auth.isDecano && !auth.isSu"
          v-model="formObj.dateActivation"
          mask="YYYY-MM-DD"
          today-btn
        >
          <div class="row items-center justify-end">
            <q-btn v-close-popup label="Cerrar" color="primary" flat />
          </div>
        </q-date>
      </q-popup-proxy>
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer"> </q-icon>
      </template>
    </q-input>
    <q-input
      :borderless="!auth.isDecano && !auth.isSu"
      readonly
      :filled="auth.isDecano || auth.isSu"
      label="Fecha de expiración"
      v-model="formObj.dateExpiration"
      :rules="[val || 'Por favor, seleccione una fecha']"
      class="cursor-pointer"
    >
      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
        <q-date
          :readonly="!auth.isDecano && !auth.isSu"
          v-model="formObj.dateExpiration"
          mask="YYYY-MM-DD"
          today-btn
        >
          <div class="row items-center justify-end">
            <q-btn v-close-popup label="Cerrar" color="primary" flat />
          </div>
        </q-date>
      </q-popup-proxy>
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer"> </q-icon>
      </template>
    </q-input>

    <!--commissions-->
    <q-card
      v-for="(c, i) in formObj.commissions"
      :key="i"
      flat
      bordered
      class="my-card q-mb-sm"
    >
      <q-card-section class="q-pa-xs q-pl-sm q-pr-none">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-light">Comisión {{ i + 1 }}</div>
            <span class="text-grey q-ml-l"
              >Esta comisión {{ c.blocked ? "ya" : "no" }} ha atendido casos,
              {{ c.blocked ? "no" : "" }} puede ser modificada.</span
            >
          </div>

          <div class="col-auto" v-if="!c.blocked">
            <q-btn
              color="negative"
              size="sm"
              :title="(update ? 'Eliminar' : 'Descartar') + ' comisión'"
              flat
              :icon="update ? 'r_delete' : 'r_close'"
              @click="formObj.commissions.splice(i, 1)"
            />
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-select
          :readonly="c.blocked"
          v-model="c.president"
          :dense="state.dense"
          :options="userStore.teachers"
          :rules="[val || 'Por favor, seleccione un presidente']"
          label="Presidente"
          lazy-rules
          map-options
          option-label="name"
          emit-value
          option-value="id"
        />
        <q-select
          label="Secretario"
          :readonly="c.blocked"
          v-model="c.secretary"
          :dense="state.dense"
          :options="userStore.teachers"
          :rules="[val || 'Por favor, seleccione un secretario']"
          lazy-rules
          map-options
          emit-value
          option-value="id"
          option-label="name"
        />
      </q-card-section>
    </q-card>

    <q-btn
      v-show="!update"
      flat
      size="xl"
      color="grey"
      icon="r_add"
      spread
      no-caps
      class="full-width"
      :label="`Comisión ${formObj.commissions.length + 1}`"
      @click="
        formObj.commissions.push({
          president: null,
          secretary: null,
        })
      "
    />

    <DevInfo>
      {{ formObj }}
    </DevInfo>
  </BaseForm>
</template>

<script setup>
import { ref } from "vue";
import BaseForm from "@/components/BaseForm.vue";
import { computed, ref } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import state from "src/composables/useState.js";
import { useUserStore } from "src/stores/userStore";
import { useResolutionStore } from "src/stores/resolutionStore";
import { useAuthStore } from "src/stores/authStore";
const auth = useAuthStore();
const userStore = useUserStore();
const s = useResolutionStore();
s.refresh();
userStore.refresh();
const props = defineProps({
  formObj: { type: Object, default: { commissions: [{}, {}] } },
});

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const apelation = ref({ description: "Descripción" });
const update = computed(() => formObj.value.id !== undefined);
//openForm triggered on: Nueva entrada, Modificar
const d = new Date();
const currentYear = d.getFullYear();
const curso = `1/${currentYear}-${currentYear + 1}`;
const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

function openForm(
  obj = {
    number: curso,
    commissions: [{}, {}],
    dateActivation: today,
  }
) {
  formObj.value = obj;
  userStore.refresh();
  showForm.value = true;
}

//SUBMIT
function submitFormData() {
  formObj.value.resolutor = auth.loggedUser.id;
  s.save(formObj.value);
  resetFormData();
  closeForm();
}
//RESET
function resetFormData() {
  formObj.value = { ano: curso, commissions: [{}] };
}

//form dialog model
const showForm = ref(true);
//closeForm triggered on: Cancel
const closeForm = () => {
  showForm.value = false;
  s.refresh();
};
</script>
