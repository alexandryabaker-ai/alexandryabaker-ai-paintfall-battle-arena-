// Recognition and wildlife proposals. Real references stay in the design view.
const stateIdentityRows=[
 ['Alabama','Black bear','river','Canyon waterfalls','Gulf shores'],
 ['Alaska','Moose','ice','Glacier valleys','Aurora-lit mountains'],
 ['Arizona','Ringtail','desert','Saguaro silhouettes','Red canyon walls'],
 ['Arkansas','White-tailed deer','cave','Hot spring terraces','Ozark rock valleys'],
 ['California','California grizzly bear','forest','Giant sequoia trunks','Granite domes'],
 ['Colorado','Rocky Mountain bighorn sheep','mountain','High alpine ridges','Tall sand dunes'],
 ['Connecticut','Sperm whale','coast','Long Island Sound inlets','Wooded river valleys'],
 ['Delaware','Gray fox','coast','Dune-backed beaches','Tidal marsh creeks'],
 ['Florida','Florida panther','wetland','Everglades-style wetlands','Mangrove island edges'],
 ['Georgia','White-tailed deer','forest','Coastal live-oak canopies','Red-earth hills'],
 ['Hawaii','Hawaiian monk seal','volcano','Volcanic craters','Waterfall cliffs'],
 ['Idaho','Appaloosa horse','mountain','Lava-field shapes','Clear mountain lakes'],
 ['Illinois','White-tailed deer','prairie','Lake Michigan shoreline','Prairie river bluffs'],
 ['Indiana','Northern cardinal','coast','Lakeside dunes','Rolling limestone hills'],
 ['Iowa','American goldfinch','prairie','Rolling prairie','Mississippi river bluffs'],
 ['Kansas','American bison','prairie','Flint Hills grass waves','Wide wind-carved horizons'],
 ['Kentucky','Eastern gray squirrel','cave','Deep limestone caverns','Bluegrass hills'],
 ['Louisiana','American black bear','wetland','Cypress-lined bayous','Wide river delta channels'],
 ['Maine','Moose','coast','Rocky ocean coves','Tall pine silhouettes'],
 ['Maryland','Chesapeake Bay retriever','coast','Chesapeake-style inlets','Salt-marsh channels'],
 ['Massachusetts','North Atlantic right whale','coast','Curving cape shores','Rocky harbor islands'],
 ['Michigan','White-tailed deer','lake','Two peninsulas','Great Lakes shoreline'],
 ['Minnesota','Common loon','lake','Many linked lakes','Northwoods canoe waterways'],
 ['Mississippi','White-tailed deer','river','Broad river bends','Cypress swamp edges'],
 ['Missouri','Missouri mule','cave','Ozark springs','Limestone cavern bluffs'],
 ['Montana','Grizzly bear','mountain','Glacier-carved mountain walls','Open prairie skies'],
 ['Nebraska','White-tailed deer','prairie','Sandhill waves','Tall sandstone bluffs'],
 ['Nevada','Desert bighorn sheep','desert','Dry basin-and-range ridges','Bright desert rock valleys'],
 ['New Hampshire','White-tailed deer','mountain','White Mountain silhouettes','Granite-lined lakes'],
 ['New Jersey','Horse','coast','Pine Barrens woodland','Barrier-island beaches'],
 ['New Mexico','American black bear','desert','White gypsum dunes','Desert mesas'],
 ['New York','American beaver','lake','Powerful waterfall channels','Adirondack-style lake forests'],
 ['North Carolina','Eastern gray squirrel','mountain','Blue Ridge mist','Outer Banks-style dunes'],
 ['North Dakota','Western meadowlark','prairie','Badland buttes','Wide prairie horizons'],
 ['Ohio','White-tailed deer','river','Sandstone gorge waterfalls','Lake Erie shore curves'],
 ['Oklahoma','American bison','prairie','Red-rock mesas','Granite hill silhouettes'],
 ['Oregon','American beaver','forest','Basalt-column waterfalls','Rocky sea stacks'],
 ['Pennsylvania','White-tailed deer','mountain','Long folded ridges','Wooded river gorges'],
 ['Rhode Island','Harbor seal','coast','Sheltered bay islands','Rocky coastal points'],
 ['South Carolina','White-tailed deer','wetland','Salt-marsh islands','Moss-draped woodland'],
 ['South Dakota','Coyote','prairie','Badland spires','Black Hills-style ridges'],
 ['Tennessee','Raccoon','mountain','Smoky mountain layers','Rocky waterfall hollows'],
 ['Texas','Nine-banded armadillo','prairie','Hill-country limestone','Desert canyon contrasts'],
 ['Utah','Rocky Mountain elk','desert','Sandstone arches','Hoodoo rock towers'],
 ['Vermont','Morgan horse','forest','Maple forest colors','Soft green mountain folds'],
 ['Virginia','Virginia big-eared bat','mountain','Blue Ridge valleys','Tidal coastal creeks'],
 ['Washington','Olympic marmot','mountain','Snow-capped volcanic peaks','Rainforest and sound shorelines'],
 ['West Virginia','American black bear','mountain','Deep river gorges','Layered wooded ridges'],
 ['Wisconsin','American badger','lake','Lake Michigan wavefront','Glacial hills and cranberry wetlands'],
 ['Wyoming','American bison','mountain','Geyser-basin shapes','Teton-style peaks']
];
const east=['White-tailed deer','Raccoon','American beaver','North American river otter','Red fox'];
const west=['Mule deer','Coyote','Cougar','American beaver','North American river otter'];
const western=new Set(['Arizona','California','Colorado','Idaho','Montana','Nevada','New Mexico','Oregon','Utah','Washington','Wyoming']);
const extra={Alaska:['Polar bear','Arctic fox','Sea otter','Bald eagle'],Hawaii:['Hawaiian goose','Hawaiian hoary bat','Green sea turtle','Hawaiian hawk'],Florida:['American alligator','West Indian manatee','Roseate spoonbill','Gopher tortoise'],Wisconsin:['White-tailed deer','Raccoon','Red fox','Coyote','Gray wolf','American badger','American beaver','North American river otter','Sandhill crane','American robin'],Connecticut:['Harbor seal','White-tailed deer','American beaver','Osprey'],Massachusetts:['Harbor seal','Humpback whale','White-tailed deer','Osprey'],Michigan:['American beaver','North American river otter','Common loon','Red fox'],Minnesota:['Gray wolf','Moose','American beaver','White-tailed deer'],Louisiana:['American alligator','Brown pelican','Raccoon','North American river otter'],'Rhode Island':['Osprey','White-tailed deer','Raccoon','North American river otter']};
const palettes=['#80def0','#dab1f5','#ffd184','#a3dfaf','#edacc8'];
window.PAINTFALL_STATE_IDENTITY=Object.fromEntries(stateIdentityRows.map(([state,emblem,style,...cues])=>{
 const roster=state==='Wisconsin'?extra.Wisconsin:[emblem,...(extra[state]||(western.has(state)?west:east)).filter(s=>s!==emblem)].slice(0,5);
 const animals=roster.map((species,i)=>({species,individuals:1,color:palettes[i%palettes.length],behavior:window.PAINTFALL_ANIMAL_BEHAVIOR(species),treatment:'Recognizable real silhouette; subtle PAINTFALL markings; no combat'}));
 const note=state==='California'?'The California grizzly is an extinct historical emblem, represented as a fictional heritage animal; not present-day wild California fauna.':state==='Missouri'?'The mule is a domestic hybrid, not a biological species. It remains the state-emblem reference; its wildlife slot uses a real species instead.':['New Jersey','Vermont','Idaho','Maryland'].includes(state)?'The state horse or dog is domestic; place it in appropriate open cared-for habitat, not label it native wildlife.':state==='Maryland'?'White-tailed deer is a regional wildlife choice here, not a verified official state mammal.':'State-symbol and regional wildlife selections are design references. Detailed habitat placement and animation remain pending.';
 if(state==='Missouri')animals[0]={...animals[0],species:'Eastern gray squirrel',behavior:window.PAINTFALL_ANIMAL_BEHAVIOR('Eastern gray squirrel')};
 return[state,{emblem,style,cues,animals,note}];
}));



