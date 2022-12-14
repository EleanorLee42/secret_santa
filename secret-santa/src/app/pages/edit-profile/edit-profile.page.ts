import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { MiniGroup, Person } from 'src/app/interfaces';
import { DataServiceService } from '../../services/dataService/data-service.service';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userID: string;
  user: Person;
  newEmail: string;
  newName: string;
  newInterests: string;
  newPhone: string;

  userPassword: string = "";    // used for re-authentication before delete

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private dataService: DataServiceService) {
    this.getUser();
    this.listenForMessages();
  }

  async getUser() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
    this.user = await this.dataService.getUser();
    this.newEmail = this.user.email;
    this.newName = this.user.Name;
    this.newInterests = this.user.Interests;
    this.newPhone = this.user.PhoneNumber;
  }

  /* 
    Called when Delete button is clicked.
    Prompts user to re-enter their password before deleting their account.
    For firebase re-authentication prior to account delete...
  */
  async getUserCredentials() {
    // code for inputs from alert controller from https://stackoverflow.com/questions/68056497/getting-values-of-inputs-in-alert-controller-in-typescript-of-ionic-with-angular
    const alert = await this.alertCtrl.create({
      header: 'Are you sure? Enter password to confirm.',
      inputs: [
        {
          type: 'password',
          name: 'password',
          value: this.userPassword,
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: (values) => {
            this.userPassword = values.password;  // store given password
            this.deleteUser();      // if user confirms, trigger deleteUser()
          }
        }
      ]
    });

    await alert.present();
  }

  /* 
    Called from getUserCredentials().
    Calls authService to reauthenticate, then delete user
  */
  deleteUser () {
    this.deleteUserFromDb();
    this.authService.reAuthenticate(this.userPassword);
    this.authService.deleteUser();
    this.router.navigate(['/home'], { replaceUrl: true });
  }

  async deleteUserFromDb () {
    await this.getUser();
    let datab = getFirestore();
    // Delete user's Person doc
    await deleteDoc(doc(datab, "People", this.userID));
    // Delete user from groups they're in?
    let userGroups =  this.db.collection("Groups", ref => ref.where('People', 'array-contains', this.userID));
    console.log(userGroups);
  }

  editProfile() {
    this.user.Name = this.newName;
    this.user.email = this.newEmail;
    this.user.Interests = this.newInterests;
    this.user.PhoneNumber = this.newPhone;
    this.db.collection<Person>('/People').doc(this.userID).update(this.user);
    this.router.navigate(['/user-home', this.userID]);
  }

  listenForMessages = async () => {
    // Based on https://devdactic.com/ionic-pwa-web-push
    this.afMessaging.messages.subscribe(async (msg: any) => {
      const toast = await this.toastCtrl.create({
        header: msg.notification.title,
        message: msg.notification.body,
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
          }
        ]
      });

      await toast.present();
    });
  }

  ngOnInit() {

  }

}
