import $ from "jquery"
import { IMAGE_H, IMAGE_W } from './data';

export function loading() {
  console.log("Loading...");
  $("#load").html(`
    Loading...<br>
    train.csv 73.22MB<br>
    test.csv 48.75MB<br>
    Large data, please wait a moment.
  `);
}

export function loadingCompleted() {
  console.log("Loading completed!");
  $("#load").html("Loading completed!");
  $("#trainRange").attr("disabled", false);
  $("#saveModel").attr("disabled", false);
  $("#train").attr("disabled", false);
  $("#modelFile").attr("disabled", false);
  $("#modelWeightsFile").attr("disabled", false);
  $("#loadModel").attr("disabled", false);
  $("#trainRange").on('change', () => {
    $("#trainNum").html($("#trainRange").val());
  });
  $("#testRange").on('change', () => {
    $("#testNum").html($("#testRange").val());
  });
}



export function modelCompleted() {
  $("#testRange").attr("disabled", false);
  $("#test").attr("disabled", false);
  $("#testIdInput").attr("disabled", false);
  $("#imgView").attr("disabled", false);
}

function drawPicture(orgs) {
  let canvas = document.getElementById("testImg");
  let context = canvas.getContext("2d");

  for (let i = 0; i < IMAGE_H; i++) {
    for (let j = 0; j < IMAGE_W; j++) {
      let color = orgs[j * IMAGE_H + i];
      context.fillStyle = `rgb(${color},${color},${color})`;
      context.fillRect(i * 10, j * 10, i * 10 + 10, j * 10 + 10);
    }
  }
}

export function showTestView(orgs, label) {
  let id = parseInt($("#testIdInput").val());
  $("#testId").html(id);
  $("#testView").show();
  drawPicture(orgs);
  $("#testImgLabel").html(label);
}

export function getTrainNum() {
  return parseInt($("#trainRange").val());
}

export function getTestNum() {
  return parseInt($("#testRange").val());
}

export function getSingleTestId() {
  return parseInt($("#testIdInput").val());
}

export function trainLog(msg) {
  console.log("train log : " + msg);
  $("#trainMessage").html(msg);
}

export function loadModelLog(msg) {
  console.log("load model log : " + msg);
  $("#loadModelMessage").html(msg);
}

export function testLog(msg) {
  console.log("test log : " + msg);
  $("#testMessage").html(msg);
}

export function viewLog(msg) {
  console.log("view log : " + msg);
  $("#viewMessage").html(msg);
}