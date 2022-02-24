export abstract class ViewModel<Data> {
  constructor(protected data: Data) {}

  toJSON(): any {
    return this.data;
  }
}
