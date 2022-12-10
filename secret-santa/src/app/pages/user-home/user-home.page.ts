import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { environment } from '../../../environments/environment';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

interface Group {
  GifteeID: string,
  GroupID: string
}
interface Person {
  Groups: Group[],
  Interests: string,
  Name: string,
  PhoneNumber: string,
  Token: string,
  email: string,
  id: string,
}


@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
  token: string | undefined | null;
  private collection: AngularFirestoreCollection<Person> = this.db.collection<Person>('/People');
  people: Person[] | undefined;
  messaging = getMessaging(initializeApp(environment.firebase));


  constructor(
    private alertCtrl: AlertController,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging
  ) {
    this.listenForMessages();
  }
  changeDatabase = (index: number) => {
    let person = this.people![index];
    person.Token = this.token!;
    person.Groups[0].GifteeID = person.Groups[0].GifteeID + 1;
    this.collection.doc(person.id).update(person);

  }

  listenForMessages = async () => {
    this.afMessaging.messages.subscribe(async (msg: any) => {
      const alert = await this.alertCtrl.create({
        header: msg.notification.title,
        subHeader: msg.notification.body,
        buttons: ['OK'],
      });

      await alert.present();
    });
  }

  requestPermission() {
    return this.afMessaging.requestToken
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          this.token = token;
        },
        (error) => { console.error(error); },
      );
  }

  ngOnInit() {
    let peopleSub = this.collection.snapshotChanges().subscribe(result => {
      if (result) {
        this.people = result.map(doc => {
          return {
            Groups: doc.payload.doc.data().Groups,
            Interests: doc.payload.doc.data().Interests,
            Name: doc.payload.doc.data().Name,
            PhoneNumber: doc.payload.doc.data().PhoneNumber,
            Token: doc.payload.doc.data().Token,
            email: doc.payload.doc.data().email,
            id: doc.payload.doc.id
          };
        })
      }
    });
  }

}
