import { Game, AUTO, Scene } from 'phaser';

export class MenuScene extends Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    this.add.text(100, 100, 'Zomg template');
    this.add.text(100, 200, 'Klik bare to beggin');
    const sprite = this.add.sprite(400, 300, 'bear').setInteractive();

    sprite.on('pointerdown', (pointer: any) => {
      this.scene.start('GameScene');
    });
  }

  update() {}
}
