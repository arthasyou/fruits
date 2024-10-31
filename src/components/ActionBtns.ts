import { ButtonComponent } from "phaser-utils/src/components/Button";
import { eventManager } from "phaser-utils/src/services/events";

export class ActionBtns extends Phaser.GameObjects.Container {
  private goBtn: ButtonComponent;
  private bigBtn: ButtonComponent;
  private smallBtn: ButtonComponent;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 985);

    this.goBtn = this.createGoBtn(scene);
    this.smallBtn = this.createSmallOrBigBtn(scene, { x: 450, y: 0 }, "1-7", 0);
    this.bigBtn = this.createSmallOrBigBtn(scene, { x: 530, y: 0 }, "8-14", 1);
  }

  // 专用方法，创建 goBtn，仅需指定基本属性
  private createGoBtn(scene: Phaser.Scene): ButtonComponent {
    const goBtn = new ButtonComponent(scene, {
      position: { x: 650, y: 0 },
      defaultTexture: "fruitBtnBet10",
      clickedTexture: "fruitBtnBet100",
      callbackUp: this.run.bind(this),
    });
    this.add(goBtn);
    return goBtn;
  }

  // 通用方法，创建 smallBtn 和 bigBtn
  private createSmallOrBigBtn(
    scene: Phaser.Scene,
    position: { x: number; y: number },
    text: string,
    index: number
  ): ButtonComponent {
    const btn = new ButtonComponent(scene, {
      position,
      defaultTexture: "fruitBtnBet12",
      clickedTexture: "fruitBtnBet122",
      text,
      textStyle: {
        fontSize: 25,
        stroke: "black",
        strokeThickness: 5,
        fontStyle: "bold",
        align: "right",
      },
      textPosition: { x: 0, y: -8 },
      callbackUp: () => this.handleBetChange(index),
    });
    this.add(btn);
    return btn;
  }

  private handleBetChange(index: number): void {
    eventManager.emit("request_big_or_small", index);
  }

  private run(): void {
    eventManager.emit("request_fruit_run");
  }

  set_goBtn_avalible(flag: boolean) {
    this.goBtn.set_available(flag);
  }

  set_big_or_small_avalibel(flag: boolean) {
    this.bigBtn.set_available(flag);
    this.smallBtn.set_available(flag);
  }
}
