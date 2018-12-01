import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene'

export class Player {
  physicsImage: Physics.Arcade.Image;
  cursors: Input.Keyboard.CursorKeys;
  isJumping: boolean = false;

  constructor(private scene: GameScene) {
    this.physicsImage = scene.physics.add.image(100, 100, 'player');
    scene.add.existing(this.physicsImage);
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.physicsImage.setPipeline('Light2D');
  }

  update() {
    if (this.cursors.left!.isDown) {
      this.physicsImage.setVelocityX(-100);
    } else if (this.cursors.right!.isDown) {
      this.physicsImage.setVelocityX(100);
    } else {
      this.physicsImage.setVelocityX(0);
    }

    if (Input.Keyboard.JustDown(this.cursors.up!) && (this.isOnFloor || this.isJumping)) {
      this.physicsImage.setVelocityY(-200);
      this.isJumping = !this.isJumping;
    }
  }

  get isOnFloor(): boolean {
    return (this.physicsImage.body as any).onFloor()
  }
}
