export interface RDCProvince {
  id: string;
  name: string;
  capital: string;
  regionCode: string;
}

export const ALL_26_PROVINCES_RDC: RDCProvince[] = [
  { id: 'kinshasa', name: 'Kinshasa', capital: 'Kinshasa', regionCode: 'KIN' },
  { id: 'sud-kivu', name: 'Sud-Kivu', capital: 'Bukavu', regionCode: 'SK' },
  { id: 'nord-kivu', name: 'Nord-Kivu', capital: 'Goma', regionCode: 'NK' },
  { id: 'haut-katanga', name: 'Haut-Katanga', capital: 'Lubumbashi', regionCode: 'HK' },
  { id: 'kasai-oriental', name: 'Kasaï-Oriental', capital: 'Mbuji-Mayi', regionCode: 'KOR' },
  { id: 'tshopo', name: 'Tshopo', capital: 'Kisangani', regionCode: 'TSH' },
  { id: 'kongo-central', name: 'Kongo-Central', capital: 'Matadi', regionCode: 'KC' },
  { id: 'ituri', name: 'Ituri', capital: 'Bunia', regionCode: 'ITU' },
  { id: 'kwilu', name: 'Kwilu', capital: 'Bandundu', regionCode: 'KW' },
  { id: 'equateur', name: 'Équateur', capital: 'Mbandaka', regionCode: 'EQ' },
  { id: 'lualaba', name: 'Lualaba', capital: 'Kolwezi', regionCode: 'LUA' },
  { id: 'kasai-central', name: 'Kasaï-Central', capital: 'Kananga', regionCode: 'KC' },
  { id: 'kasai', name: 'Kasaï', capital: 'Tshikapa', regionCode: 'KAS' },
  { id: 'maniema', name: 'Maniema', capital: 'Kindu', regionCode: 'MAN' },
  { id: 'tanganyika', name: 'Tanganyika', capital: 'Kalemie', regionCode: 'TAN' },
  { id: 'haut-lomami', name: 'Haut-Lomami', capital: 'Kamina', regionCode: 'HL' },
  { id: 'haut-uele', name: 'Haut-Uele', capital: 'Isiro', regionCode: 'HU' },
  { id: 'bas-uele', name: 'Bas-Uele', capital: 'Buta', regionCode: 'BU' },
  { id: 'kwango', name: 'Kwango', capital: 'Kenge', regionCode: 'KWA' },
  { id: 'lomami', name: 'Lomami', capital: 'Kabinda', regionCode: 'LOM' },
  { id: 'mai-ndombe', name: 'Mai-Ndombe', capital: 'Inongo', regionCode: 'MN' },
  { id: 'mongala', name: 'Mongala', capital: 'Lisala', regionCode: 'MON' },
  { id: 'nord-ubangi', name: 'Nord-Ubangi', capital: 'Gbadolite', regionCode: 'NU' },
  { id: 'sankuru', name: 'Sankuru', capital: 'Lusambo', regionCode: 'SAN' },
  { id: 'sud-ubangi', name: 'Sud-Ubangi', capital: 'Gemena', regionCode: 'SU' },
  { id: 'tshuapa', name: 'Tshuapa', capital: 'Boende', regionCode: 'TSA' }
];

export const PROVINCE_NAMES_26 = ALL_26_PROVINCES_RDC.map(
  (p) => `${p.name} (${p.capital})`
);
