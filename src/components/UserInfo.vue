<script setup>
import DarkModeControl from "./DarkModeControl.vue";
import state from "src/composables/useState";
import { useAuthStore } from "src/stores/authStore.js";
const auth = useAuthStore();
let u = auth.loggedUserUi;
</script>
<template>
  <q-item
    v-if="auth.isLogged"
    clickable
    v-ripple
    class="text-white q-py-none absolute-right"
    :title="`Usuario: ${u.username}. Nombre: ${u.name}. Rol: ${
      u.role
    }. Cargo: ${u.position ?? 'Ninguno'}`"
  >
    <!--    INFORMACIÓN DEL USUARIO-->
    <q-item-section>
      <q-item-label class="text-yellow-1 text-bold">
        <span class>
          {{ u.username }}
        </span>
      </q-item-label>
      <q-item-label class="text-orange-1 text-bold" caption>
        {{ u.position && u.position != "" ? u.position : u.role }}
      </q-item-label>
    </q-item-section>
    <!--    AVATAR-->
    <q-item-section side>
      <q-avatar
        size="xl"
        :color="$q.dark.isActive ? 'amber-8' : 'amber-1'"
        :text-color="$q.dark.isActive ? 'q-yellow-1' : 'primary'"
        class="text-weight-bolder text-uppercase"
      >
        <img v-if="u.img" :src="u.img" :alt="u.thumb" />
        <span v-else v-html="u.thumbnail"></span>

        <q-badge
          style="backdrop-filter: blur(5px); background: #c826 !important"
          :title="u.role"
          floating
          rounded
          color="transparent"
          class="text-weight-bold text-yellow-1"
          >{{ u.roleThumbnail }}</q-badge
        >
      </q-avatar>
    </q-item-section>

    <q-menu fit :offset="[-10, 10]">
      <q-card class="column q-pa-md" bordered>
        <q-card-section class="row items-center">
          <q-btn
            icon="r_logout"
            color="negative"
            label="Cerrar sesión"
            class="full-width"
            no-caps
            flat
            v-close-popup
            @click="auth.logout()"
          />
        </q-card-section>
        <q-separator inset class="q-ma-md" />
        <div class="column">
          <q-btn
            flat
            to="/settings"
            label="Ajustes"
            class="text-weight-light"
          />
          <q-toggle
            v-model="state.dense"
            label="Interfaz densa"
            class="q-pb-md"
          />
          <DarkModeControl />
        </div>
      </q-card>
    </q-menu>
  </q-item>
</template>
