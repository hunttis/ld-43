import { Game, AUTO, Scene } from 'phaser';
import * as assets from './assets/*.png';
import * as jsonAssets from './assets/*.json';
import { MenuScene } from './menuScene';
import { GameScene } from './gameScene';
import { StoryScene } from './storyScene';
import GameScalePlugin from 'phaser-plugin-game-scale';
import playerImage from './assets/animated/player.png';
import playerNormalmap from './assets/player/player_n.png';

class InitScene extends Scene {
  preload() {
    for (const [name, path] of Object.entries(assets)) {
      console.log('loaded', path, '->', name);
      this.load.image(name, path as string);
    }
    // this.load.image('player', [playerImage as string, playerNormalmap as string]);

    for (const [name, path] of Object.entries(jsonAssets)) {
      this.load.tilemapTiledJSON(name, path as string);
      console.log('loaded', path, '->', name);
    }

    const result = this.load.spritesheet('player', playerImage as string, { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.scene.start('GameScene', { levelNumber: 0 });

    const playerIdle = {
      key: 'playerIdle',
      frames: this.anims.generateFrameNumbers('player', { frames: [0] }),
      frameRate: 1,
    }
    this.anims.create(playerIdle);
    const playerConfig = {
      key: 'playerWalk',
      frames: this.anims.generateFrameNumbers('player', { frames: [2, 3, 4, 5, 6, 7, 8] }),
      frameRate: 10,
      repeat: -1
    }
    this.anims.create(playerConfig);
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
      debug: false,
      gravity: { y: 400 },
      debugShowStaticBody: true
    },

  },
  scene: [InitScene, MenuScene, GameScene, StoryScene],
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
