import { Game, AUTO, Scene } from 'phaser';
import * as assets from './assets/*.png';
import { MenuScene } from './menuScene';
import { GameScene } from './gameScene';
import GameScalePlugin from 'phaser-plugin-game-scale';

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

const gameScalePgin: PluginObject = {
  global: [{
    key: 'GameScalePlugin',
    plugin: GameScalePlugin,
    mapping: 'gameScale',
    data: {/* See 'Configuration'*/ }
  }]
}

const config: GameConfig = {
  type: AUTO,
  width: 800,
  height: 400,
  parent: 'game-container',
  render: {
    antialias: false
  },
  physics: {
    default: 'impact',
    impact: {
      gravity: 400
    }

  },
  scene: [InitScene, MenuScene, GameScene],
  plugins: gameScalePgin,
};

if (module.hot) {
  module.hot.dispose(function () {
    window.location.reload();
  });
}

const gameContainer = document.getElementById(config.parent)!;
const game = new Game(config);

declare const module: any;
