import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
import generatePdf from "src/composables/usePrint";
export const useGatewayStore = defineStore("gateway", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.gateway;
  const array = ref([]);

  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)

  function refresh() {
    console.log("Refreshing resoluciones list");
    //apiStore.read(url, array);
    array.value = [
      {
        name: "Gateway 1",
        serial: 12345,
        ipv4: "124.32.43.132",
        devices: [{ id: 1 }],
      },
    ];
  }
  function save(objectToSave, isUpdate = objectToSave.id) {
    return apiStore.save(objectToSave, url, isUpdate, array);
  }
  function del(itemsToDelete = []) {
    return apiStore.del(itemsToDelete, url, array);
  }

  return {
    array,
    url,
    refresh,
    save,
    del,
  };
});
