import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { FilterState } from '../../intefaces';

@Component({
  selector: 'app-perfume-filters',
  standalone: true,
  imports: [],
  templateUrl: './perfume-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerfumeFiltersComponent {
  shops = ['Mz Perfumes', 'Cosmetic', 'Comprar en Chile'];
  prices = [
    'Menos de $30.000',
    '$30.000 – $60.000',
    '$60.000 – $100.000',
    'Más de $100.000',
  ];
  types = ['EDT', 'EDP', 'EDC'];
  audiences = ['Hombre', 'Mujer', 'Unisex'];

  onFiltersChange = output<FilterState>();
  selectedStore = signal<string | null>(null);
  selectedPrice = signal<string | null>(null);
  selectedType = signal<string | null>(null);
  selectedAudience = signal<string | null>(null);

  toggleFilter(type: keyof FilterState, value: string) {
    // Lógica simple: si ya está seleccionado, lo quitamos, si no, lo ponemos
    // (Ajusta esto si prefieres selección múltiple con arreglos)
    const currentSignal = this.getSignalByType(type);
    const newValue = currentSignal() === value ? null : value;
    currentSignal.set(newValue);

    // Emitimos el estado actual de todos los filtros
    this.onFiltersChange.emit({
      shop: this.selectedStore(),
      price_range: this.selectedPrice(),
      type_parfum: this.selectedType(),
      audience: this.selectedAudience(),
    });
  }

  private getSignalByType(type: keyof FilterState) {
    const signals = {
      shop: this.selectedStore,
      price_range: this.selectedPrice,
      type_parfum: this.selectedType,
      audience: this.selectedAudience,
    };
    return signals[type];
  }
}
