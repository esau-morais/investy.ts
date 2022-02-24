import { StockingAPI } from '@app/services/StockingAPI';
import { Clock } from '@app/shared/Clock';
import { UseCase } from '.';
import { Stock } from '../entities/Stock';
import { StockNotFound } from '../errors/StockNotFound';

type GainsParams = {
  purchasedAmount: number;
  purchasedAt: Date;
  stockName: string;
};

export type GainsResult = {
  name: string;
  purchasedAmount: number;
  purchasedAt: Date;
  priceAtDate: number;
  lastPrice: number;
  capitalGains: number;
};

export class GainsStocksUseCase implements UseCase<GainsParams, GainsResult> {
  constructor(private stockingAPI: StockingAPI) {}

  async execute(params: GainsParams): Promise<GainsResult> {
    const { purchasedAmount, purchasedAt, stockName } = params;

    const historyStock = await this.stockingAPI.fetchStockHistory(stockName, purchasedAt, Clock.now());
    if (!historyStock) throw new StockNotFound(stockName);

    const { history } = historyStock;
    const purchasedPrice = history[history.length - 1]?.closing;
    const currentPrice = history[0].closing;
    const purchasedTotal = purchasedAmount * (purchasedPrice as number);
    const currentTotal = purchasedAmount * (currentPrice as number);

    return {
      name: stockName,
      lastPrice: currentPrice,
      priceAtDate: purchasedPrice,
      purchasedAmount,
      purchasedAt,
      capitalGains: currentTotal - purchasedTotal,
    };
  }
}
