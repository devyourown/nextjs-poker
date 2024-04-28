import { Dealer } from "../deck/Dealer";
import { UserAction } from "./Game";
import { Pot } from "./Pot";
import { Player } from "./Table";

export interface Input {
  getUserAction(currentPlayer: Player, pot: Pot): UserAction;
}

export interface Output {
  sendCurrentGame(pot: Pot, dealer: Dealer, currentPlayer: Player): void;
}
