import { Scene } from "phaser";
import LabelComponet from "phaser-utils/src/components/Label";
import { SpinComponent } from "phaser-utils/src/components/Spin";

// import { Components } from "phaser-utils";

export class Game extends Scene {
  private spin: SpinComponent;
  private coin: LabelComponet;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("background", "images/fruit_bg.png");
    this.load.image("spin_back", "images/fruit_bg_2.png");
    this.load.image("light", "images/fruit_icon_light.png");
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0, 0);
    this.add.image(375, 285, "spin_back").setOrigin(0.5, 0);

    this.spin = new SpinComponent(this, "light", 24, 90.57, 91, 103, 331);

    const splashIndices = new Set<number>([0, 2, 4]);
    splashIndices.add(6);
    splashIndices.clear();
    // this.spin.lightsVisible(splashIndices);

    this.spin.splash(splashIndices);

    // light.splash();
    // // light.setVisible(true);
    // light.setDisplaySize(100,50);
    // light.setSize(50, 50);
    // light.stop();
  }
}
