export class CustomError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    // Ensure correct prototype chain
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
