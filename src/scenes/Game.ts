import { Scene } from "phaser";

import { SpinComponent } from "phaser-utils/src/components/Spin";
import { GameController } from "../controllers/game_controller";
import { ActiveOddsComponent, OddsComponent } from "../components/Odds";
import { RowLabelComponent } from "../components/RowLabels";
import { FruitButtonGroup } from "../components/FruitBtns";
import { ActionBtns } from "../components/ActionBtns";
import { Score } from "../components/Score";

export class Game extends Scene {
  private spin: SpinComponent;
  private score: Score;
  private bets: RowLabelComponent;
  private odds: OddsComponent;
  private activeOdds: ActiveOddsComponent;
  private actionBtns: ActionBtns;
  private fruitBtns: FruitButtonGroup;
  private controller: GameController;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.setPath("assets");
    this.load.image("background", "images/fruit_bg.png");
    this.load.image("spin_back", "images/fruit_bg_2.png");
    this.load.image("light", "images/fruit_icon_light.png");
    this.load.image("coin", "images/fruit_img_gold.png");
    this.load.image("fruitImg4", "images/fruit_img_4.png");
    this.load.image("fruitImg8", "images/fruit_img_8.png");
    this.load.image("fruitImg9", "images/fruit_img_9.png");
    this.load.image("fruitImg10", "images/fruit_img_10.png");
    this.load.image("fruitBtnBet1", "images/fruit_btn_bet_1.png");
    this.load.image("fruitBtnBet2", "images/fruit_btn_bet_2.png");
    this.load.image("fruitBtnBet3", "images/fruit_btn_bet_3.png");
    this.load.image("fruitBtnBet4", "images/fruit_btn_bet_4.png");
    this.load.image("fruitBtnBet5", "images/fruit_btn_bet_5.png");
    this.load.image("fruitBtnBet6", "images/fruit_btn_bet_6.png");
    this.load.image("fruitBtnBet7", "images/fruit_btn_bet_7.png");
    this.load.image("fruitBtnBet8", "images/fruit_btn_bet_8.png");
    this.load.image("fruitBtnBet11", "images/fruit_btn_bet_11.png");
    this.load.image("fruitBtnBet22", "images/fruit_btn_bet_22.png");
    this.load.image("fruitBtnBet33", "images/fruit_btn_bet_33.png");
    this.load.image("fruitBtnBet44", "images/fruit_btn_bet_44.png");
    this.load.image("fruitBtnBet55", "images/fruit_btn_bet_55.png");
    this.load.image("fruitBtnBet66", "images/fruit_btn_bet_66.png");
    this.load.image("fruitBtnBet77", "images/fruit_btn_bet_77.png");
    this.load.image("fruitBtnBet88", "images/fruit_btn_bet_88.png");
    this.load.image("fruitBtnBet10", "images/fruit_btn_bet_10.png");
    this.load.image("fruitBtnBet100", "images/fruit_btn_bet_100.png");
    this.load.image("fruitBtnBet12", "images/fruit_btn_bet_12.png");
    this.load.image("fruitBtnBet122", "images/fruit_btn_bet_122.png");
    //audio
    this.load.audio("C", "audio/button1.mp3");
    this.load.audio("D", "audio/button2.mp3");
    this.load.audio("E", "audio/button3.mp3");
    this.load.audio("F", "audio/button4.mp3");
    this.load.audio("G", "audio/button5.mp3");
    this.load.audio("A", "audio/button6.mp3");
    this.load.audio("B", "audio/button7.mp3");
    this.load.audio("c", "audio/button8.mp3");
    this.load.audio("run_light", "audio/run_light.mp3");
    this.load.audio("biu", "audio/biubiubiu.mp3");
    this.load.audio("pa", "audio/papapa.mp3");
  }

  create() {
    this.add.image(0, 0, "background").setOrigin(0, 0);
    this.add.image(375, 285, "spin_back").setOrigin(0.5, 0);

    this.init_components();

    this.controller = new GameController(
      this,
      this.score,
      this.bets,
      this.spin,
      this.activeOdds,
      this.actionBtns,
      this.fruitBtns
    );

    this.adding_to_scene();

    // Start initial animations
    this.spin.set_currentPos(9);
    this.spin.move();
    this.activeOdds.move();
  }

  private init_components() {
    this.score = new Score(this);
    this.spin = new SpinComponent(this, "light", 24, 90.57, 91, 103, 331);
    this.bets = new RowLabelComponent(this, {
      position: { x: 45, y: 558 },
      texts: ["0", "0", "0", "0", "0", "0", "0", "0"],
      images: Array(8).fill("fruitImg8"),
      textStyle: {
        fontSize: 30,
        stroke: "black",
        strokeThickness: 5,
        fontStyle: "bold",
        align: "right",
      },
      imageSize: { width: 90, height: 50 },
      textOrigin: { x: 1, y: 0.5 },
      textPosition: { x: 40, y: 0 },
    });
    this.odds = new OddsComponent(this);
    this.activeOdds = new ActiveOddsComponent(this);
    this.actionBtns = new ActionBtns(this);
    this.fruitBtns = new FruitButtonGroup(this);
  }

  private adding_to_scene() {
    this.add.existing(this.score);
    this.add.existing(this.spin);
    this.add.existing(this.odds);

    this.add.existing(this.activeOdds);
    this.add.existing(this.actionBtns);
    this.add.existing(this.bets);

    this.add.existing(this.fruitBtns);
  }
}
