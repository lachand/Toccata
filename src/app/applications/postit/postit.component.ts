import {Component, ViewChild, ViewEncapsulation, OnInit, Input, ChangeDetectorRef} from '@angular/core';
import {jqxKanbanComponent} from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';
import {AppsService} from '../../services/apps.service';
import {ActivityService} from '../../services/activity.service';
import {DatabaseService} from '../../services/database.service';
import {isNullOrUndefined} from "util";
import {ViewRef_} from "@angular/core/src/view";
import {CreateEditPostitComponent} from "../../activities/createEditPostit/createEditPostit.component";
import {MatDialog} from "@angular/material";
import {LoggerService} from "../../services/logger.service";

@Component({
  selector: 'app-postit',
  templateUrl: './postit.component.html',
  styleUrls: ['./postit.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PostitComponent implements OnInit {

  @Input() appId;
  @ViewChild('myKanban') myKanban: jqxKanbanComponent;

  theme: any;
  fields: any[];
  source: any;
  dataAdapter: any;
  columns: any[];
  template: string;
  title: any;

  itemRenderer = (element: any, item: any, resource: any): void => {
    console.log(item);
    element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].innerHTML = `<div style=" padding-top: 5px; margin-left: 2px">${item.text}</div>`;
    element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].style.color = 'white';
    element[0].getElementsByClassName('jqx-kanban-item-text')[0].innerHTML = `<div style=" margin-top: 2px; margin-left: 2px">${item.content}</div>`;
  }

  columnRenderer: any = (element: any, collapsedElement: any, column: any): void => {
    if (element[0]) {
      if (element[0].getElementsByClassName('jqx-kanban-column-header-title')[0].innerHTML !== 'Backlog') {
      }
    }
  }

  resourcesAdapterFunc = (): any => {
    const resourcesSource = {
      localData: [
        {id: 0, name: '', image: '../jqwidgets/styles/images/common.png', common: true}
      ],
      dataType: 'array',
      dataFields: [
        {name: 'id', type: 'number'},
        {name: 'name', type: 'string'},
        {name: 'image', type: 'string'},
        {name: 'common', type: 'boolean'}
      ]
    };
    const resourcesDataAdapter = new jqx.dataAdapter(resourcesSource);
    return resourcesDataAdapter;
  }
  getIconClassName = (): string => {
    switch (this.theme) {
      case 'darkblue':
      case 'black':
      case 'shinyblack':
      case 'ui-le-frog':
      case 'metrodark':
      case 'orange':
      case 'darkblue':
      case 'highcontrast':
      case 'ui-sunny':
      case 'ui-darkness':
        return 'jqx-icon-plus-alt-white ';
    }
    return 'jqx-icon-plus-alt';
  }

  constructor(public appsService: AppsService,
              public activityService: ActivityService,
              public databaseService: DatabaseService,
              private ref: ChangeDetectorRef,
              public dialog: MatDialog,
              private logger: LoggerService) {

    this.databaseService.changes.subscribe(
      (change) => {
        if (change.doc._deleted) {
          this.myKanban.removeItem(change.doc._id);
        } else {
          if (change.type === 'Ressource application' &&
            change.doc.applicationType === 'Post-it' &&
            change.doc.application === this.appId) {
            if (change.doc.ressourceType === 'Postit') {
              const datas = this.myKanban.source().loadedData;
              let finded = false;
              for (const data of datas) {
                if (data.id === change.doc._id) {
                  finded = true;
                  this.myKanban.updateItem(change.doc._id, {
                    content: change.doc.estimation,
                    status: change.doc.state,
                    text: change.doc.label
                  });
                }
              }
              if (!finded) {
                const postit = {
                  content: change.doc.estimation,
                  id: change.doc._id,
                  status: change.doc.state,
                  text: change.doc.label
                };
                const postitTemp = {
                  content: change.doc.estimation,
                  id: change.doc._id,
                  state: change.doc.state,
                  label: change.doc.label
                }
                this.myKanban.addItem(postit);
                this.ngOnInit();
              }
            }
          }
        }
        if (this.ref !== null &&
          this.ref !== undefined &&
          !(this.ref as ViewRef_).destroyed) {
          this.ref.detectChanges();
        }
      }
    );
  }

  myKanbanonColumnAttrClicked(event: any): void {
    const args = event.args;
    if (args.attribute === 'button') {
      args.cancelToggle = true;
      if (!args.column.collapsed) {
        // Add a new post it
        const postit = {
          '_id': `ressource_application_Post-it_Postit_${this.databaseService.guid()}`,
          'state': args.column.dataField,
          'documentType': 'Ressource application',
          'application': this.appId,
          'applicationType': 'Post-it',
          'ressourceType': 'Postit',
          'label': 'Nouveau Post-it',
          'estimation': '0',
          'dbName': this.activityService.activityLoaded.dbName
        };

        this.createOrEdit(postit);
      }
    }
  };

  itemMoved(event): void {
    //event.stopPropagation();
    if (event.args.newColumn === event.args.oldColumn) {
      this.databaseService.getDocument(event.args.itemData.id).then(postit => {
        this.createOrEdit(postit);
      });
    } else {
      this.logger.log('UPDATE', this.activityService.activityLoaded._id, event.args.itemData.id, 'postit moved');
    }
  }

  ngOnInit(): void {

    this.appsService.getRessources(this.appId).then((res) => {
      const appRessources = res;
      for (const element of appRessources['docs']) {
        if (element.ressourceType === 'Column' && element.application === this.appId) {
          const column = {
            text: element.name,
            iconClassName: this.getIconClassName(),
            dataField: element.name,
            collapsible: false
          };
          this.columns[element.position] = column;
        } else if (element.ressourceType === 'Postit' && element.application === this.appId) {
          const postit = {
            content: element.estimation,
            id: element._id,
            state: element.state,
            label: element.label
          };
          if (this.source.localData.indexOf(postit) === -1) {
            this.source.localData.push(postit);
          }
        }
      }

    });

    this.fields = [

      {name: 'content', type: 'string'},
      {name: 'id', type: 'string'},
      {name: 'status', map: 'state', type: 'string'},
      {name: 'text', map: 'label', type: 'string'},
      {name: 'color', map: 'hex', type: 'string'}
    ];

    this.source = {
      localData: [],
      dataType: 'array',
      dataFields: this.fields
    };

    this.dataAdapter = new jqx.dataAdapter(this.source);

    this.columns = [];

    this.template =
      '<div class="jqx-kanban-item" id="">'
      + '<div class="jqx-kanban-item-color-status"></div>'
      + '<div style="display: none;" class="jqx-kanban-item-avatar"></div>'
      + '<div class="jqx-kanban-item-text"></div>'
      + '<div style="display: none;" class="jqx-kanban-item-footer"></div>'
      + '</div>';

    this.title = `Tableau d'estimations`;
  }

  checkNull(elmt) {
    return isNullOrUndefined(elmt);
  }

  updatePostit(postit) {
    this.databaseService.getDocument(postit._id).then(result => {
      result['estimation'] = postit['estimation'];
      result['label'] = postit['label'];
      this.logger.log('UPDATE', this.activityService.activityLoaded._id, postit._id, 'postit updated');
      this.databaseService.updateDocument(result);
    })
      .catch(err => {
        this.logger.log('CREATE', this.activityService.activityLoaded._id, postit._id, 'postit created');
        this.databaseService.addDocument(postit);
      });
  }

  deletePostit(id) {
    this.databaseService.getDocument(id).then(doc => {
      doc['_deleted'] = true;
      this.databaseService.updateDocument(doc);
    });
  }

  createOrEdit(postit) {
    const dialogRef = this.dialog.open(CreateEditPostitComponent, {data: {postit: postit}});
    dialogRef.componentInstance.dialogRef = dialogRef;
    dialogRef.afterClosed().subscribe(result => {
      if (result.type === 'postit') {
        this.updatePostit(result.value);
      } else if (result.type === 'delete') {
        this.logger.log('DELETE', this.activityService.activityLoaded._id, postit.id, 'postit deleted');
        this.deletePostit(result.value);
      }
    });
  }
}
