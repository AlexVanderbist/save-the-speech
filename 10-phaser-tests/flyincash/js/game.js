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
		//game.load.image("trump", "assets/trump.png"); ///////////////////////////////////////////////////////////////
		//game.load.image("bodyguard", "assets/bodyguard.png");
		game.load.image("taco", "assets/taco.png");
		game.load.image("addGuard", "assets/addGuard.png");
		game.load.image("addingGuard", "assets/addingGuard.png");
		game.load.image("trumprage", 'assets/trumprage.png');
		game.load.image("concrete", 'assets/concrete.png');
		game.load.image("stand", 'assets/stand.png');
        game.load.image("money", 'assets/money.png'); ////////////////////////////////////////////////////////////////

		// and sprites
		game.load.spritesheet('trumpsprite', 'assets/trumpsprite.png', 353, 624, 6);
		game.load.spritesheet('bodyguard', 'assets/bodyguardSprite.png', 64, 64);
        game.load.spritesheet('trump', 'assets/trumpWalk.png', 64, 64); /////////////////////////////////

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


        game.moneyValue = 5; ///////////////////////////////////////////////////////////////////////////////////////
        game.moneyRate = 5; ////////////////////////////////////////////////////////////
        game.moneyEndRate = 3; ////////////////////////////////////////////////////////////
        game.tacoRate = 2; ////////////////////////////////////////////////////////////////////////////////////
        game.tacoEndRate = 1.7; ////////////////////////////////////////////////////////////////////////////////////
        game.healthRegenerate = 3; ////////////////////////////////////////////////////////////////////////////////////
        game.waveLength = 16; /////////////////////////////////////////////////////////////////////////
        game.waveNumber = 0; ///////////////////////////////////////////////////////////////////

        game.score = 0; //////////////////////////////////////////////////////////////////////////

	},
	create: function ()
	{

		// Everything is loaded, start the "Playgame" State
		game.state.start("Playgame");

	}
}

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

        cashgroup = game.add.group(); ////////////////////////////////////////////////////////////////////////////////
        cashgroup.enableBody = true;
        cashgroup.physicsBodyType = Phaser.Physics.P2JS;

		// Create collision groups

		game.trumpCollisionGroup = game.physics.p2.createCollisionGroup();
		game.projectileCollisionGroup = game.physics.p2.createCollisionGroup();
		game.collidedCollisionGroup = game.physics.p2.createCollisionGroup();
		game.guardCollisionGroup = game.physics.p2.createCollisionGroup();
        game.cashCollisionGroup = game.physics.p2.createCollisionGroup(); /////////////////////////////////////////////////////
		game.physics.p2.updateBoundsCollisionGroup();


		//check when is touched, then launch click function
		game.input.onDown.add(this.click, this);

		// Throw projectiles

		//keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
		//keyW.onDown.add(this.addCash, this); 

		game.tacoLoop = game.time.events.loop(Phaser.Timer.SECOND * game.tacoRate, this.addProjectile, this); ///////////////////////////////

        game.moneyLoop = game.time.events.loop(Phaser.Timer.SECOND * game.moneyRate, this.addCash, this); //////////////////////////////////////////

        game.time.events.loop(Phaser.Timer.SECOND * game.waveLength, this.nextWave, this); //////////////////////////////////////////

        game.time.events.loop(Phaser.Timer.SECOND, this.addScore, this); //////////////////////////////////////////

		// create trump

		game.trump = game.add.sprite(game.world.centerX, game.world.height, 'trump'); ////////////////
        game.trump.animations.add('trumpwalk', [1,2], 5, true); ////////////////////////////////////
		game.trump.health = game.defaultPresidentHealth;
        game.trump.walking = false;
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
        game.trump.body.collides(game.cashCollisionGroup, this.onCashHitTrump, this); /////////////////////////////////////////////////////////////
        this.trumpIntro(); ////////////////////////////////////////////////////////////

        // trumpheads
        game.trumphead = game.add.sprite(10, 10, 'trumpsprite');
        game.trumprage = game.add.sprite(10, 10, 'trumprage');
        game.trumprage.visible = false;
        game.trumphead.visible = false;
        game.trumphead.animations.add('speak',[0,1,2,3,4,5,4,3,2,1,0], true);
        game.trumphead.scale.setTo(0.17, 0.17);
        game.trumprage.scale.setTo(0.06,0.06);
        game.trumphead.animations.play('speak', 40, true);

        // Add buttons

        button = game.add.button(game.world.width - 100, 10, 'addGuard', this.addGuard, this);

        // Add labels 

        game.labelStyle = { font: "40px Arial", fill: "#ffffff" };  
        game.labelGuards = this.game.add.text(game.world.width - 80, 28, game.numberguards, game.labelStyle);
        game.labelMoney = this.game.add.text(80, 15, "money:" + game.money, game.labelStyle);

        var scoreLabelStyle = {font: "40px Arial", fill: "#ffffff", align: "center"}; ////////////////////////////////////////
        game.labelScore = this.add.text(game.world.centerX, 50, game.score, scoreLabelStyle); ///////////////////////////// V
        game.labelScore.anchor.setTo(0.5,0.5);
        game.labelScore.stroke = "#000000"; //////////////////////////////////////////
        game.labelScore.strokeThickness = 6;

        var waveLabelStyle = {font: "20px Arial", fill: "#ffffff", align: "center"}; ////////////////////////////////////////
        game.labelCurrentWave = this.add.text(game.world.centerX, 80, "wave " + game.waveNumber, waveLabelStyle); ///////////////////////////// V
        game.labelCurrentWave.anchor.setTo(0.5,0.5);
        game.labelCurrentWave.stroke = "#000000"; //////////////////////////////////////////
        game.labelCurrentWave.strokeThickness = 6;

        // Give money every x seconds

        game.addingLoop = game.time.events.loop(Phaser.Timer.SECOND * game.moneyTimeOut, this.addMoney, this, 1); ////////////////////////

        game.time.events.loop(Phaser.Timer.SECOND, this.regenerate, this, game.healthRegenerate); ////////////////////////////////////////////////

        // Start waves
        this.startWave(1);
    },
    trumpIntro : function() { //////////////////////////////////////////////////////////////////////////////////////////

        game.trump.animations.play('trumpwalk');
        game.physics.arcade.moveToXY(game.trump, game.world.centerX, game.world.centerY, 150);
        game.trump.walking = true;

    },
    startWave: function(waveNumber) {
        // play first quote

        quote = game.add.audio('quote1');

        game.trumphead.visible = true;
        quote.play();
        quote.onStop.add(quoteStopped, this);
        function quoteStopped(quote){
            game.trumphead.animations.stop(null, true);
        }


    },
    update: function () {

        game.trump.angle += 1;

        // Check for clicks on guards
        this.guardClickHandler();

        // Update labels

        game.labelGuards.setText(Math.floor(game.money / game.PriceGuard)); // update this
        game.labelMoney.setText(game.money);


        game.labelScore.setText(game.score); /////////////////////////////////////////////////////////////////
        game.labelCurrentWave.setText("wave " + game.waveNumber); /////////////////////////////////////////////////////////////////

        // If adding, place guard

        if (game.input.activePointer.isDown && game.adding) 
        {
            this.placeGuard();
        }

        // Fade out projectiles and slow down when hit

        projectiles.forEachExists(function(projectile) {
            if(projectile.kill) {
                projectile.alpha -= 0.04;
                if(projectile.alpha < 0) {
                    //remove the projectile
                    projectile.destroy();
                }
            }
        }, this);

        cashgroup.forEachExists(function(cash) { ///////////////////////////////////////////////////////////////
            if(cash.kill) 
            {
                cash.destroy();
            }
        }, this);

        // Fade out guards and slow down when hit AND move healthbars

        guards.forEachExists(function(guard) {
            // move health bar
            guard.healthBar.setPosition( guard.position.x,  guard.position.y - 40);

            // kill guard with fade
            if(guard.kill) {
                guard.alpha -= 0.04;
                guard.scale.setTo(guard.alpha, guard.alpha);
                if(guard.alpha < 0) {
                    //remove the guard
                    guard.destroy();
                }
            }
        }, this);

        game.trump.healthBar.setPosition(game.trump.position.x,game.trump.position.y - 60); /////////////////////////////////////
        if(game.trump.walking && game.physics.arcade.distanceToXY(game.trump, game.world.centerX, game.world.centerY) < 1) ////////////////////////////
        {
            game.trump.animations.stop(null, true);
            game.trump.frame = 0;
            game.trump.body.velocity.y = 0;
            game.trump.walking = false;
        }

    },
    guardClickHandler: function()
    {
        if (game.input.pointer1.isDown && guards.activeGuard !== null)
        {
            //console.log("ok");
            if (!wasDown)
            {
                //console.log("eerste");
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
    guardMoveHandler: function()
    {
        for(var guard = 0; guard < guards.children.length; guard++)
        {
            var curGuard = guards.children[guard ].followPath;
            if (curGuard.path != null && curGuard.path.length > 0 && curGuard.pathSpriteIndex < curGuard.pathIndex)
            {
                curGuard.pathSpriteIndex = Math.min(curGuard.pathSpriteIndex, curGuard.path.length - 1);
                game.physics.arcade.moveToXY(guards.children[guard ], curGuard.newPath[ 0 ].x, curGuard.newPath[ 0 ].y, 250);

                if (game.physics.arcade.distanceToXY(guards.children[guard ], curGuard.path[ curGuard.pathSpriteIndex ].x, curGuard.path[ curGuard.pathSpriteIndex ].y) < 20)
                {
                    curGuard.pathSpriteIndex++;
                    guards.children[guard].animations.play('walk');
                    if (curGuard.pathSpriteIndex >= curGuard.pathIndex)
                    {
                        //console.log("stop");
                        guards.children[guard].body.velocity.destination[ 0 ] = 0;
                        guards.children[guard].body.velocity.destination[ 1 ] = 0;
                        guards.children[guard].animations.stop(null, true);
                        guards.children[guard].frame = 0;
                    }
                    this.drawLine(curGuard);
                    this.rotateGuard(guards.children[guard]);
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
    drawLine: function(guard)
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
    checkHealth: function() {

        // check trump health
        if(game.trump.health <= 0) {
            // trump died :(
            this.destroyHealthbar(game.trump.healthBar);
            game.trump.destroy(); // for now


            if(!!localStorage) { /////////////////////////////////////////////////////////////////////////////////////////////////////
                // Step 2
                this.bestScore = localStorage.getItem('bestScore');

                // Step 3
                if(!this.bestScore || this.bestScore < game.score) {
                  this.bestScore = game.score;
                  localStorage.setItem('bestScore', this.bestScore); ///////////////////////////////////////////////////////////////////
                  console.log("beste score: " + this.bestScore)
                  //    game.state.start('Game');
                }
            } 
            else {
                // Fallback. LocalStorage isn't available
                this.bestScore = 'N/A';
            }//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        }

        // update trump health bar
        game.trump.healthBar.setPercent((game.trump.health/game.defaultPresidentHealth)*100);

        // check & update health bars for guards
        guards.forEachExists(function(guard) {
            guard.healthBar.setPosition( guard.position.x,  guard.position.y - 40);
            guard.healthBar.setPercent((guard.health/game.defaultGuardHealth)*100);

            if(guard.health <= 0) {
                guard.body.angularVelocity = 10;
                guard.kill = true;
                this.destroyHealthbar(guard.healthBar);
            }
        }, this);
    },
    getRandomPositionOffScreen: function() {
        var radius = Math.sqrt(Math.pow(game.world.width/2, 2) + Math.pow(game.world.height/2, 2));
        radius += 40; // make sure nothing is visible when spawning
        var angle = Math.random() * Math.PI * 2;

        var pos = {
            x: Math.cos(angle)*radius + game.world.centerX,
            y: Math.sin(angle)*radius + game.world.centerY
        };

        //debug stuff
        // var graphics = game.add.graphics(game.world.centerX, game.world.centerY);
        // graphics.beginFill(0xFF0000, 1);
        // graphics.drawCircle(0, 0, radius * 2);

        return pos;
        
    },
    presidentRageStart: function () {
        // enable rage
        game.trumphead.visible = false;
        game.trumprage.visible = true;

        // stop after 1500ms CHANGE THIS
        game.time.events.add(Phaser.Timer.SECOND * 1, this.presidentRageStop, this);
    },
    presidentRageStop: function () {
        game.trumphead.visible = true;
        game.trumprage.visible = false;
},
    addProjectile: function () {
        var randomPos = this.getRandomPositionOffScreen();
        var taco = game.add.sprite(randomPos.x, randomPos.y, 'taco');
        projectiles.add(taco);
        taco.kill = false;
        taco.body.clearShapes();
        taco.body.loadPolygon('tacoPhysics', 'taco');
        taco.body.setCollisionGroup(game.projectileCollisionGroup);
        taco.body.collides([game.trumpCollisionGroup, game.projectileCollisionGroup, game.guardCollisionGroup]);
        taco.body.collideWorldBounds = false;
        this.throwProjectileToObj(taco,game.trump, 160);

        // var sound = game.add.audio('drop');
        // sound.play();
    },
    addCash: function () { ////////////////////////////////////////////////////////////////////////////////
        var randomPos = this.getRandomPositionOffScreen();
        var cash = game.add.sprite(randomPos.x, randomPos.y, 'money');
        cashgroup.add(cash);
        cash.kill = false;
        cash.body.setCollisionGroup(game.cashCollisionGroup);
        cash.body.collides([game.trumpCollisionGroup, game.guardCollisionGroup]);
        cash.body.collideWorldBounds = false;
        this.throwProjectileToObj(cash,game.trump, 160);
    },
    onProjectileHitTrump: function(body1, body2) {
        // stop the projectile
        this.stopProjectile(body2.sprite);

        // take trumps health
        if(body2.sprite.key == 'taco') {
            game.trump.health -= game.tacoDamage;
            this.checkHealth();
        }

        //rage
        this.presidentRageStart();
    },
    onCashHitTrump: function(body1, body2) {
        // stop the cash
        game.money += game.moneyValue;
        body2.sprite.body.setCollisionGroup(game.collidedCollisionGroup);
        body2.sprite.kill = true;
    },
    stopProjectile: function (projectileSprite) {
        projectileSprite.body.damping = 0.8;
        projectileSprite.body.angularDamping = 0.7;
        projectileSprite.body.setCollisionGroup(game.collidedCollisionGroup);
        projectileSprite.kill = true;
    },
    throwProjectileToObj: function (obj1, obj2, speed) { 
        if (typeof speed === 'undefined') { speed = 60; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(-20);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.velocity.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.velocity.y = Math.sin(angle) * speed;
    },
    addGuard: function () {
        if (game.money >= game.PriceGuard) 
        {
            game.adding = true;
            game.addingGuard = game.add.sprite(game.world.width - 100, 10, 'addingGuard');
        }
        
    },
    destroyHealthbar: function (healthbar) {
        healthbar.barSprite.destroy();
        healthbar.bgSprite.destroy();
    },
    placeGuard: function () { 
        var guard = game.add.sprite(game.input.x, game.input.y, 'bodyguard');
        guards.add(guard);
        game.addingGuard.destroy();
        game.money -= game.PriceGuard;
        game.adding = false;
        guard.healthBar = new HealthBar(this.game, {x: guard.position.x, y: guard.position.y - 40, width: 60, height: 10});
        guard.health = game.defaultGuardHealth;
        guard.kill = false;
        guard.body.clearShapes();
        guard.body.loadPolygon('personPhysics', 'person');
        guard.body.static = true;
        guard.body.setCollisionGroup(game.guardCollisionGroup);
        guard.body.collides(game.projectileCollisionGroup, this.onProjectileHitGuard, this);
        guard.body.collides(game.cashCollisionGroup, this.onCashHitGuard, this); ////////////////////////////////////////////////////

        guard.animations.add('walk', [1,2], 5, true);

        guard.followPath = {};

        guard.followPath.isActive = false;
        guard.followPath.path = [];
        guard.followPath.newPath = [];
        guard.followPath.pathIndex = -1;
        guard.followPath.pathSpriteIndex = -1;
        guard.followPath.greenLine = game.add.graphics(0, 0);
    },
    onProjectileHitGuard: function(guardBody, projectileBody) {
        this.stopProjectile(projectileBody.sprite);

        // take guard health
        if(projectileBody.sprite.key == 'taco') {
            guardBody.sprite.health -= game.tacoDamage;
            this.checkHealth();
        }
    },
    onCashHitGuard: function(guardBody, cashBody) { //////////////////////////////////////////////////////////////////////////
        cashBody.sprite.body.setCollisionGroup(game.collidedCollisionGroup);
        cashBody.sprite.kill = true;
        console.log(" YOU ARE FIRED!");
        guardBody.sprite.health -= game.tacoDamage;
        this.checkHealth();
    },
    addMoney: function (amount) { 
        game.money += amount;
    },
    click: function(object)
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
            bodies[0].parent.sprite.followPath.isActive = true;
            guards.activeGuard = bodies[0].parent.sprite;
            result = "Hooray";
        }

        //console.log(result);
    },
    regenerate: function(healthRegenerateValue) {
        guards.forEachExists(function(guard) {
            if (guard.health < 100) 
            {
                guard.health += healthRegenerateValue;
                this.checkHealth();
            }
            
        }, this);
    },
    nextWave: function() { ////////////////////////////////////////////////////////////////////////////////////////
        game.time.events.remove(game.tacoLoop);
        game.time.events.remove(game.moneyLoop);
        game.time.events.remove(game.addingLoop);
        game.tacoRate = (game.tacoRate - game.tacoEndRate)*Math.pow(0.8,game.waveNumber)+game.tacoEndRate;
        game.moneyRate = (game.moneyRate - game.moneyEndRate)*Math.pow(0.8,game.waveNumber)+game.moneyEndRate;
        game.moneyTimeOut = (game.moneyTimeOut - game.tacoEndRate)*Math.pow(0.8,game.waveNumber)+game.tacoEndRate;
        console.log("taco rate: " + game.tacoRate);
        console.log("money rate: " + game.moneyRate);
        console.log("moneytime: " + game.moneyTimeOut);
        game.labelWave = this.game.add.text(game.world.centerX, game.world.centerY, "NEXT WAVE", game.labelStyle);
        game.labelWave.anchor.set(0.5);

        game.waveNumber ++;
        //game.paused = true;
        game.time.events.add(Phaser.Timer.SECOND * 1.5, this.deleteLabel, this, game.labelWave);
        game.tacoLoop = game.time.events.loop(Phaser.Timer.SECOND * game.tacoRate, this.addProjectile, this); ///////////////////////////////
        game.moneyLoop = game.time.events.loop(Phaser.Timer.SECOND * game.moneyRate, this.addCash, this); //////////////////////////////////
        game.addingLoop = game.time.events.loop(Phaser.Timer.SECOND * game.moneyTimeOut, this.addMoney, this, 1); ////////////////////////////
    },
    deleteLabel: function(label){ ////////////////////////////////////////////////////////////////////////////
        label.destroy();
        //game.paused = false;
    }
    ,
    addScore: function(){ ////////////////////////////////////////////////////////////////////////////
        game.score ++;
        //console.log("score:" + game.score);
    }
}
