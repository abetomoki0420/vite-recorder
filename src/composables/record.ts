import { ref, onMounted } from "vue"
import { encode, decode } from "base64-arraybuffer"

const getMediaRecorder = (): Promise<MediaRecorder> => {
  return new Promise(async (resolve) => {
    const userMedia = await navigator.mediaDevices.getUserMedia({ audio: true })

    resolve(new MediaRecorder(userMedia))
  })
}

type StopObserver = (data: any) => void

type Options = {
  onStop: StopObserver
}

const useRecords = (options: Options) => {
  const recording = ref(false)
  const audioTitle = ref("")

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

    const stopHandler = async () => {
      const audioBlob = new Blob(audioChunks.value)
      const data = await audioBlob.arrayBuffer()
      const encodedData = encode(data)

      options.onStop({
        id: new Date().toISOString(),
        title: audioTitle.value,
        encodedData,
      })

      audioTitle.value = ""
      recording.value = false
    }

    mediaRecorder_.addEventListener("stop", stopHandler)
    mediaRecorder.value = mediaRecorder_
  })

  const start = () => {
    audioChunks.value = []
    mediaRecorder.value?.start()
  }

  const stop = () => {
    mediaRecorder.value?.stop()
  }

  const play = (encodedData: string) => {
    const arrayBuffer = decode(encodedData)
    const audioBlob = new Blob([arrayBuffer])
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)

    audio.play()
  }

  return {
    recording,
    audioTitle,
    start,
    stop,
    play,
  }
}

export default useRecords
