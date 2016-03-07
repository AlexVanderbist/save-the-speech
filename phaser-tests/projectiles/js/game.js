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

        projectiles = game.add.group();
        projectiles.enableBody = true;
        projectiles.physicsBodyType = Phaser.Physics.P2JS;
      
        keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyW.onDown.add(this.addProjectile, this);

        game.trump = game.add.sprite(game.world.centerX, game.world.centerY, 'trump');
        game.trump.anchor.setTo(0.5,0.5);
        
    },
    update: function () {

        game.trump.angle += 1;

        projectiles.forEachAlive(this.moveProjectile,this);

    },
    addProjectile: function () {
        var taco = game.add.sprite(game.world.randomX, game.world.randomY, 'taco');
        projectiles.add(taco);
        // var sound = game.add.audio('drop');
        // sound.play();
    },
    moveProjectile: function (projectile) {
        this.accelerateToObject(projectile,game.trump,30);
    },
    accelerateToObject: function (obj1, obj2, speed) {
        if (typeof speed === 'undefined') { speed = 60; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.force.y = Math.sin(angle) * speed;
    }
}
