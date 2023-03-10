<template>
  <q-table
    :loading="loading"
    v-model:selected="selected"
    :class="tableClass"
    :columns="columns"
    :dense="isTableDense"
    :filter="filter"
    :fullscreen="isTableFullscreen"
    :grid="isTableGrid"
    :hide-header="isTableGrid"
    :pagination="{ rowsPerPage: 15 }"
    :row-key="rowKey"
    :rows="rows"
    :title="heading"
    :separator="separator"
    grid-header
    flat
    bordered
    :selection="canDelete ? 'multiple' : 'none'"
    :table-style="isTableFullscreen ? 'height:90vh' : 'max-height:55vh'"
  >
    <template v-slot:loading>
      <q-inner-loading showing color="primary" />
    </template>
    <template v-slot:top-left>
      <div class="row">
        <!-- Refrescar-->
        <q-btn
          flat
          icon="refresh"
          :loading="loading"
          title="Actualizar datos"
          @click="$emit('updateList')"
        />

        <!-- FILTER -->
        <q-input
          v-model="filter"
          :dense="s.dense"
          borderless
          label="Filtrar"
          placeholder="Escriba para filtrar.."
          title="Filtrar los elementos de la tabla por coincidencia de texto"
        >
          <template v-slot:prepend>
            <q-icon name="r_search" />
          </template>
          <template v-slot:append>
            <q-icon
              v-show="filter"
              class="cursor-pointer"
              name="backspace"
              @click="filter = ''"
            />
          </template>
        </q-input>
      </div>
    </template>
    <template v-slot:top-right>
      <!--🗑️ ELIMINAR SELECCIÓN-->
      <q-btn
        v-if="canDelete"
        class="gt-sm"
        :dense="s.dense"
        v-show="selected.length != 0"
        flat
        icon="r_delete_sweep"
        label="Eliminar selección"
        no-caps
        text-color="negative"
        @click="emitDelete"
      />

      <!-- NUEVA ENTRADA -->
      <q-btn
        v-if="canCreate"
        icon="r_add"
        title="Adicionar nueva entrada"
        v-show="isTableFullscreen || $q.screen.gt.xs"
        :dense="s.dense"
        flat
        no-caps
        @click="$emit('openForm')"
      >
        <slot name="input-btn">{{ canCreate ? "Nueva" : "Modificar" }}</slot>
      </q-btn>

      <!-- FULLSCREEN -->
      <q-btn
        title="Pantalla completa"
        flat
        round
        :icon="isTableFullscreen ? 'fullscreen_exit' : 'fullscreen'"
        @click="isTableFullscreen = !isTableFullscreen"
      />

      <div class="col-auto">
        <q-btn round flat icon="more_vert">
          <q-menu auto-close>
            <q-card bordered>
              <q-list>
                <q-item clickable>
                  <!-- DENSE -->
                  <q-checkbox
                    title="Vista densa"
                    flat
                    no-caps
                    label="Vista densa"
                    v-model="isTableDense"
                  />
                </q-item>
                <q-item clickable>
                  <!-- DENSE -->
                  <q-checkbox
                    title="Vista densa"
                    flat
                    no-caps
                    label="Vista por tarjetas"
                    v-model="isTableGrid"
                  />
                </q-item>
                <!--SEPARATOR
                  <q-item>
                  <q-select
                    title="Líneas para separar las celdas de la tabla"
                    flat
                    :options="[
                      { label: 'Horizontal', value: 'horizontal' },
                      { label: 'Vertical', value: 'vertical' },
                      { label: 'Celda', value: 'cell' },
                      { label: 'Ninguno', value: 'none' },
                    ]"
                    no-caps
                    label="Separadores"
                    v-model="separator"
                  />
                </q-item> -->
                <!-- EXPORT -->
                <q-item
                  class="q-pl-lg"
                  title="Exportar tabla en formato CSV"
                  clickable
                  @click="exportTable(columns, rows, heading)"
                >
                  <q-item-section side>
                    <q-icon name="archive" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Exportar tabla</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-menu>
        </q-btn>
      </div>
    </template>
    <template v-slot:header="props">
      <q-tr :props="props">
        <q-th
          auto-width
          v-if="canDelete || canUpdate || printable"
          class="actions-column"
        >
          <template v-if="!canDelete">
            <span class="q-px-sm">Acciones</span>
          </template>
          <template v-else>
            <!--🗑️ ELIMINAR SELECCIÓN-->
            <q-btn
              :dense="s.dense"
              v-show="selected.length > -1"
              :disabled="selected.length === 0"
              flat
              icon="r_delete_sweep"
              title="Eliminar selección"
              no-caps
              class="full-width"
              text-color="negative"
              @click="emitDelete"
            />
          </template>
        </q-th>

        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>
    <template v-slot:body="props">
      <q-tr
        :props="props"
        class="cursor-pointer"
        title="Haga click para ver o modificar esta entrada"
        @click="$emit('openForm', props.row)"
      >
        <q-td
          auto-width
          v-if="canDelete || canUpdate || printable"
          class="actions-column"
        >
          <q-checkbox
            v-if="canDelete"
            v-model="props.selected"
            :dense="isTableDense"
          />
          <!-- TODO: MODIFY -->
          <!-- 📝-->
          <q-btn
            title="Editar"
            spread
            v-if="canUpdate"
            flat
            icon="edit"
            size="sm"
            text-color="accent"
            @click.stop="$emit('openForm', props.row)"
          />

          <!-- 🖨 Print -->
          <q-btn
            v-if="printable"
            title="Imprimir fila"
            spread
            flat
            icon="r_print"
            size="sm"
            text-color="secondary"
            @click.stop="$emit('print', props.row)"
          />

          <!-- 🗑 DELETE-->
          <q-btn
            v-if="canDelete"
            title="Eliminar"
            flat
            icon="delete"
            size="sm"
            text-color="negative"
            @click.stop="emitDelete(props.row)"
          />
        </q-td>
        <q-td
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          style="max-width: 100px; overflow: hidden"
          >{{ col.value }}
        </q-td>
      </q-tr>
    </template>

    <!--      CARD VIEW-->
    <template v-slot:item="props">
      <div
        :style="props.selected ? 'transition:.2s;transform: scale(0.95);' : ''"
        class="cursor-pointer q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition opaque"
        title="Haga click para ver o modificar esta entrada"
        @click.stop="$emit('openForm', props.row)"
      >
        <q-card bordered :class="props.selected ? 'card-selected' : ''">
          <!-- CARD HEADER-->

          <q-card-section class="col">
            <div class="q-mb-sm">
              <!-- 🖨 PRINT -->
              <q-btn
                v-if="props.printable"
                :dense="isTableDense"
                flat
                icon="r_print"
                round
                size="sm"
                text-color="secondary"
                @click.stop="$emit('print', props.row)"
              />
              <!-- 📝 EDIT -->
              <q-btn
                v-if="canUpdate"
                :dense="isTableDense"
                flat
                icon="r_edit"
                round
                size="sm"
                text-color="accent"
                @click.stop="$emit('openForm', props.row)"
              />

              <!-- 🗑 DELETE -->
              <q-btn
                :title="`Eliminar ${props.row.name ?? 'elemento'}`"
                v-if="canDelete"
                :dense="isTableDense"
                flat
                icon="r_delete"
                round
                size="sm"
                text-color="negative"
                @click.stop="$emit('deleteRows', [props.row])"
              />
            </div>
            <label class="text-bold cursor-pointer" @click.stop>
              <q-checkbox
                v-if="canDelete"
                v-model="props.selected"
                dense
                class="q-mr-sm"
              />
              {{ props.cols[0].value }}
            </label>
          </q-card-section>

          <q-separator />

          <!-- CARD BODY-->
          <q-list dense>
            <q-item v-for="col in props.cols" :key="col.name">
              <q-item-section class="col">
                <q-item-label>{{ col.label }}</q-item-label>
              </q-item-section>
              <q-item-section class="col" side>
                <q-item-label>{{ col.value }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>
  </q-table>
  <DevInfo> Filas seleccionadas: {{ selected }} </DevInfo>

  <q-page-sticky :offset="[18, 18]" class="lt-sm">
    <q-btn
      v-if="canCreate || canUpdate"
      :icon="canCreate ? 'r_add' : 'r_edit'"
      :title="
        canCreate ? 'Adicionar nueva entrada' : 'Modificar entrada existente'
      "
      color="accent"
      fab
      position="bottom-right"
      @click="$emit('openForm')"
    />
  </q-page-sticky>
</template>

<script setup>
import { ref } from "vue";
import state from "src/composables/useState";
import DevInfo from "src/components/DevInfo.vue";
import { useQuasar } from "quasar";
import { exportTable } from "src/composables/useExport";
const $q = useQuasar();

var s = state.value;
const isTableGrid = ref(props.grid != undefined ? props.grid : $q.screen.lt.sm);
const isTableFullscreen = ref(false);
const isTableDense = ref($q.screen.lt.sm);
const tableClass = `overflow-scroll bg-solid ${
  isTableFullscreen.value ? "" : "sticky-header-table"
}`;
const separator = ref("none");
const props = defineProps({
  rows: Array,
  columns: Array,
  heading: { type: String, default: "Lista" },
  printable: { type: Boolean, default: false },
  canCreate: { type: Boolean, default: true },
  canDelete: { type: Boolean, default: true },
  canUpdate: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  rowKey: { type: String, default: "id" },
  grid: { type: Boolean, default: undefined },
});
const emit = defineEmits(["openForm", "deleteRows", "updateList", "print"]);
const emitDelete = (rowObject = null) => {
  selected.value.push(rowObject);
  console.log(selected);
  emit("deleteRows", selected);
};

// FILTRAR
const filter = ref("");

// SELECCIONAR
const selected = ref([]);

/*.q-table th.actions-column, .q-table td.actions-column {padding:0;}
 */
</script>
<style lang="sass">
.bg-solid
  background: var(--q-solid) !important
.sticky-header-table
  /* height or max-height is important */
  th.actions-column, td.actions-column
    padding: 0
    border-right: 1px solid #0002

  td:first-child
    background-color: var(--q-solid)
    border-right: 1px solid #0002

  tr th
    position: sticky
    z-index: 2 /* higher than z-index for td below */
    background: var(--q-solid)

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0

  .q-table__top
    padding:0
    padding-right:8px

body.body--dark .sticky-header-table
  border:0
  tr, th, td:first-child
    background: var(--q-dark)
    color: var(--q-light)

  td:first-child
    border-right: 1px solid #fff2

  th.actions-column, td.actions-column
    border-right: 1px solid #fff2

  .q-table__top,.q-table__bottom
    background: var(--q-dark)
</style>
