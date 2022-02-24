export class StockNotFound extends Error {
  constructor(stockName: string) {
    super(`Stock with name ${stockName} not found `);
  }
}
