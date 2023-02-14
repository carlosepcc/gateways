<template>
  <q-btn
    class="q-my-md float-right"
    color="primary"
    push
    label="Exportar resolución"
    icon="picture_as_pdf"
    @click="generateDocument()"
  />
</template>
<script setup>
import { reactive, computed, ref } from "vue";
import pdfMake from "pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs; //pdfMake virtual filesystem for use fonts

const c = {
  id: 0,
  number: "1/2021-2022",
  date: "2022-11-20",
  commissions: [
    {
      id: 0,
      president: {
        id: 0,
        name: "Juan Perez",
        username: "juanperez",
        position: "Profesor",
        gender: "M",
        scientificCategory: "Dr.C",
      },
      secretary: {
        id: 1,
        name: "Maria Lopez",
        username: "marialopez",
        position: "Profesor",
        gender: "F",
        scientificCategory: "M.Sc",
      },
      blocked: true,
      busy: true,
    },
  ],
  resolutor: {
    id: 0,
    name: "Adalberto Hermández Bolaños",
    username: "adalberto",
    position: "Decano",
    gender: "M",
    scientificCategory: "Dr.C",
    roles: ["DECANO"],
  },
};
const tableBody = computed(() => {
  let table = [
    [
      { text: "No. Comisión", style: "tableHeader", alignment: "center" },
      { text: "Presidente", style: "tableHeader", alignment: "center" },
      { text: "Secretario", style: "tableHeader", alignment: "center" },
    ],
  ];
  c.commissions.forEach((v, index) =>
    table.push([index + 1, v.president.name, v.secretary.name])
  );
  return table;
});
let documentDefinition = {
  info: {
    title: "Resolución del caso disciplinario",
    author: c.resolutor.name,
    subject:
      "Conclusiones de la comisión disciplinaria para el caso disciplinario",
    keywords: "caso disciplinario",
    creator:
      "Sistema de Gestión para el Proceso de Comisión Disciplinaria de la Facultad 4 (CDIS)",
  },
  //userPassword: "f4",
  //ownerPassword: "owner",
  // a string or { width: number, height: number }
  pageSize: "A4",

  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
  pageMargins: [40, 60, 40, 60],
  content: [
    {
      text: `RESOLUCIÓN No. ${c.number}\n\n`,
      style: "header",
      alignment: "center",
    },
    {
      text: `POR CUANTO: Por la Resolución No. 99 de fecha 14 de agosto del  2002 del Ministro de la Informática y las Comunicaciones, se creó la Unidad Presupuestada Universidad Informática adscrita al Ministerio de la Informática y las Comunicaciones.

POR CUANTO: Por el Acuerdo número 7317 del Comité Ejecutivo del Consejo de Ministro, dictado con fecha 19 de diciembre de 2012, se adscribió la Universidad de las Ciencias Informáticas al Ministerio de Educación Superior.

POR CUANTO: Por Resolución Rectoral, se faculta a quien resuelve, ${c.resolutor.scientificCategory}. ${c.resolutor.name} para que se encargue de dirigir la Facultad No. 4 con todas las atribuciones y derechos correspondientes al cargo de Decano.

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
        widths: [200, "auto", "auto"],
        body: tableBody.value,
      },
    },
    `\nSEGUNDO: Notifíquese a los interesados y comuníquese a quien corresponda.`,
    `\nDado en la Habana a los ${new Date().getDay()} días del mes ${new Date().getMonth()} del año ${new Date().getFullYear()}.
“Año ${new Date().getFullYear() - 1958} de la Revolución”`,
    `\n________________________________
${c.resolutor.scientificCategory}. ${c.resolutor.name}`,
  ],
  // header: 'Universidad de las Ciencias Informáticas.\nFacultad 4.',
  // footer: {
  //   text: 'Universidad de las Ciencias Informáticas\nCarretera San Antonio Km 2 ½ Torrens. Boyeros. La Habana.Cuba.', alignment: 'right'
  // },
  defaultStyle: {
    fontSize: 11,
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
  pdfMake.createPdf(documentDefinition).open();
}
</script>
