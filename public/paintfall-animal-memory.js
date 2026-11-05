(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.PaintfallAnimalMemory=api;})(globalThis,()=>{
 const actions=['talk','joke','paint-hit','apologize','space','prefer-walking'];
 const isBull=kind=>/^(?:bull|banteng|gaur|water buffalo)(?:\b|$)/i.test(kind);
 // Written for PAINTFALL: no borrowed movie dialogue, lyrics or meme images.
 const jokes={
  bull:['This is some bull! I keep getting splashed because your aim is bull!','You found the bull. The target was the other part of bull’s-eye.','My horns are not a coat rack for your missed shots.','I asked for a field trip. You brought a paint trip.'],
  goat:['♪ You aimed up high, you aimed down low... You painted everything but this old goat! ♪ That is some baaaaadddd aim!','♪ You brought the paint, I brought the bleat; your target’s over there, not underneath my feet! ♪','I climbed a whole mountain and your paint still found my lunch break.','That shot had goatential. The target would like to see some.'],
  sheep:['That is some baaaaadddd aim!','I ordered a wool wash. You selected the rainbow cycle.','My flock held a meeting. We voted to move the target closer.','No need to count sheep. Count the targets you missed.'],
  zebra:['Were you aiming at me or painting the weather? Oh, we are giving the sky a second coat.','I spent all morning lining up these stripes.','You brought freestyle painting to a very organized outfit.','My stripes have formed a committee. They would like their colors back.'],
  bird:['That paintball had wings. Unfortunately, it forgot its destination.','I am tweeting directly at you. No account required.','The forecast said scattered showers. You made them neon.','I can fly, but even I cannot explain where that shot went.'],
  cat:['I had nine plans for today. Being a canvas was not one of them.','I meant purr-fect aim. You heard paint the cat.','You may admire my paws. Please stop adding polka dots.','That shot needs a cat nap and a fresh start.'],
  elephant:['I remember everything. Especially the neon elbow you just gave me.','Big ears. Tiny target request: aim somewhere else.','My trunk has packed a complaint. It is mostly confetti.'],
  turtle:['You missed a target that moves faster than me. I have questions.','Please allow three to five business strolls for my dramatic exit.','Shell we try aiming at the target next time?'],
  otter:['You otter check where that paintball is going.','I was making waves. You added the color correction.','My river review: lovely water, unexpected polka dots.'],
  monkey:['I offered a branch of friendship. You offered a paint sample.','My banana has requested a raincoat.','I swing from branches. Your aim swings between possibilities.'],
  generic:['Another coat? I am an animal, not your art homework!','Your aim has an adventurous personality. The target feels left out.','I paused for a snack and became the before picture.','You paint like the target keeps changing its address.','Plot twist: the target was standing still the whole time.','Achievement discovered: making the bushes look surprised.']
 };
 function family(kind){return isBull(kind)?'bull':/goat/i.test(kind)?'goat':/sheep/i.test(kind)?'sheep':/zebra/i.test(kind)?'zebra':/elephant/i.test(kind)?'elephant':/turtle|tortoise/i.test(kind)?'turtle':/otter/i.test(kind)?'otter':/monkey|macaque|gibbon|lemur|baboon/i.test(kind)?'monkey':/cat|lion|tiger|leopard|jaguar|cougar|lynx|caracal/i.test(kind)?'cat':/bird|eagle|hawk|owl|dove|pigeon|kingfisher|finch|parrot|macaw|crane|heron|pelican|goose|duck|hornbill|toucan|robin|woodpecker/i.test(kind)?'bird':'generic';}
 const pick=(lines,n)=>lines[Math.max(0,n-1)%lines.length];
 const key=(region,kind,individual=0)=>region+'|'+kind+'|'+individual;
 function remember(previous,action,time){
  if(!actions.includes(action))throw new Error('Unknown animal action');
  const m={meetings:0,paintHits:0,apologies:0,spaceGiven:0,prefersWalking:false,...previous};
  if(action==='talk')m.meetings++;
  if(action==='joke')m.jokes=(m.jokes||0)+1;
  if(action==='paint-hit')m.paintHits++;
  if(action==='apologize'){m.apologies++;m.apologizedThrough=m.paintHits;}
  if(action==='space')m.spaceGiven++;
  if(action==='prefer-walking')m.prefersWalking=true;
  m.lastAction=action;m.lastSeenAt=time;return m;
 }
 function dialogue(kind,action,m,name='friend'){
  if(action==='apologize')return 'Thanks for saying sorry. We can start fresh. Aim for the targets, okay?';
  if(action==='space')return 'Thanks for giving me room. See you around!';
  if(action==='prefer-walking')return 'Walking it is! I will remember: no ride invitations for you.';
  if(action==='joke')return pick(jokes[family(kind)],m.jokes||1);
  if(action==='paint-hit'){
   if(family(kind)!=='generic')return pick(jokes[family(kind)],m.paintHits);
   return m.paintHits>1?'Another coat? I am an animal, not your art homework!':'Whoa, fresh paint! Aim for the targets, please.';
  }
  if(m.paintHits>(m.apologizedThrough||0))return 'Back again, '+name+'? I remember the paint. An apology would be a nice start.';
  if(m.meetings>1||m.paintHits)return 'Welcome back, '+name+'! '+(m.prefersWalking?'Still exploring on foot? I remembered.':m.apologies?'Good to see you again. We are on friendly terms.':'I remember you. Ready for another adventure?')+' '+pick(['I saved you a spot in the shade. The sunshine gets everywhere.','Today’s big plan: explore first, snack at every opportunity.','If you discover a new path, tell me. My feet love a good plot twist.','The garden flowers are making art again. I am supervising from snack distance.'],m.meetings);
  return 'Hello, '+name+'! Nice to meet you. '+(m.prefersWalking?'We can explore on foot.':'Come say hello whenever you visit.');
 }
 return {actions,key,remember,dialogue,isBull};
});
