import { GameObjects, Physics } from "phaser";
import { GameScene } from "~/gameScene";
import { EnemyAttack } from "./enemyAttack";

export class EnemyBullet extends EnemyAttack {
  body!: Physics.Arcade.Body
  damage: number = 10;
  used: boolean = false;

  constructor(scene: GameScene, parentX: number, parentY: number, private direction: number) {
    super(scene, parentX, parentY, 'arrow');
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
      angle: -100 * this.direction,
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