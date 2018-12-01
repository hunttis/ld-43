import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene'
import { EnemySlash } from './enemyslash';

export class MeleeEnemy extends Physics.Arcade.Sprite {
  scene!: GameScene;
  seesPlayer: boolean = false;
  slashCooldown: number = 0;
  maxSlashcooldown: number = 2000;
  facing!: integer;

  constructor(scene: GameScene) {
    super(scene, 500, 500, 'player');
    scene.physics.world.enableBody(this, 0);
    this.tint = 0xff0000;
    this.setPipeline('Light2D');
  }

  update() {
    const { x, y } = this;
    const { x: playerX, y: playerY } = this.scene.player;
    const distanceToPlayer = Phaser.Math.Distance.Between(x, y, playerX, playerY);
    if (this.slashCooldown >= 0) {
      this.slashCooldown -= this.scene.sys.game.loop.delta;
    }
    if (distanceToPlayer < 100) {
      if (this.slashCooldown < 0) {
        this.slash();
        this.slashCooldown = this.maxSlashcooldown;
      }
    }
  }

  slash() {
    const direction = this.scene.player.x < this.x ? -1 : 1;
    const slash = new EnemySlash(this.scene, this.x, this.y, direction);
    this.scene.add.existing(slash);
    this.scene.enemyBullets.add(slash);
  }

  receiveHit(damage: number) {
    console.log("Aarrr");
  }

}
