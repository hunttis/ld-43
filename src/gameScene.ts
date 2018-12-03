import { Scene, GameObjects, Input } from 'phaser';
import { Player } from '~/entities/player';
import { MeleeEnemy } from '~/entities/meleeenemy';
import { RangedEnemy } from './entities/rangedenemy';
import { Enemy } from './entities/enemy';
import { EnemyAttack } from './entities/enemyAttack';
import { PlayerAttack } from './entities/playerAttack';
import { Sign } from './entities/sign';
import { Effects } from './effects';

export class GameScene extends Scene {

  levelNumber!: integer;
  level!: Phaser.Tilemaps.Tilemap;
  player!: Player;
  bullets!: GameObjects.Group;
  layer!: Phaser.Tilemaps.StaticTilemapLayer;
  enemies!: GameObjects.Group;
  enemyBullets!: GameObjects.Group;
  entrance!: GameObjects.Sprite;
  exit!: GameObjects.Sprite;
  signs!: GameObjects.Group;
  actionButtons!: GameObjects.Sprite;
  effects!: Effects;

  nextLevelKey!: Input.Keyboard.Key;
  tonkSound!: Phaser.Sound.BaseSound;

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
    this.tonkSound = this.sound.add('tonk');

    this.player = new Player(this, this.bullets, this.entrance);
    this.add.existing(this.player);
    this.nextLevelKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.N);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, Number(this.layer.width), Number(this.layer.height));
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.overlap(this.bullets, this.layer, (bullet, tile) => {
      const attack = bullet as PlayerAttack;
      if (tile.collides && attack.doesThisCollideWithLevel()) {
        this.tonkSound.play();
        this.effects.dustPuff(attack.x, attack.y);
        attack.hitsSomething();
      }
      if (tile.collides) {
        this.effects.dustPuff(attack.x, attack.y);
      }
    });

    this.physics.add.overlap(this.enemyBullets, this.layer, (bullet, tile) => {
      const attack = bullet as EnemyAttack;
      if (tile.collides && attack.doesThisCollideWithLevel()) {
        this.tonkSound.play();
        attack.hitsSomething();
      }
      if (tile.collides) {
        this.effects.dustPuff(attack.x, attack.y);
      }
    })

    this.physics.add.overlap(this.signs, this.player, item => {
      const sign = item as Sign;
      sign.isBeingRead();
    })

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

    this.actionButtons = this.add.sprite(-64, -64, 'actionbuttons');
    this.actionButtons.setOrigin(0, 0);
    this.actionButtons.setScale(1);
    this.actionButtons.setScrollFactor(0);
    this.add.tween({
      targets: this.actionButtons,
      x: 10,
      y: 10,
      duration: 1000,
      ease: 'Cubic.easeInOut'
    })
    this.add.tween({
      targets: this.actionButtons,
      scaleX: 1.2,
      scaleY: 1.2,
      delay: 1000,
      duration: 500,
      ease: 'Cubic.easeInOut',
      yoyo: true,
      repeat: 1
    })

    if (this.levelNumber >= 3) { // shield out
      this.addCrossOut(10 + 32 + 16, 10 + 16, 3000);
    }
    if (this.levelNumber >= 5) { // bow out
      this.addCrossOut(10 + 32 + 16 + 32, 10 + 16, 3500);
    }
    if (this.levelNumber >= 6) { // doublejump out
      this.addCrossOut(10 + 32 + 16 + 32 + 32, 10 + 16, 4000);
    }

    this.effects = new Effects(this);
  }

  addCrossOut(x: number, y: number, delay: number) {
    const crossOut = this.add.sprite(x, y, 'cross');
    crossOut.setOrigin(0.5);
    crossOut.alpha = 0;
    crossOut.setScale(20)
    crossOut.setScrollFactor(0);
    this.add.tween({
      targets: crossOut,
      scaleX: 1,
      scaleY: 1,
      alpha: 1,
      duration: 500,
      delay: delay,
    })
  }

  addObjectsToLevel() {
    for (const layer of this.level.objects) {
      for (const levelobject of layer.objects) {
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
          const sign = new Sign(this, levelobject.x + 16, levelobject.y - 16, levelobject.properties[0].value);
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
    if (Input.Keyboard.JustDown(this.nextLevelKey)) {
      this.playerExits();
    }

    if (this.player.health <= 0) {
      this.scene.start('GameOverScene');
    }
  }

  playerExits() {
    this.scene.start('StoryScene', { levelNumber: this.levelNumber + 1 });
  }
}
