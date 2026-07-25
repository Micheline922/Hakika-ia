import { DemoPreset, LanguageOption } from '../types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '' },
  { code: 'ln', name: 'Lingala', nativeName: 'Lingála', flag: '' },
  { code: 'lu', name: 'Chiluba', nativeName: 'Tshiluba', flag: '' },
  { code: 'kg', name: 'Kikongo', nativeName: 'Kikongo', flag: '' },
];

export const DEMO_PRESETS: DemoPreset[] = [
  {
    id: 'preset-bukavu-kadutu',
    title: 'Incendie du Marché de Kadutu & Paroisse Sainte-Marie (2019)',
    region: 'Sud-Kivu (Bukavu)',
    language: 'fr',
    summary: 'Témoignage de l\'incendie dévastateur du marché de Kadutu pendant la saison sèche de 2019.',
    narrative: `Pendant la saison sèche de juillet 2019 à Bukavu, j'étais vendeur d'huile de palme au marché de Kadutu. Vers 14 heures, une forte odeur de brûlé est venue du côté des dépôts de carburant près de la route menant à la Paroisse Sainte-Marie. Le vent sec poussait la fumée noire directement vers la cathédrale en haut de la colline. Les cloches de la paroisse ont commencé à sonner précipitamment. Tout le monde a couru vers la sortie sud près de la station d'essence pour éviter d'être bloqué dans la pente. Les flammes crépitaient si fort qu'on n'entendait plus la circulation de la grande rue.`,
    presetCorrectResponse: `J'étais assis face à l'entrée principale de la Paroisse Sainte-Marie. En regardant vers le marché en bas, la fumée venait de ma gauche (du côté du dépôt inférieur). Le vent de l'après-midi soufflait vers la colline, apportant une odeur piquante d'huile de palme brûlée mélangée à de la fumée de tôles synthétiques.`,
    presetFracturedResponse: `La fumée venait du lac Kivu à ma droite, et il pleuvait à verse pendant que nous nous réfugiions au marché couvert sous la grande averse de neige de Kadutu à 18h.`
  },
  {
    id: 'preset-goma-nyiragongo',
    title: 'Éruption du Volcan Nyiragongo & Évacuation vers Saka (2021)',
    region: 'Nord-Kivu (Goma)',
    language: 'sw',
    summary: 'Ushahidi wa mlipuko wa volkano ya Nyiragongo tarehe 22 Mei 2021 na kimbilio la Saka.',
    narrative: `Tarehe 22 Mei 2021 saa tatu za usiku hivi huko Goma, anga liligeuka nyekundu ghafla. Tulikuwa Buhene, kaskazini mwa mji. Moto wa lava ulianza kuteremka kuelekea uwanja wa ndege na barabara kuu ya Rutshuru. Sauti ya mngurumo ilikuwa kama radi isiyokoma ikitetemesha ardhi. Tulikimbia kusini kuelekea mpaka wa Rwanda (Rubavu) na wengine kuelekea Sake magharibi. Harufu ya sulfuri na vumbi la volkano vilitanda kooni. Mvua ya mawe Madogo na majivu ilianguka juu ya paa za bati usiku kucha.`,
    presetCorrectResponse: `Wakati nilisimama karibu na uwanja wa ndege tukitazama Mlima Nyiragongo kaskazini, mwanga wa moto ulikuwa mbele yetu kabisa. Upepo ulitoka mashariki ukileta harufu kali ya sulfuri na majivu kavu yaliyochoma pua. Tunaposonga mbele kuelekea Sake, mngurumo ulikuwa nyuma yetu.`,
    presetFracturedResponse: `Lava ilikuwa inatoka ziwani ikienda mlimani, na tulivua samaki katikati ya lava bila shida usiku huo kwani Maji ya Ziwa Kivu yalikuwa ya baridi ya barafu.`
  },
  {
    id: 'preset-kinshasa-ndjili',
    title: 'Débordement de la Rivière N\'djili & Quartier Debonhomme',
    region: 'Kinshasa',
    language: 'ln',
    summary: 'Likambo ya mpela mpe inondation na quartier Debonhomme sima ya mbula makasi.',
    narrative: `Na tango ya mbula makasi ya sanza ya zomi na moko na Kinshasa, ebale N'djili etondaki makasi. Po na biso batu ya quartier Debonhomme pembeni ya pont ya N'djili, mai eyaki na butu saa zomi na moko. Mai ezalaki ya zindo mpe ya poto-poto ya ngola. Sima ya kulekisa pont, soki otali ngambo ya aéroport, nionso ezalaki mai na mai. Biteni ya mandazi na biloko ya zando ezalaki kotambola na mai kende liboso. Mongo ya ba motuka na Boulevard 30 Juin ezalaki koyokana te pamba te motuka nionso etelemaki na pont.`,
    presetCorrectResponse: `Soki otelemi na ngambo ya pont de N'djili na kotala Boulevard kende na aéroport, mai ezalaki koya kobima uta na loboko ya mobali (upa ebale ezali kouta na bas-Congo/Kwilu). Solo ezalaki ya poto-poto na matiti ya kopola. Sima ya ngonga moko, motuka ya pompier na mindule ya sirene eyaki uta na aéroport.`,
    presetFracturedResponse: `Inondation wana esalemaki na sanza ya muamba (juillet) wakati elanga ezalaki makasi mpe mai ya ebale ezalaki kitoko ya mpembe bonane mpe moto moko te azindaki.`
  },
  {
    id: 'preset-kisangani-tshopo',
    title: 'Traversée de la Tshopo & Chutes de Kisangani',
    region: 'Tshopo (Kisangani)',
    language: 'fr',
    summary: 'Traversée en pirogue au-dessus des rapides de la Tshopo avant la destruction du pont.',
    narrative: `À Kisangani, près de la centrale hydroélectrique de la Tshopo, le courant du fleuve Congo est impétueux. En mai, lors de la haute eau, le bruit des chutes s'entend depuis le centre-ville. Nous traversions en pirogue à pagaie en partant du port piroguier vers la rive droite. Le piroguier devait ramer obliquement contre le courant vers l'amont pour ne pas se faire aspirer par les remous des rochers sous le pont. L'écume blanche de la rivière projetait une brume fraîche permanente qui mouillait nos habits même sans pluie.`,
    presetCorrectResponse: `En quittant le bord sud vers la rive nord, si vous regardez les chutes en amont, la brume d'eau volait vers le visage par la droite avec le vent de la gorge. Le rugissement des turbines électriques couvrait les voix des passagers.`,
    presetFracturedResponse: `Le fleuve était complètement immobile comme un miroir de verre sans aucun courant, et nous avons marché à pied sec sur le fond de la Tshopo en plein mois de mai.`
  },
  {
    id: 'preset-mbujimayi-diamond',
    title: 'Mines Artisanales de MIBA & Rivière Sankuru',
    region: 'Kasaï-Oriental (Mbuji-Mayi)',
    language: 'lu',
    summary: 'Mu mudimu wa kuela diamanda mu minere wa MIBA ne lusulu lwa Lubilanji.',
    narrative: `Mu tshidimu tshia 2017 mu Mbuji-Mayi, uvua wenza mudimu wa dibue dia diamanda mu minere wa Tubandile pabuipi ne lusulu lwa Lubilanji. Diba dia diba dikole dilolo, bisukulu biakabunda pambelu pa muaba wa dibue. Mashinyi manene mu MIBA avua adila mu tshikondo tshia mmapanda. Mu tshipapu tshia mashika mu ngondo wa muanda mutekete, lute luakajimina mu musulu, ne lutatu luakavulangana mu bimana bia bumfumu. Mashika avua makole bua muya wa tshiowa tshia mu musulu.`,
    presetCorrectResponse: `Pauvua muimane kumpala ku lusulu lwa Lubilanji mu ngondo wa muanda mutekete (juillet), lupasa ne mashika bia mu tshipapu bivuabi bifuma ku musulu lua kulume. Lubilu lwa mashi mu minere lwavua lupita pabuipi ne kaye ka tshikutu.`,
    presetFracturedResponse: `Mvula ya mvula yakatshina minere yonso mu ngondo wa muanda mutekete mu Mbuji-Mayi ne bantu bakatua mâyi mu mikuna ya thiluba ne nzeu ya mâyi.`
  },
  {
    id: 'preset-lubumbashi-copper',
    title: 'Mines de Copperbelt & Orage de Novembre à Lubumbashi',
    region: 'Haut-Katanga (Lubumbashi)',
    language: 'fr',
    summary: 'Orage tropical violent et poussière rouge de la carrière d\'Anvers à Lubumbashi.',
    narrative: `En novembre 2018 à Lubumbashi, juste au début de la saison des pluies, la poussière rouge du sol malachite s'élevait en tourbillons près du terril de la Gécamines. Vers 16 heures, le ciel est devenu violet sombre. Les éclairs d'orage zébraient la plaine industrielle. L'odeur de terre mouillée appelée petrichor mélangée à la vapeur de cuivre des usines d'affinage remplissait l'air. Les bus urbains (les Fulani) se sont tous arrêtés au croisement de l'Avenue Ruwe car le ruissellement d'eau rouge recouvrait les rails du train de marchandises.`,
    presetCorrectResponse: `Face au terril de la Gécamines avec la ville dans votre dos, l'orage venait de l'est vers Likasi. Le vent violent soulevait la poussière rouge vers les fenêtres des wagons.`,
    presetFracturedResponse: `La poussière était blanche comme de la farine de maïs et il gelait à pierre fendre avec de la glace sur le terril de la Gécamines en plein novembre.`
  },
  {
    id: 'preset-bandundu-kwilu',
    title: 'Grande Récolte de Chenilles (Mbinzo) & Traversée de la Kwilu',
    region: 'Kwilu (Bandundu)',
    language: 'kg',
    summary: 'Lusansu lwa lukanu lwa kisalu kya mbinzo muna kibwisi lwa Bandundu.',
    narrative: `Mu ngondo wa uvwa (septembre) muna kibwisi lwa Kwilu pene-pene na mbanza Bandundu, bansongolo na babutu babanza kubukula mbinzo (chenilles sauvages) muna nseke lwa kiyaka. Ntangu yina ya mvula ya ntete, mfumu mpu yina tulaka lukanu lwa zando. Ndingo ya maza ma ebale Kwilu yina matokidila muna zando ya basoko. Mazi ma mba mpe lusantu lwa fumu lwa fwa lwalutanga muna nzo. Tulwele muna buatu bwa nti kwo kuka ku simu ya nseke.`,
    presetCorrectResponse: `Muna buatu bwa nti muna Kwilu, ntangu yina yina muna luse lwa ntundulu. Maza ma ebale myatina muna lunjesu lwa diboko lwa bakala.`,
    presetFracturedResponse: `Chenilles zina zavukana muna maza ma ebale ngondongondo mpe batu badyaka zo muna maza ma glase.`
  }
];

export function getRandomPreset(excludeId?: string): DemoPreset {
  const candidates = excludeId ? DEMO_PRESETS.filter(p => p.id !== excludeId) : DEMO_PRESETS;
  const randomIndex = Math.floor(Math.random() * candidates.length);
  return candidates[randomIndex] || DEMO_PRESETS[0];
}

