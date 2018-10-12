<template>
  <div id="wrapper">
    <main>
      <h1>Hello world!</h1>
      <canvas id="myCanvas" width="200" height="200">
        Affichage d'un texte pour les navigateurs qui ne supportent pas canvas
      </canvas>
    </main>
  </div>
</template>

<script>
import * as cv from 'opencv4nodejs'
import path from 'path'

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

      // console.log(cv.FACE_CASCADE)

      // console.log(frame)
      // frame.detectObject(cv.FACE_CASCADE, {}, (err, faces) => {
      //   if (err) throw err
      //   faces.forEach(face => {
      //     frame.rectangle(
      //       [face.x, face.y],
      //       [face.width, face.height],
      //       rectColor,
      //       rectThickness
      //     )
      //   })
      // })
      // console.log(frame)
      const img = frame.bgrToGray()
      const faceRects = classifier.detectMultiScale(img).objects
      if (faceRects.length) {
        const faceImg = img.getRegion(faceRects[0])
        console.log('FACE !', faceImg)
      }

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
    }, 1)
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
