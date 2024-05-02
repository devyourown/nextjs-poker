import { Card } from "@/core/deck/Card";
import { Dealer } from "@/core/deck/Dealer";
import { DeterminedDeck } from "@/core/deck/Deck";
import { Game } from "@/core/game/Game";
import { Pot } from "@/core/game/Pot";
import { Player } from "@/core/game/Table";
import { Room } from "@/core/room/Room";

function convertPlayers(datas: any) {
  if (!datas) return null;
  if (!datas.map) datas = JSON.parse(datas);
  console.log("playersSSS: ", datas);
  return datas.map((data: any) => {
    const {
      id,
      money,
      beforeBetMoney,
      ranks,
      possibleTakingAmountOfMoney,
      betSize,
      hands,
    } = data;
    return new Player(
      id,
      money,
      beforeBetMoney,
      ranks,
      possibleTakingAmountOfMoney,
      betSize,
      convertCards(hands)
    );
  });
}

function convertDeck(data: any) {
  if (!data) return null;
  const { deck } = data;
  const result = convertCards(deck);
  return new DeterminedDeck(result);
}

function convertCards(data: any) {
  if (!data) return null;
  return data.map((card: any) => {
    return Card.of(card.value, card.suit);
  });
}

function convertDealer(data: any) {
  const { deck, players, board, gameStatus } = data;
  return new Dealer(
    convertPlayers(players),
    convertDeck(deck)!,
    convertCards(board),
    gameStatus
  );
}

function convertPot(data: any, players: Player[]) {
  if (!data) return null;
  const {
    currentBet,
    totalAmount,
    turnAmount,
    foldAmount,
    smallBlind,
    bigBlind,
    playerBetLog,
  } = data;
  const hashMap = new Map<Player, number>();
  if (Object.keys(playerBetLog).length !== 0) {
    for (const [key, value] of playerBetLog) {
      const player = players.filter((p) => p.getId() === key)[0];
      hashMap.set(player, value);
    }
  }
  return new Pot(
    smallBlind,
    bigBlind,
    undefined,
    currentBet,
    turnAmount,
    totalAmount,
    foldAmount,
    hashMap
  );
}

function convertRealGame(data: any) {
  if (!data) return null;
  const {
    players,
    smallBlind,
    bigBlind,
    dealer,
    foldPlayers,
    allInPlayers,
    playerTable,
    gameStatus,
    gameResult,
    pot,
  } = data;
  const player = convertPlayers(players);
  return new Game(
    player,
    smallBlind,
    bigBlind,
    undefined,
    convertPlayers(foldPlayers),
    convertPlayers(allInPlayers),
    gameStatus,
    gameResult,
    convertPlayers(playerTable),
    convertPot(pot, player)!,
    convertDealer(dealer)
  );
}

export function convertRealRoom(data: any) {
  if (!data) return null;
  const { roomId, status, users, numOfReady, game } = data;
  return Room.of(roomId, status, users, numOfReady, convertRealGame(game));
}
