import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
import generatePdf from "src/composables/usePrint";
export const useConclusionStore = defineStore("conclusion", () => {
  //COMPOSITING STORES
  const apiStore = useApiStore();
  const url = urls.conclusion;
  const array = ref([]);
  const arrayUi = computed(() => {
    array.value.forEach((item) => {
      item.atenuantes = item.atenuantes?.split("");
      item.agravantes = item.agravantes?.split("");
    });
    return array.value;
  });
  //Functions

  function refresh() {
    console.log("Refreshing conclusions list");
    apiStore.read(url, array);
  }
  function update(obj) {
    let dto = obj;
    /*Sructure {
      id: 0,
      fault: "string",
      date: "2022-11-29",
      qualification: "string",
      sanction: "string",
      sanctionInciso: "string",
      atenuantes: "string",
      agravantes: "string",
      prescription: 0,
      recordRevision: "string",
    };*/
    let atenuantesString = "";
    let agravantesString = "";

    dto.atenuantes.forEach((v) => (atenuantesString += v));
    dto.agravantes.forEach((v) => (agravantesString += v));
    dto.atenuantes = atenuantesString;
    dto.agravantes = agravantesString;
    return apiStore.save(obj, url, true, array);
  }

  // Print

  function print(obj) {
    let c = {
      id: 0,
      fault: "string",
      date: "2022-11-29",
      qualification: "string",
      sanction: "string",
      sanctionInciso: "string",
      atenuantes: "string",
      agravantes: "string",
      prescription: 0,
      recordRevision: "string",
      infractor: {
        id: 0,
        name: "string",
        username: "string",
        position: "string",
        gender: "string",
        scientificCategory: "string",
        roles: ["ADMIN"],
      },
      denunciation: {
        id: 0,
        subject: "string",
        description: "string",
        date: "string",
        openDate: "2022-11-29",
        closeDate: "2022-11-29",
        endDate: "2022-11-29",
        status: "string",
        accuser: {
          id: 0,
          name: "string",
          username: "string",
          position: "string",
          gender: "string",
          scientificCategory: "string",
          roles: ["ADMIN"],
        },
        vocals: [
          {
            id: 0,
            role: "string",
            user: {
              id: 0,
              name: "string",
              username: "string",
              position: "string",
              gender: "string",
              scientificCategory: "string",
              roles: ["ADMIN"],
            },
          },
        ],
      },
      commission: {
        id: 0,
        president: {
          id: 0,
          name: "string",
          username: "string",
          position: "string",
          gender: "string",
          scientificCategory: "string",
          roles: ["ADMIN"],
        },
        secretary: {
          id: 0,
          name: "string",
          username: "string",
          position: "string",
          gender: "string",
          scientificCategory: "string",
          roles: ["ADMIN"],
        },
        blocked: true,
        busy: true,
      },
    };
    c = obj;
    //TODO: real data on export
    let documentDefinition = {
      info: {
        title: "Conclusiones de la Comisión Disciplinaria",
        author: "Ana del Carmen Sosa",
        subject:
          "Conclusiones de la comisión disciplinaria para el caso disciplinario",
        keywords: "caso disciplinario",
        creator:
          "Sistema de Gestión del Proceso de Comisión Disciplinaria en la Facultad 4",
      },
      content: [
        {
          text: "Conclusiones de la Comisión Disciplinaria\n",
          style: "header",
          alignment: "center",
        },
        {
          text: "Fecha: 22-11-30",
        },
        `\nLa comisión nombrada al efecto por el Decano de la Facultad 4, integrada por el profesor Ana del Carmen Sosa como presidente, el profesor José Hernández de la Concepción como secretario y el estudiante Armando Paredes del Castillo como vocal de la FEU, se reúne para iniciar la investigación y análisis de la denuncia de la falta cometida por el estudiante ${
          c.infractor.name
        } del grupo ${c.infractor.area ?? "4301"}, consistente en la falta: ${
          c.fault ?? "Tentativa de fraude"
        } . En la investigación realizada se revisaron las siguientes evidencias:\n\n`,
        {
          ol: [
            "Denuncia realizada: El estudiante implicado le faltó el respeto a la profesora Frida Khalo durante la clase",
            "Revisión del expediente académico, donde se resume lo siguiente: El estudiante ha sido sancionado anteriormente. Resultados docentes buenos. Su evaluación de integralidad es de R.",
            "Declaración del implicado: La Comisión Disciplinaria se entrevistó con el estudiante, el cual, en su comparecencia, explica lo sucedido en el aula y anteriormente con la profesora y plantea que se siente mal por lo ocurrido y que querría pedir disculpa a la profesora.",
            "Opinión del Profesor Guía: Ha incidido varias veces(...)",
          ],
        },
        `\nTeniendo en cuenta todos los elementos referidos en este análisis y siguiendo todos los pasos establecidos en la Resolución No. 240/07, Reglamento Disciplinario para los estudiantes de la Educación Superior, la comisión encuentra probada la responsabilidad del estudiante ante la indisciplina: ${
          c.fault ?? "Tentativa de fraude"
        }.\n\n    La comisión califica la falta como Grave a partir de lo establecido en el Capítulo III, Artículo 7, Inciso a, de la Resolución No. 240/07, consistente en:\n    a) Descripción del inciso.  (ToDo).\n\n    Según los contenidos que aparecen en el Capítulo IX, Artículo 34 y atendiendo a su trayectoria como estudiante de nuestro centro se le reconoce lo siguiente:\n\n`,
        {
          text: "Atenuantes:",
          bold: true,
        },
        {
          ul: [
            "a) Haber, mantenido una buena actitud ante el estudio desde el inicio de su especialidad hasta el momento de cometer la falta",
          ],
        },
        {
          text: "Agravantes:",
          bold: true,
        },
        {
          ul: ["b) Ser reincidente"],
        },
        {
          text: `\nTeniendo en cuenta lo aportado por las declaraciones y las verificaciones realizadas y después de analizar las atenuantes y agravantes, la comisión acuerda proponer que al estudiante ${
            c.infractor.name
          } del grupo ${
            c.infractor.area ?? "4301"
          }, le sea impuesta como medida disciplinaria Ejemplo de inciso. Esta medida está dictada en el Inciso c1, Artículo 35, Capítulo X (De las medidas disciplinarias imponibles) del Reglamento Disciplinario para los estudiantes de la Educación Superior.\n\n    Por lo expuesto anteriormente, informamos que el acta donde comparece la medida disciplinaria como, luego de ser aprobadas por la instancia correspondiente e informadas al estudiante, se mantendrá en el expediente académico de dicho estudiante, según lo establecido en el Capítulo X, Artículo 37 y preescribirá en el término de 3 cursos académicos, según lo establecido en el Capítulo IV, Artículo 14.\n\n    Dado en La Habana ___________________________________.\n\n    \n\n    Presidente _____________________________\n\n    Secretario _____________________________\n\n    FEU           _____________________________\n`,
        },
      ],
    };
    generatePdf(documentDefinition);
    console.info("The user wants to print: ", c);
  }
  return {
    array,
    url,
    refresh,
    update,
    print,
    arrayUi,
  };
});
