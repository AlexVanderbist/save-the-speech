var game;

function loadGame ()
{

	// Create a new Phaser Game
	game = new Phaser.Game(480, 800);

	// Add the game states
	game.state.add("Boot", Trump.Boot);
	game.state.add("Preloader", Trump.Preloader);
	game.state.add("MainMenu", Trump.MainMenu);
	game.state.add("GameOver", Trump.GameOver);
	game.state.add("Game", Trump.Game);

	// Start the "Boot" state
	game.state.start("Boot");
};

loadGame();
//document.addEventListener('deviceready', loadGame, false);
