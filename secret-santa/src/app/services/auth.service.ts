import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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

  // resetPassword(email: string): Promise<void> {
  //   return firebase.auth().sendPasswordResetEmail(email);
  // }

  // getCurrentUser(): string { return firebase.auth().currentUser.email; }

}
