import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'access-denied-page',
  imports: [RouterLink],
  templateUrl: './access-denied-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AccessDeniedPage {}
