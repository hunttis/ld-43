import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene';

export class EnemySlash extends Physics.Arcade.Sprite {
  lifetime: number;
  body!: Physics.Arcade.Body;
  direction: integer;
  readyToDestroy: boolean = false;

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

  getDamage() {
    return 1;
  }
}