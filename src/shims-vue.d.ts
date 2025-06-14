// src/shims-vue.d.ts o env.d.ts
declare module '*.vue' {

  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
  
}