var game;
var preload;
var playgame;

window.onload = function () {
    
    // Create a new Phaser Game
    game = new Phaser.Game(360,640);

    // Add the game states
    game.state.add("Preload", preload);
    game.state.add("Playgame", playgame);
    
    // Start the "Preload" state
    game.state.start("Preload");
    
}

preload = function(game) {};
preload.prototype = {
    preload: function () {
        
        // Preload images
        game.load.image("trump", "assets/trump.png");
        game.load.image("bodyguard", "assets/bodyguard.png");
        game.load.image("taco", "assets/taco.png");
        game.load.image("field", "assets/soccerfield.png");
        game.load.image("addGuard", "assets/addGuard.png");
        game.load.image("addingGuard", "assets/addingGuard.png");

        // preload physics
        game.load.physics('tacoPhysics', 'assets/physics/taco.json');
        game.load.physics('personPhysics', 'assets/physics/person.json');

        game.adding = false; ////////////////////////////////////////////////////////////
        game.money = 0; ///////////////////////////////////////////////////////////////////
        
    },
    create: function () {
        
        // Everything is loaded, start the "Playgame" State
        game.state.start("Playgame");
        
    }
}

playgame = function(game) {};
playgame.prototype = {
    create: function () {
        game.add.sprite(0, 0, 'field'); //////////////////////////////////////////////////
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        projectiles = game.add.group();
        projectiles.enableBody = true;
        projectiles.physicsBodyType = Phaser.Physics.P2JS;

        guards = game.add.group(); ////////////////////////////////////////////////////////////////////////////////////
        guards.enableBody = true; /////
        guards.physicsBodyType = Phaser.Physics.P2JS; /////////////////////////////////////////////////////////////

        game.trumpCollisionGroup = game.physics.p2.createCollisionGroup();
        game.projectileCollisionGroup = game.physics.p2.createCollisionGroup();

        game.guardCollisionGroup = game.physics.p2.createCollisionGroup(); ////////////////////////////
        game.physics.p2.updateBoundsCollisionGroup();

      
        // when pressing W create a new projectile
        keyW = game.input.keyboard.addKey(Phaser.Keyboard.W);
        keyW.onDown.add(this.addProjectile, this);

        // create trump
        game.trump = game.add.sprite(game.world.centerX, game.world.centerY, 'trump');
        game.trump.anchor.setTo(0.5,0.5);
        game.physics.p2.enable(game.trump);
        game.trump.body.clearShapes();
        game.trump.body.loadPolygon('personPhysics', 'person');
        game.trump.body.static = true;
        game.trump.body.setCollisionGroup(game.trumpCollisionGroup);
        game.trump.body.collides([game.projectileCollisionGroup, game.guardCollisionGroup], this.onProjectileHitTrump, this);
        
        //GUARD BUTTON //////////////////////////////////////////////////////////////////////////////////////////////////
        button = game.add.button(game.world.width - 100, 10, 'addGuard', this.addingGuardfunc, this);
        var style = { font: "40px Arial", fill: "#ffffff" };  
        game.labelGuards = this.game.add.text(game.world.width - 80, 28, game.money, style);
    },
    update: function () {

        game.trump.angle += 1;

        game.labelGuards.setText(game.money); //CHANGE TEXT IN GUARDBUTTON ////////////////////////////////////////////
        if (game.input.activePointer.isDown && game.adding) ////////////////////////////////////////////////////////
            {
                
                this.addGuard();
            }

    },
    addProjectile: function () {
        var taco = game.add.sprite(game.world.randomX, game.world.randomY, 'taco');
        projectiles.add(taco);
        taco.body.clearShapes();
        taco.body.loadPolygon('tacoPhysics', 'taco');
        taco.body.setCollisionGroup(game.projectileCollisionGroup);
        taco.body.collides([game.trumpCollisionGroup, game.projectileCollisionGroup, game.guardCollisionGroup]);
        this.throwProjectileToObj(taco,game.trump, 200);
        // var sound = game.add.audio('drop');
        // sound.play();
    },
    onProjectileHitTrump: function(obj1, obj2) {
        console.log('hit trump');
        obj2.damping = 0.8;
        obj2.angularDamping = 0.7;
        obj2.kill = true;

        game.money ++; //TEST VAR ////////////////////////////////////////////////////////////////////////////////////
    },
    throwProjectileToObj: function (obj1, obj2, speed) {
        if (typeof speed === 'undefined') { speed = 60; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(-20);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.velocity.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.velocity.y = Math.sin(angle) * speed;
    },
    addingGuardfunc: function () { //////////////////////////////////////////////////////////////////////////////////////
        if (game.money > 0) 
        {
            game.adding = true;
            game.addingGuard = game.add.sprite(game.world.width - 100, 10, 'addingGuard');
        }
        
    },
    addGuard: function () { ///////////////////////////////////////////////////////////////////////////////////////////////
        var guard = game.add.sprite(game.input.x, game.input.y, 'bodyguard');
        game.addingGuard.destroy();
        game.money --;
        game.adding = false;
        guards.add(guard);
        guard.body.clearShapes();
        guard.body.loadPolygon('personPhysics', 'person');
        guard.body.static = true;
        guard.body.setCollisionGroup(game.guardCollisionGroup);
        guard.body.collides([game.projectileCollisionGroup, game.trumpCollisionGroup]);
    },
}
