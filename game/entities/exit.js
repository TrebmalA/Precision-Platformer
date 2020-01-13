ig.module( 'game.entities.exit' )
.requires( 'impact.entity' )
.defines ( function()
{
	EntityExit = ig.Entity.extend(
	{
        
        animSheet: new ig.AnimationSheet( 'media/Exit.png', 19, 33 ),
		size: {x: 11, y:24},
		offset: {x:3, y:6},
        maxVel: {x: 0, y:0},
        checkAgainst: ig.Entity.TYPE.A,
        level: null,
        
       // update: function(){},
        
        check: function( other )
        {
            if(other instanceof EntityPlayer)
            {
                if( this.level )
                {
                    ig.game.loadLevelDeferred( ig.global['Level'+(this.level)]);
                }
            }
        },
        
        init: function( x, y, settings )
        {
            this.gravityFactor = 0;
            this.parent( x, y, settings );
            this.addAnim( 'idle', .1, [0,1,2,3,4,5,6,7,8]);
        },
     });
});