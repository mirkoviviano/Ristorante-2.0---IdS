import { Component } from '@angular/core';
import { IonicPage, NavController, DateTime } from 'ionic-angular';
import { AuthService } from '../../services/auth';
import { Events } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AlertController } from 'ionic-angular';
import { Timestamp, Observable } from 'rxjs';
import { elementAttribute } from '@angular/core/src/render3/instructions';
var moment = require('moment')

@IonicPage()
@Component({
    selector: 'page-inserisci-codice-staff',
    templateUrl: 'inserisci-codice-staff.html',
})
export class InserisciCodiceStaffPage {
    ristorante_id: String;
    user: any;
    mail: String;
    ruolo = '';
    vediRuolo = false;
    codice = '';
    codiciStaff: Observable<CodiceStaff[]>;
    profili: Observable<Profilo[]>;
    arrayCodiciStaff: CodiceStaff[];

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
                this.mail = data.email;
            }
        });
        this.codiciStaff = this.db
            .collection('codice-staff')
            .snapshotChanges()
            .map(actions => {
                return actions.map(a => {
                    //Get document data
                    const data = a.payload.doc.data() as CodiceStaff;

                    //Get document id
                    const id = a.payload.doc.id;

                    //Use spread operator to add the id to the document data
                    return { id, ...data };
                });
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
            this.codiciStaff.forEach(item => { //converting oberv in array
                item.forEach(element => {
                    if (element['codice'] == this.codice) {
                        var expire_date = moment(element['expire_date'].toDate());
                        if (moment(today).isAfter(expire_date) == false) {
                            this.ruolo = element['ruolo'] as string;
                            this.vediRuolo = true;
                            this.deleteTask(element['id'])
                            this.updateRuoloUtente(this.ruolo)
                        }
                        else {
                            const alert = this.alertCtrl.create({
                                title: "Error",
                                message: "Codice scaduto",
                                buttons: [{ text: 'Ok' }]
                            });
                            alert.present();
                        }
                    }
                })
            })
        }
    }

    private CodiceStaffDoc: AngularFirestoreDocument<CodiceStaff>;
    deleteTask(id) {
        this.CodiceStaffDoc = this.db.doc<CodiceStaff>(`codice-staff/${id}`);
        this.CodiceStaffDoc.delete();
    }
    private ProfiloDoc: AngularFirestoreDocument<Profilo>;
    updateRuoloUtente(ruolo) {
        this.profili.forEach(item => {
            item.forEach(elem => {
                if (elem['email'] == this.mail) {
                    this.ProfiloDoc = this.db.doc<Profilo>(`profiles/${elem['id']}`);
                    this.ProfiloDoc.update({ ruolo: ruolo });
                }
            })
        })

    }

}


interface Profilo {
    email: string;
    fName: string;
    lName: string;
    id_ristorante: String;
    ruolo: String;
}


interface CodiceStaff {
    codice: String;
    expire_data: Date;
    id_ristorante: String;
    ruolo: String;
}