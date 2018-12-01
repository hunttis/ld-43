import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene'
import { EnemySlash } from './enemyslash';

export class MeleeEnemy {
  physicsImage: Physics.Arcade.Image;
  seesPlayer: boolean = false;
  slashCooldown: number = 0;
  maxSlashcooldown: number = 2000;
  facing!: integer;

  constructor(private scene: GameScene) {
    this.physicsImage = scene.physics.add.image(500, 500, 'player');
    this.physicsImage.tint = 0xff0000;
    this.physicsImage.setPipeline('Light2D');
  }

  update() {
    const { x, y } = this.physicsImage;
    const { x: playerX, y: playerY } = this.scene.player.physicsImage;
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
    const direction = this.scene.player.physicsImage.x < this.physicsImage.x ? -1 : 1;
    const slash = new EnemySlash(this.scene, this.physicsImage.x, this.physicsImage.y, direction);
    this.scene.add.existing(slash);
    this.scene.enemyBullets.add(slash);
  }

}
