ig.module(    'game.entities.skeleton')
.requires(    'impact.entity')
.defines(function()
{
    EntitySkeleton = ig.Entity.extend({
        
        animSheet: new ig.AnimationSheet( 'media/Enemy_1.png', 14, 22 ),
		size: {x: 10, y:17},
		offset: {x:2, y:3},
		flip: false,
		maxVel: {x:800, y:140},
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
            try{
                this.healthBar = ig.game.spawnEntity(EntityHealthBar, this.pos.x, this.pos.y);
            }
            catch(err){
                console.error(err);
            }
        },
        receiveDamage: function(value)
        {
            this.parent(value);
            this.healthBar.visibleTimer.reset();
            if(this.health > 0)
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y,           {particles: 2, colorOffset: 1});
        },
        kill: function()
        {
            this.parent();
            this.healthBar.kill();
        },
        update: function() {
             this.healthBar.move( this.pos.x, this.pos.y);
            if(this.health > 90)
                this.healthBar.currentAnim = this.healthBar.anims.hundo;
            else if(this.health <= 90 && this.health > 80)
                this.healthBar.currentAnim = this.healthBar.anims.ninety;
            else if(this.health <= 80 && this.health > 70)
                this.healthBar.currentAnim = this.healthBar.anims.eighty;
            else if(this.health <= 70 && this.health > 60)
                this.healthBar.currentAnim = this.healthBar.anims.seventy;
            else if(this.health <= 60 && this.health > 50)
                this.healthBar.currentAnim = this.healthBar.anims.sixty;
            else if(this.health <= 50 && this.health > 40)
                this.healthBar.currentAnim = this.healthBar.anims.fifty;
            else if(this.health <= 40 && this.health > 30)
                this.healthBar.currentAnim = this.healthBar.anims.fourty;
            else if(this.health <= 30 && this.health > 20)
                this.healthBar.currentAnim = this.healthBar.anims.thirty;
            else if(this.health <= 20 && this.health > 10)
                this.healthBar.currentAnim = this.healthBar.anims.twenty;
            else if(this.health <= 10 && this.health > 0)
                this.healthBar.currentAnim = this.healthBar.anims.ten;
            else
                this.healthBar.currentAnim = this.healthBar.anims.zero;
             
        // near an edge? return!
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
            // collision with a wall? return!
            if( res.collision.x ) {
                  this.flip = !this.flip;
            }
        },
        
        check: function( other ) {
            if( other.invincible )
            {
                this.vel.y = -this.maxVel.y;
                this.vel.x = other.vel.x + this.maxVel.x;
                this.speed = -100;
            }
            other.receiveDamage( 10, this );
        }
        
    });

});