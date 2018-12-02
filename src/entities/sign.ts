import { GameObjects, Physics } from "phaser";
import { GameScene } from "~/gameScene";
import { Player } from "./player";

export class Sign extends Physics.Arcade.Sprite {

  body!: Physics.Arcade.Body;
  scene: GameScene;
  text: string;
  textBox: GameObjects.Graphics;
  textContent: GameObjects.Text;

  signLocationX: integer = 100;
  signLocationY: integer = 50;
  signWidth: integer = 300;
  signHeight: integer = 150;
  signPadding: integer = 10;

  reading: boolean = false;

  fadeoutCooldown: number = 0;

  constructor(scene: GameScene, x: number, y: number, text: string) {
    super(scene, x, y, 'sign');
    this.scene = scene;
    scene.physics.world.enableBody(this, 0);
    this.body.allowGravity = false;
    this.text = text;
    this.textBox = this.scene.add.graphics();
    this.textBox.setScrollFactor(0);
    this.textBox.fillStyle(0xffe682);
    this.textBox.fillRect(this.signLocationX, this.signLocationY, this.signWidth, this.signHeight);
    this.textBox.lineStyle(4, 0x8c4100);
    this.textBox.strokeRect(this.signLocationX, this.signLocationY, this.signWidth, this.signHeight);

    this.textContent = this.scene.add.text(0, 0, text, {
      color: 0xff0000,
      align: 'center',
      wordWrap: {
        width: this.signWidth - (2 * this.signPadding)
      }
    });
    this.textContent.setOrigin(0.5);
    this.textContent.x = this.signLocationX + this.signWidth / 2;
    this.textContent.y = this.signLocationY + this.signHeight / 2;
    this.textContent.setScrollFactor(0);

    this.textBox.depth = 120;
    this.textContent.depth = 120;

    this.textBox.visible = false;
    this.textContent.visible = false;
  }

  update() {
    super.update();

    if (this.fadeoutCooldown >= 0) {
      this.fadeoutCooldown -= this.scene.sys.game.loop.delta / 1000;
      this.textContent.alpha = this.fadeoutCooldown;
      this.textBox.alpha = this.fadeoutCooldown;
    }

    if (this.fadeoutCooldown < 0) {
      this.textBox.visible = false;
      this.textContent.visible = false;
    }
  }

  isBeingRead() {
    this.textBox.visible = true;
    this.textContent.visible = true;
    this.fadeoutCooldown = 1;
  }


}