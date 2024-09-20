class FruitButtonGroup extends Phaser.GameObjects.Container {
  private buttons: Phaser.GameObjects.Sprite[] = [];
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
  private offSets: number[] = [-321, -238, -148, -51, 51, 148, 238, 321];

  constructor(
    scene: Phaser.Scene,
    private bets: BetsComponent,
    private coin: CoinComponent
  ) {
    super(scene, 0, 595);
    this.createButtons(scene);
    scene.add.existing(this);
  }

  private createButtons(scene: Phaser.Scene) {
    for (let i = 0; i < this.normalImagePaths.length; i++) {
      const button = scene.add
        .sprite(this.offSets[i], 0, this.normalImagePaths[i])
        .setInteractive()
        .on("pointerdown", () => {
          button.setTexture(this.pressedImagePaths[i]);
          this.handleBetChange(i);
        })
        .on("pointerup", () => {
          button.setTexture(this.normalImagePaths[i]);
        });

      this.buttons.push(button);
      this.add(button);
    }
  }

  private handleBetChange(index: number) {
    // 假设 slotMachineProvider 已经在 Phaser 内部有类似逻辑
    const bet = slotMachineProvider.increaseBet(index);
    this.bets.updateLabel(index, bet.toString());
    this.coin.updateLabel();
    AudioManager.playAudio(`button${index + 1}`);
  }

  public setEnabled(isEnabled: boolean) {
    this.buttons.forEach((button) => {
      button.setInteractive(isEnabled);
    });
  }
}
