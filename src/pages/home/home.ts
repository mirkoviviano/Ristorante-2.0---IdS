import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../services/auth';
// import { FirecloudService } from '../../services/firecloud'; 
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  profile: any;
  uid: String;
  user: any;
  public items: Observable<any[]>;

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

  }

  ionViewWillEnter() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.user = this.db.collection('profiles', ref => ref.where('email', '==', data.email)).valueChanges();
        this.user.subscribe(queriedItems => {
          if(queriedItems[0].hasOwnProperty('ruolo')==false)
          {
            this.events.publish('user:isNotStaff');
          }
          if (queriedItems[0].ruolo == "DIR")
            this.events.publish('user:isDirettore');
          else {
            this.items = this.db.collection('ristoranti').snapshotChanges().map(actions => {
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
      } else {
        this.toast.create({
          message: 'Wrong credentials!',
          duration: 3000
        }).present();
      }
    });
  }

  alertDescrizione(Item) {
    const alert = this.alertCtrl.create({
      title: Item.nome,
      subTitle: Item.descrizione,
      inputs: [
        {
          name: 'posti',
          placeholder: 'Numero di posti',
          type: 'number'
        },
        {
          name: 'data',
          placeholder: 'Data',
          label: 'Data',
          type: 'date'
        },
        {
          name: 'orario',
          placeholder: 'Orario',
          label: 'Orario',
          type: 'time'
        },
        {
          name: 'telefono',
          placeholder: 'Telefono',
          label: 'Telefono',
          type: 'number'
        },
      ],
      buttons: [
        {
          text: 'Prenota',
          handler: (data) => {
            data.uid = this.uid;
            data.ristorante = Item.id;
            data.accettato = false;
            data.declinato = false;
            this.db.collection('prenotazioni').add(data)
          }
        },
        {
          text: 'Annulla',
          handler: (data) => {

          }
        },
      ]
    });
    alert.present();
  }

}


interface Ristorante {
  nome: String;
  descrizione: String;
}

interface Profilo {
  email: String;
  fName: String;
  lName;
}