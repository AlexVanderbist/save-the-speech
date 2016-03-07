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
        keyW.onDown.add(this.addProjectile, this);
        
    },
    update: function () {


    },
    addProjectile: function () {
        var water = game.add.sprite(game.world.randomX, game.world.randomY, 'water');
        water.animations.add('waterDrop');
        water.animations.play('waterDrop', 30);
        // var sound = game.add.audio('drop');
        // sound.play();
    }
}
