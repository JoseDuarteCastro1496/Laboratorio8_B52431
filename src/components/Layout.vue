<template>
  <div class="flex h-screen bg-base-300 text-base-content" data-theme="dark">
    <Sidebar :projects="projects" />

    <div class="flex-1 flex flex-col">
      <Header />

      <main class="flex-1 p-4 overflow-y-auto">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';

const projects = ref([]); // O un array vacío, ya que ProyectsView será la fuente.

</script>

<style scoped>
/* Estilos específicos para Layout si son necesarios */
</style>