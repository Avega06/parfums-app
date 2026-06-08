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
    ],
  },
  {
    name: 'Compra en Chile',
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
    ],
  },
];
