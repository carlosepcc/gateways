<template>
  <q-dialog persistent position="top" class="overflow-hidden">
    <q-card>
      <q-card-section
        class="card-header opaque row items-center q-py-xs text-h7 text-uppercase text-weight-light"
      >
        <slot name="header">
          {{ props.isModifying ? "Modificar" : "Registrar" }}
          {{ props.formTitle }}
        </slot>
        <q-space />
        <q-btn
          icon="close"
          :size="state.dense ? 'sm' : 'md'"
          flat
          round
          title="Cerrar formulario"
          @click="$emit('closeForm')"
        />
      </q-card-section>
      <q-separator />
      <q-card-section class="card-body">
        <q-form
          ref="formulario"
          id="formularioBase"
          @submit="onSubmit"
          @reset="resetFormFields"
        >
          <div class="col q-gutter-md">
            <slot></slot>
          </div>
        </q-form>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-none card-footer">
        <slot name="footer">
          <q-btn-group flat spread>
            <q-btn
              flat
              form="formularioBase"
              type="reset"
              :size="state.dense ? 'sm' : 'md'"
              label="Limpiar"
              icon="r_backspace"
              no-caps
            />
            <q-btn
              flat
              form="formularioBase"
              type="submit"
              :size="state.dense ? 'sm' : 'md'"
              color="primary"
              label="Guardar"
              no-caps
              icon="r_save"
            />
          </q-btn-group>
        </slot>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref } from "vue";
import state from "src/composables/useState.js";

//DOM
const formulario = ref();

//COMPONENT
const props = defineProps({ formTitle: String, isModifying: Boolean });
const emit = defineEmits(["closeForm", "submit", "reset"]);

//SUBMIT
function onSubmit() {
  emit("submit");
  resetFormFields();
}

//RESET FORM
function resetFormFields() {
  //Reset fields
  emit("reset");
  formulario.value.resetValidation();
}
</script>
<style lang="sass">
.q-dialog
  .q-card
    position: relative

.q-dialog
  overflow: hidden
  max-width: 200px
  .q-card
    backdrop-filter: blur(64px)
    width: 100%
    max-width: 500px
    overflow: hidden
    .card-body
      max-height: 100%
      overflow: auto
      padding-block-end:120px
  .card-footer,.q-card-header
    backdrop-filter: inherit
    background: inherit
    position: absolute
    width: 100%
  .card-footer
    bottom:0
    .q-btn
      padding: 16px
  .card-header
    background: #fff1 !important
    position:fixed
    top:0
</style>
