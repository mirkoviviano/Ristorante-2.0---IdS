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
  consegnati: any;
  inviati: any;
  finalTotale: any = 0; 
  prenotazione: any; 
  getTotal: any;

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
    this.prenotazione = this.navParams.get('prenotazione');

    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.uid = data.uid;
        this.email = data.email;


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

        console.log(this.prenotazione.ristorante);
        this.inviati = this.db.collection('ordini', ref => ref.where('uid', '==', this.uid) && ref.where('ristoranteID', '==', this.prenotazione.ristorante) && ref.orderBy('consegnato'))
          .snapshotChanges().map(actions => {
            return actions.map(a => {
              const data = a.payload.doc.data() as Ordine;
              const id = a.payload.doc.id;

              return {id, ...data};
            });
          });

        this.getTotal = this.db.collection('ordini', ref => ref.where('uid', '==', this.uid) && ref.where('ristoranteID', '==', this.prenotazione.ristorante))
            .valueChanges();

        this.getTotal.subscribe(ords => {
          ords.forEach(ord => {
            if(ord.consegnato == true){
              this.calcTotale(ord.prezzo);
            }
          });
        });
                              
        
      }
    });
  }

  ionViewDidLoad() { 
    /** Prendi primi piatti */
    this.primi = this.db.collection('menu', ref => ref.where('ristoranteID', '==', this.prenotazione.ristorante) && ref.where('categoria', '==', 'primi')).valueChanges();
    this.primi.subscribe(primi => {
      
    });

    /** Prendi secondi piatti */
    this.secondi = this.db.collection('menu', ref => ref.where('ristoranteID', '==', this.prenotazione.ristorante) && ref.where('categoria', '==', 'secondi')).valueChanges();
    this.secondi.subscribe(secondi => {
      
    });

    /** Prendi bevande */
    this.bevande = this.db.collection('menu', ref => ref.where('ristoranteID', '==', this.prenotazione.ristorante) && ref.where('categoria', '==', 'bevande')).valueChanges();
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
    this.calcTotale(item.prezzo);
  }
  annulla(item){
    this.ords.splice(this.ords.indexOf(item), 1);
    this.calcTotaleMeno(item.prezzo);
  }

  confermaOrdine(){
    this.ords.forEach(ordine => {
      this.db.collection('ordini').add({
        uid: this.uid,
        ristoranteID: this.prenotazione.ristorante,
        categoria: ordine.categoria,
        prezzo: ordine.prezzo,
        piatto: ordine.piatto,
        consegnato: false,
        tavolo: this.prenotazione.tavolo
      }).then(() => {
        this.toast.create({
          message: 'Ordine inviato',
          duration: 3000
        }).present();
        this.ords = [];
        this.totale = 0;
      });
    });
  }


  calcTotale(data){
    return this.totale += parseFloat(data);
  }

  calcTotaleMeno(data){
    return this.totale -= parseFloat(data);
  }

}
interface Profilo {
  email: string;
  fName: string;
  lName: string;
  id_ristorante: String;
  ruolo: String;
}

interface Ordine {
  ristoranteID: string;
  totale: number;
  uid: string; 
  
  consegnato: boolean;
}