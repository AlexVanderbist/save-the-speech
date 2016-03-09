var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', {preload: preload, create: create, update: update});

var bodyguards = [];
var lines = [];
var paths = [];
var linepaths = [];

var sprite = null;
var greenLine = null;
var wasDown = false;

var path = null;
var newPath = null;
var pathIndex = -1;
var pathSpriteIndex = -1;

var drawPath = false;

function preload()
{
	game.load.image('bodyguard', 'assets/bodyguard.png');
	game.load.physics('physicsPerson', 'assets/person.json');
}


function create()
{
	game.stage.backgroundColor = 'rgb(68, 136, 170)';
	game.physics.startSystem(Phaser.Physics.P2JS);
	greenLine = game.add.graphics(0, 0);

	sprite = game.add.sprite(100, 100, 'bodyguard');
	sprite.anchor.setTo(0.5, 0.5);

	game.physics.p2.enable([ sprite ], true);

	sprite.body.clearShapes();
	sprite.body.loadPolygon('physicsPerson', 'bodyguard');

	game.input.onDown.add(click, this);
}

function click(object)
{
	var bodies = game.physics.p2.hitTest(object.position, [ sprite ]);

	var result;
	drawPath = false;
	if (bodies.length === 0)
	{
		result = "You didn't click a Body";
	}
	else
	{
		result = "You clicked: ";
		for (var i = 0; i < bodies.length; i++)
		{
			//	The bodies that come back are p2.Body objects.
			//	The parent property is a Phaser.Physics.P2.Body which has a property called 'sprite'
			//	This relates to the sprites we created earlier.
			//	The 'key' property is just the texture name, which works well for this demo but you probably need something more robust for an actual game.
			result = result + bodies[ i ].parent.sprite.key;

			if (bodies[ i ].parent.sprite.key == "bodyguard")
			{
				drawPath = true;
			}
			if (i < bodies.length - 1)
			{
				result = result + ', ';
			}
		}
	}

	console.log(result);
}

function update()
{
	if (game.input.pointer1.isDown && drawPath)
	{
		//console.log("ok");
		if (!wasDown)
		{
			greenLine.moveTo(game.input.x, game.input.y);
			pathIndex = 0;
			pathSpriteIndex = 0;
			path = [];
			newPath = [];
			wasDown = true;
		}
		if (pathIndex == 0 || (path[ pathIndex - 1 ].x != game.input.x || path[ pathIndex - 1 ].y != game.input.y))
		{
			path[ pathIndex ] = new Phaser.Point(game.input.x, game.input.y);
			newPath.push(new Phaser.Point(game.input.x, game.input.y));
			pathIndex++;
		}
	}
	else
	{
		wasDown = false;
	}
	if (path != null && path.length > 0 && pathSpriteIndex < pathIndex)
	{
		pathSpriteIndex = Math.min(pathSpriteIndex, path.length - 1);
		game.physics.arcade.moveToXY(sprite, newPath[ 0 ].x, newPath[ 0 ].y, 250);

		if (game.physics.arcade.distanceToXY(sprite, path[ pathSpriteIndex ].x, path[ pathSpriteIndex ].y) < 20)
		{
			pathSpriteIndex++;
			if (pathSpriteIndex >= pathIndex)
			{
				sprite.body.velocity.destination[ 0 ] = 0;
				sprite.body.velocity.destination[ 1 ] = 0;
			}

			reDrawLine();
			//rotateBodyGuard();
		}
	}

}

function reDrawLine()
{
	newPath.splice(0, 1);

	greenLine.clear();
	greenLine.lineStyle(15, 0x00FF00, 1);

	if (newPath.length > 0)
	{
		rotateBodyGuard()
		greenLine.moveTo(newPath[ 0 ].x, newPath[ 0 ].y);

		for (var i = 1; i < newPath.length; i++)
		{
			greenLine.lineTo(newPath[ i ].x, newPath[ i ].y);
		}
	}
}

function rotateBodyGuard()
{
	var lengthX = newPath[0].x - sprite.position.x;
	var lengthY = newPath[0].y - sprite.position.y;
	var correctingAngle = 0;
	if(lengthX < 0)
	{
		correctingAngle = Math.PI;
	}
	//console.log("Lengte X: "+lengthX+", lengte y: "+lengthY);


	sprite.body.rotation = Math.atan(lengthY/lengthX) + Math.PI/2 + correctingAngle;
}