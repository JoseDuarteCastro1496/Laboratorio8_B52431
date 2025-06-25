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
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <th>{{ project.id }}</th>
            <td>{{ project.name }}</td>
            <td>
              <ul>
                <li
                  v-for="(task, index) in project.tasksArray"
                  :key="index"
                  class="flex items-center space-x-2 mb-1"
                >
                  <input
                    type="checkbox"
                    v-model="task.completed"
                    @change="updateCompletedTasks(project)"
                    class="checkbox checkbox-primary checkbox-sm"
                  />
                  <span :class="{ 'line-through': task.completed }">{{ task.name }}</span>
                  <button
                    @click="removeTask(project, index)"
                    class="btn btn-error btn-xs ml-2"
                    title="Eliminar Tarea"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              </ul>
            </td>
            <td>
              <progress class="progress progress-primary w-56" :value="calculateProgress(project)" max="100"></progress>
              <span class="ml-2 text-sm">{{ calculateProgress(project) }}%</span>
            </td>
            <td>
               <button class="btn btn-success btn-sm ml-2" @click="openAddTaskModal(project)">
                Crear Tarea
              </button>
              <button class="btn btn-info btn-sm mr-2" @click="openEditModal(project)">
                Editar
              </button>
              <button class="btn btn-ghost btn-sm" @click="removeProject(project.id)">
                Eliminar Proyecto
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
            <input
              type="text"
              v-model="newProject.name"
              placeholder="Ej: Nuevo Sitio Web"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label class="label">
              <span class="label-text">Tareas (separadas por coma)</span>
            </label>
            <input
              type="text"
              v-model="newProject.tasks"
              placeholder="Ej: Diseño,Desarrollo,Pruebas"
              class="input input-bordered w-full"
            />
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
            <input
              type="text"
              v-model="currentProject.name"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div>
            <label class="label">
              <span class="label-text">Tareas (separadas por coma)</span>
            </label>
            <input
              type="text"
              v-model="currentProject.tasks"
              class="input input-bordered w-full"
            />
          </div>
          <div class="modal-action !justify-start">
            <button type="submit" class="btn btn-success">Guardar Cambios</button>
            <button type="button" class="btn btn-ghost" @click="editProjectModalRef.close()">Cancelar</button>
          </div>
        </form>
      </template>
    </BaseModal>

    <BaseModal modalId="add_task_modal" ref="addTaskModalRef">
      <template #title>
        Agregar tarea a: {{ taskProject.name }}
      </template>
      <template #body>
        <form @submit.prevent="submitAddTask" class="space-y-4">
          <div>
            <label class="label">
              <span class="label-text">Nombre de la Tarea</span>
            </label>
            <input
              type="text"
              v-model="newTask.name"
              placeholder="Ej: Diseño de interfaz"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div class="modal-action !justify-end">
            <button type="submit" class="btn btn-success">Agregar Tarea</button>
          </div>
        </form>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted, onUnmounted } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const STORAGE_KEY = 'projects';

let initialProjects = [];
try {
  const storedProjects = localStorage.getItem(STORAGE_KEY);
  initialProjects = storedProjects ? JSON.parse(storedProjects) : [
    {
      id: 1,
      name: 'Hart-Hagerty',
      tasks: 'Revisión Documentos, Preparar Informe, Presentación Cliente',
      completedTasks: 1,
      totalTasks: 3,
    },
    {
      id: 2,
      name: 'Otro Proyecto S.A.',
      tasks: 'Diseño Base de Datos, Desarrollo API, Pruebas Unitarias',
      completedTasks: 0,
      totalTasks: 3,
    },
    {
      id: 3,
      name: 'Innovación Tech',
      tasks: 'Investigación Mercado, Prototipado, User Testing',
      completedTasks: 3,
      totalTasks: 3,
    },
  ];
} catch (error) {
  console.error("Error al parsear proyectos desde localStorage:", error);
  initialProjects = [
    {
      id: 1,
      name: 'Hart-Hagerty',
      tasks: 'Revisión Documentos, Preparar Informe, Presentación Cliente',
      completedTasks: 1,
      totalTasks: 3,
    },
    {
      id: 2,
      name: 'Otro Proyecto S.A.',
      tasks: 'Diseño Base de Datos, Desarrollo API, Pruebas Unitarias',
      completedTasks: 0,
      totalTasks: 3,
    },
    {
      id: 3,
      name: 'Innovación Tech',
      tasks: 'Investigación Mercado, Prototipado, User Testing',
      completedTasks: 3,
      totalTasks: 3,
    },
  ];
}

// Convertir tareas string a arreglo de objetos con estado completed:
initialProjects.forEach((project) => {
  if (!project.tasksArray) {
    project.tasksArray = project.tasks
      ? project.tasks.split(',').map((name) => ({ name: name.trim(), completed: false }))
      : [];
    project.totalTasks = project.tasksArray.length;
    project.completedTasks = project.tasksArray.filter(t => t.completed).length;
  }
});

const projects = ref(initialProjects);

// Guardar en localStorage automáticamente
watch(
  projects,
  (newProjects) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
  },
  { deep: true }
);

// Referencias a modales
const addProjectModalRef = ref(null);
const editProjectModalRef = ref(null);
const addTaskModalRef = ref(null);

// Nuevo proyecto (simplificado)
const newProject = reactive({
  name: '',
  tasks: '',
});

// Proyecto actual para edición
const currentProject = reactive({
  id: null,
  name: '',
  tasks: '',
  tasksArray: [],
  completedTasks: 0,
  totalTasks: 0,
});

// Proyecto para agregar tarea
const taskProject = reactive({
  id: null,
  name: '',
  tasksArray: [],
});

// Nueva tarea a agregar
const newTask = reactive({
  name: '',
});

// Abrir modal agregar proyecto
const openAddModal = () => {
  newProject.name = '';
  newProject.tasks = '';
  if (addProjectModalRef.value) addProjectModalRef.value.openModal();
};

// Abrir modal editar proyecto
const openEditModal = (projectToEdit) => {
  Object.assign(currentProject, projectToEdit);
  // Asegurar que tasks string está sincronizado con tasksArray:
  currentProject.tasks = currentProject.tasksArray.map(t => t.name).join(', ');
  if (editProjectModalRef.value) editProjectModalRef.value.openModal();
};

// Guardar proyecto nuevo
const submitAddProject = () => {
  const newId = projects.value.length > 0 ? Math.max(...projects.value.map(p => p.id)) + 1 : 1;
  const tasksArr = newProject.tasks
    ? newProject.tasks.split(',').map(name => ({ name: name.trim(), completed: false }))
    : [];

  projects.value.push({
    id: newId,
    name: newProject.name,
    tasks: newProject.tasks, // Keep the string version for initial data
    tasksArray: tasksArr,
    completedTasks: 0,
    totalTasks: tasksArr.length,
  });
  if (addProjectModalRef.value) addProjectModalRef.value.close();
};

// Guardar cambios proyecto editado
const submitEditProject = () => {
  const index = projects.value.findIndex(p => p.id === currentProject.id);
  if (index !== -1) {
    const tasksArr = currentProject.tasks
      ? currentProject.tasks.split(',').map(name => ({ name: name.trim(), completed: false }))
      : [];

    projects.value[index] = {
      ...currentProject,
      tasksArray: tasksArr,
      completedTasks: tasksArr.filter(t => t.completed).length,
      totalTasks: tasksArr.length,
    };
  }
  if (editProjectModalRef.value) editProjectModalRef.value.close();
};

// Eliminar proyecto
const removeProject = (projectId) => {
  projects.value = projects.value.filter(p => p.id !== projectId);
};

// Abrir modal para agregar tarea a proyecto
const openAddTaskModal = (project) => {
  Object.assign(taskProject, project);
  newTask.name = '';
  if (addTaskModalRef.value) addTaskModalRef.value.openModal();
};

// Guardar nueva tarea en proyecto
const submitAddTask = () => {
  if (!newTask.name.trim()) return;

  taskProject.tasksArray.push({ name: newTask.name.trim(), completed: false });
  taskProject.totalTasks = taskProject.tasksArray.length;
  updateCompletedTasks(taskProject);

  // Actualizar en el array principal projects
  const index = projects.value.findIndex(p => p.id === taskProject.id);
  if (index !== -1) {
    projects.value[index] = { ...taskProject };
  }

  if (addTaskModalRef.value) addTaskModalRef.value.close();
};

// Eliminar una tarea de un proyecto
const removeTask = (project, taskIndex) => {
  project.tasksArray.splice(taskIndex, 1);
  project.totalTasks = project.tasksArray.length;
  updateCompletedTasks(project);
};


// Actualizar tareas completadas y progreso
const updateCompletedTasks = (project) => {
  project.completedTasks = project.tasksArray.filter(t => t.completed).length;
};

// Calcular progreso %
const calculateProgress = (project) => {
  if (!project.totalTasks || project.totalTasks === 0) return 0;
  return Math.round((project.completedTasks / project.totalTasks) * 100);
};

// --- Botón flotante posicionamiento fijo (sin drag) ---
const initialButtonX = ref(window.innerWidth - 100);
const initialButtonY = ref(window.innerHeight - 100);

const buttonStyle = computed(() => ({
  top: `${initialButtonY.value}px`,
  left: `${initialButtonX.value}px`,
}));
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>