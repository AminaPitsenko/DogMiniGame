'use strict';

var Game = {
	canvas: undefined,
	canvasContext: undefined,
	dogSprite: undefined,
	dog2Sprite: undefined,
	currentSprite: undefined,
	barkSound: undefined,
	posY: undefined,
	posX: undefined,
	mousePos: undefined,
	imgWidth: undefined,
	imgHeight: undefined,
	halfImgWidth: undefined,
	halfImgHeight: undefined,
	isAnimating: false,
	frameCount: 0,
	frameRate: 120,
	switchInterval: 1,
};

Game.start = function () {
	Game.canvas = document.getElementById('myCanvas');
	Game.canvasContext = Game.canvas.getContext('2d');

	Game.imgWidth = 100;
	Game.imgHeight = 100;

	Game.halfImgWidth = Game.imgWidth / 2;
	Game.halfImgHeight = Game.imgHeight / 2;

	Game.posX = Game.canvas.width / 2;
	Game.posY = Game.canvas.height / 2;

	Game.dogSprite = new Image();
	Game.dogSprite.src = 'dog.svg';

	Game.dog2Sprite = new Image();
	Game.dog2Sprite.src = 'dog2.svg';

	Game.currentSprite = Game.dogSprite;

	Game.barkSound = new Audio();
	Game.barkSound.src = 'bark.mp3';
	Game.barkSound.volume = 0.4;

	Game.canvas.addEventListener('click', function (e) {
		Game.mousePos = getMousePosition(Game.canvas, e);
		Game.animateTowards(Game.mousePos[0], Game.mousePos[1]);
	});

	Game.mainLoop();
};

document.addEventListener('DOMContentLoaded', Game.start);

Game.clearCanvas = function () {
	Game.canvasContext.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
};

function getMousePosition(canvas, event) {
	let size = canvas.getBoundingClientRect();
	return [event.clientX - size.left, event.clientY - size.top];
}

Game.mainLoop = function () {
	Game.clearCanvas();
	Game.draw();
	window.requestAnimationFrame(Game.mainLoop);

	Game.frameCount++;

	if (Game.frameCount >= Game.frameRate / 5) {
		Game.switchSprite();
		Game.frameCount = 0;
	}
};

Game.switchSprite = function () {
	if (Game.isAnimating) {
		if (Game.currentSprite === Game.dogSprite) {
			Game.currentSprite = Game.dog2Sprite;
		} else {
			Game.currentSprite = Game.dogSprite;
		}
	}
};

Game.animateTowards = function (endPosX, endPosY) {
	if (!Game.isAnimating) {

		endPosX = Math.max(Game.halfImgWidth, Math.min(endPosX, Game.canvas.width - Game.halfImgWidth));
		endPosY = Math.max(Game.halfImgHeight, Math.min(endPosY, Game.canvas.height - Game.halfImgHeight));

		Game.isAnimating = true;
		let diffX = endPosX - Game.posX;
		let diffY = endPosY - Game.posY;
		let stepX = diffX / Game.frameRate;
		let stepY = diffY / Game.frameRate;

		function moveTowardsMouse(currentFrame) {
			if (currentFrame < Game.frameRate) {
				Game.posX += stepX;
				Game.posY += stepY;
				Game.clearCanvas();
				Game.draw();
				Game.barkSound.play();
				requestAnimationFrame(() => moveTowardsMouse(currentFrame + 1));
			} else {
				Game.isAnimating = false;
			}
		}

		moveTowardsMouse(0);
	}
};

Game.draw = function () {
	Game.canvasContext.drawImage(
		Game.currentSprite,
		Game.posX - Game.halfImgWidth,
		Game.posY - Game.halfImgHeight,
		Game.imgWidth,
		Game.imgHeight
	);
};
