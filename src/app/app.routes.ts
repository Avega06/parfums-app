import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main-layout/MainLayout.component'),
    children: [
      {
        path: 'parfums/:page',
        title: 'Listado de Perfumes',
        loadComponent: () =>
          import('./pages/parfum-list/parfum-list.component'),
      },
      {
        path: 'product/:product_id',
        title: 'Listado de Perfumes',
        loadComponent: () => import('./pages/product/product.component'),
      },
      {
        path: '**',
        redirectTo: '/parfums/1',
      },
    ],
  },
];
