// Global variables - Default values

var wordsData = [];
var minChars = 4;
var maxChars = 10;
var maxWords = 4;
var screenSize = [1920, 1080];

// Helper Get random number
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function main() {
	// Function Set up
	// WordInput Class
	class WordClassElement {
		constructor(word, fontSize, fontRatio, kerning, x, y, count, rotation) {
			this.word = word;
			this.rotation = rotation;
			this.wordLength = this.word.length;
			this.fontSize = fontSize;
			this.fontRatio = fontRatio;
			this.width = this.setWidth(this.rotation);
			this.height = this.setHeight(this.rotation);
			this.x = this.randomPosition(860, 1060);
			this.y = this.randomPosition(380, 700);
			this.xMinMax = [this.x, this.x + this.width];
			this.yMinMax = [this.y, this.y + this.height];
			this.kerning = kerning;
			this.count = count;
		}
		setWidth(rotation) {
			if (rotation === 0) {
				return this.wordLength * this.fontSize * this.fontRatio;
			} else {
				return this.fontSize;
			}
		}
		setHeight(rotation) {
			if (rotation === 0) {
				return this.fontSize;
			} else {
				return this.wordLength * this.fontSize * this.fontRatio;
			}
		}
		randomPosition(min, max) {
			return Math.floor(Math.random() * (max - min) + min);
		}
	}
	// Main variables
	var inputWord = arguments[0];
	minChars = arguments[1];
	maxChars = arguments[2];
	maxWords = arguments[3];
	screenSize = [arguments[4], arguments[5]];
	var currentWord;
	var translationRatioX = 80;
	var translationRatioY = 40;
	var translationX = screenSize[0] / translationRatioX;
	var translationY = screenSize[1] / translationRatioY;
	var numberOfWordsCounted = 0;
	var exportdataStringified;
	var translationDone;
	var newValues = 0;
	var translationMode;
	var findingCycles = 0;
	var wordInput;

	// Filter word input according to number of characters & number of words

	inputWord
		.split(' ')
		.filter(function (el) {
			if (el.length >= minChars && el.length <= maxChars) {
				return el;
			}
		})
		.filter((el, i) => i < maxWords)
		.join(' ');

	currentWord = inputWord;

	// New sequence - first item either horizontal or vertical
	// Random rotation position for word
	var rotationTrue = getRandom(1, 6);
	// Vertical word
	if (rotationTrue === 1) {
		wordInput = new WordClassElement(
			currentWord,
			48,
			0.9,
			0,
			screenSize[0] / 2,
			screenSize[1] / 2,
			1,
			1
		);
	} else {
		// Vertical Horizontal
		wordInput = new WordClassElement(
			currentWord,
			48,
			0.9,
			0,
			screenSize[0] / 2,
			screenSize[1] / 2,
			1,
			0
		);
	}
	var margin = wordInput.fontSize * 2;

	// Sequence - is first item ?
	if (wordsData.length === 0) {
		wordsData.push(wordInput);
	} else {
		// Not first item
		// Checking if word has already been passed
		wordsData.forEach((el) => {
			if (el.word === arguments[0]) {
				if (el.count < 4) {
					el.count = el.count + 1;
					console.log('same word count added:');
				}
				if (el.count === 2) {
					resizing(el, 1.3);

					console.log('word with count:', el.word, el.count);
					newValues = 1;
				}
				if (el.count === 3) {
					resizing(el, 1.2);

					console.log('word with count:', el.word, el.count);
					newValues = 1;
				}
			} else {
				// Processing new word
				checkingUp(wordsData);
				newValues = 0;
			}
		});
	}

	// Resizing function
	function resizing(word, factor) {
		word.fontSize = word.fontSize * factor;
		word.width = word.width * factor;
		word.height = word.height * factor;
		word.xMinMax[1] = word.xMinMax[1] * factor;
		word.yMinMax[1] = word.yMinMax[1] * factor;
	}

	// Reset translations value
	function resetTranslationValues() {
		translationRatioX === 80;
		translationX = screenSize[0] / translationRatioX;
		translationRatioY === 40;
		translationY = screenSize[0] / translationRatioY;
	}

	// Function to check available space used by findingPosition()
	function checkingAvailableSpace(
		data,
		wordInputNew,
		translationXnew,
		translationYnew
	) {
		return data.some(
			(el) =>
				// 1. WordInput XY smaller then el
				(wordInputNew.xMinMax[0] + translationXnew >= el.xMinMax[0] &&
					wordInputNew.xMinMax[1] + translationXnew <=
						el.xMinMax[1] &&
					wordInputNew.yMinMax[0] + translationYnew >=
						el.yMinMax[0] &&
					wordInputNew.yMinMax[1] + translationYnew <=
						el.yMinMax[1]) ||
				// 2. WordInput X0 smaller & X1 bigger &  Y0 bigger & Y1 smaller
				(wordInputNew.xMinMax[0] + translationXnew <= el.xMinMax[0] &&
					wordInputNew.xMinMax[1] + translationXnew >=
						el.xMinMax[1] &&
					wordInputNew.yMinMax[0] + translationYnew >=
						el.yMinMax[0] &&
					wordInputNew.yMinMax[1] + translationYnew <=
						el.yMinMax[1]) ||
				// 3. WordInput X0 bigger & X1 smaller &  Y0 smaller & Y1 smaller
				(wordInputNew.xMinMax[0] + translationXnew >= el.xMinMax[0] &&
					wordInputNew.xMinMax[1] + translationXnew <=
						el.xMinMax[1] &&
					wordInputNew.yMinMax[0] + translationYnew <=
						el.yMinMax[0] &&
					wordInputNew.yMinMax[1] + translationYnew >=
						el.yMinMax[1]) ||
				// 4. WordInput X0 smaller & X1 bigger &  Y0 smaller & Y1 bigger
				(wordInputNew.xMinMax[0] + translationXnew <= el.xMinMax[0] &&
					wordInputNew.xMinMax[1] + translationXnew >=
						el.xMinMax[1] &&
					wordInputNew.yMinMax[0] + translationYnew <=
						el.yMinMax[0] &&
					wordInputNew.yMinMax[1] + translationYnew >=
						el.yMinMax[1]) ||
				(el.xMinMax[0] >= wordInputNew.xMinMax[0] + translationXnew &&
					el.xMinMax[0] <=
						wordInputNew.xMinMax[1] + translationXnew &&
					((el.yMinMax[0] >=
						wordInputNew.yMinMax[0] + translationYnew &&
						el.yMinMax[0] <=
							wordInputNew.yMinMax[1] + translationYnew) ||
						(el.yMinMax[1] >=
							wordInputNew.yMinMax[0] + translationYnew &&
							el.yMinMax[1] <=
								wordInputNew.yMinMax[1] + translationYnew))) ||
				(el.xMinMax[1] >= wordInputNew.xMinMax[0] + translationXnew &&
					el.xMinMax[1] <=
						wordInputNew.xMinMax[1] + translationXnew &&
					((el.yMinMax[0] >=
						wordInputNew.yMinMax[0] + translationYnew &&
						el.yMinMax[0] <=
							wordInputNew.yMinMax[1] + translationYnew) ||
						(el.yMinMax[1] >=
							wordInputNew.yMinMax[0] + translationYnew &&
							el.yMinMax[1] <=
								wordInputNew.yMinMax[1] + translationYnew))) ||
				(el.xMinMax[0] <= wordInputNew.xMinMax[0] + translationXnew &&
					el.xMinMax[0] >=
						wordInputNew.xMinMax[1] + translationXnew &&
					((el.yMinMax[0] >=
						wordInputNew.yMinMax[0] + translationYnew &&
						el.yMinMax[0] <=
							wordInputNew.yMinMax[1] + translationYnew) ||
						(el.yMinMax[1] >=
							wordInputNew.yMinMax[0] + translationYnew &&
							el.yMinMax[1] <=
								wordInputNew.yMinMax[1] + translationYnew))) ||
				(el.yMinMax[0] <= wordInputNew.yMinMax[0] + translationYnew &&
					el.yMinMax[0] >=
						wordInputNew.yMinMax[1] + translationYnew &&
					((el.xMinMax[0] >=
						wordInputNew.xMinMax[0] + translationXnew &&
						el.xMinMax[0] <=
							wordInputNew.xMinMax[1] + translationXnew) ||
						(el.xMinMax[1] >=
							wordInputNew.xMinMax[0] + translationXnew &&
							el.xMinMax[1] <=
								wordInputNew.xMinMax[1] + translationXnew))) ||
				// // 5. Crossing X from right
				(wordInputNew.xMinMax[0] + translationXnew >= el.xMinMax[0] &&
					wordInputNew.xMinMax[0] + translationXnew <=
						el.xMinMax[1] &&
					((wordInputNew.yMinMax[0] + translationYnew >=
						el.yMinMax[0] &&
						wordInputNew.yMinMax[0] + translationYnew <=
							el.yMinMax[1]) ||
						(wordInputNew.yMinMax[1] + translationYnew >=
							el.yMinMax[0] &&
							wordInputNew.yMinMax[1] + translationYnew <=
								el.yMinMax[1]))) ||
				// 6. Crossing X from left
				(wordInputNew.xMinMax[1] + translationXnew >= el.xMinMax[0] &&
					wordInputNew.xMinMax[1] + translationXnew <=
						el.xMinMax[1] &&
					((wordInputNew.yMinMax[0] + translationYnew >=
						el.yMinMax[0] &&
						wordInputNew.yMinMax[0] + translationYnew <=
							el.yMinMax[1]) ||
						(wordInputNew.yMinMax[1] + translationYnew >=
							el.yMinMax[0] &&
							wordInputNew.yMinMax[1] + translationYnew <=
								el.yMinMax[1])))
		);
	}
	// Function placing checking by other components position
	function checkingUp(data) {
		function findingPosition() {
			// Generating random translation mode
			translationMode = getRandom(1, 9);

			translationDone = 0;

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
					wordInput.xMinMax[0] + translationX > margin &&
					wordInput.xMinMax[1] + translationX <
						screenSize[0] - margin &&
					wordInput.yMinMax[0] + translationY <
						screenSize[1] - margin &&
					wordInput.yMinMax[1] + translationY > margin;
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
				) === false
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
				) === false
			) {
				addingValues(-Math.abs(translationX), Math.abs(translationY));

				translationDone = 1;
				data.push(wordInput);

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
				) === false
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
				) === false
			) {
				addingValues(Math.abs(translationX), 0);

				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode4-Right');
			} else {
				translationMode === 5;
			}
			// Translation LeftDown - 5
			if (
				translationMode === 5 &&
				translationDone === 0 &&
				checkingMargin(
					-Math.abs(translationX),
					-Math.abs(translationY),
					margin
				) &&
				checkingAvailableSpace(
					data,
					wordInput,
					-Math.abs(translationX),
					-Math.abs(translationY)
				) === false
			) {
				addingValues(-Math.abs(translationX), -Math.abs(translationY));

				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode5-LeftDown');
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
				) === false
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
				) === false
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
				) === false
			) {
				addingValues(0, -Math.abs(translationY));

				translationDone = 1;
				data.push(wordInput);
				console.log('new word mode8-Down');
			}

			if (translationDone === 1) {
				resetTranslationValues();
				findingCycles = 0;
			}
			// console.log('count:', findingCycles);
			// console.log('translationX:', translationX);
			// console.log('translationY:', translationY);
			if (translationDone !== 1 && findingCycles < 1000) {
				translationRatioX = translationRatioX - 0.5;
				translationRatioY = translationRatioY - 0.2;
				translationX = screenSize[0] / translationRatioX;
				translationY = screenSize[1] / translationRatioY;

				if (translationRatioX === 4) {
					resetTranslationValues();
				}
				if (translationRatioY === 3) {
					resetTranslationValues();
				}
				findingCycles = findingCycles + 1;
				findingPosition();
			}
		}
		if (findingCycles < 1000 && translationDone !== 1) {
			findingPosition();
		}
	}
	console.log(wordsData);
	console.log('this new wordInput:', wordInput);
	// Function checking & adding word data
	if (translationDone === 1 || wordsData.length === 1 || newValues === 1) {
		var exportdata = {};
		class WordExport {
			constructor(word, size, horz, vert, count, rotation) {
				this.word = word;
				this.size = size;
				this.horz = horz;
				this.vert = vert;
				this.count = count;
				this.rotation = rotation;
			}
		}
		wordsData.forEach((el, index) => {
			var wordExport = new WordExport();
			exportdata['Word' + index] = wordExport;
			exportdata['Word' + index].word = el.word;
			exportdata['Word' + index].horz = el.x;
			exportdata['Word' + index].vert = el.y;
			exportdata['Word' + index].size = el.fontSize;
			exportdata['Word' + index].count = el.count;
			exportdata['Word' + index].rotation = el.rotation;
		});
		exportdataStringified = JSON.stringify(exportdata);
	}
	var display = [];
	if (translationDone === 1 || wordsData.length === 1 || newValues === 1) {
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

main(['input0', 4, 10, 5, 1920, 1080]);
