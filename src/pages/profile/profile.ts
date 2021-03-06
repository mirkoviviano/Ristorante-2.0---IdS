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
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
  user: any;
  email: String;
  firstname: string;
  lastname: string;
  profile: any = {};
  userID: string;
  fName: string;
  lName: string;
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

        this.profile = this.db.collection('profiles').doc(data.uid).valueChanges().subscribe(prof => {
          this.profile = prof;
        });
      }
    });
  }

  ionViewDidLoad() {
    this.profile = this.db.collection('profiles', ref => ref.where('email', '==', this.email)).snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as Profilo;
        const id = a.payload.doc.id;

        return { id, ...data };
      })
    });
  }

  createProfile(profile) {
    this.profile = this.db.collection('profiles').doc(this.userID)
      .update({
        'fName': profile.fName,
        'lName': profile.lName,
        'email': this.email
      })
      .then(() => {
        console.log('updated');
      })
    .catch((error) => {
      this.db.collection('profiles').doc(this.userID)
        .set({
          'fName': profile.fName,
          'lName': profile.lName,
          'ruolo': 'USER',
          'email': this.email
        });
    });
  }

}

interface Profilo {
  fName: string;
  lName: string;
  ruolo: String;
  id_ristorante: string;
  email: string;
}