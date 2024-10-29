import { LabelComponent } from "phaser-utils/src/components/Label";

export class Score extends Phaser.GameObjects.Container {
  private credit: LabelComponent;
  private bonus: LabelComponent;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 200);

    // 创建label的公共方法
    const createLabel = (x: number): LabelComponent => {
      return new LabelComponent(scene, {
        position: { x, y: 0 },
        text: "0",
        textStyle: {
          fontSize: 50,
          stroke: "black",
          strokeThickness: 5,
          fontStyle: "bold",
          align: "right",
        },
        imageKey: "coin",
        imageSize: { width: 340, height: 45 },
        textOrigin: { x: 1, y: 0.5 },
        textPosition: { x: 170, y: 0 },
      });
    };

    this.credit = createLabel(550);
    this.bonus = createLabel(200);

    this.add(this.credit);
    this.add(this.bonus);
  }

  set_credit(score: number): this {
    this.credit.setText(score.toString());
    return this;
  }
  set_bonus(score: number): this {
    this.bonus.setText(score.toString());
    return this;
  }
}
