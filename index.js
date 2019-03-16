/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import 'babel-polyfill';
import * as tf from '@tensorflow/tfjs';

import {ControllerDataset} from './controller_dataset';
import {Webcam} from './webcam';

// The number of classes we want to predict. In this example, we will be
// predicting 4 classes for up, down, left, and right.
const NUM_CLASSES = 4;

// A webcam class that generates Tensors from the images from the webcam.
const webcam = new Webcam(document.getElementById('webcam'));


// The dataset object where we will store activations.
const controllerDataset = new ControllerDataset(NUM_CLASSES);

// now in controller_dataset.js
// async function loadTruncatedMobileNet() {
//   const mobilenet = await tf.loadLayersModel(
//       'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
//
//   // Return a model that outputs an internal activation.
//   const layer = mobilenet.getLayer('conv_pw_13_relu');
//   return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
// }




async function init() {
  try {
    webcam.setup()
  } catch (e) {
    document.getElementById('no-webcam').style.display = 'block';
  }

// now in controller_dataset.js
  // const truncatedMobileNet = await loadTruncatedMobileNet();

  // Warm up the model. This uploads weights to the GPU and compiles the WebGL
  // programs so the first time we collect data from the webcam it will be
  // quick.
  // tf.tidy(() => truncatedMobileNet.predict(webcam.capture()));
  window.onload = function(){
      typeWriter();// code goes here
  };


  document.getElementById("capture").addEventListener("click", () => {
    let img = webcam.capture();
    controllerDataset.addExample(img, 0);
  })

  document.getElementById("train").addEventListener("click", () => {
    controllerDataset.train();
  })

  document.getElementById("predict").addEventListener("click", () => {
    let img = webcam.capture();
    controllerDataset.predict(img);
  })
}


// type writer effect
var i = 0;
var speed = 50;
var txt = "This is a scenario. You have been presented with an [a]pple, [b]annana, and a [c]herry. Which do you choose?"

function typeWriter() {
  if (i < txt.length) {
    document.getElementById("scenario").innerHTML += txt.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}


// Initialize the application.
init();
