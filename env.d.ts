/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // Puedes eliminar o comentar esta línea si no usas VITE_APP_TITLE
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
