import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { IonInput, ToastController } from '@ionic/angular';
import { MiniGroup, Person } from 'src/app/interfaces';
import { DataServiceService } from '../../services/dataService/data-service.service';
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

  // for focus() function/name input styling
  public whiteText: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private toastCtrl: ToastController) {
    this.getUser();
    this.listenForMessages();
  }

  async getUser() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
    let userDoc = await this.db.collection<Person>('/People').ref.doc(this.userID).get();
    this.user = {
      Groups: userDoc.get("Groups"),
      Interests: userDoc.get("Interests"),
      Name: userDoc.get("Name"),
      PhoneNumber: userDoc.get("PhoneNumber"),
      Token: userDoc.get("Token"),
      email: userDoc.get("email"),
      id: userDoc.id
    }
    this.newEmail = this.user.email;
    this.newName = this.user.Name;
    this.newInterests = this.user.Interests;
    this.newPhone = this.user.PhoneNumber;
  }

  deleteUser () {
    this.authService.deleteUser();
    this.router.navigate(['/home'], { replaceUrl: true });
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
