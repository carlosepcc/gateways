import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import { Dialog, Notify, QSpinnerGears } from "quasar";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useAuthStore } from "src/stores/authStore.js";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import { urls } from "src/composables/useAPI";

export const useApiStoreQ = defineStore("apiq", () => {
  //COMPOSITING STORES
  const queryClient = useQueryClient();
  const router = useRouter();
  const auth = useAuthStore();
  const url = "usuario";
  const result = useQuery([url, "read"], () => api.get(url), {
    onError: (error) => console.error(error),
    onSuccess: (data) => console.info(`Data of ${url} has been read.`, data),
  });
  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)
  function read(url = urls.value.usuario) {
    console.log(`Prepared to access to api endpoint: ${url}`);
    result.refetch;
    return result.data.data;
  }

  // function useAddTodoMutation() {
  //   return useMutation((newTodo) => axios.post("/todos", newTodo));
  // }

  // const { isLoading, isError, error, isSuccess, mutate } = useAddTodoMutation();

  // function addTodo() {
  //   mutate({ id: new Date(), title: "Do Laundry" });
  // }
  function save(objectToSave = {}, url, isUpdate = objectToSave.id) {
    console.log(`Prepared to access to api endpoint: ${url}`);
    const useSaveMutation = useMutation(
      (objToPost) => {
        api({
          method: isUpdate ? "post" : "put",
          url: url,
          data: objToPost,
          headers: {
            "Content-Type": object.file
              ? "multipart/form-data"
              : "application/json",
          },
        });
      },
      {
        onError: (error) =>
          console.error(`Item ${url} couldn't be saved.`, error),
        onSuccess: (data) => {
          console.info(`Item ${url} has been saved.`);
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [url, "read"] });
        },
      }
    );

    useSaveMutation.mutate(objectToSave);
    return useSaveMutation;
  }

  return {
    urls,
    read,
  };
});
