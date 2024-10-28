import Phaser from "phaser";
import { LabelComponent } from "phaser-utils/src/components/Label";

export class OddsComponent extends Phaser.GameObjects.Container {
  private odds: LabelComponent[] = [];
  private numOdds: number = 8;

  private oddsImagePaths: string[] = [
    "fruitImg4",
    "fruitImg9",
    "fruitImg9",
    "fruitImg9",
    "fruitImg9",
    "fruitImg9",
    "fruitImg9",
    "fruitImg4",
  ];

  private oddsValues: string[] = [
    "100",
    "40",
    "30",
    "20",
    "20",
    "15",
    "10",
    "5",
  ];

  private oddsSize: Phaser.Math.Vector2 = new Phaser.Math.Vector2(90, 50);

  constructor(scene: Phaser.Scene) {
    super(scene, 47, 532);

    this.onLoad(scene);
    // scene.add.existing(this);
  }

  private onLoad(scene: Phaser.Scene) {
    for (let i = 0; i < this.numOdds; i++) {
      const imagePath = this.oddsImagePaths[i];
      const labelText = this.oddsValues[i];

      const textStyle =
        i === 0 || i === this.numOdds - 1
          ? {
              fontSize: "30px",
              fontStyle: "bold",
              color: "yellow",
            }
          : {
              fontSize: "30px",
              fontStyle: "bold",
              color: "#000000",
              stroke: "white",
              strokeThickness: 5,
            };

      const labeledSprite = new LabelComponent(scene, {
        imageKey: imagePath,
        text: labelText,
        imageSize: { width: this.oddsSize.x, height: this.oddsSize.y },
        textStyle: textStyle,
      });
      this.odds.push(labeledSprite);
      this.add(labeledSprite);
    }

    linePosition(
      this.odds,
      this.oddsSize,
      new Phaser.Math.Vector2(scene.scale.width, scene.scale.height)
    );
  }
}

export class ActiveOddsComponent extends Phaser.GameObjects.Container {
  private odds: LabelComponent[] = [];
  private numOdds: number = 6;
  private oddsValues: string[] = ["40", "30", "20", "20", "15", "10"];
  private oddsSize: Phaser.Math.Vector2 = new Phaser.Math.Vector2(90, 50);
  currentPos: number = 1;

  constructor(scene: Phaser.Scene) {
    super(scene, 47, 532);

    this.onLoad(scene);
    // scene.add.existing(this);
  }

  private onLoad(scene: Phaser.Scene) {
    for (let i = 0; i < this.numOdds; i++) {
      const imagePath = "fruitImg10";
      const labelText = this.oddsValues[i];

      const textStyle = {
        fontSize: "30px",
        fontStyle: "bold",
        color: "yellow",
      };

      const labeledSprite = new LabelComponent(scene, {
        imageKey: imagePath,
        text: labelText,
        imageSize: { width: this.oddsSize.x, height: this.oddsSize.y },
        textStyle: textStyle,
      });
      this.odds.push(labeledSprite);
      this.add(labeledSprite);
    }

    linePosition(
      this.odds,
      this.oddsSize,
      new Phaser.Math.Vector2(scene.scale.width, scene.scale.height)
    );
  }

  get_current_pos(): number {
    return this.currentPos;
  }

  set_current_pos(index: number): void {
    if (Number.isInteger(index) && index <= 2 && index >= 0) {
      this.currentPos = index;
    }
  }

  private odds_visible(index: number): void {
    for (let i = 0; i < 3; i++) {
      if (i === index) {
        this.odds[i].setVisible(true);
        this.odds[i + 3].setVisible(true);
      } else {
        this.odds[i].setVisible(false);
        this.odds[i + 3].setVisible(false);
      }
    }
  }

  move(): void {
    this.currentPos = (this.currentPos + 1) % 3;
    const pos = this.convertNumber(this.currentPos);
    this.odds_visible(pos);
    // this.odds_visible(this.currentPos);
  }

  private convertNumber(num: number): number {
    switch (num) {
      case 0:
        return 2;
      case 2:
        return 0;
      default:
        return 1;
    }
  }
}

function linePosition(
  components: LabelComponent[],
  size: Phaser.Math.Vector2,
  containerSize: Phaser.Math.Vector2
) {
  const spacing = 5;
  const totalWidth = components.length * (size.x + spacing);
  const startX = (containerSize.x - totalWidth) / 2;

  components.forEach((component, index) => {
    const x = startX + index * (size.x + spacing);
    component.setPosition(x, 532);
  });
}
