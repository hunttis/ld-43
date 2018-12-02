import { Physics } from "phaser";
import { GameScene } from "~/gameScene";

export abstract class EnemyAttack extends Physics.Arcade.Sprite {
  scene!: GameScene
  body!: Physics.Arcade.Body
  used: boolean = false;
  abstract damage: number;

  getDamage() {
    const damage = this.used ? 0 : this.damage;
    this.used = true;
    return damage
  }

  abstract hitsSomething(): void;
  abstract doesThisCollideWithLevel(): boolean;
}
