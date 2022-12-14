import { Component, Input } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'group-banner',
  templateUrl: './group-banner.component.html',
  styleUrls: ['./group-banner.component.scss'],
})
export class GroupBannerComponent {
  @Input() bgColor: string;
  @Input() groupName: string;
  @Input() gifteeName: string;
  @Input() exchangeDate: string;

  constructor(private db: AngularFirestore,) {

  }

}