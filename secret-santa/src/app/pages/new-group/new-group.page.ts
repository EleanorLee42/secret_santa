import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.page.html',
  styleUrls: ['./new-group.page.scss'],
})
export class NewGroupPage implements OnInit {
  userID: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.userID = String(this.route.snapshot.paramMap.get('id')); //gets userID from route parameter
  }

}
