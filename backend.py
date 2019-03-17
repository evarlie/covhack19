import os
from flask import *
from options import *
from flask_cors import CORS
import random
import json

app = Flask(__name__)
CORS(app)
for scenario in scenarios:
	scenario["Options"] = {
		option: options[option] 
		for option in scenario["Options"]
	}
visitedList = []
testList = []
testCount = 0
testScore = 0

@app.route('/options', methods=['POST', 'GET'])
def optionSelect():
	if not scenarios:
		return json.dumps("Out of scenarios...")
	scenario = random.choice(scenarios)
	visitedList.append(scenario["Options"])
	testList.append(scenario["Options"])
	return json.dumps(scenario)
	
@app.route('/intro', methods=['POST', 'GET'])
def introTutorial():
	return "Learn the American Sign Language alphabet by recreating them via your webcam! Answer a variety of questions to help remember the different signs by acting out the sign to answer the question."

@app.route('/visited', methods=['POST', 'GET'])
def visitedCheck():
	return json.dumps(visitedList)

@app.route('/count', methods=['POST', 'GET'])
def visitedCount():
	return json.dumps(len(visitedList))

@app.route('/performance', methods=['POST', 'GET'])
def performanceIncrement():
	testScore = testScore + 1
	return json.dumps(testScore)

@app.route('/aftertest', methods=['POST', 'GET'])
def aftertest():
	testCount = testCount + 1
	return json.dumps(testList[testCount])

@app.route('/images/<path:path>')
def serve_images(path):
	path = os.path.basename(path)
	return send_from_directory('images', path)

if __name__ == "__main__":
    app.run(debug=True)
