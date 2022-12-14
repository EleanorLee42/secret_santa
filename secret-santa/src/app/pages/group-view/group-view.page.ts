import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { environment } from '../../../environments/environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { Group, MiniGroup, Person } from 'src/app/interfaces';
import { DataServiceService } from 'src/app/services/dataService/data-service.service';
import { deleteDoc, doc, getFirestore } from 'firebase/firestore';


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
  group: Group; // Current group
  messaging = getMessaging(initializeApp(environment.firebase));
  userGroupIndex: number;

  constructor(private toastCtrl: ToastController,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private route: ActivatedRoute,
    private dataService: DataServiceService,
    private router: Router) {
    this.listenForMessages();
    this.groupID = String(this.route.snapshot.paramMap.get('id')); //gets groupID from route parameter
  }

  async ngOnInit() {
    this.user = await this.dataService.getUser();
    this.userGroupIndex = this.user.Groups.findIndex((group: MiniGroup) => group.GroupID === this.groupID);
    this.group = await this.dataService.getOneGroup(this.groupID);
    this.people = await this.dataService.getAllPeople();
    let ids: string[] = [];
    this.group.People.forEach(element => {
      ids.push(element.id);
    });
    this.people = this.people.filter(person => ids.includes(person.id));
    this.userID = this.user.id;
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
      peopleIndex = this.people.findIndex((person: Person) => person.id === groupPeople[i].id);
      groupIndex = this.people[peopleIndex].Groups.findIndex((group: MiniGroup) => group.GroupID === this.group.id);
      this.people[peopleIndex].Groups[groupIndex].GifteeID = groupPeople[(i + 1) % groupPeople.length].id;
      this.people[peopleIndex].Groups[groupIndex].GifteeName = groupPeople[(i + 1) % groupPeople.length].Name;
      this.peopleCollection.doc(this.people![peopleIndex].id).update(this.people![peopleIndex]);
    }
  }

  async deleteGroup() {
    console.log(this.people);
    this.people.forEach((person: Person) => {
      let index = person.Groups.findIndex((group: MiniGroup) => { group.GroupID === this.groupID });
      person.Groups.splice(index, 1);
      this.peopleCollection.doc(person.id).set(person);
    });
    console.log(this.people);
    let datab = getFirestore();
    let docRef = doc(datab, "Groups", this.groupID);
    deleteDoc(docRef);
    // await this.db.collection<Group>('/Group').doc(this.groupID).delete();
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

}
