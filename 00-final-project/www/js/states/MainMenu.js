Trump.MainMenu = function (game) {

	this.playButton = null;
	this.menuBackground = null;
	this.instructionBackground = null;
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

        this.input.onDown.addOnce(this.showInstructions, this);

	},

	update: function () {

	},
	showInstructions: function () {
		this.instructionBackground = this.add.sprite(0,0, 'instructions');
		this.instructionBackground.scale.setTo(0.3333);
		//this.input.onDown.addOnce(this.startGame, this);

		game.instrucStyle = { font: "20px Arial", fill: "#858080" };  
        this.game.add.text(20, 200, "Save Trump's speech from the angry crowd by \nbuying bodyguards or fences to block the \nthrown taco's.", game.instrucStyle);
        var instrucTaco = game.add.sprite(10, 280, 'taco');
        instrucTaco.scale.setTo(1.5, 1.5);
        this.game.add.text(100, 300, "Does damage to Trump, bodyguard \nand fences.", game.instrucStyle);
        var instrucMoney = game.add.sprite(10, 380, 'money');
        this.game.add.text(100, 380, "Does damage to bodyguards, but \nTrump will gain money.", game.instrucStyle);
        var instrucGuard = game.add.sprite(10, 450, 'bodyguard');
        this.game.add.text(100, 450, "Click and drag to move.", game.instrucStyle);
	},

	startGame: function (pointer) {

		//	And start the actual game
		this.state.start('Game');

	}

};