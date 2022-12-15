import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ToastController } from '@ionic/angular';
import { Group, MiniGroup, MiniPerson, Person } from 'src/app/interfaces';
import { DataServiceService } from '../../services/dataService/data-service.service';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
})
export class CreateGroupPage implements OnInit {
  userID: string;
  currentDate: string;
  ngForm: FormGroup;
  groupName: string;
  groupDate: string;
  groupDescription: string;
  numPeople: string;
  codes: string[] = [];
  user: Person;
  nickname: string;
  isPublic: boolean = false;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore,
    private formBuilder: FormBuilder,
    private afMessaging: AngularFireMessaging,
    private toastCtrl: ToastController,
    private dataService: DataServiceService) {
    this.ngForm = this.formBuilder.group({
      ngForm: ['']
    });
    this.listenForMessages();
  }

  async ngOnInit() {
    // this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
    this.currentDate = new Date().toISOString();
    this.user = await this.dataService.getUser();
    this.userID = this.user.id;
    this.nickname = this.user.Name
  }

  checkCode(newCode: string): boolean {
    return this.codes.includes(newCode);
  }
  getCode(): string {
    //code to make random string:
    // https://www.programiz.com/javascript/examples/generate-random-strings
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }

  async makeGroup() {
    let groups = await this.dataService.getAllGroups();
    groups.forEach(group => { this.codes.push(group.joinCode) });

    let code = this.getCode();
    while (this.checkCode(code)) {
      code = this.getCode();
    }

    let groupDateString = new Date(this.groupDate).toLocaleString();
    let newGroup: Group = {
      Name: this.groupName,
      joinCode: code,
      numPeople: Number(this.numPeople),
      People: [{ Name: this.user.Name, id: this.user.id, nickname: this.nickname }],
      date: groupDateString,
      description: this.groupDescription,
      isPublic: this.isPublic,
      id: "",
      adminID: this.userID,
    }
    console.log(newGroup);
    let newDoc = await this.db.collection<Group>('/Groups').add(newGroup);
    this.user.Groups.push({ GifteeName: "", GifteeID: "", GroupID: newDoc.id });
    this.db.collection<Person>('/People').doc(this.userID).update(this.user);
    this.router.navigate(['/group-view', newDoc.id, this.userID]);
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
