import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Person } from 'src/app/interfaces';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  // again, heavily leaning on this tutorial: https://devdactic.com/ionic-firebase-auth-upload
  credentials: FormGroup;
  myId: string;

  constructor(
    private db: AngularFirestore,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
  ) { }

  // Getter methods for form inputs
  get email() {
    return this.credentials.get('email');
  }
  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    // define validators for each field
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,]],
    })
  }

  // Using account's email, get user/doc ID and return it for a URL param
  // soln code from: https://stackoverflow.com/questions/64682448/firestore-retrieve-single-document-by-field-value-and-update
  async getUserId() {

    // get Person in People whose email matches form submission
    // (can have only one acct per email, so I figure this is okay?)
    let userDoc = await this.db.collection<Person>('/People').ref.where("email", "==", this?.email?.value).get();

    userDoc.forEach((doc) => {
      this.myId = doc.id;
    })
  }

  // login function to call auth service,
  // handle failed login,
  // navigate to user-home on success
  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.loginUser(this.credentials.value);  // call login from auth service
    await loading.dismiss();

    if (user) {
      await this.getUserId();   // sets this.myId
      this.router.navigate(['/user-home', this.myId]);  // pass this.myId as param
    } else {
      this.showAlert('Login failed :(', 'Please try again!');
    }
  }

  // displays alert on failed login
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}
