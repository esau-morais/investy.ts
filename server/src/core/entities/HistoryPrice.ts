type PriceConstructorData = {
  opening: number;
  low: number;
  high: number;
  closing: number;
  volume: number;
  pricedAt: Date;
};

export class HistoryPrice {
  public opening: number;
  public low: number;
  public high: number;
  public closing: number;
  public volume: number;
  public pricedAt: Date;

  constructor(data: PriceConstructorData) {
    this.opening = data.opening;
    this.low = data.low;
    this.high = data.high;
    this.closing = data.closing;
    this.pricedAt = data.pricedAt;
    this.volume = data.volume;
  }
}
