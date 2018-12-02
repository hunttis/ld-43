import { Scene, GameObjects, Physics } from "phaser";
import { GameScene } from "~/gameScene";
import { PlayerAttack } from "./playerAttack";

const LEFT = -1
const RIGHT = 1

export class Bullet extends PlayerAttack {

  scene!: GameScene
  body!: Physics.Arcade.Body
  damage: number = 10;

  constructor(scene: GameScene, parent: GameObjects.Sprite, private direction: number) {
    super(scene, parent.x, parent.y, 'arrow');
    scene.physics.world.enableBody(this, 0);
    this.setVelocityX(direction * 300.0);
    this.body.setAllowGravity(false);
    this.scaleX = direction;
    this.depth = 102;
  }

  update() {
    super.update();
    if (this.body.x < 0 || this.body.x > Number(this.scene.layer.width)) {
      this.destroy();
    }
  }

  hitsSomething(): void {
    this.setVelocity(0);
    this.scene.add.tween({
      targets: this,
      duration: 250,
      alpha: 0,
      x: this.x - (this.direction * 16),
      y: this.y + 8,
      angle: -this.direction * 100,
      onComplete: onCompleteHandler,
      onCompleteParams: [this]
    })
  }

  doesThisCollideWithLevel(): boolean {
    return true;
  }
}

const onCompleteHandler = (tween: Phaser.Tweens.Tween, targets: any, arrow: EnemyBullet): void => {
  arrow.destroy();
}
