import { GameObjects } from "phaser";
import { GameScene } from "~/gameScene";
import { RangedEnemy } from "./rangedenemy";
import { EnemyBullet } from "./enemybullet";

export class EnemyBow extends GameObjects.Sprite {
  SHOOT_DELAY_MAX = 500;

  scene!: GameScene;

  isFiring: boolean = false;
  hasFired: boolean = false;
  shootDelay: number = 0;

  constructor(scene: GameScene, x: number, y: number, private owner: RangedEnemy) {
    super(scene, x, y, 'bow');
  }

  update() {
    this.scaleX = this.owner.facing;

    if (this.hasFired) {
      this.hasFired = false;
      this.scene.add.tween({
        targets: this,
        duration: 200,
        angle: 45 * this.owner.facing,
        x: this.owner.body.x + 16 + (this.owner.facing * 6),
        y: this.owner.body.y + 24
      });
    }

    if (this.isFiring) {
      this.shootDelay += this.scene.sys.game.loop.delta;
      if (this.shootDelay > this.SHOOT_DELAY_MAX) {
        this.shootDelay = 0;
        this.isFiring = false;
        this.hasFired = true;
        const bullet = new EnemyBullet(this.scene, this.x, this.y, this.owner.facing);
        this.scene.add.existing(bullet);
        this.scene.enemyBullets.add(bullet);
      }
    }
  }

  shoot() {
    this.isFiring = true;
    this.scene.add.tween({
      targets: this,
      duration: 100,
      angle: 0,
      x: this.owner.body.x + 16 + (this.owner.facing * 12),
      y: this.owner.body.y + 8
    });
  }
}