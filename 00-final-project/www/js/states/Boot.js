Trump = {

    // Global Vars in the game

};

Trump.Boot = function (game) {
};

Trump.Boot.prototype = {

    preload: function () {

        // load only the preloadbar for the next state
        this.load.image('preloaderBar', 'assets/preload.png');

        console.log('boot reached');

    },

    create: function () {

        // this.stage.smoothed = false;
        this.input.maxPointers = 1;

        // Start P2 physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;


        // Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.maxWidth = gameSize.width * 2.5; //You can change game to gameSize.width*2.5 if need
        game.scale.maxHeight = gameSize.height * 2.5; //Make sure these values are proportional to the gameSize.width and gameSize.height
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(false, true);
        this.scale.hasResized.add(this.gameResized, this);
        this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        this.scale.setScreenSize(true);

        // Load the loader
        this.state.start('Preloader');

    },

    gameResized: function (width, height) {
    },

    enterIncorrectOrientation: function () {
    },

    leaveIncorrectOrientation: function () {
    }

};