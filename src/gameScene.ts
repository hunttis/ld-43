import { Game, AUTO, Scene, GameObjects, Geom, Physics } from 'phaser';

export class GameScene extends Scene {
  bearSprite!: GameObjects.Sprite;
  buffaloSprite!: GameObjects.Sprite;
  physicalBear!: Physics.Arcade.Sprite;
  buffaloContainer!: GameObjects.Container;

  constructor() {
    super('GameScene');
  }

  create() {
    this.add.text(50, 50, 'Ololoo bear bufalo');

    this.bearSprite = this.add.sprite(100, 200, 'bear');
    this.buffaloSprite = this.add.sprite(0, 0, 'buffalo');
    this.buffaloContainer = this.add.container(400, 300);
    this.buffaloContainer.add(this.buffaloSprite);
    this.buffaloContainer.add(this.add.text(50, 20, 'Ammuuu'));

    this.physicalBear = this.physics.add.sprite(100, 200, 'bear');
    this.physicalBear.setVelocity(100, 200);
    this.physicalBear.setBounce(1, 1);
    this.physicalBear.setCollideWorldBounds(true);

    this.tweens.add({
      targets: this.buffaloContainer,
      scaleX: 0.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  i = 0;
  update() {
    this.bearSprite.setRotation(this.bearSprite.rotation + 0.1);
    this.buffaloContainer.setRotation(this.buffaloContainer.rotation - 0.05);

    this.i++;
    if (this.i % 10 === 0) {
      this.buffaloSprite.setTint(
        Math.random() * 0xff0011,
        Math.random() * 0xff0011,
        Math.random() * 0xff0011,
        Math.random() * 0xff0011
      );
    }

    if (this.bearSprite.x + this.bearSprite.width > this.cameras.main.width) {
      this.bearSprite.x -= 1;
    } else {
      this.bearSprite.x += 1;
    }
  }
}
