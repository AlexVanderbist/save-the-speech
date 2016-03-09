var app = {
	// Application Constructor
	initialize: function ()
	{
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function ()
	{
		document.addEventListener('deviceready', loadGame, false);
	}
};


//////////////////////////////////


var game;
var preload;
var playgame;

/* Begin Siebe Add*/
var maxLineLength = 1000;
var guardFreeZoneRadius = 250;

var DEBUG = false;
/* End Siebe Add*/

var loadGame = function ()
{

	// Create a new Phaser Game
	game = new Phaser.Game(window.innerWidth, window.innerHeight);

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
		game.load.image("addGuard", "assets/addGuard.png");
		game.load.image("addingGuard", "assets/addingGuard.png");
		game.load.image("trumprage", 'assets/trumprage.png');
		game.load.image("concrete", 'assets/concrete.png');
		game.load.image("stand", 'assets/stand.png');
		// and sprites
		game.load.spritesheet('trumpsprite', 'assets/trumpsprite.png', 353, 624, 6);
		game.load.spritesheet('bodyguard', 'assets/bodyguardSprite.png', 64, 64);

		// Preload sounds
		game.load.audio('quote1', 'assets/sounds/Worst_President.mp3');

		// preload physics
		game.load.physics('tacoPhysics', 'assets/physics/taco.json');
		game.load.physics('personPhysics', 'assets/physics/person.json');

		// Vars
		game.PriceGuard = 10;
		game.moneyTimeOut = 2; // om de twee seconden 1 muntje
		game.tacoDamage = 30;
		game.defaultGuardHealth = 100.0;
		game.defaultPresidentHealth = 160.0;

		game.adding = false; // later ID ofzo
		game.money = 15;
	},
	create: function ()
	{
		// Everything is loaded, start the "Playgame" State
		game.state.start("Playgame");
	}
};

playgame = function (game)
{
};
playgame.prototype = {
	create: function ()
	{
		// Create BG
		game.add.sprite(0, 0, 'concrete');
		var stand = game.add.sprite(game.world.centerX, game.world.centerY, 'stand');
		stand.anchor.setTo(0.5, 0.5);

		// Start P2 physics

		game.physics.startSystem(Phaser.Physics.P2JS);
		game.physics.p2.setImpactEvents(true);
		game.physics.p2.restitution = 0.8;

		// Create Groups

		guards = game.add.group();
		guards.enableBody = true;
		guards.physicsBodyType = Phaser.Physics.P2JS;
		guards.someOneIsActive = false;

		projectiles = game.add.group();
		projectiles.enableBody = true;
		projectiles.physicsBodyType = Phaser.Physics.P2JS;

		// Create collision groups

		game.trumpCollisionGroup = game.physics.p2.createCollisionGroup();
		game.projectileCollisionGroup = game.physics.p2.createCollisionGroup();
		game.collidedCollisionGroup = game.physics.p2.createCollisionGroup();
		game.guardCollisionGroup = game.physics.p2.createCollisionGroup();

		game.physics.p2.updateBoundsCollisionGroup();


		//check when is touched, then launch click function
		game.input.onDown.add(this.click, this);

		// Throw projectiles

		// keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
		// keyW.onDown.add(this.addProjectile, this);

		game.time.events.loop(Phaser.Timer.SECOND * 2, this.addProjectile, this);

		// create trump

		game.trump = game.add.sprite(game.world.centerX, game.world.centerY, 'trump');
		game.trump.health = game.defaultPresidentHealth;
		game.trump.healthBar = new HealthBar(this.game, {
			x     : game.trump.position.x,
			y     : game.trump.position.y - 40,
			width : 60,
			height: 10
		});
		game.trump.anchor.setTo(0.5, 0.5);
		game.physics.p2.enable(game.trump);
		game.trump.body.clearShapes();
		game.trump.body.loadPolygon('personPhysics', 'person');
		game.trump.body.static = true;
		game.trump.body.setCollisionGroup(game.trumpCollisionGroup);
		game.trump.body.collides(game.projectileCollisionGroup, this.onProjectileHitTrump, this);

		// Create Trump heads

		game.trumphead = game.add.sprite(10, 10, 'trumpsprite');
		game.trumprage = game.add.sprite(10, 10, 'trumprage');
		game.trumprage.visible = false;
		game.trumphead.visible = false;
		game.trumphead.animations.add('speak', [ 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0 ], true);
		game.trumphead.scale.setTo(0.17, 0.17);
		game.trumprage.scale.setTo(0.06, 0.06);
		game.trumphead.animations.play('speak', 40, true);

		// Add buttons

		button = game.add.button(game.world.width - 100, 10, 'addGuard', this.addGuard, this);

		// Add labels

		var style = {font: "40px Arial", fill: "#ffffff"};
		game.labelGuards = this.game.add.text(game.world.width - 80, 28, game.numberguards, style);
		game.labelMoney = this.game.add.text(80, 15, "money:" + game.money, style);

		/* Begin Siebe Add*/
		// draw a circle
		guardFreeZone = game.add.graphics(0,0);
		guardFreeZone.lineStyle(2, 0x0000FF, 1);
		guardFreeZone.drawCircle(game.world.centerX, game.world.centerY, guardFreeZoneRadius);
		/* End Siebe Add*/
		// Give money every x seconds

		game.time.events.loop(Phaser.Timer.SECOND * game.moneyTimeOut, this.addMoney, this, 1);

		// Start waves
		this.startWave(1);
	},
	startWave: function (waveNumber)
	{
		// play first quote

		quote = game.add.audio('quote1');

		game.trumphead.visible = true;
		quote.play();
		quote.onStop.add(quoteStopped, this);
		function quoteStopped(quote)
		{
			game.trumphead.animations.stop(null, true);
		}


	},
	update: function ()
	{

		game.trump.angle += 1;

		// Check for clicks on guards
		this.guardClickHandler();

		// Update labels

		game.labelGuards.setText(Math.floor(game.money / game.PriceGuard)); // update this
		game.labelMoney.setText(game.money);

		// If adding, place guard

		if (game.input.activePointer.isDown && game.adding)
		{
			this.placeGuard();
		}

		// Fade out projectiles and slow down when hit

		projectiles.forEachExists(function (projectile)
		{
			if (projectile.kill)
			{
				projectile.alpha -= 0.04;
				if (projectile.alpha < 0)
				{
					//remove the projectile
					projectile.destroy();
				}
			}
		}, this);

		// Fade out guards and slow down when hit AND move healthbars

		guards.forEachExists(function (guard)
		{
			// move health bar
			guard.healthBar.setPosition(guard.position.x, guard.position.y - 40);

			// kill guard with fade
			if (guard.kill)
			{
				/* Begin Siebe Add*/
				path = guard.followPath.followLine;
				/* End Siebe Add*/

				guard.alpha -= 0.04;
				guard.scale.setTo(guard.alpha, guard.alpha);

				/* Begin Siebe Add*/
				path.alpha -= 0.04;
				/* End Siebe Add*/

				if (guard.alpha < 0)
				{
					//remove the guard
					guard.destroy();
					/* Begin Siebe Add*/
					path.destroy();
					/* End Siebe Add*/
				}
			}
		}, this);

	},
	/* Begin Siebe Add (best deze functie's kopieren en plakken*/
	guardClickHandler: function ()
	{
		if (game.input.pointer1.isDown && guards.activeGuard !== null)
		{
			//console.log("ok");
			var guardFollowPath = guards.activeGuard.followPath;

			var gameX = game.input.x;
			var gameY = game.input.y;
			if (!wasDown)
			{
				//console.log("eerste");
				guardFollowPath.followLine.moveTo(gameX, gameY);
				guardFollowPath.pathIndex = 0;
				guardFollowPath.pathSpriteIndex = 0;
				guardFollowPath.path = [];
				guardFollowPath.lengthLine = 0;
				guardFollowPath.newPath = [];
				wasDown = true;
			}

			//Check if not in guard dead zone
			var distanceToCenter = this.calculateDistance(gameX, gameY, game.world.centerX, game.world.centerY);

			if(distanceToCenter > guardFreeZoneRadius/2)
			{
				if (guardFollowPath.pathIndex != 0)
				{
					var fromX = guardFollowPath.path[ guardFollowPath.pathIndex - 1 ].x;
					var fromY = guardFollowPath.path[ guardFollowPath.pathIndex - 1 ].y;

					if (fromX != gameX || fromY != gameY)
					{
						if (guardFollowPath.lengthLine < maxLineLength)
						{
							guardFollowPath.path[ guardFollowPath.pathIndex ] = new Phaser.Point(gameX, gameY);
							guardFollowPath.newPath.push(new Phaser.Point(gameX, gameY));
							guardFollowPath.pathIndex++;
						}
						else
						{
							//console.log("Te lang");
							guards.activeGuard = null;
							wasDown = false;
						}
					}
				}
				else
				{
					guardFollowPath.path[ guardFollowPath.pathIndex ] = new Phaser.Point(gameX, gameY);
					guardFollowPath.newPath.push(new Phaser.Point(gameX, gameY));
					guardFollowPath.pathIndex++;
				}
			}
			else
			{
				guards.activeGuard = null;
				wasDown = false;
			}
		}
		else
		{
			guards.activeGuard = null;
			wasDown = false;
		}

		this.guardMoveHandler();
	},
	guardMoveHandler: function ()
	{
		for (var guard = 0; guard < guards.children.length; guard++)
		{
			var curGuardFollowPath = guards.children[ guard ].followPath;
			var curGuard = guards.children[ guard ];
			if (curGuardFollowPath.path != null && curGuardFollowPath.path.length > 0 && curGuardFollowPath.pathSpriteIndex < curGuardFollowPath.pathIndex)
			{
				curGuardFollowPath.pathSpriteIndex = Math.min(curGuardFollowPath.pathSpriteIndex, curGuardFollowPath.path.length - 1);
				game.physics.arcade.moveToXY(curGuard, curGuardFollowPath.newPath[ 0 ].x, curGuardFollowPath.newPath[ 0 ].y, 250);

				var moveToX = curGuardFollowPath.path[ curGuardFollowPath.pathSpriteIndex ].x;
				var moveToY = curGuardFollowPath.path[ curGuardFollowPath.pathSpriteIndex ].y;

				if (game.physics.arcade.distanceToXY(curGuard, moveToX , moveToY) < 20)
				{
					curGuardFollowPath.pathSpriteIndex++;
					curGuard.animations.play('walk');
					if (curGuardFollowPath.pathSpriteIndex >= curGuardFollowPath.pathIndex)
					{
						//console.log("stop");
						curGuard.body.velocity.destination[ 0 ] = 0;
						curGuard.body.velocity.destination[ 1 ] = 0;
						curGuard.animations.stop(null, true);
						curGuard.frame = 0;
					}
					this.drawLine(curGuardFollowPath);
					this.rotateGuard(curGuard);
				}
			}
		}
	},
	/* End Siebe Add*/
	rotateGuard: function (guard)
	{
		if (guard.followPath.newPath.length > 0)
		{
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
	/* Begin Siebe Add, best ook deze functie kopieren en plakken*/
	drawLine: function (guard)
	{
		game.world.sendToBack(guard.followLine);
		game.world.moveUp(guard.followLine);

		guard.newPath.splice(0, 1);

		guard.followLine.clear();
		guard.followLine.lineStyle(15, 0x00FF00, 1);

		guard.lengthLine = 0;

		if (guard.newPath.length > 0)
		{
			if(DEBUG)
			{
				console.log("========New=========");
				console.log("lengte totaal:" + guard.lengthLine);
			}
			guard.followLine.moveTo(guard.newPath[ 0 ].x, guard.newPath[ 0 ].y);

			for (var i = 1; i < guard.newPath.length; i++)
			{
				var fromX = guard.newPath[ i - 1 ].x;
				var fromY = guard.newPath[ i - 1 ].y;

				var toX = guard.newPath[ i ].x;
				var toY = guard.newPath[ i ].y;

				guard.lengthLine += this.calculateDistance(toX, toY, fromX, fromY);

				guard.followLine.lineTo(guard.newPath[ i ].x, guard.newPath[ i ].y);
			}
		}
		if(DEBUG)
		{
			console.log("Lengte totaal: " + guard.lengthLine);
		}
	},
	calculateDistance: function(x1, y1, x2, y2)
	{
		var lengthX = parseInt(x1) - parseInt(x2);
		var lengthY = parseInt(y1) - parseInt(y2);

		return Math.sqrt((lengthX * lengthX) + (lengthY * lengthY));
	},
	/* End Siebe add */
	checkHealth: function ()
	{

		// check trump health
		if (game.trump.health <= 0)
		{
			// trump died :(
			this.destroyHealthbar(game.trump.healthBar);
			game.trump.destroy(); // for now
		}

		// update trump health bar
		game.trump.healthBar.setPercent((game.trump.health / game.defaultPresidentHealth) * 100);

		// check & update health bars for guards
		guards.forEachExists(function (guard)
		{
			guard.healthBar.setPosition(guard.position.x, guard.position.y - 40);
			guard.healthBar.setPercent((guard.health / game.defaultGuardHealth) * 100);

			if (guard.health <= 0)
			{
				guard.body.angularVelocity = 10;
				guard.kill = true;
				this.destroyHealthbar(guard.healthBar);
			}
		}, this);
	},
	getRandomPositionOffScreen: function ()
	{
		var radius = Math.sqrt(Math.pow(game.world.width / 2, 2) + Math.pow(game.world.height / 2, 2));
		radius += 40; // make sure nothing is visible when spawning
		var angle = Math.random() * Math.PI * 2;

		var pos = {
			x: Math.cos(angle) * radius + game.world.centerX,
			y: Math.sin(angle) * radius + game.world.centerY
		};

		//debug stuff
		// var graphics = game.add.graphics(game.world.centerX, game.world.centerY);
		// graphics.beginFill(0xFF0000, 1);
		// graphics.drawCircle(0, 0, radius * 2);

		return pos;

	},
	presidentRageStart: function ()
	{
		// enable rage
		game.trumphead.visible = false;
		game.trumprage.visible = true;

		// stop after 1500ms CHANGE THIS
		game.time.events.loop(Phaser.Timer.SECOND, this.presidentRageStop, this);
	},
	presidentRageStop: function ()
	{
		game.trumphead.visible = true;
		game.trumprage.visible = false;
	},
	addProjectile: function ()
	{
		var randomPos = this.getRandomPositionOffScreen();
		var taco = game.add.sprite(randomPos.x, randomPos.y, 'taco');
		projectiles.add(taco);
		taco.kill = false;
		taco.body.clearShapes();
		taco.body.loadPolygon('tacoPhysics', 'taco');
		taco.body.setCollisionGroup(game.projectileCollisionGroup);
		taco.body.collides([ game.trumpCollisionGroup, game.projectileCollisionGroup, game.guardCollisionGroup ]);
		taco.body.collideWorldBounds = false;
		this.throwProjectileToObj(taco, game.trump, 160);

		// var sound = game.add.audio('drop');
		// sound.play();
	},
	onProjectileHitTrump: function (body1, body2)
	{
		// stop the projectile
		this.stopProjectile(body2.sprite);

		// take trumps health
		if (body2.sprite.key == 'taco')
		{
			game.trump.health -= game.tacoDamage;
			this.checkHealth();
		}

		//rage
		this.presidentRageStart();
	},
	stopProjectile: function (projectileSprite)
	{
		projectileSprite.body.damping = 0.8;
		projectileSprite.body.angularDamping = 0.7;
		projectileSprite.body.setCollisionGroup(game.collidedCollisionGroup);
		projectileSprite.kill = true;
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
	addGuard: function ()
	{
		if (game.money >= game.PriceGuard)
		{
			game.adding = true;
			game.addingGuard = game.add.sprite(game.world.width - 100, 10, 'addingGuard');
		}
	},
	destroyHealthbar: function (healthbar)
	{
		healthbar.barSprite.destroy();
		healthbar.bgSprite.destroy();
	},
	placeGuard: function ()
	{
		/* Begin Siebe Add*/
		var inputX = game.input.x;
		var inputY = game.input.y;

		if(this.calculateDistance(inputX, inputY, game.world.centerX, game.world.centerY) > guardFreeZoneRadius/2)
		{
			var guard = game.add.sprite(inputX, inputY, 'bodyguard');
			/* End Siebe Add*/
			guards.add(guard);
			game.addingGuard.destroy();
			game.money -= game.PriceGuard;
			game.adding = false;
			guard.healthBar = new HealthBar(this.game, {
				x     : guard.position.x,
				y     : guard.position.y - 40,
				width : 60,
				height: 10
			});
			guard.health = game.defaultGuardHealth;
			guard.kill = false;

			guard.body.clearShapes();
			guard.body.loadPolygon('personPhysics', 'person');
			guard.body.static = true;
			guard.body.setCollisionGroup(game.guardCollisionGroup);
			guard.body.collides([ game.projectileCollisionGroup ], this.onProjectileHitGuard, this);

			guard.animations.add('walk', [ 1, 2 ], 5, true);

			/* Begin Siebe Add*/
			guard.followPath = {
				isActive: false,
				path: [],
				newPath: [],
				pathIndex : -1,
				pathSpriteIndex: -1,
				lengthLine: 0,
				followLine: game.add.graphics(0, 0)
			};

		}
		/* End Siebe Add*/
	},
	onProjectileHitGuard: function (guardBody, projectileBody)
	{
		this.stopProjectile(projectileBody.sprite);

		// take guard health
		if (projectileBody.sprite.key == 'taco')
		{
			guardBody.sprite.health -= game.tacoDamage;
			this.checkHealth();
		}
	},
	addMoney: function (amount)
	{
		game.money += amount;
	},
	click: function (object)
	{
		var bodies = game.physics.p2.hitTest(object.position, guards.children);

		/* Begin Siebe Add*/
		if (bodies.length !== 0)
		{
			bodies[ 0 ].parent.sprite.followPath.isActive = true;
			guards.activeGuard = bodies[ 0 ].parent.sprite;
		}
		/* End Siebe Add*/
	}
};
