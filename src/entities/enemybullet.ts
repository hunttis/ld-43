import { GameObjects, Physics } from "phaser";
import { GameScene } from "~/gameScene";

export class EnemyBullet extends Physics.Arcade.Sprite {
  scene!: GameScene
  body!: Physics.Arcade.Body
  damage: number = 10;

  constructor(scene: GameScene, parentX: number, parentY: number, direction: number) {
    super(scene, parentX, parentY, 'arrow');
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
