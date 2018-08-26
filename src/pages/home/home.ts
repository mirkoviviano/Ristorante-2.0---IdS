import { Component } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile';
import * as firebase from 'firebase';
import { AuthService } from '../../services/auth';
// import { FirecloudService } from '../../services/firecloud'; 
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  profile: any;

  constructor(
    public events: Events,
    private toast: ToastController,
    public navCtrl: NavController,
    // private fireC: FirecloudService,
    private afAuth: AngularFireAuth,
    private auth: AuthService,
    public navParams: NavParams
  ) {

  }

  ionViewWillEnter() {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.toast.create({
          message: 'Welcome ' + data.email,
          duration: 3000
        }).present();
        this.profile = data.email;
        this.events.publish('user:logged');
      } else {
        this.toast.create({
          message: 'Wrong credentials!',
          duration: 3000
        }).present();
      }
    });
  }

}