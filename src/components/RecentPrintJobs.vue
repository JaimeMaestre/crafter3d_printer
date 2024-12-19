<template>
  <div class="recent-print-jobs box">
    <h2>Recent Print Jobs</h2>
    <ul>
      <li v-for="(job, index) in recentJobs" :key="index">
        {{ job }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const recentJobs = ref(['job1.gcode', 'job2.gcode', 'job3.gcode', 'job4.gcode', 'job5.gcode']); // Mock data
</script>

<style scoped>
.box {
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}
</style>
