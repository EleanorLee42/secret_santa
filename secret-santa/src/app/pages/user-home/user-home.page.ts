import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { environment } from '../../../environments/environment';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';

interface Group {
  GifteeName: string,
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
  assignPartners = (groupIndex: number) => {
    let partner: Person;
    //Fisher-Yates shuffle from w3schools
    for (let i = this.people!.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = this.people![i];
      this.people![i] = this.people![j];
      this.people![j] = k;
    }
    for (let i = 0; i < this.people!.length; i++) {
      this.people![i].Groups[groupIndex].GifteeID = this.people![(i + 1) % this.people!.length].id;
      this.people![i].Groups[groupIndex].GifteeName = this.people![(i + 1) % this.people!.length].Name;
    }
    console.log(this.people);
    this.people!.forEach(element => {
      this.collection.doc(element.id).update(element);
    });
  }
  changeDatabase = (index: number) => {
    let person = this.people![index];
    person.Token = this.token!;
    // person.Groups[0].GifteeID = person.Groups[0].GifteeID + 1;
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
