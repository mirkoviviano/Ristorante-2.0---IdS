import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModificaPiattoPage } from './modifica-piatto';

@NgModule({
  declarations: [
    ModificaPiattoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModificaPiattoPage),
  ],
})
export class ModificaPiattoPageModule {}
