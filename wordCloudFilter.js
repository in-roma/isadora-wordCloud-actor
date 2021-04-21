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
	var screenSize = [1920, 1080];
	var currentWord = arguments[0];
	var translationRatio = 10;
	var translationX = screenSize[0] / translationRatio;
	var translationY = screenSize[1] / translationRatio;

	class WordClassElement {
		constructor(word, fontSize, fontRatio, kerning, x, y) {
			this.word = word;
			this.wordLength = this.word.length;
			this.fontSize = fontSize;
			this.fontRatio = fontRatio;
			this.kerning = kerning;
			this.width = this.wordLength * this.fontSize * this.fontRatio;
			this.height = this.fontSize;
			// this.x = 1000;
			// this.y = 1000;
			this.x = this.randomPosition(
				screenSize[0] * 0.25,
				screenSize[0] * 0.75
			);
			this.y = this.randomPosition(
				screenSize[1] * 0.25,
				screenSize[1] * 0.75
			);
			this.xMinMax = [this.x, this.x + this.width];
			this.yMinMax = [this.y, this.y + this.height];
		}
		randomPosition(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}
	}

	// Setting up new object
	var wordInput = new WordClassElement(currentWord, 12, 0.5, 0, 1000, 500);

	// Function checking & adding word data
	if (wordsData.length === 0) {
		wordsData.push(wordInput);
	} else {
		checkingUp(wordsData);
	}

	// Function placing checking by other components position
	var translationDone;
	function checkingUp(data) {
		// Translations mode (1left, 2Right, 3Up, 4Bottom)
		var translationMode;
		function getRandom(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}
		translationMode = getRandom(2, 6);
		console.log('this is translationMode:', translationMode);

		// Translation Left - 1
		if (
			translationMode === 1 &&
			!translationDone &&
			data.every(
				(el) => el.xMinMax[0] >= wordInput.xMinMax[1] - translationX
			) &&
			(data.every(
				(el) => el.yMinMax[1] <= wordInput.yMinMax[0] - translationX
			) ||
				data.every(
					(el) => el.yMinMax[0] >= wordInput.yMinMax[1] - translationX
				))
		) {
			console.log('mode1 true - before wordInput.x:', wordInput.x);
			var test1 = wordInput.x - translationX;
			console.log('mode1 true - wordInput.x - translationX:', test1);
			wordInput.x = wordInput.x - translationX;
			console.log('mode1 true - after wordInput.x:', wordInput.x);
			translationDone = 1;
			data.push(wordInput);
		}
		// Translation Right - 2
		if (
			translationMode === 2 &&
			!translationDone &&
			data.every(
				(el) => el.xMinMax[1] <= wordInput.xMinMax[0] + translationX
			) &&
			(data.every(
				(el) => el.yMinMax[1] <= wordInput.yMinMax[0] + translationX
			) ||
				data.every(
					(el) => el.yMinMax[0] >= wordInput.yMinMax[1] + translationX
				))
		) {
			console.log('mode2 true - before wordInput.x:', wordInput.x);
			var test2 = wordInput.x - translationX;
			console.log('mode2 true - wordInput.x - translationX:', test2);
			wordInput.x = wordInput.x + translationX;
			console.log('mode2 true - after wordInput.x:', wordInput.x);
			translationDone = 1;
			data.push(wordInput);
		}
		// Translation Up - 3
		if (
			translationMode === 3 &&
			!translationDone &&
			data.every(
				(el) => el.yMinMax[1] <= wordInput.yMinMax[0] + translationY
			) &&
			(data.every(
				(el) => el.xMinMax[1] <= wordInput.xMinMax[0] + translationY
			) ||
				data.every(
					(el) => el.xMinMax[0] >= wordInput.xMinMax[1] + translationY
				))
		) {
			console.log('mode3 true - before wordInput.t:', wordInput.y);
			var test3 = wordInput.y - translationY;
			console.log('mode3 true - wordInput.y - translationY:', test3);
			wordInput.y = wordInput.y + translationY;
			console.log('mode3 true - after wordInput.t:', wordInput.y);
			translationDone = 1;
			data.push(wordInput);
		}
		// Translation Down - 4
		if (
			translationMode === 4 &&
			!translationDone &&
			data.every(
				(el) => el.yMinMax[0] >= wordInput.yMinMax[1] - translationY
			) &&
			(data.every(
				(el) => el.xMinMax[1] <= wordInput.xMinMax[0] - translationY
			) ||
				data.every(
					(el) => el.xMinMax[0] >= wordInput.xMinMax[1] - translationY
				))
		) {
			console.log('mode4 true - before wordInput.y:', wordInput.y);
			var test4 = wordInput.y - translationY;
			console.log('mode4 true - wordInput.y - translationY:', test4);
			wordInput.y = wordInput.y - translationY;
			console.log('mode4 true - after wordInput.y:', wordInput.y);
			translationDone = 1;
			data.push(wordInput);
		}
	}
	if (!translationDone) {
		translationRatio = translationRatio - 1;
		checkingUp(wordsData);
	}
	console.log(wordsData);
}
main(['first Input']);
