// game.js (versi revisi)
const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    parent: 'game-container', // penting untuk render di div
    backgroundColor: '#222',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player, cursors, bullets, enemies, lastFired = 0, score = 0, scoreText;

const game = new Phaser.Game(config);

function preload() {
    this.load.image('player', 'https://labs.phaser.io/assets/sprites/phaser-dude.png');
    this.load.image('bullet', 'https://labs.phaser.io/assets/sprites/bullets/bullet7.png');
    this.load.image('enemy', 'https://labs.phaser.io/assets/sprites/ufo.png');
}

function create() {
    player = this.physics.add.sprite(240, 580, 'player').setCollideWorldBounds(true);

    bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 20
    });

    enemies = this.physics.add.group();

    scoreText = this.add.text(10, 10, 'Score: 0', { fontSize: '20px', fill: '#fff' });

    cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown-SPACE', () => {
        fireBullet.call(this);
    });

    this.time.addEvent({
        delay: 1000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });

    this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }

    bullets.children.iterate(function (bullet) {
        if (bullet && bullet.y < 0) {
            bullets.killAndHide(bullet);
            bullet.body.enable = false;
        }
    });
}

function fireBullet() {
    if (this.time.now > lastFired) {
        let bullet = bullets.get(player.x, player.y - 20);
        if (bullet) {
            bullet.enableBody(true, player.x, player.y - 20, true, true);
            bullet.setVelocityY(-300);
            lastFired = this.time.now + 300;
        }
    }
}

function spawnEnemy() {
    let x = Phaser.Math.Between(50, 430);
    let enemy = enemies.create(x, 0, 'enemy');
    enemy.setVelocityY(100);
}

function hitEnemy(bullet, enemy) {
    bullet.disableBody(true, true);
    enemy.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);
}
