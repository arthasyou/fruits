import { ButtonComponent } from "phaser-utils/src/components/Button";
import { eventManager } from "phaser-utils/src/services/events";

export enum Direction {
  Left,
  Right,
}

export class ActionBtns extends Phaser.GameObjects.Container {
  private isKeyPressed: boolean = false;
  private timerId?: NodeJS.Timeout = undefined;
  private goBtn: ButtonComponent;
  private bigBtn: ButtonComponent;
  private smallBtn: ButtonComponent;
  private rightBtn: ButtonComponent;
  private leftBtn: ButtonComponent;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 985);

    this.goBtn = this.createGoBtn(scene);
    this.bigBtn = this.createSmallOrBigBtn(scene, { x: 530, y: 0 }, "8-14", 1);
    this.smallBtn = this.createSmallOrBigBtn(scene, { x: 440, y: 0 }, "1-7", 0);
    this.rightBtn = this.createArrowBtn(
      scene,
      { x: 320, y: 0 },
      "→",
      Direction.Right
    );
    this.leftBtn = this.createArrowBtn(
      scene,
      { x: 230, y: 0 },
      "←",
      Direction.Left
    );
  }

  // 专用方法，创建 goBtn，仅需指定基本属性
  private createGoBtn(scene: Phaser.Scene): ButtonComponent {
    const goBtn = new ButtonComponent(scene, {
      position: { x: 650, y: 44 },
      defaultTexture: "fruitBtnBet10",
      clickedTexture: "fruitBtnBet100",
      callbackUp: this.run.bind(this),
      align: "bottom",
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
      callbackUp: () => this.handleBigOrSmall(index),
    });
    this.add(btn);
    return btn;
  }

  private createArrowBtn(
    scene: Phaser.Scene,
    position: { x: number; y: number },
    text: string,
    direction: Direction
  ): ButtonComponent {
    const btn = new ButtonComponent(scene, {
      position,
      defaultTexture: "fruitBtnBet12",
      clickedTexture: "fruitBtnBet122",
      text,
      textStyle: {
        fontSize: 40,
        stroke: "black",
        strokeThickness: 5,
        fontStyle: "bold",
        align: "right",
      },
      textPosition: { x: 0, y: -16 },
      callbackDown: () => this.press_down(direction),
      callbackUp: () => this.handleScore(direction),
      callbackOut: () => this.handleScore(direction),
    });
    this.add(btn);
    return btn;
  }

  private handleBigOrSmall(index: number): void {
    eventManager.emit("request_big_or_small", index);
  }

  private run(): void {
    eventManager.emit("request_fruit_run");
  }

  private handleScore(deriction: Direction): void {
    this.isKeyPressed = false;
    this.cancel_time();
    eventManager.emit("request_change_score", deriction);
  }

  set_goBtn_avalible(flag: boolean) {
    this.goBtn.set_available(flag);
  }

  set_big_or_small_avalibel(flag: boolean) {
    this.bigBtn.set_available(flag);
    this.smallBtn.set_available(flag);
    this.leftBtn.set_available(flag);
    this.rightBtn.set_available(flag);
  }

  private press_down(deriction: Direction): void {
    if (this.timerId === undefined) {
      this.isKeyPressed = true;
      this.timerId = setTimeout(() => {
        this.long_press(deriction);
      }, 500);
    }
  }

  private long_press(deriction: Direction): void {
    if (this.isKeyPressed) {
      this.timerId = setTimeout(() => {
        eventManager.emit("request_change_score", deriction);
        this.long_press(deriction);
      }, 30);
    }
  }

  cancel_time(): void {
    // console.log(this.timerId);
    this.isKeyPressed = false;
    if (this.timerId !== undefined) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }
}
