import { UseCase } from '.';
import { Stock } from '@app/core/entities/Stock';
import { HistoryPrice } from '@app/core/entities/HistoryPrice';
import { StockingAPI } from '@app/services/StockingAPI';
import { StockNotFound } from '../errors/StockNotFound';
import { MissingParamError } from '@app/shared/errors/MissingParamError';

type StockHistoryParams = {
  stockName: string;
  initialDate: Date;
  finalDate: Date;
};

export type StockHistory = {
  stockName: string;
  history: HistoryPrice[];
};

export class InvalidRangeDate extends Error {
  constructor(initialDate: Date, finalDate: Date) {
    super(`The range date ${initialDate} to ${finalDate} is invalid`);
  }
}

export class GetStockHistoryUseCase implements UseCase<StockHistoryParams, StockHistory> {
  constructor(private stockingAPI: StockingAPI) {}

  async execute(params: StockHistoryParams): Promise<StockHistory> {
    const { stockName, initialDate, finalDate } = params;

    if (!stockName || !stockName.trim()) throw new MissingParamError('stockName');

    if (initialDate.getTime() > finalDate.getTime()) throw new InvalidRangeDate(initialDate, finalDate);

    const history = await this.stockingAPI.fetchStockHistory(stockName, initialDate, finalDate);
    if (!history) throw new StockNotFound(stockName);

    return history;
  }
}
