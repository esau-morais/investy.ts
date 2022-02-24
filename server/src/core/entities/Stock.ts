type StockConstructor = {
  name: string;
  price: number;
  pricedAt: Date;
};

export class Stock {
  public name: string;
  public price: number;
  public pricedAt: Date;

  constructor(data: StockConstructor) {
    this.name = data.name;
    this.price = data.price;
    this.pricedAt = data.pricedAt;
  }
}
