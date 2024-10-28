import { socket } from "../socket";
import { RowLabelComponent } from "../components/RowLabels";
import { eventManager } from "phaser-utils/src/services/events";
import { LabelComponent } from "phaser-utils/src/components/Label";
import { SpinComponent } from "phaser-utils/src/components/Spin";
import { StepTimerController } from "phaser-utils/src/services/StepTimerController";
import { ActiveOddsComponent } from "../components/Odds";

const StartTimeIntervals: number[] = [
  0.000001, 346.15384615384615, 115.38461538461539, 230.76923076923078,
  230.76923076923078, 230.76923076923078, 230.76923076923078,
];

const EndTimeIntervals: number[] = [
  115.38461538461539, 115.38461538461539, 115.38461538461539,
  115.38461538461539, 153.84615384615385, 153.84615384615385,
  253.84615384615385,
];

const SpinDuration: number = 2507.692307692308;

interface GameData {
  coin: number;
  bets: FruitBet[];
  lights: number[];
  currentLight: number;
  currentOddsIndex: number;
  furits: number[];
  chip: number;
}

enum Symbol {
  Bar = 0,
  LuckySeven = 1,
  Star = 2,
  Watermelon = 3,
  Bell = 4,
  Lemon = 5,
  Orange = 6,
  Apple = 7,
}

interface FruitBet {
  symbol: Symbol;
  amount: number;
}

export class GameController {
  private coin: LabelComponent;
  private bets: RowLabelComponent;
  private activedOdds: ActiveOddsComponent;
  private data: GameData;
  private spin: SpinComponent;
  private runTimer: StepTimerController;
  private runSound: Phaser.Sound.BaseSound;
  private mulRunTimer: StepTimerController;
  private biuSound: Phaser.Sound.BaseSound;
  private paSound: Phaser.Sound.BaseSound;

  constructor(
    scene: Phaser.Scene,
    coin: LabelComponent,
    bets: RowLabelComponent,
    spin: SpinComponent,
    activedOdds: ActiveOddsComponent
  ) {
    // console.log("ghgheheir:", scene);
    this.bets = bets;
    this.coin = coin;
    this.spin = spin;
    this.activedOdds = activedOdds;
    this.initialize();
    this.initData();
    this.initTimer();
    this.runSound = scene.sound.add("run_light");
    this.biuSound = scene.sound.add("biu");
    this.paSound = scene.sound.add("pa");
  }

  private initialize() {
    // 监听 dataManager 发出的事件，假设 eventName 是一个数字 id
    eventManager.on("1001", (data: any) => {
      this.handleDataUpdate(data);
    });
    eventManager.on("2001", (data: any) => {
      this.handleSlot(data);
    });
  }

  private initData() {
    this.data = {
      coin: 0,
      bets: [
        { symbol: Symbol.Bar, amount: 0 },
        { symbol: Symbol.LuckySeven, amount: 0 },
        { symbol: Symbol.Star, amount: 0 },
        { symbol: Symbol.Watermelon, amount: 0 },
        { symbol: Symbol.Bell, amount: 0 },
        { symbol: Symbol.Lemon, amount: 0 },
        { symbol: Symbol.Orange, amount: 0 },
        { symbol: Symbol.Apple, amount: 0 },
      ],
      lights: [],
      currentLight: 0,
      currentOddsIndex: 0,
      furits: [],
      chip: 1,
    };
  }

  private initTimer() {
    this.runTimer = new StepTimerController(
      this.updateSTC.bind(this),
      this.completeSpin.bind(this)
    );
    this.mulRunTimer = new StepTimerController(
      this.updateMulRun.bind(this),
      this.completeMulRun.bind(this)
    );
  }

  setCoin() {
    this.coin.setText("1234");
  }

  increaseBet(index: number) {
    this.data.bets[index].amount += this.data.chip;
    this.setBet(index, this.data.bets[index].amount);
  }

  private setBet(index: number, value: number) {
    this.bets.setSpecLable(index, value.toString());
    // this.bets[index].setText(value.toString());
  }

  send_cmd() {
    socket.send(1001, {});
  }

  request_fruit_run() {
    this.spin.stopAll();
    this.spin.clear_highlight();
    socket.send(2001, { flag: true, fruits: this.data.bets });
  }

  private handleDataUpdate(data: any) {
    // 处理 dataManager 发来的数据
    console.log("Received data from dataManager:", JSON.stringify(data));
  }

  private handleSlot(data: any) {
    // 处理 dataManager 发来的数据
    console.log("Received data from dataManager:", JSON.stringify(data));
    this.data.lights = data.lights;
    this.data.currentOddsIndex = data.odds;
    const [steps, speed] = this.calculate_steps_and_speed(
      this.data.lights[0],
      this.data.currentOddsIndex
    );
    this.data.lights.splice(0, 1);
    console.log("lights: ", this.data.lights);
    this.run(steps, speed);
  }

  private run(steps: number, speed: number): void {
    this.runSound.play();
    this.runTimer.start(steps, StartTimeIntervals, EndTimeIntervals, speed);
  }

  private updateSTC(): void {
    this.spin.move();
    this.activedOdds.move();
  }

  private completeSpin(): void {
    this.spin.add_highlights();
    if (this.data.lights.length > 0) {
      setTimeout(() => {
        this.mulRun();
      }, 500);
    } else {
      this.spin_done();
    }
  }

  private calculate_steps_and_speed(
    target: number,
    oddsTarget: number
  ): [number, number] {
    const gap = this.get_gap(target);
    const loop: number =
      gap > 0 || gap > StartTimeIntervals.length + EndTimeIntervals.length
        ? 4
        : 5;
    const n = this.spin.get_number_of_spin();
    const steps = gap + loop * n;
    this.set_actived_odds_index(oddsTarget, steps);
    const fastSteps =
      steps - StartTimeIntervals.length - EndTimeIntervals.length;
    const spped = SpinDuration / fastSteps;
    return [steps, spped];
  }

  private set_actived_odds_index(target: number, steps: number): void {
    const index = (target + ((3 - (steps % 3)) % 3)) % 3;
    // console.log("steps: ", steps);
    // steps = steps % 3;
    // let index;
    // switch (steps) {
    //   case 1:
    //     index = target + 2;
    //     break;
    //   case 2:
    //     index = target + 1;
    //     break;
    //   default:
    //     index = target;
    // }
    // index = index % 3;
    this.activedOdds.set_current_pos(index);
  }

  private mulRun(): void {
    console.log("mulRun");
    const steps = this.get_short_run_steps();

    this.data.lights.splice(0, 1);

    this.biuSound.play();
    this.mulRunTimer.start(steps, [500], [], 10);
  }

  private updateMulRun(): void {
    this.spin.move();
  }

  private completeMulRun(): void {
    this.spin.add_highlights();
    this.paSound.play();
    if (this.data.lights.length > 0) {
      setTimeout(() => {
        this.mulRun();
      }, 500);
    } else {
      this.spin_done();
    }
  }

  private get_gap(target: number): number {
    const pos = this.spin.get_current_pos();
    return target - pos;
  }

  private get_short_run_steps(): number {
    const gap = this.get_gap(this.data.lights[0]);
    const n = this.spin.get_number_of_spin();
    const steps: number = gap > 0 ? gap : n + gap;
    return steps;
  }

  private spin_done(): void {
    setTimeout(() => {
      this.spin.splash_highlights();
    }, 500);
  }
}
