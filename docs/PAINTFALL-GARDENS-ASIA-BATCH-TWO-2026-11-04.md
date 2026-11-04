# Garden Park continuation — November 4, 2026

The October 30 batch stopped after Thailand, Myanmar, Malaysia, Indonesia and the Philippines. Public verification for that batch is saved in `art/public-gardens-southeast-asia-2026-10-30/verification.json` (`passed: true`, deployed). It brought country/territory garden identity coverage to eight.

The owner asked to resume and reiterated research into distinctive local plants, then confirmed creative trust. This continuation adds eleven original garden foundations through the existing shared arena renderer. No new rides, lazy rivers, neighborhoods or character changes are included. The Garden Park signs continue to say **Coming Soon** because full amusement parks are not being claimed complete.

## Eleven new layouts

| Country/territory entry | Identity | Botanical detail |
| --- | --- | --- |
| Singapore | Staggered orchid display islands and ginger court | Arching orchid stems with differentiated lips; red ginger bracts and tiny white tubular flowers. |
| Brunei | Level wetland boardwalk beside a dark reflecting pool | Yellow five-petaled simpor with many central stamens and broad leaves. |
| Timor-Leste | Dry-stone sandalwood collection courtyard | Small reddish four-part flowers on branching sandalwood studies. |
| Japan | Western wisteria court and iris beds | Pendant wisteria clusters; irises with three falls and three upright standards. |
| China | Open moon gate, asymmetric lotus pool and stone garden | Layered lotus flowers and floating round leaves; bamboo and weathered stones. |
| South Korea | Offset bamboo valley water garden and shrub walk | Mugunghwa flowers with pale petals, red basal eyes and a short staminal column. |
| North Korea | White magnolia woodland crescent | Cupped white magnolia tepals, burgundy stamens and green centers. |
| Mongolia | Low iris ribbons and open meadow rest | Pale Iris lactea studies with six-part iris structure, sword leaves and low grasses. |
| Taiwan | Long lotus-bank botanical collection and fern tables | Lotus collection and arching fern studies on the opposite bank. |
| Hong Kong | Bauhinia pocket-garden loop | Magenta five-petaled flower studies, projecting stamens and paired leaf lobes. |
| Macao | Offset lotus pools and level zigzag promenade | Bamboo groves, lotus flowers and winding waterside paths. |

Each has two benches, future story-seat anchors, a freestanding sign in front of the future entrance, and the existing harmless animated painting corner. The shared PAINTFALL fantasy plants retain their real botanical release inspirations: squirting cucumber fruit, popping Impatiens pods, and mountain-laurel stamens. These shared fantasy plants are not labeled native to each country.

## Research and interpretation

These are stylized, original designs informed by specific flora or local garden traditions. They are not replicas of actual properties or comprehensive representations of each country's landscapes. Cultivated collections can contain introduced ornamentals; local cultural relevance and nativity are distinct.

- Singapore: [National Orchid Garden](https://sbg.nparks.gov.sg/attractions/national-orchid-garden/) and [plant collections](https://sbg.nparks.gov.sg/attractions/the-gardens/) document orchids and ginger collections. [NParks red ginger](https://www.nparks.gov.sg/florafaunaweb/flora/1/6/1645) describes overlapping bracts and small white tubular flowers. The display islands are original, and the modeled ginger is an ornamental interpretation rather than a claim of an exact garden accession or Singapore nativity.
- Brunei: [UBD herbarium specimen S00922](https://ubdherbarium.fos.ubd.edu.bn/view_info.php?view_info=S00922) documents simpor in Tutong; [UBD research](https://ubd.edu.bn/2023/08/24/national-treasure-study-unveils-promising-therapeutic-properties-in-bunga-simpur-genome/) supports its cultural role. [Brunei Tourism](https://www.bruneitourism.com/places/tasek-merimbun-heritage-park/) informs the wetland/boardwalk setting. This is not a replica of Tasek Merimbun.
- Timor-Leste: [ILO planting report](https://www.ilo.org/resource/news/launched-new-agroforestry-skills-project-improve-youth-integration-timor) documents sandalwood planting in Dili. The dry-stone courtyard is our design. An ACIAR sandalwood forum PDF search excerpt also supported restoration context, but its full PDF timed out, so it is not represented as fully reviewed evidence.
- Japan: [GO TOKYO flowering gardens](https://www.gotokyo.org/en/story/guide/springflowers/index.html) and [wisteria account](https://www.gotokyo.org/en/spot/ev197/index.html) support hanging racemes and reflection-pool context. The design does not reproduce a shrine or religious structure.
- China: [UNESCO Suzhou gardens](https://whc.unesco.org/en/list/813/) documents water/stone/plant compositions. [Suzhou's garden of cultivation](https://visitsz.wglj.suzhou.com.cn/en/world-heritage-detail.aspx?id=5) supports lotus planting. The moon gate and pool arrangement are original.
- South Korea: [Ministry of the Interior mugunghwa account](https://www.mois.go.kr/eng/sub/a03/nationalSymbol_3/screen.do) supports the flower's cultural association. [Visit Korea Soswaewon](https://english.visitkorea.or.kr/svc/whereToGo/locIntrdn/rgnContentsView.do?vcontsId=110586) informs the bamboo/valley setting. No claim that the whole layout reproduces Soswaewon.
- North Korea: [East Asian magnolia research](https://pmc.ncbi.nlm.nih.gov/articles/PMC11548506/) documents Magnolia sieboldii subsp. sieboldii in North Korea. [International Dendrology Society morphology account](https://www.treesandshrubsonline.org/articles/magnolia/magnolia-sieboldii/) supports white flowers and red stamens. This is a botanical woodland interpretation, without political monuments or symbols.
- Mongolia: [Moscow State University specimen MW0173917](https://plant.depo.msu.ru/open/public/en/item/MW0173917) documents Iris lactea collected in Mongolia. A Greifswald flora search also found the species, but its direct page was unavailable. The design uses the accessible herbarium record as its public reference.
- Taiwan: [Taiwan Tourism Administration](https://eng.taiwan.net.tw/m1.aspx?id=r137&sNo=0002016) and [Taipei Botanical Garden map](https://tpbg.tfri.gov.tw/en/ParkMapContentc33f.html?ID=103) support the cultivated lotus collection. The fern tables and route are our own collection-garden interpretation.
- Hong Kong: [Government flower appreciation](https://www.fa.gov.hk/en/hong-kong-orchid-tree.html) and [LCSD flowering calendar](https://www.lcsd.gov.hk/en/green/blossoms.html) document Bauhinia x blakeana in local parks. A bauhinia is not an orchid despite its common name; the model uses paired leaf lobes rather than the orchid-stand geometry.
- Macao: [Tourism Office Lou Lim Ioc account](https://www.macaotourism.gov.mo/zh-hans/sight/lou-lim-ioc-park) and [Government lotus account](https://www.gcs.gov.mo/news/detail/en/G18FHEMtwM) support lotus, bamboo and winding waterside paths. The game promenade is level, with offset solid pools rather than an unimplemented raised bridge.

## Integration and validation

- `paintfall-east-asia-gardens.js` supplies the eleven distinct builders. It reuses the existing construction kit without adding a Three.js instance or another renderer.
- `paintfall-arena-gardens.js` connects them to actual arena regions. Existing eight garden layouts remain unchanged.
- `paintfall-garden-references.js` and the world tour expose reference links for each new design.
- Generated scene/collision metadata differs in exactly the eleven intended destination entries. No U.S. state or unrelated country entry changed.
- `tests/east-asia-gardens.mjs` passed: different layout and geometry signatures, finite transforms, bounded footprints/model counts, and collision-aware path searches to both seats and the paint corner for a player of 0.6-meter radius.
- Previous five-garden structural tests passed unchanged.
- All-gardens test passed: 255 gardens, 510 benches, animated paint mechanisms and exact scene/server collision agreement for all 305 destinations.
- Regional movement test passed: 4,880 safe spawns, 122,000 collision steps and destination authority.
- Browser test passed: eleven desktop and phone-sized renders, source links, and actual room travel among all eleven with matching collisions, two seats, paint plants, signs and a single renderer. No page errors. Evidence: `art/gardens-east-asia-2026-11-04/verification.json` and adjacent renders. Phone emulation does not replace physical-device performance testing.

## Coverage

Development now has **19 place-specific garden foundations**, with **236 country/territory foundations still awaiting individual identities**. This is not a claim that all Garden Parks, U.S. state gardens or city gardens are finished. The new eleven are subject to owner visual refinement; creative autonomy does not mean they have already been visually approved.

Protected `contest-safe` and `post-contest` refs retain their recorded hashes. No branch switching, merging or resetting was performed. Existing unrelated edits and character assets are preserved.
