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
			this.x = x;
			this.y = y;
			// this.x = this.randomPosition(192, 1728);
			// this.y = this.randomPosition(108, 972);
			this.xMinMax = [this.x, this.x + this.width];
			this.yMinMax = [this.y, this.y + this.height];
			this.kerning = kerning;
		}
		randomPosition(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}
	}
	// Reset translations value

	function resetTranslationValues() {
		translationRatioX === 22;
		translationX = screenSize[0] / translationRatioX;
		translationRatioY === 12;
		translationY = screenSize[0] / translationRatioY;
	}

	// Setting up new input word object
	var wordInput = new WordClassElement(currentWord, 36, 0.7, 0, 960, 540);
	var margin = wordInput.fontSize + 20;
	if (wordsData.length === 0) {
		wordsData.push(wordInput);
	} else {
		checkingUp(wordsData);
	}
	// Function to check available space used by findingPosition()
	var spaceAvailable;
	function checkingAvailableSpace(
		data,
		wordInputNew,
		translationXnew,
		translationYnew
	) {
		if (
			data.some(function (el) {
				return (
					((el.xMinMax[0] >=
						wordInputNew.xMinMax[0] + translationXnew &&
						el.xMinMax[0] <=
							wordInputNew.xMinMax[1] + translationXnew) ||
						(el.xMinMax[1] >=
							wordInputNew.xMinMax[0] + translationXnew &&
							el.xMinMax[1] <=
								wordInputNew.xMinMax[1] + translationXnew)) &&
					((el.yMinMax[0] >=
						wordInputNew.yMinMax[0] + translationYnew &&
						el.yMinMax[0] <=
							wordInputNew.yMinMax[1] + translationYnew) ||
						(el.yMinMax[1] >=
							wordInputNew.yMinMax[0] + translationYnew &&
							el.yMinMax[1] <=
								wordInputNew.yMinMax[1] + translationYnew))
				);
			})
		) {
			spaceAvailable = false;
		} else {
			spaceAvailable = true;
		}
		console.log('this translationX before checkingspace:', translationXnew);
		console.log('this translationY before checkingspace:', translationYnew);
		return spaceAvailable;
	}
	// Function placing checking by other components position
	function checkingUp(data) {
		function findingPosition() {
			// Generating random translation mode
			function getRandom(min, max) {
				return Math.floor(Math.random() * (max - min) + min);
			}
			translationMode = getRandom(1, 9);

			function addingValues(translationX, translationY) {
				wordInput.x = wordInput.x + translationX;
				wordInput.xMinMax[0] = wordInput.xMinMax[0] + translationX;
				wordInput.xMinMax[1] = wordInput.xMinMax[1] + translationX;

				wordInput.y = wordInput.y + translationY;
				wordInput.yMinMax[0] = wordInput.yMinMax[0] + translationY;
				wordInput.yMinMax[1] = wordInput.yMinMax[1] + translationY;
				console.log('this is translation X value added:', translationX);
				console.log('this is translation Y value added:', translationY);
			}

			function checkingMargin(translationX, translationY, margin) {
				var testingMargin =
					wordInput.x + translationX > margin &&
					wordInput.x + translationX < screenSize[0] - margin &&
					wordInput.y + translationY < screenSize[1] - margin &&
					wordInput.y + translationY > margin;
				console.log(
					'this is translation X value while checking:',
					translationX
				);
				console.log(
					'this is translation Y value while checking:',
					translationY
				);
				console.log('this testing margin state:', testingMargin);

				return testingMargin;
			}

			// Translation Left- 1
			if (
				translationMode === 1 &&
				translationDone === 0 &&
				checkingMargin(-Math.abs(translationX), 0, margin) &&
				checkingAvailableSpace(
					data,
					wordInput,
					-Math.abs(translationX),
					0
				)
			) {
				addingValues(-Math.abs(translationX), 0);
				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode1-left');
			} else {
				translationMode === 2;
			}
			// Translation LeftUp - 2
			if (
				translationMode === 2 &&
				translationDone === 0 &&
				checkingMargin(
					-Math.abs(translationX),
					Math.abs(translationY),
					margin
				) &&
				checkingAvailableSpace(
					data,
					wordInput,
					-Math.abs(translationX),
					Math.abs(translationY)
				)
			) {
				addingValues(-Math.abs(translationX), Math.abs(translationY));

				translationDone = 1;
				data.push(wordInput);
				// resetTranslationValues();
				console.log('new word mode2-leftUp');
			} else {
				translationMode === 3;
			}
			// Translation UpRight - 3
			if (
				translationMode === 3 &&
				translationDone === 0 &&
				checkingMargin(
					Math.abs(translationX),
					Math.abs(translationY),
					margin
				) &&
				checkingAvailableSpace(
					data,
					wordInput,
					Math.abs(translationX),
					Math.abs(translationY)
				)
			) {
				addingValues(Math.abs(translationX), Math.abs(translationY));

				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode3-UpRight');
			} else {
				translationMode === 4;
			}
			// Translation Right - 4
			if (
				translationMode === 4 &&
				translationDone === 0 &&
				checkingMargin(Math.abs(translationX), 0, margin) &&
				checkingAvailableSpace(
					data,
					wordInput,
					Math.abs(translationX),
					0
				)
			) {
				addingValues(Math.abs(translationX), 0);

				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode4-Right');
			} else {
				translationMode === 5;
			}
			// Translation RightUp - 5
			if (
				translationMode === 5 &&
				translationDone === 0 &&
				checkingMargin(
					Math.abs(translationX),
					Math.abs(translationY),
					margin
				) &&
				checkingAvailableSpace(
					data,
					wordInput,
					Math.abs(translationX),
					Math.abs(translationY)
				)
			) {
				addingValues(Math.abs(translationX), Math.abs(translationY));

				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode5-RightUp');
			} else {
				translationMode === 6;
			}
			// Translation RightDown - 6
			if (
				translationMode === 6 &&
				translationDone === 0 &&
				checkingMargin(
					Math.abs(translationX),
					-Math.abs(translationY),
					margin
				) &&
				checkingAvailableSpace(
					data,
					wordInput,
					Math.abs(translationX),
					-Math.abs(translationY)
				)
			) {
				addingValues(Math.abs(translationX), -Math.abs(translationY));

				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode6-RightDown');
			} else {
				translationMode === 7;
			}
			// Translation UP - 7
			if (
				translationMode === 7 &&
				translationDone === 0 &&
				checkingMargin(0, Math.abs(translationY), margin) &&
				checkingAvailableSpace(
					data,
					wordInput,
					0,
					Math.abs(translationY)
				)
			) {
				addingValues(0, Math.abs(translationY));

				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode7-Up');
			} else {
				translationMode === 8;
			}
			// Translation Down - 8
			if (
				translationMode === 8 &&
				translationDone === 0 &&
				checkingMargin(0, -Math.abs(translationY), margin) &&
				checkingAvailableSpace(
					data,
					wordInput,
					0,
					-Math.abs(translationY)
				)
			) {
				addingValues(0, -Math.abs(translationY));

				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode8-Down');
			}

			if (translationDone !== 1) {
				translationRatioX = translationRatioX - 1;
				translationRatioY = translationRatioY - 0.5;
				translationX = screenSize[0] / translationRatioX;
				translationY = screenSize[1] / translationRatioY;

				if (translationRatioX === 2) {
					resetTranslationValues();
				}
				if (translationRatioY === 3) {
					resetTranslationValues();
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
	// console.log(wordsData);
}
main(['input0']);
