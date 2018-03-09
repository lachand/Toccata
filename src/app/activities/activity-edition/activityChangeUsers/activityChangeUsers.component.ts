import {Component} from '@angular/core';
import {ActivityService} from '../../../services/activity.service';
import {Router} from '@angular/router';
import {MatDialogRef} from '@angular/material';
import {UserService} from '../../../services/user.service';
import {LoggerService} from '../../../services/logger.service';

@Component({
  selector: 'app-activity-change-users',
  templateUrl: './activityChangeUsers.component.html'
})

export class ActivityChangeUsersComponent {

  dialogRef: MatDialogRef<ActivityChangeUsersComponent>;
  userChecked: Array<any>;
  userCheckedInitially: Array<any>;
  usersToChange: Array<any>;

  constructor(public activityService: ActivityService, public router: Router,
              public userService: UserService, private logger: LoggerService) {
    this.userChecked = [];
    this.userCheckedInitially = [];
    this.userService.getAllUsers().then((allUsers: Array<any>) => {
        this.userService.getParticipants(this.activityService.activityLoaded._id).then((participants: Array<any>) => {
          console.log(allUsers, participants);
          for (const user of allUsers) {
            if (participants.includes(user)) {
              this.userChecked.push({'user': user, 'checked': true});
              this.userCheckedInitially.push({'user': user, 'checked': true});
            } else {
              this.userChecked.push({'user': user, 'checked': false});
              this.userCheckedInitially.push({'user': user, 'checked': false});
            }
          }
        });
      }
    );
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
      this.userCheckedInitially = [];
      for (const user of this.activityService.user.allUsers) {
        console.log(user.activites.indexOf(this.activityService.activityLoaded._id));
        if (user.activites.indexOf(this.activityService.activityLoaded._id) !== -1) {
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

    return Promise.all(this.userChecked.map(userSelected => {
        for (let i = 0; i < this.userCheckedInitially.length; i++) {
          if (userSelected.user === this.userCheckedInitially[i].user && userSelected.checked !== this.userCheckedInitially[i].checked) {
            console.log(userSelected, this.userCheckedInitially[i]);
            const user = userSelected.user;
            if (userSelected.checked) {
              return this.userService.addActivity(this.activityService.activityLoaded._id, user)
                .then(() => {
                  this.logger.log('UPDATE', this.activityService.activityLoaded._id, user, 'user added');
                  return this.activityService.addUser(user, this.activityService.activityLoaded._id);
                });
            } else {
              console.log('remove activity');
              return this.userService.removeActivity(this.activityService.activityLoaded._id, user)
                .then(() => {
                  this.logger.log('UPDATE', this.activityService.activityLoaded._id, user, 'user removed');
                  return this.activityService.removeUser(user, this.activityService.activityLoaded._id);
                });
            }
          }
        }
      this.dialogRef.close();
      }
    ));
  }

  changeValue(event) {
    for (const user of this.userChecked) {
      if (user.user === event.source.name) {
        user.checked = !user.checked;
        console.log(user.checked);
        console.log(this.userChecked);
      }
    }
  }
}
