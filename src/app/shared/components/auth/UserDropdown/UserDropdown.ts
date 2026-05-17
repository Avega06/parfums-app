import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'user-dropdown',
  imports: [CommonModule, RouterLink],
  templateUrl: './UserDropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDropdown {}
