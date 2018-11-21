import * as tf from '@tensorflow/tfjs'
import $ from "jquery"


const TRAIN_CSV_PATH = require("./data/train.csv");
const TEST_CSV_PATH = require("./data/test.csv");

export const IMAGE_H = 28;
export const IMAGE_W = 28;
export const IMAGE_SIZE = IMAGE_H * IMAGE_W;
const NUM_CLASSES = 10;

function getCsv(path) {
  return new Promise((resolve, reject) => {
    $.get(path, function (data) {
      let csv = [];
      const rows = data.split(/\n/);
      for (let i = 0; i < rows.length - 1; i++) {
        csv.push([]);
        const cols = rows[i].split(",");
        for (let j = 0; j < cols.length; j++) {
          let val;
          try {
            val = parseFloat(cols[j]);
            if (isNaN(val) || val === undefined || val === null) {
              val = cols[j];
            }
          } catch (e) {
            val = cols[j];
          }
          csv[i].push(val);
        }
      }
      resolve(csv);
    });
  })
}

export class Data {
  constructor() { }

  static async load() {
    this.trainCsv = await getCsv(TRAIN_CSV_PATH);
    this.testCsv = await getCsv(TEST_CSV_PATH);
  }

  static getTrainData(amount) {
    if (amount > this.trainCsv.length - 1) {
      amount = this.trainCsv.length;
    }
    let datasetBuffer = new ArrayBuffer(amount * IMAGE_SIZE * 4);
    let labelsBuffer = new ArrayBuffer(amount * NUM_CLASSES);
    for (let i = 0; i < amount; i++) {
      let datasetView = new Float32Array(datasetBuffer, i * IMAGE_SIZE * 4, IMAGE_SIZE);
      let row = this.trainCsv[i + 1];
      for (let j = 1; j < row.length; j++) {
        datasetView[j - 1] = row[j] / 255;
      }
      let labelsView = new Uint8Array(labelsBuffer, i * NUM_CLASSES, NUM_CLASSES);
      for (let j = 0; j < NUM_CLASSES; j++) {
        labelsView[j] = (j == row[0] ? 1 : 0);
      }
    }
    let dataset = new Float32Array(datasetBuffer);
    let labels = new Uint8Array(labelsBuffer);
    return {
      xs: tf.tensor4d(dataset, [dataset.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1]),
      labels: tf.tensor2d(labels, [labels.length / NUM_CLASSES, NUM_CLASSES])
    };
  }

  static getTestData(amount) {
    if (amount > this.testCsv.length - 1) {
      amount = this.testCsv.length;
    }
    let datasetBuffer = new ArrayBuffer(amount * IMAGE_SIZE * 4);
    for (let i = 0; i < amount; i++) {
      let datasetView = new Float32Array(datasetBuffer, i * IMAGE_SIZE * 4, IMAGE_SIZE);
      let row = this.testCsv[i + 1];
      for (let j = 0; j < row.length; j++) {
        datasetView[j] = row[j] / 255;
      }
    }
    let dataset = new Float32Array(datasetBuffer);
    return {
      xs: tf.tensor4d(dataset, [dataset.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1])
    };
  }

  static getSingleTestData(id) {
    let datasetView = new Float32Array(IMAGE_SIZE);
    let row = this.testCsv[id];
    for (let j = 0; j < row.length; j++) {
      datasetView[j] = row[j] / 255;
    }
    return {
      xs: tf.tensor4d(datasetView, [1, IMAGE_H, IMAGE_W, 1]),
      orgs: JSON.parse(JSON.stringify(row))
    };
  }
}