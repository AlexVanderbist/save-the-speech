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

		//var style = {font: "40px Arial", fill: "#ffffff", align: "center"};
		//this.labelGuards = this.add.text(this.world.centerX, this.world.height - 300, "Tap to start!", style);
		//this.labelGuards.anchor.set(0.5);
		
		//this.playButton = this.add.button(400, 600, 'addingGuard', this.startGame, this, 'buttonOver', 'buttonOut', 'buttonOver');

        //this.input.onDown.addOnce(this.showInstructions, this);

        
        this.playButton = game.add.button(game.world.centerX, game.world.centerY + 180, 'playButton', this.startGame, this, 0, 0, 1);
        this.playButton.scale.setTo(0.3333);
        this.playButton.anchor.setTo(0.5);

        this.instructionButton = game.add.button(game.world.centerX, game.world.centerY + 280, 'instructionButton', this.showInstructions, this, 0, 0, 1);
        this.instructionButton.scale.setTo(0.3333);
        this.instructionButton.anchor.setTo(0.5);

	},

	update: function () {

	},
	showInstructions: function () {
		this.instructionBackground = this.add.sprite(0,0, 'instructions');
		this.instructionBackground.scale.setTo(0.3333);

		this.playButton = game.add.button(game.world.centerX, game.world.centerY + 290, 'playButton', this.startGame, this, 0, 0, 1);
        this.playButton.scale.setTo(0.5);
        this.playButton.anchor.setTo(0.5);

		game.instrucStyle = { font: "20px Arial", fill: "#858080" };  
        this.game.add.text(20, 180, "Save Trump's speech from the angry crowd by \nbuying bodyguards or fences to block the \nthrown taco's.", game.instrucStyle);
        var instrucTaco = game.add.sprite(10, 250, 'taco');
        instrucTaco.scale.setTo(1.5, 1.5);
        this.game.add.text(100, 275, "Does damage to Trump, bodyguard \nand fences.", game.instrucStyle);
        var instrucMoney = game.add.sprite(32, 355, 'money');
        instrucMoney.scale.setTo(1.2, 1.2);
        this.game.add.text(100, 340, "Does damage to bodyguards, but \nTrump will gain money.", game.instrucStyle);
        var instrucGuard = game.add.sprite(22, 395, 'bodyguard');
        instrucGuard.scale.setTo(0.9, 0.9);
        this.game.add.text(100, 410, "Click and drag to move and block taco's.", game.instrucStyle);
        var instrucFence = game.add.sprite(22, 455, 'fence');
        this.game.add.text(100, 455, "Place the fence and block taco's.", game.instrucStyle);
	},

	startGame: function (pointer) {

		//	And start the actual game
		this.state.start('Game');

	}

};