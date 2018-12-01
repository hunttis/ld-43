import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene'

export class Player {
  physicsImage: Physics.Arcade.Image;
  cursors!: Input.Keyboard.CursorKeys;
  scene!: GameScene;

  constructor(scene: GameScene) {
    this.scene = scene;
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

    if (this.cursors.up!.isDown && this.physicsImage.body.onFloor()) {
      this.physicsImage.setVelocityY(-200);
      this.scene.layer.renderDebug(this.scene.debugGraphics, { tileColor: null });
    }
  }
}
