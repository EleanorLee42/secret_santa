import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { environment } from '../../../environments/environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { getDefaultCompilerOptions } from 'typescript';

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
  selector: 'app-group-view',
  templateUrl: './group-view.page.html',
  styleUrls: ['./group-view.page.scss'],
})
export class GroupViewPage implements OnInit {
  groupID!: string;  //Id of current group
  private peopleCollection: AngularFirestoreCollection<Person> = this.db.collection<Person>('/People');
  people: Person[] | undefined;
  // private groupCollection: AngularFirestoreCollection<Group> = this.db.collection<Group>('/Groups');
  group: Group | undefined; // Current group
  messaging = getMessaging(initializeApp(environment.firebase));

  constructor(private alertCtrl: AlertController,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private route: ActivatedRoute) {
    this.listenForMessages();
  }

  getgroupData = async () => {
    let groupDoc = await this.db.collection<Group>('/Groups').ref.doc(this.groupID).get();
    return {
      Name: groupDoc.get("Name"),
      joinCode: groupDoc.get("joinCode"),
      numPeople: groupDoc.get("numPeople"),
      miniPeople: groupDoc.get("people"),
      id: groupDoc.id
    }
  }
  getIds = async (group: Group): Promise<string[]> => {
    console.log(group.miniPeople);
    let ids: string[] = [];
    group.miniPeople.forEach(element => {
      ids.push(element.id);
    });
    console.log(ids);
    return ids;
  }

  async ngOnInit() {
    this.groupID = String(this.route.snapshot.paramMap.get('id')); //gets groupID from route parameter
    console.log(this.groupID);
    // let groupDoc = await this.db.collection<Group>('/Groups').ref.doc(this.groupID).get();
    let group1 = await this.getgroupData();


    const ids: string[] = await this.getIds(group1);
    // console.log(this.group.miniPeople);
    // this.group.miniPeople.forEach(element => {
    //   ids.push(element.id);
    // });
    console.log(ids);

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

}
