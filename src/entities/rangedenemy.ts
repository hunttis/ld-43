import { Physics, Scene, Input, GameObjects } from 'phaser';
import { GameScene } from '~/gameScene'
import { EnemyBullet } from './enemybullet';
import { Enemy } from './enemy';

export class RangedEnemy extends Enemy {
  WEAPON_COOLDOWN_MAX: number = Phaser.Math.Between(1500, 3000);
  SHOOT_DELAY_MAX: number = 500;

  bowSprite!: GameObjects.Sprite;

  seesPlayer: boolean = false;
  weaponCooldown: number = 0;
  facing: integer = -1;
  isFiring: boolean = false;
  hasFired: boolean = false;
  shootDelay = 0;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.physics.world.enableBody(this, 0);
    this.tint = 0x00ff00;

    this.bowSprite = new GameObjects.Sprite(scene, this.body.x, this.body.y, 'bow');
    this.bowSprite.setAngle(45 * this.facing);
    this.bowSprite.setPosition(this.body.x + 16 + (this.facing * 8), this.body.y + 12);
    this.scene.add.existing(this.bowSprite);
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
        this.shoot();
        this.weaponCooldown = 0;
      }
    }
    this.updateBow();
  }

  updateBow() {
    this.bowSprite.scaleX = this.facing;

    if (this.hasFired) {
      this.hasFired = false;
      this.scene.add.tween({
        targets: this.bowSprite,
        duration: 200,
        angle: 45 * this.facing,
        x: this.body.x + 16 + (this.facing * 6),
        y: this.body.y + 24
      });
    }

    if (this.isFiring) {
      this.shootDelay += this.scene.sys.game.loop.delta;
      if (this.shootDelay > this.SHOOT_DELAY_MAX) {
        this.shootDelay = 0;
        this.isFiring = false;
        this.hasFired = true;
        const bullet = new EnemyBullet(this.scene, this.x, this.y, this.facing);
        this.scene.add.existing(bullet);
        this.scene.enemyBullets.add(bullet);
      }
    }
  }

  shoot() {
    this.isFiring = true;
    this.scene.add.tween({
      targets: this.bowSprite,
      duration: 100,
      angle: 0,
      x: this.body.x + 16 + (this.facing * 12),
      y: this.body.y + 8
    });
  }

  die(): void {
    this.bowSprite.destroy();
    this.destroy();
  }

}
