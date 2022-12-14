import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { getMessaging } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { environment } from '../../../environments/environment';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute, Router } from '@angular/router';
import { Group, MiniGroup, MiniPerson, Person } from 'src/app/interfaces';
import { DataServiceService } from '../../services/dataService/data-service.service';

@Component({
  selector: 'app-public-group-view',
  templateUrl: './public-group-view.page.html',
  styleUrls: ['./public-group-view.page.scss'],
})
export class PublicGroupViewPage implements OnInit {
  groupID: string;  //Id of current group
  user: Person;
  userID: string;
  private peopleCollection: AngularFirestoreCollection<Person> = this.db.collection<Person>('/People');
  people: Person[];
  group: Group; // Current group
  messaging = getMessaging(initializeApp(environment.firebase));
  userGroupIndex: number;
  groups: Group[];
  inGroup: boolean;

  constructor(private toastCtrl: ToastController,
    private db: AngularFirestore,
    private afMessaging: AngularFireMessaging,
    private route: ActivatedRoute,
    private dataService: DataServiceService,
    private router: Router,) {
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
    this.groups = await this.dataService.getAllGroups();
    this.userIsInGroup();
  }

  userIsInGroup() {
    let peopleIDs: string[] = [];
    this.group.People.forEach((person: MiniPerson) => { peopleIDs.push(person.id) });
    this.inGroup = peopleIDs.includes(this.userID);
  }


  async joinGroup() {

    this.group.People.push({ Name: this.user.Name, id: this.user.id });
    this.user.Groups.push({ GifteeName: "", GifteeID: "", GroupID: this.group.id });
    this.db.collection<Person>('/People').doc(this.userID).update(this.user);
    this.db.collection<Group>('/Groups').doc(this.group.id).update(this.group);
    this.router.navigate(['/group-view', this.group.id, this.userID]);
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
