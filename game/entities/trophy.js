ig.module( 'game.entities.trophy' )
.requires( 'impact.entity' )
.defines ( function()
{
    EntityTrophy = ig.Entity.extend(
	   {
        
            animSheet: new ig.AnimationSheet( 'media/Trophy.png', 16, 19 ),
            size: {x: 16, y:19},
            offset: {x:0, y:0},
            checkAgainst: ig.Entity.TYPE.A,   
            level: null,
           
            kill: function()
            {
                return;  
            },
            init: function( x, y, settings )
            {
                this.parent( x, y, settings );
                this.addAnim( 'idle', 1, [0]);
                this.level = 0;
            },
           check: function( other )
           {
                if(other instanceof EntityPlayer)
                {
                        ig.game.loadLevelDeferred( ig.global['Level0']);
                }
           },
           //update: function(){}
         });

    });