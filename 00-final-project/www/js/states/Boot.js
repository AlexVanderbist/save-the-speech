Trump = {

    // Global Vars in the game
};

Trump.Boot = function (game) {
};

Trump.Boot.prototype = {

    preload: function () {

        // load only the preloadbar for the next state
        this.load.image('preloaderBar', 'assets/preload.png');
        this.load.image('menuBackground', 'assets/menubg.png');

    },

    create: function () {

        // this.stage.smoothed = false;
        this.input.maxPointers = 1;

        // Start P2 physics
        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.restitution = 0.8;


        // Scaling
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.maxWidth = this.width * 2.5; //You can change game to this.width*2.5 if need
        this.scale.maxHeight = this.height * 2.5; //Make sure these values are proportional to the gameSize.width and gameSize.height
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        this.scale.forceOrientation(false, true);
        //this.scale.hasResized.add(this.gameResized, this);
        this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
        this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        this.scale.updateLayout();

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