import { ButtonComponent } from "phaser-utils/src/components/Button";
import { GameController } from "../controllers/game_controller";

export class ActionBtns extends Phaser.GameObjects.Container {
  private goBtn: ButtonComponent;
  private controller: GameController;

  constructor(scene: Phaser.Scene, controller: GameController) {
    super(scene, 0, 985);

    this.createGoBtn(scene);
    this.createSwitchBtn(scene);
    scene.add.existing(this);
    this.controller = controller;
  }

  private createGoBtn(scene: Phaser.Scene) {
    this.goBtn = new ButtonComponent(scene, {
      position: { x: 650, y: 0 },
      defaultTexture: "fruitBtnBet10",
      clickedTexture: "fruitBtnBet100",
      callback: this.run.bind(this),
    });
    this.add(this.goBtn);
  }

  private createSwitchBtn(scene: Phaser.Scene) {
    this.goBtn = new ButtonComponent(scene, {
      position: { x: 550, y: 0 },
      defaultTexture: "fruitBtnBet12",
      clickedTexture: "fruitBtnBet122",
      callback: this.handleBetChange,
    });
    this.add(this.goBtn);
  }

  private handleBetChange(): void {
    console.log("gobtn");
  }

  private run(): void {
    this.controller.request_fruit_run();
  }

  // public setEnabled(isEnabled: boolean) {
  //   this.buttons.forEach((button) => {
  //     button.setInteractive(isEnabled);
  //   });
  // }
}
