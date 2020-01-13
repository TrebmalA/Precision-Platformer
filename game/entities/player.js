ig.module( 'game.entities.player' )
.requires( 'impact.entity' )
.defines ( function()
{
	EntityPlayer = ig.Entity.extend(
	{
        //Animations
		animSheet: new ig.AnimationSheet( 'media/Char.png', 22, 24 ),
		size: {x: 12, y:19},
		offset: {x:5, y:3},
		flip: false,
        
        //Physical Properties
        maxVel: {x: 232, y: 400},
        friction: {x: 600, y:0},
        accelGround: 200,
        accelAir: 200,
        jump: 280,
        run: 116,
        sprint: 180,
        slide: 150,
        doubleJump: true,
        sliding: false,
        nearDeath: false,
        health: 100,
        healthBar: null,
        type: ig.Entity.TYPE.A,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.PASSIVE,
        attacking: false,
        
        //Respawning
        startPosition: null,
        invincible: false,
        invincibleDelay: .3, 
        invincibleTimer: null,
        
        
        init: function(x, y, settings)
		{
            this.startPosition = {x:x,y:y};
			this.parent( x,y, settings );
			this.addAnim( 'idle', 1, [0] );
			this.addAnim( 'run', 0.04, [0,1,2,3] );
			this.addAnim( 'jump', 1, [4] );
			this.addAnim( 'fall', 0.4, [5] );
            this.addAnim( 'punch', .12, [6,7,8,9,10,11], true);
            this.addAnim( 'slide', 1, [12]);
            
            this.invincibleTimer = new ig.Timer();
            this.makeInvincible();
            try{
                this.healthBar = ig.game.spawnEntity(EntityHealthBar, this.pos.x, this.pos.y);
            }
            catch(err){
                console.error(err);
            }
		},
         makeInvincible: function()
        {
          this.invincible = true;
          this.invincibleTimer.reset();
        },
        receiveDamage: function( amount, from )
        {
            if(this.invincible || this.attacking)
            {
                if(this.attacking)
                    from.receiveDamage(10, this)
                return;
            }
            this.parent(amount, from);
            this.healthBar.visibleTimer.reset();
            
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
            
            if(this.health > 0)
                ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y,           {particles: 2, colorOffset: 0});
        },
        kill: function()
        {
            this.healthBar.kill();
            this.parent();
            var x = this.startPosition.x;    var y = this.startPosition.y;    ig.game.spawnEntity(EntityDeathExplosion, this.pos.x, this.pos.y,    {callBack:function(){ig.game.spawnEntity( EntityPlayer, x, y)}} );
        }, 
        update: function()
        {
            var accel = this.standing ? this.accelGround : this.accelAir;
            this.healthBar.move( this.pos.x, this.pos.y);
//--------------------------------------------  
            //Input Handling
//--------------------------------------------
            
            //Sprinting
            if( ig.input.state('sprint'))
            {
                this.maxVel.x = this.sprint;
            }
            else{
                this.maxVel.x = this.run;
            }
            
            //While on the ground
            if( this.standing)
            {   
                this.doubleJump = true;
                //Running
                if( ig.input.state('right'))
                {
                        this.vel.x = this.maxVel.x;
                        this.flip = false;
                }
                else if( ig.input.state('left'))
                {
                        this.vel.x = -this.maxVel.x;
                        this.flip = true;
                }
                //idling
                else{
                    this.vel.x = 0;
                }
                
                if( ig.input.pressed('attack'))
                {
                    this.attacking = true;
                    this.anims.punch.gotoFrame(0);
                }
                //Jumping
                if(ig.input.pressed('jump'))
                {
                    this.vel.y = -this.jump;
                }
            }
            //While airborn
            else
            {
                //Double Jump
                if(ig.input.pressed('jump') && this.doubleJump)
                {
                    this.vel.y = -this.jump;
                    this.doubleJump = false;
                }
                if( ig.input.state('right'))
                {
                    this.vel.x = this.maxVel.x;
                    this.flip = false;
                }
                else if( ig.input.state('left'))
                {
                    this.vel.x = -this.maxVel.x;
                    this.flip = true;
                }
                else
                    this.vel.x = 0;
            }
            //Shooting and grenades
            if( ig.input.pressed('shoot'))
            {
                ig.game.spawnEntity(EntityBullet, this.pos.x, this.pos.y, {flip:this.flip});
            }
            else if( ig.input.pressed('grenade'))
            {
                ig.game.spawnEntity(EntityGrenade, this.pos.x, this.pos.y, {flip:this.flip});
            }

            
//--------------------------------------------
            //Animations
//--------------------------------------------
            // set the current animation, based on the player's speed 
            if( this.vel.y < 0)
                this.currentAnim = this.anims.jump;
            else if( this.vel.y > 0 && !this.sliding)
                this.currentAnim = this.anims.fall;
            else if(this.attacking)
            {
                this.invincible = true;
                this.currentAnim = this.anims.punch;
                if(this.currentAnim.frame > 2)
                    this.vel.x = this.flip ? -400: 400;
               if(this.currentAnim.frame == 5)
                {
                   this.attacking = false;
                    this.makeInvincible();
                }
            }    
            else if( this.vel.x != 0 && !this.attacking)
                this.currentAnim = this.anims.run;
            else
                this.currentAnim = this.anims.idle; 
            if(!this.sliding)
                this.currentAnim.flip.x = this.flip;
            
            if( this.invincibleTimer.delta() > this.invincibleDelay && !this.attacking)
                this.invincible = false;    this.currentAnim.alpha = 1;
            this.parent();
        },
        draw: function()
        {
           /* if(this.invincible)
                this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1 ;
            */
             this.parent(); 
        }, 
//--------------------------------------------
            //Collisions
//--------------------------------------------  
        //Sliding on walls
        handleMovementTrace: function( res ) {
            this.parent( res );
            // collision with a wall? return!
            if( res.collision.x && ig.input.state('left'))
            {
                this.sliding = true;
                this.currentAnim = this.anims.slide;
                this.currentAnim.flip.x = false;
                this.maxVel.y = this.slide;
            }
            else if( res.collision.x && ig.input.state('right'))
            {
                this.sliding = true;
                this.currentAnim = this.anims.slide;
                this.currentAnim.flip.x = true;
                this.maxVel.y = this.slide;
            }
            else
            {
                this.maxVel.y = 400;
                this.sliding = false
            }
        },
        //If we are on a wall we slide
        isSliding: function()
        {
            this.sliding = true;
        }
	});
//--------------------------------------------
            //Shooting
//--------------------------------------------  

    EntityBullet = ig.Entity.extend({
        size: {x:5, y:3},
        animSheet: new ig.AnimationSheet( 'media/Bullet.png', 5,3 ),
        maxVel: {x: 250, y:0},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.B,
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        init: function( x, y, settings )
        {
            this.parent( x + (settings.flip ? 7: 3) , y+9, settings);
            this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.addAnim( 'idle', 0.2, [0]);
        },
        handleMovementTrace: function( res )
        {
            this.parent( res );
            if( res.collision.x || res.collision.y )
                this.kill();
        },
        check: function( other )
        {
            other.receiveDamage( 20, this );
            this.kill();
        } 
        
    });
    
//--------------------------------------------
            //Grenade
//--------------------------------------------  
    EntityGrenade = ig.Entity.extend({
        animSheet: new ig.AnimationSheet( 'media/Grenade.png', 12, 12 ),
        size: {x:6, y:6},
        offset: {x:3, y:3},
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.BOTH,
        collides: ig.Entity.COLLIDES.PASSIVE,
        
        //Physicals
        maxVel: {x: 300, y: 500},
        bounciness: 0.6,
        bounceCounter: 0,
        
        init: function( x, y, settings )
        {
            this.parent( x + (settings.flip ? -8 : 12), y, settings );
            this.vel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
            this.vel.y = -(50 + (Math.random()*200));
            this.addAnim( 'idle', 0.2, [0.1]);
        },
        
        handleMovementTrace: function( res )
        {
            this.parent( res );
            if( res.collision.x || res.collision.y )
            {
                this.bounceCounter++;
                if( this.bounceCounter > 3)
                    this.kill();
            }
        },
        
        check: function( other )
        {
            other.receiveDamage( 60, this );
            this.kill();
        },
        kill: function()
        {
            for(var i = 0; i < 20; i++)        ig.game.spawnEntity(EntityGrenadeParticle, this.pos.x, this.pos.y);    this.parent();
        }
    });
    
    EntityGrenadeParticle = ig.Entity.extend({
        size: {x: 2, y: 2},
        maxVel: {x: 160, y: 800},
        lifetime: 1,
        fadetime: 1,
        bounciness: 0.3,
        vel: {x: 40, y: 100},
        friction: {x:20, y: 20},
        collides: ig.Entity.COLLIDES.LITE,
        animSheet: new ig.AnimationSheet( 'media/Explosion.png', 2, 2 ),
        
        
        init: function( x, y, settings )
        {
            this.parent( x, y, settings );
            this.vel.x = (Math.random() * 4 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 10 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
            var frameID = Math.round(Math.random()*7);
            this.addAnim( 'idle', 0.2, [frameID] );
        },
        update: function()
        {
            if( this.idleTimer.delta() > this.lifetime )
            {
                this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });
    
//--------------------------------------------
            //Blood
//--------------------------------------------  
    EntityDeathExplosion = ig.Entity.extend(
    {
        lifetime: 1,
        callBack: null,
        particles: 50,
        
        init: function( x, y, settings )
        {
            this.parent( x, y, settings );
            for(var i = 0; i < this.particles; i++)
                ig.game.spawnEntity(EntityDeathExplosionParticle, x, y,{colorOffset: settings.colorOffset ? settings.colorOffset : 0});
            this.idleTimer = new ig.Timer();
        },
        update: function()
        {
            if( this.idleTimer.delta() > this.lifetime )
            {
                this.kill();
                if(this.callBack)
                    this.callBack();
                return;
            }
        } 
    });
    
    EntityHealthBar = ig.Entity.extend(
    {
        animSheet: new ig.AnimationSheet( 'media/HealthBar.png',10,2),
        visibleTimer: null,
        visibleDelay: 1, 
        
        init: function( x, y, settings )
        {
            this.parent( x, y, settings );
            this.addAnim( 'zero', 1, [0]);
            this.addAnim( 'ten', 1, [1]);
            this.addAnim( 'twenty', 1, [2]);
            this.addAnim( 'thirty', 1, [3]);
            this.addAnim( 'fourty', 1, [4]);
            this.addAnim( 'fifty', 1, [5]);
            this.addAnim( 'sixty', 1, [6]);
            this.addAnim( 'seventy', 1, [7]);
            this.addAnim( 'eighty', 1, [8]);
            this.addAnim( 'ninety', 1, [9]);
            this.addAnim( 'hundo', 1, [10]);
            this.visibleTimer = new ig.Timer();
        },
        
        update: function(){},
        
        draw: function()
        {
            if( this.visibleTimer.delta() > this.visibleDelay )
                this.currentAnim.alpha = 0;  
             this.parent(); 
        },
        
        move: function( x, y )
        {
            this.pos.x = x+1;
            this.pos.y = y-4;
        }
        
    });
    
    EntityDeathExplosionParticle = ig.Entity.extend({
        size: {x: 1, y: 1},
        maxVel: {x: 160, y: 200},
        lifetime: 2,
        fadetime: 1,
        bounciness: 0,
        vel: {x: 100, y: 30},
        friction: {x:100, y: 0},
        collides: ig.Entity.COLLIDES.LITE,
        colorOffset: 0,
        totalColors: 8,
        animSheet: new ig.AnimationSheet( 'media/Blood.png', 1, 1 ),
        
        init: function( x, y, settings )
        {
            this.parent( x, y, settings );
            var frameID = Math.round(Math.random()*this.totalColors) +         (this.colorOffset * (this.totalColors+1));
            this.addAnim( 'idle', 0.2, [frameID] );
            this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
            this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
            this.idleTimer = new ig.Timer();
        },
        update: function()
        {
            if( this.idleTimer.delta() > this.lifetime )
            {
                    this.kill();
                return;
            }
            this.currentAnim.alpha = this.idleTimer.delta().map(
                this.lifetime - this.fadetime, this.lifetime,
                1, 0
            );
            this.parent();
        }
    });

});




























