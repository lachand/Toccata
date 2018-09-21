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
    let userList = [];
    this.dialogRef.close();
    return Promise.all(this.userChecked.map(userSelected => {
        for (let i = 0; i < this.userCheckedInitially.length; i++) {
          console.log(userSelected);
          if (userSelected.checked && userSelected.user === this.userCheckedInitially[i].user) {
            userList.push(userSelected.user);
          }
          if (userSelected.user === this.userCheckedInitially[i].user && userSelected.checked !== this.userCheckedInitially[i].checked) {
            const user = userSelected.user;
            if (userSelected.checked) {
              return this.userService.addActivity(this.activityService.activityLoaded.parent, user)
                .then(() => {
                  this.logger.log('UPDATE', this.activityService.activityLoaded.parent, user, 'user added');
                });
            } else {
              return this.userService.removeActivity(this.activityService.activityLoaded.parent, user)
                .then(() => {
                  this.logger.log('UPDATE', this.activityService.activityLoaded.parent, user, 'user removed');
                });
            }
          }
        }
      }
    )).then( () => {
      return this.activityService.editParticipants(userList, this.activityService.activityLoaded._id);
    });
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
