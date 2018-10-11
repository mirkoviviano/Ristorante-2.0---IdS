import { Component } from '@angular/core';
import { IonicPage, NavController, DateTime, ToastController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AlertController } from 'ionic-angular';
import { Timestamp, Observable } from 'rxjs';
import { elementAttribute } from '@angular/core/src/render3/instructions';
import moment from 'moment';
import { VisualizzaRistorantiPage } from '../visualizza-ristoranti/visualizza-ristoranti';
import { EmailValidator } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-modifica-piatto',
  templateUrl: 'modifica-piatto.html',
})
export class ModificaPiattoPage {
  piatto: any = [];

  constructor(
    public events: Events,
    private navCtrl: NavController,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    private toast: ToastController,
    private navPar: NavParams
  ) {
    this.piatto = navPar.get("piatto");
  }

  modificaPiatto(piatto){
    this.db.collection('menu').doc(piatto.id).update({
      'piatto': piatto.piatto,
      'prezzo': piatto.prezzo,
      'categoria': piatto.categoria
    }).then(() => {
      console.log('piatto aggiornato');
    })
  }

}