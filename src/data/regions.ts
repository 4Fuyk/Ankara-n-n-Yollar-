import { Region, Province } from '../types';

export const regions: Region[] = [
  { id: 'marmara', name: 'Marmara Bölgesi', color: '#1e3a8a' }, // Deep Blue
  { id: 'ege', name: 'Ege Bölgesi', color: '#0d9488' }, // Teal
  { id: 'akdeniz', name: 'Akdeniz Bölgesi', color: '#0284c7' }, // Sky Blue
  { id: 'icanadolu', name: 'İç Anadolu Bölgesi', color: '#d97706' }, // Amber
  { id: 'karadeniz', name: 'Karadeniz Bölgesi', color: '#16a34a' }, // Green
  { id: 'doguanadolu', name: 'Doğu Anadolu Bölgesi', color: '#b45309' }, // Brown-orange
  { id: 'guneydogu', name: 'Güneydoğu Anadolu Bölgesi', color: '#7c3aed' } // Purple
];

export const provincesData: Omit<Province, 'votes'>[] = [
  {
    id: 1, name: 'Adana', regionId: 'akdeniz', voterCount: 1610000,
    demographics: { muhafazakar: 0.25, milliyetci: 0.25, sosyalDemokrat: 0.30, sosyalist: 0.12, liberal: 0.08 }
  },
  {
    id: 2, name: 'Adıyaman', regionId: 'guneydogu', voterCount: 410000,
    demographics: { muhafazakar: 0.50, milliyetci: 0.15, sosyalDemokrat: 0.15, sosyalist: 0.15, liberal: 0.05 }
  },
  {
    id: 3, name: 'Afyonkarahisar', regionId: 'ege', voterCount: 540000,
    demographics: { muhafazakar: 0.45, milliyetci: 0.35, sosyalDemokrat: 0.12, sosyalist: 0.03, liberal: 0.05 }
  },
  {
    id: 4, name: 'Ağrı', regionId: 'doguanadolu', voterCount: 300000,
    demographics: { muhafazakar: 0.35, milliyetci: 0.05, sosyalDemokrat: 0.05, sosyalist: 0.50, liberal: 0.05 }
  },
  {
    id: 5, name: 'Amasya', regionId: 'karadeniz', voterCount: 260000,
    demographics: { muhafazakar: 0.35, milliyetci: 0.30, sosyalDemokrat: 0.28, sosyalist: 0.02, liberal: 0.05 }
  },
  {
    id: 6, name: 'Ankara', regionId: 'icanadolu', voterCount: 4200000,
    demographics: { muhafazakar: 0.32, milliyetci: 0.24, sosyalDemokrat: 0.34, sosyalist: 0.04, liberal: 0.06 }
  },
  {
    id: 7, name: 'Antalya', regionId: 'akdeniz', voterCount: 1950000,
    demographics: { muhafazakar: 0.22, milliyetci: 0.25, sosyalDemokrat: 0.38, sosyalist: 0.05, liberal: 0.10 }
  },
  {
    id: 8, name: 'Artvin', regionId: 'karadeniz', voterCount: 1350000,
    demographics: { muhafazakar: 0.28, milliyetci: 0.22, sosyalDemokrat: 0.42, sosyalist: 0.03, liberal: 0.05 }
  },
  {
    id: 9, name: 'Aydın', regionId: 'ege', voterCount: 840000,
    demographics: { muhafazakar: 0.24, milliyetci: 0.22, sosyalDemokrat: 0.42, sosyalist: 0.04, liberal: 0.08 }
  },
  {
    id: 10, name: 'Balıkesir', regionId: 'marmara', voterCount: 970000,
    demographics: { muhafazakar: 0.32, milliyetci: 0.26, sosyalDemokrat: 0.32, sosyalist: 0.03, liberal: 0.07 }
  },
  {
    id: 11, name: 'Bilecik', regionId: 'marmara', voterCount: 160000,
    demographics: { muhafazakar: 0.34, milliyetci: 0.24, sosyalDemokrat: 0.32, sosyalist: 0.03, liberal: 0.07 }
  },
  {
    id: 12, name: 'Bingöl', regionId: 'doguanadolu', voterCount: 190000,
    demographics: { muhafazakar: 0.55, milliyetci: 0.10, sosyalDemokrat: 0.05, sosyalist: 0.25, liberal: 0.05 }
  },
  {
    id: 13, name: 'Bitlis', regionId: 'doguanadolu', voterCount: 220000,
    demographics: { muhafazakar: 0.45, milliyetci: 0.10, sosyalDemokrat: 0.05, sosyalist: 0.35, liberal: 0.05 }
  },
  {
    id: 14, name: 'Bolu', regionId: 'karadeniz', voterCount: 240000,
    demographics: { muhafazakar: 0.43, milliyetci: 0.28, sosyalDemokrat: 0.22, sosyalist: 0.02, liberal: 0.05 }
  },
  {
    id: 15, name: 'Burdur', regionId: 'akdeniz', voterCount: 200000,
    demographics: { muhafazakar: 0.30, milliyetci: 0.30, sosyalDemokrat: 0.32, sosyalist: 0.02, liberal: 0.06 }
  },
  {
    id: 16, name: 'Bursa', regionId: 'marmara', voterCount: 2360000,
    demographics: { muhafazakar: 0.40, milliyetci: 0.22, sosyalDemokrat: 0.28, sosyalist: 0.04, liberal: 0.06 }
  },
  {
    id: 17, name: 'Çanakkale', regionId: 'marmara', voterCount: 430000,
    demographics: { muhafazakar: 0.25, milliyetci: 0.20, sosyalDemokrat: 0.46, sosyalist: 0.03, liberal: 0.06 }
  },
  {
    id: 18, name: 'Çankırı', regionId: 'icanadolu', voterCount: 140000,
    demographics: { muhafazakar: 0.48, milliyetci: 0.42, sosyalDemokrat: 0.06, sosyalist: 0.01, liberal: 0.03 }
  },
  {
    id: 19, name: 'Çorum', regionId: 'karadeniz', voterCount: 400000,
    demographics: { muhafazakar: 0.48, milliyetci: 0.28, sosyalDemokrat: 0.20, sosyalist: 0.02, liberal: 0.02 }
  },
  {
    id: 20, name: 'Denizli', regionId: 'ege', voterCount: 780000,
    demographics: { muhafazakar: 0.30, milliyetci: 0.26, sosyalDemokrat: 0.36, sosyalist: 0.03, liberal: 0.05 }
  },
  {
    id: 21, name: 'Diyarbakır', regionId: 'guneydogu', voterCount: 1140000,
    demographics: { muhafazakar: 0.24, milliyetci: 0.02, sosyalDemokrat: 0.06, sosyalist: 0.65, liberal: 0.03 }
  },
  {
    id: 22, name: 'Edirne', regionId: 'marmara', voterCount: 320000,
    demographics: { muhafazakar: 0.20, milliyetci: 0.16, sosyalDemokrat: 0.54, sosyalist: 0.04, liberal: 0.06 }
  },
  {
    id: 23, name: 'Elazığ', regionId: 'doguanadolu', voterCount: 430000,
    demographics: { muhafazakar: 0.52, milliyetci: 0.30, sosyalDemokrat: 0.10, sosyalist: 0.05, liberal: 0.03 }
  },
  {
    id: 24, name: 'Erzincan', regionId: 'doguanadolu', voterCount: 170000,
    demographics: { muhafazakar: 0.40, milliyetci: 0.28, sosyalDemokrat: 0.28, sosyalist: 0.02, liberal: 0.02 }
  },
  {
    id: 25, name: 'Erzurum', regionId: 'doguanadolu', voterCount: 510000,
    demographics: { muhafazakar: 0.48, milliyetci: 0.38, sosyalDemokrat: 0.06, sosyalist: 0.05, liberal: 0.03 }
  },
  {
    id: 26, name: 'Eskişehir', regionId: 'icanadolu', voterCount: 680000,
    demographics: { muhafazakar: 0.28, milliyetci: 0.20, sosyalDemokrat: 0.44, sosyalist: 0.03, liberal: 0.05 }
  },
  {
    id: 27, name: 'Gaziantep', regionId: 'guneydogu', voterCount: 1390000,
    demographics: { muhafazakar: 0.46, milliyetci: 0.18, sosyalDemokrat: 0.18, sosyalist: 0.13, liberal: 0.05 }
  },
  {
    id: 28, name: 'Giresun', regionId: 'karadeniz', voterCount: 350000,
    demographics: { muhafazakar: 0.46, milliyetci: 0.32, sosyalDemokrat: 0.18, sosyalist: 0.01, liberal: 0.03 }
  },
  {
    id: 29, name: 'Gümüşhane', regionId: 'karadeniz', voterCount: 95000,
    demographics: { muhafazakar: 0.48, milliyetci: 0.43, sosyalDemokrat: 0.06, sosyalist: 0.01, liberal: 0.02 }
  },
  {
    id: 30, name: 'Hakkari', regionId: 'doguanadolu', voterCount: 180000,
    demographics: { muhafazakar: 0.18, milliyetci: 0.03, sosyalDemokrat: 0.03, sosyalist: 0.73, liberal: 0.03 }
  },
  {
    id: 31, name: 'Hatay', regionId: 'akdeniz', voterCount: 1060000,
    demographics: { muhafazakar: 0.32, milliyetci: 0.18, sosyalDemokrat: 0.36, sosyalist: 0.10, liberal: 0.04 }
  },
  {
    id: 32, name: 'Isparta', regionId: 'akdeniz', voterCount: 330000,
    demographics: { muhafazakar: 0.38, milliyetci: 0.35, sosyalDemokrat: 0.20, sosyalist: 0.02, liberal: 0.05 }
  },
  {
    id: 33, name: 'Mersin', regionId: 'akdeniz', voterCount: 1360000,
    demographics: { muhafazakar: 0.20, milliyetci: 0.24, sosyalDemokrat: 0.36, sosyalist: 0.14, liberal: 0.06 }
  },
  {
    id: 34, name: 'İstanbul', regionId: 'marmara', voterCount: 11300000,
    demographics: { muhafazakar: 0.35, milliyetci: 0.16, sosyalDemokrat: 0.35, sosyalist: 0.08, liberal: 0.06 }
  },
  {
    id: 35, name: 'İzmir', regionId: 'ege', voterCount: 3400000,
    demographics: { muhafazakar: 0.18, milliyetci: 0.16, sosyalDemokrat: 0.52, sosyalist: 0.06, liberal: 0.08 }
  },
  {
    id: 36, name: 'Kars', regionId: 'doguanadolu', voterCount: 185000,
    demographics: { muhafazakar: 0.26, milliyetci: 0.24, sosyalDemokrat: 0.22, sosyalist: 0.24, liberal: 0.04 }
  },
  {
    id: 37, name: 'Kastamonu', regionId: 'karadeniz', voterCount: 300000,
    demographics: { muhafazakar: 0.44, milliyetci: 0.38, sosyalDemokrat: 0.14, sosyalist: 0.01, liberal: 0.03 }
  },
  {
    id: 38, name: 'Kayseri', regionId: 'icanadolu', voterCount: 1020000,
    demographics: { muhafazakar: 0.50, milliyetci: 0.32, sosyalDemokrat: 0.12, sosyalist: 0.02, liberal: 0.04 }
  },
  {
    id: 39, name: 'Kırklareli', regionId: 'marmara', voterCount: 290000,
    demographics: { muhafazakar: 0.20, milliyetci: 0.16, sosyalDemokrat: 0.56, sosyalist: 0.03, liberal: 0.05 }
  },
  {
    id: 40, name: 'Kırşehir', regionId: 'icanadolu', voterCount: 175000,
    demographics: { muhafazakar: 0.38, milliyetci: 0.30, sosyalDemokrat: 0.26, sosyalist: 0.03, liberal: 0.03 }
  },
  {
    id: 41, name: 'Kocaeli', regionId: 'marmara', voterCount: 1470000,
    demographics: { muhafazakar: 0.42, milliyetci: 0.20, sosyalDemokrat: 0.26, sosyalist: 0.06, liberal: 0.06 }
  },
  {
    id: 42, name: 'Konya', regionId: 'icanadolu', voterCount: 1620000,
    demographics: { muhafazakar: 0.58, milliyetci: 0.26, sosyalDemokrat: 0.10, sosyalist: 0.02, liberal: 0.04 }
  },
  {
    id: 43, name: 'Kütahya', regionId: 'ege', voterCount: 440000,
    demographics: { muhafazakar: 0.50, milliyetci: 0.32, sosyalDemokrat: 0.12, sosyalist: 0.01, liberal: 0.05 }
  },
  {
    id: 44, name: 'Malatya', regionId: 'doguanadolu', voterCount: 550000,
    demographics: { muhafazakar: 0.52, milliyetci: 0.22, sosyalDemokrat: 0.19, sosyalist: 0.05, liberal: 0.02 }
  },
  {
    id: 45, name: 'Manisa', regionId: 'ege', voterCount: 1100000,
    demographics: { muhafazakar: 0.34, milliyetci: 0.28, sosyalDemokrat: 0.30, sosyalist: 0.04, liberal: 0.04 }
  },
  {
    id: 46, name: 'Kahramanmaraş', regionId: 'akdeniz', voterCount: 760000,
    demographics: { muhafazakar: 0.54, milliyetci: 0.28, sosyalDemokrat: 0.12, sosyalist: 0.04, liberal: 0.02 }
  },
  {
    id: 47, name: 'Mardin', regionId: 'guneydogu', voterCount: 540000,
    demographics: { muhafazakar: 0.30, milliyetci: 0.02, sosyalDemokrat: 0.05, sosyalist: 0.58, liberal: 0.05 }
  },
  {
    id: 48, name: 'Muğla', regionId: 'ege', voterCount: 780000,
    demographics: { muhafazakar: 0.20, milliyetci: 0.20, sosyalDemokrat: 0.50, sosyalist: 0.03, liberal: 0.07 }
  },
  {
    id: 49, name: 'Muş', regionId: 'doguanadolu', voterCount: 240000,
    demographics: { muhafazakar: 0.36, milliyetci: 0.04, sosyalDemokrat: 0.04, sosyalist: 0.52, liberal: 0.04 }
  },
  {
    id: 50, name: 'Nevşehir', regionId: 'icanadolu', voterCount: 220000,
    demographics: { muhafazakar: 0.44, milliyetci: 0.36, sosyalDemokrat: 0.14, sosyalist: 0.01, liberal: 0.05 }
  },
  {
    id: 51, name: 'Niğde', regionId: 'icanadolu', voterCount: 250000,
    demographics: { muhafazakar: 0.40, milliyetci: 0.33, sosyalDemokrat: 0.21, sosyalist: 0.01, liberal: 0.05 }
  },
  {
    id: 52, name: 'Ordu', regionId: 'karadeniz', voterCount: 580000,
    demographics: { muhafazakar: 0.46, milliyetci: 0.24, sosyalDemokrat: 0.24, sosyalist: 0.01, liberal: 0.05 }
  },
  {
    id: 53, name: 'Rize', regionId: 'karadeniz', voterCount: 260000,
    demographics: { muhafazakar: 0.60, milliyetci: 0.24, sosyalDemokrat: 0.11, sosyalist: 0.01, liberal: 0.04 }
  },
  {
    id: 54, name: 'Sakarya', regionId: 'marmara', voterCount: 750000,
    demographics: { muhafazakar: 0.50, milliyetci: 0.26, sosyalDemokrat: 0.14, sosyalist: 0.03, liberal: 0.07 }
  },
  {
    id: 55, name: 'Samsun', regionId: 'karadeniz', voterCount: 1010000,
    demographics: { muhafazakar: 0.44, milliyetci: 0.28, sosyalDemokrat: 0.22, sosyalist: 0.01, liberal: 0.05 }
  },
  {
    id: 56, name: 'Siirt', regionId: 'guneydogu', voterCount: 200000,
    demographics: { muhafazakar: 0.42, milliyetci: 0.04, sosyalDemokrat: 0.04, sosyalist: 0.46, liberal: 0.04 }
  },
  {
    id: 57, name: 'Sinop', regionId: 'karadeniz', voterCount: 170000,
    demographics: { muhafazakar: 0.38, milliyetci: 0.22, sosyalDemokrat: 0.35, sosyalist: 0.01, liberal: 0.04 }
  },
  {
    id: 58, name: 'Sivas', regionId: 'icanadolu', voterCount: 460000,
    demographics: { muhafazakar: 0.46, milliyetci: 0.36, sosyalDemokrat: 0.13, sosyalist: 0.02, liberal: 0.03 }
  },
  {
    id: 59, name: 'Tekirdağ', regionId: 'marmara', voterCount: 820000,
    demographics: { muhafazakar: 0.24, milliyetci: 0.16, sosyalDemokrat: 0.48, sosyalist: 0.05, liberal: 0.07 }
  },
  {
    id: 60, name: 'Tokat', regionId: 'karadeniz', voterCount: 440000,
    demographics: { muhafazakar: 0.44, milliyetci: 0.34, sosyalDemokrat: 0.18, sosyalist: 0.01, liberal: 0.03 }
  },
  {
    id: 61, name: 'Trabzon', regionId: 'karadeniz', voterCount: 610000,
    demographics: { muhafazakar: 0.48, milliyetci: 0.32, sosyalDemokrat: 0.15, sosyalist: 0.01, liberal: 0.04 }
  },
  {
    id: 62, name: 'Tunceli', regionId: 'doguanadolu', voterCount: 65000,
    demographics: { muhafazakar: 0.05, milliyetci: 0.02, sosyalDemokrat: 0.38, sosyalist: 0.52, liberal: 0.03 }
  },
  {
    id: 63, name: 'Şanlıurfa', regionId: 'guneydogu', voterCount: 1250000,
    demographics: { muhafazakar: 0.52, milliyetci: 0.12, sosyalDemokrat: 0.05, sosyalist: 0.26, liberal: 0.05 }
  },
  {
    id: 64, name: 'Uşak', regionId: 'ege', voterCount: 280000,
    demographics: { muhafazakar: 0.35, milliyetci: 0.31, sosyalDemokrat: 0.28, sosyalist: 0.02, liberal: 0.04 }
  },
  {
    id: 65, name: 'Van', regionId: 'doguanadolu', voterCount: 710000,
    demographics: { muhafazakar: 0.32, milliyetci: 0.03, sosyalDemokrat: 0.04, sosyalist: 0.58, liberal: 0.03 }
  },
  {
    id: 66, name: 'Yozgat', regionId: 'icanadolu', voterCount: 300000,
    demographics: { muhafazakar: 0.48, milliyetci: 0.43, sosyalDemokrat: 0.06, sosyalist: 0.01, liberal: 0.02 }
  },
  {
    id: 67, name: 'Zonguldak', regionId: 'karadeniz', voterCount: 460000,
    demographics: { muhafazakar: 0.36, milliyetci: 0.22, sosyalDemokrat: 0.36, sosyalist: 0.02, liberal: 0.04 }
  },
  {
    id: 68, name: 'Aksaray', regionId: 'icanadolu', voterCount: 280000,
    demographics: { muhafazakar: 0.52, milliyetci: 0.34, sosyalDemokrat: 0.09, sosyalist: 0.01, liberal: 0.04 }
  },
  {
    id: 69, name: 'Bayburt', regionId: 'karadeniz', voterCount: 60000,
    demographics: { muhafazakar: 0.50, milliyetci: 0.44, sosyalDemokrat: 0.03, sosyalist: 0.01, liberal: 0.02 }
  },
  {
    id: 70, name: 'Karaman', regionId: 'icanadolu', voterCount: 180000,
    demographics: { muhafazakar: 0.46, milliyetci: 0.32, sosyalDemokrat: 0.16, sosyalist: 0.01, liberal: 0.05 }
  },
  {
    id: 71, name: 'Kırıkkale', regionId: 'icanadolu', voterCount: 200000,
    demographics: { muhafazakar: 0.42, milliyetci: 0.36, sosyalDemokrat: 0.17, sosyalist: 0.01, liberal: 0.04 }
  },
  {
    id: 72, name: 'Batman', regionId: 'guneydogu', voterCount: 380000,
    demographics: { muhafazakar: 0.31, milliyetci: 0.02, sosyalDemokrat: 0.04, sosyalist: 0.58, liberal: 0.05 }
  },
  {
    id: 73, name: 'Şırnak', regionId: 'guneydogu', voterCount: 260000,
    demographics: { muhafazakar: 0.22, milliyetci: 0.04, sosyalDemokrat: 0.03, sosyalist: 0.68, liberal: 0.03 }
  },
  {
    id: 74, name: 'Bartın', regionId: 'karadeniz', voterCount: 150000,
    demographics: { muhafazakar: 0.38, milliyetci: 0.26, sosyalDemokrat: 0.31, sosyalist: 0.01, liberal: 0.04 }
  },
  {
    id: 75, name: 'Ardahan', regionId: 'doguanadolu', voterCount: 70000,
    demographics: { muhafazakar: 0.24, milliyetci: 0.22, sosyalDemokrat: 0.38, sosyalist: 0.12, liberal: 0.04 }
  },
  {
    id: 76, name: 'Iğdır', regionId: 'doguanadolu', voterCount: 130000,
    demographics: { muhafazakar: 0.20, milliyetci: 0.34, sosyalDemokrat: 0.08, sosyalist: 0.34, liberal: 0.04 }
  },
  {
    id: 77, name: 'Yalova', regionId: 'marmara', voterCount: 190000,
    demographics: { muhafazakar: 0.35, milliyetci: 0.18, sosyalDemokrat: 0.34, sosyalist: 0.05, liberal: 0.08 }
  },
  {
    id: 78, name: 'Karabük', regionId: 'karadeniz', voterCount: 180000,
    demographics: { muhafazakar: 0.42, milliyetci: 0.38, sosyalDemokrat: 0.15, sosyalist: 0.01, liberal: 0.04 }
  },
  {
    id: 79, name: 'Kilis', regionId: 'guneydogu', voterCount: 95000,
    demographics: { muhafazakar: 0.46, milliyetci: 0.34, sosyalDemokrat: 0.12, sosyalist: 0.03, liberal: 0.05 }
  },
  {
    id: 80, name: 'Osmaniye', regionId: 'akdeniz', voterCount: 360000,
    demographics: { muhafazakar: 0.26, milliyetci: 0.48, sosyalDemokrat: 0.18, sosyalist: 0.04, liberal: 0.04 }
  },
  {
    id: 81, name: 'Düzce', regionId: 'karadeniz', voterCount: 280000,
    demographics: { muhafazakar: 0.48, milliyetci: 0.28, sosyalDemokrat: 0.16, sosyalist: 0.02, liberal: 0.06 }
  }
];
