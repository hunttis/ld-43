import { Physics, Scene, Input, GameObjects } from 'phaser';
import { GameScene } from '~/gameScene'
import { Bullet } from './bullet';

export class Player {
  physicsImage: Physics.Arcade.Image;
  cursors: Input.Keyboard.CursorKeys;
  isJumping: boolean = false;
  doubleJump = true;
  bullets: Bullet[] = [];

  constructor(private scene: GameScene, private bulletGroup: GameObjects.Group) {
    this.physicsImage = scene.physics.add.image(200, 500, 'player');
    scene.add.existing(this.physicsImage);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.physicsImage.setPipeline('Light2D');
    this.bulletGroup = scene.add.group()
  }

  update() {
    if (this.cursors.left!.isDown) {
      this.physicsImage.setVelocityX(-100);
    } else if (this.cursors.right!.isDown) {
      this.physicsImage.setVelocityX(100);
    } else {
      this.physicsImage.setVelocityX(0);
    }
    if (Input.Keyboard.JustDown(this.cursors.up!) && (this.body.onFloor() || this.canDoubleJump)) {
      this.physicsImage.setVelocityY(-200);
      this.isJumping = !this.isJumping;
    }

    for (const bullet of this.bullets) {
      bullet.update()
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
    const bullet = new Bullet(this.scene, this.bulletGroup, this.physicsImage);
    this.bullets.push(bullet)
  }
}
