//	==============
//	—ACTOR INFO—
//	==============

// 	Actor Info: Creates data to make a wordcloud with incoming words
//	Function:
// 	Note: Should remove punctuation and convert to lower case before comparing to existing words

//	========
//	—INPUTS—
//	========

// iz_input 1 "curr mess"
// Type: 	String
//Func: 	String to parse. Keep a count of how many times each word comes in.

// iz_input 2 "min chars"
//Type: 	Integer
//Rng: 		1 to 10
//Func: 	The minimum number of characters a word has to be in order to be counted.

// iz_input 3 "max words"
//Type: 	Integer
//Range: 	3 to 30
//Func: Maximum number of words that will be counted.

// iz_input 4 "delim"
// Type: 	String
//Func: 	String that a word must begin with in order to be counted.
//			Example: #Blessed #Vegan #Yoga

// iz_input 5 "reformat case"
//Type: 	Integer
//Rng: 		0 = don't reformat case
//				Example: "WoRd" is output as "WoRd"
//			1 = Make lower case
//				Example: "WoRd" is output as "word"
//			2 = Capitalize first letter
//				Example: "WoRd" is output as "Word"
//			3 = All Caps
//				Example: "WoRd" is output as "WORD"
//Func: 	Reformats the words sent to "results" based on the input receieved.

// iz_input 6 "reset"
//Type: 	Integer
//Rng: 		0 to 1
//Func: 	If sent a "1", resets the outputs.

// iz_input 7 "screenSize"

//	=========
//	—OUTPUTS—
//	=========

// iz_output 1 "curr mess"
//Type: 	String
//Func: 	Pass-through from input 1 (arg 0)

// iz_output 2 "min chars"
//Type: 	Integer
//Rng: 		1 to 10
//Func: 	Pass-through for input 2 (arg 1)

// iz_output 3 "max words"
//Type: 	Integer
//Rng: 		3 to 30
//Func: 	Pass-through for input 3 (arg 2)

// iz_output 4 "words counted"
//Type: 	Integer
//Rng: 		0 to 30
//Func: 	Outputs the number of words that have been counted as a result of meeting the criteria of not being excluded due to it being on one of the "ignore" input lists, meets the requirements for "min chars", and meets the requirements for "threshold".

// iz_output 5 "results"
//Type: 	String
//Func: 	Passes out a JSON array which contains JSON sub-arrays for each word, which in turn contains values for each word that's qualified to be counted.
// Definitions of parameters for each sub-array (for one word)
//	word: (the word - string)
//	horz: (horizontal position - float between 0 and 100)
//	vert: (vertical position - float between 0 and 100)
//	rotation: (rotation - integer, a random selection from one of the following values -180, -90, 0, 90, 180)
//	size: (font size - float between 1 and 40)
//	color: (color of text - random integer, seeded by "count", between 0 and 360)
//	count: (# of times word has been detected - integer)
//
//	Example sub-array (for one word):
//	{"color":0.0,"count":0.0,"horz":0.0,"rotation":0.0,"size":0.0,"vert":0.0,"word":"Shirt"}
//
//	Example array (containing two sub-arrays, one for each word):
//	{"1":{"color":0.0,"count":0.0,"horz":0.0,"rotation":0.0,"size":0.0,"vert":0.0,"word":"Shirt"},"2":{"color":0.0,"count":0.0,"horz":0.0,"rotation":0.0,"size":0.0,"vert":0.0,"word":"Pants"}}

// iz_output 6 "reset"
//Type: 	Integer
//Rng: 		0 to 1
//Func: 	Pass-through for input 6 (arg 5)

var wordsData = [];

function main(arguments) {
	// Set up
	var screenSize = [1920, 1080];
	var currentWord = arguments[0];
	var translationRatioX = 22;
	var translationRatioY = 12;
	var translationX = screenSize[0] / translationRatioX;
	var translationY = screenSize[1] / translationRatioY;
	var numberOfWordsCounted = 0;
	var exportdataStringified;
	var translationDone = 0;
	var translationMode;

	class WordClassElement {
		constructor(word, fontSize, fontRatio, kerning, x, y) {
			this.word = word;
			this.wordLength = this.word.length;
			this.fontSize = fontSize;
			this.fontRatio = fontRatio;
			this.width = this.wordLength * this.fontSize * this.fontRatio;
			this.height = this.fontSize;
			this.x = 960;
			this.y = 540;
			this.xMinMax = [this.x, this.x + this.width];
			this.yMinMax = [this.y, this.y + this.height];
			this.kerning = kerning;
		}
		randomPosition(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}
	}
	// Setting up new input word object
	var wordInput = new WordClassElement(currentWord, 72, 0.42, 0, 960, 540);

	if (wordsData.length === 0) {
		wordsData.push(wordInput);
	} else {
		checkingUp(wordsData);
	}
	// Function to check available space used by findingPosition()
	function checkingAvailableSpace(
		data,
		wordinput,
		translationX,
		translationY
	) {
		if (
			data.some(function (el) {
				return (
					el.xMinMax[0] >= wordinput.xMinMax[0] + translationX &&
					el.xMinMax[0] <= wordinput.xMinMax[1] + translationX &&
					el.xMinMax[1] >= wordinput.xMinMax[0] + translationX &&
					el.xMinMax[1] <= wordinput.xMinMax[1] + translationX &&
					el.yMinMax[0] >= wordinput.yMinMax[0] + translationY &&
					el.yMinMax[0] <= wordinput.yMinMax[1] + translationY &&
					el.yMinMax[1] >= wordinput.yMinMax[0] + translationY &&
					el.yMinMax[1] <= wordinput.yMinMax[1] + translationY
				);
			})
		) {
			return false;
		} else {
			return true;
		}
	}
	// Function placing checking by other components position
	function checkingUp(data) {
		function findingPosition() {
			// Generating random translation mode
			function getRandom(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			}
			translationMode = getRandom(1, 9);

			console.log('translation mode is:', translationMode);
			// Translation Left- 1
			if (
				translationMode === 1 &&
				translationDone === 0 &&
				wordInput.x + translationX > 50 &&
				checkingAvailableSpace(
					data,
					wordInput,
					-Math.abs(translationX),
					0
				)
			) {
				wordInput.x = wordInput.x - translationX;
				wordInput.xMinMax[0] = wordInput.xMinMax[0] - translationX;
				wordInput.xMinMax[1] = wordInput.xMinMax[1] - translationX;

				translationDone = 1;
				data.push(wordInput);
				console.log(
					'Mode1 translationDone & value found:',
					wordInput.x,
					wordInput.y
				);
			}
			// Translation Right - 2
			if (
				translationMode === 2 &&
				translationDone === 0 &&
				wordInput.x - translationX > 50 &&
				checkingAvailableSpace(data, wordInput, translationX, 0)
			) {
				wordInput.x = wordInput.x + translationX;
				wordInput.xMinMax[0] = wordInput.xMinMax[0] + translationX;
				wordInput.xMinMax[1] = wordInput.xMinMax[1] + translationX;

				translationDone = 1;
				data.push(wordInput);
				console.log(
					'Mode2 translationDone & value found:',
					wordInput.x,
					wordInput.y
				);
			}
			// Translation UP - 3
			if (
				translationMode === 3 &&
				translationDone === 0 &&
				wordInput.y + translationY < screenSize[1] - 50 &&
				checkingAvailableSpace(data, wordInput, 0, translationY)
			) {
				wordInput.y = wordInput.y + translationY;
				wordInput.yMinMax[0] = wordInput.yMinMax[0] + translationY;
				wordInput.yMinMax[1] = wordInput.yMinMax[1] + translationY;

				translationDone = 1;
				data.push(wordInput);
				console.log(
					'Mode3 translationDone & value found:',
					wordInput.x,
					wordInput.y
				);
			}
			// Translation Down - 4
			if (
				translationMode === 4 &&
				translationDone === 0 &&
				wordInput.y - translationY > 50 &&
				checkingAvailableSpace(
					data,
					wordInput,
					0,
					-Math.abs(translationY)
				)
			) {
				wordInput.y = wordInput.y - translationY;
				wordInput.yMinMax[0] = wordInput.yMinMax[0] - translationY;
				wordInput.yMinMax[1] = wordInput.yMinMax[1] - translationY;

				translationDone = 1;
				data.push(wordInput);
				console.log(
					'Mode4 translationDone & value found:',
					wordInput.x,
					wordInput.y
				);
			}

			if (translationDone !== 1) {
				translationRatioX = translationRatioX - 0.5;
				translationRatioY = translationRatioY - 0.5;
				translationX = screenSize[0] / translationRatioX;
				translationY = screenSize[1] / translationRatioY;

				if (translationRatioX === 11) {
					translationRatioX === 22;
					translationX = screenSize[0] / translationRatioX;
				}
				if (translationRatioY === 6) {
					translationRatioY === 12;
					translationY = screenSize[0] / translationRatioY;
				}
				findingPosition();
			}
		}
		findingPosition();
	}

	// Function checking & adding word data
	if (translationDone === 1 || wordsData.length === 1) {
		var exportdata = {};
		class WordExport {
			constructor(color, count, horz, rotation, size, vert, word) {
				this.color = color;
				this.horz = horz;
				this.rotation = rotation;
				this.size = size;
				this.vert = vert;
				this.word = word;
			}
		}

		wordsData.forEach((el, index) => {
			var wordExport = new WordExport();
			exportdata['Word' + index] = wordExport;
			exportdata['Word' + index].word = el.word;
			exportdata['Word' + index].horz = el.x;
			exportdata['Word' + index].vert = el.y;
			exportdata['Word' + index].size = el.fontSize;
		});
		exportdataStringified = JSON.stringify(exportdata);
	}
	var display = [];
	if (translationDone === 1 || wordsData.length === 1) {
		display = [
			arguments[0],
			arguments[1],
			arguments[2],
			numberOfWordsCounted,
			exportdataStringified,
			arguments[4],
		];

		return display;
	}
}
main(['input0']);
