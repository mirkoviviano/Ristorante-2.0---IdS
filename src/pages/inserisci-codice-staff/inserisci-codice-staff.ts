import { Component } from '@angular/core';
import { IonicPage, NavController, DateTime } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AlertController } from 'ionic-angular';
import { Timestamp } from 'rxjs';
var moment = require('moment')

@IonicPage()
@Component({
    selector: 'page-inserisci-codice-staff',
    templateUrl: 'inserisci-codice-staff.html',
})
export class InserisciCodiceStaffPage {
    ristorante_id: String;
    user: any;
    ruolo = '';
    vediRuolo = false;
    codice = '';

    constructor(
        public events: Events,
        private navCtrl: NavController,
        private auth: AuthService,
        private afAuth: AngularFireAuth,
        public db: AngularFirestore,
        public alertCtrl: AlertController
    ) {
        this.afAuth.authState.subscribe(data => {
            if (data && data.email && data.uid) {
                this.user = this.db.collection('profiles', ref => ref.where('email', '==', data.email)).valueChanges();
            }
        });
    }

    ottieniRuolo() {
        if (this.codice.length == 0) {
            const alert = this.alertCtrl.create({
                title: "Error",
                message: "Codice non inserito",
                buttons: [{ text: 'Ok' }]
            });
            alert.present();
        }
        else {
            var today = moment();
            var doc = this.db.collection('codice-staff', ref => ref.where('codice', '==', this.codice)).valueChanges()
            doc.subscribe(item => {
                var expire_date = moment(item[0]['expire_date'].toDate());
                if (moment(today).isAfter(expire_date) == false) {

                    this.ruolo = item[0]['ruolo'];
                    this.vediRuolo = true;
                }
                else {
                    const alert = this.alertCtrl.create({
                        title: "Error",
                        message: "Codice scaduto",
                        buttons: [{ text: 'Ok' }]
                    });
                    alert.present();
                }
            });
            //Elimino il documento dalla collection
            this.deleteTask();
        }
    }
    deleteTask() {
        this.db.collection('codice-staff').snapshotChanges().pipe(
            d =>
                d.map(actions => actions.map(a => {
                    const data = a.payload.doc.data() ;
                    console.log(data)
                    const id = a.payload.doc.id;
                    return { id, ...data };
                }))
        );
    }
}




interface CodiceStaff {
    codice: String;
    expire_data: DateTime;
    id_ristorante: String;
    ruolo: String;
}