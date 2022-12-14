import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ToastController } from '@ionic/angular';
import { MiniGroup, Person } from 'src/app/interfaces';
import { DataServiceService } from '../../services/dataService/data-service.service';

@Component({
  selector: 'app-person-view',
  templateUrl: './person-view.page.html',
  styleUrls: ['./person-view.page.scss'],
})
export class PersonViewPage implements OnInit {
  ispartner: boolean;
  userID: string;
  groupID: string;
  personID: string;
  person: Person;

  constructor(private route: ActivatedRoute,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private toastCtrl: ToastController) { this.listenForMessages(); }

  async ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('uid')); //gets userID from route parameter
    this.personID = String(this.route.snapshot.paramMap.get('id')); //gets personID from route parameter
    this.groupID = String(this.route.snapshot.paramMap.get('gid')); //gets groupID from route parameter
    let personDoc = await this.db.collection<Person>('/People').ref.doc(this.personID).get();
    this.person = {
      Groups: personDoc.get("Groups"),
      Interests: personDoc.get("Interests"),
      Name: personDoc.get("Name"),
      PhoneNumber: personDoc.get("PhoneNumber"),
      Token: personDoc.get("Token"),
      email: personDoc.get("email"),
      id: personDoc.id
    }
    let userDoc = await this.db.collection<Person>('/People').ref.doc(this.userID).get();
    let user = {
      Groups: userDoc.get("Groups"),
      Interests: userDoc.get("Interests"),
      Name: userDoc.get("Name"),
      PhoneNumber: userDoc.get("PhoneNumber"),
      Token: userDoc.get("Token"),
      email: userDoc.get("email"),
      id: userDoc.id
    }
    let userGroupIndex = user.Groups.findIndex((element: MiniGroup) => element.GroupID === this.groupID);
    this.ispartner = (user.Groups[userGroupIndex].GifteeID === this.person.id);
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

}
