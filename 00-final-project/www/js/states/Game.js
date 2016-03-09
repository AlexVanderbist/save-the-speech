MissileCommand.Game = function (game) {

    this.PriceGuard = 10,
    this.moneyTimeOut = 2, // om de twee seconden 1 muntje
    this.tacoDamage = 30,
    this.defaultGuardHealth = 100.0,
    this.defaultPresidentHealth = 160.0,

    this.adding = false, // later ID ofzo
    this.money = 15,

};

MissileCommand.Game.prototype = {

	create: function () {

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
        this.trump.healthBar = new HealthBar(this.this, {
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
        this.trumphead.animations.add('speak',[0,1,2,3,4,5,4,3,2,1,0], true);
        this.trumphead.scale.setTo(0.17, 0.17);
        this.trumprage.scale.setTo(0.06,0.06);
        this.trumphead.animations.play('speak', 40, true);

        // Add buttons

        button = this.add.button(this.world.width - 100, 10, 'addGuard', this.addGuard, this);

        // Add labels 

        var style = { font: "40px Arial", fill: "#ffffff" };  
        this.labelGuards = this.this.add.text(this.world.width - 80, 28, this.numberguards, style);
        this.labelMoney = this.this.add.text(80, 15, "money:" + this.money, style);

        // Give money every x seconds

        this.time.events.loop(Phaser.Timer.SECOND * this.moneyTimeOut, this.addMoney, this, 1);

        // Start waves
        this.startWave(1);
	},

	update: function () {
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

        projectiles.forEachExists(function(projectile) {
            if(projectile.kill) {
                projectile.alpha -= 0.04;
                if(projectile.alpha < 0) {
                    //remove the projectile
                    projectile.destroy();
                }
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

	},

    startWave: function(waveNumber) {
        // play first quote

        quote = this.add.audio('quote1');

        this.trumphead.visible = true;
        quote.play();
        quote.onStop.add(quoteStopped, this);
        function quoteStopped(quote){
            this.trumphead.animations.stop(null, true);
        }


    },

	quitGame: function () {

		this.state.start('MainMenu');

	},
    guardClickHandler: function()
    {
        if (this.input.pointer1.isDown && guards.activeGuard !== null)
        {
            //console.log("ok");
            if (!wasDown)
            {
                //console.log("eerste");
                guards.activeGuard.followPath.greenLine.moveTo(this.input.x, this.input.y);
                guards.activeGuard.followPath.pathIndex = 0;
                guards.activeGuard.followPath.pathSpriteIndex = 0;
                guards.activeGuard.followPath.path = [];
                guards.activeGuard.followPath.newPath = [];
                wasDown = true;
            }
            if (guards.activeGuard.followPath.pathIndex == 0 || (guards.activeGuard.followPath.path[ guards.activeGuard.followPath.pathIndex - 1 ].x != this.input.x || guards.activeGuard.followPath.path[ guards.activeGuard.followPath.pathIndex - 1 ].y != this.input.y))
            {
                guards.activeGuard.followPath.path[ guards.activeGuard.followPath.pathIndex ] = new Phaser.Point(this.input.x, this.input.y);
                guards.activeGuard.followPath.newPath.push(new Phaser.Point(this.input.x, this.input.y));
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
                this.physics.arcade.moveToXY(guards.children[guard ], curGuard.newPath[ 0 ].x, curGuard.newPath[ 0 ].y, 250);

                if (this.physics.arcade.distanceToXY(guards.children[guard ], curGuard.path[ curGuard.pathSpriteIndex ].x, curGuard.path[ curGuard.pathSpriteIndex ].y) < 20)
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
        if(this.trump.health <= 0) {
            // trump died :(
            this.destroyHealthbar(this.trump.healthBar);
            this.trump.destroy(); // for now
        }

        // update trump health bar
        this.trump.healthBar.setPercent((this.trump.health/this.defaultPresidentHealth)*100);

        // check & update health bars for guards
        guards.forEachExists(function(guard) {
            guard.healthBar.setPosition( guard.position.x,  guard.position.y - 40);
            guard.healthBar.setPercent((guard.health/this.defaultGuardHealth)*100);

            if(guard.health <= 0) {
                guard.body.angularVelocity = 10;
                guard.kill = true;
                this.destroyHealthbar(guard.healthBar);
            }
        }, this);
    },
    getRandomPositionOffScreen: function() {
        var radius = Math.sqrt(Math.pow(this.world.width/2, 2) + Math.pow(this.world.height/2, 2));
        radius += 40; // make sure nothing is visible when spawning
        var angle = Math.random() * Math.PI * 2;

        var pos = {
            x: Math.cos(angle)*radius + this.world.centerX,
            y: Math.sin(angle)*radius + this.world.centerY
        };

        //debug stuff
        // var graphics = this.add.graphics(this.world.centerX, this.world.centerY);
        // graphics.beginFill(0xFF0000, 1);
        // graphics.drawCircle(0, 0, radius * 2);

        return pos;
        
    },

    presidentRageStart: function () {
        // enable rage
        this.trumphead.visible = false;
        this.trumprage.visible = true;

        // stop after 1500ms CHANGE THIS
        this.time.events.add(Phaser.Timer.SECOND * 1, this.presidentRageStop, this);
    },

    presidentRageStop: function () {
        this.trumphead.visible = true;
        this.trumprage.visible = false;
    },

    addProjectile: function () {
        var randomPos = this.getRandomPositionOffScreen();
        var taco = this.add.sprite(randomPos.x, randomPos.y, 'taco');
        projectiles.add(taco);
        taco.kill = false;
        taco.body.clearShapes();
        taco.body.loadPolygon('tacoPhysics', 'taco');
        taco.body.setCollisionGroup(this.projectileCollisionGroup);
        taco.body.collides([this.trumpCollisionGroup, this.projectileCollisionGroup, this.guardCollisionGroup]);
        taco.body.collideWorldBounds = false;
        this.throwProjectileToObj(taco,this.trump, 160);

        // var sound = this.add.audio('drop');
        // sound.play();
    },

    onProjectileHitTrump: function(body1, body2) {
        // stop the projectile
        this.stopProjectile(body2.sprite);

        // take trumps health
        if(body2.sprite.key == 'taco') {
            this.trump.health -= this.tacoDamage;
            this.checkHealth();
        }

        //rage
        this.presidentRageStart();
    },

    stopProjectile: function (projectileSprite) {
        projectileSprite.body.damping = 0.8;
        projectileSprite.body.angularDamping = 0.7;
        projectileSprite.body.setCollisionGroup(this.collidedCollisionGroup);
        projectileSprite.kill = true;
    },

    throwProjectileToObj: function (obj1, obj2, speed) { 
        if (typeof speed === 'undefined') { speed = 60; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + this.math.degToRad(-20);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.velocity.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.velocity.y = Math.sin(angle) * speed;
    },

    addGuard: function () {
        if (this.money >= this.PriceGuard) 
        {
            this.adding = true;
            this.addingGuard = this.add.sprite(this.world.width - 100, 10, 'addingGuard');
        }
        
    },

    destroyHealthbar: function (healthbar) {
        healthbar.barSprite.destroy();
        healthbar.bgSprite.destroy();
    },

    placeGuard: function () { 
        var guard = this.add.sprite(this.input.x, this.input.y, 'bodyguard');
        guards.add(guard);
        this.addingGuard.destroy();
        this.money -= this.PriceGuard;
        this.adding = false;
        guard.healthBar = new HealthBar(this.game, {x: guard.position.x, y: guard.position.y - 40, width: 60, height: 10});
        guard.health = this.defaultGuardHealth;
        guard.kill = false;
        guard.body.clearShapes();
        guard.body.loadPolygon('personPhysics', 'person');
        guard.body.static = true;
        guard.body.setCollisionGroup(this.guardCollisionGroup);
        guard.body.collides([this.projectileCollisionGroup], this.onProjectileHitGuard, this);

        guard.animations.add('walk', [1,2], 5, true);

        guard.followPath = {};

        guard.followPath.isActive = false;
        guard.followPath.path = [];
        guard.followPath.newPath = [];
        guard.followPath.pathIndex = -1;
        guard.followPath.pathSpriteIndex = -1;
        guard.followPath.greenLine = this.add.graphics(0, 0);
    },

    onProjectileHitGuard: function(guardBody, projectileBody) {
        this.stopProjectile(projectileBody.sprite);

        // take guard health
        if(projectileBody.sprite.key == 'taco') {
            guardBody.sprite.health -= this.tacoDamage;
            this.checkHealth();
        }
    },

    addMoney: function (amount) { 
        this.money += amount;
    },

    click: function(object)
    {
        var bodies = this.physics.p2.hitTest(object.position, guards.children);

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
    }

};