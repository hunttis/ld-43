import { Scene, GameObjects, Physics } from "phaser";
import { GameScene } from "~/gameScene";

const LEFT = -1
const RIGHT = 1

export class Bullet extends Physics.Arcade.Sprite {
  scene!: GameScene
  body!: Physics.Arcade.Body
  damage: number = 10;

  constructor(scene: GameScene, parent: GameObjects.Sprite, direction: number) {
    super(scene, parent.x, parent.y, 'arrow');
    scene.physics.world.enableBody(this, 0);
    this.setVelocityX(direction * 300.0);
    this.body.setAllowGravity(false);
    this.scaleX = direction;
  }

  update() {
    super.update();
    if (this.body.x < 0 || this.body.x > Number(this.scene.layer.width)) {
      this.destroy();
    }
  }

  getDamage() {
    return this.damage;
  }
}
