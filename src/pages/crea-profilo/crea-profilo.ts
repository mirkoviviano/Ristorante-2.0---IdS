import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../../services/auth';
import { Events } from 'ionic-angular';
import { Observable } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-crea-profilo',
  templateUrl: 'crea-profilo.html',
})
export class CreaProfiloPage {
  user: any = [];
  profile: any;

  constructor(
    public alertCtrl: AlertController,
    public events: Events,
    private toast: ToastController,
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    public navParams: NavParams,
    public db: AngularFirestore
  ) {

  }

  ionViewDidLoad() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.user.email = data.email;
        this.user.uid   = data.uid;
      }
    });
  }

  createProfile(profile){
    console.log('profile ', profile);
    console.log('profile name ', profile.fName);
    console.log('profile lname', profile.lName);
  }

}
