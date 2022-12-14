import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { getAuth, deleteUser, reauthenticateWithCredential } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // auth service code from https://devdactic.com/ionic-firebase-auth-upload

  constructor(private auth: Auth) { }

  // except this code is from https://firebase.google.com/docs/auth/web/manage-users#web-version-9_11 !!
  deleteUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {deleteUser(user);}
      catch (err) {console.log(err);}
    }
    
  }

  async loginUser({ email, password}: {email: string, password: string}) {
    try {
      const user = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  logoutUser() {
    return signOut(this.auth);
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

  reAuthenticate () {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {

    }

    // const credential = promptForCredentials();
    // reauthenticateWithCredential(user, credential)
  }

  // TODO: get reset password working
  // resetPassword(email: string): Promise<void> {
  //   return firebase.auth().sendPasswordResetEmail(email);
  // }

  // getCurrentUser(): string { return firebase.auth().currentUser.email; }

}
