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

import { ControllerDataset } from './controller_dataset';
import { Webcam } from './webcam';

// The number of classes we want to predict. In this example, we will be
// predicting 4 classes for up, down, left, and right.
const NUM_CLASSES = 3;

// A webcam class that generates Tensors from the images from the webcam.
const webcam = new Webcam(document.getElementById('webcam'));


async function init() {
  try {
    webcam.setup()
  } catch (e) {
    document.getElementById('no-webcam').style.display = 'block';
  }
}


// function loop() {
//
//
//   while (true) {
//     // The dataset object where we will store activations.
//     let controllerDataset = new ControllerDataset(NUM_CLASSES);
//
//     // Fetch data from python app
//     let data = { "Scenario": "This is a test", "Options": { "a": "apple", "b": "banana", "c": "cherry" } }
//
//     // For each option
//
//
//       document.getElementById("image").src = `images/${key}.png`
//
//       for (let x=1; x<30; x++) {
//         controllerDataset.addExample(webcam.capture(), 0)
//       }
//
//     })
//     break;
//     // Display image, and train
//
//     // Use the data to populate text on the screen
//
//     // User completes scenario
//   }
// }

function loop(){
  let controllerDataset = new ControllerDataset(NUM_CLASSES);

  // Fetch data from python app below is test case
  let data = { "Scenario": "This is a test", "Options": { "a": "apple", "b": "banana", "c": "cherry" } }

  var label = 0;
  var key = Object.keys(data.Options)[label];
  console.log(key)
  document.getElementById("image").src = `images/${key}.png`


  document.getElementById("train").addEventListener("click", () => {
    console.log("training ...")
    for (let x=1; x<30; x++) {
      controllerDataset.addExample(webcam.capture(), label)
      console.log(`training on label ${label}`)
    }

  })

  document.getElementById("next").addEventListener("click", () => {
    console.log("moving on to next image ...")

    label++;
    var key = Object.keys(data.Options)[label];
    document.getElementById("image").src = `images/${key}.png`;


  })

  document.getElementById("story").addEventListener("click", () => {
    if(label==2){
    console.log("starting story ...")
  }

  })


}


document.getElementById("start").addEventListener("click", () => {
  loop();
})

// Initialize the application.
init();
