import { Game, AUTO, Scene } from 'phaser';
import * as assets from './assets/*.png';
import * as jsonAssets from './assets/*.json';
import { MenuScene } from './menuScene';
import { GameScene } from './gameScene';
import { StoryScene } from './storyScene';
import { GameOverScene } from './gameOverScene';
import GameScalePlugin from 'phaser-plugin-game-scale';
import playerImage from './assets/animated/player.png';
import bow1 from './assets/bow1.mp3';
import bow2 from './assets/bow2.mp3';
import bow3 from './assets/bow3.mp3';
import bong from './assets/bong.mp3';
import smack from './assets/smack.mp3';
import clonk from './assets/clonk.mp3';
import tonk from './assets/tonk.mp3';
import thwup from './assets/thwup.mp3';
import hop1 from './assets/hop1.mp3';
import hop2 from './assets/hop2.mp3';
import hop3 from './assets/hop3.mp3';
import music from './assets/sacrifices.mp3';


class InitScene extends Scene {
  music!: Phaser.Sound.BaseSound;

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

    this.load.audio('bow1', bow1);
    this.load.audio('bow2', bow2);
    this.load.audio('bow3', bow3);
    this.load.audio('bong', bong);
    this.load.audio('tonk', tonk);
    this.load.audio('clonk', clonk);
    this.load.audio('smack', smack);
    this.load.audio('thwup', thwup);
    this.load.audio('hop1', hop1);
    this.load.audio('hop2', hop2);
    this.load.audio('hop3', hop3);
    this.load.audio('music', music);
  }

  create() {
    this.music = this.sound.add('music');
    this.music.play('', { loop: true });

    this.scene.start('MenuScene', { levelNumber: 0 });

    const playerJumping = {
      key: 'playerJumping',
      frames: this.anims.generateFrameNumbers('player', { frames: [6] }),
      frameRate: 1,
    }
    const playerFalling = {
      key: 'playerFalling',
      frames: this.anims.generateFrameNumbers('player', { frames: [7] }),
      frameRate: 1,
    }
    const playerIdle = {
      key: 'playerIdle',
      frames: this.anims.generateFrameNumbers('player', { frames: [0] }),
      frameRate: 1,
    }
    const playerConfig = {
      key: 'playerWalk',
      frames: this.anims.generateFrameNumbers('player', { frames: [2, 3, 4, 5, 6, 7, 8] }),
      frameRate: 10,
      repeat: -1
    }
    this.anims.create(playerJumping);
    this.anims.create(playerFalling);
    this.anims.create(playerIdle);
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
  scene: [InitScene, MenuScene, GameScene, StoryScene, GameOverScene],
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
