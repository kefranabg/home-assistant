import * as cv from 'opencv4nodejs'
import path from 'path'

const classifier = new cv.CascadeClassifier(
  path.join(__dirname, '..', `assets/haarcascade_frontalface_alt.xml`)
)

export default grayImg => {
  const faceRects = classifier.detectMultiScale(grayImg).objects
  if (!faceRects.length) {
    throw new Error('failed to detect faces')
  }
  return grayImg.getRegion(faceRects[0])
}
