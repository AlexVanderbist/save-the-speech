var game;

//  The Google WebFont Loader will look for this object, so create it before loading the script.
WebFontConfig = {

    //  'active' means all requested fonts have finished loading
    //  We set a 1 second delay before calling 'createText'.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Revalia']
    }

};

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

//loadGame();
document.addEventListener('deviceready', loadGame, false);
