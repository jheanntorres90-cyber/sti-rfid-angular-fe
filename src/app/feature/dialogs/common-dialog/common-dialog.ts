import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { DialogModeEnum } from '../../../../enum/dialog-mode-enum';

@Component({
  selector: 'rfid-common-dialog',
  standalone: true,
  imports: [
    Dialog,
    ButtonModule,
    NgClass
  ],
  templateUrl: './common-dialog.html',
  styleUrl: './common-dialog.scss',
})
export class CommonDialog {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();  // 👈 required for [(visible)]

  @Input() header: string = 'Dialog';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() closable: boolean = true;

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  @Input() mode: DialogModeEnum = DialogModeEnum.ADD;

  readonly DialogModeEnum = DialogModeEnum;

  confirm() {
    this.onConfirm.emit();
    this.visible = false;
    this.visibleChange.emit(this.visible); // 👈 notify parent
  }

  cancel() {
    this.onCancel.emit();
    this.visible = false;
    this.visibleChange.emit(this.visible); // 👈 notify parent
  }
}
