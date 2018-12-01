import { Scene, GameObjects, Input, Physics } from 'phaser';
import { platform } from 'os';
const Sprite = GameObjects.Sprite;
type Sprite = GameObjects.Sprite;

export class GameScene extends Scene {

  level!: Phaser.Tilemaps.Tilemap;
  player!: Physics.Arcade.Image;
  cursors!: Input.Keyboard.CursorKeys;
  layer!: Phaser.Tilemaps.StaticTilemapLayer;
  debugGraphics!: any;


  constructor() {
    super('GameScene');
  }

  create() {
    this.level = this.loadAndCreateMap();
    this.player = this.createPlayer();
    this.add.existing(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.startFollow(this.player);
    this.debugGraphics = this.add.graphics();
    this.physics.add.collider(this.player, this.layer);
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

  createPlayer(): Physics.Arcade.Image {
    const player = this.physics.add.image(100, 100, 'player');
    return player;
  }

  update() {
    if (this.cursors.left!.isDown) {
      this.player.setVelocityX(-100);
    } else if (this.cursors.right!.isDown) {
      this.player.setVelocityX(100);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up!.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-200);
      this.layer.renderDebug(this.debugGraphics, { tileColor: null });

    }

  }
}
