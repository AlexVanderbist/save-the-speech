var game;
var preload;
var playgame;
var index=0;
window.onload = function () {
    
    // Create a new Phaser Game
    game = new Phaser.Game(480,640);

    // Add the game states
    game.state.add("Preload", preload);
    game.state.add("Playgame", playgame);
    
    // Start the "Preload" state
    game.state.start("Preload");
    
}

preload = function(game) {};
preload.prototype = {
    preload: function () {

        game.load.image("trumprage", 'assets/trumprage.png');
        game.load.spritesheet('trumpsprite', 'assets/trumpsprite.png', 353, 624, 6);
        game.load.audio('sound1', 'assets/Worst_President.mp3');
        // Preload images
        game.load.image("trump", "assets/trump.png");
        game.load.image("bodyguard", "assets/bodyguard.png");
        game.load.image("taco", "assets/taco.png");

        // preload physics
        game.load.physics('tacoPhysics', 'assets/physics/taco.json');
        game.load.physics('personPhysics', 'assets/physics/person.json');

    },
    create: function () {
        
        // Everything is loaded, start the "Playgame" State
        game.state.start("Playgame");


    }
}
var myHealthBar = null ;
var trumpHealth = 100;
var healthbararray = new Array();
var trumphead = null;
var trumprage = null;
var timecheck = null;
var boolcheck = false;
playgame = function(game) {};
playgame.prototype = {
    create: function () {
      //////////////////////////////////////////////////////////////////////////////rowan
       trumphead = game.add.sprite(0, 0, 'trumpsprite');
       trumprage = game.add.sprite(0, 0, 'trumprage');
        trumprage.visible = false;
        trumphead.animations.add('walk',[0,1,2,3,4,5,4,3,2,1,0], true);
        trumphead.scale.setTo(0.3, 0.3);
        trumprage.scale.setTo(0.1,0.1);
        trumphead.animations.play('walk', 40, true);

        music = game.add.audio('sound1');

        music.play();
        music.onStop.add(soundStopped, this);
        function soundStopped(sound){
            trumphead.animations.stop(null, true);
        }
        //////////////////////////////////////////////////////////////////////////////////end rowan


        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.restitution = 0.8;

        projectiles = game.add.group();
        projectiles.enableBody = true;
        projectiles.physicsBodyType = Phaser.Physics.P2JS;

        game.trumpCollisionGroup = game.physics.p2.createCollisionGroup();
        game.projectileCollisionGroup = game.physics.p2.createCollisionGroup();
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
        game.trump.body.collides(game.projectileCollisionGroup, this.onProjectileHitTrump, this);
        // rowan healthbar
        myHealthBar = new HealthBar(this.game, {x: game.trump.position.x, y: game.trump.position.y - 40, width: 60, height: 10});
        myHealthBar.setPercent(trumpHealth);
        // end rowan healthbar
    },
    update: function () {

        game.trump.angle += 1;
       // rowan healthh bar
        projectiles.forEachExists(function(projectile) {
console.log(projectiles.length);
           healthbararray[projectile.id].setPosition( projectile.position.x,  projectile.position.y - 40);

        }, this);

        //true if taco hits trump then show angry face in function delaybetweenheads
        if(boolcheck == true) {
            delayBetweenHeads();
            console.log("test");
        }
    //endrowan healthbar
    },
    addProjectile: function () {


         var taco = game.add.sprite(game.world.randomX, game.world.randomY, 'taco');
        // rowan healthbar
         var healthbar =new HealthBar(this.game, {x: taco.position.x, y: taco.position.y - 40, width: 60, height: 10});
        projectiles.add(taco);
        taco.id = index;
        console.log(taco.id);
        healthbararray[taco.id] = healthbar;

        index++;
        // end rowan healthbar
        taco.body.clearShapes();
        taco.body.loadPolygon('tacoPhysics', 'taco');
        taco.body.setCollisionGroup(game.projectileCollisionGroup);
        taco.body.collides([game.trumpCollisionGroup, game.projectileCollisionGroup]);
        this.throwProjectileToObj(taco,game.trump, 200);
        // var sound = game.add.audio('drop');
        // sound.play();
    },
    onProjectileHitTrump: function(obj1, obj2) {
        console.log('hit trump');
        obj2.damping = 0.8;
        obj2.angularDamping = 0.7;
      // obj2.sprite.kill = true;
       // rowan healthbar
        var tacoDamage = 5;
        if (obj2.sprite.key == "taco")
        {

            trumpHealth = trumpHealth - tacoDamage;
            if(trumpHealth > 0){
            myHealthBar.setPercent(trumpHealth);
            }
        }
        if(trumpHealth <= 0){
            obj1.sprite.kill();

           // rowan healthbar
            myHealthBar.barSprite.kill();
            myHealthBar.bgSprite.kill();

        }

        //check if hit so delaybetweenheads function can be fired in update function
        boolcheck = true;
        timecheck = game.time.now;

        // end rowan helathbar
    },
    throwProjectileToObj: function (obj1, obj2, speed) {
        if (typeof speed === 'undefined') { speed = 60; }
        var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
        obj1.body.rotation = angle + game.math.degToRad(-20);  // correct angle of angry bullets (depends on the sprite used)
        obj1.body.velocity.x = Math.cos(angle) * speed;    // accelerateToObject 
        obj1.body.velocity.y = Math.sin(angle) * speed;
    }

}
// rowanrageface
    function delayBetweenHeads() {
        trumphead.visible = false;
        trumprage.visible = true;

        if (game.time.now - timecheck > 1500)
        {
            trumphead.visible = true;
            trumprage.visible = false;;
            boolcheck = false;
        }


    }
// end rowan rageface
