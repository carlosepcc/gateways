<template>
  <q-btn
    class="q-my-md float-right"
    color="primary"
    push
    label="Exportar conclusiones"
    icon="picture_as_pdf"
    @click="generateDocument()"
  />

  <iframe :srcdoc="documentContent">
    <p>Su navegador no soporta iframes.</p>
  </iframe>
  <pre>
    {{ documentDefinition }}
  </pre>
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs; //pdfMake virtual filesystem for use fonts
function incisoToDescription(article = 3, inciso = "a") {
  return "Descripción del inciso.  (ToDo)"; //TODO
}
const conclusion = reactive({
  falta: "Falta de respeto a la profesora Lorem Ipsum Lorem",
  fecha: "22-10-3",
  calificacionInciso: "7.a",
  medidaInciso: "35.c1",
});
//TODO obtener capitulo a partir de articulo
const cIncisoSplit = computed(() => conclusion.calificacionInciso.split("."));
const mIncisoSplit = computed(() => conclusion.medidaInciso.split("."));
const c = computed(() => {
  return {
    falta: "Falta de respeto a la profesora Frida Khalo",
    date: "22-10-3",
    denuncia: {
      description:
        "El estudiante implicado le faltó el respeto a la profesora Frida Khalo durante la clase",
    },
    calificacion: {
      article: cIncisoSplit.value[0],
      inciso: cIncisoSplit.value[1],
      text:
        cIncisoSplit.value[0] == 5
          ? "Muy Grave"
          : cIncisoSplit.value[0] == 7
          ? "Grave"
          : "Menos Grave",
    },
    medida: {
      text: "Ejemplo de inciso",
      article: mIncisoSplit.value[0],
      inciso: mIncisoSplit.value[1],
    },
    atenuantes: [
      {
        inciso: "a",
        text: "Haber, mantenido una buena actitud ante el estudio desde el inicio de su especialidad hasta el momento de cometer la falta",
      },
    ],
    agravantes: [
      {
        inciso: "b",
        text: "Ser reincidente",
      },
    ],
    prescribeEn:
      cIncisoSplit.value[0] == 5 ? 5 : cIncisoSplit.value[0] == 7 ? 3 : 2,
    implicado: {
      name: "Adalberto Pérez González",
      cargo: "estudiante",
      grupo: "4301",
    },
    declaraciones: [
      {
        title: "Declaración del implicado",
        description:
          "La Comisión Disciplinaria se entrevistó con el estudiante, el cual, en su comparecencia, explica lo sucedido en el aula y anteriormente con la profesora y plantea que se siente mal por lo ocurrido y que querría pedir disculpa a la profesora.",
      },
      {
        title: "Opinión del Profesor Guía",
        description: "Ha incidido varias veces(...)",
      },
    ],
    revisionExpediente:
      "El estudiante ha sido sancionado anteriormente. Resultados docentes buenos. Su evaluación de integralidad es de R.",
    comision: {
      integrantes: [
        { cargo: "profesor", rol: "presidente", name: "Ana del Carmen Sosa" },
        {
          cargo: "profesor",
          rol: "secretario",
          name: "José Hernández de la Concepción",
        },
        {
          cargo: "estudiante",
          rol: "vocal de la FEU",
          name: "Armando Paredes del Castillo",
        },
      ],
    },
  };
});

const integrantesHtml = computed(() => {
  let html = "";
  c.value.comision.integrantes.forEach((i, index, array) => {
    html += `el ${i.cargo} ${i.name} como ${i.rol}${
      array.length - 2 == index ? " y " : array.length - 1 == index ? "" : ", "
    }`;
  });
  return html;
});
const presidenteComision = computed(() => {
  let p = "";
  c.value.comision.integrantes.forEach((i) => {
    if (i.rol == "presidente") p = i;
  });
  return p;
});
const listaEvidenciasHTML = computed(() => {
  let html = `<li>Denuncia realizada: ${c.value.denuncia.description}</li>
  <li>Revisión del expediente académico, donde se resume lo siguiente: ${c.value.revisionExpediente}</li>`;
  c.value.declaraciones?.forEach((d) => {
    html += `<li>${d.title}: ${d.description}</li>`;
  });
  return html;
});
const listaEvidenciasPdfMake = computed(() => {
  let pdfmakeOl = [
    `Denuncia realizada: ${c.value.denuncia.description}`,
    `Revisión del expediente académico, donde se resume lo siguiente: ${c.value.revisionExpediente}`,
  ];
  c.value.declaraciones?.forEach((d) => {
    pdfmakeOl.push(`${d.title}: ${d.description}`);
  });
  return pdfmakeOl;
});

const listaAtenuantes = computed(() => {
  let html = "";
  c.value.atenuantes?.forEach((a) => {
    html += `<li>${a.inciso}) ${a.text}</li>`;
  });
  return html;
});

const listaAgravantes = computed(() => {
  let html = "";
  c.value.agravantes?.forEach((a) => {
    html += `<li>${a.inciso}) ${a.text}</li>`;
  });
  return html;
});
const listaAtenuantesPdfMake = computed(() => {
  let pdfmakeOl = [];
  c.value.atenuantes?.forEach((a) => {
    pdfmakeOl.push(`${a.inciso}) ${a.text}`);
  });
  return pdfmakeOl;
});

const listaAgravantesPdfMake = computed(() => {
  let pdfmakeOl = [];
  c.value.agravantes?.forEach((a) => {
    pdfmakeOl.push(`${a.inciso}) ${a.text}`);
  });
  return pdfmakeOl;
});
let documentDefinition = {
  info: {
    title: "Conclusiones de la Comisión Disciplinaria",
    author: presidenteComision.value.name,
    subject:
      "Conclusiones de la comisión disciplinaria para el caso disciplinario",
    keywords: "caso disciplinario",
    creator:
      "Sistema de Gestión del Proceso de Comisión Disciplinaria en la Facultad 4",
  },
  userPassword: "f4",
  ownerPassword: "owner",
  // a string or { width: number, height: number }
  pageSize: "A4",

  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
  pageMargins: [40, 60, 40, 60],
  content: [
    {
      text: "Conclusiones de la Comisión Disciplinaria\n",
      style: "header",
      alignment: "center",
    },
    { text: `Fecha: ${c.value.date}` },
    `\nLa comisión nombrada al efecto por el Decano de la Facultad 4, integrada por ${integrantesHtml.value}, se reúne para iniciar la investigación y análisis de la denuncia de la falta cometida por el ${c.value.implicado.cargo} ${c.value.implicado.name} del grupo ${c.value.implicado.grupo}, consistente en la falta: ${c.value.falta}. En la investigación realizada se revisaron las siguientes evidencias:\n\n`,
    { ol: listaEvidenciasPdfMake.value },
    `\nTeniendo en cuenta todos los elementos referidos en este análisis y siguiendo todos los pasos establecidos en la Resolución No. 240/07, Reglamento Disciplinario para los estudiantes de la Educación Superior, la comisión encuentra probada la responsabilidad del estudiante ante la indisciplina: ${
      c.value.falta
    }.\n
    La comisión califica la falta como ${
      c.value.calificacion.text
    } a partir de lo establecido en el Capítulo III, Artículo ${
      c.value.calificacion.article
    }, Inciso ${
      c.value.calificacion.inciso
    }, de la Resolución No. 240/07, consistente en:
    ${c.value.calificacion.inciso}) ${incisoToDescription(
      c.value.calificacion.article,
      c.value.calificacion.inciso
    )}.\n
    Según los contenidos que aparecen en el Capítulo IX, Artículo 34 y atendiendo a su trayectoria como estudiante de nuestro centro se le reconoce lo siguiente:\n\n`,
    { text: "Atenuantes:", bold: true },
    { ul: listaAtenuantesPdfMake.value },
    { text: "Agravantes:", bold: true },
    { ul: listaAgravantesPdfMake.value },
    {
      text: `\nTeniendo en cuenta lo aportado por las declaraciones y las verificaciones realizadas y después de analizar las atenuantes y agravantes, la comisión acuerda proponer que al ${c.value.implicado.cargo} ${c.value.implicado.name} del grupo ${c.value.implicado.grupo}, le sea impuesta como medida disciplinaria ${c.value.medida.text}. Esta medida está dictada en el Inciso ${c.value.medida.inciso}, Artículo ${c.value.medida.article}, Capítulo X (De las medidas disciplinarias imponibles) del Reglamento Disciplinario para los estudiantes de la Educación Superior.\n
    Por lo expuesto anteriormente, informamos que el acta donde comparece la medida disciplinaria como, luego de ser aprobadas por la instancia correspondiente e informadas al estudiante, se mantendrá en el expediente académico de dicho estudiante, según lo establecido en el Capítulo X, Artículo 37 y preescribirá en el término de ${c.value.prescribeEn} cursos académicos, según lo establecido en el Capítulo IV, Artículo 14.\n
    Dado en La Habana ___________________________________.\n
    \n
    Presidente _____________________________\n
    Secretario _____________________________\n
    FEU           _____________________________\n`,
    },
  ],
  // header: 'Universidad de las Ciencias Informáticas.\nFacultad 4.',
  // footer: {
  //   text: 'Universidad de las Ciencias Informáticas\nCarretera San Antonio Km 2 ½ Torrens. Boyeros. La Habana.Cuba.', alignment: 'right'
  // },
  defaultStyle: {
    fontSize: 12,
    alignment: "justify",
    lineHeight: 1.5,
  },
  styles: {
    header: {
      fontSize: 18,
      bold: true,
    },
    subheader: {
      fontSize: 15,
      bold: true,
    },
    strong: {
      bold: true,
    },
  },
};
function generateDocument() {
  console.info(documentDefinition);
  pdfMake.createPdf(documentDefinition).open();
}
const documentContent =
  ref(`<main style="text-align:justify"><h1 style="text-align:center">Conclusiones de la Comisión Disciplinaria</h1>
    <b>Fecha: </b>${c.value.date}<br />
    La comisión nombrada al efecto por el Decano de la Facultad 4, integrada
    por
    ${integrantesHtml.value}, se reúne para iniciar la investigación y análisis de la denuncia de la
    falta cometida por el ${c.value.implicado.cargo} ${c.value.implicado.name} del
    grupo ${c.value.implicado.grupo}, consistente en la falta: ${c.value.falta}. En
    la investigación realizada se revisaron las siguientes evidencias:
    <div>
      <ol>
        ${listaEvidenciasHTML.value}
      </ol>
    </div>
    Teniendo en cuenta todos los elementos referidos en este análisis y
    siguiendo todos los pasos establecidos en la Resolución No.
    240/07, Reglamento Disciplinario para los estudiantes de la Educación
    Superior, la comisión encuentra probada la responsabilidad del estudiante
    ante la indisciplina ${c.value.falta}. La comisión califica la falta como
    ${c.value.calificacion.text} a partir de lo establecido en el Capítulo III,
    Artículo${c.value.calificacion.article}, Inciso ${c.value.calificacion.inciso}, de la Resolución No. 240/07,
    consistente en ${c.value.calificacion.text}. Según los contenidos que
    aparecen en el Capítulo IX, Artículo 34 y atendiendo a su trayectoria como
    estudiante de nuestro centro se le reconoce lo siguiente:
    <p>
      <strong>Atenuantes: </strong>
    <ul>

        ${listaAtenuantes.value}
    </ul>
    </p>
    <p>
      <strong>Agravantes: </strong>
    <ul>
        ${listaAgravantes.value}

    </ul>
    </p>
    <p>Teniendo en cuenta lo aportado por las declaraciones y las verificaciones realizadas y después de analizar las
    atenuantes y agravantes, la comisión acuerda proponer que el ${c.value.implicado.cargo} ${c.value.implicado.name} del grupo
    ${c.value.implicado.grupo}, le sea impuesta como medida
    disciplinaria ${c.value.medida.text}. Esta medida está dictada en el Inciso ${c.value.medida.inciso}, Artículo
    ${c.value.medida.article}, Capítulo X (de las
    medidas disciplinarias imponibles) del Reglamento Disciplinario para los estudiantes de la Educación Superior. Por
    lo expuesto anteriormente, informamos que el acta donde comparece la medida disciplinaria como, luego de ser
    aprobadas por la instancia correspondiente e informadas al estudiante, se mantendrá en el expediente académico de
    dicho estudiante, según lo establecido en el Capítulo X, Artículo 37 y preescribirá en el término de ${c.value.prescribeEn} cursos académicos, según lo establecido en el Capítulo IV, Artículo 14.<p/>
    Dado en La Habana ___________________________________.<br />
    <br/>
    Presidente _____________________________<br />
    Secretario _____________________________<br />
    FEU _____________________________<br />
  </main>`);
</script>
