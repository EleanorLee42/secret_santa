import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // auth service code from https://devdactic.com/ionic-firebase-auth-upload

  constructor(private auth: Auth) { }

  async loginUser({ email, password}: {email: string, password: string}) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async signUpUser({ email, password }: {email: string; password: string}) {
    try {
      const user = await createUserWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  logoutUser() {
    return signOut(this.auth);
  }

  // TODO: get reset password working
  // resetPassword(email: string): Promise<void> {
  //   return firebase.auth().sendPasswordResetEmail(email);
  // }

  // getCurrentUser(): string { return firebase.auth().currentUser.email; }

}
