<template>
  <div class="p-4 bg-base-100 rounded-box shadow-xl min-h-[calc(100vh-120px)] flex flex-col">
    <h2 class="text-2xl font-bold mb-4 text-base-content">Proyectos</h2>
    <div class="overflow-x-auto flex-grow">
      <table class="table w-full table-zebra">
        <thead>
          <tr>
            <th></th>
            <th>Proyecto</th>
            <th>Tareas</th>
            <th>Avance</th>
            <th>Acciones</th> </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <th>{{ project.id }}</th>
            <td>{{ project.name }}</td>
            <td>{{ project.tasks }}</td> <td>
              <progress class="progress progress-primary w-56" :value="calculateProgress(project)" max="100"></progress>
              <span class="ml-2 text-sm">{{ calculateProgress(project) }}%</span>
            </td>
            <td>
              <button class="btn btn-info btn-sm mr-2" @click="openEditModal(project)">
                Editar
              </button>
              <button class="btn btn-ghost btn-sm" @click="removeProject(project.id)">
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button
      class="btn btn-circle btn-lg btn-secondary shadow-lg fixed z-50"
      :style="buttonStyle"
      @click="openAddModal"
      @mousedown="startDrag"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>

    <BaseModal modalId="add_project_modal" ref="addProjectModalRef">
      <template #title>
        Agregar Nuevo Proyecto
      </template>
      <template #body>
        <form @submit.prevent="submitAddProject" class="space-y-4">
          <div>
            <label class="label">
              <span class="label-text">Nombre del Proyecto</span>
            </label>
            <input type="text" v-model="newProject.name" placeholder="Ej: Nuevo Sitio Web" class="input input-bordered w-full" required />
          </div>
          <div>
            <label class="label">
              <span class="label-text">Descripción de Tareas (ej: Diseño, Desarrollo, Pruebas)</span>
            </label>
            <input type="text" v-model="newProject.tasks" placeholder="Ej: Diseño,Desarrollo,Pruebas" class="input input-bordered w-full" />
          </div>
          <div>
            <label class="label">
              <span class="label-text">Tareas Completadas (Número)</span>
            </label>
            <input type="number" v-model.number="newProject.completedTasks" min="0" :max="newProject.totalTasks" class="input input-bordered w-full" required />
          </div>
          <div>
            <label class="label">
              <span class="label-text">Total de Tareas</span>
            </label>
            <input type="number" v-model.number="newProject.totalTasks" min="1" class="input input-bordered w-full" required />
          </div>
          <div class="modal-action !justify-end">
            <button type="submit" class="btn btn-success">Guardar Proyecto</button>
          </div>
        </form>
      </template>
    </BaseModal>

    <BaseModal modalId="edit_project_modal" ref="editProjectModalRef">
      <template #title>
        Editar: {{ currentProject.name }}
      </template>
      <template #body>
        <form @submit.prevent="submitEditProject" class="space-y-4">
          <div>
            <label class="label">
              <span class="label-text">Nombre del Proyecto</span>
            </label>
            <input type="text" v-model="currentProject.name" class="input input-bordered w-full" required />
          </div>
          <div>
            <label class="label">
              <span class="label-text">Lista de Tareas</span>
            </label>
            <input type="text" v-model="currentProject.tasks" class="input input-bordered w-full" />
          </div>
          <div>
            <label class="label">
              <span class="label-text">Tareas Completadas (Número)</span>
            </label>
            <input type="number" v-model.number="currentProject.completedTasks" min="0" :max="currentProject.totalTasks" class="input input-bordered w-full" required />
          </div>
          <div>
            <label class="label">
              <span class="label-text">Total de Tareas</span>
            </label>
            <input type="number" v-model.number="currentProject.totalTasks" min="1" class="input input-bordered w-full" required />
          </div>
          <div class="modal-action !justify-start">
            <button type="submit" class="btn btn-success">Guardar Cambios</button>
            <button type="button" class="btn btn-ghost" @click="editProjectModalRef.close()">Cancelar</button>
          </div>
        </form>
      </template>
    </BaseModal>

    
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed, watch } from 'vue';
import BaseModal from '../components/BaseModal.vue';

// --- Local Storage Persistence y Estado de Proyectos ---
const STORAGE_KEY = 'projects';

let initialProjects = [];
try {
  const storedProjects = localStorage.getItem(STORAGE_KEY);
  initialProjects = storedProjects ? JSON.parse(storedProjects) : [
    // Datos de ejemplo iniciales (ajustados para incluir completedTasks y totalTasks)
    { id: 1, name: 'Hart-Hagerty', tasks: 'Revisión Documentos, Preparar Informe, Presentación Cliente', completedTasks: 1, totalTasks: 3 },
    { id: 2, name: 'Otro Proyecto S.A.', tasks: 'Diseño Base de Datos, Desarrollo API, Pruebas Unitarias', completedTasks: 0, totalTasks: 3 },
    { id: 3, name: 'Innovación Tech', tasks: 'Investigación Mercado, Prototipado, User Testing', completedTasks: 3, totalTasks: 3 },
  ];
} catch (error) {
  console.error("Error al parsear proyectos desde localStorage:", error);
  initialProjects = [
    { id: 1, name: 'Hart-Hagerty', tasks: 'Revisión Documentos, Preparar Informe, Presentación Cliente', completedTasks: 1, totalTasks: 3 },
    { id: 2, name: 'Otro Proyecto S.A.', tasks: 'Diseño Base de Datos, Desarrollo API, Pruebas Unitarias', completedTasks: 0, totalTasks: 3 },
    { id: 3, name: 'Innovación Tech', tasks: 'Investigación Mercado, Prototipado, User Testing', completedTasks: 3, totalTasks: 3 },
  ];
}
const projects = ref(initialProjects);

watch(
  projects,
  (newProjects) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
  },
  { deep: true }
);

// Referencias a los modales
const addProjectModalRef = ref(null);
const editProjectModalRef = ref(null); // NUEVO: Ref para el modal de edición
const commonModalRef = ref(null);

// Formulario para nuevo proyecto
const newProject = reactive({
  name: '',
  tasks: '', // Descripción de tareas
  completedTasks: 0,
  totalTasks: 3, // Por defecto, 3 tareas
});

// NUEVO: Variable reactiva para el proyecto actualmente en edición
const currentProject = reactive({
  id: null,
  name: '',
  tasks: '',
  completedTasks: 0,
  totalTasks: 3,
});

// Funciones para abrir modales
const openAddModal = () => {
  newProject.name = '';
  newProject.tasks = '';
  newProject.completedTasks = 0;
  newProject.totalTasks = 3;
  if (addProjectModalRef.value) {
    addProjectModalRef.value.openModal();
  }
};

const openEditModal = (projectToEdit) => {
  // Copia los datos del proyecto a editar a currentProject
  Object.assign(currentProject, projectToEdit);
  if (editProjectModalRef.value) {
    editProjectModalRef.value.openModal();
  }
};

const openCommonModal = () => {
  if (commonModalRef.value) {
    commonModalRef.value.openModal();
  }
};

// Lógica para agregar un nuevo proyecto
const submitAddProject = () => {
  const newId = projects.value.length > 0 ? Math.max(...projects.value.map(p => p.id)) + 1 : 1;
  // Asegúrate de que completedTasks no exceda totalTasks
  const actualCompletedTasks = Math.min(newProject.completedTasks, newProject.totalTasks);

  projects.value.push({
    id: newId,
    name: newProject.name,
    tasks: newProject.tasks,
    completedTasks: actualCompletedTasks,
    totalTasks: newProject.totalTasks,
  });
  if (addProjectModalRef.value) {
    addProjectModalRef.value.close();
  }
};

// NUEVO: Lógica para guardar los cambios del proyecto editado
const submitEditProject = () => {
  const index = projects.value.findIndex(p => p.id === currentProject.id);
  if (index !== -1) {
    // Asegúrate de que completedTasks no exceda totalTasks antes de guardar
    currentProject.completedTasks = Math.min(currentProject.completedTasks, currentProject.totalTasks);
    // Actualiza el proyecto en el array con los nuevos datos
    projects.value[index] = { ...currentProject }; // Usa spread para asegurar reactividad si es un objeto anidado
  }
  if (editProjectModalRef.value) {
    editProjectModalRef.value.close();
  }
};

// Lógica para eliminar un proyecto
const removeProject = (projectId) => {
  projects.value = projects.value.filter(p => p.id !== projectId);
};

// Función para calcular el progreso
const calculateProgress = (project) => {
  if (project.totalTasks === 0) return 0; // Evitar división por cero
  const progress = (project.completedTasks / project.totalTasks) * 100;
  return Math.round(progress); // Redondear a un número entero
};


// --- Lógica para arrastrar el botón (SIN CAMBIOS) ---
const isDragging = ref(false);
const startX = ref(0);
const startY = ref(0);
const initialButtonX = ref(window.innerWidth - 100);
const initialButtonY = ref(window.innerHeight - 100);

const buttonStyle = computed(() => ({
  top: `${initialButtonY.value}px`,
  left: `${initialButtonX.value}px`,
}));

//   isDragging.value = false;
//   document.removeEventListener('mousemove', drag);
//   document.removeEventListener('mouseup', stopDrag);
// };

// onUnmounted(() => {
//   document.removeEventListener('mousemove', drag);
//   document.removeEventListener('mouseup', stopDrag);
// });
</script>

