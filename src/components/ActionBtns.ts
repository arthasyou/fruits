import { ButtonComponent } from "phaser-utils/src/components/Button";
import { eventManager } from "phaser-utils/src/services/events";

export class ActionBtns extends Phaser.GameObjects.Container {
  private goBtn: ButtonComponent;
  // private controller: GameController;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 985);

    this.createGoBtn(scene);
    // this.createSwitchBtn(scene);
    // this.controller = controller;
  }

  private createGoBtn(scene: Phaser.Scene) {
    this.goBtn = new ButtonComponent(scene, {
      position: { x: 650, y: 0 },
      defaultTexture: "fruitBtnBet10",
      clickedTexture: "fruitBtnBet100",
      callbackUp: this.run.bind(this),
    });
    this.add(this.goBtn);
  }

  private createSwitchBtn(scene: Phaser.Scene) {
    this.goBtn = new ButtonComponent(scene, {
      position: { x: 550, y: 0 },
      defaultTexture: "fruitBtnBet12",
      clickedTexture: "fruitBtnBet122",
      callbackUp: this.handleBetChange,
    });
    this.add(this.goBtn);
  }

  private handleBetChange(): void {
    console.log("gobtn");
  }

  private run(): void {
    eventManager.emit("request_fruit_run");
  }

  set_goBtn_avalible(flag: boolean) {
    this.goBtn.set_available(flag);
  }
}
