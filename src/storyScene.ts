import { GameObjects, Scene, Input } from "phaser";

export class StoryScene extends Scene {

  levelNumber!: integer;

  deities: string[] = [
    'exo',
    'hunttis',
    'exo',
    'hunttis',
    'exo',
    'hunttis',
    'exo',
    'hunttis',
    'exo'
  ]

  moods: string[][] = [
    [
      'angry',
      'normal',
      'smirk',
      'angry'
    ],
    [
      'angry',
      'normal',
      'smirk',
      'smirk'
    ],
    ['angry'],
    ['angry']
  ]

  lines: string[][] = [
    // 0 - Beginning
    [
      'Champion!',
      'We need you to fight our war!',
      'For the battle, we will give you immense power!',
      'Take these. Now go forth!'
    ],

    // 1 - Continued victories
    [
      'Champion!',
      'Well done!',
      'We want more blood!',
      'Go kill!'
    ],

    // 2 - You may take a vacation
    ['Champion!'],

    // 3 - Want to find fluffy? we'll take shield
    ['Gimme shield?'],

    // 4 - Shield still gone?
    ['Miss your shield?'],

    // 5 - bow gone!
    ['RRAAAA'],

    // 6 - Double jump taken
    ['Gimme double jump'],

    // 7 - Near the end
    ['Fine!'],

    // 8 - Ending
    ['End']
  ];

  currentLine: integer = 0;
  normaldeity!: GameObjects.Sprite;
  angrydeity!: GameObjects.Sprite;
  smirkdeity!: GameObjects.Sprite;

  textBox!: GameObjects.Text;

  nextLineKey!: Input.Keyboard.Key;

  constructor() {
    super('StoryScene');
  }

  init(data: any) {
    this.currentLine = 0;
    this.levelNumber = data.levelNumber;
  }

  create() {
    this.createBackground();
    this.nextLineKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);
    this.createDeityPortraits();
    this.createTextBox();
    this.showProperDeity();
  }

  createBackground() {
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x5ffaff, 0x56faff, 0x3333ff, 0x3333ff, 1);
    graphics.fillRect(0, 0, Number(this.game.config.width), Number(this.game.config.height));
    graphics.setScrollFactor(0);
  }

  createDeityPortraits() {

    console.log(this.deities);
    this.normaldeity = this.add.sprite(0, Number(this.game.config.height), 'deity_normal_' + this.deities[this.levelNumber]);
    this.normaldeity.displayOriginX = 0;
    this.normaldeity.displayOriginY = this.normaldeity.height;

    this.angrydeity = this.add.sprite(0, Number(this.game.config.height), 'deity_angry_' + this.deities[this.levelNumber]);
    this.angrydeity.displayOriginX = 0;
    this.angrydeity.displayOriginY = this.angrydeity.height;

    this.smirkdeity = this.add.sprite(0, Number(this.game.config.height), 'deity_smirk_' + this.deities[this.levelNumber]);
    this.smirkdeity.displayOriginX = 0;
    this.smirkdeity.displayOriginY = this.smirkdeity.height;

    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0x442288);

    graphics.strokeRect(0,
      Number(this.game.config.height) - this.normaldeity.height,
      this.normaldeity.width,
      this.normaldeity.height);

    console.log('lines this time', this.lines[this.levelNumber].length);
  }


  createTextBox() {
    const graphics = this.add.graphics();
    const paddingSides = 16;
    const deityWidth = this.normaldeity.width;
    const screenWidth = Number(this.game.config.width);
    const screenHeight = Number(this.game.config.height);
    const textArea = screenWidth - deityWidth - paddingSides * 2;
    graphics.fillStyle(0x222222);
    graphics.fillRect(deityWidth + paddingSides, 300, screenWidth - deityWidth - 32, screenHeight - 332);
    graphics.lineStyle(4, 0x444444);
    graphics.strokeRect(deityWidth + paddingSides, 300, screenWidth - deityWidth - 32, screenHeight - 332);

    this.textBox = this.add.text(deityWidth + paddingSides * 2, 300 + paddingSides, this.lines[this.levelNumber][0], { wordWrap: { width: textArea } });
  }

  showProperDeity() {
    if (this.moods[this.levelNumber][this.currentLine] === 'angry') {
      this.angrydeity.visible = true;
      this.normaldeity.visible = false;
      this.smirkdeity.visible = false;
    } else if (this.moods[this.levelNumber][this.currentLine] === 'normal') {
      this.angrydeity.visible = false;
      this.normaldeity.visible = true;
      this.smirkdeity.visible = false;
    } else if (this.moods[this.levelNumber][this.currentLine] === 'smirk') {
      this.angrydeity.visible = false;
      this.normaldeity.visible = false;
      this.smirkdeity.visible = true;
    }
  }

  update() {
    if (Input.Keyboard.JustDown(this.nextLineKey)) {
      console.log('currentLine', this.currentLine);
      this.currentLine++;
      if (this.currentLine >= this.lines[this.levelNumber].length) {
        this.scene.start('GameScene', { levelNumber: this.levelNumber });
      } else {
        this.showProperDeity();
        this.textBox.text = this.lines[this.levelNumber][this.currentLine];
      }
    }

  }

}