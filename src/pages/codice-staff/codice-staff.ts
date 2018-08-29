import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
var generator = require('generate-password-browser');

@IonicPage()
@Component({
    selector: 'page-codice-staff',
    templateUrl: 'codice-staff.html',
})
export class CodiceStaffPage {
    ristorante_id: String;
    user: any;
    ruolo: any;
    codiceGenerato: boolean = false;
    codice: String;

    constructor(
        public events: Events,
        private navCtrl: NavController,
        private auth: AuthService,
        private afAuth: AngularFireAuth,
        public db: AngularFirestore
    ) {
        this.afAuth.authState.subscribe(data => {
            if (data && data.email && data.uid) {
                this.user = this.db.collection('profiles', ref => ref.where('email', '==', data.email)).valueChanges();
                this.user.subscribe(queriedItems => {
                    this.ristorante_id = queriedItems[0].id_ristorante;
                });

            }
        });
    }


    generaCodice() {
        if (this.codiceGenerato != true && this.ruolo!=null) {
            this.codiceGenerato = true;
            this.codice = generator.generate({
                length: 10,
                numbers: true
            })
            var data = {
                codice:this.codice,
                id_ristorante:this.ristorante_id,
                expire_date:new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
                ruolo:this.ruolo
            }
            this.db.collection('codice-staff').add(data)
        }

    }

}