import { Stock } from '@app/core/entities/Stock';
import { ViewModel } from '.';
import { StockViewModel } from './StockViewModel';

type Data = Stock[];

export class CompareStocksViewModel extends ViewModel<Data> {
  toJSON() {
    return {
      lastPrices: this.data.map((stock) => new StockViewModel(stock)),
    };
  }
}
