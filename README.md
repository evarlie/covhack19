
# CovHack19
Inspiration
Currently over 5% of the global population has some type of disabling hearing loss. In order to compensate this, millions of people use American Sign Language (ASL) to better communicate with others. However, communicating with the general public is still a struggle as most of them are unaware of such a language. So our goal was to help introduce the larger public to ASL to help better integrate those with disabling hearing loss.

# What it does
"Teaching ASL using Transfer Learning" uses a neural network in the browser to detect and identify different ASL gestures. It does this by comparing it to images of an ASL gesture performed by the user, so that it can provide useful engaging feedback to the user to see if they are able to imitate the right gesture. By using these techniques we built a small interactive text based adventure that uses different gestures to progress to create a fun and interactive experience for the user, promoting the use of ASL.

# How we built it
We started by using TensorFlow to build our image recognition via a neural network. We then used Flask with Python to build the back end of our project and Javascript with HTML and CSS for the front end which allowed us to quickly and easily create our web app.

# Challenges we ran into
Over the course of this project we ran into a few challenges mostly around asynchronous js and getting our heads around the implementation of the neural net in tensorflow.js .

# Accomplishments that we're proud of
During this project we had a few accomplishments that we're proud of. We were able to train a working neural network that was able to identify ASL gestures using very little data due to transfer learning all in a web browser! This means it is lightweight, portable and surprisingly powerful.

# What we learned
Foremost we all learned a great deal about ASL, its uses and the impact it can have to better communication. We also learnt how to use and implement flask and java script to build our web application. The use of TensorFlow for machine learning in javascript was also a new experience for us that we believe is an important skill that we can use going on from here.

# What's next for "Teaching ASL using Transfer Learning"
Although we initially used the alphabet as a means of communication, in future we would plan on integrating signs representing whole words and continuously updating our library of signs so eventually anyone can pick up our game and better communicate with those with disabling hearing loss.
