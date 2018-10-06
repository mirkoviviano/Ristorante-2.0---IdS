import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VisualizzaOrdiniPage } from './visualizza-ordini';

@NgModule({
  declarations: [
    VisualizzaOrdiniPage,
  ],
  imports: [
    IonicPageModule.forChild(VisualizzaOrdiniPage),
  ],
})
export class VisualizzaOrdiniPageModule {}
