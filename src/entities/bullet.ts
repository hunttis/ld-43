import { GameObjects, Physics } from "phaser";
import { GameScene } from "~/gameScene";
import { PlayerAttack } from "./playerAttack";
import { EnemyAttack } from "./enemyAttack";

const LEFT = -1
const RIGHT = 1

export class Bullet extends PlayerAttack {

  scene!: GameScene
  body!: Physics.Arcade.Body
  damage: number = 100;

  constructor(scene: GameScene, parent: GameObjects.Sprite, private direction: number) {
    super(scene, parent.x, parent.y, 'arrow');
    scene.physics.world.enableBody(this, 0);
    this.setVelocityX(direction * 300.0);
    this.body.setAllowGravity(false);
    this.scaleX = direction;
    this.depth = 91;
  }

  update() {
    super.update();
    const distance = Phaser.Math.Distance.Between(this.body.x, this.body.y, this.scene.player.body.x, this.scene.player.body.y);
    if (this.body.x < 0 || this.body.x > Number(this.scene.layer.width) || distance > 600) {
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

const onCompleteHandler = (tween: Phaser.Tweens.Tween, targets: any, arrow: PlayerAttack): void => {
  arrow.destroy();
}
