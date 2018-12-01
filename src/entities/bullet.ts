import { Scene, GameObjects } from "phaser";

export class Bullet {
  constructor(scene: Scene, group: GameObjects.Group, parent: GameObjects.Image) {
    const image = scene.physics.add.image(parent.x, parent.y, 'bullet');
    group.add(image)
  }

  update() {

  }
}
