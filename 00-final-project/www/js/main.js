(function () {
	
	var game;
	var gameSize = {width: 480, height: 800};

	var loadGame = function ()
	{
		// Create a new Phaser Game
		game = new Phaser.Game(gameSize.width, gameSize.height);

		// Add the game states
		game.state.add("Boot", Trump.Boot);
		game.state.add("Preloader", Trump.Preloader);
		game.state.add("MainMenu", Trump.MainMenu);
		game.state.add("Playgame", Trump.Playgame);

		// Start the "Boot" state
		game.state.start("Boot");
	};


	document.addEventListener('deviceready', loadGame, false);
	
})();