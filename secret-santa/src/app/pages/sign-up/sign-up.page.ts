import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { createThis } from 'typescript';
import { AuthService } from '../../services/auth.service';
// import { AngularFireMessaging } from '@angular/fire/compat/messaging';

interface User {
  email: string,
  id: string,
  password: string,
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})

export class SignUpPage implements OnInit {

  // form code from tutorial at: https://devdactic.com/ionic-firebase-auth-upload
  info: FormGroup;

  constructor(
    private db: AngularFirestore,
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
  ) { }

  get email() {
    return this.info.get('email');
  }

  get password() {
    return this.info.get('password');
  }

  ngOnInit() {
    this.info = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  async signUp() {
    const loading = await this.loadingController.create();
    await loading.present();

    const newUser = await this.authService.signUpUser(this.info.value);
    await loading.dismiss();

    if (newUser) {
      this.router.navigateByUrl('/create-profile', { replaceUrl: true });
    } else {
      this.showAlert('Login failed :(', 'Please try again');
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }

}
