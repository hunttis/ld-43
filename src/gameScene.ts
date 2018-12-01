import { Scene, GameObjects, Input } from 'phaser';
const Sprite = GameObjects.Sprite;
type Sprite = GameObjects.Sprite;

export class GameScene extends Scene {

  level!: Phaser.Tilemaps.Tilemap;
  player!: Sprite;
  cursors!: Input.Keyboard.CursorKeys;;

  constructor() {
    super('GameScene');
  }

  create() {
    this.level = this.loadAndCreateMap();
    this.player = this.createPlayer();
    this.add.existing(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  loadAndCreateMap() {
    const map = this.make.tilemap({ key: 'level' });
    const tileset = map.addTilesetImage(
      'tiles',
      'tiles',
      map.tileWidth,
      map.tileHeight
    );

    const layer = map.createDynamicLayer('foreground', tileset, 0, 0);
    layer.depth = 100;
    return map;
  }

  createPlayer(): Sprite {
    const player = new Sprite(this, 100, 100, 'player');
    return player;
  }

  update() {
    if (this.cursors.left!.isDown) {
      this.player.x -= 5;
    } else if (this.cursors.right!.isDown) {
      this.player.x += 5;
    }

    if (this.cursors.up!.isDown) {
      console.log('jump!');
    }

  }
}
