import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";

export const useCommissionStore = defineStore("commission", () => {
  // Compositing stores
  const apiStore = useApiStore();
  const url = urls.commission;
  const array = ref([]);

  // Action functions

  //// Refresh (Read and update state)
  function refresh() {
    console.log("Refreshing commissions list");
    return apiStore.read(url, array);
  }
  const freeCommissions = computed(() => {
    return array.value.filter((v) => !v.busy);
  });

  function getById(id) {
    return array.value?.find((v) => v.id === id);
  }

  return {
    array,
    url,
    refresh,
    freeCommissions,
    getById,
  };
});
