import { Physics, Scene, Input, GameObjects } from 'phaser';
import { GameScene } from '~/gameScene'
import { Bullet } from './bullet';

const LEFT = -1
const RIGHT = 1

export class Player extends Physics.Arcade.Sprite {
  scene!: GameScene;
  cursors: Input.Keyboard.CursorKeys;
  shootKey: Input.Keyboard.Key;
  isJumping: boolean = false;
  doubleJump = true;
  direction = RIGHT

  constructor(scene: GameScene, private bulletGroup: GameObjects.Group) {
    super(scene, 200, 500, 'player');
    //this.physicsImage = scene.physics.add.image(200, 500, 'player');
    scene.physics.world.enableBody(this, 0);
    this.shootKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
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

  receiveHit(damage: number) {
    console.log('ouch!');
  }
}
