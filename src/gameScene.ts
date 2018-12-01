import { Scene, GameObjects, Input, Physics } from 'phaser';
const Sprite = GameObjects.Sprite;
type Sprite = GameObjects.Sprite;

export class GameScene extends Scene {

  level!: Phaser.Tilemaps.Tilemap;
  player!: Physics.Matter.Image;
  cursors!: Input.Keyboard.CursorKeys;;

  constructor() {
    super('GameScene');
  }

  create() {
    this.level = this.loadAndCreateMap();
    this.player = this.createPlayer();
    this.add.existing(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.matter.world.setBounds(0, 0, 800, 600);
    this.cameras.main.startFollow(this.player);
  }

  loadAndCreateMap() {
    const map = this.make.tilemap({ key: 'level' });
    const tileset = map.addTilesetImage(
      'tiles',
      'tiles',
      map.tileWidth,
      map.tileHeight
    );

    const layer: Phaser.Tilemaps.DynamicTilemapLayer = map.createDynamicLayer('foreground', tileset, 0, 0);
    layer.depth = 100;

    for (let y = 0; y < layer.height / tileset.tileHeight; y++) {
      for (let x = 0; x < layer.width / tileset.tileWidth; x++) {

        const tile = layer.getTileAt(x, y);
        if (tile) {
          tile.setCollision(true);
        }
      }
    }
    // layer.setCollisionByProperty({ collides: true });
    // layer.setCollisionBetween(1, 19, true, true);
    this.matter.world.convertTilemapLayer(layer);
    this.matter.world.createDebugGraphic();
    return map;
  }

  createPlayer(): Physics.Matter.Image {
    const player = this.matter.add.image(100, 100, 'player');

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
