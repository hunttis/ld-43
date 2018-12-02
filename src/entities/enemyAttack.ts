import { GameObjects, Physics } from "phaser";
import { GameScene } from "~/gameScene";

export abstract class EnemyAttack extends Physics.Arcade.Sprite {
  scene!: GameScene
  body!: Physics.Arcade.Body

  abstract getDamage(): number;
  abstract hitsSomething(): void;
  abstract doesThisCollideWithLevel(): boolean;
}
