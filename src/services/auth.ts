import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;
import { Http, Headers } from '@angular/http';

@Injectable()
export class AuthService {
	private user: firebase.User;
	private profile: any;
	private accessToken: any;
	
	constructor(public afAuth: AngularFireAuth, private http: Http) {
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
	}

	signInWithEmail(credentials) {
		console.log('Sign in with email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
	}

	signUp(credentials) {
		return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email,credentials.password);
	}

	get authenticated(): boolean {
		return this.user !== null;
	}

	
	signOut(): Promise<void> {
		return this.afAuth.auth.signOut();
	}

	

	getEmail() {
		return this.user && this.user.email;
	}

	getUserID(){
		return this.user.uid;
	}

	getProfileInfo(userID){
 
		if (this.profile) {
		  return Promise.resolve(this.profile);
		}
	 
		return new Promise(resolve => {
	 
		  this.http.get('http://localhost:3333/userInfo/'+userID)
			.map(res => res.json())
			.subscribe(profile => {
			  this.profile = profile;
			  resolve(this.profile);
			});
		});
	 
	}

	createProfile(profile){
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
	 
		this.http.post('http://localhost:3333/createProfile', JSON.stringify(profile), {headers: headers})
		  .subscribe(res => {
			console.log(res.json());
		});
	}

	

}