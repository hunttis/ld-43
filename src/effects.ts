import { GameScene } from "./gameScene";
import { GameObjects } from "phaser";

export class Effects {


  bloodParticles: GameObjects.Particles.ParticleEmitterManager;
  sparkParticles: GameObjects.Particles.ParticleEmitterManager;
  dustParticles: GameObjects.Particles.ParticleEmitterManager;
  rainParticles: GameObjects.Particles.ParticleEmitterManager;

  bloodEmitter!: GameObjects.Particles.ParticleEmitter;
  sparkEmitter!: GameObjects.Particles.ParticleEmitter;
  dustEmitter!: GameObjects.Particles.ParticleEmitter;
  rainEmitter!: GameObjects.Particles.ParticleEmitter;

  constructor(private scene: GameScene) {

    this.bloodParticles = this.scene.add.particles('blood');
    this.bloodParticles.depth = 99;
    this.sparkParticles = this.scene.add.particles('spark');
    this.sparkParticles.depth = 99;
    this.dustParticles = this.scene.add.particles('dust');
    this.dustParticles.depth = 99;
    this.rainParticles = this.scene.add.particles('rain');
    this.rainParticles.depth = 99;

    this.initEmitters();
  }

  initEmitters() {
    this.bloodEmitter = this.bloodParticles.createEmitter({
      lifespan: 1000,
      gravityY: 300,
      tint: 0x00aa00,
      speedX: { min: -100, max: 100 },
      speedY: { min: -200, max: 100 },
      alpha: 0.5,
    });
    this.bloodEmitter.stop();

    this.sparkEmitter = this.sparkParticles.createEmitter({
      lifespan: 2000,
      gravityY: 200,
      scale: { start: 1, end: 0 },
      speedX: { min: -100, max: 100 },
      speedY: { min: -200, max: 100 },
    });
    this.sparkEmitter.stop();

    this.dustEmitter = this.dustParticles.createEmitter({
      lifespan: 500,
      scale: { start: 2, end: 3 },
      alpha: 0.2,
      speedX: { min: -50, max: 50 },
      speedY: { min: -50, max: 50 },
    });
    this.dustEmitter.stop();

    this.rainEmitter = this.rainParticles.createEmitter({
      lifespan: 2000,
      gravityY: 300,
      tint: 0x00aa00,
      scale: { start: 2, end: 1 },
      alpha: 0,
      speedX: { min: -100, max: 100 },
      speedY: { min: -100, max: 100 },
    });
    this.rainEmitter.stop();
  }

  sparks(x: number, y: number) {
    this.sparkEmitter.explode(3, x, y);
  }

  bloodSpurt(x: number, y: number) {
    this.bloodEmitter.explode(10, x, y);
  }

  dustPuff(x: number, y: number) {
    this.dustEmitter.explode(10, x, y);
  }
}