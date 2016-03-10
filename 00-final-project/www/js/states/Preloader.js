Trump.Preloader = function (game) {

	this.preloadBar = null;
	this.menuBackground = null;

};

Trump.Preloader.prototype = {

	preload: function () {

		game.stage.backgroundColor = "#FFFFFF";

		this.menuBackground = this.add.sprite(0,0, 'menuBackground');
		this.menuBackground.scale.setTo(0.3333);

		this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY + 200, 'preloaderBar');
		this.preloadBar.anchor.setTo(0.5);
		this.preloadBar.scale.setTo(0.7);

		this.load.setPreloadSprite(this.preloadBar);

		// Preload images
		//this.load.image("trump", "assets/trump.png");
		this.load.image("taco", "assets/taco.png");
		this.load.image("addGuard", "assets/addGuard.png");
		this.load.image("addingGuard", "assets/addingGuard.png");
		this.load.image("trumprage", 'assets/trumprage.png');
		this.load.image("concrete", 'assets/concrete.png');
		this.load.image("stand", 'assets/stand.png');
		this.load.image("fence", 'assets/fence.png'); ////////////////////////////
		this.load.image("money", 'assets/money.png');
		this.load.image("happytrump", 'assets/happytrump.png');

        
		// and sprites
		this.load.spritesheet('trumpsprite', 'assets/trumpsprite.png', 353, 624, 6);
		this.load.spritesheet('bodyguard', 'assets/bodyguardSprite.png', 64, 64);
		this.load.spritesheet("trump", 'assets/trumpWalk.png', 64, 64);
		this.load.spritesheet('playButton', 'assets/play.png', 686, 207);
		this.load.spritesheet('instructionButton', 'assets/instrucBtn.png', 686, 207);

		// Preload sounds
		this.load.audio('quote1', 'assets/sounds/stupidquote/stupidquote1.mp3');
		this.load.audio('quote2', 'assets/sounds/stupidquote/stupidquote2.mp3');
		this.load.audio('quote3', 'assets/sounds/stupidquote/stupidquote3.mp3');
		this.load.audio('quote4', 'assets/sounds/stupidquote/stupidquote4.mp3');
		this.load.audio('quote5', 'assets/sounds/stupidquote/stupidquote5.mp3');
		this.load.audio('quote6', 'assets/sounds/stupidquote/stupidquote6.mp3');
		this.load.audio('quote7', 'assets/sounds/stupidquote/stupidquote7.mp3');
		this.load.audio('quote8', 'assets/sounds/stupidquote/stupidquote8.mp3');
		this.load.audio('quote9', 'assets/sounds/stupidquote/stupidquote9.mp3');
		this.load.audio('quote10', 'assets/sounds/stupidquote/stupidquote10.mp3');

		this.load.audio('ouch1', 'assets/sounds/trumpdamage/ouch1.mp3');
		this.load.audio('ouch2', 'assets/sounds/trumpdamage/ouch2.mp3');
		this.load.audio('dead', 'assets/sounds/trumpdamage/dead.mp3');

		this.load.audio('money1', 'assets/sounds/trumpmoney/money1.mp3');
		this.load.audio('money2', 'assets/sounds/trumpmoney/money2.mp3');
		this.load.audio('money3', 'assets/sounds/trumpmoney/money3.mp3');

		this.load.audio('tacohit', 'assets/sounds/hitbytaco/tacohit.mp3');

		this.load.audio('guardmoneyhit', 'assets/sounds/guardmoney/money1.mp3');

		this.load.audio('moneyhit', 'assets/sounds/moneyhit/kaching1.mp3');

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