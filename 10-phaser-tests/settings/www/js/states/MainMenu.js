Trump.MainMenu = function (game)
{

	this.playButton = null;
	this.menuBackground = null;
	this.instructionBackground = null;
	this.tapToPlayText = null;
	this.buttons = [];
};

Trump.MainMenu.prototype = {

	create: function ()
	{
		this.showMain();
	},
	clear: function()
	{
		for(button in this.buttons)
		{
			console.log(this.buttons);
			console.log(this.buttons[button]);
			this.buttons[button].destroy();
			console.log(this.buttons);
		}
	},
	showMain: function()
	{
		this.clear();
		this.menuBackground = this.add.sprite(0, 0, 'menuBackground');
		this.menuBackground.scale.setTo(0.3333);

		this.playButton = game.add.button(game.world.centerX, game.world.centerY + 130, 'playButton', this.startGame, this, 0, 0, 1);
		this.playButton.scale.setTo(0.3333);
		this.playButton.anchor.setTo(0.5);
		this.buttons.push(this.playButton);

		this.instructionButton = game.add.button(game.world.centerX, game.world.centerY + 230, 'instructionButton', this.showInstructions, this, 0, 0, 1);
		this.instructionButton.scale.setTo(0.3333);
		this.instructionButton.anchor.setTo(0.5);
		this.buttons.push(this.instructionButton);

		this.settingsButton = game.add.button(game.world.centerX, game.world.centerY + 330, 'settingsButton', this.showSettings, this, 0, 0, 1);
		this.settingsButton.scale.setTo(0.3333);
		this.settingsButton.anchor.setTo(0.5);
		this.buttons.push(this.settingsButton);
	},
	update: function ()
	{

	},
	showInstructions: function ()
	{
		this.clear();
		this.instructionBackground = this.add.sprite(0, 0, 'instructions');
		this.instructionBackground.scale.setTo(0.3333);

		this.backButton = game.add.button(game.world.centerX, game.world.centerY + 290, 'backButton', this.showMain, this, 0, 0, 1);
		this.backButton.scale.setTo(0.5);
		this.backButton.anchor.setTo(0.5);
		this.buttons.push(this.playButton);

		game.instrucStyle = {font: "20px Arial", fill: "#858080"};
		this.game.add.text(20, 180, "Save Trump's speech from the angry crowd by \nbuying bodyguards or fences to block the \nthrown taco's.", game.instrucStyle);
		var instrucTaco = game.add.sprite(8, 250, 'taco');
		instrucTaco.scale.setTo(1.5, 1.5);
		this.game.add.text(100, 275, "Does damage to Trump, bodyguard \nand fences.", game.instrucStyle);
		var instrucMoney = game.add.sprite(29, 355, 'money');
		instrucMoney.scale.setTo(1.2, 1.2);
		this.game.add.text(100, 340, "Does damage to bodyguards, but \nTrump will gain money.", game.instrucStyle);
		var instrucGuard = game.add.sprite(22, 395, 'bodyguard');
		instrucGuard.scale.setTo(0.9, 0.9);
		this.game.add.text(100, 410, "Click and drag to move and block taco's.", game.instrucStyle);
		var instrucFence = game.add.sprite(20, 464, 'fence');
		this.game.add.text(100, 455, "Place the fence to block taco's.", game.instrucStyle);
	},

	showSettings: function()
	{
		this.clear();

		this.instructionBackground = this.add.sprite(0, 0, 'settings');
		this.instructionBackground.scale.setTo(0.3333);

		this.backButton = this.add.button(this.world.centerX, this.world.centerY + 290, 'backButton', this.showMain, this, 0, 0, 1);
		this.backButton.scale.setTo(0.5);
		this.backButton.anchor.setTo(0.5);
		this.buttons.push(this.backButton);

		this.settingsStyle = {font: "20px Arial", fill: "#858080"};
		this.add.text(20, 180, "Set speed guard:", this.settingsStyle);

		this.plusButtonGuardSpeed = this.add.button(175, 175, 'plusButton', this.addSetting, this, 0,0,1);
		this.plusButtonGuardSpeed.forObject = "plusButtonGuardSpeed";
		var valueSpeed = Trump.Game.prototype.returnTrueValue(game.speedGuard, game.defaultValues.speedGuard);
		game.speedGuard = valueSpeed;
		this.textGuard = this.add.text(225, 180, valueSpeed/50, this.settingsStyle);
		this.minButtonGuardSpeed = this.add.button(255, 175, 'minButton', this.minSetting, this, 0,0,1);
		this.minButtonGuardSpeed.forObject = "minButtonGuardSpeed";
	},

	addSetting: function(object)
	{
		switch(object.forObject)
		{
			case "plusButtonGuardSpeed":
				game.speedGuard += 50;
				this.textGuard.setText(game.speedGuard/50);
				break;
		}
	},
	minSetting: function(object)
	{
		switch(object.forObject)
		{
			case "minButtonGuardSpeed":
				game.speedGuard -= 50;
				this.textGuard.setText(game.speedGuard/50);
				break;
		}
	},
	startGame: function (pointer)
	{
		//	And start the actual game
		this.state.start('Game');
	}

};