import { Scene, GameObjects, Input } from 'phaser';

export class GameOverScene extends Scene {

  gameOverText!: GameObjects.Text;
  gameOverReasonText!: GameObjects.Text;
  pressSpaceKey!: GameObjects.Text;
  gameOverReason!: string;

  mainmenuKey!: Input.Keyboard.Key;

  constructor() {
    super('GameOverScene');
  }

  init(data: any) {
    this.gameOverReason = data.gameOverReason;
  }

  create() {
    this.mainmenuKey = this.input.keyboard.addKey(Input.Keyboard.KeyCodes.SPACE);

    const screenCenterX = Number(this.game.config.width) / 2;

    this.gameOverText = this.add.text(screenCenterX, 100, 'Game Over', { align: 'center', fontSize: 64 });
    this.gameOverText.setOrigin(0.5);
    this.gameOverText.x = screenCenterX;

    this.gameOverReasonText = this.add.text(screenCenterX, 220, 'You didn\'t save Fluffy.\nYour life is empty and void.', { align: 'center' });
    this.gameOverReasonText.setOrigin(0.5)
    this.gameOverReasonText.x = screenCenterX;

    this.pressSpaceKey = this.add.text(screenCenterX, 360, 'Press space to return to the Main Menu', { align: 'center' });
    this.pressSpaceKey.setOrigin(0.5);
    this.pressSpaceKey.x = screenCenterX;

  }

  update() {
    if (Input.Keyboard.JustDown(this.mainmenuKey)) {
      this.scene.start('StoryScene', { levelNumber: 0 });

    }
  }
}
