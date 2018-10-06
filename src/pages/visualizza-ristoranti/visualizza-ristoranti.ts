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
  selector: 'page-visualizza-ristoranti',
  templateUrl: 'visualizza-ristoranti.html',
})
export class VisualizzaRistorantiPage {
  ristoranti: any;

  constructor(
    public events: Events,
    private navCtrl: NavController,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    private toast: ToastController
) {

}

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.ristoranti = this.db.collection('ristoranti', ref => ref.where('proprietario', '==', data.uid)).snapshotChanges().map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Ristorante;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        });
      }
    });
  }

  modificaRistorante(ristorante){
    this.navCtrl.push(ModificaRistorantePage, {ristorante: ristorante});
  }

}
interface Ristorante{
  nome: String; 
  descrizione: String; 
  indirizzo: String;
}