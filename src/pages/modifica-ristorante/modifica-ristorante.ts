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
import { ModificaPiattoPage } from '../modifica-piatto/modifica-piatto';
@IonicPage()
@Component({
  selector: 'page-modifica-ristorante',
  templateUrl: 'modifica-ristorante.html',
})
export class ModificaRistorantePage {
  ristorante: any;
  ristoranteID: any;
  ristoranti: any;
  piatto: any = [];
  staff: Observable<Profilo[]>;
  menu: Observable<Menu[]>;

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
  this.ristorante = navPar.get("ristorante");

  this.ristoranti = this.db.collection('ristoranti').snapshotChanges().map(actions => {
    return actions.map(a => {
      const data = a.payload.doc.data() as Ristorante;
      const id = a.payload.doc.id;

      return {id, ...data};
    });
  });

  this.staff = this.db.collection('profiles', ref => ref.where('id_ristorante','==', this.ristorante.id)).snapshotChanges().map(actions => {
    return actions.map( a => {
      const data = a.payload.doc.data() as Profilo;
      const id = a.payload.doc.id;

      return {id, ...data};
    });
  });

  this.menu = this.db.collection('menu', ref => ref.where('ristoranteID', '==', this.ristorante.id)).snapshotChanges().map(actions => {
    return actions.map(a => {
      const data = a.payload.doc.data() as Menu;
      const id = a.payload.doc.id;

      return {id, ...data};
    });
  });
}

  private RistoDoc: AngularFirestoreDocument<Ristorante>;
  modificaRistorante(ristorante){
    this.ristoranteID = ristorante.id;
    this.ristorante = {
      nome: ristorante.nome,
      descrizione: ristorante.descrizione,
      indirizzo: ristorante.indirizzo
    }

    this.ristoranti.forEach(item => {
      item.forEach(elem => {
          if (elem['id'] == this.ristoranteID) {
              this.RistoDoc = this.db.doc<Ristorante>(`ristoranti/${elem['id']}`);
              this.RistoDoc.update({ nome: ristorante.nome, descrizione: ristorante.descrizione, indirizzo: ristorante.indirizzo });
          }
      });
    });
  }

  eliminaRistorante(ristorante){
    let alert = this.alertCtrl.create({
      title: 'Conferma eliminazione',
      message: 'Vuoi davvero eliminare ' + ristorante.nome + ' ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Elimina',
          handler: () => {
            this.db.collection('ristoranti').doc(ristorante.id).delete();
            this.navCtrl.setRoot(VisualizzaRistorantiPage);
          }
        }
      ]
    });
    alert.present();
  }

  aggiungiPiatto(piatto){    
    this.db.collection('menu').add({
      categoria: piatto.categoria,
      piatto: piatto.piatto,
      prezzo: piatto.prezzo,
      ristoranteID: this.ristorante.id
    }).then(aa => {
      console.log('aggiunto');
    });
  }

  private ProfiloDoc: AngularFirestoreDocument<Profilo>;
  licenzia(st) {
    if(st.ruolo != 'DIR'){
      this.db.collection('profiles').doc(st.id).update({
        id_ristorante: null,
        ruolo: null
      }).then(() => {
        console.log('Licenziato');
      });
    }
  }

  modificaPiatto(piatto){
    this.navCtrl.push(ModificaPiattoPage, {piatto: piatto});
  }

}
interface Ristorante{
  nome: String;
  descrizione: String; 
  indirizzo: String;
}
interface Profilo {
  email: string;
  fName: string;
  lName: string;
  id_ristorante: String;
  ruolo: String;
}
interface Menu{
  ristoranteID: string; 
  categoria: string; 
  piatto: string;
  prezzo: string;
}