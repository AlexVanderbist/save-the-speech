Trump.Game = function (game)
{
	this.defaultValues = {};

	this.PriceGuard = 10;
	this.PriceFence = 15;
	this.moneyTimeOut = 2; // om de twee seconden 1 muntje
	this.tacoDamage = 30;
    this.bomberDamage = 100;
	this.defaultGuardHealth = 100.0;
	this.defaultPresidentHealth = 160.0;
	this.defaultFenceHealth = 200.0;

	// moved to create
	// this.adding = false; // later ID ofzo
	// this.money = 15;
 	// this.score = 0;

	this.maxLineLength = 1000;
	this.guardFreeZoneRadius = 60;

	this.stupidquote = [];
	this.ouch = [];
	this.moneyhittrump = [];

	this.moneyhitguard = null;
	this.moneyhit = null;
	this.tacohit = null;

	this.defaultValues.moneyValue = 5;
	this.defaultValues.moneyRate = 6;
	this.defaultValues.moneyEndRate = 4;
	this.defaultValues.tacoRate = 2;
	
	this.defaultValues.bomberRate = 15;
	this.defaultValues.tacoEndRate = 1.7;
	this.defaultValues.healthRegenerate = 4;
	this.defaultValues.waveLength = 16;

	this.projectileDespawnTime = 7;

	this.defaultValues.triggerDistance = 70;
	this.defaultValues.waveNumber = 1;

	this.defaultValues.speedGuard = 250;

	this.guardColors = [
		"000000",
		"b4b4b4",
		"e7e7e7",
		"b2a4a4",
		"584141",
		"80708d",
		"014532",
		"1a2d28",
		"897192",
		"525a26"
	];

	game.defaultValues = this.defaultValues;
};

Trump.Game.prototype =
{
	/* Start Siebe Add */
	returnTrueValue: function (variable, defaultValue)
	{
		if(variable === undefined)
		{
			return defaultValue;
		}
		else
		{
			return variable;
		}
	},
	setDefaultsValues: function()
	{
		var defaultValues = this.defaultValues;
		for(defaultValue in defaultValues)
		{
			this[defaultValue] = this.returnTrueValue(game[defaultValue], this.defaultValues[defaultValue]);
		}
	},
	/* End Siebe Add */

	create: function ()
	{
		this.setDefaultsValues();
    // Reset Game
		game.addingGuard = false; // later ID ofzo
		game.addingFence = false;
		this.money = 15;
		game.score = 0;
		//this.waveNumber = 1; wordt gedaan in setDefaultValues zodat we da in settings kunnen veranderen

		//put sounds in array
		this.stupidquote.push(
			this.add.audio('quote1'),
			this.add.audio('quote2'),
			this.add.audio('quote3'),
			this.add.audio('quote4'),
			this.add.audio('quote5'),
			this.add.audio('quote6'),
			this.add.audio('quote7'),
			this.add.audio('quote8'),
			this.add.audio('quote9'),
			this.add.audio('quote10')
		);

		this.ouch.push(
			this.add.audio('ouch1'),
			this.add.audio('ouch2')
		);

		this.moneyhittrump.push(
			this.add.audio('money1'),
			this.add.audio('money2'),
			this.add.audio('money3')
		);

		this.tacohit = this.add.audio('tacohit');
		this.moneyhitguard = this.add.audio('guardmoneyhit');
		this.moneyhit = this.add.audio('moneyhit');
		this.explosionsound = game.add.audio('explosionfx');

		// Create BG
		this.add.sprite(0, 0, 'concrete');
		var stand = this.add.sprite(this.world.centerX, this.world.centerY, 'stand');
		stand.anchor.setTo(0.5, 0.5);

		// Start P2 physics

		//this.physics.startSystem(Phaser.Physics.P2JS);
		//this.physics.p2.setImpactEvents(true);
		//this.physics.p2.restitution = 0.8;

		// Create Groups

		guards = this.add.group();
		guards.enableBody = true;
		guards.physicsBodyType = Phaser.Physics.P2JS;

		projectiles = this.add.group();
		projectiles.enableBody = true;
		projectiles.physicsBodyType = Phaser.Physics.P2JS;

		cashgroup = this.add.group();
		cashgroup.enableBody = true;
		cashgroup.physicsBodyType = Phaser.Physics.P2JS;

        fences = this.add.group();
        fences.enableBody = true;
        fences.physicsBodyType = Phaser.Physics.P2JS;

        bombers = this.add.group();
        bombers.enableBody = true;
        bombers.physicsBodyType = Phaser.Physics.P2JS;

		// Create collision groups

		this.trumpCollisionGroup = this.physics.p2.createCollisionGroup();
		this.projectileCollisionGroup = this.physics.p2.createCollisionGroup();
		this.collidedCollisionGroup = this.physics.p2.createCollisionGroup();
		this.guardCollisionGroup = this.physics.p2.createCollisionGroup();
		this.cashCollisionGroup = this.physics.p2.createCollisionGroup();
        this.fencesCollisionGroup = this.physics.p2.createCollisionGroup();
        this.bombersCollisionGroup = this.physics.p2.createCollisionGroup();

		this.physics.p2.updateBoundsCollisionGroup();


		//check when is touched, then launch click function
		this.input.onDown.add(this.click, this);

		// Throw projectiles

		//keyW = this.input.keyboard.addKey(Phaser.Keyboard.W);
		//keyW.onDown.add(this.addCash, this);

		this. tacoLoop = this.time.events.loop(Phaser.Timer.SECOND * this.tacoRate, this.addProjectile, this);
		this.moneyLoop = this.time.events.loop(Phaser.Timer.SECOND * this.moneyRate, this.addCash, this);
		this.time.events.loop(Phaser.Timer.SECOND, this.addScore, this);
		this.time.events.loop(Phaser.Timer.SECOND * this.waveLength, this.nextWave, this);
		this.time.events.loop(Phaser.Timer.SECOND * this.bomberRate, this.addSuicideBomber,this);

		// create trump

		this.trump = this.add.sprite(this.world.centerX, this.world.height, 'trump');
		this.trump.animations.add('trumpwalk', [ 1, 2 ], 5, true);
		this.trump.health = this.defaultPresidentHealth;
		this.trump.walking = false;
        this.trump.died = false;
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
		this.trump.body.collides(this.cashCollisionGroup, this.onCashHitTrump, this);
		this.trump.body.collides(this.bombersCollisionGroup);
		this.trumpIntro();

		// trumpheads
		this.trumphead = this.add.sprite(10, 10, 'trumpsprite');
		this.trumprage = this.add.sprite(10, 10, 'trumprage');
		this.trumphappy = this.add.sprite(10, 10, 'happytrump');
		this.trumphappy.visible = false;
		this.trumprage.visible = false;
		this.trumphead.visible = false;
		this.trumphead.animations.add('speak', [ 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0 ], true);
		this.trumphead.scale.setTo(0.17, 0.17);
		this.trumprage.scale.setTo(0.06, 0.06);
		this.trumphappy.scale.setTo(0.06, 0.06);
		this.trumphead.animations.play('speak', 40, true);

		// Add buttons

		this.addGuardButton = this.add.button(10, this.world.height - 10 - 64, 'addGuard', this.addGuard, this);
        this.addFenceButton = this.add.button(84, this.world.height - 10 - 64, 'addFence', this.addFence, this);

		// Add labels

		var btnCountStyle = {font: "25px Arial", fill: "#ffffff", align: "right"};
		this.labelGuards = this.add.text(50, this.world.height - 45, "0", btnCountStyle);
		this.labelGuards.stroke = "#000000";
		this.labelGuards.strokeThickness = 3;
		this.labelFences = this.add.text(124, this.world.height - 45, "0", btnCountStyle);
		this.labelFences.stroke = "#000000";
		this.labelFences.strokeThickness = 3;

		var moneyLabelStyle = {font: "40px Arial", fill: "#ffffff", align: "right"};
		this.labelMoney = this.add.text(this.game.width - 15, 60, "$" + this.money, moneyLabelStyle);
		this.labelMoney.anchor.setTo(1, 1);
		this.labelMoney.stroke = "#000000";
		this.labelMoney.strokeThickness = 6;

		var scoreLabelStyle = {font: "40px Arial", fill: "#ffffff", align: "center"}; ////////////////////////////////////////
        this.labelScore = this.add.text(this.world.centerX, 50, game.score, scoreLabelStyle); ///////////////////////////// V
        this.labelScore.anchor.setTo(0.5,0.5);
        this.labelScore.stroke = "#000000"; 
        this.labelScore.strokeThickness = 6;

        var waveLabelStyle = {font: "20px Arial", fill: "#ffffff", align: "center"}; ////////////////////////////////////////
        this.labelCurrentWave = this.add.text(this.world.centerX, 80, "wave " + this.waveNumber, waveLabelStyle); ///////////////////////////// V
        this.labelCurrentWave.anchor.setTo(0.5,0.5);
        this.labelCurrentWave.stroke = "#000000"; //////////////////////////////////////////
        this.labelCurrentWave.strokeThickness = 6;

		// draw a circle around president
		guardFreeZone = this.add.graphics(0, 0);
		guardFreeZone.lineStyle(1, 0xFF0000, 1);
		guardFreeZone.drawCircle(this.world.centerX, this.world.centerY, this.guardFreeZoneRadius * 2);

		// Give money every x seconds

		this.addingLoop = this.time.events.loop(Phaser.Timer.SECOND * this.moneyTimeOut, this.addMoney, this, 1);
		this.time.events.loop(Phaser.Timer.SECOND, this.regenerateHealth, this);

	},
	trumpIntro: function ()
	{
		console.log("ok");
		this.trump.animations.play('trumpwalk');
		this.physics.arcade.moveToXY(this.trump, this.world.centerX, this.world.centerY, 150);
		this.trump.walking = true;
	},

	update: function ()
	{

		// Check for clicks on guards
		this.guardClickHandler();

		// Update labels

		this.labelGuards.setText(Math.floor(this.money / this.PriceGuard)); 
		this.labelFences.setText(Math.floor(this.money / this.PriceFence)); 
		this.labelMoney.setText("$" + this.money);
		this.labelScore.setText(game.score);
		this.labelCurrentWave.setText("wave " + this.waveNumber);

		// If adding, place guard
		
		//console.log(this.addGuard);

        if (this.input.activePointer.isDown && this.addingGuard)
        {
              this.placeGuard();
        }
        if (this.input.activePointer.isDown && this.addingFence)
        {
            this.placeFence();
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

		cashgroup.forEachExists(function (cash)
		{
			if (cash.kill)
			{
				cash.destroy();
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
				guard.bodyBack.alpha -= 0.04;
				guard.scale.setTo(guard.alpha, guard.alpha);
				guard.bodyBack.scale.setTo(guard.bodyBack.alpha, guard.bodyBack.alpha);
				if (guard.alpha < 0)
				{
					//remove the guard
					guard.destroy();
					guard.bodyBack.destroy();
					path.destroy();
				}
			}
		}, this);

		// loop over fences
		fences.forEachExists(function (fence)
		{

			// kill guard with fade
			if (fence.kill)
			{
				fence.alpha -= 0.04;
				fence.scale.setTo(fence.alpha, fence.alpha);
				if (fence.alpha < 0)
				{
					//remove the fence
					fence.destroy();
				}
			}
		}, this);

		this.trump.healthBar.setPosition(this.trump.position.x, this.trump.position.y - 60);
		if (this.trump.walking && this.physics.arcade.distanceToXY(this.trump, this.world.centerX, this.world.centerY) < 10)
		{
			this.trump.animations.stop(null, true);
			this.trump.frame = 0;
			this.trump.body.velocity.y = 0;
			this.trump.body.velocity.x = 0;
			this.trump.walking = false;
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
			var distanceToCenter = this.calculateDistance(gameX, gameY, this.world.centerX, this.world.centerY);

			if (distanceToCenter > this.guardFreeZoneRadius)
			{
				if (guardFollowPath.pathIndex != 0)
				{
					//console.log("okid");
					var fromX = guardFollowPath.path[ guardFollowPath.pathIndex - 1 ].x;
					var fromY = guardFollowPath.path[ guardFollowPath.pathIndex - 1 ].y;
					//console.log("van x:"+fromX+" van y: "+fromY);
					//console.log("game x:"+gameX+" game y: "+gameY);

					if (fromX != gameX || fromY != gameY)
					{
						if (guardFollowPath.lengthLine < this.maxLineLength)
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
	guardMoveHandler : function ()
	{
		for (var guard = 0; guard < guards.children.length; guard++)
		{
			var curGuard = guards.children[ guard ];
			var curGuardFollowPath = curGuard.followPath;
			if (curGuardFollowPath.path != null && curGuardFollowPath.path.length > 0 && curGuardFollowPath.pathSpriteIndex < curGuardFollowPath.pathIndex)
			{
				curGuardFollowPath.pathSpriteIndex = Math.min(curGuardFollowPath.pathSpriteIndex, curGuardFollowPath.path.length - 1);
				this.physics.arcade.moveToXY(guards.children[ guard ], curGuardFollowPath.newPath[ 0 ].x, curGuardFollowPath.newPath[ 0 ].y, this.speedGuard);
				this.physics.arcade.moveToXY(guards.children[ guard ].bodyBack, curGuardFollowPath.newPath[ 0 ].x, curGuardFollowPath.newPath[ 0 ].y, this.speedGuard);

				if (this.physics.arcade.distanceToXY(guards.children[ guard ], curGuardFollowPath.path[ curGuardFollowPath.pathSpriteIndex ].x, curGuardFollowPath.path[ curGuardFollowPath.pathSpriteIndex ].y) < 20)
				{
					curGuardFollowPath.pathSpriteIndex++;
					curGuard.animations.play('walk');
					if (curGuardFollowPath.pathSpriteIndex >= curGuardFollowPath.pathIndex)
					{
						//console.log("stop");
						curGuard.body.velocity.destination[ 0 ] = 0;
						curGuard.bodyBack.body.velocity.destination[ 0 ] = 0;
						curGuard.body.velocity.destination[ 1 ] = 0;
						curGuard.bodyBack.body.velocity.destination[ 1 ] = 0;
						curGuard.animations.stop(null, true);
						curGuard.frame = 0;
					}
					this.drawLine(curGuard);
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
			guard.bodyBack.body.rotation = Math.atan(lengthY / lengthX) + Math.PI / 2 + correctingAngle;
			guard.body.rotation = Math.atan(lengthY / lengthX) + Math.PI / 2 + correctingAngle;
		}
	},
	calculateDistance: function (x1, y1, x2, y2)
	{
		var lengthX = parseInt(x1) - parseInt(x2);
		var lengthY = parseInt(y1) - parseInt(y2);

		return Math.sqrt((lengthX * lengthX) + (lengthY * lengthY));
	},
	drawLine: function (guardAll)
	{
		guard = guardAll.followPath;
		this.world.sendToBack(guard.followLine);
		this.world.moveUp(guard.followLine);

		//console.log("ok");
		guard.newPath.splice(0, 1);

		guard.followLine.clear();
		guard.followLine.lineStyle(5,parseInt(guardAll.bodyColor, 16), 1);

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

    gameOverState: function () {
        this.state.start('GameOver');
    },

	checkHealth: function ()
	{

		// check trump health
            	console.log(this.trump.health, this.trump.died);
		if (this.trump.health <= 0 && this.trump.died == false)
		{

			// trump died :(  
            var sound = this.add.audio('dead');
            sound.play();

            this.trump.died = true;
            this.trump.body.setCollisionGroup(this.collidedCollisionGroup);

            if(localStorage) {
                game.bestScore = localStorage.getItem('bestScore');

                if(!game.bestScore || game.bestScore < game.score) {
                  game.bestScore = game.score;
                  localStorage.setItem('bestScore', game.bestScore);
                  //console.log("beste score: " + this.bestScore)
                }
            } 
            else {
                // Fallback
                this.bestScore = 'Not found';
            }

            // wait until going to gameover
            this.time.events.add(Phaser.Timer.SECOND * 2, this.gameOverState, this);
            
			//this.destroyHealthbar(this.trump.healthBar);
			// this.trump.destroy(); // for now
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

        // check & update health bars for fences
        fences.forEachExists(function(fence) {
            fence.healthBar.setPercent((fence.health/this.defaultFenceHealth)*100);

            if(fence.health <= 0) {
                fence.body.angularVelocity = 10;
                fence.kill = true;
                this.destroyHealthbar(fence.healthBar);
            }
        }, this);
	},

	getRandomPositionOffScreen: function ()
	{
		var radius = Math.sqrt(Math.pow(this.world.width / 2, 2) + Math.pow(this.world.height / 2, 2));
		radius += 40; // make sure nothing is visible when spawning

		var isValidAngle = function (angle)
		{
			var degrees = angle * (180 / Math.PI);
			var valid = true;
			var offset = 30;
			if (degrees > (180 - offset) && degrees < (180 + offset)) valid = false;
			if (degrees > (360 - offset) && degrees < offset) valid = false;

			return valid;
		}

		var angle;
		do {
			angle = Math.random() * Math.PI * 2;
		}
		while (!isValidAngle(angle))

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
		this.time.events.add(Phaser.Timer.SECOND, this.presidentRageStop, this);
	},

	presidentRageStop  : function ()
	{
		this.trumphead.visible = true;
		this.trumprage.visible = false;
	},
	presidentHappyStart: function ()
	{
		this.trumphead.visible = false;
		this.trumphappy.visible = true;
		this.time.events.add(Phaser.Timer.SECOND, this.presidentHappyStop, this);
	},
	presidentHappyStop : function ()
	{
		this.trumphead.visible = true;
		this.trumphappy.visible = false;
	},

    rotateFence: function (fence)
    {

        // console.log("rot");
        var lengthX = this.world.centerX - fence.position.x;
        var lengthY = this.world.centerY - fence.position.y;
        var correctingAngle = 0;

        if (lengthX < 0)
        {
            correctingAngle = Math.PI;
        }

        fence.body.rotation = Math.atan(lengthY / lengthX) + Math.PI / 2 + correctingAngle;

    },

    rotateBomber: function (bomber)
    {

        // console.log("rot");
        var lengthX = this.world.centerX - bomber.position.x;
        var lengthY = this.world.centerY - bomber.position.y;
        var correctingAngle = 0;

        if (lengthX < 0)
        {
            correctingAngle = Math.PI;
        }

        bomber.body.rotation = Math.atan(lengthY / lengthX) + Math.PI / 2 + correctingAngle;

    },

	addProjectile: function ()
	{
		var randomPos = this.getRandomPositionOffScreen();
		var taco = this.add.sprite(randomPos.x, randomPos.y, 'taco');
		projectiles.add(taco);

		// add despawn time
		this.time.events.add(Phaser.Timer.SECOND * this.projectileDespawnTime, this.stopProjectile, this, taco);

		taco.kill = false;
		taco.body.clearShapes();
		taco.body.loadPolygon('tacoPhysics', 'taco');
		taco.body.setCollisionGroup(this.projectileCollisionGroup);
		taco.body.collides([ this.cashCollisionGroup, this.trumpCollisionGroup, this.projectileCollisionGroup, this.guardCollisionGroup, this.fencesCollisionGroup ]);
		taco.body.collideWorldBounds = false;
		this.throwProjectileToObj(taco, this.trump, 160);

		// var sound = this.add.audio('drop');
		// sound.play();
	},

    addSuicideBomber: function()
    {
        var randomPos = this.getRandomPositionOffScreen();
        var bomber = this.add.sprite(randomPos.x, randomPos.y, 'bomber');
        bombers.add(bomber);
        bomber.animations.add('walk', [1,2], 5, true);
        bomber.animations.play('walk');
        bomber.body.clearShapes();
        bomber.body.loadPolygon('personPhysics', 'person');
        bomber.body.setCollisionGroup(this.bombersCollisionGroup);
        bomber.body.collideWorldBounds = false;
        bomber.body.collides([this.trumpCollisionGroup, this.fencesCollisionGroup, this.guardCollisionGroup], this.onBomberCollide, this);

        this.throwProjectileToObj(bomber,this.trump, 60);
        this.rotateBomber(bomber);

    },

    onBomberCollide: function(bomber, collisionbody)
    {
		var explosion = this.add.sprite(bomber.sprite.position.x, bomber.sprite.position.y, 'explosion');
		explosion.anchor.setTo(0.5, 0.5);
		explosion.scale.setTo(2,2);
		var explode = explosion.animations.add('explode');
		explosion.animations.play('explode', 20, false);
		this.explosionsound.play();
		bomber.sprite.destroy();

		this.checkHealth();


		collisionbody.sprite.health -= this.bomberDamage;


    },

	addCash: function ()
	{
		var randomPos = this.getRandomPositionOffScreen();
		var cash = this.add.sprite(randomPos.x, randomPos.y, 'money');

		cashgroup.add(cash);
		cash.kill = false;
		cash.body.setCollisionGroup(this.cashCollisionGroup);
		cash.body.collides([ this.trumpCollisionGroup, this.guardCollisionGroup, this.projectileCollisionGroup ]);
		cash.body.collideWorldBounds = false;
		this.throwProjectileToObj(cash, this.trump, 160);

		// add despawn timer
		this.time.events.add(Phaser.Timer.SECOND * this.projectileDespawnTime, this.stopProjectile, this, cash);
	},

	onProjectileHitTrump: function (body1, body2)
	{
		// stop the projectile
		this.stopProjectile(body2.sprite);

		var rndouch = Math.floor(Math.random() * this.ouch.length);

		// take trumps health
		if (body2.sprite.key == 'taco')
		{
			this.trump.health -= this.tacoDamage;
			this.tacohit.play();
			this.ouch[ rndouch ].play();
			this.checkHealth();
		}

		//rage
		this.presidentRageStart();
	},

	onCashHitTrump: function (body1, body2)
	{
		// stop the cash
		var rndouch = Math.floor(Math.random() * this.moneyhittrump.length);
		this.moneyhittrump[ rndouch ].play();
		this.moneyhit.play();
		this.presidentHappyStart();
		this.money += this.moneyValue;

		// kill the projectile
		this.stopProjectile(body2.sprite);
		//body2.sprite.kill = true;
		//body2.sprite.body.setCollisionGroup(this.collidedCollisionGroup);
	},

	stopProjectile: function (projectileSprite)
	{
		if (projectileSprite.body)
		{
			projectileSprite.body.damping = 0.8;
			projectileSprite.body.angularDamping = 0.7;
			projectileSprite.body.setCollisionGroup(this.collidedCollisionGroup);
			projectileSprite.kill = true;
		}
	},

	throwProjectileToObj: function (obj1, obj2, speed)
	{
		if (typeof speed === 'undefined')
		{
			speed = 60;
		}
		var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);

		if (Math.random() < 0.2)
		{

			//console.log("miss");

			// miss amount
			var missAmount = Math.random() * 0.2 + 0.1;

			// left or right?
			if (Math.random() >= 0.5) missAmount = -missAmount;

			// add to angle
			angle += missAmount;
		}

		obj1.body.rotation = angle + this.math.degToRad(-20);  // correct angle of angry bullets (depends on the sprite used)
		obj1.body.velocity.x = Math.cos(angle) * speed;    // accelerateToObject
		obj1.body.velocity.y = Math.sin(angle) * speed;
	},

	addGuard: function ()
	{
		if (this.money >= this.PriceGuard)
		{
			this.addingGuard = true;
			this.addGuardButton.loadTexture("addingGuard");

        	// add fence
            this.addingFence = false;
			this.addFenceButton.loadTexture("addFence");
		}

	},

    addFence: function () {
        if (this.money >= this.PriceFence && this.money > 0)
        {
        	// add fence
            this.addingFence = true;
			this.addFenceButton.loadTexture("addingFence");

            // stop adding guard
			this.addingGuard = false;
			this.addGuardButton.loadTexture("addGuard");
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

		if (this.calculateDistance(inputX, inputY, this.world.centerX, this.world.centerY) > this.guardFreeZoneRadius)
		{
			var backGuard = this.add.graphics(inputX, inputY);
			var guard = this.add.sprite(inputX, inputY, 'bodyguard');

			var randomIndex = Math.floor(Math.random() * (this.guardColors.length-1));
			var randomColor = this.guardColors[randomIndex];

			backGuard.beginFill(parseInt(randomColor,16));
			backGuard.drawEllipse(0,0,27,22);
			this.world.sendToBack(backGuard);
			this.world.moveUp(backGuard);

			guards.add(guard);

			this.addGuardButton.loadTexture('addGuard');
			this.addingGuard = false;

			//this.addingGuard.destroy();
			this.money -= this.PriceGuard;
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
			guard.body.collides(this.projectileCollisionGroup, this.onProjectileHitGuard, this);
			guard.body.collides(this.cashCollisionGroup, this.onCashHitGuard, this);
			guard.body.collides(this.bombersCollisionGroup);

			guard.animations.add('walk', [ 1, 2 ], 5, true);

			guard.followPath = {
				isActive       : false,
				path           : [],
				newPath        : [],
				pathIndex      : -1,
				pathSpriteIndex: -1,
				lengthLine     : 0,
				followLine     : this.add.graphics(0, 0)
			};

			guard.bodyColor = randomColor;
			guard.bodyBack = backGuard;
			this.physics.p2.enable(backGuard, false);
			backGuard.body.clearCollision(true);
		}
	},

    placeFence: function () {
   		var inputX = this.input.x;
		var inputY = this.input.y;

		if (this.calculateDistance(inputX, inputY, this.world.centerX, this.world.centerY) > this.guardFreeZoneRadius)
		{
	        var fence = this.add.sprite(this.input.x, this.input.y, 'fence');
	        fences.add(fence);
	        this.money -= this.PriceFence;

			this.addFenceButton.loadTexture('addFence');
	        this.addingFence = false;

	        fence.body.static = true;
	        fence.body.setCollisionGroup(this.fencesCollisionGroup);
	        fence.body.collides([this.projectileCollisionGroup], this.onProjectileHitFence, this);
	        fence.body.collides([this.bombersCollisionGroup]);
	        this.rotateFence(fence);
	        fence.health = this.defaultFenceHealth;
	        fence.kill = false;
	        fence.healthBar = new HealthBar(this.game, {x: fence.position.x, y: fence.position.y - 40, width: 60, height: 10});
	    }
    },

	onProjectileHitGuard: function (guardBody, projectileBody)
	{
		this.stopProjectile(projectileBody.sprite);

		// take guard health
		if (projectileBody.sprite.key == 'taco')
		{
			guardBody.sprite.health -= this.tacoDamage;
            this.tacohit.play();
			this.checkHealth();
		}
	},

    onProjectileHitFence: function(fenceBody, projectileBody) {
        this.tacohit.play();
       	this.checkHealth();
        fenceBody.sprite.health -= this.tacoDamage;
        fenceBody.sprite.healthBar.setPercent(fenceBody.sprite.health/this.defaultFenceHealth*100);
        this.stopProjectile(projectileBody.sprite);
    },

	onCashHitGuard: function (guardBody, cashBody)
	{
		cashBody.sprite.body.setCollisionGroup(this.collidedCollisionGroup);
		cashBody.sprite.kill = true;
		//console.log(" YOU ARE FIRED!");
		this.moneyhitguard.play();
		guardBody.sprite.health -= this.tacoDamage;
		this.checkHealth();
	},

	addMoney: function (amount)
	{
		this.money += amount;
	},

	isAdding: function () {
		return this.addingGuard || this.addingFence;
	},

	click: function (object)
	{
		var bodies = this.physics.p2.hitTest(object.position, guards.children);

		if (bodies.length !== 0 && !this.isAdding())
		{
			bodies[ 0 ].parent.sprite.followPath.isActive = true;
			guards.activeGuard = bodies[ 0 ].parent.sprite;
		}
		else if (!this.isAdding())
		{
			// we didnt directly hit a guard, but maybe he's near

			var closestDistanceSoFar = this.triggerDistance;
			guards.forEachAlive(function (guard)
			{
				var distanceToGuard = Phaser.Math.distance(guard.x, guard.y, object.position.x, object.position.y);
				if (distanceToGuard <= this.triggerDistance)
				{
					// do something to this guard, as it lies within the trigger distance
					if (distanceToGuard < closestDistanceSoFar)
					{
						closestDistanceSoFar = distanceToGuard;
						// make this guard active
						guard.followPath.isActive = true;
						guards.activeGuard = guard;
					}
				}
			}, this);
		}
	},

	regenerateHealth: function() {
		// for guards
		guards.forEachExists(function (guard)
		{
            if (guard.health < 100)
            {
                guard.health += this.healthRegenerate;
            }
		}, this);	

		// for trump
		if(this.trump.health < 50) this.trump.health += this.healthRegenerate;	

		this.checkHealth();
	},
    addScore: function(){ 
        game.score ++;
        //console.log("score:" + this.score);
        //console.log("beste score: " + this.bestScore)
    },

	nextWave: function()
	{
		this.time.events.remove(this.tacoLoop);
		this.time.events.remove(this.moneyLoop);
		this.time.events.remove(this.addingLoop);
		this.tacoRate = (this.tacoRate - this.tacoEndRate) * Math.pow(0.8, this.waveNumber) + this.tacoEndRate;
		this.moneyRate = (this.moneyRate - this.moneyEndRate) * Math.pow(0.8, this.waveNumber) + this.moneyEndRate;
		this.moneyTimeOut = (this.moneyTimeOut - this.tacoEndRate) * Math.pow(0.8, this.waveNumber) + this.tacoEndRate;
		//console.log("taco rate: " + this.tacoRate);
		//console.log("money rate: " + this.moneyRate);
		//console.log("moneytime: " + this.moneyTimeOut);
		this.labelWave = this.game.add.text(this.world.centerX, this.world.centerY, "NEXT WAVE", this.scoreLabelStyle);
		this.labelWave.anchor.set(0.5);

		this.waveNumber++;
		this.time.events.add(Phaser.Timer.SECOND * 1.5, this.deleteLabel, this, this.labelWave);
		this.tacoLoop = this.time.events.loop(Phaser.Timer.SECOND * this.tacoRate, this.addProjectile, this);
		this.moneyLoop = this.time.events.loop(Phaser.Timer.SECOND * this.moneyRate, this.addCash, this);
		this.addingLoop = this.time.events.loop(Phaser.Timer.SECOND * this.moneyTimeOut, this.addMoney, this, 1);

		/////// ALEX FIX DIT ////////////////////////////////
		quote = game.add.audio('quote1');
		this.trumphead.visible = true;
		quote.play();
		quote.onStop.add(quoteStopped, this);
		function quoteStopped(quote)
		{
			this.trumphead.animations.stop(null, true);
			////////////////////////////////////////////////////////
		}
	},
    deleteLabel: function(label){
        label.destroy();
    }
};