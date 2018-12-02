
import { GameScene } from '~/gameScene'
import { Enemy } from './enemy';
import { EnemyBow } from './enemybow';

export class RangedEnemy extends Enemy {
  WEAPON_COOLDOWN_MAX: number = Phaser.Math.Between(1500, 3000);
  SHOOT_DELAY_MAX: number = 500;

  bow!: EnemyBow;

  seesPlayer: boolean = false;
  weaponCooldown: number = 0;
  facing: integer = -1;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.physics.world.enableBody(this, 0);
    this.tint = 0x00ff00;

    this.bow = new EnemyBow(scene, this.body.x, this.body.y, this);
    this.bow.setAngle(45 * this.facing);
    this.bow.setPosition(this.body.x + 16 + (this.facing * 8), this.body.y + 12);
    this.scene.add.existing(this.bow);
  }

  update() {
    const { x, y } = this;
    const { x: playerX, y: playerY } = this.scene.player;
    this.facing = this.scene.player.x < this.x ? -1 : 1;
    const distanceToPlayer = Phaser.Math.Distance.Between(x, y, playerX, playerY);
    if (this.weaponCooldown <= this.WEAPON_COOLDOWN_MAX) {
      this.weaponCooldown += this.scene.sys.game.loop.delta;
    }
    if (distanceToPlayer < 500) {
      if (this.weaponCooldown > this.WEAPON_COOLDOWN_MAX) {
        this.bow.shoot();
        this.weaponCooldown = 0;
      }
    }
    this.bow.update();
  }

  die(): void {
    this.bow.destroy();
    this.destroy();
  }

}
