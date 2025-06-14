<template>
  <aside class="w-64 bg-base-200 text-base-content min-h-screen p-4 flex flex-col shadow-lg z-20">
    <h2 class="text-xl font-bold mb-4 text-primary">Proyectos</h2>
    <p class="text-sm text-neutral-content mb-6">
      {{ projects.length === 0 ? 'No hay proyectos' : `Total: ${projects.length} proyectos` }}
    </p>

    <ul class="menu bg-base-200 w-full rounded-box flex-grow">
      <li>
        <a class="active">
          Mis Proyectos
          <span class="badge badge-sm badge-ghost ml-auto">{{ projects.length }}</span>
        </a>
      </li>

      <li>
        <details open>
          <summary>Lista de Proyectos</summary>
          <ul>
            <li v-for="project in projects" :key="project.id">
              <a>{{ project.name }}</a>
            </li>
            <li v-if="projects.length === 0">
              <a>No hay proyectos aún.</a>
            </li>
          </ul>
        </details>
      </li>

      <li>
        <details>
          <summary>Parent (Otra Sección)</summary>
          <ul>
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </details>
      </li>
      <li><a>Item 3 (Otro Enlace)</a></li>
    </ul>

    <div class="mt-auto flex justify-around p-2 border-t border-base-content border-opacity-20">
      <button class="btn btn-circle btn-sm btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2v8m0-8a2 2 0 100-4v4m0 0H6m6 0h6m-6 0a2 2 0 100-4v4m0 0H6m6 0h6m-6 0a2 2 0 100-4v4m0 0H6m6 0h6"></path></svg>
      </button>
      <button class="btn btn-circle btn-sm btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2v8m0-8a2 2 0 100-4v4m0 0H6m6 0h6m-6 0a2 2 0 100-4v4m0 0H6m6 0h6m-6 0a2 2 0 100-4v4m0 0H6m6 0h6"></path></svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'; // Eliminar defineProps

// --- Local Storage Persistence para Sidebar ---
const STORAGE_KEY = 'projects';
const projects = ref([]); // Inicialmente vacío o puedes poner un array por defecto si lo prefieres

// Cargar proyectos al montar el componente
onMounted(() => {
  const storedProjects = localStorage.getItem(STORAGE_KEY);
  if (storedProjects) {
    try {
      projects.value = JSON.parse(storedProjects);
    } catch (error) {
      console.error("Error al parsear proyectos desde localStorage en Sidebar:", error);
      projects.value = []; // Si hay error, dejar vacío
    }
  }

  // Opcional: Escuchar eventos de storage para actualizar si otra pestaña cambia localStorage
  window.addEventListener('storage', handleStorageChange);
});

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});

// Función para manejar cambios en localStorage desde otras pestañas/ventanas
const handleStorageChange = (event) => {
  if (event.key === STORAGE_KEY && event.newValue) {
    try {
      projects.value = JSON.parse(event.newValue);
    } catch (error) {
      console.error("Error al actualizar proyectos desde storage event:", error);
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para Sidebar si son necesarios */
</style>