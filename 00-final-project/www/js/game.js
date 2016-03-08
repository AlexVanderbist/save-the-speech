var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', loadGame, false);
    }
};



//////////////////////////////////



var game;
var preload;
var playgame;

var loadGame = function () {
    
    // Create a new Phaser Game
    game = new Phaser.Game(window.innerWidth, window.innerHeight);

    // Add the game states
    game.state.add("Preload", preload);
    game.state.add("Playgame", playgame);
    
    // Start the "Preload" state
    game.state.start("Preload");
    
}

preload = function(game) {};
preload.prototype = {
    preload: function () {
        
        // Preload images
        game.load.image("trump", "assets/trump.png");
        game.load.image("bodyguard", "assets/bodyguard.png");
        game.load.image("taco", "assets/taco.png");
        game.load.image("addGuard", "assets/addGuard.png");
        game.load.image("addingGuard", "assets/addingGuard.png");

        // preload physics
        game.load.physics('tacoPhysics', 'assets/physics/taco.json');
        game.load.physics('personPhysics', 'assets/physics/person.json');

        // Vars
        game.PriceGuard = 10;
        game.moneyTimeOut = 2; // om de twee seconden 1 muntje

        game.adding = false; // later ID ofzo
        game.money = 15;
        
    },
    create: function () {
        
        // Everything is loaded, start the "Playgame" State
        game.state.start("Playgame");
        
    }
}

playgame = function(game) {};
playgame.prototype = {
    create: function () {

        // Start P2 physics

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        // Create Groups

        guards = game.add.group(); 
        guards.enableBody = true; 
        guards.physicsBodyType = Phaser.Physics.P2JS;

        projectiles = game.add.group();
        projectiles.enableBody = true;
        projectiles.physicsBodyType = Phaser.Physics.P2JS;

        // Create collision groups

        game.trumpCollisionGroup = game.physics.p2.createCollisionGroup();
        game.projectileCollisionGroup = game.physics.p2.createCollisionGroup();
        game.collidedCollisionGroup = game.physics.p2.createCollisionGroup();
        game.guardCollisionGroup = game.physics.p2.createCollisionGroup();

        game.physics.p2.updateBoundsCollisionGroup();
      
        // Throw projectiles

        // keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        // keyW.onDown.add(this.addProjectile, this);

        game.time.events.loop(Phaser.Timer.SECOND * 2, this.addProjectile, this);

        // create trump

        game.trump = game.add.sprite(game.world.centerX, game.world.centerY, 'trump');
        game.trump.anchor.setTo(0.5,0.5);
        game.physics.p2.enable(game.trump);
        game.trump.body.clearShapes();
        game.trump.body.loadPolygon('personPhysics', 'person');
        game.trump.body.static = true;
        game.trump.body.setCollisionGroup(game.trumpCollisionGroup);
        game.trump.body.collides(game.projectileCollisionGroup, this.onProjectileHitTrump, this);

        // Add buttons

        button = game.add.button(game.world.width - 100, 10, 'addGuard', this.addGuard, this);

        // Add labels 

        var style = { font: "40px Arial", fill: "#ffffff" };  
        game.labelGuards = this.game.add.text(game.world.width - 80, 28, game.numberguards, style);
        game.labelMoney = this.game.add.text(20, 28, "money:" + game.money, style);

        // Give money every x seconds

        game.time.events.loop(Phaser.Timer.SECOND * game.moneyTimeOut, this.addMoney, this, 1);
        
    },
    update: function () {

        game.trump.angle += 1;

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
    addProjectile: function () {
        var randomPos = this.getRandomPositionOffScreen();
        var taco = game.add.sprite(randomPos.x, randomPos.y, 'taco');
        projectiles.add(taco);
        taco.kill = false;
        taco.body.clearShapes();
        taco.body.loadPolygon('tacoPhysics', 'taco');
        taco.body.setCollisionGroup(game.projectileCollisionGroup);
        taco.body.collides([game.trumpCollisionGroup, game.projectileCollisionGroup]);
        taco.body.collideWorldBounds = false;
        this.throwProjectileToObj(taco,game.trump, 200);

        // var sound = game.add.audio('drop');
        // sound.play();
    },
    onProjectileHitTrump: function(body1, body2) {
        console.log('hit trump');
        body2.damping = 0.8;
        body2.angularDamping = 0.7;
        body2.sprite.kill = true;
        body2.setCollisionGroup(game.collidedCollisionGroup);
        //game.add.tween(body2.sprite).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 1, 1000, true);
    },
    throwProjectileToObj: function (obj1, obj2, speed) {
        if (typeof speed === 'undefined') { speed = 60; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(-20);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.velocity.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.velocity.y = Math.sin(angle) * speed;
    },
    addGuard: function () {
        if (game.money > game.PriceGuard) 
        {
            game.adding = true;
            game.addingGuard = game.add.sprite(game.world.width - 100, 10, 'addingGuard');
        }
        
    },
    placeGuard: function () { 
        var guard = game.add.sprite(game.input.x, game.input.y, 'bodyguard');
        guards.add(guard);
        game.addingGuard.destroy();
        game.money -= game.PriceGuard;
        game.adding = false;
        guard.body.clearShapes();
        guard.body.loadPolygon('personPhysics', 'person');
        guard.body.static = true;
        guard.body.setCollisionGroup(game.guardCollisionGroup);
        guard.body.collides([game.projectileCollisionGroup]);
    },
    addMoney: function (amount) { 
        game.money += amount;
    }
}
