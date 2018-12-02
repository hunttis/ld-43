import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene';
import { EnemyAttack } from './enemyAttack';

export class EnemySlash extends EnemyAttack {
  lifetime: number;
  body!: Physics.Arcade.Body;
  direction: integer;
  readyToDestroy: boolean = false;
  damage: number = 20

  constructor(scene: GameScene, x: number, y: number, direction: integer) {
    super(scene, x + (16 * direction), y, 'slash');

    this.lifetime = 250;
    this.direction = direction;
    this.flipX = direction < 0
    scene.physics.world.enableBody(this, 0);
    this.body.allowGravity = false;

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 250
    });
  }

  update() {
    this.body.velocity.x = 100 * this.direction;
    this.lifetime -= this.scene.sys.game.loop.delta;

    if (this.lifetime < 0) {
      this.destroy();
    }
  }

  hitsSomething(): void { }

  doesThisCollideWithLevel(): boolean {
    return false;
  }
}
