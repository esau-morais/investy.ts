import { GainsResult } from '@app/core/use-cases/GainsStocks';
import { Clock } from '@app/shared/Clock';
import { ViewModel } from '.';

export class StockGainsViewModel extends ViewModel<GainsResult> {
  toJSON() {
    return {
      ...this.data,
      purchasedAt: Clock.format(this.data.purchasedAt, 'yyyy-MM-dd'),
    };
  }
}
