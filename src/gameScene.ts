import { Scene, GameObjects, Input } from 'phaser';
import { Player } from '~/entities/player';
import { MeleeEnemy } from '~/entities/meleeenemy';
import { EnemySlash } from '~/entities/enemyslash';
import { Bullet } from './entities/bullet';
import { RangedEnemy } from './entities/rangedenemy';

export class GameScene extends Scene {

  level!: Phaser.Tilemaps.Tilemap;
  player!: Player;
  bullets!: GameObjects.Group;
  cursors!: Input.Keyboard.CursorKeys;
  layer!: Phaser.Tilemaps.StaticTilemapLayer;
  enemy!: MeleeEnemy;
  rangedEnemy!: RangedEnemy;
  enemyBullets!: GameObjects.Group;

  constructor() {
    super('GameScene');
  }

  create() {
    this.createBackground();
    this.level = this.loadAndCreateMap();
    this.bullets = this.add.group();
    this.enemyBullets = this.add.group();
    this.player = new Player(this, this.bullets);
    this.add.existing(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, Number(this.layer.width), Number(this.layer.height));
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.bullets, this.layer, bullet => {
      bullet.destroy();
    });
    const light = this.lights.addLight(Number(this.game.config.width) / 2, 300, 5000);
    this.lights.enable().setAmbientColor(0xaaaaaa);
    this.enemy = new MeleeEnemy(this);
    this.add.existing(this.enemy);
    this.rangedEnemy = new RangedEnemy(this);
    this.add.existing(this.rangedEnemy);
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.enemy, this.layer);
    this.physics.add.collider(this.rangedEnemy, this.layer);

    this.physics.add.overlap(this.enemyBullets, this.player, bullet => {
      if (!this.player.shieldUp) {
        const enemyBullet = bullet as EnemySlash;
        this.player.receiveHit(enemyBullet.getDamage());
      }
    });

    this.physics.add.overlap(this.bullets, this.enemy, bullet => {
      const playerBullet = bullet as Bullet;
      this.enemy.receiveHit(playerBullet.getDamage());
    });

    this.physics.add.overlap(this.bullets, this.rangedEnemy, bullet => {
      const playerBullet = bullet as Bullet;
      this.rangedEnemy.receiveHit(playerBullet.getDamage());
    });
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
    this.enemy.update();
    this.rangedEnemy.update();

    this.enemyBullets.getChildren().forEach(bullet => {
      bullet.update();
    })
  }
}
