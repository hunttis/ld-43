import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene';
import { Player } from './player';

export class PlayerSlash extends Physics.Arcade.Sprite {
  lifetime: number;
  body!: Physics.Arcade.Body;
  direction: integer;
  readyToDestroy: boolean = false;

  constructor(scene: GameScene, private parent: Player, direction: integer) {
    super(scene, parent.x + (16 * direction), parent.y, 'slash');

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
    return 2;
  }
}
