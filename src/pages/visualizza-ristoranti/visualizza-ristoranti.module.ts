import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisualizzaRistorantiPage } from './visualizza-ristoranti';

@NgModule({
  declarations: [
    VisualizzaRistorantiPage,
  ],
  imports: [
    IonicPageModule.forChild(VisualizzaRistorantiPage),
  ],
})
export class VisualizzaRistorantiPageModule {}
