Trump.MainMenu = function (game) {

	this.playButton = null;

};

Trump.MainMenu.prototype = {

	create: function () {

		this.playButton = this.add.button(400, 600, 'playButton', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');

        //this.input.onDown.addOnce(this.startGame, this);

	},

	update: function () {

	},

	startGame: function (pointer) {

		//	And start the actual game
		this.state.start('Game');

	}

};