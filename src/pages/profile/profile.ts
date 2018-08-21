import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile';
import * as firebase from 'firebase';
import { AuthService } from '../../services/auth'; 
// import { FirecloudService } from '../../services/firecloud'; 

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
  user: any;
  userID: any;
  profileData: any;
  private db: any;
  profile = {} as Profile;
  
  constructor(
    public navCtrl: NavController, 
    public afAuth: AngularFireAuth,
    private auth: AuthService,
    // private fireC: FirecloudService
  ) {
    this.db = firebase.firestore();
  }
  
  ionViewWillEnter(){ 
    this.afAuth.authState.subscribe(data => {
      // this.fireC.getUserInfo("profiles", data.uid.toString()).then((e) => {
      //   this.profileData = e;
      // });
    });
  }

  createProfile(user){  
    this.afAuth.authState.subscribe(data => {
      // this.fireC.createProfile(user, data.uid.toString()).then((e) => {
      //   this.profile = user;
      // });
    });
  }

}
