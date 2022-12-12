import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { environment } from '../../../environments/environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute } from '@angular/router';
import { Timestamp } from 'firebase/firestore';

interface MiniPerson {
  Name: string,
  id: string
}

interface Group {
  Name: string,
  joinCode: string,
  numPeople: number,
  id: string,
  People: MiniPerson[],
  date?: string,
  description: string,
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
  selector: 'app-group-view',
  templateUrl: './group-view.page.html',
  styleUrls: ['./group-view.page.scss'],
})
export class GroupViewPage implements OnInit {
  groupID: string;  //Id of current group
  user: Person;
  userID: string;
  private peopleCollection: AngularFirestoreCollection<Person> = this.db.collection<Person>('/People');
  people: Person[];
  // private groupCollection: AngularFirestoreCollection<Group> = this.db.collection<Group>('/Groups');
  group: Group; // Current group
  messaging = getMessaging(initializeApp(environment.firebase));
  userGroupIndex: number;

  constructor(private toastCtrl: ToastController,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private route: ActivatedRoute) {
    this.listenForMessages();
  }

  async ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('uid')); //gets userID from route parameter
    console.count(this.userID);
    this.groupID = String(this.route.snapshot.paramMap.get('id')); //gets groupID from route parameter
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
    let dateFormatting = { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "numeric" } as const;
    this.userGroupIndex = this.user.Groups.findIndex((group: MiniGroup) => group.GroupID === this.groupID)
    let groupDoc = await this.db.collection<Group>('/Groups').ref.doc(this.groupID).get();
    this.group = {
      Name: groupDoc.get("Name"),
      joinCode: groupDoc.get("joinCode"),
      numPeople: groupDoc.get("numPeople"),
      People: groupDoc.get("People"),
      description: groupDoc.get("description"),
      date: new Date(groupDoc.get("date")).toLocaleString('en-US', dateFormatting),
      id: groupDoc.id
    }
    let ids: string[] = [];
    this.group.People.forEach(element => {
      ids.push(element.id);
    });

    let peopleSnap = await this.db.collection("/People").ref.get();
    this.people = peopleSnap.docs.map((doc) => {
      return {
        Groups: doc.get("Groups"),
        Interests: doc.get("Interests"),
        Name: doc.get("Name"),
        PhoneNumber: doc.get("PhoneNumber"),
        Token: doc.get("Token"),
        email: doc.get("email"),
        id: doc.id
      };
    })
    //list of people in currect group
    this.people = this.people.filter(person => ids.includes(person.id));
  }

  assignPartners = () => {
    //Fisher-Yates shuffle from w3schools
    let groupPeople = this.group.People;
    for (let i = groupPeople.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let k = groupPeople![i];
      groupPeople[i] = groupPeople[j];
      groupPeople[j] = k;
    }
    let peopleIndex: number;
    let groupIndex: number;
    for (let i = 0; i < groupPeople!.length; i++) {
      peopleIndex = this.people.findIndex((person: Person) => person.id === groupPeople[i].id)
      groupIndex = this.people[peopleIndex].Groups.findIndex((group: MiniGroup) => group.GroupID === this.group.id)
      this.people[peopleIndex].Groups[groupIndex].GifteeID = groupPeople[(i + 1) % groupPeople.length].id;
      this.people[peopleIndex].Groups[groupIndex].GifteeName = groupPeople[(i + 1) % groupPeople.length].Name;
      this.peopleCollection.doc(this.people![peopleIndex].id).update(this.people![peopleIndex]);
    }
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
