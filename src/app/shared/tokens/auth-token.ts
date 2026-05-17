// auth.tokens.ts
import { InjectionToken } from '@angular/core';
import { User } from '@supabase/supabase-js';

export const SSR_USER = new InjectionToken<User | null>('SSR_USER');
export const REQUEST = new InjectionToken<any>('REQUEST');
