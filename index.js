import 'bootstrap/dist/css/bootstrap.min.css'
import * as tf from '@tensorflow/tfjs'
import { IMAGE_H, IMAGE_W, Data } from './data'
import $ from "jquery"
import CSV from 'comma-separated-values'
import * as ui from "./ui"



function createConvModel() {
  const model = tf.sequential();

  model.add(tf.layers.conv2d({
    inputShape: [IMAGE_H, IMAGE_W, 1],
    kernelSize: 3,
    filters: 16,
    activation: 'relu'
  }));

  model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
  model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
  model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));
  model.add(tf.layers.conv2d({ kernelSize: 3, filters: 32, activation: 'relu' }));
  model.add(tf.layers.flatten({}));

  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

  return model;
}

async function init() {
  ui.loading();
  await Data.load();
  ui.loadingCompleted();
  $("#saveModel").on('click', () => {
    saveModel();
  });
  $("#train").on('click', () => {
    trainModel();
  });
  $("#loadModel").on('click', () => {
    loadModel();
  });
  $("#test").on('click', () => {
    test();
  });
  $("#imgView").on('click', () => {
    testOne();
  });
}

function downloadCsv(csv) {
  const encoded = new CSV(csv, {}).encode();
  const dataBlob = new Blob([`\ufeff${encoded}`], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(dataBlob);
  a.download = "val.csv";
  a.click();
}

let model;
async function trainModel() {

  ui.trainLog('Create model...');
  model = createConvModel();

  // const LEARNING_RATE = 0.01;
  ui.trainLog('Compile model...');
  const optimizer = 'rmsprop';
  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  const trainData = Data.getTrainData(ui.getTrainNum());

  ui.trainLog('Training model...');
  await model.fit(trainData.xs, trainData.labels, {});

  ui.trainLog('Completed!');
  ui.modelCompleted();
}

async function saveModel(){
  if (!model) {
    alert('Model does not exist');
    return;
  }
  await model.save('downloads://my-model');
}

async function loadModel() {
  ui.loadModelLog('Load model...');

  const jsonUpload = document.getElementById('modelFile');
  const weightsUpload = document.getElementById('modelWeightsFile');

  model = await tf.loadModel(tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]));

  ui.loadModelLog('Completed!');
  ui.modelCompleted();
}

function test() {
  ui.testLog('Testing...');
  const testData = Data.getTestData(ui.getTestNum());
  let output = model.predict(testData.xs);
  ui.testLog('Completed!');
  const axis = 1;
  const predictions = Array.from(output.argMax(axis).dataSync());
  let csvData = [["ImageId", "Label"]];
  for (let i = 0; i < predictions.length; i++) {
    csvData.push([i + 1, predictions[i]]);
  }
  downloadCsv(csvData);
}

function testOne() {
  if (!model) {
    alert('Need to train the model first');
    return;
  }
  ui.viewLog('Testing...');
  let id = ui.getSingleTestId();
  let singleData = Data.getSingleTestData(id);
  let output = model.predict(singleData.xs);
  output.print();
  const axis = 1;
  const predictions = output.argMax(axis).dataSync();
  ui.showTestView(singleData.orgs, predictions[0]);
  ui.viewLog('Completed!');
}

$(function () {
  init();
})
