import { Physics, Scene, Input, GameObjects } from 'phaser';
import { GameScene } from '~/gameScene'
import { Bullet } from './bullet';
import { PlayerSlash } from './playerslash';

const LEFT = -1
const RIGHT = 1

export class Player extends Physics.Arcade.Sprite {
  scene!: GameScene;
  cursors: Input.Keyboard.CursorKeys;
  shieldSprite!: GameObjects.Sprite;
  bowSprite!: GameObjects.Sprite;

  shootKey: Input.Keyboard.Key;
  meleeKey: Input.Keyboard.Key;
  shieldKey: Input.Keyboard.Key;

  hasDoubleJumped: boolean = false;
  meleeCooldown: number = 0;
  shieldUp: boolean = false;
  shootDelay: number = 100;
  isFiring: boolean = false;
  hasFired: boolean = false;
  stashBowDelay: number = 500;

  // Powers
  doubleJump = true;
  meleeAttack = true;
  shield = true;
  rangeAttack = true;

  direction = RIGHT
  COOLDOWN_MELEE_MAX: number = 500;
  SHOOT_DELAY_MAX: number = 100;
  STASH_BOW_DELAY_MAX: number = 500;

  constructor(scene: GameScene, private bulletGroup: GameObjects.Group, entrance: GameObjects.Sprite) {
    super(scene, entrance.x, entrance.y + 16, 'player', 0);

    scene.physics.world.enableBody(this, 0);
    this.shootKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.meleeKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.Z);
    this.shieldKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.X);
    this.cursors = scene.input.keyboard.createCursorKeys();

    this.shieldSprite = new GameObjects.Sprite(scene, this.body.x, this.body.y, 'shield');
    this.shieldSprite.setVisible(false);
    this.shieldSprite.setDepth(100);
    this.scene.add.existing(this.shieldSprite);

    this.bowSprite = new GameObjects.Sprite(scene, this.body.x, this.body.y, 'bow');
    this.bowSprite.setAlpha(0);
    this.bowSprite.setDepth(100);
    this.scene.add.existing(this.bowSprite);
  }

  update() {
    this.anims.play('playerWalk', true);

    if (this.cursors.left!.isDown) {
      this.setVelocityX(-100);
      this.direction = LEFT
    } else if (this.cursors.right!.isDown) {
      this.setVelocityX(100);
      this.direction = RIGHT
    } else {
      this.setVelocityX(0);
    }
    if (this.isOnFloor) {
      this.hasDoubleJumped = false;
    }
    if (Input.Keyboard.JustDown(this.cursors.up!) && (this.isOnFloor || this.canDoubleJump)) {
      if (!this.isOnFloor) {
        this.hasDoubleJumped = true;
      }
      this.setVelocityY(-200);
    }
    if (Input.Keyboard.JustDown(this.shootKey)) {
      if (this.rangeAttack) {
        this.shoot();
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
    this.updateBow();
  }

  updateShield() {
    this.shieldSprite.setPosition(this.body.x + 16 + (this.direction * 8), this.body.y + 16);
  }

  updateBow() {
    this.bowSprite.scaleX = this.direction;
    this.bowSprite.setPosition(this.body.x + 16 + (this.direction * 8), this.body.y + 12);
    if (this.isFiring) {
      this.shootDelay -= this.scene.sys.game.loop.delta;
      if (this.shootDelay < 0) {
        const bullet = new Bullet(this.scene, this, this.direction);
        this.bulletGroup.add(bullet);
        this.scene.add.existing(bullet);
        this.isFiring = false;
        this.shootDelay = this.SHOOT_DELAY_MAX;
        this.hasFired = true;
        this.stashBowDelay = this.STASH_BOW_DELAY_MAX;
      }
    }
    if (this.hasFired) {
      this.stashBowDelay -= this.scene.sys.game.loop.delta;
      if (this.stashBowDelay < 0) {
        this.hasFired = false;
        this.scene.add.tween({
          targets: this.bowSprite,
          duration: 200,
          alpha: 0,
          angle: 100 * this.direction
        })
      }
    }
  }

  get canDoubleJump() {
    return this.doubleJump && !this.hasDoubleJumped
  }

  get isOnFloor(): boolean {
    return (this.body as any).onFloor()
  }

  shoot() {
    this.isFiring = true;
    this.bowSprite.setAngle(0);
    this.scene.add.tween({
      targets: this.bowSprite,
      duration: 50,
      alpha: 1
    })
  }

  melee() {
    const slash = new PlayerSlash(this.scene, this, this.direction);
    this.bulletGroup.add(slash);
    this.scene.add.existing(slash);
  }

  receiveHit(damage: number) {
    if (!this.shieldUp) {
      console.log('ouch!');
    }
  }
}
