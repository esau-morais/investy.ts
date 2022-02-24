export class MissingParamError extends Error {
  constructor(paramField: string) {
    super(`The param ${paramField} is missing.`);
  }
}
