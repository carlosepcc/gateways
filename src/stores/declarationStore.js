import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
export const useDeclarationStore = defineStore("declaration", () => {
  const declaration = {
    description: String,
  };
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.declaration;
  const array = ref([]);

  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)

  function refresh() {
    console.log("Refreshing declarations list");
    apiStore.read(url, array);
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
