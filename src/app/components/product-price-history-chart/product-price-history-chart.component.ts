import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexYAxis,
  ApexFill,
  ApexGrid,
  ApexTheme,
  ApexOptions,
} from 'ng-apexcharts';
import { ThemeStore } from '../../core/services/ThemeStore';

export type PriceHistory = {
  date: string;
  price: number;
};

// Definimos una interfaz para agrupar las opciones que no son Series
export type ChartOptions = {
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  grid: ApexGrid;
  theme: ApexTheme;
  colors: string[];
};

@Component({
  selector: 'app-product-price-history-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './product-price-history-chart.component.html',
  styleUrls: ['./product-price-history-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPriceHistoryChartComponent {
  themeStore = inject(ThemeStore);

  // Input de datos
  history = input.required<PriceHistory[]>();

  // 1. Reactividad del Color (Tema)
  private labelColor = computed(() =>
    this.themeStore.theme() === 'light' ? '#000000' : '#ffffff',
  );

  private colors = computed(() =>
    this.themeStore.theme() === 'light' ? '#4E3CD6' : '#C08042',
  );

  // 2. Reactividad de los Datos (Series)
  // Al usar computed, si 'history' cambia, 'series' se recalcula automáticamente.
  series = computed<ApexAxisChartSeries>(() => {
    const data = this.history();
    if (!data?.length) return [{ name: 'Precio', data: [] }];

    const sortedData = [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return [
      {
        name: 'Precio',
        data: sortedData.map((d) => ({
          x: new Date(d.date).getTime(),
          y: d.price,
        })),
      },
    ];
  });

  chartOptions = computed<ApexOptions>(() => {
    const color = this.labelColor();

    const theme = this.themeStore.theme();

    console.log({ theme });

    return {
      chart: {
        type: 'area',
        height: 350,
        fontFamily: 'inherit',
        background: 'transparent',
        toolbar: { show: false },
        animations: { enabled: true, speed: 800 },
        // Corrección del error de scroll
        zoom: { enabled: false },
        selection: { enabled: false },
      },
      // Restaure las propiedades visuales que faltaban en tu fragmento anterior
      colors: [this.colors()],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      fill: { type: 'solid', opacity: 0.25 },
      grid: {
        show: true,
        borderColor: 'oklch(var(--b2))',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
      },
      xaxis: {
        type: 'datetime',
        tooltip: { enabled: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: color, fontSize: '12px' },
          datetimeFormatter: {
            year: 'yyyy',
            month: "MMM 'yy",
            day: 'dd MMM',
            hour: 'HH:mm',
          },
        },
      },
      yaxis: {
        labels: {
          style: { colors: color },
          formatter: (value) =>
            new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
              maximumFractionDigits: 0,
            }).format(value),
        },
      },
      tooltip: {
        theme: 'dark',
        x: { format: 'dd MMM yyyy' },
        y: {
          formatter: (value) =>
            new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP',
              maximumFractionDigits: 0,
            }).format(value),
        },
      },
      theme: { mode: this.themeStore.theme() === 'light' ? 'light' : 'dark' },
    };
  });
}
