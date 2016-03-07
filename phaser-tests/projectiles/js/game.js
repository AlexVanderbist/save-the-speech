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
        game.load.spritesheet("explosion", "assets/explosion.png", 50, 128);
        game.load.spritesheet("water", "assets/water.png", 64, 64);
        game.load.audio('bomb', ['assets/bomb.mp3', 'assets/bomb.ogg']);
        game.load.audio('drop', ['assets/drop.mp3', 'assets/drop.ogg']);
        
    },
    create: function () {
        
        // Everything is loaded, start the "Playgame" State
        game.state.start("Playgame");
        
    }
}

playgame = function(game) {};
playgame.prototype = {
    create: function () {
      
        keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyW.onDown.add(this.addWater, this);

        keyB = game.input.keyboard.addKey(Phaser.Keyboard.B);
        keyB.onDown.add(this.addBomb, this);  
        
    },
    update: function () {


    },
    addWater: function () {
        var water = game.add.sprite(game.world.randomX, game.world.randomY, 'water');
        water.animations.add('waterDrop');
        water.animations.play('waterDrop', 30);
        var sound = game.add.audio('drop');
        sound.play();
    },
    addBomb: function() {
        var explosion = game.add.sprite(game.world.randomX, game.world.randomY, 'explosion');
        explosion.animations.add('explode');
        explosion.animations.play('explode', 30);
        var sound = game.add.audio('bomb');
        sound.play();

    },
    render: function () {
        
        // uncomment following line to see the shape that is used on Flappy for collision detection
        // game.debug.body(this.flappy);
        
    }
}
