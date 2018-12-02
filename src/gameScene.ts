import { Scene, GameObjects, Input } from 'phaser';
import { Player } from '~/entities/player';
import { MeleeEnemy } from '~/entities/meleeenemy';
import { RangedEnemy } from './entities/rangedenemy';
import { Enemy } from './entities/enemy';
import { EnemyAttack } from './entities/enemyAttack';
import { PlayerAttack } from './entities/playerAttack';
import { Sign } from './entities/sign';

export class GameScene extends Scene {

  levelNumber!: integer;
  level!: Phaser.Tilemaps.Tilemap;
  player!: Player;
  bullets!: GameObjects.Group;
  cursors!: Input.Keyboard.CursorKeys;
  layer!: Phaser.Tilemaps.StaticTilemapLayer;
  enemies!: GameObjects.Group;
  enemyBullets!: GameObjects.Group;
  entrance!: GameObjects.Sprite;
  exit!: GameObjects.Sprite;
  signs!: GameObjects.Group;

  constructor() {
    super('GameScene');
  }

  init(data: any) {
    this.levelNumber = data.levelNumber;
  }

  create() {
    this.createBackground();
    this.level = this.loadAndCreateMap();
    this.bullets = this.add.group();
    this.enemyBullets = this.add.group();
    this.enemies = this.add.group();
    this.signs = this.add.group();
    this.addObjectsToLevel();

    this.player = new Player(this, this.bullets, this.entrance);
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

    this.physics.add.overlap(this.signs, this.player, item => {
      const sign = item as Sign;
      sign.isBeingRead();
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

  addObjectsToLevel() {
    for (const layer of this.level.objects) {
      for (const levelobject of layer.objects) {
        console.log(levelobject.name);
        if (levelobject.name === 'melee') {
          const enemy = new MeleeEnemy(this, levelobject.x + 16, levelobject.y - 16);
          this.add.existing(enemy);
          this.enemies.add(enemy);
        }
        if (levelobject.name === 'ranged') {
          const enemy = new RangedEnemy(this, levelobject.x + 16, levelobject.y - 16);
          this.add.existing(enemy);
          this.enemies.add(enemy);
        }
        if (levelobject.name === 'sign') {
          const sign = new Sign(this, levelobject.x + 16, levelobject.y - 16, levelobject.properties.text);
          this.add.existing(sign);
          this.signs.add(sign);
        }
      }
    }
  }

  createBackground() {
    var graphics = this.add.graphics();

    graphics.fillGradientStyle(0x5ffaff, 0x56faff, 0x5555ff, 0x5555ff, 1);
    graphics.fillRect(0, 0, Number(this.game.config.width), Number(this.game.config.height));
    graphics.setScrollFactor(0);
  }

  loadAndCreateMap() {
    console.log(this.levelNumber);
    const levelKey = 'level' + this.levelNumber;
    const map = this.make.tilemap({ key: levelKey });
    const tileset = map.addTilesetImage(
      'tiles',
      'tiles',
      map.tileWidth,
      map.tileHeight
    );

    const bgtileset = map.addTilesetImage(
      'bgtiles',
      'bgtiles',
      map.tileWidth,
      map.tileHeight
    );


    this.createParallaxLayer(Number(map.heightInPixels) - 180, Number(map.widthInPixels), 0.3, 30, 0xaaaaaa);
    this.createParallaxLayer(Number(map.heightInPixels) - 160, Number(map.widthInPixels), 0.4, 100, 0xCCCCCC);
    this.createParallaxLayer(Number(map.heightInPixels) - 150, Number(map.widthInPixels), 0.5, 0, 0xffffff);

    console.log(map);

    const layer = map.createStaticLayer('foreground', tileset, 0, 0);
    layer.setCollisionByProperty({ collides: true })
    layer.depth = 100;
    this.layer = layer;

    const bgLayer = map.createStaticLayer('background', bgtileset, 0, 0);
    bgLayer.depth = 10;

    this.entrance = map.createFromObjects('objects', 'entrance', { key: 'entrance' })[0];
    this.exit = map.createFromObjects('objects', 'exit', { key: 'exit' })[0];

    return map;
  }

  createParallaxLayer(y: number, width: number, scrollFactor: number, tilePositionX: number, tint: number) {
    const parallaxBack = this.add.tileSprite(0, y, width, 150, 'hills');
    parallaxBack.setOrigin(0);
    parallaxBack.tilePositionX = tilePositionX;
    parallaxBack.setScrollFactor(scrollFactor, 1);
    parallaxBack.tint = tint;
  }

  update() {
    this.player.update();

    for (const bullet of this.bullets.getChildren()) {
      bullet.update();
    }
    for (const enemy of this.enemies.getChildren()) {
      enemy.update();
    }
    for (const sign of this.signs.getChildren()) {
      sign.update();
    }

    this.enemyBullets.getChildren().forEach(bullet => {
      bullet.update();
    })

    if (this.exit.getBounds().contains(this.player.getCenter().x, this.player.getCenter().y)) {
      this.playerExits();
    }
  }

  playerExits() {
    this.scene.start('StoryScene', { levelNumber: this.levelNumber });
  }

}
