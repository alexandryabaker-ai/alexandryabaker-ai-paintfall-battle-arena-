// Simplified species tendencies, not identical personalities for every individual.
window.PAINTFALL_ANIMAL_BEHAVIOR=species=>{
 const rules=[
  [/badger/i,'Mostly solitary digger; often active at night','Sniffs the ground, digs, then rests near a burrow','A comically focused digger flicks pastel dust from its paws'],
  [/beaver/i,'Water-oriented builder; mainly dusk and night activity','Swims, carries branches and tends a lodge or dam','Carefully arranges colorful fallen branches; tail splashes remain water'],
  [/river otter/i,'Active swimmer with playful movement','Swims, rolls and slides along suitable stream banks','Exaggerated slides and bubbly water trails'],
  [/sea otter/i,'Marine swimmer that floats and grooms','Floats on its back and grooms its fur','Gentle rolling floats and sparkling surface ripples'],
  [/ringtail/i,'Mostly nocturnal, agile climber','Explores rocks and branches, then rests in sheltered spaces','Expressive striped-tail balance and careful climbing'],
  [/gray fox/i,'Often crepuscular or nocturnal; capable climber','Explores cover and climbs low branches','Playful balancing with subtle glowing tail markings'],
  [/fox/i,'Alert explorer with listening and pouncing movements','Sniffs, listens and makes short exploratory hops','Springy hops after harmless moving leaf or light effects'],
  [/raccoon/i,'Often nocturnal; dexterous and exploratory','Investigates objects with its forepaws and climbs','Curious paw gestures with no stealing or damaging player items'],
  [/wolf/i,'Social canine with expressive posture and calls','Travels, scent-checks and pauses to vocalize','Expressive ears and musicalized calls; no attacks'],
  [/coyote/i,'Adaptable canine; alert and vocal','Trots, listens and scent-checks','Bouncy trots and playful vocal flourishes; no attacks'],
  [/cougar|panther/i,'Usually solitary cat, moving quietly through cover','Stalks through vegetation, rests and stretches','Dramatic soft-footed movement and exaggerated sleepy stretches'],
  [/polar bear/i,'Usually solitary; adapted to ice and coastal water','Walks over ice, swims and rests','Big soft pawprints and gentle snow rolls'],
  [/bear/i,'Forager with strong scent exploration; often solitary','Sniffs, forages, rests and rubs against suitable surfaces','Expressive nose movements and harmless colorful leaf showers'],
  [/bison/i,'Grazing animal with rolling and dust-wallowing behavior','Grazes, pauses and rolls in dry soil','Large gentle dust puffs and exaggerated shaggy-fur shakes'],
  [/bighorn/i,'Sure-footed rocky-terrain grazer','Climbs ledges, grazes and surveys the slope','Confident little ledge hops and bold horn highlights'],
  [/elk/i,'Grazer and browser with seasonal vocal behavior','Browses, grazes, travels and pauses to listen','Expressive ears and seasonal call motifs'],
  [/moose/i,'Often solitary browser; comfortable around water','Browses shrubs and wades through shallow water','Tall careful steps with soft water splashes'],
  [/deer/i,'Alert browser with strong listening and escape responses','Browses, turns its ears and bounds away if startled','Springy harmless bounds; never strikes or damages players'],
  [/horse|mule/i,'Social grazing equine with expressive ears and posture','Grazes, walks, rests and investigates calmly','Color accents in mane and tail; friendly individual temperament'],
  [/retriever/i,'Domestic dog; sociable, responsive and active','Sniffs, explores, rests and swims in suitable water','Playful water retrieving with optional fictional toys'],
  [/squirrel/i,'Agile climber and food cacher','Climbs, searches for seeds and caches food','Quick tree spirals and expressive tail flicks'],
  [/marmot/i,'Burrowing grazer with seasonal resting cycles','Grazes near a burrow and gives alert calls','Comical lookout poses and soft whistle-like calls'],
  [/armadillo/i,'Ground forager and burrow digger','Sniffs soil, digs and rests in shelter','Tiny digging dances; armor pattern stays recognizable'],
  [/alligator/i,'Water-associated reptile that rests and basks','Floats, swims and basks at the water edge','Expressive slow blinks and harmless water ripples; no biting'],
  [/gopher tortoise/i,'Land tortoise that digs burrows and grazes','Walks slowly, browses plants and returns to its burrow','Determined little steps and shell accents'],
  [/sea turtle/i,'Marine swimmer with occasional beach use','Swims, grazes and rests in suitable marine habitat','Flowing flipper motion and luminous water trails'],
  [/seal/i,'Marine swimmer with resting periods ashore','Swims, rests and shifts posture on a shore','Sleepy stretches and playful-looking water turns'],
  [/manatee/i,'Slow-moving aquatic plant eater','Browses aquatic vegetation, surfaces and rests','Gentle drifting and soft bubble trails'],
  [/sperm whale/i,'Deep-diving marine mammal with social communication','Surfaces to breathe and makes long dives','Large soft water plumes and stylized click-like audio'],
  [/humpback whale/i,'Migratory marine mammal with varied surface behavior','Travels, surfaces and occasionally breaches','Spectacular water-only splashes with no collisions'],
  [/right whale/i,'Marine filter feeder often seen near the surface','Swims slowly, surfaces and feeds in suitable ocean water','Gentle sweeping surface arcs and broad water ripples'],
  [/bat/i,'Flying mammal; typically dusk or night activity','Roosts, flies and turns in short airborne arcs','Light-trail turns that preserve its bat silhouette'],
  [/loon/i,'Waterbird adapted for swimming and diving','Swims, dives and vocalizes across water','Smooth dives and distinctive stylized calls'],
  [/pelican/i,'Aquatic bird with a distinctive bill pouch','Flies, rests and uses its bill at the water surface','Expressive bill movements and water droplets'],
  [/spoonbill/i,'Wading bird with a side-to-side bill sweep','Wades and sweeps its bill through shallow water','Rhythmic water ripples following the sweep'],
  [/crane/i,'Tall wading bird with expressive display movements','Walks, probes the ground and makes display hops','Graceful exaggerated dance-like hops'],
  [/osprey/i,'Fish-associated raptor that perches and dives','Perches, circles and dives toward suitable water','Dramatic water arcs with no visible animal harm'],
  [/eagle|hawk/i,'Raptor that perches and searches from the air','Perches, soars and makes controlled descents','Broad graceful loops and bright feather-edge accents'],
  [/goose/i,'Grazing bird with walking and vocal social behavior','Walks, grazes and calls','Expressive waddles and soft patterned feather accents'],
  [/cardinal|goldfinch|meadowlark|robin/i,'Perching songbird with species-specific calls','Perches, forages and makes short flights','Melodic stylization without replacing its recognizable call pattern']
 ];
 const rule=rules.find(([pattern])=>pattern.test(species));if(!rule)throw Error('Behavior reference missing: '+species);
 return {realTraits:rule[1],routine:rule[2],paintfall:rule[3],noHarm:true,individualVariation:'Vary curiosity, pace and comfort within the species’ real behavioral range'};
};


