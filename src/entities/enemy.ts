import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene'
import { EnemySlash } from './enemyslash';

export abstract class Enemy extends Physics.Arcade.Sprite {
  scene!: GameScene;
  health: number = 100;

  abstract die(): void;

  receiveHit(damage: number) {
    console.log('Aarrr! Got ', damage, ' damage');
    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    }
  }

}
