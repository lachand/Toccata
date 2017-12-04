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
    console.log(item);
    element[0].getElementsByClassName('jqx-kanban-item-color-status')[0].innerHTML = item.text;
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
                  this.myKanban.updateItem(change.doc._id, {
                    content: change.doc.estimation,
                    status: change.doc.state,
                    text: change.doc.label
                  });
                }
              }
              if (!finded) {
                this.myKanban.addItem({
                  content: change.doc.estimation,
                  id: change.doc._id,
                  status: change.doc.state,
                  text: change.doc.label
                });
                console.log(this.myKanban);
              }
            }
          }
        }
      }
    );
  }

  myKanbanOnItemAttrClicked(event: any): void {
    console.log(event);
    const args = event.args;
    let id = '';
    if (isNullOrUndefined(args.item)) {
      id = this.myKanban.getItems()[args.itemId].id;
    } else {
      id = args.item.id;
    }
    if (args.attribute === 'template') {
      this.databaseService.removeDocument(id);
    } else if (args.attribute === 'text') {
      args.item.content = `<input placeholder="Estimation" style="width: 96%; margin-top:2px; border-radius: 3px;
          'border-color: #ddd; line-height:20px; height: 20px;" class="jqx-input" id=${id} value= "" />`;
      this.myKanban.updateItem(id, args.item);
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
            this.databaseService.getDocument(id).then(postit => {
              postit['estimation'] = valueElement;
              this.databaseService.updateDocument(postit);
            });
            console.log(valueElement);
          }
        });

        myInput.focus();
      }
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
          'estimation': '0',
          'dbName': this.activityService.activityLoaded.dbName
        };

        this.myKanban.addItem({
          status: postit.state,
          content: postit.estimation,
          text: `<input placeholder="Nouveau post-it" style="width: 96%; margin-top:2px; border-radius: 3px;
          'border-color: #ddd; line-height:20px; height: 20px;" class="jqx-input" id=${postit._id} value= "" />`,
          id: postit._id
        });

        console.log(this.myKanban);

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
      if (postit['state'] === event.args.newColumn.text) {
        this.changeEstimation(postit, event);
      } else {
        postit['state'] = event.args.newColumn.text;
        this.databaseService.updateDocument(postit);
      }
    });
  }

  changeEstimation(postit, event) {
    const id = postit._id;

    postit.content = `<input placeholder="Estimation" style="width: 96%; margin-top:2px; border-radius: 3px;
          'border-color: #ddd; line-height:20px; height: 20px;" class="jqx-input" id=${id} value= "" />`;
    this.myKanban.updateItem(id, postit);
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
          this.databaseService.getDocument(id).then(newpostit => {
            newpostit['estimation'] = valueElement;
            this.databaseService.updateDocument(newpostit);
          });
          console.log(valueElement);
        }
      });

      myInput.focus();
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

      console.log(this.source);
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

    console.log(this.source);

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
