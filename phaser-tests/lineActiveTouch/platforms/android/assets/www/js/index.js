var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {preload: preload, create: create, update: update});
var sprite = null;
var graphic = null;
var wasDown = false;

var path = null;
var pathIndex = -1;
var pathSpriteIndex = -1;

function blackoutGraphic() {
	graphic.beginFill(0x000000);
	graphic.lineStyle(4, 0x000000, 1);
	graphic.drawRect(0, 0, game.width, game.height);
	graphic.endFill();
	graphic.lineStyle(4, 0xFF0000, 1);
}

function preload() {
	game.load.image('bodyguard', 'assets/bodyguard.png');
	game.load.physics('physicsPerson', 'assets/person.json');
}


function create() {
	game.physics.startSystem(Phaser.Physics.P2JS);
	graphic = game.add.graphics(0, 0);
	blackoutGraphic();
	sprite = game.add.sprite(100, 100, 'bodyguard');
	//sprite.anchor.setTo(0.5, 0.5);

	game.physics.p2.enable([sprite], true);

	sprite.body.clearShapes();
	sprite.body.loadPolygon('physicsPerson', 'bodyguard');
}

function update() {

	if (game.input.pointer1.isDown) {
		if (!wasDown) {
			graphic.moveTo(game.input.x, game.input.y);
			blackoutGraphic();
			pathIndex = 0;
			pathSpriteIndex = 0;
			path = [];
			wasDown = true;
		}

		if (pathIndex == 0 || (path[pathIndex - 1].x != game.input.x || path[pathIndex - 1].y != game.input.y)) {
			graphic.lineTo(game.input.x, game.input.y);
			path[pathIndex] = new Phaser.Point(game.input.x, game.input.y);
			pathIndex++;
		}
	}
	else {
		wasDown = false;
	}
	if (path != null && path.length > 0 && pathSpriteIndex < pathIndex) {
		pathSpriteIndex = Math.min(pathSpriteIndex, path.length - 1);
		game.physics.moveToXY(sprite, path[pathSpriteIndex].x, path[pathSpriteIndex].y, 250);
		if (game.physics.distanceToXY(sprite, path[pathSpriteIndex].x, path[pathSpriteIndex].y) < 20) {
			pathSpriteIndex++;
			if (pathSpriteIndex >= pathIndex) {
				sprite.body.velocity.setTo(0, 0);
			}
		}
	}

}