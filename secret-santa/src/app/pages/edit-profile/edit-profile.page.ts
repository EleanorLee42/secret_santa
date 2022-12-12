import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

interface MiniGroup {
  GifteeName: string,
  GifteeID: string,
  GroupID: string
}
interface Person {
  Groups: MiniGroup[],
  Interests: string,
  Name: string,
  PhoneNumber: string,
  Token: string,
  email: string,
  id: string,
}
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

  constructor(
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

  focus() {
    console.log('focus called!');
  //   @ViewChild('IonInput') ionItem: IonItem;
  }

  ngOnInit() {

  }

}
