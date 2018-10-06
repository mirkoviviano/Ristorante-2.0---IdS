import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../services/auth';
// import { FirecloudService } from '../../services/firecloud';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';

@IonicPage()
@Component({
  selector: 'page-effettua-prenotazione',
  templateUrl: 'effettua-prenotazione.html',
})
export class EffettuaPrenotazionePage {
  ristorante: any; 
  uid: any; 
  email: any;
  prenotazione: any = [];

  constructor(
    public events: Events,
    private toast: ToastController,
    public navCtrl: NavController, 
    // private fireC: FirecloudService,
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    public navParams: NavParams,
    public db: AngularFirestore
  ) {
    this.ristorante = this.navParams.get('ristorante');
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.uid = data.uid;
        this.email = data.email;
      }
    });
  }

  effettuaPrenotazione(prenotazione){
    this.db.collection('prenotazioni').add({
      'posti': prenotazione.posti,
      'telefono': prenotazione.telefono,
      'data': prenotazione.data,
      'orario': prenotazione.orario,
      'ristorante': this.ristorante.id,
      'uid': this.uid,
      'accettato': false,
      'declinato': false
    }).then(() => {
      this.toast.create({
        message: 'Prenotazione inviata!',
        duration: 3000
      }).present();
    });
  }

}
