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
  private timerId?: NodeJS.Timeout = undefined;
  private isKeyPressed: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];
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
        callbackDown: () => this.press_down(i),
        callbackUp: () => this.handleBetChange(i),
        callbackOut: () => this.cancel_bet(i),
      });

      this.buttons.push(button);
      this.add(button);
      this.sounds.push(scene.sound.add(this.soundPaths[i]));
    }
  }

  private handleBetChange(index: number): void {
    // console.log("up");
    this.isKeyPressed[index] = false;
    this.cancelTimer();
    this.sounds[index].play();
    eventManager.emit("increaseBet", index);
  }

  private press_down(index: number): void {
    if (this.timerId === undefined) {
      this.isKeyPressed[index] = true;
      this.timerId = setTimeout(() => {
        this.long_press(index);
      }, 500);
    }
  }

  private long_press(index: number): void {
    if (this.isKeyPressed[index]) {
      this.timerId = setTimeout(() => {
        eventManager.emit("increaseBet", index);
        this.long_press(index);
      }, 30);
    }
  }

  private cancel_bet(index: number): void {
    // console.log("cancel");
    if (this.isKeyPressed[index]) {
      this.isKeyPressed[index] = false;
      eventManager.emit("cancel_bet", index);
      this.cancelTimer();
      // setTimeout(() => {
      //   eventManager.emit("cancel_bet", index);
      // }, 40);
    }
  }

  private cancelTimer(): void {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  set_available(flag: boolean) {
    this.buttons.forEach((button) => {
      button.set_available(flag);
    });
  }
}
