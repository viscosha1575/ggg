// Пример динамического импорта
import(/* webpackChunkName: "phaser" */ 'phaser').then(module => {
    const Phaser = module.default;
    // Теперь вы можете использовать Phaser
  });

class FlappyBird extends Phaser.Scene {
    constructor() {
        super({ key: 'FlappyBird' });
    }

    preload() {
        this.load.image('bird1', 'assets/car.png');
        this.load.image('bird2', 'assets/car_02.png');
        this.load.image('bird3', 'assets/car_03.png');
        this.load.image('bird4', 'assets/car_04.png');
        this.load.image('pipe', 'assets/pipe.png');
        this.load.image('background', 'assets/background.png');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
    
        this.background = this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0);
    
        // Создание спрайта птицы с первым кадром анимации
        this.bird = this.physics.add.sprite(100, height / 2, 'bird1');
        this.bird.setCollideWorldBounds(true);
        this.bird.setGravityY(1000);
    
        // Создание анимации для птицы
        this.anims.create({
            key: 'flap',  // Имя анимации
            frames: [
                { key: 'bird1' },
                { key: 'bird2' },
                { key: 'bird3' },
                { key: 'bird4' }
            ],
            frameRate: 10,  // Скорость анимации (кадров в секунду)
            repeat: -1  // Бесконечный повтор
        });
        this.time.addEvent({
            delay: 2000,  // Увеличиваем время задержки между спавном новых труб
            callback: this.spawnPipes,
            callbackScope: this,
            loop: true
        });
        // Запуск анимации
        this.bird.play('flap');
    
        this.pipes = this.physics.add.group();
        //this.time.addEvent({ delay: 1500, callback: this.spawnPipes, callbackScope: this, loop: true });
    
        this.input.on('pointerdown', this.flap, this);
    
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }
    update() {
        const height = this.cameras.main.height;

        if (this.bird.y < 0 || this.bird.y > height) {
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
        const minGap = 50;  // Минимальный разрыв для прохода машины
        const maxGap = 80;  // Максимальный разрыв для разнообразия
        const gap = Phaser.Math.Between(minGap, maxGap);  // Случайный разрыв между трубами
    
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
    
        const topPipeHeight = Phaser.Math.Between(50, height - gap - 0);  // Случайная высота верхней трубы
        const bottomPipeY = topPipeHeight + gap;  // Расчет положения нижней трубы
    
        // Создание верхней и нижней трубы
        const topPipe = this.pipes.create(width, topPipeHeight / 2, 'pipe');
        const bottomPipe = this.pipes.create(width, bottomPipeY + (height - bottomPipeY) / 2, 'pipe');
    
        // Установка точек привязки и поворота для труб
        topPipe.setOrigin(0.5, 1);
        topPipe.setFlipY(true);  // Поворот верхней трубы на 180 градусов
        bottomPipe.setOrigin(0.5, 0);
    
        topPipe.setVelocityX(-500);  // Скорость движения труб по горизонтали
        bottomPipe.setVelocityX(-500);
    }
   

    gameOver() {
        this.scene.restart();
    }
}

// Добавьте конфигурацию Phaser в конце скрипта
const config = {
    type: Phaser.AUTO,
    width: Math.min(window.innerWidth, 1080),  // Ограничение ширины для смартфонов
    height: Math.max(window.innerHeight, 1600), // Высота под смартфон
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT, // Масштабирование по размеру экрана
        autoCenter: Phaser.Scale.CENTER_BOTH, // Центрирование игры по центру экрана
    },
    scene: [FlappyBird]
};

const game = new Phaser.Game(config);