import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AggiungiRistorantePage } from './aggiungi-ristorante';

@NgModule({
  declarations: [
    AggiungiRistorantePage,
  ],
  imports: [
    IonicPageModule.forChild(AggiungiRistorantePage),
  ],
})
export class AggiungiRistorantePageModule {}
