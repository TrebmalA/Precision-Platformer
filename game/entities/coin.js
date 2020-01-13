ig.module( 'game.entities.coin' )
.requires( 'impact.entity' )
.defines ( function()
{
	EntityCoin = ig.Entity.extend(
	{
        
        animSheet: new ig.AnimationSheet( 'media/JumpCoin.png', 11, 13 ),
		size: {x: 7, y:9},
		offset: {x:2, y:2},
        maxVel: {x: 0, y:0},
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        
         //Respawning
        startPosition: null,
        invincible: false,
        invincibleDelay: 1.2, 
        invincibleTimer: null,
        
        update: function()
        {
          if( this.invincibleTimer.delta() > this.invincibleDelay )
          {
              this.invincible = false;
              this.currentAnim.alpha = 1;
          }  
            this.parent();
        },
        check: function( other )
        {
            if(!this.invincible)
            {
                other.doubleJump = true;
                this.makeInvincible();
            }
        },
        init: function( x, y, settings )
        {
            this.gravityFactor = 0;
            this.parent( x, y, settings );
            this.addAnim( 'idle', .2, [0,1,2,3,4,5,6]);
            this.invincibleTimer = new ig.Timer();
        },
        makeInvincible: function()
        {
            this.invincible = true;
            this.invincibleTimer.reset();
        },
        receiveDamage: function(value)
        {
            return;
            this.parent( value );
        },
        draw: function()
        {
            if(this.invincible)
                this.currentAnim.alpha = 0;
            this.parent();
        } 
     });
});