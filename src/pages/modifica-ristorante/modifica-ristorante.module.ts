import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModificaRistorantePage } from './modifica-ristorante';

@NgModule({
  declarations: [
    ModificaRistorantePage,
  ],
  imports: [
    IonicPageModule.forChild(ModificaRistorantePage),
  ],
})
export class ModificaRistorantePageModule {}
