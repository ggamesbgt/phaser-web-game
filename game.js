const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
let player;
let cursors;
let bullets;
let enemies;
let lastFired = 0;
let score = 0;
let scoreText;

function preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/blaster.png');
    this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullets/bullet7.png');
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/ufo.png');
}

function create() {
    player = this.physics.add.sprite(240, 580, 'player').setCollideWorldBounds(true);
    bullets = this.physics.add.group({ defaultKey: 'bullet' });
    enemies = this.physics.add.group();
    scoreText = this.add.text(10, 10, 'Score: 0', { font: '20px Arial', fill: '#fff' });

    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', () => {
        fireBullet.call(this);
    });

    this.time.addEvent({ delay: 1000, callback: spawnEnemy, callbackScope: this, loop: true });
    this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
}

function update() {
    if (cursors.left.isDown) player.setVelocityX(-200);
    else if (cursors.right.isDown) player.setVelocityX(200);
    else player.setVelocityX(0);
}

function fireBullet() {
    if (this.time.now > lastFired) {
        let bullet = bullets.create(player.x, player.y - 20, 'bullet');
        bullet.setVelocityY(-300);
        lastFired = this.time.now + 200;
    }
}

function spawnEnemy() {
    let x = Phaser.Math.Between(50, 430);
    let enemy = enemies.create(x, 0, 'enemy');
    enemy.setVelocityY(100);
}

function hitEnemy(bullet, enemy) {
    bullet.destroy();
    enemy.destroy();
    score += 10;
    scoreText.setText('Score: ' + score);
}
