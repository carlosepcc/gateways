import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
import generatePdf from "src/composables/usePrint";
export const useResolutionStore = defineStore("resolution", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.resolution;
  const array = ref([]);

  //FUNCTIONS ACTIONS
  // LISTAR (Actualizar Arreglos en el cliente con datos del servidor)

  function refresh() {
    console.log("Refreshing resoluciones list");
    apiStore.read(url, array);
  }
  function save(objectToSave, isUpdate = objectToSave.id) {
    return apiStore.save(objectToSave, url, isUpdate, array);
  }
  function del(itemsToDelete = []) {
    return apiStore.del(itemsToDelete, url, array);
  }

  function print(r) {
    const tableBody = computed(() => {
      let table = [
        [
          { text: "No. Comisión", style: "tableHeader", alignment: "center" },
          { text: "Presidente", style: "tableHeader", alignment: "center" },
          { text: "Secretario", style: "tableHeader", alignment: "center" },
        ],
      ];
      r.commissions.forEach((v, index) =>
        table.push([
          { text: index + 1, alignment: "center" },
          v.president.name,
          v.secretary.name,
        ])
      );
      return table;
    });
    let documentDefinition = {
      info: {
        title: `Resolución decanal ${r.number}`,
        author: r.resolutor?.name,
        subject:
          "Resolución decanal para las comisiones disciplinarias que actuarán durante el curso académico",
        keywords: "comisiones, disciplinaria, resolución, decanal",
        creator:
          "Sistema de Gestión para el Proceso de Comisión Disciplinaria de la Facultad 4 (CDIS)",
      },

      content: [
        {
          text: `RESOLUCIÓN No. ${r.number}\n\n`,
          style: "header",
          alignment: "center",
        },
        {
          text: `POR CUANTO: Por la Resolución No. 99 de fecha 14 de agosto del  2002 del Ministro de la Informática y las Comunicaciones, se creó la Unidad Presupuestada Universidad Informática adscrita al Ministerio de la Informática y las Comunicaciones.

POR CUANTO: Por el Acuerdo número 7317 del Comité Ejecutivo del Consejo de Ministro, dictado con fecha 19 de diciembre de 2012, se adscribió la Universidad de las Ciencias Informáticas al Ministerio de Educación Superior.

POR CUANTO: Por Resolución Rectoral, se faculta a quien resuelve, ${r.resolutor.scientificCategory}. ${r.resolutor.name} para que se encargue de dirigir la Facultad No. 4 con todas las atribuciones y derechos correspondientes al cargo de Decano.

POR CUANTO: El Reglamento Disciplinario para los estudiantes de la UCI en su artículo 15 establece que el Decano designa a los miembros de las Comisiones Disciplinarias.

POR TANTO: En uso de las facultades que me están conferidas`,
        },
        {
          text: "\nRESUELVO\n",
          style: "header",
          alignment: "center",
        },
        `\nPRIMERO: Designar como integrantes de las Comisión Disciplinarias de la Facultad 4, a los siguientes compañeros:\n\n`,
        {
          color: "#444",
          table: {
            widths: ["auto", "auto", "auto"],
            body: tableBody.value,
          },
        },
        `\nSEGUNDO: Notifíquese a los interesados y comuníquese a quien corresponda.`,
        `\nDado en la Habana a los ${new Date().getDay()} días del mes ${new Date().getMonth()} del año ${new Date().getFullYear()}.
“Año ${new Date().getFullYear() - 1958} de la Revolución”`,
        `\n________________________________
${r.resolutor.scientificCategory}. ${r.resolutor.name}`,
      ],
    };
    console.info("The user wants to print: ", r);
    generatePdf(documentDefinition);
  }

  return {
    array,
    url,
    refresh,
    save,
    del,
    print,
  };
});
