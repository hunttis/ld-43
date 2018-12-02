import { Scene, GameObjects, Input } from 'phaser';
import { Player } from '~/entities/player';
import { MeleeEnemy } from '~/entities/meleeenemy';
import { Bullet } from './entities/bullet';
import { RangedEnemy } from './entities/rangedenemy';
import { Enemy } from './entities/enemy';
import { EnemyAttack } from './entities/enemyAttack';
import { PlayerAttack } from './entities/playerAttack';

export class GameScene extends Scene {

  level!: Phaser.Tilemaps.Tilemap;
  player!: Player;
  bullets!: GameObjects.Group;
  cursors!: Input.Keyboard.CursorKeys;
  layer!: Phaser.Tilemaps.StaticTilemapLayer;
  enemies!: GameObjects.Group;
  enemyBullets!: GameObjects.Group;

  constructor() {
    super('GameScene');
  }

  create() {
    this.createBackground();
    this.level = this.loadAndCreateMap();
    this.bullets = this.add.group();
    this.enemyBullets = this.add.group();
    this.enemies = this.add.group();
    this.addEnemies();

    this.player = new Player(this, this.bullets);
    this.add.existing(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, Number(this.layer.width), Number(this.layer.height));
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.overlap(this.bullets, this.layer, (bullet, tile) => {
      const attack = bullet as PlayerAttack;
      if (tile.collides && attack.doesThisCollideWithLevel()) {
        attack.hitsSomething();
      }
    });

    this.physics.add.overlap(this.enemyBullets, this.layer, (bullet, tile) => {
      const attack = bullet as EnemyAttack;
      if (tile.collides && attack.doesThisCollideWithLevel()) {
        attack.hitsSomething();
      }
    })

    const light = this.lights.addLight(Number(this.game.config.width) / 2, 300, 5000);
    this.lights.enable().setAmbientColor(0xaaaaaa);
    this.physics.add.collider(this.player, this.layer);

    this.physics.add.collider(this.enemies, this.layer);

    this.physics.add.overlap(this.enemyBullets, this.player, bullet => {
      const enemyAttack = bullet as EnemyAttack;
      this.player.receiveHit(enemyAttack.getDamage());
      enemyAttack.hitsSomething();
    });

    this.physics.add.overlap(this.bullets, this.enemies, (bullet, target) => {
      const attack = bullet as PlayerAttack;
      const enemy = target as Enemy;
      attack.hitsSomething();
      enemy.receiveHit(attack.getDamage());
    });

  }

  addEnemies() {
    const enemy = new MeleeEnemy(this);
    this.add.existing(enemy);
    this.enemies.add(enemy);

    const rangedEnemy = new RangedEnemy(this);
    this.add.existing(rangedEnemy);
    this.enemies.add(rangedEnemy);
  }

  createBackground() {
    var graphics = this.add.graphics();

    graphics.fillGradientStyle(0x5ffaff, 0x56faff, 0x5555ff, 0x5555ff, 1);
    graphics.fillRect(0, 0, Number(this.game.config.width), Number(this.game.config.height));
    graphics.setScrollFactor(0);
  }

  loadAndCreateMap() {
    const map = this.make.tilemap({ key: 'level' });
    const tileset = map.addTilesetImage(
      'tiles',
      'tiles',
      map.tileWidth,
      map.tileHeight
    );

    const layer = map.createStaticLayer('foreground', tileset, 0, 0);
    layer.setCollisionByProperty({ collides: true })
    layer.depth = 100;
    this.layer = layer;
    return map;
  }

  update() {
    this.player.update();

    for (const bullet of this.bullets.getChildren()) {
      bullet.update();
    }
    for (const enemy of this.enemies.getChildren()) {
      enemy.update();
    }

    this.enemyBullets.getChildren().forEach(bullet => {
      bullet.update();
    })
  }
}
