import { Physics, Scene, Input, GameObjects } from 'phaser';
import { GameScene } from '~/gameScene'
import { Bullet } from './bullet';
import { PlayerSlash } from './playerslash';
import { PlayerBow } from './playerbow';

const LEFT = -1
const RIGHT = 1

export class Player extends Physics.Arcade.Sprite {
  scene!: GameScene;
  cursors: Input.Keyboard.CursorKeys;
  shieldSprite!: GameObjects.Sprite;
  bow!: PlayerBow;

  shootKey: Input.Keyboard.Key;
  meleeKey: Input.Keyboard.Key;
  shieldKey: Input.Keyboard.Key;

  hasDoubleJumped: boolean = false;
  meleeCooldown: number = 0;
  shieldUp: boolean = false;

  // Powers
  doubleJump = true;
  meleeAttack = true;
  shield = true;
  rangeAttack = true;

  direction = RIGHT
  COOLDOWN_MELEE_MAX: number = 500;

  smackSound: Phaser.Sound.BaseSound;
  clonkSound: Phaser.Sound.BaseSound;

  hopSound1: Phaser.Sound.BaseSound;
  hopSound2: Phaser.Sound.BaseSound;
  hopSound3: Phaser.Sound.BaseSound;

  constructor(scene: GameScene, private bulletGroup: GameObjects.Group, entrance: GameObjects.Sprite) {
    super(scene, entrance.x, entrance.y + 8, 'player', 0);

    scene.physics.world.enableBody(this, 0);
    this.shootKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.C);
    this.meleeKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.Z);
    this.shieldKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.X);

    this.cursors = scene.input.keyboard.createCursorKeys();

    this.smackSound = this.scene.sound.add('smack');
    this.clonkSound = this.scene.sound.add('clonk');
    this.hopSound1 = this.scene.sound.add('hop1');
    this.hopSound2 = this.scene.sound.add('hop2');
    this.hopSound3 = this.scene.sound.add('hop3');

    this.shieldSprite = new GameObjects.Sprite(scene, this.body.x, this.body.y, 'shield');
    this.shieldSprite.setVisible(false);
    this.shieldSprite.setDepth(90);
    this.scene.add.existing(this.shieldSprite);

    this.bow = new PlayerBow(scene, this.body.x, this.body.y, this, bulletGroup);
    this.bow.setAlpha(0);
    this.bow.setDepth(90);
    this.scene.add.existing(this.bow);

    this.depth = 89;
  }

  update() {
    if (this.cursors.left!.isDown) {
      this.setVelocityX(-100);
      this.direction = LEFT
      this.flipX = true;
      this.anims.play('playerWalk', true);
    } else if (this.cursors.right!.isDown) {
      this.setVelocityX(100);
      this.direction = RIGHT
      this.flipX = false;
      this.anims.play('playerWalk', true);
    } else {
      this.anims.play('playerIdle', true);
      this.setVelocityX(0);
    }

    if (this.isOnFloor) {
      this.hasDoubleJumped = false;
    } else {
      if (this.body.velocity.y > 0) {
        this.anims.play('playerFalling')
      } else {
        this.anims.play('playerJumping')
      }
    }
    if (Input.Keyboard.JustDown(this.cursors.up!) && (this.isOnFloor || this.canDoubleJump)) {
      if (!this.isOnFloor) {
        this.hasDoubleJumped = true;
      }
      const hopSound = Math.round(Math.random() * 2) + 1;
      if (hopSound === 1) {
        console.log('1');
        this.hopSound1.play();
      } else if (hopSound === 2) {
        console.log('2');
        this.hopSound2.play();
      } else if (hopSound === 3) {
        console.log('3');
        this.hopSound3.play();
      }
      this.setVelocityY(-200);
    }
    if (Input.Keyboard.JustDown(this.shootKey)) {
      if (this.rangeAttack) {
        this.bow.shoot();
      }
    }
    this.meleeCooldown -= this.scene.sys.game.loop.delta;
    if (Input.Keyboard.JustDown(this.meleeKey) && this.meleeCooldown < 0) {
      this.melee();
      this.meleeCooldown = this.COOLDOWN_MELEE_MAX;
    }
    if (Input.Keyboard.JustDown(this.shieldKey)) {
      if (this.shield) {
        this.shieldUp = true;
        this.shieldSprite.setVisible(true);
      }
    }
    if (Input.Keyboard.JustUp(this.shieldKey)) {
      this.shieldUp = false;
      this.shieldSprite.setVisible(false);
    }

    this.updateAccesories();
  }

  updateAccesories() {
    this.updateShield();
    this.bow.update();
  }

  updateShield() {
    this.shieldSprite.setPosition(this.body.x + 16 + (this.direction * 8), this.body.y + 12);
  }

  get canDoubleJump() {
    return this.doubleJump && !this.hasDoubleJumped
  }

  get isOnFloor(): boolean {
    return (this.body as any).onFloor()
  }

  melee() {
    const slash = new PlayerSlash(this.scene, this, this.direction);
    this.bulletGroup.add(slash);
    this.scene.add.existing(slash);
  }

  receiveHit(damage: number) {

    if (!this.shieldUp) {
      if (!this.smackSound.isPlaying) {
        this.smackSound.play();
      }
    } else {
      if (!this.clonkSound.isPlaying) {
        this.clonkSound.play();
      }
    }
  }
}
