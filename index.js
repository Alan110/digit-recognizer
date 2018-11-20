import * as tf from '@tensorflow/tfjs'
import { IMAGE_H, IMAGE_W, MnistData } from './data';
import $ from "jquery"
import CSV from 'comma-separated-values';


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

function createDenseModel() {
  const model = tf.sequential();
  model.add(tf.layers.flatten({ inputShape: [IMAGE_H, IMAGE_W, 1] }));
  model.add(tf.layers.dense({ units: 42, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));
  return model;
}

async function train() {

  let model = createConvModel();
  

  let data = new MnistData();
  console.log('Training model...');

  const LEARNING_RATE = 0.01;
  const optimizer = 'rmsprop';

  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  const batchSize = 64;
  const validationSplit = 0.15;


  let trainBatchCount = 0;

  const trainData = data.getTrainData();
  const testData = data.getTestData();


  await model.fit(trainData.xs, trainData.labels, {});
  console.log("train finshing")
  let output = model.predict(testData.xs);
  const saveResults = await model.save('downloads://my-dd');
  console.log("predict finshing")
  const axis = 1;
  const predictions = Array.from(output.argMax(axis).dataSync());
  // let csvData = [["ImageId","Label"]];
  // for(let i=0;i<predictions.length;i++){
  //   csvData.push([i+1,predictions[i]]);
  // }
  // const encoded = new CSV(csvData, {}).encode();
  // const dataBlob = new Blob([`\ufeff${encoded}`], { type: 'text/plain;charset=utf-8' });
  // const a = document.createElement('a');
  // a.href = window.URL.createObjectURL(dataBlob);
  // a.download = "val.csv";
  // a.click();
  // const testResult = model.predict(testData.xs, testData.labels);
  // console.log(testResult)
//   const testAccPercent = testResult[1].dataSync()[0] * 100;
//   const finalValAccPercent = valAcc * 100;

//   console.log(`Final validation accuracy: ${finalValAccPercent.toFixed(1)}%; `);
//   console.log(`Final test accuracy: ${testAccPercent.toFixed(1)}%`);
}

async function train2(){
  const jsonUpload = document.getElementById('model');
  const weightsUpload = document.getElementById('model-weight');
  
  const model = await tf.loadModel(tf.io.browserFiles([jsonUpload.files[0], weightsUpload.files[0]]));
  let data = new MnistData();
  const testData = data.getTestData();
  let output = model.predict(testData.xs);
  console.log("predict finshing")
  const axis = 1;
  const predictions = Array.from(output.argMax(axis).dataSync());
  console.log(predictions);
  let csvData = [["ImageId","Label"]];
  for(let i=0;i<predictions.length;i++){
    csvData.push([i+1,predictions[i]]);
  }
  const encoded = new CSV(csvData, {}).encode();
  const dataBlob = new Blob([`\ufeff${encoded}`], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = window.URL.createObjectURL(dataBlob);
  a.download = "val.csv";
  a.click();
}

$("#btn").on('click',()=>{
  console.log("aaa")
  train()
});

$("#btn2").on('click',()=>{
  train2()
})
