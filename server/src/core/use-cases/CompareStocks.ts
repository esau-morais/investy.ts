import { StockingAPI } from '@app/services/StockingAPI';
import { UseCase } from '.';
import { Stock } from '../entities/Stock';
import { StockNotFound } from '../errors/StockNotFound';

type Params = {
  stockNameComparing: string;
  stockNamesToCompare: string[];
};

type CompareStockResult = Stock[];

export class CompareStocksUseCase implements UseCase<Params, CompareStockResult> {
  constructor(private stockingAPI: StockingAPI) {}

  async execute(params: Params): Promise<CompareStockResult> {
    const result: Stock[] = [];

    const stockComparing = await this.stockingAPI.fetchByName(params.stockNameComparing);
    if (!stockComparing) throw new StockNotFound(params.stockNameComparing);

    result.push(stockComparing);

    for (const stockName of params.stockNamesToCompare) {
      const stock = await this.stockingAPI.fetchByName(stockName);
      if (stock) result.push(stock);
    }

    return result;
  }
}
