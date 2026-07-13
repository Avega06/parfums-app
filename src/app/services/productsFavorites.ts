import { Service } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { injectSupabase } from '../supabase.config';

@Service()
export class ProductsFavorites {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = injectSupabase();
  }

  async toggleFavorite(productId: string): Promise<boolean | null> {
    const { data, error } = await this.supabase.rpc('toggle_favorite', {
      target_product_id: productId,
    });

    if (error) throw error;

    return data as boolean;
  }

  async checkProductFavorite(productId: string): Promise<boolean | null> {
    const { data, error } = await this.supabase.rpc('is_product_favorite', {
      target_product_id: productId,
    });

    if (error) throw error;

    return data as boolean;
  }
}
