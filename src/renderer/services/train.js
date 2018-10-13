import * as cv from 'opencv4nodejs'
import getFaceImage from '@/services/get-face-img.js'
import fs from 'fs'
import path from 'path'

const basePath = 'assets/trainer-img'
const imgsPath = path.join(__dirname, '..', basePath)

const names = ['Franck', 'Sophie']

const imgFiles = fs.readdirSync(imgsPath)

const trainImages = imgFiles
  // get absolute file path
  .map(file => path.resolve(imgsPath, file))
  // read image
  .map(filePath => cv.imread(filePath))
  // face recognizer works with gray scale images
  .map(img => img.bgrToGray())
  // detect and extract face
  .map(getFaceImage)
  // face images must be equally sized
  .map(faceImg => faceImg.resize(80, 80))

const labels = imgFiles.map(file =>
  names.findIndex(name => file.includes(name.toLowerCase()))
)
const eigen = new cv.EigenFaceRecognizer()
// const fisher = new cv.FisherFaceRecognizer()
const lbph = new cv.LBPHFaceRecognizer()

eigen.train(trainImages, labels)
// fisher.train(trainImages, [0, 0, 0])
lbph.train(trainImages, labels)

export { eigen, lbph, names }
