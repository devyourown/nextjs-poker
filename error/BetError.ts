export class BetError extends Error {
  private errorCode: ErrorCode;

  constructor(message: string, errorCode: ErrorCode = ErrorCode.OK) {
    super(message);
    this.errorCode = errorCode;
  }

  errorMessage(): string {
    switch (this.errorCode) {
      case ErrorCode.OK:
        return "TILT: Should not get here.";
      case ErrorCode.INVALID_BET_SIZE:
        return "Bet size should be 100 unit.";
      case ErrorCode.TOO_SMALL_BET_SIZE:
        return "Bet size should upper than BetiingSize.";
      case ErrorCode.MONEY_NOT_ENOUGH:
        return "Money is not enough to bet.";
      case ErrorCode.NOT_INTEGER:
        return "Money should be number.";
      case ErrorCode.NOT_YOUR_TURN:
        return "Now is not your turn.";
      case ErrorCode.NOT_POSSIBLE_CHECK:
        return "Cannot check now.";
      default:
        return "";
    }
  }
}

enum ErrorCode {
  OK,
  INVALID_BET_SIZE,
  TOO_SMALL_BET_SIZE,
  NOT_POSSIBLE_CHECK,
  MONEY_NOT_ENOUGH,
  NOT_INTEGER,
  NOT_YOUR_TURN,
}
