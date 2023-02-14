<script setup>
import DrawerItem from "components/DrawerItem.vue";
import { ref } from "vue";
import { useAuthStore } from "src/stores/authStore";
import r from "src/composables/useRoles";
const auth = useAuthStore();
// DRAWER
const miniState = ref(true);

const drawerItems = [
  { title: "Home", icon: "home", alt: "n", to: "/" },

  {
    title: "Gateways",
    icon: "r_cable",
    to: "gateway",
    for: [r.adm, r.user, r.dec, r.su],
  },
  { title: "Settings", icon: "settings", to: "settings", separate: true },
  { title: "Help", icon: "help", to: "help" },
  { title: "About GATEW", icon: "info", to: "about" },
];
</script>

<template>
  <!--MENU LATERAL (DRAWER "gaveta") -->
  <q-drawer
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    mini-to-overlay
    :breakpoint="500"
    :elevated="!miniState"
    side="left"
  >
    <q-scroll-area class="fit">
      <q-list>
        <template v-for="drawerItem in drawerItems" :key="drawerItem.title">
          <transition-group
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <DrawerItem
              v-bind="drawerItem"
              v-if="
                drawerItem.for === undefined ||
                auth.offlineTesting ||
                auth.loggedUserUi?.role === r.su ||
                drawerItem.for.some((role) => role == auth.loggedUserUi?.role)
              "
            />
            <!-- TODO si el item del drawer no tiene for, o el arreglo de permisos del usuario autenticado tiene algún permiso en común con el arreglo fors del item, se muestra, de lo contrario no. -->
          </transition-group>
        </template>
      </q-list>
    </q-scroll-area>
  </q-drawer>
</template>
