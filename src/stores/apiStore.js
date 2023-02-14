import { defineStore } from "pinia";
import { Dialog, Notify, QSpinnerGears } from "quasar";
import { useRouter } from "vue-router";
import { api } from "boot/axios";
import { useAuthStore } from "src/stores/authStore.js";
import { urls } from "src/composables/useAPI";
import { notifyError } from "src/composables/useAPI";

export const useApiStore = defineStore("api", () => {
  //COMPOSITING STORES
  const router = useRouter();
  const auth = useAuthStore();

  //STATE
  const offlineApiTesting = false;

  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)
  function read(url = urls.user, refArray) {
    let responseData = [];
    let noti = Notify.create({
      timeout: "30000",
      type: "ongoing",
      message: `Accediendo al listado ${url}`,
      spinner: QSpinnerGears,
      actions: [{ label: "Ocultar", color: "white" }],
    });
    console.log(`Prepared to access to api endpoint: ${url}`);
    api
      .get(url)
      .then((response) => {
        noti({
          timeout: 200,
          type: "positive",
          spinner: null,
          message: `Se obtuvo el listado ${url}`,
          actions: [{ label: "OK", color: "white" }],
        });
        // handle success
        console.log(`Api endpoint ${url} accessed. Response: `, response);

        responseData = response.data;

        if (refArray) refArray.value = response.data;

        console.info("responseData", responseData);
      })
      .catch((error) => {
        // handle error
        console.log("There was an error accessing the api endpoint: ", error);
        notifyError(
          error,
          {
            message: `Carga fallida de ${url}. ${error.message}`,
          },
          noti
        );
      });
    return responseData;
  }

  function save(objectToSave, url, isUpdate = objectToSave.id, refArray) {
    console.info("save function triggered objectToSave: ", objectToSave);
    let noti = Notify.create({
      type: "ongoing",
      message: `Guardando. ${url}`,
      spinner: QSpinnerGears,
      actions: [{ label: "Ocultar", color: "white" }],
    });

    api({
      method: isUpdate ? "put" : "post",
      url: url,
      data: objectToSave,
      headers: {
        "Content-Type": objectToSave.file
          ? "multipart/form-data"
          : "application/json",
      },
    })
      .then((response) => {
        // handle success
        noti({
          type: "positive",
          spinner: null,
          message: "Acción realizada con éxito.",
          actions: [{ label: "OK", color: "white" }],
        });
        read(url, refArray);
        return response.data;
      })
      .catch((error) => {
        console.log("🚀 ~ file: useAPI.js ~ line 189 ~ guardar ~ error", error);
        notifyError(error, noti, "Guardado fallido");
      });
  }

  function del(itemsToDelete, url = urls.user, refArray) {
    console.info(
      `del function triggered for ${url}, items to delete: `,
      itemsToDelete
    );

    Dialog.create({
      title: "Confirme la eliminación",
      message: "La eliminación será permanente.",
      persistent: true,
      color: "negative",
      ok: { label: "Eliminar", noCaps: true, flat: true },
      cancel: { color: "primary", noCaps: true, flat: true },
    })
      .onOk(() => {
        let noti = Notify.create({
          type: "ongoing",
          position: "bottom",
          message: `Eliminando ${itemsToDelete.value.length} entrada${
            itemsToDelete.value.length === 1 ? "." : "s."
          } ${url}`,
          spinner: QSpinnerGears,
          actions: [{ label: "Ocultar", color: "white" }],
        });

        //CREATE an idsArray from the objects array
        // /* let idsUrl = url + "/";
        // objArr.forEach((obj) => idsUrl.push(`${obj.id},`));
        // idsUrl.pop(); */
        let idsArr = [];
        itemsToDelete.value.forEach((obj) => idsArr.push(obj.id)); //Se llena el arreglo de ids con los ids de los objetos del arreglo de objetos
        itemsToDelete.value = [];
        //REQUEST TO SERVER
        api({
          method: "delete",
          url: url,
          data: idsArr,
        })
          .then((response) => {
            // handle success
            itemsToDelete = []; //Desceleccionar las filas si se completó la petición con éxito
            read(url, refArray);
            noti({
              type: "positive",
              spinner: null,
              // message: `Eliminación exitosa de (${idsArr.length}) entrada${idsArr.length == 1 ? "." : "s."  })`,
              message: "Acción realizada con éxito.",
              timeout: 1000,
              actions: [{ label: "OK", color: "white" }],
            });
          })
          .catch((error) => {
            console.log("Error deleting: ", error);
            notifyError(
              error,
              noti,
              (heading = `Eliminación fallida de ${url}`)
            );
          })
          .then(() => {
            // always
            return idsArr;
          });
      })
      .onCancel(() => {
        return "Canceled by user";
      });
  }
  return {
    offlineApiTesting,
    urls,
    read,
    save,
    del,
  };
});
