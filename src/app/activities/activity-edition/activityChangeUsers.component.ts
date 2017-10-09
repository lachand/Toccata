import {Component, OnInit} from '@angular/core';
import {ActivityService} from '../../services/activity.service';
import {Router} from '@angular/router';
import {MdDialogRef} from '@angular/material';

@Component({
  selector: 'app-activity-change-users',
  templateUrl: './activityChangeUsers.component.html'
})

export class ActivityChangeUsersComponent {

  dialogRef: MdDialogRef<ActivityChangeUsersComponent>;
  userChecked: Array<any>;
  userCheckedInitially: Array<any>;
  usersToChange: Array<any>;

  constructor(public activityService: ActivityService, public router: Router) {
    this.userChecked = [];
    this.userCheckedInitially = []
    for (let user of this.activityService.user.allUsers) {
      if (this.getIndexOf(user.activites, this.activityService.activity_loaded._id) !== -1) {
        console.log("yes");
        this.userChecked.push({'user': user, 'checked': true});
        this.userCheckedInitially.push({'user': user, 'checked': true});
      } else {
        console.log("no");
        this.userChecked.push({'user': user, 'checked': false});
        this.userCheckedInitially.push({'user': user, 'checked': false});
      }
    }
    console.log(this.userChecked);
  }

  getIndexOf(table, id) {
    for (let i = 0; i < table.length; i++) {
      if (table[i].id === id) {
        return i;
      }
    }
    return -1;
  }

  reloadUsers() {
    return this.activityService.user.getAllusers().then(() => {
      this.userChecked = [];
      this.userCheckedInitially = []
      for (const user of this.activityService.user.allUsers) {
        console.log(user.activites.indexOf(this.activityService.activity_loaded._id));
        if (user.activites.indexOf(this.activityService.activity_loaded._id) !== -1) {
          this.userChecked.push({'user': user, 'checked': true});
          this.userCheckedInitially.push({'user': user, 'checked': true});
        } else {
          this.userChecked.push({'user': user, 'checked': false});
          this.userCheckedInitially.push({'user': user, 'checked': false});
        }
      }
    });
  }

  changeUsers() {
    this.usersToChange = [];
    for (let i = 0; i < this.userChecked.length; i++) {
      if (this.userChecked[i].checked !== this.userCheckedInitially[i].checked) {
        let user = this.userChecked[i].user;
        if (this.userChecked[i].checked) {
          user.activites.push({
            'id' : this.activityService.activity_loaded._id,
            'status' : 'paused'});
          for (const activite of this.activityService.activity_loaded_child){
            user.activites.push({
              'id' : activite._id,
              'status' : 'paused'});
            activite.participants.push(user._id);
          }
          this.activityService.activity_loaded.participants.push(user._id);
        } else {
          this.activityService.activity_loaded.participants.splice(this.activityService.activity_loaded.participants.indexOf(user._id),1);
          user.activites.splice(user.activites.indexOf(this.activityService.activity_loaded._id), 1);
          for (const activite of this.activityService.activity_loaded_child){
            user.activites.splice(user.activites.indexOf(activite._id), 1);
            if (activite.participants != null) {
              activite.participants.splice(activite.participants.indexOf(user._id),1);
            }
          }
        }
        this.usersToChange.push(user);
      }
    }
    this.activityService.user.db.bulkDocs(this.usersToChange).then( res2 => {
      this.activityService.db.put(this.activityService.activity_loaded).then( res3 => {
        this.activityService.db.bulkDocs(this.activityService.activity_loaded_child).then( res4 => {
          this.reloadUsers().then( () => this.dialogRef.close());

        });
      });
    });
  }

  changeValue(event) {
    for (const user of this.userChecked) {
      if (user.user.name === event.source.name) {
        user.checked = !user.checked;
      }
    }
  }
}
