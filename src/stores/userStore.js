import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { useRoleStore } from "./roleStore";
import { positions } from "src/composables/useRoles";
export const useUserStore = defineStore("user", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const roleStore = useRoleStore();
  const url = apiStore.urls.user;
  const array = ref([]);
  //GETTERS
  const arrayUi = computed(() => {
    return array;
    // .value.map((v) => {
    //   return {
    //     username: v.user,
    //     name: v.name,
    //     genre: v.genre,
    //     position: v.position,
    //     scientificCategory: v.scientificCategory,
    //     role: v.roles[1],
    //     roles: v.roles,
    //     roleThumbnail: v.roles[1][0],
    //   };
    // });
  });
  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)
  function read() {
    return apiStore.read(url); //TODO waiting for backend to be fixed
  }
  function refresh() {
    console.log("Refreshing users list");
    apiStore.read(url, array);
  }
  function save(objectToSave, isUpdate = objectToSave.id) {
    apiStore.save(objectToSave, url, isUpdate);
  }
  function update(objectToUpdate) {
    apiStore.save(objectToUpdate, url, true);
  }
  function create(objectToCreate) {
    apiStore.save(objectToCreate, url, false);
  }
  function del(itemsToDelete) {
    apiStore.del(itemsToDelete, url);
  }
  function getUsersByRole(role) {
    return array.value.filter((user) => user.roles.includes(role));
  }
  function getUsersByPosition(position) {
    return array.value.filter((user) => user.position === position);
  }
  function getUsersByScientificCategory(scientificCategory) {
    return array.value.filter(
      (user) => user.scientificCategory === scientificCategory
    );
  }
  function getRolesByUser(user) {
    return user.roles;
  }

  const teachers = computed(() => {
    return getUsersByPosition(positions.pro);
  });
  const students = computed(() => {
    return getUsersByPosition(positions.est);
  });
  const workers = computed(() => {
    return getUsersByPosition(positions.tra);
  });

  const scientificCategories = ref(["Dr.C", "M.Sc", "Ing", "Lic"]);
  const genders = ref(["M", "F"]);

  return {
    positions,
    genders,
    scientificCategories,
    arrayUi,
    array,
    url,
    read,
    refresh,
    save,
    del,
    update,
    create,
    getUsersByRole,
    getUsersByPosition,
    getUsersByScientificCategory,
    getRolesByUser,
    teachers,
    students,
    workers,
  };
});
