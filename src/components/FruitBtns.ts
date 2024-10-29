import { ButtonComponent } from "phaser-utils/src/components/Button";
import { eventManager } from "phaser-utils/src/services/events";

export class FruitButtonGroup extends Phaser.GameObjects.Container {
  private buttons: ButtonComponent[] = [];
  private normalImagePaths: string[] = [
    "fruitBtnBet8",
    "fruitBtnBet7",
    "fruitBtnBet6",
    "fruitBtnBet5",
    "fruitBtnBet4",
    "fruitBtnBet3",
    "fruitBtnBet2",
    "fruitBtnBet1",
  ];
  private pressedImagePaths: string[] = [
    "fruitBtnBet88",
    "fruitBtnBet77",
    "fruitBtnBet66",
    "fruitBtnBet55",
    "fruitBtnBet44",
    "fruitBtnBet33",
    "fruitBtnBet22",
    "fruitBtnBet11",
  ];
  private soundPaths: string[] = ["c", "B", "A", "G", "F", "E", "D", "C"];

  private sounds: Phaser.Sound.BaseSound[] = [];
  private offSets: number[] = [-320, -230, -140, -48, 48, 140, 230, 320];
  constructor(scene: Phaser.Scene) {
    super(scene, 375, 1260);
    this.createButtons(scene);
  }

  private createButtons(scene: Phaser.Scene) {
    for (let i = 0; i < this.normalImagePaths.length; i++) {
      const button = new ButtonComponent(scene, {
        position: { x: this.offSets[i], y: 0 },
        defaultTexture: this.normalImagePaths[i],
        clickedTexture: this.pressedImagePaths[i],
        callbackUp: () => this.handleBetChange(i),
      });

      this.buttons.push(button);
      this.add(button);
      this.sounds.push(scene.sound.add(this.soundPaths[i]));
    }
  }

  private handleBetChange(index: number): void {
    this.sounds[index].play();
    eventManager.emit("increaseBet", index);
  }

  public set_available(flag: boolean) {
    this.buttons.forEach((button) => {
      button.set_available(flag);
    });
  }
}
