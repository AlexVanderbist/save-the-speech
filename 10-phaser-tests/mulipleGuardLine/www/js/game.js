var game;
var preload;
var playgame;
var wasDown = false;

window.onload = function ()
{

	// Create a new Phaser Game
	game = new Phaser.Game(360, 640);

	// Add the game states
	game.state.add("Preload", preload);
	game.state.add("Playgame", playgame);

	// Start the "Preload" state
	game.state.start("Preload");

};

preload = function (game)
{
};
preload.prototype = {
	preload: function ()
	{

		// Preload images
		game.load.image("trump", "assets/trump.png");
		//game.load.image("bodyguard", "assets/bodyguard.png");
		game.load.image("taco", "assets/taco.png");
		game.load.image("field", "assets/soccerfield.png");
		game.load.image("addGuard", "assets/addGuard.png");
		game.load.image("addingGuard", "assets/addingGuard.png");

		game.load.spritesheet('bodyguard', 'assets/bodyguardSprite.png', 64, 64);

		// preload physics
		game.load.physics('tacoPhysics', 'assets/physics/taco.json');
		game.load.physics('personPhysics', 'assets/physics/person.json');

		game.adding = false;
		game.money = 5;

	},
	create : function ()
	{

		// Everything is loaded, start the "Playgame" State
		game.state.start("Playgame");

	}
};

playgame = function (game)
{
};

playgame.prototype = {
	create              : function ()
	{
		game.add.sprite(0, 0, 'field');
		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.setImpactEvents(true);
		game.physics.p2.restitution = 0.8;

		projectiles = game.add.group();
		projectiles.enableBody = true;
		projectiles.physicsBodyType = Phaser.Physics.P2JS;

		guards = game.add.group();
		guards.enableBody = true;
		guards.someOneIsActive = false;
		guards.physicsBodyType = Phaser.Physics.P2JS;

		game.trumpCollisionGroup = game.physics.p2.createCollisionGroup();
		game.projectileCollisionGroup = game.physics.p2.createCollisionGroup();

		game.guardCollisionGroup = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup();


		// when pressing W create a new projectile
		keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
		keyW.onDown.add(this.addProjectile, this);

		//check when is touched, then launch click function
		game.input.onDown.add(this.click, this);

		// create trump
		game.trump = game.add.sprite(game.world.centerX, game.world.centerY, 'trump');
		game.trump.anchor.setTo(0.5, 0.5);
		game.physics.p2.enable(game.trump);
		game.trump.body.clearShapes();
		game.trump.body.loadPolygon('personPhysics', 'person');
		game.trump.body.static = true;
		game.trump.body.setCollisionGroup(game.trumpCollisionGroup);
		game.trump.body.collides([ game.projectileCollisionGroup, game.guardCollisionGroup ], this.onProjectileHitTrump, this);

		button = game.add.button(game.world.width - 100, 10, 'addGuard', this.addingGuardfunc, this);
		var style = {font: "40px Arial", fill: "#ffffff"};
		game.labelGuards = this.game.add.text(game.world.width - 80, 28, game.money, style);
	},
	click               : function (object)
	{
		var bodies = game.physics.p2.hitTest(object.position, guards.children);

		//console.log(bodies);
		//console.log(object);

		var result;
		if (bodies.length === 0)
		{
			result = "You didn't click a Body";
		}
		else
		{
			bodies[ 0 ].parent.sprite.followPath.isActive = true;
			guards.activeGuard = bodies[ 0 ].parent.sprite;
			result = "Hooray";
		}

		console.log(result);
	},
	update              : function ()
	{

		game.trump.angle += 1;

		game.labelGuards.setText(game.money);
		if (game.input.activePointer.isDown && game.adding)
		{
			this.addGuard();
		}

		this.guardClickHandler();
	},
	guardClickHandler   : function ()
	{
		if (game.input.pointer1.isDown && guards.activeGuard !== null)
		{
			console.log("ok");
			if (!wasDown)
			{
				console.log("eerste");
				guards.activeGuard.followPath.greenLine.moveTo(game.input.x, game.input.y);
				guards.activeGuard.followPath.pathIndex = 0;
				guards.activeGuard.followPath.pathSpriteIndex = 0;
				guards.activeGuard.followPath.path = [];
				guards.activeGuard.followPath.newPath = [];
				wasDown = true;
			}
			if (guards.activeGuard.followPath.pathIndex == 0 || (guards.activeGuard.followPath.path[ guards.activeGuard.followPath.pathIndex - 1 ].x != game.input.x || guards.activeGuard.followPath.path[ guards.activeGuard.followPath.pathIndex - 1 ].y != game.input.y))
			{
				guards.activeGuard.followPath.path[ guards.activeGuard.followPath.pathIndex ] = new Phaser.Point(game.input.x, game.input.y);
				guards.activeGuard.followPath.newPath.push(new Phaser.Point(game.input.x, game.input.y));
				guards.activeGuard.followPath.pathIndex++;
			}
		}
		else
		{
			guards.activeGuard = null;
			wasDown = false;
		}

		this.guardMoveHandler();
	},
	guardMoveHandler    : function ()
	{
		for (var guard = 0; guard < guards.children.length; guard++)
		{
			var curGuard = guards.children[ guard ].followPath;
			if (curGuard.path != null && curGuard.path.length > 0 && curGuard.pathSpriteIndex < curGuard.pathIndex)
			{
				curGuard.pathSpriteIndex = Math.min(curGuard.pathSpriteIndex, curGuard.path.length - 1);
				game.physics.arcade.moveToXY(guards.children[ guard ], curGuard.newPath[ 0 ].x, curGuard.newPath[ 0 ].y, 250);

				if (game.physics.arcade.distanceToXY(guards.children[ guard ], curGuard.path[ curGuard.pathSpriteIndex ].x, curGuard.path[ curGuard.pathSpriteIndex ].y) < 20)
				{
					curGuard.pathSpriteIndex++;
					guards.children[ guard ].animations.play('walk');
					if (curGuard.pathSpriteIndex >= curGuard.pathIndex)
					{
						console.log("stop");
						guards.children[ guard ].body.velocity.destination[ 0 ] = 0;
						guards.children[ guard ].body.velocity.destination[ 1 ] = 0;
						guards.children[ guard ].animations.stop(null, true);
						guards.children[ guard ].frame = 0;
					}
					this.drawLine(curGuard);
					this.rotateGuard(guards.children[ guard ]);
				}
			}
		}
	},
	rotateGuard         : function (guard)
	{
		if (guard.followPath.newPath.length > 0)
		{
			console.log("rot");
			var lengthX = guard.followPath.newPath[ 0 ].x - guard.position.x;
			var lengthY = guard.followPath.newPath[ 0 ].y - guard.position.y;
			var correctingAngle = 0;

			if (lengthX < 0)
			{
				correctingAngle = Math.PI;
			}

			guard.body.rotation = Math.atan(lengthY / lengthX) + Math.PI / 2 + correctingAngle;
		}
	},
	drawLine            : function (guard)
	{
		guard.newPath.splice(0, 1);

		guard.greenLine.clear();
		guard.greenLine.lineStyle(15, 0x00FF00, 1);

		if (guard.newPath.length > 0)
		{
			//rotateBodyGuard();
			guard.greenLine.moveTo(guard.newPath[ 0 ].x, guard.newPath[ 0 ].y);

			for (var i = 1; i < guard.newPath.length; i++)
			{
				guard.greenLine.lineTo(guard.newPath[ i ].x, guard.newPath[ i ].y);
			}
		}
	},
	addProjectile       : function ()
	{
		var taco = game.add.sprite(game.world.randomX, game.world.randomY, 'taco');
		projectiles.add(taco);
		taco.body.clearShapes();
		taco.body.loadPolygon('tacoPhysics', 'taco');
		taco.body.setCollisionGroup(game.projectileCollisionGroup);
		taco.body.collides([ game.trumpCollisionGroup, game.projectileCollisionGroup, game.guardCollisionGroup ]);
		this.throwProjectileToObj(taco, game.trump, 200);
		// var sound = game.add.audio('drop');
		// sound.play();
	},
	onProjectileHitTrump: function (obj1, obj2)
	{
		console.log('hit trump');
		obj2.damping = 0.8;
		obj2.angularDamping = 0.7;
		obj2.kill = true;

		game.money++;
	},
	throwProjectileToObj: function (obj1, obj2, speed)
	{
		if (typeof speed === 'undefined')
		{
			speed = 60;
		}
		var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
		obj1.body.rotation = angle + game.math.degToRad(-20);  // correct angle of angry bullets (depends on the sprite used)
		obj1.body.velocity.x = Math.cos(angle) * speed;    // accelerateToObject
		obj1.body.velocity.y = Math.sin(angle) * speed;
	},
	addingGuardfunc     : function ()
	{
		if (game.money > 0)
		{
			game.adding = true;
			game.addingGuard = game.add.sprite(game.world.width - 100, 10, 'addingGuard');
		}

	},
	addGuard            : function ()
	{
		var guard = game.add.sprite(game.input.x, game.input.y, 'bodyguard');
		game.addingGuard.destroy();
		//game.money--;
		game.adding = false;
		guards.add(guard);
		guard.body.clearShapes();
		guard.body.loadPolygon('personPhysics', 'person');
		guard.body.static = true;
		guard.body.setCollisionGroup(game.guardCollisionGroup);
		guard.body.collides([ game.projectileCollisionGroup, game.trumpCollisionGroup ]);

		guard.animations.add('walk', [ 1, 2 ], 5, true);

		guard.followPath = {};

		guard.followPath.isActive = false;
		guard.followPath.path = [];
		guard.followPath.newPath = [];
		guard.followPath.pathIndex = -1;
		guard.followPath.pathSpriteIndex = -1;
		guard.followPath.greenLine = game.add.graphics(0, 0);
	}
};
