Trump.GameOver = function (game) {

	this.playButton = null;

};

Trump.GameOver.prototype = {

	create: function () {

		this.menuBackground = this.add.sprite(0,0, 'menuBackground');
		this.menuBackground.scale.setTo(0.3333);

		var overstyle = {font: "50px Arial", fill: "#000000", align: "center"};
		this.labelOver = this.add.text(this.world.centerX, 80, "Game Over!", overstyle); 
		this.labelOver.anchor.set(0.5);

		var scorestyle = {font: "30px Arial", fill: "#ffffff", align: "center"};
		this.labelShowHighScore = this.add.text(this.world.centerX, this.world.centerY + 135, "SCORE: " + (game.score -2), scorestyle); 
		this.labelShowScore.anchor.set(0.5);
		this.labelShowScore.stroke = "#000000";
		this.labelShowScore.strokeThickness = 3;

		this.labelShowHighScore = this.add.text(this.world.centerX, this.world.centerY + 185, "HIGHSCORE: " + game.bestScore, scorestyle); 
		this.labelShowHighScore.anchor.set(0.5);
		this.labelShowHighScore.stroke = "#000000";
		this.labelShowHighScore.strokeThickness = 3;

        this.playButton = this.add.button(this.world.centerX, this.world.height - 60, 'playButton', this.startGame, this, 0, 0, 1);
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