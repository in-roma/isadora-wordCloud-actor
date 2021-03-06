// Global variables - Default values
var wordsData = [];
var minChars = 4;
var maxChars = 10;
var maxWords = 4;
var reformatCaseMode = 1;
var screenSize = [1920, 1080];
var fontSizeSelected = 42;

// Helper Get random number
function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

function main(arguments) {
	// Function Set up
	// Main variables
	var wordRawState = arguments[0];
	minChars = arguments[1];
	maxChars = arguments[2];
	maxWords = arguments[3];
	reformatCaseMode = arguments[4];
	screenSize = [arguments[5], arguments[6]];
	fontSizeSelected = arguments[7];
	var wordInput;
	var translationRatioX = 100;
	var translationRatioY = 50;
	var translationX = screenSize[0] / translationRatioX;
	var translationY = screenSize[1] / translationRatioY;
	var numberOfWordsCounted = 0;
	var exportdataStringified;
	var translationDone = 0;
	var newValues = 0;
	var translationMode;
	var findingCycles = 0;

	// WordInput Class
	class WordClassElement {
		constructor(word, fontSize, fontRatio, kerning, x, y, rotation, count) {
			this.word = word;
			this.rotation = rotation;
			this.wordLength = this.word.length;
			this.fontSize = fontSize;
			this.fontRatio = fontRatio;
			this.width = this.setWidth(this.rotation);
			this.height = this.setHeight(this.rotation);
			this.x = getRandom(screenSize[0] * 0.15, screenSize[0] * 0.85);
			this.y = getRandom(screenSize[1] * 0.4, screenSize[1] * 0.6);
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
	// Formating case
	if (reformatCaseMode === 1) {
		wordRawState = wordRawState.toLowerCase();
	}

	if (reformatCaseMode === 2) {
		wordRawState = wordRawState.toUpperCase();
	}

	// Filter word input according to number of characters & number of words
	inputWord = wordRawState
		.split(' ')
		.filter(function (el) {
			if (el.length >= minChars && el.length <= maxChars) {
				return el;
			}
		})
		.filter((el, i) => i < maxWords)
		.join(' ');

	// New sequence - first item either horizontal or vertical
	// Random rotation position for word
	var rotationTrue = getRandom(1, 6);
	// Vertical word
	if (rotationTrue === 1) {
		wordInput = new WordClassElement(
			inputWord,
			fontSizeSelected,
			1.1,
			0,
			screenSize[0] / 2,
			screenSize[1] / 2,
			1,
			1
		);
	} else {
		// Horizontal word
		wordInput = new WordClassElement(
			inputWord,
			fontSizeSelected,
			1.1,
			0,
			screenSize[0] / 2,
			screenSize[1] / 2,
			0,
			1
		);
	}
	var margin = fontSizeSelected / 2;

	// Sequence - is first item ?
	if (wordsData.length === 0) {
		wordsData.push(wordInput);
	} else {
		// Not first item
		// Checking if word has already been passed
		var isAlreadyInDataBase = wordsData.every((el) => {
			return el.word !== inputWord;
		});

		if (isAlreadyInDataBase === true) {
			// Processing new word
			checkingUp(wordsData);
			newValues = 0;
		} else {
			// Processing existing word
			wordsData.forEach(function (el) {
				if (inputWord === el.word) {
					el.count = el.count + 1;
				}
				if (el.count === 2 && inputWord === el.word) {
					resizing(el, 1.2);
					newValues = 1;
				}
				if (el.count === 3 && inputWord === el.word) {
					resizing(el, 1.3);
					newValues = 1;
				}
			});
		}
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
		translationRatioX = 100;
		translationX = screenSize[0] / translationRatioX;
		translationRatioY = 50;
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
				// 5. Reverse comparison el xMin whitin new word position range
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
				// 6. Reverse comparison el xMax whitin new word position range
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
				// 7. Reverse comparison el xMin whitin partly new word position range
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
				// 8. Reverse comparison el yMinMax whitin partly new word position range
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
				// 9. Crossing X from right
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
				// 10. Crossing X from left
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
			translationMode = getRandom(1, 8);

			function addingValues(translationX, translationY) {
				wordInput.x = wordInput.x + translationX;
				wordInput.xMinMax[0] = wordInput.xMinMax[0] + translationX;
				wordInput.xMinMax[1] = wordInput.xMinMax[1] + translationX;

				wordInput.y = wordInput.y + translationY;
				wordInput.yMinMax[0] = wordInput.yMinMax[0] + translationY;
				wordInput.yMinMax[1] = wordInput.yMinMax[1] + translationY;
			}

			function checkingMargin(translationX, translationY, margin) {
				var testingMargin =
					wordInput.xMinMax[0] + translationX > margin &&
					wordInput.xMinMax[1] + translationX <
						screenSize[0] - margin &&
					wordInput.yMinMax[0] + translationY > margin &&
					wordInput.yMinMax[1] + translationY <
						screenSize[1] - margin;
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
			} else {
				translationMode = 2;
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
			} else {
				translationMode = 3;
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
			} else {
				translationMode = 4;
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
			} else {
				translationMode = 5;
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
			} else {
				translationMode = 6;
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
			} else {
				translationMode = 7;
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
			} else {
				translationMode = 8;
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
			}

			if (translationDone === 1) {
				resetTranslationValues();
				findingCycles = 0;
			}

			if (translationDone !== 1 && findingCycles < 2100) {
				translationRatioX = translationRatioX - 0.05;
				translationRatioY = translationRatioY - 0.025;

				translationX = screenSize[0] / translationRatioX;
				translationY = screenSize[1] / translationRatioY;

				if (translationRatioX === 1) {
					resetTranslationValues();
				}
				if (translationRatioY === 1) {
					resetTranslationValues();
				}
				findingCycles = findingCycles + 1;
				findingPosition();
			}
		}
		if (findingCycles < 2100 && translationDone !== 1) {
			findingPosition();
		}
	}
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
			inputWord,
			arguments[1],
			arguments[2],
			arguments[3],
			numberOfWordsCounted,
			arguments[5],
			arguments[6],
			exportdataStringified,
			1,
			wordsData.length,
		];
		inputWord = '';
		return display;
	} else {
		display = [
			inputWord,
			arguments[1],
			arguments[2],
			arguments[3],
			numberOfWordsCounted,
			arguments[5],
			arguments[6],
			exportdataStringified,
			0,
			wordsData.length,
		];
		inputWord = '';
		return display;
	}
}
main([
	'this is an awesome question and beautiful spirit',
	5,
	10,
	3,
	1,
	1920,
	1080,
	42,
]);
