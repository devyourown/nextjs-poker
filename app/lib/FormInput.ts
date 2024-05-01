import { Action, UserAction } from "@/core/game/Game";
import { Input } from "@/core/game/IO";
import { Pot } from "@/core/game/Pot";
import { Player } from "@/core/game/Table";

export class FormInput implements Input {
  private currentPlayer: Player | null;
  private pot: Pot | null;
  private currentAction: UserAction | null;

  constructor() {
    this.currentPlayer = null;
    this.pot = null;
    this.currentAction = null;
  }

  getCurrentBet() {
    return this.pot?.getCurrentBet();
  }

  isNotEnoughToBet(betSize: number) {
    return this.currentPlayer?.getMoney()! < betSize;
  }

  isPlayerTurn(player: Player) {
    return player === this.currentPlayer;
  }

  getUserAction(currentPlayer: Player, pot: Pot): UserAction {
    this.currentPlayer = currentPlayer;
    this.pot = pot;
    let counter = 0;
    const intervalId = setInterval(() => {
      counter++;
    }, 1000);
    while (counter < 61) {
      if (this.currentAction !== null) {
        clearInterval(intervalId);
        const result = this.currentAction;
        this.setActionNull();
        return result;
      }
    }
    clearInterval(intervalId);
    this.setActionNull();
    return { action: Action.FOLD, betSize: 0 };
  }

  private setActionNull() {
    this.currentAction = null;
  }

  setCurrentAction(action: UserAction) {
    this.currentAction = action;
  }
}
