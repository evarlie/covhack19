from flask import *
from options import *
import random
import json

app = Flask(__name__)
for scenario in scenarios:
	scenario["Options"] = {
		option: options[option] 
		for option in scenario["Options"]
	}

@app.route('/', methods=['GET', 'POST'])
def listen():
	if request.method == 'POST':
		handle_message('test')
	else:
		return "else"

@app.route("/hw")
def optionSelect():
	scenario = random.choice(scenarios)
	return json.dumps(scenario)
			

if __name__ == "__main__":
    app.run(debug=True)
