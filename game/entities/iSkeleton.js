ig.module(    'game.entities.iSkeleton')
.requires(    'impact.entity')
.defines(function()
{
    EntityISkeleton = ig.Entity.extend({
        
        animSheet: new ig.AnimationSheet( 'media/Enemy_2.png', 14, 22 ),
		size: {x: 10, y:17},
		offset: {x:2, y:3},
		flip: false,
		maxVel: {x:800, y:0},
        friction: {x: 150, y: 0},
        speed: 30,
        type: ig.Entity.TYPE.B,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.ACTIVE,
        health: 100,
        healthBar: null,
        
        init: function( x, y, settings)
        {
            this.parent( x, y, settings);
            this.addAnim('walk', .07, [0,1,2,3,4,5]);
        },
        receiveDamage: function(value)
        {
            return;
            this.parent( value );
        },
        update: function() {
            if( !ig.game.collisionMap.getTile(
                this.pos.x + (this.flip ? 4 : this.size.x -4),
                this.pos.y + this.size.y+1)
            ){
              this.flip = !this.flip;
            }
            var xdir = this.flip ? -1 : 1;
            this.vel.x = this.speed * xdir;
            this.currentAnim.flip.x = this.flip;
            this.parent();
        },
        
        handleMovementTrace: function( res ) {
            this.parent( res );
            if( res.collision.x ) {
                  this.flip = !this.flip;
            }
        },
        
        check: function( other ) {
            other.receiveDamage( 10, this );
        }
        
    });

});