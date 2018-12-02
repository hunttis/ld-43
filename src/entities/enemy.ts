import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene'
import { EnemySlash } from './enemyslash';

export class Enemy extends Physics.Arcade.Sprite {
  scene!: GameScene;

  receiveHit(damage: number) {
    console.log('Aarrr! Got ', damage, ' damage');
  }

}
