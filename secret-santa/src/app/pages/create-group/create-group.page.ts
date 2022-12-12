import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ToastController } from '@ionic/angular';

interface MiniPerson {
  Name: string,
  id: string
}

interface Group {
  Name: string,
  joinCode: string,
  numPeople: number,
  id?: string,
  People: MiniPerson[],
  date: string,
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

  constructor(private route: ActivatedRoute,
    private router: Router,
    private db: AngularFirestore,
    private formBuilder: FormBuilder,
    private afMessaging: AngularFireMessaging,
    private toastCtrl: ToastController) {
    this.ngForm = this.formBuilder.group({
      ngForm: ['']
    });
    this.listenForMessages();
  }

  async getGroups() {
    let groupSub = await this.db.collection<Group>('/Groups').ref.get();
    let groups = groupSub.docs.map((doc) => {
      return {
        Name: doc.get("Name"),
        joinCode: doc.get("joinCode"),
        numPeople: doc.get("numPeople"),
        People: doc.get("People"),
        description: doc.get("description"),
        date: doc.get("date"),
        id: doc.id
      };
    });
    groups.forEach(group => { this.codes.push(group.joinCode) });
  }

  async ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
    this.currentDate = new Date().toISOString();
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
    this.getGroups();
    let code = this.getCode();
    while (this.checkCode(code)) {
      code = this.getCode();
    }
    let groupDateString = new Date(this.groupDate).toLocaleString();
    let newGroup: Group = {
      Name: this.groupName,
      joinCode: code,
      numPeople: Number(this.numPeople),
      People: [{ Name: this.user.Name, id: this.user.id }],
      date: groupDateString,
      description: this.groupDescription,
    }
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
