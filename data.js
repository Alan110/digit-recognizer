import csv2array from "./csv2array"
import * as tf from '@tensorflow/tfjs'
import $ from "jquery"

export const IMAGE_H = 28;
export const IMAGE_W = 28;
const IMAGE_SIZE = IMAGE_H * IMAGE_W;
const NUM_CLASSES = 10;




let trainData;
let testData;

export class MnistData {
  constructor() { }


  async getTrainData() {
    const NUM_TRAIN = trainData.length - 1;
    let datasetBytesBuffer = new ArrayBuffer(NUM_TRAIN * IMAGE_SIZE * 4);
    let datasetLabels = new ArrayBuffer(NUM_TRAIN * NUM_CLASSES);
    for (let i = 0; i < NUM_TRAIN; i++) {
      let datasetByteView = new Float32Array(datasetBytesBuffer, i * IMAGE_SIZE * 4, IMAGE_SIZE);
      let row = trainData[i + 1];
      for (let j = 1; j < row.length; j++) {
        datasetByteView[j - 1] = row[j] / 255;
      }
      let datasetLabelsView = new Uint8Array(datasetLabels, i * NUM_CLASSES, NUM_CLASSES);
      for (let j = 0; j < NUM_CLASSES; j++) {
        datasetLabelsView[j] = (j == row[0] ? 1 : 0);
      }
    }
    let datasetImages = new Float32Array(datasetBytesBuffer);
    let imgLabels = new Uint8Array(datasetLabels);
    console.log(datasetImages);
    console.log(imgLabels);
    const xs = tf.tensor4d(
      datasetImages,
      [datasetImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
    const labels = tf.tensor2d(
      imgLabels, [imgLabels.length / NUM_CLASSES, NUM_CLASSES]);
    return { xs, labels };
  }


  getTestData() {
    const NUM_TEST = testData.length - 1;
    let datasetBytesBuffer = new ArrayBuffer(NUM_TEST * IMAGE_SIZE * 4);
    for (let i = 0; i < NUM_TEST; i++) {
      let datasetByteView = new Float32Array(datasetBytesBuffer, i * IMAGE_SIZE * 4, IMAGE_SIZE);
      let row = testData[i + 1];
      for (let j = 1; j < row.length; j++) {
        datasetByteView[j - 1] = row[j] / 255;
      }
    }
    let datasetImages = new Float32Array(datasetBytesBuffer);
    const xs = tf.tensor4d(
      datasetImages,
      [datasetImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]);
    return { xs };
  }
}

$(function () {
  $.get(require('./data/test.csv'), function (record) {
    console.log(record.length);
    // record = record.split(/\n/);
    // var lineNum = 0;
    // for (var i = 0; i < record.length - 1; i++) {
    //   var t = record[i].split(",");
    //   waterH[lineNum] = parseFloat(t[2]);
    //   lineNum++;
    // }
  });
  $("#train").on("change", () => {
    let reader = new FileReader();
    reader.readAsText(document.getElementById('train').files[0], 'UTF-8');
    reader.onloadend = function (evt) {
      if (evt.target.readyState == FileReader.DONE) {
        trainData = csv2array(reader.result.toString());
        console.log(trainData.length)
      }
    };
  })

  $("#test").on("change", () => {
    let reader = new FileReader();
    reader.readAsText(document.getElementById('test').files[0], 'UTF-8');
    reader.onloadend = function (evt) {
      if (evt.target.readyState == FileReader.DONE) {
        testData = csv2array(reader.result.toString());
        console.log(testData[2])
      }
    };
  })
});
