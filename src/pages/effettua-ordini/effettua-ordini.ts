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
  selector: 'effettua-ordini-page',
  templateUrl: 'effettua-ordini.html',
})
export class EffettuaOrdiniPage {
  ristorante: any;
  ordine: any = [];
  uid: any;
  email: any;
  primi: any;
  secondi: any;
  bevande: any;
  ords: any = [];
  totale: any = 0;
  profili: Observable<Profilo[]>;

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

  ionViewDidLoad() { 
    /** Prendi primi piatti */
    this.primi = this.db.collection('menu', ref => ref.where('ristoranteID', '==', this.ristorante) && ref.where('categoria', '==', 'primi')).valueChanges();
    this.primi.subscribe(primi => {
      
    });

    /** Prendi secondi piatti */
    this.secondi = this.db.collection('menu', ref => ref.where('ristoranteID', '==', this.ristorante) && ref.where('categoria', '==', 'secondi')).valueChanges();
    this.secondi.subscribe(secondi => {
      
    });

    /** Prendi bevande */
    this.bevande = this.db.collection('menu', ref => ref.where('ristoranteID', '==', this.ristorante) && ref.where('categoria', '==', 'bevande')).valueChanges();
    this.bevande.subscribe(bevande => {
      
    });
  }

  ordina(item){
    var data = {
      piatto: item.piatto,
      prezzo: item.prezzo,
      categoria: item.categoria
    }
    this.ords.push(data); 
    this.calcTotale(data.prezzo);
  }

  annulla(item){
    this.ords.splice(this.ords.indexOf(item), 1);
    this.calcTotaleMeno(item.prezzo);
  }

  calcTotale(data){
    return this.totale += parseFloat(data);
  }

  calcTotaleMeno(data){
    return this.totale -= parseFloat(data);
  }

  confermaOrdine(){
    var data = {
      uid: this.uid,
      ristoranteID: this.ristorante.ristorante,
      piatti: this.ords,
      totale: this.totale,
      evaso: false,
      consegnato: false
    }
    this.db.collection('ordini').add(data);
  }

}
interface Profilo {
  email: string;
  fName: string;
  lName: string;
  id_ristorante: String;
  ruolo: String;
}


