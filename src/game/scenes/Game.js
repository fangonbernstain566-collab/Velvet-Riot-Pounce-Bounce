import { Scene, Input, Math } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const { width, height } = this.scale;

        // Sky blue background
        this.cameras.main.setBackgroundColor(0x87CEEB);

        // Green grass at bottom
        this.add.rectangle(width / 2, height - 20, width, 40, 0x22AA22);

        // Player
        this.player = this.add.rectangle(width / 2, height - 40, 30, 30, 0x0000ff);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        // Bullets group
        this.bullets = this.physics.add.group();

        // Enemies group
        this.enemies = this.physics.add.group();

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);

        // Score
        this.score = 0;
        this.scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '16px', fill: '#000' });

        // Wave counter
        this.waveNumber = 0;
        this.waveText = this.add.text(width / 2, 10, 'Wave: 0', { fontSize: '16px', fill: '#000' });
        this.waveText.setOrigin(0.5, 0);

        // Store bounds for update loop
        this.gameWidth = width;
        this.gameHeight = height;

        // Wave timer
        this.waveTimer = this.time.addEvent({
            delay: 3000,
            callback: this.spawnWave,
            callbackScope: this,
            loop: true
        });

        // Collision
        this.physics.add.overlap(this.bullets, this.enemies, this.hitEnemy, null, this);
    }

    update ()
    {
        // Player movement
        if (this.cursors.left.isDown) {
            this.player.x -= 5;
        } else if (this.cursors.right.isDown) {
            this.player.x += 5;
        }

        // Shooting
        if (Input.Keyboard.JustDown(this.spaceKey)) {
            this.shoot();
        }

        // Check if enemies reach bottom
        this.enemies.children.each((enemy) => {
            if (enemy.y > this.gameHeight - 24) {
                this.scene.start('GameOver');
            }
        });
    }

    shoot ()
    {
        const bullet = this.add.circle(this.player.x, this.player.y - 20, 4, 0xffff00);
        this.physics.add.existing(bullet);
        this.bullets.add(bullet);
        bullet.body.setVelocityY(-300);
    }

    spawnWave ()
    {
        const width = this.gameWidth;
        this.waveNumber++;
        this.waveText.setText('Wave: ' + this.waveNumber);
        
        const enemyCount = 3 + this.waveNumber;
        for (let i = 0; i < enemyCount; i++) {
            const x = Math.Between(20, width - 20);
            const enemy = this.add.circle(x, 0, 12, 0xff0000);
            this.physics.add.existing(enemy);
            this.enemies.add(enemy);
            enemy.body.setVelocityY(90 + (this.waveNumber * 10));
        }
    }

    hitEnemy (bullet, enemy)
    {
        bullet.destroy();
        enemy.destroy();
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
    }
}