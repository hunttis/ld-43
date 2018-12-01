import { Game, AUTO, Scene } from 'phaser';
import * as assets from './assets/*.png';
import { MenuScene } from './menuScene';
import { GameScene } from './gameScene';

class InitScene extends Scene {
  preload() {
    for (const [name, path] of Object.entries(assets)) {
      this.load.image(name, path as string);
    }
  }

  create() {
    this.scene.start('MenuScene');
  }
}

const config = {
  type: AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: [InitScene, MenuScene, GameScene]
};

const gameContainer = document.getElementById(config.parent)!;
const game = new Game(config);

declare const module: any;
