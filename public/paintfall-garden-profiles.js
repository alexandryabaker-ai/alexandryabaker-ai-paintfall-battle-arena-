// Researched botanical identities. 'cultivated' is not a claim of nativity.
// 'protected-display' represents contained educational planting, not introduction
// of exotic plants into glaciers, reserves, uninhabited reefs or Antarctic land.
import {europeGardenRows} from './paintfall-garden-profiles-europe.js';
import {africaGardenRows} from './paintfall-garden-profiles-africa.js';
import {americasGardenRows} from './paintfall-garden-profiles-americas.js';
import {caribbeanGardenRows} from './paintfall-garden-profiles-caribbean.js';
import {pacificGardenRows} from './paintfall-garden-profiles-pacific.js';
const refs={
 bangladesh:'https://dhcrop.gau.edu.bd/water-lily/',
 apricot:'https://ich.unesco.org/en/RL/duduk-and-its-music-00092?RL=00092',
 pomegranate:'https://ich.unesco.org/en-state/azerbaijan-AZ',
 persicum:'https://plants.ces.ncsu.edu/plants/cyclamen-persicum/',
 blackIris:'https://ww2.odu.edu/~lmusselm/plant/jordan/index.php',
 turkmenTulip:'https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A543130-1',
 lotus:'https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A605422-1',
 nepal:'https://dpr.gov.np/wp-content/uploads/2023/08/Plants-of-Nepal-Fact-sheet_2012-1.pdf',
 bhutan:'https://nbc.gov.bt/the-national-flower-of-bhutan-found-to-be-a-new-species/',
 jasmine:'https://www.kew.org/plants/common-jasmine',
 sriLanka:'https://www.cabinetoffice.gov.lk/cab/index.php?Itemid=49&dID=6113&id=16&lang=en&option=com_content&view=article',
 maldives:'https://visitmaldives.s3.amazonaws.com/BkoM3zYd/brfikguw.pdf',
 tulips:'https://www.botanic.cam.ac.uk/species-tulips-whats-special-about-them-and-how-to-grow-them-in-your-own-garden/',
 iris:'https://powo.science.kew.org/taxon/438440-1',
 rose:'https://ich.unesco.org/en/RL/practices-and-craftsmanship-associated-with-the-damascene-rose-in-al-mrah-01369?RL=01369',
 oman:'https://info.visitoman.om/seasons',
 persian:'https://whc.unesco.org/en/list/1372',
 arfaj:'https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A241373-1',
 rhododendron:'https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A333114-1',
 cyclamen:'https://www.cyclamen.org/plants/species/cyclamen-cyprium/',
 adenium:'https://plantuse.plantnet.org/en/Adenium_obesum_%28PROTA%29',
 bougainvillea:'https://www.rvoa.bh/plants-of-riffa-views-bougainvillea'
};
const palette={white:0xfff2df,pink:0xea85ac,red:0xcf495b,blue:0x648ed4,violet:0x9267bd,yellow:0xf2c851,orange:0xee924b,dark:0x51415d};
const plant=(species,form,color,center)=>({species,form,color:palette[color]||color,...(center?{center:palette[center]||center}:{})});
const rows=[...europeGardenRows,...africaGardenRows,...americasGardenRows,...caribbeanGardenRows,...pacificGardenRows,
 ['India','Lotus quarter-court','Nelumbo nucifera','lotus','pink','parterre','broadleaf','lotus','regional-flora'],
 ['Nepal','Red rhododendron stone terraces','Rhododendron arboreum','trumpet','red','terrace','conifer','nepal','regional-flora'],
 ['Bhutan','Blue poppy alpine court','Meconopsis gakyidiana','poppy','blue','alpine','cypress','bhutan','regional-flora'],
 ['Bangladesh','Water-lily wetland ribbons','Nymphaea nouchali','waterlily','white','boardwalk','broadleaf','bangladesh','regional-flora'],
 ['Pakistan','Chambeli scented courtyard','Jasminum officinale','five-star','white','scented','cypress','jasmine','cultural-planting'],
 ['Sri Lanka','Blue water-lily collection court','Nymphaea nouchali','waterlily','blue','islands','palm','sriLanka','cultural-planting'],
 ['Maldives','Pink rose island court','Cultivated pink rose','rose','pink','gallery','palm','maldives','cultural-planting'],
 ['Afghanistan','Bukhara iris gravel garden','Iris bucharica','iris','yellow','rockery','grass','iris','regional-flora'],
 ['Kazakhstan','Greig tulip steppe ribbons','Tulipa greigii','tulip','red','steppe','grass','tulips','regional-flora'],
 ['Kyrgyzstan','Mountain tulip meadow','Tulipa kaufmanniana','tulip','white','alpine','conifer','tulips','regional-flora'],
 ['Uzbekistan','Iris collection cross-court','Iris bucharica','iris','white','parterre','cypress','iris','regional-flora'],
 ['Tajikistan','Yellow iris rock terraces','Iris bucharica','iris','yellow','terrace','conifer','iris','regional-flora'],
 ['Turkmenistan','Two-flowered tulip dry court','Tulipa biflora (turcomanica study)','tulip','white','courtyard','grass','turkmenTulip','regional-flora'],
 ['Iran','Rose four-quarter water court','Cultivated Damask rose','rose','pink','canal','cypress','persian','cultivated'],
 ['Iraq','Iris geometric collection garden','Cultivated Mesopotamian iris study','iris','violet','mosaic','palm','https://www.rhs.org.uk/plants/302067/iris-mesopotamica/details','cultivated'],
 ['Syria','Damascene rose garden walk','Damask rose','rose','pink','hedged','olive','rose','cultural-planting'],
 ['Oman','Jabal Akhdar rose terraces','Damask rose','rose','pink','terrace','olive','oman','cultural-planting'],
 ['Kuwait','Arfaj golden dry garden','Rhanterium epapposum','daisy','yellow','dune','grass','arfaj','regional-flora'],
 ['Saudi Arabia','Arfaj desert bloom court','Rhanterium epapposum','daisy','yellow','radial','palm','arfaj','regional-flora'],
 ['Qatar','Arfaj sheltered sand garden','Rhanterium epapposum','daisy','yellow','courtyard','palm','arfaj','regional-flora'],
 ['United Arab Emirates','Dry-flower collection mosaic','Rhanterium epapposum','daisy','yellow','mosaic','palm','arfaj','regional-flora'],
 ['Bahrain','Bougainvillea palm courtyard','Cultivated bougainvillea','bougainvillea','violet','cloister','palm','bougainvillea','cultivated'],
 ['Yemen','Desert-rose rosette garden','Adenium obesum group','trumpet','pink','dune','succulent','adenium','regional-flora'],
 ['Lebanon','Cyclamen cedar-edge garden','Cyclamen persicum','cyclamen','pink','crescent','conifer','persicum','regional-flora'],
 ['Israel','Cyclamen stone-ribbon garden','Cyclamen persicum','cyclamen','white','ribbons','olive','persicum','regional-flora'],
 ['Palestine','Cyclamen olive courtyard','Cyclamen persicum','cyclamen','pink','courtyard','olive','persicum','regional-flora'],
 ['Jordan','Black iris rock courtyard','Iris nigricans','iris','dark','rockery','olive','blackIris','regional-flora'],
 ['Georgia','Pontic rhododendron grove','Rhododendron ponticum','trumpet','violet','grove','broadleaf','rhododendron','regional-flora'],
 ['Armenia','Apricot-blossom collection walk','Cultivated apricot blossom','five-star','pink','orchard','broadleaf','apricot','cultural-planting'],
 ['Azerbaijan','Pomegranate blossom collection court','Cultivated pomegranate blossom','six-star','orange','diagonal','broadleaf','pomegranate','cultural-planting'],
 ['Cyprus','Cyprus cyclamen olive court','Cyclamen cyprium','cyclamen','white','scented','olive','cyclamen','regional-flora'],
 ['N. Cyprus','Cyclamen woodland collection','Cyclamen cyprium','cyclamen','pink','grove','cypress','cyclamen','regional-flora'],
 ['Cyprus U.N. Buffer Zone','Protected Cyprus flora display','Cyclamen cyprium','cyclamen','white','conservatory','olive','cyclamen','protected-display'],
 ['Akrotiri','Cyprus cyclamen dry-stone walk','Cyclamen cyprium','cyclamen','white','serpentine','olive','cyclamen','cultivated'],
 ['Dhekelia','Cyprus cyclamen coastal court','Cyclamen cyprium','cyclamen','pink','cloister','cypress','cyclamen','cultivated'],
 ['Baikonur','Steppe tulip collection court','Tulipa greigii study','tulip','red','islands','grass','tulips','cultivated'],
 ['Siachen Glacier','Protected Himalayan flower display','Himalayan blue-poppy study','poppy','blue','conservatory','grass','bhutan','protected-display']
];
export const globalGardenProfiles=Object.fromEntries(rows.map(([country,title,species,form,color,layout,foliage,ref,mode])=>[country,{country,title,plant:plant(species,form,color),layout,foliage,reference:refs[ref]||ref,mode,key:'local-'+country.toLowerCase().replace(/[^a-z0-9]+/g,'-')} ]));
// Related flowers can share a botanical shape. Give those gardens different
// spatial compositions as well, rather than distinguishing them by color/name.
const layoutRefinements={Algeria:'alpine',Cyprus:'mosaic',Maldives:'radial',Dhekelia:'diagonal','Cyprus U.N. Buffer Zone':'parterre',Brazil:'radial',Palau:'terrace','American Samoa':'diagonal','U.S. Virgin Is.':'hedged',Bahamas:'serpentine','Pitcairn Is.':'scented','St. Vin. and Gren.':'gallery','New Caledonia':'canal',Georgia:'hedged'};
for(const [country,layout]of Object.entries(layoutRefinements))globalGardenProfiles[country].layout=layout;
