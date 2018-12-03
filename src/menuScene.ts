import { Scene, GameObjects, Input } from 'phaser';

export class MenuScene extends Scene {

  gameTitle!: GameObjects.Text;
  pressSpaceKey!: GameObjects.Text;
  instructions!: GameObjects.Text;

  mainmenuKey!: Input.Keyboard.Key;

  constructor() {
    super('MenuScene');
  }

  create() {
    this.mainmenuKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);

    const screenCenterX = Number(this.game.config.width) / 2;

    this.gameTitle = this.add.text(screenCenterX, 100, 'GOD GIVEN GIFTS,\nTAKEN', { fontFamily: 'Arial Black', align: 'center', fontSize: 64 });
    this.gameTitle.setOrigin(0.5);
    this.gameTitle.x = screenCenterX;
    this.gameTitle.setStroke('#aaaaaa', 16);
    this.gameTitle.setShadow(2, 2, '#333333', 2, true, false);

    this.pressSpaceKey = this.add.text(screenCenterX, 300, 'Arrow keys to control. Z, X, C to use powers!', { align: 'center' });
    this.pressSpaceKey.setOrigin(0.5);
    this.pressSpaceKey.x = screenCenterX;

    this.pressSpaceKey = this.add.text(screenCenterX, 360, 'Press space to begin!', { align: 'center' });
    this.pressSpaceKey.setOrigin(0.5);
    this.pressSpaceKey.x = screenCenterX;
  }

  update() {
    if (Input.Keyboard.JustDown(this.mainmenuKey)) {
      this.scene.start('StoryScene', { levelNumber: 0 });
    }
  }
}
