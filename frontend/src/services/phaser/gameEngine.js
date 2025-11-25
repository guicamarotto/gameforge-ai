import Phaser from 'phaser';

export const createGameConfig = (gameConfig, containerId = 'game-container') => {
  const config = {
    type: Phaser.AUTO,
    parent: containerId,
    width: 800,
    height: 600,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: gameConfig.physics.gravity },
        debug: false,
      },
    },
    scene: {
      preload: preload,
      create: create,
      update: update,
      data: { gameConfig }, // ✅ Passar gameConfig aqui
    },
  };

  return config;
};

const preload = function () {
  // Assets carregados aqui
};

const create = function () {
  // ✅ Acessar gameConfig dos dados da scene
  const gameConfig = this.scene.get(this.scene.key).data.get('gameConfig');
  
  if (!gameConfig) {
    console.error('gameConfig não encontrado!', this.scene.key, this.data);
    return;
  }

  this.add.rectangle(
    400,
    300,
    800,
    600,
    parseInt(gameConfig.backgroundColor.replace('#', '0x'))
  );

  const playerGraphics = this.make.graphics({ x: 0, y: 0, add: false });
  playerGraphics.fillStyle(0xff0000, 1);
  playerGraphics.fillCircle(25, 25, 20);
  playerGraphics.generateTexture('playerTexture', 50, 50);
  playerGraphics.destroy();

  this.player = this.physics.add.sprite(100, 400, 'playerTexture');
  this.player.setBounce(0.2);
  this.player.setCollideWorldBounds(true);

  this.obstacles = this.physics.add.group();
  this.collectibles = this.physics.add.group();

  this.score = 0;
  this.scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fill: '#ffffff',
  });

  this.cursors = this.input.keyboard.createCursorKeys();
  this.input.keyboard.on('keydown-SPACE', () => {
    if (this.player.body.touching.down) {
      this.player.setVelocityY(-400);
    }
  });

  this.spawnRate = gameConfig.difficulty.spawnRate;
  this.lastSpawn = 0;
  this.gameSpeed = gameConfig.physics.obstacleSpeed;
  this.speedMultiplier = 1;
  this.gameConfig = gameConfig;
  this.gameActive = true;
};

const update = function () {
  const gameConfig = this.gameConfig;

  if (!this.gameActive) return;

  this.obstacles.children.entries.forEach((obs) => {
    if (obs.x < -50) {
      obs.destroy();
      this.score += gameConfig.scoring.distancePoints;
      this.scoreText.setText(`Score: ${this.score}`);
    }
  });

  this.collectibles.children.entries.forEach((col) => {
    if (col.x < -50) {
      col.destroy();
    }
  });

  const now = this.time.now;
  if (now - this.lastSpawn > this.spawnRate / this.speedMultiplier) {
    spawnObstacle.call(this, gameConfig);
    spawnCollectible.call(this, gameConfig);
    this.lastSpawn = now;
    this.speedMultiplier += gameConfig.difficulty.speedIncrement;
  }

  this.physics.overlap(
    this.player,
    this.obstacles,
    () => {
      this.physics.pause();
      this.gameActive = false;
      this.add.text(250, 250, 'Game Over!', { fontSize: '64px', fill: '#ff0000' });
      this.add.text(200, 350, `Final Score: ${this.score}`, {
        fontSize: '32px',
        fill: '#ffffff',
      });
    }
  );

  this.physics.overlap(
    this.player,
    this.collectibles,
    (player, collectible) => {
      collectible.destroy();
      this.score += gameConfig.scoring.collectiblePoints;
      this.scoreText.setText(`Score: ${this.score}`);
    }
  );

  if (this.player.y > 600) {
    this.physics.pause();
    this.gameActive = false;
    this.add.text(250, 250, 'Game Over!', { fontSize: '64px', fill: '#ff0000' });
    this.add.text(200, 350, `Final Score: ${this.score}`, {
      fontSize: '32px',
      fill: '#ffffff',
    });
  }
};

const spawnObstacle = function (gameConfig) {
  const obstacleType = gameConfig.obstacles[Math.floor(Math.random() * gameConfig.obstacles.length)];
  const y = Math.random() * 400 + 100;
  
  const obsGraphics = this.make.graphics({ x: 0, y: 0, add: false });
  obsGraphics.fillStyle(0xff6600, 1);
  obsGraphics.fillRect(0, 0, 40, 40);
  obsGraphics.generateTexture('obstacleTexture', 40, 40);
  obsGraphics.destroy();

  const obstacle = this.physics.add.sprite(800, y, 'obstacleTexture');
  obstacle.setVelocityX(-gameConfig.physics.obstacleSpeed);
  this.obstacles.add(obstacle);
};

const spawnCollectible = function (gameConfig) {
  if (Math.random() > 0.7) {
    const y = Math.random() * 400 + 100;
    
    const colGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    colGraphics.fillStyle(0xffff00, 1);
    colGraphics.fillCircle(15, 15, 12);
    colGraphics.generateTexture('collectibleTexture', 30, 30);
    colGraphics.destroy();

    const collectible = this.physics.add.sprite(800, y, 'collectibleTexture');
    collectible.setVelocityX(-gameConfig.physics.obstacleSpeed * 0.8);
    this.collectibles.add(collectible);
  }
};

export const startGame = (gameConfig, containerId = 'game-container') => {
  const config = createGameConfig(gameConfig, containerId);
  return new Phaser.Game(config);
};
