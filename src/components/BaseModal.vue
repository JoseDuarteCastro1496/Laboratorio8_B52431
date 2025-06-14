<template>
  <dialog :id="modalId" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">
        <slot name="title">Modal de prueba</slot>
      </h3>

      <p class="py-4">
        <slot name="body">Prueba de funcionamiento modal.</slot>
      </p>

      <div class="modal-action">
        <slot name="actions">
          <form method="dialog">
            <button class="btn">Cerrar</button>
          </form>
        </slot>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { defineProps, defineExpose } from 'vue';

const props = defineProps({
  modalId: {
    type: String,
    required: true,
    default: 'default_modal_id'
  }
});

const openModal = () => {
  const modalElement = document.getElementById(props.modalId);
  if (modalElement) {
    modalElement.showModal();
  }
};

const close = () => { // Función para cerrar el modal programáticamente
  const modalElement = document.getElementById(props.modalId);
  if (modalElement) {
    modalElement.close();
  }
};

defineExpose({
  openModal,
  close // <-- Asegúrate de que 'close' está aquí
});
</script>

<style scoped>
/* Puedes añadir estilos específicos del modal si no están cubiertos por DaisyUI */
</style>