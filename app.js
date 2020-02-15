var GameScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
  
    initialize:
  
    function GameScene ()
    {
        Phaser.Scene.call(this, { key: 'gameScene', active: true });
  
        this.player = null;
        this.cursors = null;
        this.score = 0;
        this.scoreText = null;
    },
  
    preload: function ()
    {
        
        this.load.image('spike','assets/tri.png');
        this.load.image('door','assets/door.png');
        this.load.image('cactus','assets/cactus.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('fullscreen', 'assets/fullscreen.png', { frameWidth: 64, frameHeight: 64 });
    },
    
    create: function ()
    {
        
        this.add.image(400, 300, 'sky');
        this.cactus = this.physics.add.staticGroup();
        var door = this.physics.add.staticGroup();
        var platforms = this.physics.add.staticGroup();
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.cactus.create(400, 505, 'cactus');
        this.cactus.width = 70;
        this.cactus.height = 70;
       
  
        var player = this.physics.add.sprite(100, 450, 'dude');
        
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
  
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
  
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
  
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
  
        this.cursors = this.input.keyboard.createCursorKeys();
  
        var stars = this.physics.add.group({

        });
  
        stars.children.iterate(function (child) {
  
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  
        });
  
        this.scoreText = this.add.text(25, 25, 'score: 0', { fontSize: '32px', fill: '#fff' });
        
        this.physics.add.collider(player, platforms);
        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, door, this.enterDoor, null, this);
        this.physics.add.overlap(player, stars, this.collectStar, null, this);
        
        this.player = player;
  
        var button = this.add.image(800-16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();
  
        button.on('pointerup', function () {
  
            if (this.scale.isFullscreen)
            {
                button.setFrame(0);
  
                this.scale.stopFullscreen();
            }
            else
            {
                button.setFrame(1);
  
                this.scale.startFullscreen();
            }
  
        }, this);
  
        this.scoreText.setText('ALIVE');
  
        var FKey = this.input.keyboard.addKey('F');
  
        FKey.on('down', function () {
  
            if (this.scale.isFullscreen)
            {
                button.setFrame(0);
                this.scale.stopFullscreen();
            }
            else
            {
                button.setFrame(1);
                this.scale.startFullscreen();
            }
  
        }, this);
    },
  
    update: function (time)
    {
        this.cactus.setVelocityx = -20;
           
      
        var cursors = this.cursors;
        var player = this.player;
  
        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-100);
        }
    
        score =+ Math.round(time /100);
        this.scoreText.setText('Score: ' + score);
        player.update(time);
    },
  
    collectStar: function (player, star)
    {
        star.disableBody(true, true);
  
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    },
  
    enterDoor: function (player, door)
    {
        player.disableBody(true, true);
        this.scoreText.setText('DEAD');
    }
    
 });
  
 var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 800,
        height: 600
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 100 },
            debug: false
        }
    },
    scene: GameScene
 };
  
 var game = new Phaser.Game(config);