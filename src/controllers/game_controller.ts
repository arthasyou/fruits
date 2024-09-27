import { eventManager } from "phaser-utils";
import { socket } from "../socket";
import { LabelComponent } from "../components/Label";
import { RowLabelComponent } from "../components/RowLabels";

interface GameData {
  coin: number;
  bets: number[];
  lights: number[];
  currentLight: number;
  currentOddsIndex: number;
  furits: number[];
  chip: number;
}

export class GameController {
  private coin: LabelComponent;
  private bets: RowLabelComponent;
  private data: GameData;

  constructor(
    private scene: Phaser.Scene,
    coin: LabelComponent,
    bets: RowLabelComponent
  ) {
    // console.log("ghgheheir:", scene);
    this.bets = bets;
    this.coin = coin;
    this.initialize();
    this.initData();
  }

  private initialize() {
    // 监听 dataManager 发出的事件，假设 eventName 是一个数字 id
    eventManager.on("1001", (data: any) => {
      this.handleDataUpdate(data);
    });
  }

  private initData() {
    this.data = {
      coin: 0,
      bets: [0, 0, 0, 0, 0, 0, 0, 0],
      lights: [],
      currentLight: 0,
      currentOddsIndex: 0,
      furits: [],
      chip: 1,
    };
  }

  setCoin() {
    this.coin.setText("1234");
  }

  increaseBet(index: number) {
    this.data.bets[index] += this.data.chip;
    this.setBet(index, this.data.bets[index]);
  }

  private setBet(index: number, value: number) {
    this.bets.setSpecLable(index, value.toString());
    // this.bets[index].setText(value.toString());
  }

  send_cmd() {
    socket.send(1001, {});
  }

  private handleDataUpdate(data: any) {
    // 处理 dataManager 发来的数据
    console.log("Received data from dataManager:", JSON.stringify(data));

    const x = Phaser.Math.Between(64, this.scene.scale.width - 64);
    const y = Phaser.Math.Between(64, this.scene.scale.height - 64);

    this.scene.add.sprite(x, y, "star");
  }
}
