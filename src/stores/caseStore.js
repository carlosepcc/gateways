import { defineStore } from "pinia";
import { ref } from "vue";
import { useApiStore } from "src/stores/apiStore.js";
import { urls } from "src/composables/useAPI";
import generatePdf from "src/composables/usePrint";
import { useAuthStore } from "./authStore";

export const useCaseStore = defineStore("case", () => {
  // Compositing stores
  const apiStore = useApiStore();
  const auth = useAuthStore();
  const url = urls.denunciation;
  const array = ref([]);

  // Action functions

  //// REFRESH (Read and update state)
  function refresh() {
    console.log("Refreshing cases list");
    return apiStore.read(urls.case, array);
  }

  //// SAVE (Create or update)
  function save(objectToSave, isUpdate = objectToSave.id) {
    return apiStore.save(objectToSave, url, isUpdate, array);
  }
  function archive(object) {
    object.commission = null;
    object.status = statuses.archived;
    return apiStore.save(object, url, true, array);
  }
  function print(r) {
    console.log("The user wants to print", r);
    let documentDefinition = {
      info: {
        title: `Resolución del caso disciplinario ${r.subject}`,
        author: auth.loggedUser.name,
        subject: `Resolución que concluye y cierra el caso disciplinario ${r.subject}`,
        keywords: "caso, disciplinario, resolución, conclusión",
        creator:
          "Sistema de Gestión para el Proceso de Comisión Disciplinaria de la Facultad 4 (CDIS)",
      },
      content: [
        {
          text: `RESOLUCIÓN No. ${
            r.number ?? "4/" + new Date().getFullYear()
          }\n\n`,
          style: "header",
          alignment: "center",
        },
        `POR CUANTO: Por la Resolución No. 99 de fecha 14 de agosto del  2002 del Ministro de la Informática y las Comunicaciones, se creó la Unidad Presupuestada Universidad Informática adscripta al Ministerio de la Informática y las Comunicaciones.

POR CUANTO: Por el Acuerdo número 7317 del Comité Ejecutivo del Consejo de Ministro, dictado con fecha 19 de diciembre de 2012, se adscribió la Universidad de las Ciencias Informáticas al Ministerio de Educación Superior.

POR CUANTO: Por Resolución Rectoral No. 135/2021 con fecha 24 de mayo de 2021, se faculta al que resuelve, ${auth.loggedUser.scientificCategory}. ${auth.loggedUser.name} para que se encargue de dirigir la Facultad No.4, con todas las atribuciones y derechos correspondientes al cargo de Decano.

POR CUANTO: Se conformó la Comisión Disciplinaria, la cual abrió el expediente disciplinario al estudiante ______________________ de __________ año del grupo ________, la cual cometió la siguiente falta: Tentativa de fraude durante el primer examen parcial de Matemática I.

c) cometer fraude docente en la realización de todas las formas de evaluación del sistema vigente para la educación superior que se realice en áreas docentes, tales como., trabajo de control en clases, prueba intrasemestral o examen final o extraordinario, apropiándose indebidamente de conocimientos no adquiridos por su propio esfuerzo. De igual forma se considera la tentativa de fraude, entendiéndose por tal, la disponibilidad por el estudiante de información o material no autorizados relacionados con la materia objeto de evaluación, sin que haya llegado a utilizarlos para cometer el fraude;
POR CUANTO: La Comisión Disciplinaria se entrevistó con el profesor guía, recopilaron pruebas, y tuvo en cuenta el criterio de la FEU:
-Profesor principal en funciones: sus resultados docentes no han sido bueno; en los cortes evaluativos de las asignaturas MD, Álgebra, IP e ICI tiene evaluación de mal.
-Vicedecana de Extensión y Residencia ha tenido disposición en participar en actividades culturales pero por problemas de salud no ha podido, en la beca su comportamiento ha estado matizado por indisciplinas relacionadas con la limpieza y el orden las cuales han sido analizadas por la instructora, especialista superior y yo.
-FEU: Comenzó siendo presidenta de brigada, tenia buena asistencia y puntualidad, participación en actividades en la universidad.
Fue sustituida del cargo a petición de la brigada; porque ha presentado problemas con la asistencia al docente, las notas han decaído. Tiene muy buenas relaciones con los integrantes de la brigada.
POR CUANTO: La Comisión Disciplinaria se entrevistó con la estudiante Ailed Roxana Salgado Pichs la cual en su comparecencia ante la Comisión Disciplinaria explico lo sucedido.

POR CUANTO: La Comisión Disciplinaria calificó la falta cometida por la estudiante  Ailed Roxana Salgado Pichs, como Muy Grave en correspondencia con el Capítulo III, Artículo 4, Inciso a, expuestas en su contenido en el Capítulo III,  Artículo 5, Inciso c del Reglamento Disciplinario para los Estudiantes de la de la Educación Superior.
POR CUANTO: Asimismo, se reconoció que dentro de las Circunstancias Modificativas de la Responsabilidad, de conformidad con el capítulo IX, artículo 34 del Reglamente Disciplinario, le son reconocidas:
Atenuantes:
b) haberse declarado autor del hecho cometido antes de que se produzca la denuncia correspondiente;
c) reconocer su responsabilidad en la primera comparecencia ante la Comisión Disciplinaria;
ch) adoptar una actitud autocrítica y consecuente ante la falta cometida;
d) contribuir al total esclarecimiento de los hechos por todos los medios a su alcance.
Agravantes:
a) Haber mantenido una mala actitud en relación con el estudio antes de la comisión de la falta.
POR TANTO: En uso de las facultades que me están conferidas,
     RESUELVO:

PRIMERO: Ratificar la calificación de Falta Muy Grave, a la indisciplina cometida por la estudiante ___________________ de ____ año en la  Carrera  de ________ del Curso ____________ y en consecuencia, sancionar a la estudiante con la medida disciplinaria:
Separación por 3 curso de la Educación superior.
contenidas en el Capítulo X, Artículo 35, Inciso b1, del Reglamento Disciplinario para los Estudiantes de la de la Educación Superior.
SEGUNDO:  Notifíquese esta Resolución a la estudiante, informándole que de acuerdo al Artículo 40, Capítulo XI (De las apelaciones), del Citado Reglamento, le asiste el derecho de apelación, por conducto de quien le impuso la medida disciplinaria en un plazo de 10 días hábiles contados a partir del día siguiente al de la notificación de la Resolución.
TERCERO: Por lo expuesto anteriormente, informamos que la resolución sancionadora, luego de ser aprobada por la instancia correspondiente e informada a la estudiante, se mantendrá en el expediente académico de dicha estudiante, según lo establecido en el Capítulo X, artículo 37 y prescribirá en el término de 5 cursos académicos, según lo establecido en el Capítulo IV, artículo 14.

COMUNÍQUESE a la secretaria docente de la Facultad No. 4 y a cuantas personas naturales o jurídicas corresponda.


Dada en La Habana a los _____días de_____del ______
“Año 64 de la Revolución”




__________________________________
Decano


NOMBRE Y APELLIDOS: (estudiante)
FECHA DE NOTIFICACIÓN: _______________________

FIRMA. _____________________`,
      ],
    };
    console.info(
      "This is the document definition for pdfmake",
      documentDefinition
    );

    generatePdf(documentDefinition);
  }

  return {
    array,
    url,
    refresh,
    save,
    archive,
    print,
  };
});
