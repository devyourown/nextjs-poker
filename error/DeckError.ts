export class DeckError extends Error {
  private errorCode: DeckErrorCode;

  constructor(errorCode: DeckErrorCode = DeckErrorCode.OK) {
    super();
    this.errorCode = errorCode;
    this.message = this.errorMessage();
  }

  errorMessage(): string {
    switch (this.errorCode) {
      case DeckErrorCode.OK:
        return "TILT: Should not get here.";
      case DeckErrorCode.EMPTY:
        return "Empty Deck Error";
      case DeckErrorCode.TOO_MANY_PLAYER:
        return "Too Many Player Error";
      default:
        return "";
    }
  }
}

export enum DeckErrorCode {
  OK,
  EMPTY,
  TOO_MANY_PLAYER,
}
