import { Scene, GameObjects, Physics } from "phaser";
import { GameScene } from "~/gameScene";

export class Bullet extends Physics.Arcade.Sprite {
  scene!: GameScene
  body!: Physics.Arcade.Body

  constructor(scene: GameScene, parent: GameObjects.Image, direction: number) {
    super(scene, parent.x, parent.y, 'arrow');
    scene.physics.world.enableBody(this, 0);
    this.setVelocityX(direction * 300.0);
    this.body.setAllowGravity(false);
  }

  update() {
    super.update();
    if (this.body.x < 0 || this.body.x > Number(this.scene.layer.width)) {
      this.destroy();
    }
  }
}
