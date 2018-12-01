import { Game, AUTO, Scene } from 'phaser';
import * as assets from './assets/*.png';
import * as jsonAssets from './assets/*.json';
import { MenuScene } from './menuScene';
import { GameScene } from './gameScene';
import GameScalePlugin from 'phaser-plugin-game-scale';
import playerImage from './assets/player/player.png';
import playerNormalmap from './assets/player/player_n.png';

class InitScene extends Scene {
  preload() {
    for (const [name, path] of Object.entries(assets)) {
      this.load.image(name, path as string);
    }
    this.load.image('player', [playerImage, playerNormalmap]);
    for (const [name, path] of Object.entries(jsonAssets)) {
      this.load.tilemapTiledJSON(name, path as string);
      console.log('loaded', path, '->', name);
    }
  }

  create() {
    this.scene.start('GameScene');
  }
}

const gameScalePlugin = {
  key: 'GameScalePlugin',
  plugin: GameScalePlugin,
  mapping: 'gameScale',
  data: {
    /* See 'Configuration'*/
  }
};

const config: GameConfig = {
  type: AUTO,
  width: 800,
  height: 400,
  parent: 'game-container',
  render: {
    antialias: false
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      gravity: { y: 400 },
      debugShowStaticBody: true
    },

  },
  scene: [InitScene, MenuScene, GameScene],
  plugins: {
    global: [gameScalePlugin]
  }
};

if (module.hot) {
  module.hot.dispose(function () {
    window.location.reload();
  });
}

const game = new Game(config);

declare const module: any;
