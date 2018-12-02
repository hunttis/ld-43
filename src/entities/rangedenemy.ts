import { Physics, Scene, Input, GameObjects } from 'phaser';
import { GameScene } from '~/gameScene'
import { EnemyBullet } from './enemybullet';
import { Enemy } from './enemy';

export class RangedEnemy extends Enemy {
  WEAPON_COOLDOWN_MAX: number = 2500;

  bowSprite!: GameObjects.Sprite;

  seesPlayer: boolean = false;
  weaponCooldown: number = 0;
  facing!: integer;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y, 'player');
    scene.physics.world.enableBody(this, 0);
    this.tint = 0x00ff00;
    this.setPipeline('Light2D');

    this.bowSprite = new GameObjects.Sprite(scene, this.body.x, this.body.y, 'bow');
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
    if (distanceToPlayer < 1000) {
      if (this.weaponCooldown > this.WEAPON_COOLDOWN_MAX) {
        this.shoot();
        this.weaponCooldown = 0;
      }
    }
    this.updateBow();
  }

  updateBow() {
    this.bowSprite.scaleX = this.facing;
    this.bowSprite.setPosition(this.body.x + 16 + (this.facing * 8), this.body.y + 12);
  }

  shoot() {
    const bullet = new EnemyBullet(this.scene, this.x, this.y, this.facing);
    this.scene.add.existing(bullet);
    this.scene.enemyBullets.add(bullet);
  }

}
