import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-logout',
    templateUrl: 'logout.html',
})
export class LogoutPage {

    constructor(
        public events: Events,
        private navCtrl: NavController,
        private auth: AuthService,
    ) { }

    logout() {
        this.auth.signOut().then(() => {
            this.events.publish('user:notLogged');
            this.navCtrl.setRoot(HomePage);
        })

    }

    cancel() {
        this.navCtrl.pop();
    }

}