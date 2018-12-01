import { Physics, Scene, Input, GameObjects } from 'phaser';
import { GameScene } from '~/gameScene'
import { Bullet } from './bullet';
import { PlayerSlash } from './playerslash';

const LEFT = -1
const RIGHT = 1

export class Player extends Physics.Arcade.Sprite {
  scene!: GameScene;
  cursors: Input.Keyboard.CursorKeys;

  shootKey: Input.Keyboard.Key;
  meleeKey: Input.Keyboard.Key;

  isJumping: boolean = false;
  meleeCooldown: number = 0;

  // Powers
  doubleJump = true;
  meleeAttack = true;

  direction = RIGHT
  COOLDOWN_MELEE_MAX: number = 500;

  constructor(scene: GameScene, private bulletGroup: GameObjects.Group) {
    super(scene, 200, 500, 'player');
    scene.physics.world.enableBody(this, 0);
    this.shootKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.meleeKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.Z);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.setPipeline('Light2D');
  }

  update() {
    if (this.cursors.left!.isDown) {
      this.setVelocityX(-100);
      this.direction = LEFT
    } else if (this.cursors.right!.isDown) {
      this.setVelocityX(100);
      this.direction = RIGHT
    } else {
      this.setVelocityX(0);
    }
    if (Input.Keyboard.JustDown(this.cursors.up!) && (this.body.onFloor() || this.canDoubleJump)) {
      this.setVelocityY(-200);
      this.isJumping = !this.isJumping;
    }
    if (Input.Keyboard.JustDown(this.shootKey)) {
      this.shoot()
    }
    this.meleeCooldown -= this.scene.sys.game.loop.delta;
    if (Input.Keyboard.JustDown(this.meleeKey) && this.meleeCooldown < 0) {
      this.melee();
      this.meleeCooldown = this.COOLDOWN_MELEE_MAX;
    }
  }

  get canDoubleJump() {
    return this.doubleJump && this.isJumping
  }

  get isOnFloor(): boolean {
    return (this.body as any).onFloor()
  }

  shoot() {
    const bullet = new Bullet(this.scene, this, this.direction);
    this.bulletGroup.add(bullet);
    this.scene.add.existing(bullet);
  }

  melee() {
    const slash = new PlayerSlash(this.scene, this, this.direction);
    this.bulletGroup.add(slash);
    this.scene.add.existing(slash);
  }

  receiveHit(damage: number) {
    console.log('ouch!');
  }
}
