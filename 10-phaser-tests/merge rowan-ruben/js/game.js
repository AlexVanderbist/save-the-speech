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

//added by rowan
var stupidquote = new Array();
var ouch = new Array();
var moneyhittrump = new Array();

var moneyhitguard = null;
var moneyhit = null;
var tacohit = null;

var explosionsound = null;

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
        game.load.image("addFence", "assets/addFence.png");
        game.load.image("addingFence", "assets/addingFence.png");
		game.load.image("trumprage", 'assets/trumprage.png');
		game.load.image("concrete", 'assets/concrete.png');
		game.load.image("stand", 'assets/stand.png');
        game.load.image("money", 'assets/money.png'); ////////////////////////////////////////////////////////////////
        game.load.image("happytrump", 'assets/happytrump.png');
        game.load.image("fence", 'assets/fence.png');

		// and sprites
		game.load.spritesheet('trumpsprite', 'assets/trumpsprite.png', 353, 624, 6);
		game.load.spritesheet('bodyguard', 'assets/bodyguardSprite.png', 64, 64);
        game.load.spritesheet('trump', 'assets/trumpWalk.png', 64, 64);/////////////////////////////////
        game.load.spritesheet('bomber', 'assets/bomberSprite.png', 64, 64);
        game.load.spritesheet('explosion', 'assets/explosion.png', 128, 128);
		// Preload sounds
        // Preload sounds

        game.load.audio('quote1', 'assets/sounds/stupidquote/stupidquote1.mp3');
        game.load.audio('quote2', 'assets/sounds/stupidquote/stupidquote2.mp3');
        game.load.audio('quote3', 'assets/sounds/stupidquote/stupidquote3.mp3');
        game.load.audio('quote4', 'assets/sounds/stupidquote/stupidquote4.mp3');
        game.load.audio('quote5', 'assets/sounds/stupidquote/stupidquote5.mp3');
        game.load.audio('quote6', 'assets/sounds/stupidquote/stupidquote6.mp3');
        game.load.audio('quote7', 'assets/sounds/stupidquote/stupidquote7.mp3');
        game.load.audio('quote8', 'assets/sounds/stupidquote/stupidquote8.mp3');
        game.load.audio('quote9', 'assets/sounds/stupidquote/stupidquote9.mp3');
        game.load.audio('quote10', 'assets/sounds/stupidquote/stupidquote10.mp3');

        game.load.audio('ouch1', 'assets/sounds/trumpdamage/ouch1.mp3');
        game.load.audio('ouch2', 'assets/sounds/trumpdamage/ouch2.mp3');
        game.load.audio('ouch3', 'assets/sounds/trumpdamage/ouch3.mp3');

        game.load.audio('money1', 'assets/sounds/trumpmoney/money1.mp3');
        game.load.audio('money2', 'assets/sounds/trumpmoney/money2.mp3');
        game.load.audio('money3', 'assets/sounds/trumpmoney/money3.mp3');

        game.load.audio('tacohit', 'assets/sounds/hitbytaco/tacohit.mp3');

        game.load.audio('guardmoneyhit', 'assets/sounds/guardmoney/money1.mp3');

        game.load.audio('moneyhit', 'assets/sounds/moneyhit/kaching1.mp3');
        game.load.audio('explosionfx', 'assets/sounds/explosions/soundexplosion.mp3');



		// preload physics
		game.load.physics('tacoPhysics', 'assets/physics/taco.json');
		game.load.physics('personPhysics', 'assets/physics/person.json');

		// Vars
		game.PriceGuard = 10;
        game.PriceFence = 10;
		game.moneyTimeOut = 2; // om de twee seconden 1 muntje
		game.tacoDamage = 30;
        game.bomberDamage = 100;
		game.defaultGuardHealth = 100.0;
		game.defaultPresidentHealth = 160.0;
        game.defaultFenceHealth = 300;

		game.addGuard = false; // later ID ofzo
        game.addFence = false;
		game.money = 15;


        game.moneyValue = 5; ///////////////////////////////////////////////////////////////////////////////////////
        game.moneyRate = 6; ////////////////////////////////////////////////////////////
        game.tacoRate = 2;
        game.bomberRate = 3;////////////////////////////////////////////////////////////////////////////////////
        game.healthRegenerate = 2; ////////////////////////////////////////////////////////////////////////////////////

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
        //add explosion to game

        //putsounds in array
        stupidquote[0] = game.add.audio('quote1');
        stupidquote[1] = game.add.audio('quote2');
        stupidquote[2] = game.add.audio('quote3');
        stupidquote[3] = game.add.audio('quote4');
        stupidquote[4] = game.add.audio('quote5');
        stupidquote[5] = game.add.audio('quote6');
        stupidquote[6] = game.add.audio('quote7');
        stupidquote[7] = game.add.audio('quote8');
        stupidquote[8] = game.add.audio('quote9');
        stupidquote[9] = game.add.audio('quote10');

        ouch[0] = game.add.audio('ouch1');
        ouch[1] = game.add.audio('ouch2');


        moneyhittrump[0] = game.add.audio('money1');
        moneyhittrump[1] = game.add.audio('money2');
        moneyhittrump[2] = game.add.audio('money3');

        tacohit = game.add.audio('tacohit');

        moneyhitguard = game.add.audio('guardmoneyhit');

        moneyhit = game.add.audio('moneyhit');

        explosionsound = game.add.audio('explosionfx');

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
        fences = game.add.group();
        bombers = game.add.group();

		guards.enableBody = true;
		guards.physicsBodyType = Phaser.Physics.P2JS;
		guards.someOneIsActive = false;

        fences.enableBody = true;
        fences.physicsBodyType = Phaser.Physics.P2JS;

        bombers.enableBody = true;
        bombers.physicsBodyType = Phaser.Physics.P2JS;

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
        game.fencesCollisionGroup = game.physics.p2.createCollisionGroup();
        game.bombersCollisionGroup = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup();


		//check when is touched, then launch click function
		game.input.onDown.add(this.click, this);

		// Throw projectiles

		//keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
		//keyW.onDown.add(this.addCash, this); 

		game.time.events.loop(Phaser.Timer.SECOND * game.tacoRate, this.addProjectile, this); ///////////////////////////////
        game.time.events.loop(Phaser.Timer.SECOND * game.bomberRate, this.addSuicideBomber,this);
        game.time.events.loop(Phaser.Timer.SECOND * game.moneyRate, this.addCash, this); //////////////////////////////////////////

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
        game.trump.body.collides(game.cashCollisionGroup, this.onCashHitTrump, this);
        game.trump.body.collides(game.bombersCollisionGroup); /////////////////////////////////////////////////////////////
        this.trumpIntro(); ////////////////////////////////////////////////////////////

        // trumpheads

        game.trumphead = game.add.sprite(10, 10, 'trumpsprite');
        game.trumprage = game.add.sprite(10, 10, 'trumprage');
        game.trumphappy = game.add.sprite(10,10, 'happytrump');
        game.trumphappy.visible = false;
        game.trumprage.visible = false;
        game.trumphead.visible = false;
        game.trumphead.animations.add('speak',[0,1,2,3,4,5,4,3,2,1,0], true);
        game.trumphead.scale.setTo(0.17, 0.17);
        game.trumprage.scale.setTo(0.06,0.06);
        game.trumphappy.scale.setTo(0.06,0.06);
        game.trumphead.animations.play('speak', 40, true);

        // Add buttons

        button = game.add.button(game.world.width - 100, 10, 'addGuard', this.addGuard, this);
        button = game.add.button(game.world.width - 164, 10, 'addFence', this.addFence, this);

        // Add labels 

        var style = { font: "40px Arial", fill: "#ffffff" };  
        game.labelGuards = this.game.add.text(game.world.width - 80, 28, game.numberguards, style);
        game.labelMoney = this.game.add.text(80, 15, "money:" + game.money, style);

        // Give money every x seconds

        game.time.events.loop(Phaser.Timer.SECOND * game.moneyTimeOut, this.addMoney, this, 1);

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
        var rndquote = Math.floor(Math.random() * stupidquote.length);
        var quotestart = stupidquote[rndquote];
        console.log("rndquote= " + rndquote);
        game.trumphead.visible = true;
        quotestart.play();
        quotestart.onStop.add(quoteStopped, this);
        function quoteStopped(){
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

        // If adding, place guard

        if (game.input.activePointer.isDown && game.addGuard)
        {

              this.placeGuard();
        }
        if (game.input.activePointer.isDown && game.addFence)
        {

            this.placeFence();
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
                        console.log("stop");
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
    rotateFence: function (fence)
    {

            console.log("rot");
            var lengthX = game.world.centerX - fence.position.x;
            var lengthY = game.world.centerY - fence.position.y;
            var correctingAngle = 0;

            if (lengthX < 0)
            {
                correctingAngle = Math.PI;
            }

            fence.body.rotation = Math.atan(lengthY / lengthX) + Math.PI / 2 + correctingAngle;

    },
    rotateBomber: function (bomber)
    {

        console.log("rot");
        var lengthX = game.world.centerX - bomber.position.x;
        var lengthY = game.world.centerY - bomber.position.y;
        var correctingAngle = 0;

        if (lengthX < 0)
        {
            correctingAngle = Math.PI;
        }

        bomber.body.rotation = Math.atan(lengthY / lengthX) + Math.PI / 2 + correctingAngle;

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

        // check & update health bars for guards
        fences.forEachExists(function(fence) {
            fence.healthBar.setPercent((fence.health/game.defaultFenceHealth)*100);

            if(fence.health <= 0) {
                fence.body.angularVelocity = 10;
                fence.kill = true;
                this.destroyHealthbar(fence.healthBar);
            }
        }, this);


    },
    checkHealthOnCollision: function(body){

        if(body.sprite.health <= 0) {
           body.sprite.destroy();
            //this.destroyHealthbar(body.healthBar);
        }
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
        game.trumphappy.visible = false;

        // stop after 1500ms CHANGE THIS
        game.time.events.add(Phaser.Timer.SECOND * 1, this.presidentRageStop, this);
    },
    presidentRageStop: function () {
        game.trumphead.visible = true;
        game.trumprage.visible = false;
    },
    presidentHappyStart: function()
    {
        game.trumphead.visible = false;
        game.trumphappy.visible = true;
        game.time.events.add(Phaser.Timer.SECOND * 1, this.presidentHappyStop, this);
    },
    presidentHappyStop: function()
    {
        game.trumphead.visible = true;
        game.trumphappy.visible = false;
    },

    addProjectile: function () {
        var randomPos = this.getRandomPositionOffScreen();
        var taco = game.add.sprite(randomPos.x, randomPos.y, 'taco');
        projectiles.add(taco);
        taco.kill = false;
        taco.body.clearShapes();
        taco.body.loadPolygon('tacoPhysics', 'taco');
        taco.body.setCollisionGroup(game.projectileCollisionGroup);
        taco.body.collides([game.trumpCollisionGroup, game.projectileCollisionGroup, game.guardCollisionGroup, game.fencesCollisionGroup]);
        taco.body.collideWorldBounds = false;
        this.throwProjectileToObj(taco,game.trump, 160);

        // var sound = game.add.audio('drop');
        // sound.play();
    },
    addSuicideBomber: function()
    {
        var randomPos = this.getRandomPositionOffScreen();
        var bomber = game.add.sprite(randomPos.x, randomPos.y, 'bomber');
        bombers.add(bomber);
        bomber.animations.add('walk', [1,2], 5, true);
        bomber.animations.play('walk');
        bomber.body.clearShapes();
        bomber.body.loadPolygon('personPhysics', 'person');
        bomber.body.setCollisionGroup(game.bombersCollisionGroup);
        bomber.body.collideWorldBounds = false;
        bomber.body.collides([game.trumpCollisionGroup, game.fencesCollisionGroup, game.guardCollisionGroup], this.onBomberCollide, this);

        this.throwProjectileToObj(bomber,game.trump, 60);
        this.rotateBomber(bomber);

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
        var rndouch = Math.floor(Math.random() * ouch.length);
        // take trumps health
        if(body2.sprite.key == 'taco') {
            game.trump.health -= game.tacoDamage;
            tacohit.play();
            ouch[rndouch].play();
            this.checkHealth();
        }

        //rage
        this.presidentRageStart();
    },
    onCashHitTrump: function(body1, body2) {
        // stop the cash
        var rndouch = Math.floor(Math.random() * moneyhittrump.length);
        moneyhittrump[rndouch].play();
        moneyhit.play();
        this.presidentHappyStart();
        game.money += game.moneyValue;
        body2.sprite.body.setCollisionGroup(game.collidedCollisionGroup);
        body2.sprite.kill = true;
    },
    onBomberCollide: function(bomber, collisionbody)
    {
       var explosion = game.add.sprite(bomber.sprite.position.x, bomber.sprite.position.y, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.scale.setTo(2,2);
        var explode = explosion.animations.add('explode');
        explosion.animations.play('explode', 20, false);
        explosionsound.play();
        bomber.sprite.destroy();
        //collision.sprite.health -= game.bomberDamage;
        console.log(collisionbody.sprite.key);
       // if(collision.sprite.)
       // collision.sprite.healthBar.setPercent(10);
        //this.checkHealthOnCollision(collision);


            collisionbody.sprite.health -= game.bomberDamage;


    },
    stopProjectile: function (projectileSprite) {
       if(projectileSprite.body)
       {
            projectileSprite.body.damping = 0.8;
            projectileSprite.body.angularDamping = 0.7;
            projectileSprite.body.setCollisionGroup(game.collidedCollisionGroup);
            projectileSprite.kill = true;
       }
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

            game.addGuard = true;
            game.addingGuard = game.add.sprite(game.world.width - 100, 10, 'addingGuard');
        }
        
    },
    addFence: function () {
        if (game.money >= game.PriceFence && game.money > 0)
        {
            game.addFence = true;
            game.addingFence = game.add.sprite(game.world.width - 164, 10, 'addingFence');
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
        game.addGuard = false;
        guard.healthBar = new HealthBar(this.game, {x: guard.position.x, y: guard.position.y - 40, width: 60, height: 10});
        guard.health = game.defaultGuardHealth;
        guard.kill = false;
        guard.body.clearShapes();
        guard.body.loadPolygon('personPhysics', 'person');
        guard.body.static = true;
        guard.body.setCollisionGroup(game.guardCollisionGroup);
        guard.body.collides(game.projectileCollisionGroup, this.onProjectileHitGuard, this);
        guard.body.collides(game.cashCollisionGroup, this.onCashHitGuard, this); ////////////////////////////////////////////////////
        guard.body.collides(game.bombersCollisionGroup);
        guard.animations.add('walk', [1,2], 5, true);

        guard.followPath = {};

        guard.followPath.isActive = false;
        guard.followPath.path = [];
        guard.followPath.newPath = [];
        guard.followPath.pathIndex = -1;
        guard.followPath.pathSpriteIndex = -1;
        guard.followPath.greenLine = game.add.graphics(0, 0);
    },
    placeFence: function () {
        var fence = game.add.sprite(game.input.x, game.input.y, 'fence');
        fences.add(fence);
        game.money -= game.PriceFence;
        game.addFence = false;

        fence.body.static = true;
        fence.body.setCollisionGroup(game.fencesCollisionGroup);
        fence.body.collides([game.projectileCollisionGroup], this.onProjectileHitFence, this);
        fence.body.collides([game.bombersCollisionGroup]);
        this.rotateFence(fence);
        fence.health = game.defaultFenceHealth;
        fence.healthBar = new HealthBar(this.game, {x: fence.position.x, y: fence.position.y - 40, width: 60, height: 10});



    },
    onProjectileHitGuard: function(guardBody, projectileBody) {
        this.stopProjectile(projectileBody.sprite);

        // take guard health
        if(projectileBody.sprite.key == 'taco') {
            guardBody.sprite.health -= game.tacoDamage;
            tacohit.play();
            this.checkHealth();
        }
    },
    onProjectileHitFence: function(fenceBody, projectileBody) {


        tacohit.play();
       // this.checkHealth();
        fenceBody.sprite.health -= game.tacoDamage;
        fenceBody.sprite.healthBar.setPercent(fenceBody.sprite.health/game.defaultFenceHealth*100);
        this.stopProjectile(projectileBody.sprite);
    },
    onCashHitGuard: function(guardBody, cashBody) { //////////////////////////////////////////////////////////////////////////
        cashBody.sprite.body.setCollisionGroup(game.collidedCollisionGroup);
        cashBody.sprite.kill = true;
        console.log(" YOU ARE FIRED!");
        moneyhitguard.play();
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

            }
            
        }, this);
        this.checkHealth();
    }
}
