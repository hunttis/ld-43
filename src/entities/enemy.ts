import { Physics, Scene, Input } from 'phaser';
import { GameScene } from '~/gameScene'
import { EnemySlash } from './enemyslash';

export abstract class Enemy extends Physics.Arcade.Sprite {
  scene!: GameScene;
  health: number = 100;
  smackSound: Phaser.Sound.BaseSound = this.scene.sound.add('smack');

  abstract die(): void;

  receiveHit(damage: number) {

    this.scene.effects.bloodSpurt(this.x, this.y);
    if (!this.smackSound.isPlaying) {
      this.smackSound.play();
    }

    this.health -= damage;
    if (this.health <= 0) {
      this.die();
    }
  }

}
