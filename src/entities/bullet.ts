import { Scene, GameObjects, Physics } from "phaser";

export class Bullet extends Physics.Arcade.Sprite {
  body!: Physics.Arcade.Body

  constructor(scene: Scene, parent: GameObjects.Image, direction: number) {
    super(scene, parent.x, parent.y, 'arrow');
    scene.physics.world.enableBody(this, 0);
    this.setVelocityX(direction * 300.0);
    this.body.setAllowGravity(false);
  }

  update() {
    super.update();
  }
}
