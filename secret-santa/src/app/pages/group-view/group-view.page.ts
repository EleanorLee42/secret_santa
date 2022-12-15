import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { environment } from '../../../environments/environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { Group, MiniGroup, Person } from 'src/app/interfaces';
import { DataServiceService } from '../../services/dataService/data-service.service';
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
  ids: string[] = [];
  nicknames: string[] = [];

  constructor(private toastCtrl: ToastController,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private route: ActivatedRoute,
    private dataService: DataServiceService,
    private router: Router) {
    this.listenForMessages();
    this.groupID = String(this.route.snapshot.paramMap.get('id')); //gets groupID from route parameter
  }


  getPersonIndex(personID: string) {
    console.log(this.ids);
    return this.ids?.findIndex((id: string) => id === personID);
  }

  async ngOnInit() {
    this.user = await this.dataService.getUser();
    this.userGroupIndex = this.user.Groups?.findIndex((group: MiniGroup) => group.GroupID === this.groupID);
    this.group = await this.dataService.getOneGroup(this.groupID);
    this.people = await this.dataService.getAllPeople();
    this.group.People.forEach(element => {
      this.ids.push(element.id);
    });
    //set this.people to the list of people who are part of this group
    this.people = this.people.filter(person => this.ids.includes(person.id));
    let id = "";

    //ensures ids, nicknames, and this.people are in the same order
    for (let i = 0; i < this.people.length; i++) {
      for (let j = 0; j < this.people.length; j++) {
        id = this.group.People[j].id;
        if (id === this.people[i].id) {
          this.ids[i] = id;
          this.nicknames[i] = this.group.People[j].nickname;
        }
      }
      this.userID = this.user.id;
    }
  }

  // Assigns each person to a random other person and updates their doc with the nickname and ID of
  //the person they need to get a gift for
  assignPartners = () => {
    //Fisher-Yates shuffle from w3schools, randomly shuffles the list of people in the group
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
      this.people[peopleIndex].Groups[groupIndex].GifteeName = groupPeople[(i + 1) % groupPeople.length].nickname;
      this.peopleCollection.doc(this.people![peopleIndex].id).update(this.people![peopleIndex]);
    }
  }

  // Deletes the group doc, and removed the group from each person's list of groups they're in
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
