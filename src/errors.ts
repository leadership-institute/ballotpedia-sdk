export class BallotpediaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BallotpediaError';
  }
}

export class BallotpediaAPIError extends BallotpediaError {
  constructor(
    message: string,
    public statusCode: number,
    public statusText: string
  ) {
    super(message);
    this.name = 'BallotpediaAPIError';
  }
}

export class BallotpediaValidationError extends BallotpediaError {
  constructor(message: string) {
    super(message);
    this.name = 'BallotpediaValidationError';
  }
} 