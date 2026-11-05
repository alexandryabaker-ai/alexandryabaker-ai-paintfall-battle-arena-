const mammal=(kind,scientificName,variant,color,clearance=1,focusHeight=.8)=>({kind,scientificName,variant,color,clearance,focusHeight,model:'himalayan-mammal',groupTwelveAnimal:true,speed:.3,routine:'browse'});
const bird=(kind,scientificName,variant,color,clearance=.8)=>({kind,scientificName,variant,color,clearance,model:'bird',pacificBird:true,groupTwelveAnimal:true,speed:.3,routine:'forage'});
export const countryBatchTwelve={
 Nepal:{batch:12,name:'Copperhill Steps',style:'forest',terrainAmplitude:8,terrainNoise:.5,theme:'newar-town',homeName:'Copperhill Town Homes',homeStyle:'nepal-newar-inspired-town-study',landscape:'Original brick-and-timber town-home proposals with projecting window frames and tiled gables, wooded stream and rocky hill scenery; a Newar-inspired regional direction rather than all Nepalese homes',features:['Copperhill Rock Terrace'],cues:['Quiet hill stream','Woodland clearing'],wildlifeNote:'Species span different elevations and habitats; this combined review roster is not a single natural community.',roster:[
 mammal('Himalayan tahr','Hemitragus jemlahicus','tahr',0x9f8263,1.2,1),
 mammal('Red panda','Ailurus fulgens','red-panda',0xb78064,1.5,.55),
 mammal('Long-eared pika','Ochotona macrotis','pika',0x9f998b,.5,.3),
 bird('Himalayan monal','Lophophorus impejanus','monal',0x71999b,1.1),
 bird('Spiny babbler','Acanthoptila nipalensis','spiny-babbler',0x9b8f79)
 ],references:['https://ntb.gov.np/en/bandipur','https://sah.org/2026/06/22/craft-care-or-collapse-seismic-survival-in-the-kathmandu-valley/','https://dnpwc.gov.np/media/publication/LNP_Management_Plan.pdf','https://ntb.gov.np/en/national-parks-of-nepal','https://ntb.gov.np/en/things-to-do/bird-watching','https://dnpwc.gov.np/media/publication/Birds_of_Nepal_An_Official_Checklist_2022.pdf']},
 Bhutan:{batch:12,name:'Cloudbeam Valleys',style:'forest',terrainAmplitude:8,terrainNoise:.5,theme:'rammed-earth',homeName:'Cloudbeam Valley Homes',homeStyle:'bhutan-western-home-inspired-study',landscape:'Original broad-eaved homes with earth-color lower walls, timber upper galleries and open roof gaps; western Bhutan housing inspiration, wooded stream and valley-rock scenery',features:['Cloudbeam Valley Rocks'],cues:['Quiet valley stream','Woodland meadow'],wildlifeNote:'Wildlife spans different habitats and elevations. Black-necked crane is a seasonal visitor; the roster does not imply year-round co-occurrence.',roster:[
 mammal('Bhutan takin','Budorcas taxicolor whitei','takin',0xbda783,1.4,1.1),
 mammal('Blue sheep','Pseudois nayaur','blue-sheep',0x8c9ca6,1.1,.9),
 bird('Blood pheasant','Ithaginis cruentus','blood-pheasant',0x999e8e),
 {...bird('Black-necked crane','Grus nigricollis','black-necked-crane',0xd9d5c9,1.2),focusHeight:1.35},
 bird('Rufous-necked hornbill','Aceros nipalensis','rufous-necked-hornbill',0x59616a,1.2)
 ],references:['https://bhutan.travel/experiences-culture','https://bhutan.travel/experiences-landing-pages-2/experiences-wildlife-and-nature','https://www.dofps.gov.bt/wp-content/uploads/2022/04/ESMP_BC4.pdf','https://wangduephodrang.gov.bt/tourism/black-necked-crane-festival/']},
 Bangladesh:{batch:12,name:'Reedcourt Delta',style:'wetland',terrainAmplitude:3,terrainNoise:.3,theme:'delta-court',homeName:'Reedcourt Homesteads',homeStyle:'bangladesh-raised-courtyard-study',landscape:'Original dry raised-plinth homesteads with separate corrugated-roof room and kitchen studies facing an open yard; delta housing inspiration, wetland shore and reed-bank scenery',features:['Reedcourt Riverbank'],cues:['Quiet wetland shore','Woodland clearing'],wildlifeNote:'This combined wetland/forest roster is a review selection, not a claim that all five animals share one residential habitat.',roster:[
 mammal('Fishing cat','Prionailurus viverrinus','fishing-cat',0x969481,1.3,.5),
 {kind:'Spotted deer',scientificName:'Axis axis',model:'deer',variant:'spotted',color:0xae9170,clearance:1.1,speed:.35,routine:'browse'},
 mammal('Small Indian mongoose','Urva auropunctata','mongoose',0x9e9278,1.2,.35),
 bird('Pied kingfisher','Ceryle rudis','pied-kingfisher',0x596267,1),
 bird('Bronze-winged jacana','Metopidius indicus','bronze-jacana',0x7f8970,1.2)
 ],references:['https://en.banglapedia.org/index.php?title=Rural_House','https://en.banglapedia.org/index.php?title=Architecture%2C_Rural','https://bforest.gov.bd/sites/default/files/files/bforest.portal.gov.bd/notices/032677c3_e6d2_4742_ae7f_380039a61367/Sectoral%20guideline_Aquaculture%2001.07.18.pdf','https://sufal.bforest.gov.bd/redlist/wp-content/uploads/2023/03/Volume-2-Mammals-Full-Book.pdf','https://bfis.bforest.gov.bd/library/wp-content/uploads/2018/10/Resident-Forest-Bird-Survey-2014.pdf','https://objectstorage.ap-dcc-gazipur-1.oraclecloud15.com/n/axvjbnqprylg/b/V2Ministry/o/office-bforest/2024/12/ce7d7863424942b79017629de74843b1.pdf']}
};
