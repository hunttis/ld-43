import { Physics, Scene, Input, GameObjects } from 'phaser';
import { GameScene } from '~/gameScene'
import { Bullet } from './bullet';

const LEFT = -1
const RIGHT = 1

export class Player {
  physicsImage: Physics.Arcade.Image;
  cursors: Input.Keyboard.CursorKeys;
  shootKey: Input.Keyboard.Key;
  isJumping: boolean = false;
  doubleJump = true;
  direction = RIGHT

  constructor(private scene: GameScene, private bulletGroup: GameObjects.Group) {
    this.physicsImage = scene.physics.add.image(200, 500, 'player');
    this.shootKey = scene.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.physicsImage.setPipeline('Light2D');
    this.bulletGroup = scene.add.group()
  }

  update() {
    if (this.cursors.left!.isDown) {
      this.physicsImage.setVelocityX(-100);
      this.direction = LEFT
    } else if (this.cursors.right!.isDown) {
      this.physicsImage.setVelocityX(100);
      this.direction = RIGHT
    } else {
      this.physicsImage.setVelocityX(0);
    }
    if (Input.Keyboard.JustDown(this.cursors.up!) && (this.body.onFloor() || this.canDoubleJump)) {
      this.physicsImage.setVelocityY(-200);
      this.isJumping = !this.isJumping;
    }
    if (Input.Keyboard.JustDown(this.shootKey)) {
      this.shoot()
    }
  }

  get canDoubleJump() {
    return this.doubleJump && this.isJumping
  }

  get body(): Physics.Arcade.Body {
    return this.physicsImage.body as any
  }

  get isOnFloor(): boolean {
    return (this.physicsImage.body as any).onFloor()
  }

  shoot() {
    const bullet = new Bullet(this.scene, this.physicsImage, this.direction);
    this.bulletGroup.add(bullet)
  }

  receiveHit(damage: number) {
    console.log('ouch!');
  }
}
