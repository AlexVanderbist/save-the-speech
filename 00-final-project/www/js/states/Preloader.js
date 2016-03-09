Trump.Preloader = function (game) {

	this.preloadBar = null;

};

Trump.Preloader.prototype = {

	preload: function () {

		this.preloadBar = this.add.sprite(0, 100, 'preloaderBar');

		this.load.setPreloadSprite(this.preloadBar);

		// Preload images
		this.load.image("trump", "assets/trump.png");
		this.load.image("taco", "assets/taco.png");
		this.load.image("addGuard", "assets/addGuard.png");
		this.load.image("addingGuard", "assets/addingGuard.png");
		this.load.image("trumprage", 'assets/trumprage.png');
		this.load.image("concrete", 'assets/concrete.png');
		this.load.image("stand", 'assets/stand.png');
        
		// and sprites
		this.load.spritesheet('trumpsprite', 'assets/trumpsprite.png', 353, 624, 6);
		this.load.spritesheet('bodyguard', 'assets/bodyguardSprite.png', 64, 64);

		// Preload sounds
		this.load.audio('quote1', 'assets/sounds/Worst_President.mp3');

		// preload physics
		this.load.physics('tacoPhysics', 'assets/physics/taco.json');
		this.load.physics('personPhysics', 'assets/physics/person.json');

	},

	create: function () {

		this.state.start('MainMenu');

	},

	update: function () {
	}

};