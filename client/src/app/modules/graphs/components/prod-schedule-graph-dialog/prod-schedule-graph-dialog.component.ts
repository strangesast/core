import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  id: string;
}

@Component({
  selector: 'app-prod-schedule-graph-dialog',
  template: ` <pre>{{ data | json }}</pre> `,
  styleUrls: ['./prod-schedule-graph-dialog.component.scss'],
})
export class ProdScheduleGraphDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {}
}
