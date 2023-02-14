import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
export const usePermisoStore = defineStore("permiso", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.permiso;
  const array = ref([]);

  //HELPERS
  function permisoArrayToUi(permisoArray) {
    return permisoArray.map((v) => {
      return { label: permisoStrToLabel(v.permiso), value: v.permiso };
    });
  }

  //def: recibe una cadena y la transforma de "ROLE_C_EJEMPLO" a "Crear ejemplo"
  function permisoStrToLabel(permisoStr) {
    let rules = [
      { s: "role", r: "" },
      { s: "_c_", r: "Crear " },
      { s: "_r_", r: "Leer " },
      { s: "_u_", r: "Actualizar " },
      { s: "_d_", r: "Eliminar " },
      { s: "_admin", r: "Administración" },
      { s: "_usuario", r: "Permiso de usuario" },
      { s: "cion", r: "ción" },
      { s: "comision", r: "comisión" },
    ];
    let permisoLabel = permisoStr.toLowerCase();
    rules.forEach((rule) => {
      permisoLabel = permisoLabel.replace(rule.s, rule.r);
    });
    return permisoLabel;
  }

  //GETTERS
  const arrayUi = computed(() => permisoArrayToUi(array.value));

  //ACTIONS
  function read() {
    return apiStore.read(url);
  }
  function refresh() {
    return apiStore.read(url, array);
  }

  return {
    permisoArrayToUi,
    permisoStrToLabel,
    arrayUi,
    array,
    read,
    refresh,
  };
});
