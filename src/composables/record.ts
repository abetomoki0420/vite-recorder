import { ref, onMounted } from "vue"

const getMediaRecorder = (): Promise<MediaRecorder> => {
  return new Promise(async (resolve) => {
    const userMedia = await navigator.mediaDevices.getUserMedia({ audio: true })

    resolve(new MediaRecorder(userMedia))
  })
}

type AudioHisotry = {
  id: string
  title: string
  elm: HTMLAudioElement
}

const useRecords = () => {
  const recording = ref(false)
  const audioTitle = ref("")
  const audioHisotry = ref<AudioHisotry[]>([])

  const mediaRecorder = ref<MediaRecorder | null>(null)
  const audioChunks = ref<Blob[]>([])

  onMounted(async () => {
    const mediaRecorder_ = await getMediaRecorder()
    mediaRecorder_.addEventListener("dataavailable", (event) => {
      audioChunks?.value.push(event.data)
    })

    mediaRecorder_.addEventListener("start", () => {
      recording.value = true
    })

    mediaRecorder_.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks.value)
      const audioUrl = URL.createObjectURL(audioBlob)

      audioHisotry.value.push({
        id: new Date().toISOString(),
        title: audioTitle.value,
        elm: new Audio(audioUrl),
      })

      audioTitle.value = ""
      recording.value = false
    })
    mediaRecorder.value = mediaRecorder_
  })

  const start = () => {
    audioChunks.value = []
    mediaRecorder.value?.start()
  }

  const stop = () => {
    mediaRecorder.value?.stop()
  }

  const play = (audio: HTMLAudioElement) => {
    audio.play()
  }

  const clear = (id: string) => {
    audioHisotry.value = audioHisotry.value.filter((history) => {
      return history.id !== id
    })
  }

  return {
    recording,
    audioTitle,
    audioHisotry,
    start,
    stop,
    play,
    clear,
  }
}

export default useRecords
