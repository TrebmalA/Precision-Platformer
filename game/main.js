ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
    'game.levels.0',
    'game.levels.1',
    'game.levels.2',
    'game.levels.3',
	'impact.font'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	//Font
	font: new ig.Font( 'media/04b03.font.png' ),
    
    //Gravity
    gravity: 1000,
    

    livesText: new ig.Font( 'media/04b03.font.png' ), 
    livesImage: new ig.Image( 'media/lives.png' ),
    lives: 100,
    dead: false,
    currLevel: null,
    
	
	init: function() {
		this.loadLevel( Level0 );       
		// KeyBinds
		ig.input.bind( ig.KEY.A,              'left'      );
		ig.input.bind( ig.KEY.D,              'right'     );
		ig.input.bind( ig.KEY.SPACE,          'jump'      );
        ig.input.bind( ig.KEY.SHIFT,          'sprint'    );
		ig.input.bind( ig.KEY.MOUSE1,         'shoot'     );
        ig.input.bind( ig.KEY.MOUSE2,         'grenade'   );
        ig.input.bind( ig.KEY.F,              'attack'    );
        ig.system.scale = 2;
	},
	
    loadLevel: function( level )
    {
        this.currLevel = level;
        this.parent( level );
    },
    
	update: function() {
    
       /* var player = this.getEntitiesByType( EntityPlayer )[0];
        if( player ) 
        {
            if(player.pos.x - ig.system.width/2 >= 0)
              this.screen.x = player.pos.x - ig.system.width/2;
            else
                this.screen.x = 0;
            if(player.pos.y - ig.system.height/2 >= 0)
              this.screen.y = player.pos.y - ig.system.height/2;
            else
                this.screen.y = 0;
            if(player.pos.x + ig.system.width/2 >= ig.system.width)
                this.screen.x = ig.system.width - ig.system.width;
            if(player.pos.y + ig.system.height/2 >= ig.system.height)
                this.screen.y = ig.system.height - ig.system.height;
        }*/
        // screen follows the player
        var player = this.getEntitiesByType( EntityPlayer )[0];
        if( player )
        {
            if(this.dead)
            {
                console.log(this.lives);
                console.log("called");
                this.lives  = this.lives - 1;
                this.dead = false;
                console.log(this.lives);
            }
            if( player.pos.x <= ig.system.width/2 )
                this.screen.x = 0;
            else if( player.pos.x <= (1920) - ig.system.width/2)
              this.screen.x =  player.pos.x - ig.system.width/2;
            else
                this.screen.x = (1920)-ig.system.width;
            if( player.pos.y <= ig.system.height/2 )
                this.screen.y = 0;
            else if( player.pos.y <= (720) - ig.system.height/2)
              this.screen.y = player.pos.y - ig.system.height/2;
            else
                this.screen.y = (720)-ig.system.height;
            
        }
        else
        {
            this.dead = true;
            if(this.lives == 0)
            {
                ig.game.loadLevelDeferred( Level1 );
                this.lives = 101;
            }
                //this.loadLevel(currentLevel);
        }
        
       
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		// Add your own drawing code here
        var player = this.getEntitiesByType( EntityPlayer )[0];
        if( player )
        {
            var x = 5,
                y = 5;
            var lives = 'x'+this.lives;
            this.livesImage.draw( x, y );
            this.livesText.draw( lives, x+9, y +1, ig.Font.ALIGN.LEFT );
        }
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 480, 360, 2 );

});
