import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { SupabaseService } from '../../services';

interface SocialNetworkInfo {
  provider: Provider;
  style: string;
  svgFile: string;
  text: string;
}

type Provider = 'google' | 'facebook' | 'x';

@Component({
  selector: 'social-buttons',
  imports: [],
  templateUrl: './social-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialButtons {
  supabaseService = inject(SupabaseService);

  socialNetworks = computed<SocialNetworkInfo[]>(() => [
    {
      provider: 'google',
      style: 'btn w-sm bg-white text-black border-[#e5e5e5]',
      svgFile: 'google.svg',
      text: 'Login with Google',
    },
    {
      provider: 'facebook',
      style: 'btn w-sm bg-[#1A77F2] text-white border-[#005fd8]',
      svgFile: 'facebook.svg',
      text: 'Login with Facebook',
    },
    {
      provider: 'x',
      style: 'btn w-sm bg-black text-white border-black',
      svgFile: 'x.svg',
      text: 'Login with X',
    },
  ]);

  async socialLogin(provider: Provider) {
    await this.supabaseService.loginWithProvider(provider);
  }
}
