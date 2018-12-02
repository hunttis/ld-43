import { GameObjects, Scene, Input } from "phaser";

export class StoryScene extends Scene {

  levelNumber!: integer;

  lines: string[][] = [
    // 1
    [
      'Champion!',
      'What do you think you are doing?',
      'I will have your shield!'
    ],

    // 2
    [
      'Fnorp'
    ]
  ];

  currentLine: integer = 0;
  deity!: GameObjects.Sprite;

  textBox!: GameObjects.Text;

  nextLineKey!: Input.Keyboard.Key;

  constructor() {
    super('StoryScene');
  }

  init(data: any) {
    this.levelNumber = data.levelNumber;
  }

  create() {
    this.createBackground();
    this.nextLineKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.createDeityPortrait();
    this.createTextBox();
  }

  createBackground() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x5ffaff, 0x56faff, 0x3333ff, 0x3333ff, 1);
    graphics.fillRect(0, 0, Number(this.game.config.width), Number(this.game.config.height));
    graphics.setScrollFactor(0);
  }

  createDeityPortrait() {
    this.deity = this.add.sprite(0, Number(this.game.config.height), 'deity');
    this.deity.displayOriginX = 0;
    this.deity.displayOriginY = this.deity.height;
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0x442288);

    graphics.strokeRect(0,
      Number(this.game.config.height) - this.deity.height,
      this.deity.width,
      this.deity.height);
  }

  createTextBox() {
    const graphics = this.add.graphics();
    const paddingSides = 16;
    const deityWidth = this.deity.width;
    const screenWidth = Number(this.game.config.width);
    const screenHeight = Number(this.game.config.height);
    const textArea = screenWidth - deityWidth - paddingSides * 2;
    graphics.fillStyle(0x222222);
    graphics.fillRect(deityWidth + paddingSides, 300, screenWidth - deityWidth - 32, screenHeight - 332);
    graphics.lineStyle(4, 0x444444);
    graphics.strokeRect(deityWidth + paddingSides, 300, screenWidth - deityWidth - 32, screenHeight - 332);

    this.textBox = this.add.text(deityWidth + paddingSides * 2, 300 + paddingSides, this.lines[this.levelNumber][0], { wordWrap: { width: textArea } });
  }

  update() {
    if (Input.Keyboard.JustDown(this.nextLineKey)) {
      this.currentLine++;
      if (this.currentLine >= this.lines.length) {
        this.scene.start('GameScene', { levelNumber: this.levelNumber + 1 });
      } else {
        this.textBox.text = this.lines[this.levelNumber][this.currentLine];
      }
    }

  }

}