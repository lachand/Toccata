import {Component, ViewChild, ViewEncapsulation, OnInit, Input} from '@angular/core';
import {jqxKanbanComponent} from 'jqwidgets-framework/jqwidgets-ts/angular_jqxkanban';
import {AppsService} from '../../services/apps.service';
import {ActivityService} from '../../services/activity.service';
import {DatabaseService} from '../../services/database.service';
import {isNullOrUndefined} from "util";

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
    element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].innerHTML =
      '<span style="line-height: 23px; margin-left: 5px;">' + resource.name + '</span>';
  }

  columnRenderer: any = (element: any, collapsedElement: any, column: any): void => {
    if (element[0]) {
      if (element[0].getElementsByClassName('jqx-kanban-column-header-title')[0].innerHTML !== 'Backlog') {
        const buttonNew = element[0].getElementsByClassName('jqx-kanban-column-header-custom-button')[0];
        buttonNew.parentElement.removeChild(buttonNew);
      }
      const buttonExpand = element[0].getElementsByClassName('jqx-kanban-column-header-button')[0];
      buttonExpand.parentElement.removeChild(buttonExpand);
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
              public databaseService: DatabaseService) {

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
                }
              }
              if (!finded) {
                this.myKanban.addItem({
                  id: change.doc._id,
                  status: change.doc.state,
                  text: change.doc.label
                });
              }
            }
          }
        }
      }
    );
  }

  myKanbanOnItemAttrClicked(event: any): void {
    const args = event.args;
    if (args.attribute === 'template') {
      console.log(args);
      let id;
      if (isNullOrUndefined(args.item)) {
        id = this.myKanban.getItems()[args.itemId].id;
      } else {
        id = args.item.id;
      }
      this.databaseService.removeDocument(id);
    }
  };

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
          'dbName': this.activityService.activityLoaded.dbName
        };

        this.myKanban.addItem({
          status: postit.state,
          text: `<input placeholder="Noveau post-it" style="width: 96%; margin-top:2px; border-radius: 3px;
          'border-color: #ddd; line-height:20px; height: 20px;" class="jqx-input" id=${postit._id} value= "" />`,
          id: postit._id
        });

        const id = postit._id;
        const myInput = document.getElementById(id);

        if (myInput !== null && myInput !== undefined) {
          myInput.addEventListener('mousedown', (evt: any): void => {
            evt.stopPropagation();
          });

          myInput.addEventListener('mouseup', (evt: any): void => {
            evt.stopPropagation();
          });

          myInput.addEventListener('keydown', (evt: any): void => {
            if (evt.keyCode === 13) {
              const valueElement = `<span>${evt.target.value}</span>`;
              postit.label = valueElement;
              this.myKanban.removeItem(postit._id);
              this.databaseService.addDocument(postit);
            }
          });

          myInput.focus();
        }
      }
    }
  };

  onItemMoved(event): void {
    event.stopPropagation();
    this.databaseService.getDocument(event.args.itemData.id).then(postit => {
      postit['state'] = event.args.newColumn.text;
      this.databaseService.updateDocument(postit);
    });
  }

  ngOnInit(): void {

    this.appsService.getRessources(this.appId).then((res) => {
      const appRessources = res;
      console.log(res);
      for (const element of appRessources['docs']) {
        if (element.ressourceType === 'Column' && element.application === this.appId) {
          const column = {
            text: element.name,
            iconClassName: this.getIconClassName(),
            dataField: element.name,
            collapsible: false
          };
          console.log(column);
          this.columns[element.position] = column;
        } else if (element.ressourceType === 'Postit' && element.application === this.appId) {
          const postit = {
            id: element._id,
            state: element.state,
            label: element.label
          };
          if (this.source.localdata.indexOf(postit) === -1) {
            this.source.localdata.push(postit);
          }
        }
      }
    });

    this.fields = [
      {name: 'id', type: 'string'},
      {name: 'status', map: 'state', type: 'string'},
      {name: 'text', map: 'label', type: 'string'},
      {name: 'tags', type: 'string'},
      {name: 'color', map: 'hex', type: 'string'},
      {name: 'resourceId', type: 'number'}
    ];

    this.source = {
      localData: [{}],
      dataType: 'array',
      dataFields: this.fields
    };

    this.dataAdapter = new jqx.dataAdapter(this.source);

    this.columns = [];

    this.template =
      '<div class="jqx-kanban-item" id="">'
      + '<div class="jqx-kanban-item-color-status"></div>'
      + '<div style="display: none;" class="jqx-kanban-item-avatar"></div>'
      + '<div class="jqx-icon jqx-icon-close jqx-kanban-item-template-content jqx-kanban-template-icon"></div>'
      + '<div class="jqx-kanban-item-text"></div>'
      + '<div style="display: none;" class="jqx-kanban-item-footer"></div>'
      + '</div>';

    this.title = 'Kanban';
  }

  checkNull(elmt) {
    return isNullOrUndefined(elmt);
  }
}
