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

@IonicPage()
@Component({
  selector: 'page-aggiungi-ristorante',
  templateUrl: 'aggiungi-ristorante.html',
})
export class AggiungiRistorantePage {
  email: string;
  userID: string;
  risto: any = {};
  profili: Observable<Profilo[]>;


  constructor(
    public events: Events,
    private navCtrl: NavController,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    private toast: ToastController
  ) {
    this.afAuth.authState.subscribe(data => {
        if (data && data.email && data.uid) {
            this.email = data.email;
            this.userID = data.uid.toString();
        }
    });

    this.profili = this.db
        .collection('profiles')
        .snapshotChanges()
        .map(actions => {
            return actions.map(a => {
                //Get document data
                const data = a.payload.doc.data() as Profilo;

                //Get document id
                const id = a.payload.doc.id;

                //Use spread operator to add the id to the document data
                return { id, ...data };
            });
        });
  }

  addRistorante(risto) {
    this.db.collection('ristoranti').add({
        'nome': risto.nome,
        'descrizione': risto.descrizione,
        'indirizzo': risto.indirizzo,
        'proprietario': this.userID
    }).then(() => {
      this.updateRuoloUtente("DIR");
      this.toast.create({
        message: 'Ristorante aggiunto',
        duration: 3000
      }).present();
    })
    .catch(() => {
      this.toast.create({
        message: 'Errore nell\'aggiungere il ristorante. Riprova',
        duration: 3000
      }).present();
    });
  }

  private ProfiloDoc: AngularFirestoreDocument<Profilo>;
  updateRuoloUtente(ruolo) {
      this.profili.forEach(item => {
          item.forEach(elem => {
              if (elem['email'] == this.email) {
                  this.ProfiloDoc = this.db.doc<Profilo>(`profiles/${elem['id']}`);
                  this.ProfiloDoc.update({ 'ruolo': ruolo });
              }
          })
      })

  }

}
interface Profilo {
    email: string;
    fName: string;
    lName: string;
    id_ristorante: String;
    ruolo: String;
}