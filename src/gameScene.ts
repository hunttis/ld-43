import { Scene } from 'phaser';

export class GameScene extends Scene {

  level!: Phaser.Tilemaps.Tilemap;


  constructor() {
    super('GameScene');
  }

  create() {
    this.level = this.loadAndCreateMap();
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


  update() {

  }
}
