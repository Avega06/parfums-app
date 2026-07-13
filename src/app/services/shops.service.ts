import { Service } from '@angular/core';
import { ShopImagesSrc } from '../features/shops-images-url';
import { SupabaseClient } from '@supabase/supabase-js';
import { injectSupabase } from '../supabase.config';

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
}
