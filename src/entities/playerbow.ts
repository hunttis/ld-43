import { GameObjects } from "phaser";
import { GameScene } from "~/gameScene";
import { Player } from "./player";
import { Bullet } from "./bullet";

export class PlayerBow extends GameObjects.Sprite {
  SHOOT_DELAY_MAX: number = 100;
  STASH_BOW_DELAY_MAX: number = 500;

  scene!: GameScene;

  shootDelay: number = 100;
  isFiring: boolean = false;
  hasFired: boolean = false;
  stashBowDelay: number = 500;

  bowSound1: Phaser.Sound.BaseSound;
  bowSound2: Phaser.Sound.BaseSound;
  bowSound3: Phaser.Sound.BaseSound;

  constructor(scene: GameScene, x: number, y: number, private owner: Player, private bulletGroup: GameObjects.Group) {
    super(scene, x, y, 'bow');
    this.bowSound1 = this.scene.sound.add('bow1');
    this.bowSound2 = this.scene.sound.add('bow2');
    this.bowSound3 = this.scene.sound.add('bow3');
  }

  update() {
    this.scaleX = this.owner.direction;
    this.setPosition(this.owner.body.x + 16 + (this.owner.direction * 8), this.owner.body.y + 12);
    if (this.isFiring) {
      this.shootDelay -= this.scene.sys.game.loop.delta;
      if (this.shootDelay < 0) {
        const bullet = new Bullet(this.scene, this, this.owner.direction);
        this.bulletGroup.add(bullet);
        this.scene.add.existing(bullet);
        this.isFiring = false;
        this.shootDelay = this.SHOOT_DELAY_MAX;
        this.hasFired = true;
        this.stashBowDelay = this.STASH_BOW_DELAY_MAX;
      }
    }
    if (this.hasFired) {
      this.stashBowDelay -= this.scene.sys.game.loop.delta;
      if (this.stashBowDelay < 0) {
        this.hasFired = false;
        this.scene.add.tween({
          targets: this,
          duration: 200,
          alpha: 0,
          angle: 100 * this.owner.direction
        })
      }
    }
  }

  shoot() {
    const bowSound = Math.round(Math.random() * 2) + 1;
    if (bowSound === 1) {
      this.bowSound1.play();
    } else if (bowSound === 2) {
      this.bowSound2.play();
    } else if (bowSound === 3) {
      this.bowSound3.play();
    }
    this.isFiring = true;
    this.setAngle(0);
    this.scene.add.tween({
      targets: this,
      duration: 50,
      alpha: 1
    })
  }
}