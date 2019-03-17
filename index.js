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

// type writer effect


function loop(){
  let controllerDataset = new ControllerDataset(NUM_CLASSES);

  // Fetch data from python app below is test case
  //let data = { "Scenario": "This is a test", "Options": { "a": "apple", "b": "banana", "c": "cherry" } }

// will be un commented in future
  // let data = read();
  // console.log(read())


  // let data = { "Scenario": "This is a test", "Options": { "e": "apple", "f": "banana", "g": "cherry" } }
  let data = {"Scenario":"An evil dragon stands in your way. What will you offer it: A Sausage, a Bucket or a Joke?", "Options": {"s":"Sausage","b":"Bucket","j":"Joke"}};

  var label = 0;
  var key = Object.keys(data.Options)[label];
  console.log(key)
  // console.log(data.Options[Object.keys(data.Options)[0]])

//  hacky-no-for-loop
  document.getElementById("image").src = `http://172.21.235.121:8080/${key}.png`
  document.getElementById("letter").innerHTML = key;
 // document.getElementById("image").src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgiajp3QubOG7VD3CUkagxBEe3zwSXzqUscCmPZfGw4Bw4LItT'
//



  // Warm up the model. This uploads weights to the GPU and compiles the WebGL
  // programs so the first time we collect data from the webcam it will be
  // quick.
  // tf.tidy(() => truncatedMobileNet.predict(webcam.capture()));
  window.onload = function(){
      typeWriter();// code goes here
  };

//  master


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
    console.log(key)
    document.getElementById("image").src = `http://172.21.235.121:8080/${key}.png`;
    document.getElementById("letter").innerHTML = key;


  })

  document.getElementById("story").addEventListener("click", () => {
    if(label==2){
    console.log("training network")



    console.log("starting story ...")

    var i = 0;
    var speed = 50;
    var txt = data.Scenario

    function typeWriter() {
      if (i < txt.length) {
        document.getElementById("scenario").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    }
    typeWriter();


// can't figure out why it's predicitng before training
    controllerDataset.train()


    }

    document.getElementById("submit").addEventListener("click", () => {
      let img = webcam.capture();
      var a;
      controllerDataset.predict(img).then(function(result) {
      document.getElementById("choice").innerText = data.Options[Object.keys(data.Options)[result]];
});

    })




    // controllerDataset.train().then(predictLots())




}

  )
}

// background experimental

// Some random colors
// const colors = ["#3CC157", "#2AA7FF", "#1B1B1B", "#FCBC0F", "#F85F36"];
const colors = ["#1B1B1B","#F4F1D6"];

const numBalls = 50;
const balls = [];

for (let i = 0; i < numBalls; i++) {
  let ball = document.createElement("div");
  ball.classList.add("ball");
  ball.style.background = colors[Math.floor(Math.random() * colors.length)];
  ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
  ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
  ball.style.transform = `scale(${Math.random()})`;
  ball.style.width = `${Math.random()}em`;
  ball.style.height = ball.style.width;

  balls.push(ball);
  document.body.append(ball);
}

// <<<<<<< hacky-no-for-loop
// Keyframes
balls.forEach((el, i, ra) => {
  let to = {
    x: Math.random() * (i % 2 === 0 ? -11 : 11)/10,
    y: Math.random() * 12/10
  };

  let anim = el.animate(
    [
      { transform: "translate(0, 0)" },
      { transform: `translate(${to.x}rem, ${to.y}rem)` }
    ],
    {
      duration: (Math.random() + 1) * 2000, // random duration
      direction: "alternate",
      fill: "both",
      iterations: Infinity,
      easing: "ease-in-out"
    }
  );
});





//





document.getElementById("start").addEventListener("click", () => {
  loop();
})




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

function read(pyURL) {
	$.ajax({
            url: pyURL,
            data: $('form').serialize(),
            type: 'POST',
            success: function(response) {
                var current =  JSON.parse(response);
		console.log(current);
            },
            error: function(error) {
                console.log(error);
            }
        });
}

// master
// Initialize the application.
init();
