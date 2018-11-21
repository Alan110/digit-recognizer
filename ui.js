import $ from "jquery"
import { IMAGE_H, IMAGE_W, Data } from './data';
import { testOne } from "./index"

export function loading() {
  console.log("loading...");
  $("#load").html("loading...");
}

export function loadingCompleted() {
  console.log("loading completed!");
  $("#load").html("loading completed!");
  $("#run").show();
  $("#trainParam").show();
  $("#trainRange").on('change', () => {
    $("#trainNum").html($("#trainRange").val());
  });
  $("#testRange").on('change', () => {
    $("#testNum").html($("#testRange").val());
  });
}

function drawPicture(orgs) {
  let canvas = document.getElementById("testImg");
  let context = canvas.getContext("2d");

  for (let i = 0; i < IMAGE_H; i++) {
    for (let j = 0; j < IMAGE_W; j++) {
      let color = orgs[j * IMAGE_H + i];
      context.fillStyle = `rgb(${color},${color},${color})`;
      context.fillRect(i*10, j*10, i*10+10, j*10+10);
    }
  }
}

export function trainCompleted() {
  $("#testParam").show();
  $("#imgView").on('click', () => {
    let id = parseInt($("#testId").val());
    let singleData = Data.getSingleTestData(id);
    $("#testView").show();
    let val = testOne(singleData.xs);
    drawPicture(singleData.orgs);
    $("#testImgLabel").html(val);
  });
}

export function getTrainNum() {
  return parseInt($("#trainRange").val());
}

export function getTestNum() {
  return parseInt($("#testRange").val());
}

export function trainLog(msg) {
  console.log("train log : " + msg);
  $("#trainMessage").html(msg);
}

export function testLog(msg) {
  console.log("test log : " + msg);
  $("#testMessage").html(msg);
}

export function viewLog(msg) {
  console.log("view log : " + msg);
  $("#viewMessage").html(msg);
}