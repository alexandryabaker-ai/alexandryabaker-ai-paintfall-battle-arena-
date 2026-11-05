# Complete country and territory garden foundations — November 4, 2026

## Scope

All 255 catalog country/territory entries now have place-specific garden foundations: the 19 earlier designs plus 236 additions. The 50 U.S. state entries and future city gardens are separate work. Full Garden Park rides, lazy rivers and neighborhoods are not included.

Each foundation retains two benches with Story Mode seat anchors, a clear approach, a separate animated PAINTFALL paint-flower and sprinkler painting corner, and a freestanding Coming Soon sign in front of the future entrance.

## Research and design interpretation

The table below records the 236 additions and the actual botanical/cultural source used. Previous 19 references remain in their existing modules and batch notes. Designs are original compact game gardens, not reconstructions of named real gardens. Twenty-four reusable bed/path composition families, local flora, foliage structures and distinct flower-family models provide variation; species legitimately shared across borders are retained. No two of the 236 new gardens share the same layout-family / foliage / flower-form combination, independent of color and labels. These are stylized botanical studies, not photorealistic assets or scientific identification models.

- regional-flora: a source supports a regional occurrence; this is not an endemicity or whole-country habitat claim.
- cultivated: a garden collection; introduced ornamental plants are not presented as native.
- cultural-planting: a documented cultural/floral association or explicit cultivated cultural collection.
- protected-display: a contained virtual educational exhibit. Reefs, banks, glaciers and Antarctic entries do not assert that all displayed flowers grow on that exact site. Polar cushions are represented by low plants with tiny greenish floral parts, not invented showy native flowers.

Sources support plant selection and morphology; layouts are our creative interpretation. Plant labels distinguish these contexts inside the new gardens. No source images or third-party garden models were downloaded or copied.

## Rendering and gameplay boundaries

The existing Three.js instance, arena-region builder, garden placement and collision catalog are reused. Static petal geometry is instanced by material to reduce draw calls; the existing interactive/animated paint plants are unchanged. Every added layout passes a collision-aware path search for a 0.6m-radius player to both seats and the painting viewpoint. The catalog changed exactly the 236 intended entries, preserving the previous 19 and all state entries.

No character, account, networking, mobile-control, existing ride, paid-hosting or protected-branch settings are changed by this garden update. On November 4 the owner viewed the full set and approved the roomy layouts for future additions. Full amusement rides remain Coming Soon.

## Verification

- 236 composed layouts: finite transforms, bounded footprints, flowers present, two reachable seats and reachable painting corner.
- All 305 regions: scene/collision agreement and clean region disposal; 255 garden foundations and 510 benches.
- Regional movement suite: 4,880 safe spawn points, 122,000 collision steps, two-client destination authority and scene locking.
- Browser checks passed for all 255 tour scenes and all 255 destinations in actual HTTP-connected rooms. The connected-room suite completed across resumed isolated test rooms; each successful destination was recorded before resuming. Every destination had two seats, animated paint plants, the front sign, matching collision data and one arena renderer.
- Eight representative scenes rendered at phone dimensions. The gallery passed search, accent-insensitive search, empty-result and clear checks, all 255 JPEG responses, phone-width layout and navigation to the requested 3D garden.
- All 255 review pictures and eight contact sheets are saved. The searchable gallery is available at `/garden-gallery.html`; the tour also links to it.
- Physical phone performance and owner visual acceptance are not claimed by automated tests.

## Botanical source register

| Country / territory | Garden | Botanical focus | Association | Evidence |
|---|---|---|---|---|
| Afghanistan | Bukhara iris gravel garden | Iris bucharica | regional-flora | [Reference](https://powo.science.kew.org/taxon/438440-1) |
| Akrotiri | Cyprus cyclamen dry-stone walk | Cyclamen cyprium | cultivated | [Reference](https://www.cyclamen.org/plants/species/cyclamen-cyprium/) |
| Åland | Primrose island collection court | Cultivated primrose | cultivated | [Reference](https://growwild.kew.org/plants/primrose) |
| Albania | Carnation limestone garden | Dianthus caryophyllus | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A153205-1) |
| Algeria | Algerian-iris stone terraces | Iris unguicularis | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A439218-1) |
| American Samoa | Fagraea blossom shaded court | Fagraea berteroana study | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A546101-1) |
| Andorra | Grandalla mountain meadow garden | Narcissus poeticus | cultural-planting | [Reference](https://visitandorra.com/content/dam/visitandorra/ca/assets/documents/visitor-information/tourist-guides/2025/guia-and-2025-en-v2.pdf) |
| Angola | Forest impatiens shaded court | Impatiens niamniamensis | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A103811-1) |
| Anguilla | White-cedar garden gallery | Tabebuia heterophylla | regional-flora | [Reference](https://www.gov.ai/document/2024-11-20-024428_623169138.pdf) |
| Antarctica | Antarctic pearlwort study exhibit | Colobanthus quitensis study | protected-display | [Reference](https://data.aad.gov.au/aadc/biodiversity/taxon_profile.cfm?taxon_id=101710) |
| Antigua and Barb. | Coastal morning-glory islands | Ipomoea pes-caprae study | cultivated | [Reference](https://powo.science.kew.org/taxon/30040623-2) |
| Argentina | Ceibo river-edge garden | Erythrina crista-galli | regional-flora | [Reference](https://www.argentina.gob.ar/pais/ceibo) |
| Armenia | Apricot-blossom collection walk | Cultivated apricot blossom | cultural-planting | [Reference](https://ich.unesco.org/en/RL/duduk-and-its-music-00092?RL=00092) |
| Aruba | Beach morning-glory dry court | Ipomoea pes-caprae | regional-flora | [Reference](https://powo.science.kew.org/taxon/30040623-2) |
| Ashmore and Cartier Is. | Coastal-vine educational collection | Ipomoea pes-caprae study | protected-display | [Reference](https://powo.science.kew.org/taxon/30040623-2) |
| Australia | Golden-wattle dryland court | Acacia pycnantha study | cultural-planting | [Reference](https://cpbr.gov.au/emblems/aust.emblem.html) |
| Austria | Blue gentian mountain terraces | Gentiana acaulis | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A367703-1) |
| Azerbaijan | Pomegranate blossom collection court | Cultivated pomegranate blossom | cultural-planting | [Reference](https://ich.unesco.org/en-state/azerbaijan-AZ) |
| Bahamas | Yellow-elder island garden | Tecoma stans | regional-flora | [Reference](https://plantfinder.mobot.org/PlantFinderDetails.aspx?taxonid=277878) |
| Bahrain | Bougainvillea palm courtyard | Cultivated bougainvillea | cultivated | [Reference](https://www.rvoa.bh/plants-of-riffa-views-bougainvillea) |
| Baikonur | Steppe tulip collection court | Tulipa greigii study | cultivated | [Reference](https://www.botanic.cam.ac.uk/species-tulips-whats-special-about-them-and-how-to-grow-them-in-your-own-garden/) |
| Bajo Nuevo Bank | Caribbean-coast educational display | Ipomoea pes-caprae study | protected-display | [Reference](https://powo.science.kew.org/taxon/30040623-2) |
| Bangladesh | Water-lily wetland ribbons | Nymphaea nouchali | regional-flora | [Reference](https://dhcrop.gau.edu.bd/water-lily/) |
| Barbados | Pride-of-Barbados garden mosaic | Caesalpinia pulcherrima study | cultural-planting | [Reference](https://www.gov.bb/Visit-Barbados/national-flower) |
| Belarus | Blue flax garden ribbons | Linum usitatissimum | cultivated | [Reference](https://inspection.canada.ca/en/plant-varieties/plants-novel-traits/applicants/directive-94-08/biology-documents/linum-usitatissimum-flax) |
| Belgium | Poppy garden mosaic | Papaver rhoeas | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A306058-2/general-information) |
| Belize | Black-orchid shaded collection | Prosthechea cochleata | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1001247-1/general-information) |
| Benin | Robusta blossom parterre | Coffea canephora | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A747068-1) |
| Bermuda | Bermudiana coastal meadow | Sisyrinchium bermudiana | regional-flora | [Reference](https://environment.bm/bermudiana) |
| Bhutan | Blue poppy alpine court | Meconopsis gakyidiana | regional-flora | [Reference](https://nbc.gov.bt/the-national-flower-of-bhutan-found-to-be-a-new-species/) |
| Bolivia | Cantua stone-ribbon garden | Cantua buxifolia | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A688721-1) |
| Bosnia and Herz. | Bosnian lily mountain meadow | Lilium bosniacum | regional-flora | [Reference](https://liliumspeciesfoundation.org/lilies-of-the-world-lilium-species-data-base/lilium-bosniacum/) |
| Botswana | Water-lily delta collection | Nymphaea nouchali var. caerulea | regional-flora | [Reference](https://pza.sanbi.org/nymphaea-nouchali-var-caerulea) |
| Br. Indian Ocean Ter. | Guettarda atoll collection display | Guettarda speciosa study | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A752069-1) |
| Brazil | Golden-ipe blossom promenade | Handroanthus albus study | regional-flora | [Reference](https://www.gov.br/inpp/pt-br/noticias/dia-da-arvore-celebra-a-biodiversidade-e-o-papel-ecologico-dos-ipes) |
| British Virgin Is. | White-cedar blossom islands | Tabebuia heterophylla study | cultivated | [Reference](https://powo.science.kew.org/taxon/248689-2) |
| Bulgaria | Rose valley collection ribbons | Cultivated Damask rose | cultural-planting | [Reference](https://www.tourism.government.bg/bg/tourist-destinations/2800/5738) |
| Burkina Faso | Roselle garden ribbons | Cultivated roselle | cultivated | [Reference](https://powo.science.kew.org/taxon/326388-2) |
| Burundi | Forest-flower mosaic walk | Impatiens niamniamensis | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A103811-1) |
| Cabo Verde | Echium volcanic-rock display | Echium stenosiphon study | protected-display | [Reference](https://science.mnhn.fr/institution/mnhn/collection/p/item/p00571964?listIndex=412) |
| Cameroon | Parrot-impatiens forest walk | Impatiens niamniamensis | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A103811-1) |
| Canada | Trillium woodland collection | Trillium grandiflorum — Ontario collection | cultural-planting | [Reference](https://nature.ca/en/learn-explore/activities/paint-canadas-floral-emblems-with-chalk/) |
| Cayman Is. | Cockleshell orchid shaded crescent | Prosthechea cochleata | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1001247-1/general-information) |
| Central African Rep. | Robusta forest collection | Coffea canephora | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A747068-1) |
| Chad | Dry-flower steppe collection | Calotropis procera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1004515-2) |
| Chile | Copihue woodland trellis | Lapageria rosea study | cultivated | [Reference](https://metadatos.mma.gob.cl/sinia/Documento_Fichas.pdf) |
| Clipperton I. | Tropical-coast collection exhibit | Ipomoea pes-caprae study | protected-display | [Reference](https://powo.science.kew.org/taxon/30040623-2) |
| Colombia | Cattleya blossom forest court | Cattleya trianae study | cultivated | [Reference](https://www.kew.org/sites/default/files/2021-03/ColPlantA%20Booklet.pdf) |
| Comoros | Ylang-ylang blossom scent garden | Cultivated Cananga odorata | cultural-planting | [Reference](https://orbi.uliege.be/handle/2268/40845) |
| Congo | Coffee blossom river-garden | Coffea canephora | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A747068-1) |
| Cook Is. | Tiare collection garden ribbons | Cultivated Gardenia taitensis | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A751281-1) |
| Coral Sea Is. | Coral-Sea coastal collection display | Scaevola taccada study | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A384339-1) |
| Costa Rica | Guaria-morada shade gallery | Guarianthe skinneri | cultural-planting | [Reference](https://www.aos.org/explore-orchids/guarianthe-skinneri) |
| Côte d'Ivoire | African-tulip blossom courtyard | Spathodea campanulata | regional-flora | [Reference](https://keyserver.lucidcentral.org/weeds/data/03080008-0301-4c05-8c0e-0c0f040b0803/media/Html/spathodea_campanulata.htm) |
| Croatia | Dalmatian iris stone terraces | Iris pallida | regional-flora | [Reference](https://mdc.mo.gov/discover-nature/field-guide/irises) |
| Cuba | Cockleshell-orchid limestone collection | Prosthechea cochleata | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1001247-1/general-information) |
| Curaçao | Pink-trumpet dry collection | Tabebuia heterophylla study | cultivated | [Reference](https://powo.science.kew.org/taxon/248689-2) |
| Cyprus | Cyprus cyclamen olive court | Cyclamen cyprium | regional-flora | [Reference](https://www.cyclamen.org/plants/species/cyclamen-cyprium/) |
| Cyprus U.N. Buffer Zone | Protected Cyprus flora display | Cyclamen cyprium | protected-display | [Reference](https://www.cyclamen.org/plants/species/cyclamen-cyprium/) |
| Czechia | Daisy and meadow collection court | Leucanthemum vulgare | regional-flora | [Reference](https://gobotany.nativeplanttrust.org/species/leucanthemum/vulgare/) |
| Dem. Rep. Congo | Parrot-impatiens river terraces | Impatiens niamniamensis | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A103811-1) |
| Denmark | Daisy collection pocket garden | Cultivated marguerite daisy | cultivated | [Reference](https://gobotany.nativeplanttrust.org/species/leucanthemum/vulgare/) |
| Dhekelia | Cyprus cyclamen coastal court | Cyclamen cyprium | cultivated | [Reference](https://www.cyclamen.org/plants/species/cyclamen-cyprium/) |
| Djibouti | Crown-flower sheltered court | Calotropis procera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1004515-2) |
| Dominica | Carib-wood flower garden | Sabinea carinalis study | cultural-planting | [Reference](https://presidentoffice.gov.dm/national-flower) |
| Dominican Rep. | Bayahibe-rose conservation garden | Leuenbergeria quisqueyana study | protected-display | [Reference](https://powo.science.kew.org/taxon/60461849-2) |
| Ecuador | Chuquiraga highland rock garden | Chuquiraga jussieui | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A194359-1) |
| Egypt | Blue water-lily palm court | Nymphaea nouchali var. caerulea | regional-flora | [Reference](https://pza.sanbi.org/nymphaea-nouchali-var-caerulea) |
| El Salvador | Izote blossom collection court | Cultivated Yucca gigantea | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A543700-1) |
| Eq. Guinea | African-tulip island collection | Spathodea campanulata | regional-flora | [Reference](https://keyserver.lucidcentral.org/weeds/data/03080008-0301-4c05-8c0e-0c0f040b0803/media/Html/spathodea_campanulata.htm) |
| Eritrea | Crown-flower dry stone walk | Calotropis procera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1004515-2) |
| Estonia | Cornflower woodland-edge ribbons | Centaurea cyanus | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A190310-1) |
| eSwatini | Flame-creeper woodland gallery | Combretum microphyllum | regional-flora | [Reference](https://pza.sanbi.org/combretum-microphyllum) |
| Ethiopia | Arabica blossom forest garden | Coffea arabica | regional-flora | [Reference](https://pmc.ncbi.nlm.nih.gov/articles/PMC3689350/) |
| Faeroe Is. | Marsh-marigold meadow collection | Caltha palustris | regional-flora | [Reference](https://old.visitfaroeislands.com/media/341953/TG2016_UK.pdf) |
| Falkland Is. | Lady-slipper coastal meadow | Calceolaria fothergillii | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A866453-1) |
| Fiji | Tagimoucia protected flower display | Medinilla waterhousei study | protected-display | [Reference](https://specialist.fiji.travel/lessons/introduction-to-fiji-culture-traditions) |
| Finland | Lily-of-the-valley woodland court | Convallaria majalis | cultural-planting | [Reference](https://finland.fi/life-society/iconic-finnish-nature-symbols-stand-out/) |
| Fr. Polynesia | Tiare scented island court | Cultivated Gardenia taitensis | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A751281-1) |
| Fr. S. Antarctic Lands | Subantarctic cushion-flora exhibit | Azorella selago study | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A838639-1) |
| France | Lavender formal border court | Lavandula angustifolia | cultivated | [Reference](https://www.snhf.org/fiche-plante/lavande/) |
| Gabon | Parrot-flower shaded gallery | Impatiens niamniamensis | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A103811-1) |
| Gambia | Crown-flower river-edge court | Calotropis procera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1004515-2) |
| Georgia | Pontic rhododendron grove | Rhododendron ponticum | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A333114-1) |
| Germany | Cornflower meadow crosswalk | Centaurea cyanus | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A190310-1) |
| Ghana | Coffee blossom mosaic garden | Coffea canephora | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A747068-1) |
| Gibraltar | Candytuft limestone collection | Iberis gibraltarica | regional-flora | [Reference](https://www.treesandshrubsonline.org/articles/iberis/iberis-gibraltarica/) |
| Greece | Cyclamen olive collection garden | Cultivated hardy cyclamen | cultivated | [Reference](https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/CD/Cyclamen) |
| Greenland | Protected Arctic flower collection | Chamaenerion latifolium | protected-display | [Reference](https://nature.ca/aaflora/data/www/onepla.htm) |
| Grenada | Hibiscus island gallery | Cultivated Hibiscus × rosa-sinensis | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A560756-1) |
| Guam | Hibiscus palm courtyard | Cultivated Hibiscus × rosa-sinensis | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A560756-1) |
| Guatemala | Guarianthe woodland terraces | Guarianthe skinneri | regional-flora | [Reference](https://www.aos.org/explore-orchids/guarianthe-skinneri) |
| Guernsey | Guernsey-lily conservatory garden | Nerine sarniensis | cultural-planting | [Reference](https://www.plantheritage.org.uk/groups/plant-heritage-guernsey-affiliated/) |
| Guinea | Coffee-blossom woodland weave | Coffea canephora | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A747068-1) |
| Guinea-Bissau | Robusta blossom island garden | Coffea canephora | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A747068-1) |
| Guyana | Giant-waterlily collection garden | Victoria amazonica | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A605776-1) |
| Haiti | Hibiscus courtyard collection | Cultivated Hibiscus × rosa-sinensis | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A560756-1) |
| Heard I. and McDonald Is. | Cushion-plant educational display | Azorella selago study | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A838639-1) |
| Honduras | Fringed-orchid limestone garden | Rhyncholaelia digbyana | regional-flora | [Reference](https://collections.si.edu/search/results.htm?fq=common_name%3A%22Queen+of+the+Night%22&q=%22Beak%22) |
| Hungary | Iris collection courtyard | Cultivated bearded iris | cultivated | [Reference](https://mdc.mo.gov/discover-nature/field-guide/irises) |
| Iceland | Mountain-avens gravel ribbons | Dryas octopetala | regional-flora | [Reference](https://www.lystigardur.akureyri.is/is/plontur/gardaflora/dryas-octopetala) |
| India | Lotus quarter-court | Nelumbo nucifera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A605422-1) |
| Indian Ocean Ter. | Indian-Ocean half-flower collection | Scaevola taccada study | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A384339-1) |
| Iran | Rose four-quarter water court | Cultivated Damask rose | cultivated | [Reference](https://whc.unesco.org/en/list/1372) |
| Iraq | Iris geometric collection garden | Cultivated Mesopotamian iris study | cultivated | [Reference](https://www.rhs.org.uk/plants/302067/iris-mesopotamica/details) |
| Ireland | Shamrock meadow islands | Trifolium dubium | cultural-planting | [Reference](https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/ST/Tdubium) |
| Isle of Man | Primrose woodland collection | Primula vulgaris study | cultivated | [Reference](https://growwild.kew.org/plants/primrose) |
| Israel | Cyclamen stone-ribbon garden | Cyclamen persicum | regional-flora | [Reference](https://plants.ces.ncsu.edu/plants/cyclamen-persicum/) |
| Italy | Cyclamen cypress garden | Cyclamen hederifolium | regional-flora | [Reference](https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/CD/Cyclamen) |
| Jamaica | Lignum-vitae blue blossom court | Guaiacum officinale | cultural-planting | [Reference](https://opm.gov.jm/symbols/national-flower-lignum-vitae/) |
| Jersey | Orchid collection garden | Cultivated orchid collection | cultivated | [Reference](https://ericyoungorchid.org/) |
| Jordan | Black iris rock courtyard | Iris nigricans | regional-flora | [Reference](https://ww2.odu.edu/~lmusselm/plant/jordan/index.php) |
| Kazakhstan | Greig tulip steppe ribbons | Tulipa greigii | regional-flora | [Reference](https://www.botanic.cam.ac.uk/species-tulips-whats-special-about-them-and-how-to-grow-them-in-your-own-garden/) |
| Kenya | Aloe flowering rock ribbons | Aloe secundiflora | regional-flora | [Reference](https://kws.go.ke/sites/default/files/2019-11/Strategy%20of%20Conversation%20Management%20of%20Commercial%20Aloe%20Species%20in%20Kenya_0.pdf) |
| Kiribati | Scaevola atoll collection | Scaevola taccada | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A384339-1) |
| Kosovo | Mountain lily collection garden | Cultivated Balkan lily | cultivated | [Reference](https://liliumspeciesfoundation.org/lilies-of-the-world-lilium-species-data-base/lilium-bosniacum/) |
| Kuwait | Arfaj golden dry garden | Rhanterium epapposum | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A241373-1) |
| Kyrgyzstan | Mountain tulip meadow | Tulipa kaufmanniana | regional-flora | [Reference](https://www.botanic.cam.ac.uk/species-tulips-whats-special-about-them-and-how-to-grow-them-in-your-own-garden/) |
| Latvia | Oxeye-daisy meadow court | Leucanthemum vulgare | regional-flora | [Reference](https://gobotany.nativeplanttrust.org/species/leucanthemum/vulgare/) |
| Lebanon | Cyclamen cedar-edge garden | Cyclamen persicum | regional-flora | [Reference](https://plants.ces.ncsu.edu/plants/cyclamen-persicum/) |
| Lesotho | Spiral-aloe highland display | Aloe polyphylla | protected-display | [Reference](https://pza.sanbi.org/aloe-polyphylla) |
| Liberia | Robusta shaded blossom gallery | Coffea canephora | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A747068-1) |
| Libya | Libyan cyclamen limestone display | Cyclamen rohlfsianum | protected-display | [Reference](https://www.botanic.cam.ac.uk/the-garden/plant-list/cyclamen-rohlfsianum/) |
| Liechtenstein | Alpine gentian collection crescent | Gentiana acaulis study | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A367703-1) |
| Lithuania | Clover meadow collection | Trifolium dubium | regional-flora | [Reference](https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/ST/Tdubium) |
| Luxembourg | Rose gallery courtyard | Cultivated garden rose | cultivated | [Reference](https://www.rhs.org.uk/plants/roses) |
| Macedonia | Balkan carnation meadow | Dianthus caryophyllus study | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A153205-1) |
| Madagascar | Comet-orchid conservatory | Angraecum sesquipedale | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A616416-1/general-information) |
| Malawi | Flame-creeper trellis garden | Combretum microphyllum | regional-flora | [Reference](https://pza.sanbi.org/combretum-microphyllum) |
| Maldives | Pink rose island court | Cultivated pink rose | cultural-planting | [Reference](https://visitmaldives.s3.amazonaws.com/BkoM3zYd/brfikguw.pdf) |
| Mali | Roselle garden mosaic | Cultivated roselle | cultivated | [Reference](https://powo.science.kew.org/taxon/326388-2) |
| Malta | Maltese rock-centaury display | Cheirolophus crassifolius | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1005752-1) |
| Marshall Is. | Guettarda coastal scent garden | Guettarda speciosa | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A752069-1) |
| Mauritania | Crown-flower oasis collection | Calotropis procera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1004515-2) |
| Mauritius | Boucle-dOreille collection display | Trochetia boutoniana study | protected-display | [Reference](https://www.govmu.org/EN/Documents/The-National-Flower.pdf) |
| Mexico | Dahlia courtyard mosaic | Cultivated Dahlia collection | cultural-planting | [Reference](https://www.gob.mx/snics/articulos/dalia-la-flor-nacional-de-mexico?idiom=es) |
| Micronesia | Fagraea island gallery | Fagraea berteroana | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A546101-1) |
| Moldova | Rose orchard-edge courtyard | Cultivated garden rose | cultivated | [Reference](https://gbni.usm.md/?page_id=817) |
| Monaco | Rose promenade pocket garden | Cultivated garden rose | cultivated | [Reference](https://roses-roseraie-monaco.com/produit/livre-princesse-grace/) |
| Montenegro | Cyclamen shaded stone walk | Cultivated hardy cyclamen | cultivated | [Reference](https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/CD/Cyclamen) |
| Montserrat | Cockleshell orchid hillside court | Prosthechea cochleata study | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1001247-1/general-information) |
| Morocco | Damask-rose scented channels | Cultivated Damask rose | cultural-planting | [Reference](https://www.visitmorocco.com/sites/default/files/atoms/files/Ouarzazate%20ENG.pdf) |
| Mozambique | Water-lily coastal collection | Nymphaea nouchali var. caerulea | regional-flora | [Reference](https://pza.sanbi.org/nymphaea-nouchali-var-caerulea) |
| N. Cyprus | Cyclamen woodland collection | Cyclamen cyprium | regional-flora | [Reference](https://www.cyclamen.org/plants/species/cyclamen-cyprium/) |
| N. Mariana Is. | Half-flower coastal crescents | Scaevola taccada | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A384339-1) |
| Namibia | Dryland flame-lily islands | Gloriosa superba | regional-flora | [Reference](https://pza.sanbi.org/gloriosa-superba) |
| Nauru | Guettarda limestone collection | Guettarda speciosa | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A752069-1) |
| Nepal | Red rhododendron stone terraces | Rhododendron arboreum | regional-flora | [Reference](https://dpr.gov.np/wp-content/uploads/2023/08/Plants-of-Nepal-Fact-sheet_2012-1.pdf) |
| Netherlands | Tulip bulb-field ribbons | Cultivated tulip | cultural-planting | [Reference](https://keukenhof.nl/en/news/latest-flower-report/) |
| New Caledonia | Oxera climbing-flower garden | Oxera pulchella | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A863982-1) |
| New Zealand | Kowhai woodland terraces | Sophora microphylla | regional-flora | [Reference](https://www.doc.govt.nz/nature/native-plants/kowhai/) |
| Nicaragua | Frangipani scented garden | Plumeria rubra study | regional-flora | [Reference](https://www.srs.fs.usda.gov/pubs/gtr/uncaptured/gtr_so027.pdf) |
| Niger | Crown-flower sand crescents | Calotropis procera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1004515-2) |
| Nigeria | African-tulip shaded crescent | Spathodea campanulata | regional-flora | [Reference](https://keyserver.lucidcentral.org/weeds/data/03080008-0301-4c05-8c0e-0c0f040b0803/media/Html/spathodea_campanulata.htm) |
| Niue | Fagraea island stone walk | Fagraea berteroana | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A546101-1) |
| Norfolk Island | Norfolk-hibiscus collection | Lagunaria patersonia | regional-flora | [Reference](https://powo.science.kew.org/taxon/561145-1) |
| Norway | Saxifrage stone garden | Saxifraga cotyledon | regional-flora | [Reference](https://artsdatabanken.no/arter/takson/63612) |
| Oman | Jabal Akhdar rose terraces | Damask rose | cultural-planting | [Reference](https://info.visitoman.om/seasons) |
| Pakistan | Chambeli scented courtyard | Jasminum officinale | cultural-planting | [Reference](https://www.kew.org/plants/common-jasmine) |
| Palau | Ellilai woodland collection | Fagraea berteroana study | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A546101-1) |
| Palestine | Cyclamen olive courtyard | Cyclamen persicum | regional-flora | [Reference](https://plants.ces.ncsu.edu/plants/cyclamen-persicum/) |
| Panama | Dove-orchid protected collection | Peristeria elata | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A650144-1/general-information) |
| Papua New Guinea | Antler-orchid forest collection | Dendrobium lasianthera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A627813-1) |
| Paraguay | Passionflower trellis courtyard | Passiflora caerulea | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A321949-2) |
| Peru | Cantua mountain-flower terraces | Cantua buxifolia | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A688721-1) |
| Pitcairn Is. | Pitcairn-abutilon conservation display | Abutilon pitcairnense study | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A896826-1) |
| Poland | Poppy and field-edge walk | Papaver rhoeas | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A306058-2/general-information) |
| Portugal | Lavender scented stone garden | Cultivated lavender | cultivated | [Reference](https://www.snhf.org/fiche-plante/lavande/) |
| Puerto Rico | Pink-trumpet blossom court | Tabebuia heterophylla | regional-flora | [Reference](https://powo.science.kew.org/taxon/248689-2) |
| Qatar | Arfaj sheltered sand garden | Rhanterium epapposum | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A241373-1) |
| Romania | Carpathian gentian collection | Cultivated alpine gentian | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A367703-1) |
| Russia | Daisy birch-edge collection | Leucanthemum vulgare study | cultivated | [Reference](https://gobotany.nativeplanttrust.org/species/leucanthemum/vulgare/) |
| Rwanda | Parrot-impatiens hillside garden | Impatiens niamniamensis | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A103811-1) |
| S. Geo. and the Is. | Subantarctic pearlwort display | Colobanthus quitensis study | protected-display | [Reference](https://data.aad.gov.au/aadc/biodiversity/taxon_profile.cfm?taxon_id=101710) |
| S. Sudan | Robusta woodland blossom ribbons | Coffea canephora | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A747068-1) |
| Saint Helena | Redwood conservation collection | Trochetiopsis erythroxylon study | protected-display | [Reference](https://websites.rbge.org.uk/algae/publications/Mann_etal_Palermo1995.pdf) |
| Saint Lucia | Hibiscus scented garden collection | Cultivated Hibiscus × rosa-sinensis | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A560756-1) |
| Samoa | Red-ginger island garden | Cultivated Alpinia purpurata | cultivated | [Reference](https://www.nparks.gov.sg/florafaunaweb/flora/1/6/1645) |
| San Marino | Cyclamen stone court | Cultivated hardy cyclamen | cultivated | [Reference](https://herbaria.plants.ox.ac.uk/bol/plants400/Profiles/CD/Cyclamen) |
| São Tomé and Principe | Begonia island shade garden | Begonia baccata | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A104236-1) |
| Saudi Arabia | Arfaj desert bloom court | Rhanterium epapposum | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A241373-1) |
| Scarborough Reef | Reef coastal-flora educational display | Ipomoea pes-caprae study | protected-display | [Reference](https://powo.science.kew.org/taxon/30040623-2) |
| Senegal | Baobab flower-study promenade | Adansonia digitata study | cultivated | [Reference](https://pza.sanbi.org/adansonia-digitata) |
| Serbia | Ramonda rock-flower collection | Ramonda nathaliae | regional-flora | [Reference](https://pancic.bio.bg.ac.rs/Yu/Nomen/pages/129.html) |
| Serranilla Bank | Caribbean blossom educational display | Tecoma stans study | protected-display | [Reference](https://plantfinder.mobot.org/PlantFinderDetails.aspx?taxonid=277878) |
| Seychelles | Hibiscus palm collection court | Cultivated garden hibiscus | cultivated | [Reference](https://www.statehouse.gov.sc/the-garden) |
| Siachen Glacier | Protected Himalayan flower display | Himalayan blue-poppy study | protected-display | [Reference](https://nbc.gov.bt/the-national-flower-of-bhutan-found-to-be-a-new-species/) |
| Sierra Leone | African-tulip blossom collection | Spathodea campanulata | regional-flora | [Reference](https://keyserver.lucidcentral.org/weeds/data/03080008-0301-4c05-8c0e-0c0f040b0803/media/Html/spathodea_campanulata.htm) |
| Sint Maarten | Yellow-elder diagonal garden | Tecoma stans study | cultivated | [Reference](https://plantfinder.mobot.org/PlantFinderDetails.aspx?taxonid=277878) |
| Slovakia | Blue gentian stone collection | Cultivated alpine gentian | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A367703-1) |
| Slovenia | Carnation garden borders | Cultivated carnation | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A153205-1) |
| Solomon Is. | Fagraea forest-flower garden | Fagraea berteroana | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A546101-1) |
| Somalia | Crown-flower coastal ribbons | Calotropis procera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1004515-2) |
| Somaliland | Horn-of-Africa dry-flora display | Calotropis procera study | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1004515-2) |
| South Africa | King-protea fynbos collection | Protea cynaroides | regional-flora | [Reference](https://pza.sanbi.org/protea-cynaroides) |
| Spain | Carnation sun courtyard | Cultivated carnation | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A153205-1) |
| Spratly Is. | South-China-Sea flora study display | Guettarda speciosa study | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A752069-1) |
| Sri Lanka | Blue water-lily collection court | Nymphaea nouchali | cultural-planting | [Reference](https://www.cabinetoffice.gov.lk/cab/index.php?Itemid=49&dID=6113&id=16&lang=en&option=com_content&view=article) |
| St-Barthélemy | Beach morning-glory stone ribbons | Ipomoea pes-caprae study | cultivated | [Reference](https://powo.science.kew.org/taxon/30040623-2) |
| St-Martin | Pink-trumpet collection court | Tabebuia heterophylla study | cultivated | [Reference](https://powo.science.kew.org/taxon/248689-2) |
| St. Kitts and Nevis | Poinciana blossom promenade | Cultivated Delonix regia | cultural-planting | [Reference](https://www.gov.kn/skn-national-symbols/) |
| St. Pierre and Miquelon | Bunchberry woodland garden | Cornus canadensis | regional-flora | [Reference](https://science.mnhn.fr/all/list?countryCode=pm) |
| St. Vin. and Gren. | Soufriere-tree conservation collection | Spachea perforata study | protected-display | [Reference](https://tourism.gov.vc/tourism/index.php/national-flower) |
| Sudan | Cultivated roselle garden court | Roselle (Hibiscus sabdariffa) | cultivated | [Reference](https://powo.science.kew.org/taxon/326388-2) |
| Suriname | Parakeet-heliconia garden ribbons | Heliconia psittacorum | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A796972-1) |
| Sweden | Twinflower woodland garden | Linnaea borealis | regional-flora | [Reference](https://www.nrm.se/fakta-om-naturen/vaxter/landvaxter/junivaxter/linnea) |
| Switzerland | Edelweiss alpine rock garden | Leontopodium nivale group | cultural-planting | [Reference](https://www.aboutswitzerland.eda.admin.ch/en/alpine-flora-and-fauna) |
| Syria | Damascene rose garden walk | Damask rose | cultural-planting | [Reference](https://ich.unesco.org/en/RL/practices-and-craftsmanship-associated-with-the-damascene-rose-in-al-mrah-01369?RL=01369) |
| Tajikistan | Yellow iris rock terraces | Iris bucharica | regional-flora | [Reference](https://powo.science.kew.org/taxon/438440-1) |
| Tanzania | Usambara violet shade collection | Streptocarpus ionanthus | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A77117375-1) |
| Togo | African-tulip garden ribbons | Spathodea campanulata | regional-flora | [Reference](https://keyserver.lucidcentral.org/weeds/data/03080008-0301-4c05-8c0e-0c0f040b0803/media/Html/spathodea_campanulata.htm) |
| Tonga | Heilala blossom courtyard | Cultivated Garcinia sessilis | cultural-planting | [Reference](https://www.aciar.gov.au/sites/default/files/mn201_trees_for_life_-_final_artwork_-_15052018_web_upload_version.pdf) |
| Trinidad and Tobago | Chaconia rainforest garden | Warszewiczia coccinea | cultural-planting | [Reference](https://foreign.gov.tt/about/trinidad-tobago/national-symbols/national-flower/) |
| Tunisia | Winter-iris olive garden | Iris unguicularis | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A439218-1) |
| Turkey | Tulip geometric garden court | Cultivated tulip | cultivated | [Reference](https://visit.istanbul/gulhane-park) |
| Turkmenistan | Two-flowered tulip dry court | Tulipa biflora (turcomanica study) | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A543130-1) |
| Turks and Caicos Is. | Turks-cap cactus sand display | Melocactus intortus study | cultivated | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A156828-2) |
| Tuvalu | Beach morning-glory garden | Ipomoea pes-caprae | regional-flora | [Reference](https://powo.science.kew.org/taxon/30040623-2) |
| U.S. Minor Outlying Is. | Pacific coastal-flora study display | Scaevola taccada study | protected-display | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A384339-1) |
| U.S. Virgin Is. | Yellow-elder coastal ribbons | Tecoma stans study | cultivated | [Reference](https://plantfinder.mobot.org/PlantFinderDetails.aspx?taxonid=277878) |
| Uganda | Robusta blossom woodland court | Coffea canephora | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A747068-1) |
| Ukraine | Sunflower garden cross-court | Helianthus annuus | cultivated | [Reference](https://powo.science.kew.org/taxon/119003-2) |
| United Arab Emirates | Dry-flower collection mosaic | Rhanterium epapposum | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A241373-1) |
| United Kingdom | Rose cottage-garden weave | Cultivated garden rose | cultivated | [Reference](https://www.rhs.org.uk/plants/roses) |
| United States of America | Coneflower prairie garden | Echinacea purpurea | regional-flora | [Reference](https://plants.ces.ncsu.edu/plants/echinacea-purpurea/) |
| Uruguay | Ceibo riverside blossom islands | Erythrina crista-galli | regional-flora | [Reference](https://www.argentina.gob.ar/pais/ceibo) |
| USNB Guantanamo Bay | Contained Caribbean coastal collection | Ipomoea pes-caprae study | protected-display | [Reference](https://powo.science.kew.org/taxon/30040623-2) |
| Uzbekistan | Iris collection cross-court | Iris bucharica | regional-flora | [Reference](https://powo.science.kew.org/taxon/438440-1) |
| Vanuatu | Coastal half-flower ribbons | Scaevola taccada | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A384339-1) |
| Vatican | Rose walled-garden study | Cultivated garden rose | cultivated | [Reference](https://www.rhs.org.uk/plants/roses) |
| Venezuela | Flor-de-mayo orchid collection | Cattleya mossiae study | cultivated | [Reference](https://collections.si.edu/search/detail/edanmdm%3Aofeo-sg_2005-0113A) |
| W. Sahara | Desert crown-flower gravel court | Calotropis procera | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A1004515-2) |
| Wallis and Futuna Is. | Coastal half-flower promenade | Scaevola taccada | regional-flora | [Reference](https://powo.science.kew.org/taxon/urn%3Alsid%3Aipni.org%3Anames%3A384339-1) |
| Yemen | Desert-rose rosette garden | Adenium obesum group | regional-flora | [Reference](https://plantuse.plantnet.org/en/Adenium_obesum_%28PROTA%29) |
| Zambia | Blue water-lily river terraces | Nymphaea nouchali var. caerulea | regional-flora | [Reference](https://pza.sanbi.org/nymphaea-nouchali-var-caerulea) |
| Zimbabwe | Flame-lily climbing terraces | Gloriosa superba | regional-flora | [Reference](https://pza.sanbi.org/gloriosa-superba) |
