<template>
  <div class="webcam_container">
    <div class="webcam_box_disabled">
      <div>Webcam</div>

      <button class="btn button_primary mt_8">
        <font-awesome-icon :icon="['fas', 'eye']" /> View
      </button>
    </div>
  </div>
</template>

<script setup></script>

<style scope>
.webcam_container .webcam_box_disabled {
  width: 100%;
  height: 300px;
  align-content: center;
  text-align: center;
  background-color: rgb(0, 0, 0, 0.5);
}
</style>
