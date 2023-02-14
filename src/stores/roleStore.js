import { defineStore } from "pinia";
import roles from "src/composables/useRoles";

export const useRoleStore = defineStore("role", () => {
  return {
    roles: roles,
  };
});
