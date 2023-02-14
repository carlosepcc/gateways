<template>
  <q-page padding>
    <BaseForm
      v-model="showForm"
      v-show="showForm"
      :formTitle="`Denuncia ${
        formObj.id ? formObj.id + ': ' + formObj.subject : ''
      }`"
      @submit="submitFormData"
      @reset="resetFormData"
      @close-form="closeForm"
      :isModifying="update"
    >
      <template v-if="formObj.status">
        <div>Esta denuncia está {{ formObj.status.toLowerCase() }}</div>
        <q-btn
          v-if="auth.isDecano && !isClosed"
          no-caps
          color="negative"
          flat
          :label="
            isArchived
              ? 'Desarchivar'
              : isPending
              ? 'Denegar y archivar'
              : 'Desactivar y Archivar'
          "
          :icon="isArchived ? 'unarchive' : 'archive'"
          :title="
            (isActive ? 'Desactivar' : isPending ? 'Denegar' : 'Desarchivar') +
            ' la denuncia ' +
            formObj.status.toLowerCase()
          "
          @click="toggleArchive()"
        />
      </template>
      <!-- COMMISSION -->
      <q-select
        v-if="formObj.id"
        :borderless="!auth.isDecano && !auth.isSu"
        :readonly="!auth.isDecano && !auth.isSu"
        :filled="auth.isDecano || auth.isSu"
        v-model="formObj.commission"
        :dense="state.dense"
        :options="commissionStore.array"
        :rules="[val || 'Por favor, seleccione una comisión']"
        map-options
        emit-value
        :option-label="(c) => c.president?.name + ', ' + c.secretary?.name"
        option-value="id"
        label="Comisión Disciplinaria que atiende el caso"
        lazy-rules
      >
        <template v-slot:prepend>
          <q-icon name="shield" @click.stop.prevent /> </template
      ></q-select>

      <!-- END DATE -->
      <q-input
        :borderless="!auth.isDecano && !auth.isSu"
        readonly
        :filled="auth.isDecano || auth.isSu"
        v-if="formObj.commission"
        label="Fin de actuaciones de la comisión"
        v-model="formObj.endDate"
        :rules="[val || 'Por favor, seleccione una fecha']"
      >
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="formObj.endDate" mask="YYYY-MM-DD">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Cerrar" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer"> </q-icon>
        </template>
      </q-input>

      <!-- VOCALS -->
      <template v-if="update && formObj.commission">
        <q-card
          v-for="(vocal, i) in formObj.vocals"
          :key="i"
          flat
          bordered
          class="my-card q-mb-sm"
        >
          <q-card-section class="q-pa-xs q-pl-sm q-pr-none">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-light">Vocal {{ i + 1 }}</div>
              </div>

              <div class="col-auto" v-if="!update">
                <q-btn
                  color="negative"
                  size="sm"
                  title="Descartar comisión"
                  flat
                  icon="r_close"
                  @click="formObj.vocals.splice(i, 1)"
                />
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-select
              :readonly="!auth.loggedUserUi.role"
              v-model="vocal.id"
              :dense="state.dense"
              :options="userStore.array"
              :rules="[val || 'Por favor, seleccione un usuario']"
              label="Usuario"
              filled
              lazy-rules
              map-options
              option-label="name"
              emit-value
              option-value="id"
            />
            <q-input
              label="Actúa como"
              :readonly="!auth.loggedUserUi.role"
              filled
              :dense="state.dense"
              v-model.trim="vocal.role"
              :rules="[val || 'Por favor, escriba un rol']"
            />
          </q-card-section>
        </q-card>
        <q-btn
          flat
          size="xl"
          color="grey"
          icon="r_add"
          spread
          no-caps
          class="full-width"
          :label="`Vocal ${formObj.vocals.length + 1}`"
          @click="formObj.vocals.push({})"
        />
      </template>
      <!-- STATUS -->
      <!-- <q-select
        v-if="formObj.id"
        readonly
        borderless
        :disable="
          auth.loggedUserUi.role != roles.dec &&
          auth.isSu
        "
        v-model="formObj.status"
        :dense="state.dense"
        :options="['Pendiente', 'Activa', 'Cerrada', 'Archivada']"
        :rules="[val || 'Por favor, seleccione un estado']"
        label="Estado"
        lazy-rules
      /> -->

      <!--TODO @filter="filterFn" use-input -->
      <!-- INFRACTORES -->
      <q-select
        :readonly="update"
        :filled="!update"
        :borderless="update"
        v-model="formObj.infractors"
        multiple
        :dense="state.dense"
        :options="userStore.students"
        :rules="[val || 'Por favor, seleccione los infractores']"
        label="Infractores"
        use-chips
        lazy-rules
        map-options
        option-label="name"
        emit-value
        option-value="id"
        behavior="dialog"
      />
      <!-- Asunto denuncia -->
      <q-input
        :readonly="update"
        v-model.trim="formObj.subject"
        :dense="state.dense"
        :rules="[
          (val) => (val && val.length > 0) || 'Este campo no puede estar vacío',
        ]"
        clearable
        label="Asunto"
        lazy-rules
      />
      <!-- Descripción denuncia -->
      <q-input
        :readonly="update"
        v-model.trim="formObj.description"
        :dense="state.dense"
        :rules="[
          (val) => (val && val.length > 0) || 'Este campo no puede estar vacío',
        ]"
        autogrow
        clearable
        label="Descripción"
        lazy-rules
      />

      <DevInfo>
        {{ formObj }}
      </DevInfo>
    </BaseForm>
    <ListPage
      :columns="columns"
      :rows="s.array"
      heading="Denuncias"
      @updateList="s.refresh()"
      @open-form="(payload) => openForm(payload)"
      @delete-rows="(selectedRows) => s.del(selectedRows)"
      :can-update="false"
      :can-delete="false"
    ></ListPage>

    <DevInfo>
      formObj : {{ formObj }}<br />
      Denuncias: {{ s.array }}
    </DevInfo>
    <DevInfo> commissions: {{ commissionStore.array }} </DevInfo>
  </q-page>
</template>
<script setup>
import { ref, computed } from "vue";
import ListPage from "components/ListPage.vue";
import BaseForm from "components/BaseForm.vue";
import DevInfo from "components/DevInfo.vue";
import roles from "src/composables/useRoles";
import state from "src/composables/useState.js";
import { confirm } from "src/composables/useUi";
import { useAuthStore } from "src/stores/authStore";
import { useQuasar } from "quasar";
import { useDenunciationStore } from "src/stores/denunciationStore";
import { useUserStore } from "src/stores/userStore";
import { useCommissionStore } from "src/stores/commissionStore";
const $q = useQuasar();
const commissionStore = useCommissionStore();
const auth = useAuthStore();
const userStore = useUserStore();
const s = useDenunciationStore();
s.refresh();
userStore.refresh();
commissionStore.refresh();
// execute on component mounted
//const queryResult = s.refresh();
//const usersQueryResult = userStore.refresh();
//listar usuarios

//form dialog model
const showForm = ref(false);

//closeForm triggered on: Cancel
const closeForm = () => {
  resetFormData();
  showForm.value = false;
  s.refresh();
};

// MODIFICAR (Abrir formulario con datos del objeto a modificar)
const formObj = ref({ vocals: [{}] });
const update = computed(() => (formObj.value.id ? true : false));

//openForm is triggered on emits: Nueva entrada, Modificar
const openForm = (obj) => {
  //Object.assign(formObj.value, obj ?? { vocals: [{}] });
  formObj.value = obj ?? { vocals: [{}] };
  if (formObj.value.vocals.length == 0) formObj.value.vocals.push({});
  userStore.refresh();
  commissionStore.refresh();
  showForm.value = true;
};

//SUBMIT
function submitFormData() {
  console.info("submitFormData", formObj.value);
  console.info("denuncia enviada", formObj.value);
  console.info(
    "formObj.value.id && formObj.value.commission != null",
    formObj.value.id && formObj.value.commission != null
  );
  if (formObj.value.id && formObj.value.commission != null) {
    console.log(`setting status to ${s.statuses.active}`);
    formObj.value.status = s.statuses.active;
  }

  formObj.value.status = s.statuses.active;
  s.save(formObj.value);
  closeForm();
}

function toggleArchive() {
  confirm(() => {
    formObj.value.status =
      formObj.value.status == s.statuses.archived
        ? s.statuses.pending
        : s.statuses.archived;
    s.save(formObj.value);
    closeForm();
  });
}

function archive() {
  s.archive(formObj.value);
  closeForm();
}
//RESET
function resetFormData() {
  formObj.value = {};
}
const isArchived = computed(() => formObj.value.status == s.statuses.archived);
const isPending = computed(() => formObj.value.status == s.statuses.pending);
const isActive = computed(() => formObj.value.status == s.statuses.active);
const isClosed = computed(() => formObj.value.status == s.statuses.closed);

const userIsAccuser = computed(
  () => formObj.value.accuser?.id == auth.loggedUser.id
);
const userIsPresident = computed(
  () => formObj.value.commission?.id == auth.loggedUser.id
);
const userIsInfractor = computed(() =>
  formObj.value.infractors?.some(
    (infractor) => infractor.id == auth.loggedUser.id
  )
);
//Campos de la tabla
const columns = ref([
  /* {name: "acusados",    required: true,    label: "Estudiantes implicados",    align: "left",    field: "acusados",    sortable: true,},*/

  {
    name: "subject",
    required: true,
    label: "Asunto",
    align: "left",
    field: "subject",
    sortable: true,
  },
  {
    name: "accuser",
    required: true,
    label: "Denunciante",
    align: "left",
    field: (d) => d.accuser.name,
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
  {
    name: "status",
    required: true,
    label: "Estado",
    align: "left",
    field: "status",
    sortable: true,
  },
]);
</script>
