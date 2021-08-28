import { initializeApp } from "firebase/app"

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore"

import { config } from "@/firebase.config"

const firebaseInit = () => {
  const app = initializeApp(config)
  return app
}

const useFirebase = () => {
  const app = firebaseInit()
  const db = getFirestore(app)

  const getCollection = (collectionName: string) => {
    const collectionRef = collection(db, collectionName)

    return {
      observe: (cb: (data: any) => void) => {
        onSnapshot(collectionRef, (snapshot) => {
          const temp = [] as any
          snapshot.forEach((doc) => {
            temp.push(doc.data())
          })
          cb(temp)
        })
      },
      save: (data: any) => {
        addDoc(collectionRef, data)
      },
    }
  }

  return {
    getCollection,
  }
}

export default useFirebase
