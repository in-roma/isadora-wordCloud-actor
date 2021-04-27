var wordsData = [];

function main(arguments) {
	// Function Set up
	// Word input Class
	class WordClassElement {
		constructor(word, fontSize, fontRatio, kerning, x, y, count, rotation) {
			this.word = word;
			this.rotation = rotation;
			this.wordLength = this.word.length;
			this.fontSize = fontSize;
			this.fontRatio = fontRatio;
			this.width = setWidth(this.rotation);
			this.height = setHeight(this.rotation);
			this.x = this.randomPosition(900, 1020);
			this.y = this.randomPosition(500, 580);
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
	// Functions main variables
	var screenSize = [1920, 1080];
	var currentWord = arguments[0];
	var translationRatioX = 120;
	var translationRatioY = 60;
	var translationX = screenSize[0] / translationRatioX;
	var translationY = screenSize[1] / translationRatioY;
	var numberOfWordsCounted = 0;
	var exportdataStringified;
	var translationDone = 0;
	var newValues = 0;
	var translationMode;
	var findingCount = 0;
	var wordInput;
	var margin = wordInput.fontSize * 2;

	// Helpers
	// Get random number
	function getRandom(min, max) {
		return Math.floor(Math.random() * (max - min) + min);
	}

	// Resizing function
	function resizing(word, factor) {
		word.fontSize = word.fontSize * factor;
		word.width = word.width * factor;
		word.height = word.height * factor;
		word.xMinMax[1] = word.xMinMax[1] * factor;
		word.yMinMax[1] = word.yMinMax[1] * factor;
	}
	// Repositioning function after element has been resized
	function repositioningWords(word, factor) {
		wordsData.forEach(function (el) {
			// Words up
			if (el.yMinMax[0] > word.yMinMax[1]) {
				el.yMinMax[0] = el.yMinMax[0] + factor;
				el.yMinMax[1] = el.yMinMax[1] + factor;
				el.y = el.y + factor;
			}
			// Words down
			if (el.yMinMax[1] < word.yMinMax[0]) {
				el.yMinMax[0] = el.yMinMax[0] - factor;
				el.yMinMax[1] = el.yMinMax[1] - factor;
				el.y = el.y - factor;
			}
			// Words Right
			if (el.xMinMax[0] > word.xMinMax[1]) {
				el.xMinMax[0] = el.xMinMax[0] + factor;
				el.xMinMax[1] = el.xMinMax[1] + factor;
				el.x = el.x + factor;
			}
			// Words Right
			if (el.xMinMax[1] < word.xMinMax[0]) {
				el.xMinMax[0] = el.xMinMax[0] - factor;
				el.xMinMax[1] = el.xMinMax[1] - factor;
				el.x = el.x - factor;
			}
		});
	}

	// Random rotation position for word
	var rotationTrue = getRandom(1, 5);
	if (rotationTrue === 4) {
		wordInput = new WordClassElement(
			currentWord,
			42,
			0.6,
			0,
			960,
			540,
			1,
			1
		);
	} else {
		wordInput = new WordClassElement(
			currentWord,
			42,
			0.6,
			0,
			960,
			540,
			1,
			0
		);
	}

	// New sequence - first item
	if (wordsData.length === 0) {
		wordsData.push(wordInput);
	} else {
		// After first item
		// Checking if word has already been passed
		wordsData.forEach((el) => {
			if (el.word === arguments[0]) {
				if (el.count < 4) {
					el.count = el.count + 1;
					console.log('same word count added:');
				}
				if (el.count === 2) {
					resizing(el, 1.4);
					repositioningWords(el, el.fontSize * 1.5);
					console.log('word with count:', el.word, el.count);
					newValues = 1;
				}
				if (el.count === 3) {
					resizing(el, 1.1);
					repositioningWords(el, el.fontSize * 0.5);
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

	// Reset translations value
	function resetTranslationValues() {
		translationRatioX === 120;
		translationX = screenSize[0] / translationRatioX;
		translationRatioY === 60;
		translationY = screenSize[0] / translationRatioY;
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
				if (wordInputNew.rotation === 0) {
					return (
						(((el.xMinMax[0] >=
							wordInputNew.xMinMax[0] + translationXnew &&
							el.xMinMax[0] <=
								wordInputNew.xMinMax[1] + translationXnew) ||
							(el.xMinMax[1] >=
								wordInputNew.xMinMax[0] + translationXnew &&
								el.xMinMax[1] <=
									wordInputNew.xMinMax[1] +
										translationXnew)) &&
							((el.yMinMax[0] >=
								wordInputNew.yMinMax[0] + translationYnew &&
								el.yMinMax[0] <=
									wordInputNew.yMinMax[1] +
										translationYnew) ||
								(el.yMinMax[1] >=
									wordInputNew.yMinMax[0] + translationYnew &&
									el.yMinMax[1] <=
										wordInputNew.yMinMax[1] +
											translationYnew))) ||
						(((wordInputNew.xMinMax[0] + translationXnew >=
							el.xMinMax[0] &&
							wordInputNew.xMinMax[0] + translationXnew <=
								el.xMinMax[1]) ||
							(wordInputNew.xMinMax[1] + translationXnew >=
								el.xMinMax[0] &&
								wordInputNew.xMinMax[1] + translationXnew <=
									el.xMinMax[1])) &&
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
				if (wordInputNew.rotation === 1) {
					return (
						(((el.xMinMax[0] >=
							wordInputNew.xMinMax[1] + translationXnew &&
							el.xMinMax[0] <=
								wordInputNew.xMinMax[0] + translationXnew) ||
							(el.xMinMax[1] >=
								wordInputNew.xMinMax[1] + translationXnew &&
								el.xMinMax[1] <=
									wordInputNew.xMinMax[0] +
										translationXnew)) &&
							((el.yMinMax[0] >=
								wordInputNew.yMinMax[0] + translationYnew &&
								el.yMinMax[0] <=
									wordInputNew.yMinMax[1] +
										translationYnew) ||
								(el.yMinMax[1] >=
									wordInputNew.yMinMax[0] + translationYnew &&
									el.yMinMax[1] <=
										wordInputNew.yMinMax[1] +
											translationYnew))) ||
						(((wordInputNew.xMinMax[1] + translationXnew >=
							el.xMinMax[0] &&
							wordInputNew.xMinMax[1] + translationXnew <=
								el.xMinMax[1]) ||
							(wordInputNew.xMinMax[0] + translationXnew >=
								el.xMinMax[0] &&
								wordInputNew.xMinMax[0] + translationXnew <=
									el.xMinMax[1])) &&
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
			})
		) {
			spaceAvailable = false;
		} else {
			spaceAvailable = true;
		}
		// console.log('this translationX before checkingspace:', translationXnew);
		// console.log('this translationY before checkingspace:', translationYnew);
		return spaceAvailable;
	}
	// Function placing checking by other components position
	function checkingUp(data) {
		function findingPosition() {
			// Generating random translation mode
			translationMode = getRandom(1, 9);

			function addingValues(translationX, translationY) {
				wordInput.x = wordInput.x + translationX;
				wordInput.xMinMax[0] = wordInput.xMinMax[0] + translationX;
				wordInput.xMinMax[1] = wordInput.xMinMax[1] + translationX;

				wordInput.y = wordInput.y + translationY;
				wordInput.yMinMax[0] = wordInput.yMinMax[0] + translationY;
				wordInput.yMinMax[1] = wordInput.yMinMax[1] + translationY;
				// console.log('this is translation X value added:', translationX);
				// console.log('this is translation Y value added:', translationY);
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
				)
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

			if (translationDone === 1) {
				resetTranslationValues();
				findingCount = 0;
			}

			if (translationDone !== 1 && findingCount < 1000) {
				translationRatioX = translationRatioX - 1;
				translationRatioY = translationRatioY - 1;
				translationX = screenSize[0] / translationRatioX;
				translationY = screenSize[1] / translationRatioY;

				if (translationRatioX === 8) {
					resetTranslationValues();
				}
				if (translationRatioY === 6) {
					resetTranslationValues();
				}
				findingCount = findingCount + 1;
				findingPosition();
			}
		}
		if (findingCount < 1000) {
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
