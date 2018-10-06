import { Component } from '@angular/core';
import { IonicPage, NavController, DateTime, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AlertController } from 'ionic-angular';
import { Timestamp, Observable } from 'rxjs';
import { elementAttribute } from '@angular/core/src/render3/instructions';
import moment from 'moment';
import { ModificaRistorantePage } from '../modifica-ristorante/modifica-ristorante';


@IonicPage()
@Component({
  selector: 'page-visualizza-ordini',
  templateUrl: 'visualizza-ordini.html',
})
export class VisualizzaOrdiniPage {
  ordiniPendenti: any;
  ordine: any;

  constructor(
    public events: Events,
    private navCtrl: NavController,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    private toast: ToastController
  ) {

    this.ordiniPendenti = this.db.collection('ordini', ref => ref.where('consegnato', '==', false)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Ordine;
        const id = a.payload.doc.id;

        return {id, ...data};
      });
    });

  }

  private OrdineDoc: AngularFirestoreDocument<Ordine>;
  consegnaOrdine(ordine){
    this.db.collection('ordini').doc(ordine).update({
      'consegnato': true
    });
  }



}

interface Ordine {
  ristoranteID: string;
  totale: number;
  uid: string; 
  piatti: [];
  consegnato: boolean;
}