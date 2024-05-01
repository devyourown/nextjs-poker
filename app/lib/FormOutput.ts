import { Dealer } from "@/core/deck/Dealer";
import { Output } from "@/core/game/IO";
import { Pot } from "@/core/game/Pot";
import { Player } from "@/core/game/Table";
import { Card } from "./definitions";

export class FormOutput implements Output {
  private dealer: Dealer | null;
  private pot: Pot | null;
  private currentPlayer: Player | null;
  private isOn;

  constructor() {
    this.dealer = null;
    this.pot = null;
    this.currentPlayer = null;
    this.isOn = false;
  }

  isGameOn() {
    return this.isOn;
  }

  sendCurrentGame(pot: Pot, dealer: Dealer, currentPlayer: Player): void {
    throw new Error("Method not implemented.");
  }

  getBoard() {
    return this.dealer?.getBoard();
  }
}
