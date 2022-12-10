import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { environment } from '../../../environments/environment';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, throttleTime } from 'rxjs';

interface MiniPerson {
  Name: string,
  id: string
}

interface Group {
  Name: string,
  joinCode: string,
  numPeople: number,
  id: string,
  miniPeople: MiniPerson[],
  date?: Date
}
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
  selector: 'app-user-home',
  templateUrl: './user-home.page.html',
  styleUrls: ['./user-home.page.scss'],
})
export class UserHomePage implements OnInit {
  groupID: string;  //Id of current group
  token: string | undefined | null; //temp - will be moved once authentication is finished
  private peopleCollection: AngularFirestoreCollection<Person> = this.db.collection<Person>('/People');
  people: Person[] | undefined;
  // private groupCollection: AngularFirestoreCollection<Group> = this.db.collection<Group>('/Groups');
  group: Group | undefined; // Current group
  messaging = getMessaging(initializeApp(environment.firebase));

  constructor(
    private alertCtrl: AlertController,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private route: ActivatedRoute
  ) {
    this.listenForMessages();
    // this.groupID = this.route.snapshot.paramMap.get('id') //gets groupID from route parameter
    this.groupID = "ELHEQb5DurQgsSjWplhM";
  }
  assignPartners = () => {
    //Fisher-Yates shuffle from w3schools
    let groupPeople = this.group?.miniPeople;
    for (let i = groupPeople!.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = groupPeople![i];
      groupPeople![i] = groupPeople![j];
      groupPeople![j] = k;
    }
    let peopleIndex: number;
    let groupIndex: number;
    for (let i = 0; i < groupPeople!.length; i++) {
      peopleIndex = this.people!.findIndex((person: Person) => person.id === groupPeople![i].id)
      groupIndex = this.people![peopleIndex].Groups.findIndex((group: MiniGroup) => group.GroupID === this.group!.id)
      this.people![peopleIndex].Groups[groupIndex].GifteeID = groupPeople![(i + 1) % groupPeople!.length].id;
      this.people![peopleIndex].Groups[groupIndex].GifteeName = groupPeople![(i + 1) % groupPeople!.length].Name;
      this.peopleCollection.doc(this.people![peopleIndex].id).update(this.people![peopleIndex]);
    }
    console.log(this.people);
  }
  changeDatabase = (index: number) => {
    let person = this.people![index];
    person.Token = this.token!;
    this.peopleCollection.doc(person.id).update(person);

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
    let groupDoc = this.db.collection<Group>('/Groups').doc(this.groupID).get();
    groupDoc.subscribe(result => {
      if (result) {
        this.group = {
          Name: result.get("Name"),
          joinCode: result.get("joinCode"),
          numPeople: result.get("numPeople"),
          miniPeople: result.get("people"),
          id: result.id
        }
      }
    })
    let ids: string[];
    this.group?.miniPeople.forEach(element => {
      ids.push(element.id);
    });

    let peopleSub = this.peopleCollection.snapshotChanges().subscribe(result => {
      if (result) {
        this.people = result.map((doc) => {
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
    //list of people in currect group
    this.people = this.people?.filter(person => ids.includes(person.id));
  }

}
