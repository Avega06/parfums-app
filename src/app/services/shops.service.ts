import { Service } from '@angular/core';
import { ShopImagesSrc } from '../features/shops-images-url';
import { SupabaseClient } from '@supabase/supabase-js';
import { injectSupabase } from '../supabase.config';
import { ShopComments } from '../intefaces';

@Service()
export class ShopService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = injectSupabase();
  }

  getImageUrl(name: string) {
    const shopSelected = ShopImagesSrc.find((shop) => shop.name === name);

    if (!shopSelected) return;

    return shopSelected.src;
  }

  async insertShopComment(shopId: string, rating: number, comment: string) {
    try {
      const { data, error } = await this.supabase.functions.invoke(
        'insert_shop_coments', // Asegúrate de que coincida con el nombre en Supabase
        {
          body: {
            shopId: shopId,
            rating: rating,
            comment: comment,
          },
        },
      );

      if (error) throw error;

      return data; // Esto devolverá el JSON que configuramos en el "Response.json" de la función
    } catch (error) {
      console.error('Error al invocar la Edge Function:', error);
      throw error;
    }
  }

  async getShopComments(shopId: string): Promise<ShopComments[]> {
    try {
      const { data: comments, error } = await this.supabase
        .from('view_shop_comments')
        .select('*')
        .eq('shop_id', shopId)
        .order('created_at', { ascending: false });
      if (error) throw error;

      return comments;
    } catch (error) {
      console.error('Error al intentar encontrar los commentarios', { error });
      throw error;
    }
  }
}
