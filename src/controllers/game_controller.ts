import { eventManager } from "phaser-utils/src/services/events";
import { socket } from "../socket";
import { RowLabelComponent } from "../components/RowLabels";

import { SpinComponent } from "phaser-utils/src/components/Spin";
import { StepTimerController } from "phaser-utils/src/services/StepTimerController";
import { ActiveOddsComponent } from "../components/Odds";
import { Score } from "../components/Score";
import { ActionBtns } from "../components/ActionBtns";
import { FruitButtonGroup } from "../components/FruitBtns";

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

const MAX_BET_AMOUNT = 99;
const WAIT_TIME_BEFORE_NEXT_RUN = 500;

interface GameData {
  credit: number;
  bonus: number;
  chip: number;
  bets: FruitBet[];
  rewards: FruitBet[];
  lights: number[];
  currentLight: number;
  currentOddsIndex: number;
  furits: number[];
}

enum SlotState {
  Betting,
  Running,
  BigOrSmall,
  Repeated,
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
  private currentState: SlotState;
  private score: Score;
  private bets: RowLabelComponent;
  private rewards: RowLabelComponent;
  private activedOdds: ActiveOddsComponent;
  private actionBtns: ActionBtns;
  private fruitBtns: FruitButtonGroup;
  private data: GameData;
  private spin: SpinComponent;
  private runTimer: StepTimerController;
  private runSound: Phaser.Sound.BaseSound;
  private mulRunTimer: StepTimerController;
  private biuSound: Phaser.Sound.BaseSound;
  private paSound: Phaser.Sound.BaseSound;

  constructor(
    scene: Phaser.Scene,
    score: Score,
    bets: RowLabelComponent,
    rewards: RowLabelComponent,
    spin: SpinComponent,
    activedOdds: ActiveOddsComponent,
    actionBtns: ActionBtns,
    fruitBtns: FruitButtonGroup
  ) {
    // console.log("ghgheheir:", scene);
    this.initialize();
    this.bets = bets;
    this.rewards = rewards;
    this.score = score;
    this.spin = spin;
    this.activedOdds = activedOdds;
    this.actionBtns = actionBtns;
    this.fruitBtns = fruitBtns;

    this.initData();
    this.initTimer();
    this.runSound = scene.sound.add("run_light");
    this.biuSound = scene.sound.add("biu");
    this.paSound = scene.sound.add("pa");
    this.transitionToState(SlotState.Betting);
  }

  private initialize() {
    eventManager.on("1001", (data: any) => {
      this.handleDataUpdate(data);
    });
    eventManager.on("2001", (data: any) => {
      this.handleSlot(data);
    });
    eventManager.on("request_fruit_run", this.request_fruit_run.bind(this));
    eventManager.on("increaseBet", this.increaseBet.bind(this));
    eventManager.on("cancel_bet", this.cancelBet.bind(this));
  }

  private initData() {
    this.data = {
      credit: 0,
      bonus: 0,
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
      rewards: [
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

  private transitionToState(newState: SlotState) {
    this.currentState = newState;
    switch (this.currentState) {
      case SlotState.Betting:
        this.enterBettingState();
        break;
      case SlotState.Running:
        this.enterRunningState();
        break;
      case SlotState.BigOrSmall:
        this.enterBigOrSmallState();
        break;
      case SlotState.Repeated:
        this.enterRepeatedState();
        break;
    }
  }

  private enterBettingState() {
    this.set_all_button_avalible(true);
    this.actionBtns.set_big_or_small_avalibel(false);
    this.spin.clear_highlight();
    this.spin.stopAll();
    this.bets.resetAmounts();
    this.rewards.resetAmounts();
  }

  private enterRunningState() {
    this.set_all_button_avalible(false);
  }

  private enterBigOrSmallState() {
    this.actionBtns.set_big_or_small_avalibel(true);
    this.actionBtns.set_goBtn_avalible(true);
  }

  private enterRepeatedState() {
    this.set_all_button_avalible(true);
    this.spin.clear_highlight();
    this.spin.stopAll();
    this.actionBtns.set_big_or_small_avalibel(false);
    this.rewards.resetAmounts();
  }

  private increaseBet(index: number) {
    if (this.currentState === SlotState.Betting) {
      this.handleBettingStateIncrease(index);
    } else if (this.currentState === SlotState.Repeated) {
      this.handleRepeatedStateIncrease(index);
    }
  }

  private handleBettingStateIncrease(index: number) {
    if (
      this.data.bets[index].amount < MAX_BET_AMOUNT &&
      this.decreaseCredit()
    ) {
      this.updateBetAmount(index, this.data.chip);
    }
  }

  private handleRepeatedStateIncrease(index: number) {
    this.resetAmounts();
    this.transitionToState(SlotState.Betting);

    if (this.decreaseCredit()) {
      this.updateBetAmount(index, this.data.chip);
    }
  }

  private updateBetAmount(index: number, amount: number) {
    this.data.bets[index].amount += amount;
    this.setBet(index, this.data.bets[index].amount);
    this.score.set_credit(this.data.credit);
  }

  private decreaseCredit(): boolean {
    if (this.data.credit >= this.data.chip) {
      this.data.credit -= this.data.chip;
      return true;
    } else return false;
  }

  private cancelBet(index: number) {
    // console.log("cancel bet");
    if (this.data.bets[index].amount > 0) {
      this.data.credit += this.data.bets[index].amount;
      this.data.bets[index].amount = 0;
      this.setBet(index, 0);
      this.score.set_credit(this.data.credit);
    }
  }

  private setBet(index: number, value: number) {
    this.bets.setSpecLable(index, value.toString());
    // this.bets[index].setText(value.toString());
  }

  private setReward(index: number, value: number) {
    this.rewards.setSpecLable(index, value.toString());
  }

  init() {
    socket.send(1001, {});
  }

  request_fruit_run() {
    switch (this.currentState) {
      case SlotState.Betting:
        this.handleBettingState();
        break;

      case SlotState.Repeated:
        this.handleRepeatedState();
        break;

      case SlotState.BigOrSmall:
        this.handleBigOrSmallState();
        break;
    }
  }

  private handleBettingState() {
    if (this.get_bets_value() > 0) {
      this.toggleGoButton(false);
      this.sendSocketData(2001, 0);
    }
  }

  private handleRepeatedState() {
    const betValue = this.get_bets_value();
    if (this.data.credit >= betValue) {
      this.toggleGoButton(false);
      this.updateCredit(-betValue);
      this.sendSocketData(2001, 1);
    }
  }

  private handleBigOrSmallState() {
    this.updateCredit(this.data.bonus);
    this.updateBonus(0);
    this.transitionToState(SlotState.Repeated);
  }

  private toggleGoButton(isAvailable: boolean) {
    this.actionBtns.set_goBtn_avalible(isAvailable);
  }

  private updateCredit(amount: number) {
    this.data.credit += amount;
    this.score.set_credit(this.data.credit);
  }

  private updateBonus(amount: number) {
    this.data.bonus = amount;
    this.score.set_bonus(this.data.bonus);
  }

  private sendSocketData(eventId: number, flag: number) {
    socket.send(eventId, { flag, fruits: this.data.bets });
  }

  private handleDataUpdate(data: any) {
    // 处理 dataManager 发来的数据
    // console.log("Received data from dataManager:", JSON.stringify(data));
    this.data.credit = data.balance;
    this.score.set_credit(this.data.credit);
  }

  private handleSlot(data: any) {
    this.transitionToState(SlotState.Running);
    // 处理 dataManager 发来的数据
    // console.log("Received data from dataManager:", JSON.stringify(data));
    this.data.lights = data.lights;
    this.data.currentOddsIndex = data.odds;
    // this.data.credit = data.balance;
    this.data.bonus = data.win;
    this.data.rewards = data.part;
    const [steps, speed] = this.calculate_steps_and_speed(
      this.data.lights[0],
      this.data.currentOddsIndex
    );
    this.data.lights.splice(0, 1);
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
      }, WAIT_TIME_BEFORE_NEXT_RUN);
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
    const index = (target + steps) % 3;
    this.activedOdds.set_current_pos(index);
    console.log("step: ", steps % 3, "target: ", target, "index: ", index);
  }

  private mulRun(): void {
    const steps = this.get_short_run_steps();

    this.data.lights.splice(0, 1);

    this.biuSound.play();
    this.mulRunTimer.start(steps, [WAIT_TIME_BEFORE_NEXT_RUN], [], 10);
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
      }, WAIT_TIME_BEFORE_NEXT_RUN);
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
      this.score.set_bonus(this.data.bonus);
      this.score.set_credit(this.data.credit);
      this.set_rewards();
      if (this.data.bonus === 0) {
        this.transitionToState(SlotState.Repeated);
      } else {
        this.transitionToState(SlotState.BigOrSmall);
      }
    }, WAIT_TIME_BEFORE_NEXT_RUN);
  }

  private set_all_button_avalible(flag: boolean) {
    this.actionBtns.set_goBtn_avalible(flag);
    this.fruitBtns.set_available(flag);
  }

  private set_rewards() {
    this.data.rewards.forEach((e) => {
      this.setReward(e.symbol, e.amount);
    });
  }

  private get_bets_value(): number {
    let sum = 0;
    this.data.bets.forEach((e) => {
      sum += e.amount;
    });
    return sum;
  }

  private resetAmounts(): void {
    this.data.bets.forEach((bet) => {
      bet.amount = 0;
    });
    this.bets.resetAmounts();
  }
}
