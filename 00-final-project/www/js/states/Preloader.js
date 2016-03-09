Trump.Preloader = function (game) {

	this.preloadBar = null;

};

Trump.Preloader.prototype = {

	preload: function () {

		this.preloadBar = this.add.sprite(0, 100, 'preloaderBar');

		this.load.setPreloadSprite(this.preloadBar);

		// Preload images
		game.load.image("trump", "assets/trump.png");
		game.load.image("taco", "assets/taco.png");
		game.load.image("addGuard", "assets/addGuard.png");
		game.load.image("addingGuard", "assets/addingGuard.png");
		game.load.image("trumprage", 'assets/trumprage.png');
		game.load.image("concrete", 'assets/concrete.png');
		game.load.image("stand", 'assets/stand.png');
        
		// and sprites
		game.load.spritesheet('trumpsprite', 'assets/trumpsprite.png', 353, 624, 6);
		game.load.spritesheet('bodyguard', 'assets/bodyguardSprite.png', 64, 64);

		// Preload sounds
		game.load.audio('quote1', 'assets/sounds/Worst_President.mp3');

		// preload physics
		game.load.physics('tacoPhysics', 'assets/physics/taco.json');
		game.load.physics('personPhysics', 'assets/physics/person.json');

	},

	create: function () {

		this.state.start('MainMenu');

	},

	update: function () {
	}

};