interface ShopNetwork {
  name: string;
  socialNetworks: SocialNetwork[];
}

interface SocialNetwork {
  network: 'Facebook' | 'Instagram' | 'Tiktok';
  icon: string;
  link: string;
}

export const ShopSocialNetworks: ShopNetwork[] = [
  {
    name: 'Mz Perfumes',
    socialNetworks: [
      {
        network: 'Instagram',
        icon: 'instagram.svg',
        link: 'https://www.instagram.com/munoztore_perfumes/',
      },
      {
        network: 'Tiktok',
        icon: 'tiktok.svg',
        link: 'https://www.tiktok.com/@munoztore_perfumes',
      },
      {
        network: 'Facebook',
        icon: 'facebook.svg',
        link: 'https://www.facebook.com/p/munoztore_perfumes-100064201208193/?locale=es_LA',
      },
    ],
  },
  {
    name: 'Cosmetic',
    socialNetworks: [
      {
        network: 'Tiktok',
        icon: 'tiktok.svg',
        link: 'https://www.tiktok.com/@amocosmetic.cl',
      },
      {
        network: 'Facebook',
        icon: 'facebook.svg',
        link: 'https://www.facebook.com/cosmetic.cl1/',
      },
    ],
  },
  {
    name: 'Comprar en Chile',
    socialNetworks: [
      {
        network: 'Instagram',
        icon: 'instagram.svg',
        link: 'https://www.instagram.com/comprarenchilecl/',
      },
      {
        network: 'Tiktok',
        icon: 'tiktok.svg',
        link: 'https://www.tiktok.com/@comprarenchilecl',
      },
      {
        network: 'Facebook',
        icon: 'facebook.svg',
        link: 'https://www.facebook.com/TiktokPerfumes',
      },
    ],
  },
];
