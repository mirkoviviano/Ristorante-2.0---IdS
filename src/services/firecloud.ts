import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Http, Headers } from '@angular/http';
import 'firebase/firestore';

import { Profile } from '../models/profile';
import { share } from 'rxjs/operator/share';

@Injectable()
export class FirecloudService {
	messages: any;
    private db: any;
    model: any = {};
    isEditing: boolean = false;

	constructor() {
        this.db = firebase.firestore();
    }

    getUserInfo(collection: string, document: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.collection(collection)
                .doc(document)
                .get() 
                .then((doc) => {
                    if (!doc.exists) {
                        console.log('No user info!');
                    } else {
                        var obj = JSON.parse(JSON.stringify(doc.data()));
                        obj.$key = doc.id
                        resolve(obj);
                    }                
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }

    getUserWallets(collection: string, document: string): Promise<any>{
        return new Promise((resolve, reject) => {
            this.db.collection(collection) 
                   .doc(document)
                   .get()
                   .then(function(querySnapshot) {
                        let arr = [];  
                        querySnapshot.forEach(function(doc) {
                            var obj = JSON.parse(JSON.stringify(doc.data()));
                            obj.$key = doc.id;
                            arr.push(obj);
                        }); 
                        if (arr.length > 0) {
                            resolve(arr);
                        } 
                    })
                   .catch(function(error) {
                        console.log("Wallet not found: ", error);
                        reject(error);
                    });
        });
    }

    

    getWalletInfo(collection: string, document: string): Promise<any>{
        return new Promise((resolve, reject) => {
            this.db.collection(collection)
                .doc(document)
                .get() 
                .then((doc) => {
                    if (!doc.exists) {
                        console.log('No wallet!');
                    } else {
                        var obj = JSON.parse(JSON.stringify(doc.data()));
                        obj.$key = doc.id
                        resolve(obj);
                    }                
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
        
        /*return new Promise((resolve, reject) => {
            //KBkrOBJRE4TWISRpGGodEVuaZtr2
            this.db.collection(collection)
            .doc(document)
            .get()
            .then(function(querySnapshot) {
                let arr = [];  
                querySnapshot.forEach(function(doc) {
                    var obj = JSON.parse(JSON.stringify(doc.data()));
                    obj.$key = doc.id;
                    arr.push(obj);
                    console.log(arr);
                }); 
                if (arr.length > 0) {
                    resolve(arr);
                } 
            })
            .catch(function(error) {
                console.log("Wallet not found: ", error);
                reject(error);
            });
        });*/
    }

    

    createProfile(profile, userID: string): Promise<any>{
        return new Promise((resolve, reject) => {
            this.db.collection('profiles').doc(userID).set({
                fName: profile.fName,
                lName: profile.lName
            });
        });
    }
	
}