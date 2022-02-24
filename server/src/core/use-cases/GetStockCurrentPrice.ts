import { UseCase } from '.';
import { Stock } from '@app/core/entities/Stock';
import { StockingAPI } from '@app/services/StockingAPI';
import { MissingParamError } from '@app/shared/errors/MissingParamError';
import { StockNotFound } from '../errors/StockNotFound';

type Params = {
  stockName: string;
};

export class GetStockCurrentPriceUseCase implements UseCase<Params, Stock> {
  constructor(private stockingAPI: StockingAPI) {}

  async execute(params: Params): Promise<Stock> {
    if (!params.stockName || !params.stockName.trim()) throw new MissingParamError('stockName');

    const stock = await this.stockingAPI.fetchByName(params.stockName);
    if (!stock) throw new StockNotFound(params.stockName);

    return stock;
  }
}
