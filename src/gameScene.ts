import { Scene, GameObjects, Input } from 'phaser';
import { Player } from '~/entities/player';
import { MeleeEnemy } from '~/entities/meleeenemy';
import { EnemySlash } from '~/entities/enemyslash';

export class GameScene extends Scene {

  level!: Phaser.Tilemaps.Tilemap;
  player!: Player;
  bullets!: GameObjects.Group;
  cursors!: Input.Keyboard.CursorKeys;
  layer!: Phaser.Tilemaps.StaticTilemapLayer;
  enemy!: MeleeEnemy;
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
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player.physicsImage);
    this.cameras.main.setBounds(0, 0, Number(this.layer.width), Number(this.layer.height));
    const light = this.lights.addLight(Number(this.game.config.width) / 2, 300, 5000);
    this.lights.enable().setAmbientColor(0xaaaaaa);
    this.enemy = new MeleeEnemy(this);
    this.physics.add.collider(this.player.physicsImage, this.layer);
    this.physics.add.collider(this.enemy.physicsImage, this.layer);

    this.physics.add.overlap(this.enemyBullets, this.player.physicsImage, bullet => {
      const enemyBullet = bullet as EnemySlash;
      this.player.receiveHit(enemyBullet.getDamage());
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

    this.enemyBullets.getChildren().forEach(bullet => {
      bullet.update();
    })
  }
}
