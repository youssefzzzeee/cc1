import { Routes } from '@angular/router';
import { FactureComponent } from './facture/facture.component';

export const routes: Routes = [
  { path: '', component: FactureComponent },
  { path: '**', redirectTo: '' }
];
