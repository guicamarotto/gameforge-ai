// frontend/src/services/phaser/gameEngine.js

import Phaser from 'phaser';

class GameScene extends Phaser.Scene {

    constructor(gameConfig) {
        super('GameScene');
        this.gameConfig = gameConfig;
    }

    preload() {
        // Futuramente você pode carregar sprites reais aqui
    }

    create() {
        const gameConfig = this.gameConfig;

        if (!gameConfig) {
            console.error("gameConfig não encontrado!", this);
            return;
        }

        // Habilita teclado
        this.input.keyboard.enabled = true;

        // Captura da barra de espaço
        this.spaceKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.SPACE
        );

        // Fundo
        this.add.rectangle(
            400,
            300,
            800,
            600,
            parseInt(gameConfig.backgroundColor.replace('#', '0x'))
        );

        // Player (desenhado dinamicamente)
        const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
        playerGraphics.fillStyle(0xff0000, 1);
        playerGraphics.fillCircle(25, 25, 20);
        playerGraphics.generateTexture('playerTexture', 50, 50);
        playerGraphics.destroy();

        this.player = this.physics.add.sprite(100, 400, 'playerTexture');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);

        // ---------- CHÃO INVISÍVEL -----------
        this.ground = this.physics.add.staticGroup();
        this.ground
            .create(400, 590, null)
            .setDisplaySize(800, 20)
            .setVisible(false)
            .refreshBody();

        this.physics.add.collider(this.player, this.ground);

        // Grupos
        this.obstacles = this.physics.add.group();
        this.collectibles = this.physics.add.group();

        // Score
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#ffffff'
        });

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Configuração da lógica
        this.spawnRate = gameConfig.difficulty.spawnRate;
        this.lastSpawn = 0;
        this.speedMultiplier = 1;
        this.gameActive = true;
    }

    update() {
        const gameConfig = this.gameConfig;
        if (!gameConfig || !this.gameActive) return;

        // ----------------- CONTROLES ------------------

        const isJumpPressed =
            this.cursors.up.isDown || this.spaceKey.isDown;

        if (isJumpPressed && this.player.body.touching.down) {
            this.player.setVelocityY(-400);
        }

        // Movimento lateral
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-150);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(150);
        } else {
            this.player.setVelocityX(0);
        }

        // ----------------- OBJETOS ------------------

        this.obstacles.children.entries.forEach(obs => {
            if (obs.x < -50) {
                obs.destroy();
                this.score += gameConfig.scoring.distancePoints;
                this.scoreText.setText(`Score: ${this.score}`);
            }
        });

        this.collectibles.children.entries.forEach(col => {
            if (col.x < -50) col.destroy();
        });

        // Spawn automático
        const now = this.time.now;
        if (now - this.lastSpawn > this.spawnRate / this.speedMultiplier) {
            this.spawnObstacle(gameConfig);
            this.spawnCollectible(gameConfig);
            this.lastSpawn = now;
            this.speedMultiplier += gameConfig.difficulty.speedIncrement;
        }

        // Colisão com obstáculo → game over
        this.physics.overlap(this.player, this.obstacles, () => {
            this.endGame();
        });

        // Pegou item
        this.physics.overlap(this.player, this.collectibles, (player, collectible) => {
            collectible.destroy();
            this.score += gameConfig.scoring.collectiblePoints;
            this.scoreText.setText(`Score: ${this.score}`);
        });

        // Caiu da tela
        if (this.player.y > 600) {
            this.endGame();
        }
    }

    // ---------------- SPAWN HELPERS ----------------

    spawnObstacle(gameConfig) {
        const y = Math.random() * 400 + 100;

        const g = this.make.graphics({ x: 0, y: 0, add: false });
        g.fillStyle(0xff6600, 1);
        g.fillRect(0, 0, 40, 40);
        g.generateTexture('obstacleTexture', 40, 40);
        g.destroy();

        const obstacle = this.physics.add.sprite(800, y, 'obstacleTexture');
        obstacle.setVelocityX(-gameConfig.physics.obstacleSpeed);
        this.obstacles.add(obstacle);
    }

    spawnCollectible(gameConfig) {
        if (Math.random() > 0.7) {
            const y = Math.random() * 400 + 100;

            const g = this.make.graphics({ x: 0, y: 0, add: false });
            g.fillStyle(0xffff00, 1);
            g.fillCircle(15, 15, 12);
            g.generateTexture('collectibleTexture', 30, 30);
            g.destroy();

            const collectible = this.physics.add.sprite(800, y, 'collectibleTexture');
            collectible.setVelocityX(-gameConfig.physics.obstacleSpeed * 0.8);
            this.collectibles.add(collectible);
        }
    }

    endGame() {
        this.physics.pause();
        this.gameActive = false;

        this.add.text(250, 250, 'Game Over!', { fontSize: '64px', fill: '#ff0000' });
        this.add.text(200, 350, `Final Score: ${this.score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        });
    }
}


// ---------------- INICIAR O JOGO ---------------- //

export const startGame = (gameConfig, containerId) => {
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: gameConfig.physics.gravity },
                debug: false
            }
        },
        scene: new GameScene(gameConfig)
    });
};