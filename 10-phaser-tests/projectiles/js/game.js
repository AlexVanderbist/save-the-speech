var game;
var preload;
var playgame;

window.onload = function () {
    
    // Create a new Phaser Game
    game = new Phaser.Game(480,640);

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

        // preload physics
        game.load.physics('tacoPhysics', 'assets/physics/taco.json');
        game.load.physics('personPhysics', 'assets/physics/person.json');
        
    },
    create: function () {
        
        // Everything is loaded, start the "Playgame" State
        game.state.start("Playgame");
        
    }
}

playgame = function(game) {};
playgame.prototype = {
    create: function () {

        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        projectiles = game.add.group();
        projectiles.enableBody = true;
        projectiles.physicsBodyType = Phaser.Physics.P2JS;

        game.trumpCollisionGroup = game.physics.p2.createCollisionGroup();
        game.projectileCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();
      
        // when pressing W create a new projectile
        keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyW.onDown.add(this.addProjectile, this);

        // create trump
        game.trump = game.add.sprite(game.world.centerX, game.world.centerY, 'trump');
        game.trump.anchor.setTo(0.5,0.5);
        game.physics.p2.enable(game.trump);
        game.trump.body.clearShapes();
        game.trump.body.loadPolygon('personPhysics', 'person');
        game.trump.body.static = true;
        game.trump.body.setCollisionGroup(game.trumpCollisionGroup);
        game.trump.body.collides(game.projectileCollisionGroup, this.onProjectileHitTrump, this);
        
    },
    update: function () {

        game.trump.angle += 1;

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
        

    },
    addProjectile: function () {
        var taco = game.add.sprite(game.world.randomX, game.world.randomY, 'taco');
        projectiles.add(taco);
        taco.kill = false;
        taco.body.clearShapes();
        taco.body.loadPolygon('tacoPhysics', 'taco');
        taco.body.setCollisionGroup(game.projectileCollisionGroup);
        taco.body.collides([game.trumpCollisionGroup, game.projectileCollisionGroup]);
        this.throwProjectileToObj(taco,game.trump, 200);

        // var sound = game.add.audio('drop');
        // sound.play();
    },
    onProjectileHitTrump: function(body1, body2) {
        console.log('hit trump');
        body2.damping = 0.8;
        body2.angularDamping = 0.7;
        body2.sprite.kill = true;
        body2.collides([game.trumpCollisionGroup]);
        //game.add.tween(body2.sprite).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 1, 1000, true);
    },
    throwProjectileToObj: function (obj1, obj2, speed) {
        if (typeof speed === 'undefined') { speed = 60; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(-20);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.velocity.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.velocity.y = Math.sin(angle) * speed;
    }
}
