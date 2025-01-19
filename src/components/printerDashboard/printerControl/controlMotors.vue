<template>
  <h3 class="mt_0 mb_24">Motion Control</h3>

  <div class="control_buttons">
    <div class="xy_z_ext_button">
      <div class="xy_buttons">
        <div>
          <button class="btn button_primary" @click="move_Y(1)">+Y</button>
        </div>
        <div class="x_buttons mt_8">
          <button class="btn button_primary" @click="move_X(1)">+X</button>
          <button
            class="btn"
            @click="home_XY()"
            :class="{
              'btn button_primary': GeneralVariablesStore.controlStatus.homed_axes.includes('xy'),
              'btn button_primary_empty':
                !GeneralVariablesStore.controlStatus.homed_axes.includes('xy'),
            }"
          >
            <font-awesome-icon :icon="['fas', 'house']" />
          </button>
          <button class="btn button_primary" @click="move_X(-1)">-X</button>
        </div>
        <div class="mt_8">
          <button class="btn button_primary" @click="move_Y(-1)">-Y</button>
        </div>
      </div>

      <div class="z_buttons">
        <button class="btn button_primary" @click="move_Z(-1)">
          <font-awesome-icon :icon="['fas', 'angle-up']" />
        </button>
        <button
          class="btn mt_8"
          @click="printerStore.setHomeFull()"
          :class="{
            'btn button_primary': GeneralVariablesStore.controlStatus.homed_axes.includes('z'),
            'btn button_primary_empty':
              !GeneralVariablesStore.controlStatus.homed_axes.includes('z'),
          }"
        >
          Z
        </button>
        <button class="btn button_primary mt_8" @click="move_Z(1)">
          <font-awesome-icon :icon="['fas', 'angle-down']" />
        </button>
      </div>

      <div class="ext_buttons">
        <button class="btn button_primary" @click="move_Ext(1)">-Ext</button>
        <button class="btn button_primary_empty btn_home mt_8" disabled>
          <font-awesome-icon :icon="['fas', 'gears']" />
        </button>
        <button class="btn button_primary mt_8" @click="move_Ext(1)">+Ext</button>
      </div>
    </div>
    <div class="belt_control mt_20">
      <button class="btn button_primary btn_left" @click="move_Belt(-1)">-Belt</button>
      <button class="btn button_primary_empty btn_home" disabled>
        <font-awesome-icon :icon="['fas', 'circle-radiation']" />
      </button>
      <button class="btn button_primary btn_right" @click="move_Belt(1)">+Belt</button>
    </div>

    <div class="distance_buttons mt_20">
      <button
        class="btn btn_first"
        :class="distance === 0.1 ? 'button_primary' : 'button_primary_empty'"
        @click="setDistance(0.1)"
      >
        0.1mm
      </button>
      <button
        class="btn"
        :class="distance === 1 ? 'button_primary' : 'button_primary_empty'"
        @click="setDistance(1)"
      >
        1mm
      </button>
      <button
        class="btn"
        :class="distance === 10 ? 'button_primary' : 'button_primary_empty'"
        @click="setDistance(10)"
      >
        10mm
      </button>
      <button
        class="btn btn_last"
        :class="distance === 100 ? 'button_primary' : 'button_primary_empty'"
        @click="setDistance(100)"
      >
        100mm
      </button>
    </div>
  </div>
</template>

<script setup>
import { useGeneralVariablesStore } from '@/stores/useGeneralVariablesStore'
import { usePrinterStore } from '@/stores/usePrinterStore'
import { ref } from 'vue'

// Variables
const GeneralVariablesStore = useGeneralVariablesStore()
const printerStore = usePrinterStore()
const distance = ref(1)

// Methods
const setDistance = (value) => {
  distance.value = value
}

const home_XY = () => {
  printerStore.setHomeX()
  printerStore.setHomeY()
}

const move_Y = (direction) => {
  printerStore.moveYaxes(distance.value * direction)
}

const move_X = (direction) => {
  printerStore.moveXaxes(distance.value * direction)
}

const move_Z = (direction) => {
  printerStore.moveZaxes(distance.value * direction)
}

const move_Ext = (direction) => {
  let distance_to_move = distance.value
  if (distance_to_move > 10) {
    distance_to_move = 10
  }
  if (distance.value) printerStore.moveExtruder(distance_to_move * direction)
}

const move_Belt = (direction) => {
  console.log(distance.value * direction)
  printerStore.moveBelt(distance.value * direction)
}
</script>

<style scope>
.control_buttons {
  max-width: 350px;
}

.xy_z_ext_button {
  display: flex;
  justify-content: space-between;
}

.xy_buttons {
  width: 160px;
  text-align: center;
}

.xy_buttons .btn {
  width: 50px;
  height: 40px;
}

.xy_buttons .x_buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.z_buttons .btn {
  display: block;
  width: 50px;
  height: 40px;
}

.ext_buttons .btn {
  display: block;
  width: 50px;
  height: 40px;
}

.ext_buttons .btn_home:hover {
  color: var(--primary-font-color);
  background-color: transparent;
}

.belt_control {
  display: flex;
  justify-content: center;
}

.belt_control .btn {
  width: 117px;
  height: 40px;
}

.belt_control .btn_home {
  width: 50px;
  height: 40px;
  border-radius: 0;
}

.belt_control .btn_home:hover {
  color: var(--primary-font-color);
  background-color: transparent;
}

.belt_control .btn_left {
  border-radius: 20px 0 0 20px;
}

.belt_control .btn_right {
  border-radius: 0 20px 20px 0;
}

.distance_buttons {
  display: flex;
}

.distance_buttons .btn {
  border-radius: 0px;
  flex: 1 1 100%;
}

.distance_buttons .btn_first {
  border-radius: 5px 0 0 5px;
}

.distance_buttons .btn_last {
  border-radius: 0 5px 5px 0;
}
</style>
