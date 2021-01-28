import {
  Component,
  OnInit,
  Input,
  HostBinding,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  trigger,
  state,
  transition,
  animate,
  style,
} from '@angular/animations';

@Component({
  selector: 'app-object-list-item',
  template: `
    <div class="header">
      <ng-content select=".header"></ng-content>
      <span class="spacer"></span>
      <div>
        <button mat-icon-button (click)="remove()">
          <mat-icon>delete</mat-icon>
        </button>
      </div>
      <div>
        <button mat-icon-button (click)="toggle()">
          <mat-icon>{{ minimized ? 'add' : 'remove' }}</mat-icon>
        </button>
      </div>
    </div>
    <div class="content" *ngIf="!minimized" @expand>
      <div>
        <ng-content select=".content"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./object-list-item.component.scss'],
  animations: [
    trigger('expand', [
      state('void', style({ height: '0px', minHeight: '0' })),
      state('*', style({ height: '*' })),
      transition('* => *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ObjectListItemComponent implements OnInit {
  @Output('remove')
  removeEmitter = new EventEmitter<void>();

  @HostBinding('class.minimized')
  @Input()
  minimized = false;

  @Output('minimizedChange')
  minimizedEmitter = new EventEmitter<boolean>();

  @Input()
  control: FormControl;

  constructor() {}

  ngOnInit(): void {}

  toggle() {
    this.minimizedEmitter.emit(!this.minimized);
  }

  remove() {
    this.removeEmitter.emit();
  }
}
