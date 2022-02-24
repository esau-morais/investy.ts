import { Stock } from '@app/core/entities/Stock';
import { Clock } from '@app/shared/Clock';
import { ViewModel } from '.';

export class StockViewModel extends ViewModel<Stock> {
  get stockName() {
    return this.data.name;
  }

  toJSON() {
    return {
      name: this.data.name,
      lastPrice: this.data.price,
      pricedAt: Clock.format(this.data.pricedAt, 'yyyy-MM-dd'),
    };
  }
}
