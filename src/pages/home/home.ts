import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../services/auth';
// import { FirecloudService } from '../../services/firecloud';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from 'ionic-angular';
import { CreaProfiloPage } from '../crea-profilo/crea-profilo';
import { EffettuaOrdiniPage } from '../effettua-ordini/effettua-ordini';
import { EffettuaPrenotazionePage } from '../effettua-prenotazione/effettua-prenotazione';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  profile: any;
  uid: String; 
  user: any;
  public ristoranti: Observable<any[]>;
  prenotazioni: any;
  ristorante: any;
  isDirettore: boolean;
  isNotStaff: boolean; 
  profileRole: any; 
  prenotazioniPendenti: Observable<any[]>;
  ristoName: any;

  constructor(
    public alertCtrl: AlertController,
    public events: Events,
    private toast: ToastController,
    public navCtrl: NavController,
    // private fireC: FirecloudService,
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    public navParams: NavParams,
    public db: AngularFirestore
  ) {

  } //xc9MDqwi2YP5QJrrHCuUhRoifRG3

  ionViewWillEnter() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.user = this.db.collection('profiles', ref => ref.where('email', '==', data.email)).valueChanges();
        this.user.subscribe(queriedItems => {
          this.profileRole = queriedItems[0].ruolo;

          if(queriedItems.length > 0 && [0].hasOwnProperty('ruolo') == false) {
            this.events.publish('user:isNotStaff');
            this.isNotStaff = true;
          }
          if(queriedItems.length > 0 &&
            queriedItems[0].ruolo == "DIR"){
            this.events.publish('user:isDirettore');
            this.isDirettore = true;
          
          } else if(queriedItems.length > 0 && queriedItems[0].ruolo == "CAM") {
              this.events.publish('user:isCameriere');
              this.prenotazioniPendenti = this.db.collection('prenotazioni', ref => ref.where('accettato', '==', false)).snapshotChanges()
                  .map(actions => {
                    return actions.map( a => {
                      const data = a.payload.doc.data() as Prenotazione;
                      const id = a.payload.doc.id;

                      return {id, ...data};
                    });
                  });

          } else {
            this.ristoranti = this.db.collection('ristoranti').snapshotChanges().map(actions => {
              return actions.map(a => {
                const data = a.payload.doc.data() as Ristorante;
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            });
          }


        });

        this.toast.create({
          message: 'Welcome ' + data.email,
          duration: 3000
        }).present();
        this.profile = data.email;
        
        this.uid = data.uid;
        this.events.publish('user:logged');


        /* Vedi prenotazioni */
        this.prenotazioni = this.db.collection('prenotazioni', ref => ref.where('uid', '==', data.uid)).snapshotChanges().map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Prenotazione;
            const id = a.payload.doc.id;
            const risto = data.ristorante.toString();
            
            /** Recupera nomi ristoranti */
            this.ristorante = this.db.collection('ristoranti').doc(risto).valueChanges();
            this.ristorante.subscribe(aa => {
              data.ristoranteName = aa.nome; // funziona
            });
            return data;
          });
        });


      } else {
        this.toast.create({
          message: 'Wrong credentials!',
          duration: 3000
        }).present();
      }
    });
  }
  
  effettuaPrenotazione(ristorante) {
    this.navCtrl.push(EffettuaPrenotazionePage, {ristorante: ristorante})
  }

  makeOrdine(ristorante, prenotazione){
    this.navCtrl.push(EffettuaOrdiniPage, {ristorante: ristorante, prenotazione: prenotazione});
  }

  accettaPrenotazione(prenotazione){
    let alert = this.alertCtrl.create({
      title: 'Conferma prenotazione',
      message: 'Vuoi confermare questa prenotazione?',
      inputs: [
        {
          name: 'tavolo',
          placeholder: 'Numero tavolo',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'Declina',
          role: 'cancel',
          handler: () => {
            this.db.collection('prenotazioni').doc(prenotazione.id).update({
              'declinato': true
            });
          }
        },
        {
          text: 'Accetta',
          handler: data => {
            this.db.collection('prenotazioni').doc(prenotazione.id).update({
              'tavolo': data.tavolo,
              'accettato': true,
              'declinato': false
            });
          }
        }
      ]
    });
    alert.present();
  }

}


interface Ristorante {
  nome: String;
  descrizione: String;
  indirizzo: String;
}

interface Prenotazione {
  ristorante: String;
  accettato: boolean;
  ristoranteName: String;
  tavolo: string; 
}