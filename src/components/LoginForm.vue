<template lang="pug">
q-card.q-pa-md.shadow-1.hide-scrollbar.rounded-borders(style='max-width: 400px')
  q-card-section.text-h7.text-uppercase.text-weight-light Inicie sesión
  q-separator
  q-card-section
    q-form.q-gutter-md(@submit='onSubmit' @reset='onReset' ref='formulario')
      q-input(autofocus tabindex='1' clearable filled :dense='state.dense'
      v-model='loginObject.username'
      label='Usuario'
      lazy-rules :rules=`[
        (val) => (val && val.length > 0) || 'Este campo no puede estar vacío',
]`)
      q-input(tabindex='2' filled :dense='state.dense' :type='showPassword ? "text" : "password"' v-model='loginObject.password' label='Contraseña' lazy-rules :rules=`[
        (val) => (val !== null && val !== '') || 'Este campo no puede estar vacío',
]`)
          template(v-slot:append)
            q-icon.cursor-pointer(:name='showPassword ? "r_visibility" : "r_visibility_off"' @click='showPassword = !showPassword')
      div
        q-btn-group.full-width.q-mt-md(push spread)
          q-btn.full-width(label='Entrar' push no-caps type='submit' color='primary' tabindex='3')

</template>

<script setup lang="ts">
import { ref } from "vue";
import state from "src/composables/useState";
import { useAuthStore } from "src/stores/authStore.js";
const auth = useAuthStore();
const formulario = ref();
const showPassword = ref(false);
const loginObject = ref({ username: "", password: "" });

//SUBMIT
const onSubmit = () => {
  auth.login(loginObject.value);
  //onReset();
  //! TODO: No reestablecer cuando da error
};

//RESET FORM
const onReset = () => {
  //Reset to base values
  loginObject.value = { username: "", password: "" };
  //Clear validation error messages.
  formulario.value.resetValidation();
};
</script>
