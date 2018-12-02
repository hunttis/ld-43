import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene'
import { EnemyBullet } from './enemybullet';
import { Enemy } from './enemy';

export class RangedEnemy extends Enemy {
  seesPlayer: boolean = false;
  weaponCooldown: number = 0;
  maxWeaponCooldown: number = 2500;
  facing!: integer;

  constructor(scene: GameScene) {
    super(scene, 600, 500, 'player');
    scene.physics.world.enableBody(this, 0);
    this.tint = 0x00ff00;
    this.setPipeline('Light2D');
  }

  update() {
    const { x, y } = this;
    const { x: playerX, y: playerY } = this.scene.player;
    const distanceToPlayer = Phaser.Math.Distance.Between(x, y, playerX, playerY);
    if (this.weaponCooldown >= 0) {
      this.weaponCooldown -= this.scene.sys.game.loop.delta;
    }
    if (distanceToPlayer < 1000) {
      if (this.weaponCooldown < 0) {
        this.shoot();
        this.weaponCooldown = this.maxWeaponCooldown;
      }
    }
  }

  shoot() {
    const direction = this.scene.player.x < this.x ? -1 : 1;
    const bullet = new EnemyBullet(this.scene, this.x, this.y, direction);
    this.scene.add.existing(bullet);
    this.scene.enemyBullets.add(bullet);
  }

}
