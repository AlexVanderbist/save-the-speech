Trump.MainMenu = function (game) {

	this.playButton = null;
	this.menuBackground = null;
	this.tapToPlayText = null;

};

Trump.MainMenu.prototype = {

	create: function () {

		this.menuBackground = this.add.sprite(0,0, 'menuBackground');
		this.menuBackground.scale.setTo(0.3333);

		var style = {font: "40px Arial", fill: "#ffffff", align: "center"};
		this.labelGuards = this.add.text(this.world.centerX, this.world.height - 300, "Tap to start!", style);
		this.labelGuards.anchor.set(0.5);
		
		//this.playButton = this.add.button(400, 600, 'addingGuard', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');

        this.input.onDown.addOnce(this.startGame, this);

	},

	update: function () {

	},

	startGame: function (pointer) {

		//	And start the actual game
		this.state.start('Game');

	}

};