<template lang="pug">
q-page.q-gutter-sm(padding='')
	p Interfaz
	// TABLE / GRID
	q-btn-toggle(title='Modo de presentación (Tabla o Rejilla)' v-model='state.grid' flat='' toggle-color='primary' :options="[\
	{\
	label: 'Vista en Tabla',\
	noCaps: true,\
	value: false,\
	slot: 'tableview',\
	},\
	{\
	label: 'Vista por Tarjetas',\
	noCaps: true,\
	value: true,\
	slot: 'gridview',\
	},\
	]")
		template(v-slot:tableview='')
			q-icon.on-right(name='r_table_chart')
		template(v-slot:gridview='')
			q-icon.on-right(name='r_grid_view')
	br
	// DENSE / NORMAL
	q-btn-toggle.q-mx-sm(title='Densidad las filas en vista de tabla (Normal o Denso)' v-model='state.dense' flat='' toggle-color='primary' :options="[\
	{\
	label: 'Interfaz normal',\
	noCaps: true,\
	value: false,\
	slot: 'normal',\
	},\
	{ label: 'Interfaz densa', noCaps: true, value: true, slot: 'dense' },\
	]")
		template(v-slot:normal='')
			q-icon.on-right(name='r_table_rows')
		template(v-slot:dense='')
			q-icon.on-right(name='view_headline')
	dark-mode-control
	hr
	q-card.q-pa-md.q-ma-md.col.q-gutter-md
		details.col.q-gutter-md
			summary Opciones para desarrolladores
			q-select#serverUrlsSelect(label='Base URL' v-model='axiosBaseURL' autofocus='' @change='setBaseURL' :options='baseUrlsArr')
			q-input(label='Personalizada' style='max-width: 20em' list='serverUrls' v-model='axiosBaseURL' placeholder='baseURL..' @change='setBaseURL')
				datalist#serverUrls
					option(value='http://localhost:8080/')
					option(value='http://10.8.44.245:8080/')
			q-input(autogrow='' label='mockUser' v-model='auth.mockUser.nombre' @change='auth.loggedUser = auth.mockUser')
			q-btn(@click='auth.loggedUser = auth.mockUser' label='set mock user')
</template>

<script setup>
import DarkModeControl from "components/DarkModeControl.vue";
import { ref } from "vue";
import state from "src/composables/useState.js";
import { api } from "boot/axios";
import { useAuthStore } from "src/stores/authStore";
const auth = useAuthStore();
const axiosBaseURL = ref(api.defaults.baseURL);
const baseUrlsArr = [
  axiosBaseURL.value,
  "http://localhost:8080/",
  "http://10.8.44.245:8080/",
];

const setBaseURL = (url = axiosBaseURL.value) => {
  api.defaults.baseURL = url;
  console.log("baseUrl Cambiada", api.defaults.baseURL);
};
</script>
