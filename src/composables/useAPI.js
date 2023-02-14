import { Dialog, Notify, QSpinnerGears } from "quasar";
import state, { usersArr } from "./useState";
import { api } from "boot/axios";
import route from "src/router";
const Router = route();
export const urls = {
  gateway: "gateway",
  login: "login",
  user: "user",
};
export const goToIndexJs = () => {
  Router.replace("/");
};

// OLD FUNCTIONS
{
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)
  /*
const listar = (list = usersArr, url = urls.user) => {
  let noti = Notify.create({
    type: "ongoing",
    message: `Accediendo al listado ${url}`,
    spinner: QSpinnerGears,
    actions: [{ label: "Ocultar", color: "white" }],
  });

  api
    .get(url)
    .then((response) => {
      noti({ timeout: 100 });
      // handle success
      console.log("antes", list.value);
      // list.value = [{"id":1,"descripcion":"string","acusado":"admin","fecha":"2022-05-07","procesada":false,"casoList":[],"denunciante":"admin"}];
      list.value = response.data;
      console.log("despues list.value: ", list.value);
    })
    .catch((error) => {
      // handle error
      console.log("🚀useAPI.js listar error: ", error);
      notifyError(
        error,
        {
          message: `Carga fallida de ${url}. ${error.response.data.mensaje}`,
        },
        noti
      );
    });
};

// Pedir registro de nuevo objeto o la modificación de uno existente en la base de datos
export const guardar = (
  object,
  refArr,
  url = "/usuario",
  update = object.id !== undefined
) => {
  console.log("🚀 useAPI guardar object ", object);
  console.log("🚀 useAPI guardar Actualizando? ", update);
  let noti = Notify.create({
    type: "ongoing",
    message: `Guardando. ${url}`,
    spinner: QSpinnerGears,
    actions: [{ label: "Ocultar", color: "white" }],
  });

  api({
    method: update ? "post" : "put",
    url: url,
    data: object,
    headers: {
      "Content-Type": object.file ? "multipart/form-data" : "application/json",
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
      listar(refArr, url); //TODO: Eliminar condicion una vez que se unifique la url
    })
    .catch((error) => {
      console.log("🚀 ~ file: useAPI.js ~ line 189 ~ guardar ~ error", error);
      notifyError(error, noti, "Guardado fallido");
    });
};

// Pedir la eliminación de objetos en la base de datos
export const eliminar = (selectedRowsRef = null, list, url = "/usuario") => {
  console.log("Eliminar");
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
        message: `Eliminando ${selectedRowsRef.value.length} entrada${
          selectedRowsRef.value.length === 1 ? "." : "s."
        } ${url}`,
        spinner: QSpinnerGears,
        actions: [{ label: "Ocultar", color: "white" }],
      });

      //CREATE an idsArray from the objects array
      // /* let idsUrl = url + "/";
      // objArr.forEach((obj) => idsUrl.push(`${obj.id},`));
      // idsUrl.pop();
      let idsArr = [];
      selectedRowsRef.value.forEach((obj) => idsArr.push(obj.id)); //Se llena el arreglo de ids con los ids de los objetos del arreglo de objetos
      //REQUEST TO SERVER
      api({
        method: "delete",
        url: url,
        data: { ids: idsArr },
      })
        .then((response) => {
          // handle success
          selectedRowsRef.value = []; //Desceleccionar las filas si se completó la petición con éxito
          listar(list, url);
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
          console.log(
            "🚀 ~ file: useAPI.js ~ line 189 ~ guardar ~ error",
            error
          );
          notifyError(
            error,
            noti,
            (heading = `Eliminación fallida de ${url.slice(0, 1)}`)
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
};


export default listar;
*/
}
// CREA UNA NOTIFICACION VISUAL DE ERRORES
export const notifyError = (
  error,
  noti,
  heading = "Acción fallida",
  notiConfig
) => {
  notiConfig = {
    ...{
      type: "negative",
      spinner: null,
      icon: "report_problem",
      actions: [{ label: "OK", color: "white" }],

      message: `${heading}. ${error.message}.`,
    },
    ...notiConfig,
  };

  // handle error
  if (error.response) {
    let serverMessage = error.response.data.mensaje ?? null; //Mensaje de error enviado manualmente
    let errorMessage, userErrorMessage;
    errorMessage = userErrorMessage = error.response.data.message;
    console.log(errorMessage, userErrorMessage);
    let exception = error.response.data.exception;
    switch (errorMessage) {
      case "Bad Credentials":
        userErrorMessage = "Contraseña incorrecta";
        break;
      case "No value present":
        userErrorMessage = "Usuario incorrecto";
      default:
        break;
    }

    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(
      "The request was made and the server responded with a status code that falls out of the range of 2xx. ERROR.RESPONSE: ",
      error.response
    );

    notiConfig.message = `${heading}. ${userErrorMessage}.`;

    noti(notiConfig);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(
      "The request was made but no response was received. ERROR.REQUEST: ",
      error.request
    );
  } else {
    console.log(
      "Something happened in setting up the request that triggered an Error ",
      error
    );

    notiConfig.message = `${heading}. ${error.message ?? ""}.`;
    noti(notiConfig);
  }
};
