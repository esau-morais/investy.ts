import { ViewModel } from '@app/presentation';

export function parseViewModel(viewModel: ViewModel<any>) {
  return JSON.parse(JSON.stringify(viewModel));
}
