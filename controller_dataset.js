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
import * as tf from '@tensorflow/tfjs';
import {Webcam} from './webcam';

let truncatedMobileNet;
let model;
// const truncatedMobileNet = await loadTruncatedMobileNet();
loadTruncatedMobileNet().then((result) => {
  truncatedMobileNet =  result;

  let webcam = new Webcam(document.getElementById('webcam'));
  tf.tidy(() => truncatedMobileNet.predict(webcam.capture()));
});



/**
 * A dataset for webcam controls which allows the user to add example Tensors
 * for particular labels. This object will concat them into two large xs and ys.
 */

async function loadTruncatedMobileNet() {
   const mobilenet = await tf.loadLayersModel(
       'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

   // Return a model that outputs an internal activation.
   const layer = mobilenet.getLayer('conv_pw_13_relu');
   return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
 }



export class ControllerDataset {
  constructor(numClasses) {
    this.numClasses = numClasses;

  }

  /**
   * Adds an example to the controller dataset.
   * @param {Tensor} example A tensor representing the example. It can be an image,
   *     an activation, or any other type of Tensor.
   * @param {number} label The label of the example. Should be a number.
   */
  async addExample(img, label) {
    // console.log(truncatedMobileNet)
    let example =  truncatedMobileNet.predict(img);

    // One-hot encode the label.
    const y = tf.tidy(
      () => tf.oneHot(tf.tensor1d([label]).toInt(), this.numClasses));

    if (this.xs == null) {
      // For the first example that gets added, keep example and y so that the
      // ControllerDataset owns the memory of the inputs. This makes sure that
      // if addExample() is called in a tf.tidy(), these Tensors will not get
      // disposed.
      this.xs = tf.keep(example);
      this.ys = tf.keep(y);
    } else {
      const oldX = this.xs;
      this.xs = tf.keep(oldX.concat(example, 0));

      const oldY = this.ys;
      this.ys = tf.keep(oldY.concat(y, 0));

      oldX.dispose();
      oldY.dispose();
      y.dispose();
    }
  }

  async train() {
    if (this.xs == null) {
      throw new Error('Add some examples before training!');
    }

    var learningRate = 0.0001;
    var batchSize = 0.4;
    var epochs = 20;
    var hiddenUnits = 100;

    // Creates a 2-layer fully connected model. By creating a separate model,
    // rather than adding layers to the mobilenet model, we "freeze" the weights
    // of the mobilenet model, and only train weights from the new model.
    model = tf.sequential({
      layers: [
        // Flattens the input to a vector so we can use it in a dense layer. While
        // technically a layer, this only performs a reshape (and has no training
        // parameters).
        tf.layers.flatten(
          { inputShape: truncatedMobileNet.outputs[0].shape.slice(1) }),
        // Layer 1.
        tf.layers.dense({
          units: hiddenUnits,
          activation: 'relu',
          kernelInitializer: 'varianceScaling',
          useBias: true
        }),
        // Layer 2. The number of units of the last layer should correspond
        // to the number of classes we want to predict.
        tf.layers.dense({
          units: this.numClasses,
          kernelInitializer: 'varianceScaling',
          useBias: false,
          activation: 'softmax'
        })
      ]
    });

    // Creates the optimizers which drives training of the model.
    const optimizer = tf.train.adam(learningRate);
    // We use categoricalCrossentropy which is the loss function we use for
    // categorical classification which measures the error between our predicted
    // probability distribution over classes (probability that an input is of each
    // class), versus the label (100% probability in the true class)>
    model.compile({ optimizer: optimizer, loss: 'categoricalCrossentropy' });

    // We parameterize batch size as a fraction of the entire dataset because the
    // number of examples that are collected depends on how many examples the user
    // collects. This allows us to have a flexible batch size.
    const batchSize =
      Math.floor(this.xs.shape[0] * batchSize);
    if (!(batchSize > 0)) {
      throw new Error(
        `Batch size is 0 or NaN. Please choose a non-zero fraction.`);
    }

    // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
    model.fit(this.xs, this.ys, {
      batchSize,
      epochs: epochs,
      callbacks: {
        onBatchEnd: async (batch, logs) => {
          console.log('Loss: ' + logs.loss.toFixed(5));
        }
      }
    });
  }

  async predict(img) {
    // let img = truncatedMobileNet.predict(img)
    const predictedClass = tf.tidy(() => {
      // Make a prediction through mobilenet, getting the internal activation of
      // the mobilenet model, i.e., "embeddings" of the input images.
      const embeddings = truncatedMobileNet.predict(img);

      // Make a prediction through our newly-trained model using the embeddings
      // from mobilenet as input.
      const predictions = model.predict(embeddings);

      // Returns the index with the maximum probability. This number corresponds
      // to the class the model thinks is the most probable given the input.
      return predictions.as1D().argMax();
    });

    const classId = (await predictedClass.data())[0];
    predictedClass.dispose();

    console.log(classId)
    return classId;
  }
}
