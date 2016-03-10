Trump.GameOver = function (game) {

	this.playButton = null;

};

Trump.GameOver.prototype = {

	create: function () {

		this.menuBackground = this.add.sprite(0,0, 'menuBackground');
		this.menuBackground.scale.setTo(0.3333);

        this.playButton = game.add.button(game.world.centerX, game.world.centerY + 180, 'playButton', this.startGame, this, 0, 0, 1);
        this.playButton.scale.setTo(0.3333);
        this.playButton.anchor.setTo(0.5);

	},

	update: function () {

	},

	startGame: function (pointer) {

		//	And start the actual game
		this.state.start('Game');

	}

};