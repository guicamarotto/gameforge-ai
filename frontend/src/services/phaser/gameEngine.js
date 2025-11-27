import Phaser from 'phaser';

class GameScene extends Phaser.Scene {

    constructor(gameConfig) {
        super('GameScene');
        this.gameConfig = gameConfig;
    }

    preload() {
        // Placeholder para assets futuros
    }

    create() {
        // 1. Validação de Segurança
        if (!this.gameConfig) {
            console.error("CRITICAL: gameConfig not found");
            return;
        }

        // 2. Setup de Inputs
        this.input.keyboard.enabled = true;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // 3. Fundo
        const bgColor = parseInt(this.gameConfig.backgroundColor.replace('#', '0x'));
        this.add.rectangle(400, 300, 800, 600, bgColor);

        // 4. GERAÇÃO DE TEXTURAS (Feito apenas uma vez para performance)
        this.generateTextures();

        // 5. Player
        this.player = this.physics.add.sprite(100, 400, 'playerTexture');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        // Ajuste fino da gravidade do player se necessário
        this.player.body.setGravityY(this.gameConfig.physics.gravity || 300);

        // 6. Chão Invisível
        this.ground = this.physics.add.staticGroup();
        this.ground
            .create(400, 590, null)
            .setDisplaySize(800, 20)
            .setVisible(false)
            .refreshBody();

        this.physics.add.collider(this.player, this.ground);

        // 7. Grupos de Objetos
        this.obstacles = this.physics.add.group();
        this.collectibles = this.physics.add.group();

        // 8. UI / Score
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });

        // 9. Variáveis de Controle
        this.spawnRate = this.gameConfig.difficulty.spawnRate || 2000;
        this.lastSpawn = 0;
        this.gameActive = true;
    }

    // Método auxiliar para criar os gráficos
    generateTextures() {
        // Player (Círculo Vermelho)
        if (!this.textures.exists('playerTexture')) {
            const pg = this.make.graphics({ x: 0, y: 0, add: false });
            pg.fillStyle(0xff0000, 1);
            pg.fillCircle(25, 25, 20);
            pg.generateTexture('playerTexture', 50, 50);
            pg.destroy();
        }

        // Obstáculo (Retângulo/Quadrado Laranja)
        if (!this.textures.exists('obstacleTexture')) {
            const og = this.make.graphics({ x: 0, y: 0, add: false });
            og.fillStyle(0xff6600, 1); // Laranja
            og.fillRect(0, 0, 40, 40); // Quadrado 40x40
            og.generateTexture('obstacleTexture', 40, 40);
            og.destroy();
        }

        // Moeda (Círculo Amarelo)
        if (!this.textures.exists('collectibleTexture')) {
            const cg = this.make.graphics({ x: 0, y: 0, add: false });
            cg.fillStyle(0xffff00, 1); // Amarelo
            cg.fillCircle(15, 15, 12);
            cg.generateTexture('collectibleTexture', 30, 30);
            cg.destroy();
        }
    }

    update(time, delta) {
        if (!this.gameActive) return;

        // ----------------- CONTROLES ------------------
        const isJumpPressed = this.cursors.up.isDown || this.spaceKey.isDown;

        // Pulo
        if (isJumpPressed && this.player.body.touching.down) {
            // Usando valor fixo ou config. Se o pulo for 800, a gravidade deve ser alta (~1600)
            this.player.setVelocityY(-800); 
        }

        // Movimento Lateral (Esquerda/Direita)
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
        } else {
            this.player.setVelocityX(0);
        }

        // ----------------- SPAWN LOOP ------------------
        if (time > this.lastSpawn + this.spawnRate) {
            this.spawnObstacle();
            this.spawnCollectible();
            this.lastSpawn = time;
            
            // Aumenta dificuldade levemente (opcional)
            if (this.spawnRate > 500) this.spawnRate -= 10;
        }

        // ----------------- COLISÕES ------------------
        
        // Player bate no obstáculo -> Game Over
        this.physics.overlap(this.player, this.obstacles, () => {
            this.endGame();
        });

        // Player pega moeda
        this.physics.overlap(this.player, this.collectibles, (player, collectible) => {
            collectible.destroy();
            this.score += (this.gameConfig.scoring.collectiblePoints || 10);
            this.scoreText.setText(`Score: ${this.score}`);
        });

        // ----------------- CLEANUP ------------------
        
        // Remove obstáculos que saíram da tela
        this.obstacles.children.each((obs) => {
            if (obs.x < -50) {
                obs.destroy();
                this.score += (this.gameConfig.scoring.distancePoints || 1);
                this.scoreText.setText(`Score: ${this.score}`);
            }
        });

        // Remove moedas que saíram da tela
        this.collectibles.children.each((col) => {
            if (col.x < -50) col.destroy();
        });

        // Caiu no buraco (se houver)
        if (this.player.y > 600) {
            this.endGame();
        }
    }

    spawnObstacle() {
        // Posição Y fixa no chão (590 é o chão, -20 é metade da altura do box 40px)
        const y = 570; 
        
        const obstacle = this.obstacles.create(850, y, 'obstacleTexture');
        
        // Configuração Física CRÍTICA
        obstacle.setVelocityX(-this.gameConfig.physics.obstacleSpeed);
        obstacle.setImmovable(true); // Player não empurra o obstáculo
        obstacle.body.allowGravity = false; // Obstáculo não cai
    }

    spawnCollectible() {
        if (Math.random() > 0.6) { // 40% de chance
            // Altura fixa em 400px como solicitado
            const y = 400; 

            const collectible = this.collectibles.create(850, y, 'collectibleTexture');
            
            collectible.setVelocityX(-this.gameConfig.physics.obstacleSpeed);
            collectible.body.allowGravity = false; 
        }
    }

    endGame() {
        this.physics.pause();
        this.gameActive = false;
        this.player.setTint(0xff0000); // Player fica vermelho

        this.add.text(400, 300, 'GAME OVER', { 
            fontSize: '64px', 
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(400, 380, `Final Score: ${this.score}`, {
            fontSize: '32px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Reiniciar com clique
        this.input.once('pointerdown', () => {
            this.scene.restart();
        });
    }
}

export const startGame = (gameConfig, containerId) => {
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
        width: 800,
        height: 600,
        backgroundColor: gameConfig.backgroundColor,
        physics: {
            default: 'arcade',
            arcade: {
                // Gravidade ajustada para suportar pulo de 800px sem flutuar demais
                gravity: { y: 1600 }, 
                debug: false // Mude para true para ver as caixas de colisão (hitboxes)
            }
        },
        scene: new GameScene(gameConfig)
    });
};