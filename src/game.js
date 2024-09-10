import Phaser from 'phaser';
class FlappyBird extends Phaser.Scene {
    constructor() {
        super({ key: 'FlappyBird' });
    }

    preload() {
        this.load.image('bird', 'assets/car.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('background', 'assets/background.png');
    }

    create() {
        this.background = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'background').setOrigin(0);
        
        this.bird = this.physics.add.sprite(100, this.scale.height / 2, 'bird');
        this.bird.setCollideWorldBounds(true);
        this.bird.setGravityY(1000);

        this.pipes = this.physics.add.group();
        this.time.addEvent({ delay: 1500, callback: this.spawnPipes, callbackScope: this, loop: true });

        this.input.on('pointerdown', this.flap, this);

        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    update() {
        if (this.bird.y < 0 || this.bird.y > this.scale.height) {
            this.gameOver();
        }

        this.pipes.getChildren().forEach(pipe => {
            if (pipe.x < -pipe.width) {
                pipe.destroy();
            }
        });
    }

    flap() {
        this.bird.setVelocityY(-400);
    }

    spawnPipes() {
        const gap = 150;
        const topPipeHeight = Phaser.Math.Between(50, this.scale.height - gap - 50);
        const bottomPipeY = topPipeHeight + gap;

        const topPipe = this.pipes.create(this.scale.width, topPipeHeight / 2, 'pipe');
        const bottomPipe = this.pipes.create(this.scale.width, bottomPipeY + (this.scale.height - bottomPipeY) / 2, 'pipe');

        topPipe.setOrigin(0.5, 1);
        bottomPipe.setOrigin(0.5, 0);

        topPipe.setVelocityX(-200);
        bottomPipe.setVelocityX(-200);
    }

    gameOver() {
        this.scene.restart();
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [FlappyBird]
};

const game = new Phaser.Game(config);