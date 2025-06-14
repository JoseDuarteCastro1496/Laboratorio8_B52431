// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import Layout from '@/components/Layout.vue';
import ProyectsView from '@/views/ProyectsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '', // Ruta por defecto dentro del Layout
          name: 'home',
          component: ProyectsView,
          // No necesitamos `props: true` si Layout pasa las props directamente a <router-view>
          // O si quisieras pasar props ESTATICAS a ProyectsView:
          // props: { someStaticProp: 'value' }
          // O si quisieras pasar params de la URL como props:
          // props: true
        },
        {
          path: 'proyectos',
          name: 'proyectos',
          component: ProyectsView,
        },
      ],
    },
  ],
});

export default router;