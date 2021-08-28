<script setup lang="ts">
import { ref, computed } from "vue"
import useFirebase from "@/composables/firebase"
import useRecords from "@/composables/record"

const { getCollection } = useFirebase()

const recordsCollection = getCollection("records")

const records = ref<any>([])
recordsCollection.observe((data) => {
  records.value = data
})

const save = async (data: any) => {
  const { id, title, encodedData } = data

  recordsCollection.save({
    id,
    title,
    encodedData,
  })
}

const { recording, start, stop, play, audioTitle } = useRecords({
  onStop: async (data) => {
    await save(data)
  },
})

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
          <template v-if="records.length > 0">
            <ol>
              <li v-for="record in records">
                <span>{{ record.title }}</span>
                <button @click="play(record.encodedData)">Play</button>
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
