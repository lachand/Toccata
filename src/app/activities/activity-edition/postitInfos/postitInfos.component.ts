import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AppsService} from '../../../services/apps.service';
import {ActivityService} from "../../../services/activity.service";

@Component({
  selector: 'postit-infos',
  templateUrl: './postitInfos.component.html'
})

export class PostitInfosComponent implements OnInit {

  @Input() appId;
  application: any;
  columns: any;

  constructor(public appsService: AppsService,
              public activityService: ActivityService) {
  }

  ngOnInit(): void {
    this.appsService.getRessources(this.appId).then((res: Array<any>) => {
      this.columns = [];
      this.columns['Backlog'] = [];
      this.columns['Backlog sprint'] = [];
      this.columns['Réalisé'] = [];
      this.columns['En cours'] = [];
      for (const element of res['docs']) {
        if (element.ressourceType === 'Postit') {
          console.log(element.state);
          this.columns[element.state].push(element);
        }
      }
      console.log(this.columns);
    });
  }

}
