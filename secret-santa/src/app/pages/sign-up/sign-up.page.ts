import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DocumentReference, doc, setDoc, getFirestore } from 'firebase/firestore';
import { createThis } from 'typescript';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})

export class SignUpPage implements OnInit {

  // form code from tutorial at: https://devdactic.com/ionic-firebase-auth-upload
  info: FormGroup;
  personRef: DocumentReference;
  docId: string;

  // code from this example: https://stackoverflow.com/questions/73821893/how-do-i-mock-getfirestore-in-jasmine-test
  // to use setDoc(doc())
  db2 = getFirestore();

  constructor(
    private db: AngularFirestore,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
  ) { }

  // getter methods for form inputs
  get email() {
    return this.info.get('email');
  }
  get password() {
    return this.info.get('password');
  }

  ngOnInit() {
    this.info = this.fb.group({
      // Validators for form input
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // called from signUp()
  // makes doc for new Person in People collection
  async makeNewPerson () {
    let personRef = this.db.collection('People').ref.doc();
    this.docId = personRef.id;  // save doc id to pass into URL later

    let newPerson = {
      // form does validation checks for us -- these won't be null
      email: this?.email?.value,
      password: this?.password?.value,
    }
    // create new doc w/ set id
    await setDoc(doc(this.db2, "People", this.docId), newPerson);
  }

  async signUp() {

    // create Person doc for new user
    this.makeNewPerson();

    const loading = await this.loadingController.create();
    await loading.present();

    // register new user thru Firebase API
    const newUser = await this.authService.signUpUser(this.info.value);
    await loading.dismiss();

    if (newUser) {  // if successful, continue on
      this.router.navigate(['/create-profile', this.docId]);
    } else {    // otherwise, display error msg
      this.showAlert('Sign up failed :(', 'Please try again');
    }
  }

  // function to display error message popup/alert
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
