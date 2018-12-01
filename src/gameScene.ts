import { Scene, GameObjects, Input, Physics } from 'phaser';
import { Player } from '~/player';

const Sprite = GameObjects.Sprite;
type Sprite = GameObjects.Sprite;

export class GameScene extends Scene {

  level!: Phaser.Tilemaps.Tilemap;
  player!: Player;
  cursors!: Input.Keyboard.CursorKeys;
  layer!: Phaser.Tilemaps.StaticTilemapLayer;
  debugGraphics!: any;


  constructor() {
    super('GameScene');
  }

  create() {
    this.level = this.loadAndCreateMap();
    this.player = new Player(this);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player.physicsImage);
    this.debugGraphics = this.add.graphics();
    this.physics.add.collider(this.player.physicsImage, this.layer);
  }

  loadAndCreateMap() {
    const map = this.make.tilemap({ key: 'level' });
    const tileset = map.addTilesetImage(
      'tiles',
      'tiles',
      map.tileWidth,
      map.tileHeight
    );

    const layer = map.createStaticLayer('foreground', tileset, 0, 0);
    layer.setCollisionByProperty({ collides: true })
    layer.depth = 100;
    this.layer = layer;
    return map;
  }

  update() {
    this.player.update();
  }
}
