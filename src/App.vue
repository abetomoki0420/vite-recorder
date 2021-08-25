<script setup lang="ts">
import { computed } from "vue"
import useRecords from "./composables/record"

const { recording, start, stop, play, clear, audioTitle, audioHisotry } =
  useRecords()

const disableInputTitle = computed(() => {
  if (recording.value) {
    return true
  }

  return false
})

const disabledStart = computed(() => {
  if (audioTitle.value.length === 0) {
    return true
  }

  return false
})
</script>
<template>
  <div class="container">
    <div class="recorder">
      <h2>Recording</h2>
      <div>
        <input v-model="audioTitle" type="text" :disabled="disableInputTitle" />
        <button v-if="recording" @click="stop">Stop</button>
        <button v-else @click="start" :disabled="disabledStart">Start</button>
      </div>
      <div>
        <h3>history</h3>
        <div>
          <template v-if="audioHisotry.length > 0">
            <ol>
              <li v-for="history in audioHisotry">
                <span>{{ history.title }}</span>
                <button @click="play(history.elm)">Play</button>
                <button @click="clear(history.id)">x</button>
              </li>
            </ol>
          </template>
          <template v-else>
            <span>no records...</span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  justify-content: center;
}

.recorder {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
