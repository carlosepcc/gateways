import { computed } from "vue";

// RESOLUCIÓN No 240 /07  Reglamento disciplinario para los estudiantes de la educación superior
const res = {
  atenuantes: [
    {
      value: "a",
      label:
        "Haber mantenido una buena actitud ante el estudio desde el inicio de su especialidad hasta el momento de cometer la falta",
    },
    {
      value: "b",
      label:
        "Haberse declarado autor del hecho cometido antes de que se produzca la denunciation correspondiente",
    },
    {
      value: "c",
      label:
        "Reconocer su responsabilidad en la primera comparecencia ante la ComisiónDisciplinaria",
    },
    {
      value: "d",
      label:
        "Adoptar una actitud autocrítica y consecuente ante la falta cometida",
    },
    {
      value: "e",
      label:
        "Contribuir al total esclarecimiento de los hechos por todos los medios a su alcance",
    },
  ],
  agravantes: [
    {
      value: "a",
      label:
        "Haber mantenido una mala actitud en relación con el estudio antes de la comisión de la falta. En este sentido se tomarán como criterios principales los que corresponden al colectivo estudiantil y al profesor guía",
    },
    {
      value: "b",
      label: "Ser reincidente",
    },
  ],
  qualificationLabels: ["Muy Grave", "Grave", "Menos Grave"],
  faults: [
    {
      value: "5a",
      label:
        "Mantener una actitud o cometer un acto manifiestamente contrario a nuestro proceso revolucionario",
    },
    {
      value: "5b",
      label:
        "Mantener una actitud o cometer un acto manifiestamente contrario a nuestro proceso revolucionario",
    },
    {
      value: "5c",
      label:
        "Mantener una actitud o cometer un acto manifiestamente contrario a nuestro proceso revolucionario",
    },
    {
      value: "5d",
      label:
        "Mantener una actitud o cometer un acto manifiestamente contrario a nuestro proceso revolucionario",
    },
  ],
  sanctions: [
    {
      label: "Expulsión de la Educación Superior",
      value: "a1",
    },
    {
      label: "Separación indefinida de la Educación Superior",
      value: "a2",
    },
    {
      label: "Separación de 3 a 5 cursos de la Educación Superior",
      value: "a3",
    },
    {
      label: "Separación hasta tres cursos de la educación superior",
      value: "b1",
    },
    {
      label:
        "Pérdida de sus derechos como becario por un semestre y hasta dos cursos",
      value: "b2",
    },
    {
      label: "Separación por uno o dos cursos de la educación superior",
      value: "c1",
    },
    {
      label: "Amonestación pública ante el colectivo estudiantil",
      value: "c2",
    },
    {
      label: "Pérdida de sus derechos como becario de uno a seis meses",
      value: "c3",
    },
    {
      label:
        "Ofrecer una satisfacción al estudiante, trabajador, persona o colectivo que haya ofendido",
      value: "c4",
    },
    {
      label:
        "Reparar cuando ello sea posible, en el plazo perentorio que se le fije, el daño ocasionado",
      value: "c5",
    },
  ],
};

//TODO export const verySeriousSanctions = computed(() => {
//   let sanctions = [];
//   res.sanctions.map(() => {
//     sanctions.push()
//   });
//   return sanctions;
// });

export function incisoToDescription(article = 3, inciso = "a") {
  return "Descripción del inciso.  (ToDo)"; //TODO
}
export default res;
