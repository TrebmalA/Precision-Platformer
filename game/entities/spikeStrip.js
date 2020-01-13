ig.module( 'game.entities.spikeStrip' )
.requires( 'impact.entity' )
.defines ( function()
{
	EntitySpikeStrip = ig.Entity.extend(
	{
        
        _wmDrawBox: true,
        _wmBoxColor: 'red',
        _wmScalable: true,
        checkAgainst: ig.Entity.TYPE.A,
        
        update: function(){},
        
        check: function( other )
        {
            other.kill();
            console.log("killed by spikes");
        },
     });
});