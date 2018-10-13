<template>
  <div id="wrapper">
    <main>
      <canvas id="myCanvas" width="200" height="200">
        Affichage d'un texte pour les navigateurs qui ne supportent pas canvas
      </canvas>
    </main>
  </div>
</template>

<script>
import * as cv from 'opencv4nodejs'
import path from 'path'
import { lbph, names } from '@/services/train'

export default {
  name: 'LandingPage',
  mounted() {
    // open capture from webcam
    const devicePort = 0
    const vCap = new cv.VideoCapture(devicePort)

    // read frames from capture
    // const frame = vCap.read()
    // vCap.readAsync((err, frame) => {
    //   console.log(frame)
    // })

    // loop through the capture
    // const delay = 25
    // let done = false
    // const rectColor = [0, 255, 0]
    // const rectThickness = 2

    // console.log('HAAR_FRONTALFACE_ALT2', frontalface)

    const classifier = new cv.CascadeClassifier(
      path.join(__dirname, '..', `assets/haarcascade_frontalface_alt.xml`)
    )

    setInterval(() => {
      let frame = vCap.read()
      const img = frame.bgrToGray()

      const faceRects = classifier.detectMultiScale(img).objects
      if (faceRects.length) {
        const faceImg = img.getRegion(faceRects[0])
        // console.log('FACE !', faceImg)

        const resizedFaceImg = faceImg.resize(80, 80)

        const runPrediction = recognizer => {
          const result = recognizer.predict(resizedFaceImg)
          if (result && result.label !== -1)
            console.log(
              'Visage trouve ! celui de : %s, probabilité: %s',
              names[result.label],
              result.confidence
            )
          // cv.imshowWait('face', resizedFaceImg)
          // cv.destroyAllWindows()
        }

        // console.log('eigen:')
        // runPrediction(eigen)

        // console.log('fisher:')
        // runPrediction(fisher)

        // console.log('lbph:')
        runPrediction(lbph)
      }

      frame = frame.resize(320, 480)

      const matRGBA =
        frame.channels === 1
          ? frame.cvtColor(cv.COLOR_GRAY2RGBA)
          : frame.cvtColor(cv.COLOR_BGR2RGBA)
      const imgData = new ImageData(
        new Uint8ClampedArray(matRGBA.getData()),
        frame.cols,
        frame.rows
      )

      // set canvas dimensions
      const canvas = document.getElementById('myCanvas')
      canvas.height = frame.rows
      canvas.width = frame.cols

      // set image data
      const ctx = canvas.getContext('2d')
      ctx.putImageData(imgData, 0, 0)
      // loop back to start on end of stream reached
      if (frame.empty) {
        vCap.reset()
        frame = vCap.read()
      }

      // ...

      // const key = cv.waitKey(delay)
      // console.log(key)

      // done = key !== 255
      // console.log(!done)
    }, 100)
  },
  methods: {
    open(link) {
      this.$electron.shell.openExternal(link)
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

main {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: black;
}

h1 {
  color: white;
}
</style>
