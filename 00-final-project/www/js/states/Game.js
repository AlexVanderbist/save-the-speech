Trump.Game = function (game)
{

	this.PriceGuard = 10;
	this.moneyTimeOut = 2; // om de twee seconden 1 muntje
	this.tacoDamage = 30;
	this.defaultGuardHealth = 100.0;
	this.defaultPresidentHealth = 160.0;

	this.adding = false; // later ID ofzo
	this.money = 15;

	this.maxLineLength = 1000;
	this.guardFreeZoneRadius = 150;

};

Trump.Game.prototype = {

	create: function ()
	{

		// Create BG
		this.add.sprite(0, 0, 'concrete');
		var stand = this.add.sprite(this.world.centerX, this.world.centerY, 'stand');
		stand.anchor.setTo(0.5, 0.5);

		// Start P2 physics

		this.physics.startSystem(Phaser.Physics.P2JS);
		this.physics.p2.setImpactEvents(true);
		this.physics.p2.restitution = 0.8;

		// Create Groups

		guards = this.add.group();
		guards.enableBody = true;
		guards.physicsBodyType = Phaser.Physics.P2JS;
		guards.someOneIsActive = false;

		projectiles = this.add.group();
		projectiles.enableBody = true;
		projectiles.physicsBodyType = Phaser.Physics.P2JS;

		// Create collision groups

		this.trumpCollisionGroup = this.physics.p2.createCollisionGroup();
		this.projectileCollisionGroup = this.physics.p2.createCollisionGroup();
		this.collidedCollisionGroup = this.physics.p2.createCollisionGroup();
		this.guardCollisionGroup = this.physics.p2.createCollisionGroup();

		this.physics.p2.updateBoundsCollisionGroup();


		//check when is touched, then launch click function
		this.input.onDown.add(this.click, this);

		// Throw projectiles

		//keyW = this.input.keyboard.addKey(Phaser.Keyboard.W);
		//keyW.onDown.add(this.addCash, this);

		this.time.events.loop(Phaser.Timer.SECOND * 2, this.addProjectile, this);

		// create trump

		this.trump = this.add.sprite(this.world.centerX, this.world.centerY, 'trump');
		this.trump.health = this.defaultPresidentHealth;
		this.trump.healthBar = new HealthBar(this, {
			x     : this.trump.position.x,
			y     : this.trump.position.y - 40,
			width : 60,
			height: 10
		});
		this.trump.anchor.setTo(0.5, 0.5);
		this.physics.p2.enable(this.trump);
		this.trump.body.clearShapes();
		this.trump.body.loadPolygon('personPhysics', 'person');
		this.trump.body.static = true;
		this.trump.body.setCollisionGroup(this.trumpCollisionGroup);
		this.trump.body.collides(this.projectileCollisionGroup, this.onProjectileHitTrump, this);

		// trumpheads
		this.trumphead = this.add.sprite(10, 10, 'trumpsprite');
		this.trumprage = this.add.sprite(10, 10, 'trumprage');
		this.trumprage.visible = false;
		this.trumphead.visible = false;
		this.trumphead.animations.add('speak', [ 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0 ], true);
		this.trumphead.scale.setTo(0.17, 0.17);
		this.trumprage.scale.setTo(0.06, 0.06);
		this.trumphead.animations.play('speak', 40, true);

		// Add buttons

		button = this.add.button(this.world.width - 100, 10, 'addGuard', this.addGuard, this);

		// Add labels

		var style = {font: "40px Arial", fill: "#ffffff"};
		this.labelGuards = this.add.text(this.world.width - 80, 28, this.numberguards, style);
		this.labelMoney = this.add.text(80, 15, "money:" + this.money, style);

		// draw a circle around president
		guardFreeZone = this.add.graphics(0, 0);
		guardFreeZone.lineStyle(1, 0xFF0000, 1);
		guardFreeZone.drawCircle(this.world.centerX, this.world.centerY, this.guardFreeZoneRadius);

		// Give money every x seconds

		this.time.events.loop(Phaser.Timer.SECOND * this.moneyTimeOut, this.addMoney, this, 1);

		// Start waves
		this.startWave(1);
	},

	update: function ()
	{
		this.trump.angle += 1;

		// Check for clicks on guards
		this.guardClickHandler();

		// Update labels

		this.labelGuards.setText(Math.floor(this.money / this.PriceGuard)); // update this
		this.labelMoney.setText(this.money);

		// If adding, place guard

		if (this.input.activePointer.isDown && this.adding)
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
				path = guard.followPath.followLine;

				guard.alpha -= 0.04;
				path.alpha -= 0.04;
				guard.scale.setTo(guard.alpha, guard.alpha);
				if (guard.alpha < 0)
				{
					//remove the guard
					guard.destroy();

					path.destroy();
				}
			}
		}, this);

	},

	startWave: function (waveNumber)
	{
		// play first quote

		quote = this.add.audio('quote1');

		this.trumphead.visible = true;
		quote.play();
		quote.onStop.add(quoteStopped, this);
		function quoteStopped(quote)
		{
			this.trumphead.animations.stop(null, true);
		}


	},
	quitGame: function ()
	{
		this.state.start('MainMenu');
	},
	guardClickHandler: function ()
	{
		if (this.input.pointer1.isDown && guards.activeGuard !== null)
		{
			//console.log("clicked");
			var guardFollowPath = guards.activeGuard.followPath;

			var gameX = this.input.x;
			var gameY = this.input.y;

			if (!wasDown)
			{
				//console.log("eerste");
				guardFollowPath.followLine.moveTo(gameX, gameY);
				guardFollowPath.pathIndex = 0;
				guardFollowPath.pathSpriteIndex = 0;
				guardFollowPath.lengthLine = 0;
				guardFollowPath.path = [];
				guardFollowPath.newPath = [];
				wasDown = true;
			}
			var distanceToCenter = this.calculateDistance(gameX, gameY, game.world.centerX, game.world.centerY);

			if(distanceToCenter > this.guardFreeZoneRadius/2)
			{
				if (guardFollowPath.pathIndex != 0)
				{
					//console.log("okid");
					var fromX = guardFollowPath.path[ guardFollowPath.pathIndex - 1 ].x;
					var fromY = guardFollowPath.path[ guardFollowPath.pathIndex - 1 ].y;
					//console.log("van x:"+fromX+" van y: "+fromY);
					//console.log("game x:"+gameX+" game y: "+gameY);

					if(fromX != gameX || fromY != gameY)
					{
						if(guardFollowPath.lengthLine < this.maxLineLength)
						{
							guardFollowPath.path[ guardFollowPath.pathIndex ] = new Phaser.Point(gameX, gameY);
							guardFollowPath.newPath.push(new Phaser.Point(gameX, gameY));
							guardFollowPath.pathIndex++;
							//console.log(guardFollowPath.pathIndex);
						}
						else
						{
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
			var curGuard = guards.children[guard];
			var curGuardFollowPath = curGuard.followPath;
			if (curGuardFollowPath.path != null && curGuardFollowPath.path.length > 0 && curGuardFollowPath.pathSpriteIndex < curGuardFollowPath.pathIndex)
			{
				curGuardFollowPath.pathSpriteIndex = Math.min(curGuardFollowPath.pathSpriteIndex, curGuardFollowPath.path.length - 1);
				this.physics.arcade.moveToXY(guards.children[ guard ], curGuardFollowPath.newPath[ 0 ].x, curGuardFollowPath.newPath[ 0 ].y, 250);

				if (this.physics.arcade.distanceToXY(guards.children[ guard ], curGuardFollowPath.path[ curGuardFollowPath.pathSpriteIndex ].x, curGuardFollowPath.path[ curGuardFollowPath.pathSpriteIndex ].y) < 20)
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
	rotateGuard: function (guard)
	{
		if (guard.followPath.newPath.length > 0)
		{
			//console.log("rot");
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
	calculateDistance: function(x1, y1, x2, y2)
	{
		var lengthX = parseInt(x1) - parseInt(x2);
		var lengthY = parseInt(y1) - parseInt(y2);

		return Math.sqrt((lengthX * lengthX) + (lengthY * lengthY));
	},
	drawLine: function (guard)
	{
		this.world.sendToBack(guard.followLine);
		this.world.moveUp(guard.followLine);

		//console.log("ok");
		guard.newPath.splice(0, 1);

		guard.followLine.clear();
		guard.followLine.lineStyle(15, 0x00FF00, 1);

		guard.lengthLine = 0;

		if (guard.newPath.length > 0)
		{
			//rotateBodyGuard();
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
		//console.log("oki");
	},

	checkHealth: function ()
	{

		// check trump health
		if (this.trump.health <= 0)
		{
			// trump died :(
			this.destroyHealthbar(this.trump.healthBar);
			this.trump.destroy(); // for now
		}

		// update trump health bar
		this.trump.healthBar.setPercent((this.trump.health / this.defaultPresidentHealth) * 100);

		// check & update health bars for guards
		guards.forEachExists(function (guard)
		{
			guard.healthBar.setPosition(guard.position.x, guard.position.y - 40);
			guard.healthBar.setPercent((guard.health / this.defaultGuardHealth) * 100);

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
		var radius = Math.sqrt(Math.pow(this.world.width / 2, 2) + Math.pow(this.world.height / 2, 2));
		radius += 40; // make sure nothing is visible when spawning

        var isValidAngle = function (angle) {
            var degrees = angle * (180/Math.PI);
            var valid = true;
            if(degrees > 160 && degrees < 200) valid = false;
            if(degrees > 340 && degrees < 20) valid = false;

            return valid;
        }

        var angle;
        do {
            angle = Math.random() * Math.PI * 2;
        } while (! isValidAngle(angle))

		var pos = {
			x: Math.cos(angle) * radius + this.world.centerX,
			y: Math.sin(angle) * radius + this.world.centerY
		};

		//debug stuff
		// var graphics = this.add.graphics(this.world.centerX, this.world.centerY);
		// graphics.beginFill(0xFF0000, 1);
		// graphics.drawCircle(0, 0, radius * 2);

		return pos;

	},

	presidentRageStart: function ()
	{
		// enable rage
		this.trumphead.visible = false;
		this.trumprage.visible = true;

		// stop after 1500ms CHANGE THIS
		this.time.events.add(Phaser.Timer.SECOND * 1, this.presidentRageStop, this);
	},

	presidentRageStop: function ()
	{
		this.trumphead.visible = true;
		this.trumprage.visible = false;
	},

	addProjectile: function ()
	{
		var randomPos = this.getRandomPositionOffScreen();
		var taco = this.add.sprite(randomPos.x, randomPos.y, 'taco');
		projectiles.add(taco);
		taco.kill = false;
		taco.body.clearShapes();
		taco.body.loadPolygon('tacoPhysics', 'taco');
		taco.body.setCollisionGroup(this.projectileCollisionGroup);
		taco.body.collides([ this.trumpCollisionGroup, this.projectileCollisionGroup, this.guardCollisionGroup ]);
		taco.body.collideWorldBounds = false;
		this.throwProjectileToObj(taco, this.trump, 160);

		// var sound = this.add.audio('drop');
		// sound.play();
	},

	onProjectileHitTrump: function (body1, body2)
	{
		// stop the projectile
		this.stopProjectile(body2.sprite);

		// take trumps health
		if (body2.sprite.key == 'taco')
		{
			this.trump.health -= this.tacoDamage;
			this.checkHealth();
		}

		//rage
		this.presidentRageStart();
	},

	stopProjectile: function (projectileSprite)
	{
		projectileSprite.body.damping = 0.8;
		projectileSprite.body.angularDamping = 0.7;
		projectileSprite.body.setCollisionGroup(this.collidedCollisionGroup);
		projectileSprite.kill = true;
	},

	throwProjectileToObj: function (obj1, obj2, speed)
	{
		if (typeof speed === 'undefined')
		{
			speed = 60;
		}
		var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);

        if(Math.random() < 0.2) {
            console.log("miss");
            angle += (0.3 * 2) * Math.random() - 0.3;
        }

		obj1.body.rotation = angle + this.math.degToRad(-20);  // correct angle of angry bullets (depends on the sprite used)
		obj1.body.velocity.x = Math.cos(angle) * speed;    // accelerateToObject
		obj1.body.velocity.y = Math.sin(angle) * speed;
	},

	addGuard: function ()
	{
		if (this.money >= this.PriceGuard)
		{
			this.adding = true;
			this.addingGuard = this.add.sprite(this.world.width - 100, 10, 'addingGuard');
		}

	},

	destroyHealthbar: function (healthbar)
	{
		healthbar.barSprite.destroy();
		healthbar.bgSprite.destroy();
	},

	placeGuard: function ()
	{
		var inputX = this.input.x;
		var inputY = this.input.y;

		if(this.calculateDistance(inputX, inputY, this.world.centerX, this.world.centerY))
		{
			var guard = this.add.sprite(inputX, inputY, 'bodyguard');
			guards.add(guard);
			this.addingGuard.destroy();
			this.money -= this.PriceGuard;
			this.adding = false;
			guard.healthBar = new HealthBar(this.game, {
				x     : guard.position.x,
				y     : guard.position.y - 40,
				width : 60,
				height: 10
			});
			guard.health = this.defaultGuardHealth;
			guard.kill = false;
			guard.body.clearShapes();
			guard.body.loadPolygon('personPhysics', 'person');
			guard.body.static = true;
			guard.body.setCollisionGroup(this.guardCollisionGroup);
			guard.body.collides([ this.projectileCollisionGroup ], this.onProjectileHitGuard, this);

			guard.animations.add('walk', [ 1, 2 ], 5, true);

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
	},

	onProjectileHitGuard: function (guardBody, projectileBody)
	{
		this.stopProjectile(projectileBody.sprite);

		// take guard health
		if (projectileBody.sprite.key == 'taco')
		{
			guardBody.sprite.health -= this.tacoDamage;
			this.checkHealth();
		}
	},

	addMoney: function (amount)
	{
		this.money += amount;
	},

	click: function (object)
	{
		var bodies = this.physics.p2.hitTest(object.position, guards.children);

		if (bodies.length !== 0)
		{
			bodies[ 0 ].parent.sprite.followPath.isActive = true;
			guards.activeGuard = bodies[ 0 ].parent.sprite;
		}
	}

};