function foe(hp, AC, type, skills, weakness) {
  this.hp = hp;
  this.maxhp = hp;
  this.AC = AC;
  this.type = type;
  this.skills = skills;
  this.cons = [];
  this.weakness = weakness;
}
function weapon(minattack, maxattack, type, bonus, des, damtype, spgain, hitbonus, cond, conchance) {
  this.minattack = minattack;
  this.maxattack = maxattack;
  this.type = type;
  this.bonus = bonus;
  this.des = des;
  this.damtype = damtype;
  this.spgain = spgain;
  this.hitbonus = hitbonus;
  this.cond = cond;
  this.conchance = conchance;
}
function armor(AC, type, bonus, des, maxsp) {
  this.AC = AC;
  this.type = type;
  this.bonus = bonus;
  this.des = des;
  this.maxsp = maxsp;
}
function offhand(Bonus, type, skills, des) {
  this.Bonus = Bonus;
  this.type = type;
  this.skills = skills;
  this.des = des;
}
function conditon(rounds, strength, type) {
  this.rounds = rounds;
  this.strength = strength;
  this.type = type;
}
function item(pickupdes, des, type, tieditem) {
  this.pickupdes = pickupdes;
  this.des = des;
  this.type = type;
  this.tieditem = tieditem;
}
class room {
  constructor(type, items, ledU, leadD, leadL, leadF, leadB, leadR, foes, des, fgold, combatstartmess) {
    this.type = type;
    this.items = items;
    this.ledU = ledU;
    this.leadD = leadD;
    this.leadL = leadL;
    this.leadF = leadF;
    this.leadB = leadB;
    this.leadR = leadR;
    this.foes = foes;
    this.des = des;
    this.fgold = fgold;
    this.combatstartmess = combatstartmess;
  }
}
function effect(type, cond, dmg, dtype) {
  this.type = type;
  this.cond = cond;
  this.dmg = dmg;
  this.dtype = dtype;
}
class skill {
  constructor(effects, type, spcost, des, reqhuit, reqtarg, soundeffect) {
    this.effects = effects;
    this.type = type;
    this.des = des;
    this.spcost = spcost;
    this.reqhit = reqhuit;
    this.reqtarg = reqtarg;
    this.soundeffect = soundeffect;
  }
  use(target){
    if(sp>=this.spcost){
      sp-=this.spcost;
      if(this.soundeffect != null){document.getElementById(this.soundeffect).play();}
      if(this.reqhit == true){
        let attackplus = 0;
        let Rtarget = foes[target-1];
        if(find(conditons, "Focus") != 2000){
            attackplus += conditons[find(conditons, "Focus")].strength;
         }
        if(find(foes[target-1].cons, "Slowness") != 2000){
          attackplus += foes[target-1].cons[find(foes[target-1].cons, "Slowness")].strength;
        }
        let hitroll = Math.floor(Math.random() * 20) + equipment[0].hitbonus + attackplus;
        GS.innerHTML+=("<p> You got a "+hitroll+" on your attempt to hit. </p>");
        let targetdodge = 0;
        if(find(Rtarget.cons, "Dodge") != 2000){
          targetdodge += Rtarget.cons[find(Rtarget.cons, "Dodge")].strength;
        }
        if(hitroll < Rtarget.AC + targetdodge){
          GS.innerHTML+=("<p> Your skill failed to hit its "+Rtarget.type+". </p>")
          turn += 1;
          foeturn();
          return;
        }
      }
      this.effects.forEach(element => {
        switch(element.type){
          case "Addcon":
            this.Addcon(target,element.cond);
            break;
          case "dmg":
            this.dmg(target,element);
            break;
          case "manyh":
            this.manyh(target,element);
            break;
          case "PAddcon":
            this.PAddcon(element.cond);
            break;
          case "Heal":
            this.Heal(element.dmg);
            break;
        }
      });
      turn += 1;
      foeturn();
    }else{GS.innerHTML+=("<p> You have too little SP to use this skill.</p>")}
  }
  Addcon(target, cond){
    if(target == 100){
      foes.forEach(foe => {
        foeaddcondition(foe, cond);
      });
    }
    else{
        foeaddcondition(foes[target-1], cond);
    }
  }
  PAddcon(cond){
        addcondition(cond);
  }
  manyh(target, element){
    strike(target, true, element.dmg)
  }
  Heal(num){
    hp+= num;
    GS.innerHTML+=("<p> Healed for "+num+" </p>");
    if(hp > maxhp){
      hp = maxhp;
      GS.innerHTML+=("<p> Healed to Max. </p>");
    }
  }
  dmg(target, element){
    if(target == 100){
      foes.forEach(elementB => {
          damagefoe(element.dmg, elementB, element.dtype, true);
          console.log(element.dmg);
      });
    }
    else{damagefoe(element.dmg, foes[target-1], element.type, true);}
  }
}
let hp = 20;
let maxhp = 20;
let Cname = "Guy";
let Cclass = "wander";
let currentroom;
let hbonus = 1;
let combat = false;
let foes = ["no one"];
let GS;
let turn = 0;
let fallen = 0;
let conditons = [];
let hit = false;
let sp = 5;
let Gold = 0;
let v = 1;
let ballroomfought = false;
const lowdizzy = new conditon(2,3,"Dizzy");
const lowshock = new conditon(1,5,"shock");
const lowpower = new conditon(2,2,"Power");
const highdizzy = new conditon(2,8,"Dizzy");
const lowstrings = new conditon(1000,8,"Strings");
const lowfire = new conditon(4,4,"Fire");
const highfire = new conditon(4,6,"Fire");
const lowForget = new conditon(10,3,"Forget");
const lowprot = new conditon(2,2,"Protection");
const prot = new conditon(4,4,"Protection");
const lowdodge = new conditon(2,2,"Dodge");
const highdodge = new conditon(3,5,"Dodge");
const lowfocus = new conditon(3,2,"Focus");
const lowweakness = new conditon(3,2,"Weakness");
const lowbroken = new conditon(3,2,"Broken");
const lowslow = new conditon(3,2,"Slowness")
const inflictlowslow = new effect("Addcon",lowslow,null,null);
const inflictlowdiz = new effect("Addcon",lowdizzy,null,null);
const inflictHighDiz = new effect("Addcon",lowdizzy,null,null);
const inflictlowfire = new effect("Addcon",lowfire,null,null);
const inflicthighire = new effect("Addcon",highfire,null,null);
const inflictlowweakness = new effect("Addcon",lowweakness,null,null);
const inflictlowbroken = new effect("Addcon",lowbroken,null,null);
const Gainlowprot = new effect("PAddcon",lowprot,null,null);
const Gainprot = new effect("PAddcon",prot,null,null);
const GainDodge = new effect("PAddcon",lowdodge,null,null);
const GainFocus = new effect("PAddcon",lowfocus,null,null);
const GainlowDizzy = new effect("PAddcon",lowdizzy,null,null);
const LowHeal = new effect("Heal",null,4,null);
const GreaterHeal = new effect("Heal",null,8,null);
const FoulCon = new skill([inflictlowdiz, inflictlowbroken, inflictlowweakness, inflictlowslow, inflictlowfire, new effect("dmg",null,4,"Foul")],"Foul Concoction",5,"You throw a foul concoction of random liquids at your target giving them many debuffs and doing some damage. Example: use Foul Concoction SP Cost: 5",true,true);
const DazzalB = new skill([inflictlowdiz,GainDodge],"Dazzling Bomb",2,"Throw out a colorful explosive making you very hard to hit for 2 turns. Example: use Dazzling Bomb SP Cost: 2",false);
const Smite = new skill([inflictlowdiz, new effect("dmg",null,12,"Holy")],"Smite",3,"You ask the 'holy' things above to strike down your foes doing 12 Holy damage and making it harder for them to hit. Example: use Smite SP Cost: 3",true,true);
const HealingPrayer = new skill([GreaterHeal],"Healing Prayer",2,"Heal for 8 HP. Example: use Healing Prayer SP Cost: 2",false,false);
const RProtection = new skill([Gainprot],"Protection",2,"Protect your self for 4 rounds reducing damage taken by 4. Example: use Protection SP Cost: 2",false,false);
const HBlast = new skill([new effect("dmg",null,3,"Holy"),],"Holy Wave",2,"Send out a blast of Holy damage doing a small amount of damage to all foes. Example: use Holy Wave SP Cost: 2",false); 
const LavaWave = new skill([new effect("dmg",null,8,"Fire"),inflictlowslow],"Lava Wave",6,"Send out a wave of lave to trap and burn all targets. Example: use Holy Wave SP Cost: 6",false);
const FakeOut = new skill([inflictlowdiz, new effect("dmg",null,5,"Blunt")],"Fakeout",2,"You use the tatics of misdriection to fakeout your target before coming in with another strike making them dizzy for 3 rounds deals 5 damage. Example: use Fakeout SP Cost: 1",true,true);
const Enthrall = new skill([inflictHighDiz, GainlowDizzy],"Enthrall",2,"You grab and keep another creature's attention making it much harder for them to hit you by 8 but also makes it harder for you to hit any foes by 2 for 3 rounds. Example: use Enthrall SP Cost: 1",false,true);
const Bandage = new skill([LowHeal],"Bandage",2,"Heal for 4 HP. Example: use Bandage SP Cost: 2",false,false);
const PaintEnd = new skill([new effect("dmg",null,9,"ink")],"Paint End",5,"You paint the world around you into a broken and rotten one dealing 9 damage to all targets. Example: use Paint End SP Cost: 5",false,false);
const PaintCut = new skill([new effect("dmg",null,3,"ink"), inflictlowbroken],"Paint Weakspot",2,"You attempt to cut a opening into your targets flesh making it weakspot for attacks made after lasts 3 rounds. Example: use Paint Weakspot SP Cost: 2",true,true);
const CareOb = new skill([GainFocus],"Careful Observation",3,"You focus in and examine your foes making it easier to hit them gain a +2 on your to hit for 3 rounds. Example: use Careful Observation SP Cost: 3",false,false);
const Dflame = new skill([inflictlowfire],"Dark Flame",2,"You shoot out an old black flame that burns the target for 4 turns if it hits. Example: use Dark Flame SP Cost: 2",true,true);
const LargeFlame = new skill([inflictlowfire, new effect("dmg",null,12,"Fire")],"Large Flame",5,"You shoot out an old black flame that burns the target for 4 turns if it hits. Example: use Large Flame SP Cost: 5",true,true);
const PanicStrikes = new skill([new effect("manyh",null,-1,"slash"),new effect("manyh",null,-1,"slash"),new effect("manyh",null,-1,"slash")],"Panic Attacks",2,"You attack 3 times in a panicked state. Example: use Panic Attacks SP Cost: 2",false,true);
const GoDef = new skill([GainDodge],"Go Defensive",2,"You can enter a state of heightened awareness of threats adding +3 to your AC for 3 rounds. Example: use Go Defensive SP Cost: 2",false,false);
const TakeH = new skill([Gainlowprot],"Take the Hit",1,"You perpare your self for the up coming attacks, take 2 less damage from attacks for 3 rounds. Example: use Take the Hit SP Cost: 1",false,false);
const Mess = new skill([inflictlowdiz,new effect("dmg",null,1,"dark")],"Mesmerism",1,"A simple spell that transfixs all targets making it harder for them to hurt you for 2 rounds. Example: use Mesmerism SP Cost: 1",false);
const Bthirst = new skill([new effect("dmg",null,17,"slash")],"Bloodthirsty",3,"A singlar slashing strike that aims to kill your opponent deals 17 damage. Example: use Bloodthirsty SP Cost: 3",true,true);
const Robes = new armor(12, "Robes", null, "A set of old an dusty robes riddled with holes. They give an AC of 12 and a Max SP of 15",15);
const Leather = new armor(14, "Leather Armor", null, "A set of torn Leather Armor with small bits of rope holding it together. They give an AC of 14 and a Max SP of 6",6);
const FancyCloth = new armor(13, "Fancy Clothes", null, "A set of clean and royal looking clothing. They give an AC of 13 and a Max SP of 12 Grants Immunity to Weakness",12);
const JesterOutfit = new armor(10, "Jester Outfit", null, "A set of colorful Jester's Clothing. They give an AC of 10 and a Max SP of 20",20);
const Traveler = new armor(10, "Traveler Outfit", null, "A set of common travleing clothing. They give an AC of 11 and a Max SP of 17",17);
const Plate = new armor(19, "Plate Armor", null, "A strong set of metal Plate Armor. They give an AC of 19 and a Max SP of 2",2);
const BoneClub = new weapon(8,10, "Giant Bone Club", null, "A large white bone that seems to resemble the human humerus has been reinforced at the top with bits of metal turning it into a good blunt weapon. HitBonus: 4 ATK: 8-10 SP Gain: 0","Blunt",0,4);
const BaseballBat = new weapon(1,8, "Baseball Bat", null, "A old and dented baseball bat. HitBonus: 2 ATK: 2-5 SP Gain: 2","Blunt",2,2);
const CKnife = new weapon(3,4, "Combat Knife", null, "A rusted and dull Combat Knife. HitBonus: 4 ATK: 3-4 SP Gain: 1","Slash",1,4);
const Brush = new weapon(1,2, "Brush", null, "A small painting brush not made for combat. HitBonus: 6 ATK: 1-2 SP Gain: 3","ink",3,6);
const Godsword = new weapon(255,255, "God Sword", null, "A small painting brush not made for combat. HitBonus: 111 ATK: 255 SP Gain: 3","ink",111,121);
const Taser = new weapon(2,5, "Taser", null, "A small civilan issue taser that civilian issue taser crackles with electricity. HitBonus: 4 ATK: 2-5 SP Gain: 2","Shock",1,4);
const Shovel = new weapon(2,7, "Shovel", null, "A large rusty iron shovel thats had its edges shappened. HitBonus: 4 ATK: 2-7 SP Gain: 1","Slash",2,4,);
const Lamp = new weapon(2,4, "Broken Lamp", null, "A old lamp with its glass bulb broken at the top making for some sharp edges. HitBonus: 4 ATK: 2-4 SP Gain: 2","Slash",2,4);
const Mbane = new weapon(6,9, "Mage Bane", null, "A old sword made out of some short of green metal with a light blue glow. HitBonus: 8 ATK: 6-9 SP Gain: 0","SlashM",0,8);
const Gun = new weapon(3,3, "9mm Pistol", null, "A standerd issue 9mm Handgun. HitBonus: 5 ATK: 3 SP Gain: 2","Piercing",2,5);
const Longbow = new weapon(5,5, "Longbow", null, "A old wooden Longbow. HitBonus: 3 ATK: 5 SP Gain: 1","Piercing",1,3);
const BTome = new offhand(null,"Brawler Tome", [Bthirst, TakeH], "An old and dusty tome with old tips for fighting kept inside.");
const PTome = new offhand(null,"Painter's Tome", [PaintCut, PaintEnd], "An old and dusty tome with old tips for painting kept inside.");
const JTome = new offhand(null,"Jester's Tome Tome", [Enthrall, FakeOut], "An old and dusty tome with old tips for entertaining kept inside.");
const ATome = new offhand(null,"Advisor Tome", [Bandage, CareOb], "An old and dusty tome with old tips for Advising kept inside.");
const RTome = new offhand(null,"Runner's Tome", [GoDef, PanicStrikes], "An old and dusty tome with old tips for moving kept inside.");
const RoTome = new offhand(null,"Rogue's Tome", [PanicStrikes, FakeOut, DazzalB], "An old and dusty tome with old tips for sneaking and stabbing kept inside.");
const PeTome = new offhand(null,"Prayer Tome", [HealingPrayer, Smite, RProtection, HBlast], "An old and dusty prayer tome with old blessings kept inside.");
const AlTome = new offhand(null,"Alchemist's Tome", [Dflame, Enthrall, Bandage, CareOb, FoulCon], "A mess of scrapped together journal pages with recipes for potions kept inside.");
const AncTome = new offhand(null,"Ancient Tome", [Mess, Dflame], "An old and dusty tome with old spells kept inside.");
const FTome = new offhand(null,"Flame Tome", [Dflame, LargeFlame, Flame], "An old and dusty tome with ancient fire spells kept inside.");
const Godblast = new skill([inflictlowdiz ,new effect("dmg",null,1000,"Godblast")],"Godblast",1,"God blasted",false,false);
const rat = new foe(6,6,"Rat",["bite"],[]);
const Noble = new foe(22,15,"Noble",["Cup","Curse","Cut","Heal"],["ink"]);
const Jailer = new foe(22,15,"Jailer",["Trap","Rip","Abuse"],["ink"]);
const Alchemist = new foe(22,12,"Alchemist",["Stab","Burn","Splash","Heal"],["fire"]);
const Quartermaster = new foe(22,12,"Quartermaster",["Break","shield up","Burn"],[]);
const skelWar = new foe(9,12,"Skeleton Warrior",["slash","slash","shield up"],["Blunt"]);
const skelarch = new foe(6,15,"Skeleton Archer",["Rapid Fire","Weaken"],["Blunt"]);
const skelGia = new foe(35,7,"Skeleton Giant",["Break","Shatter"],["Blunt"]);
const Flamerat = new foe(2,6,"Flame Rat",["bite","fire bite"],["Godblast"]);
const Mage = new foe(45,15,"Mage",["Fireball","Curse","Blind","Magic Shield"],["SlashM"]);
// player bosses
// v
const Puppet = new foe(4,16,"Marionette",["slash","shield up"],["Slash"]);
const PuppetMaster = new foe(45,14,"Puppet Master",["Dance Little Puppet","Attach String"],["Slash"]);
// ca
const NighttimeKing = new foe(55,14,"King of the Night Time Streets",["Dark Beasts","Crushing Shadows","Blind"],["Holy"]);
// N
const JustADeer = new foe(60,12,"Just a Deer",["Strike","Eat"],[]);
// ce
const WeepingWoman = new foe(35,8,"Weeping Woman",["Strangle", "Drown"],[]);
// lya
const TheOutsider = new foe(40,13,"The Outsider",["That Beutiful Music","Multilate","Accident"],[]);
// tommy
const TheSilentwoods = new foe(55,0,"The Silent Woods",["Remove","Forget","Silince"],[]);

const RoItem = new item("One of the corpses seems to have a tight grip around a Rogue's Tome.","tome", "Rogue's Tome", RoTome);
const MBItem = new item("Sitting on a weapon rack in the back is sharp Green Sword", "a set of nice cloth", "Green Sword", Mbane);
const longbowItem = new item(" holding a Longbow,", "a set of nice cloth", "Longbow", Longbow);
const emptyItem = new item("", "", "");
const leatheritem = new item(" wearing a set of Leather Armor", "a set of nice cloth", "Leather Armor", Leather);
const BclubItem = new item("On the giant skeleton's corpse is a large Bone Club.", "a set of nice cloth", "Bone Club", BoneClub);
const PlateItem = new item("Lying in a pile in front of a turned-over armor stand is a suit of Plate Armor.", "a set of nice cloth", "Plate Armor", Plate);
const titem = new item(" Placed on the table is a Shiny Key.", "a simple Shiny Key for the ballroom", "Shiny Key");
const FtomeIte = new item(" Sticking out from one of the bookshelves is a Flame Tome.", "a flaming tome", "Flame Tome", FTome);
const ShovelItem = new item(" In the center of the garden is a small hole with a rusty iron shovel kept inside.", "a Alchemist Tome", "Shovel", Shovel);
const AltomeIte = new item(" an Alchemist Tome resting on the corner", "a Alchemist Tome", "Alchemist Tome", AlTome);
const health = new item(" Sitting on the table is a Red Potion.", "A deep red potion likely for healing.", "Red Potion", null);
const fancy = new item(" Hanging off the bed is a set of Fancy Clothes.", "a set of nice cloth", "Fancy Clothes", FancyCloth);
const Ckey = new item("There is a body of an old man lying in the center of the room with a Cell Key lodged into its eye socket.", "A small iron key covered in blood.", "Cell Key");
const scrollI = new item("On the Mage's Corpse is a Magic Scroll that glows a deep green.", "a magic scroll glowing green", "Magic Scroll");
const Pbook = new item(" Sitting upon the alter is a small Prayer Tome.", "a small book with a rabbit on its cover its titled 'A rabbits life' by Vasco Simons", "Prayer Tome",PeTome);
const Rbook = new item(" On the ground is a small Rabbit Book with a bright blue cover.", "a small book with a rabbit on its cover its titled 'A rabbits life' by Vasco Simons", "Rabbit Book");
let rooms =[
  new room(
    "Test Room",
    [titem],"up","down","left","forward","Back","right",null,
    ["You find a simple room with a bookshelf in the conner ",0,". There is a stair case leading up."]
  ),
  new room("tested Room 2",
    [titem],"Test Room",null,null,null,null,null,[rat, Flamerat],
    ["You find a simple room with a bookshelf in the conner ",0,". There is a sadasdsadsstair case leading fesfes."],
    5, "Your jumped by a bunch of rats one of which happens to be on fire."),
  new room("Castle Gate",
    [],null,null,null,"Courtyard",null,null,null,
    ["You find yourself standing outside the walls to the Fort of Metus with vines growing on the sides of the wall and many towers looming overhead. <p> Forwards in front of you is the open Portcullis that leads into the fort's courtyard. Behind you is only the dense Vetus forest with a deep fog blanketed over it.</p>"],),
  new room("Courtyard",
    [],"Outer Tower",null,"Guard Barracks","Front Door","Castle Gate","Garden",null,
    ["A well-kept courtyard with many small flowers growing all around, with the bodies of its once attendants now lying on the ground, nourishing the dirt. You can hear the sounds of birds crying overhead. Forward is the Front Door leading into the main fort building. <p>Off to the right lies an entrance to a beautiful garden, while to the left, you can see a small Guard Barracks with its door left wide open. You can see a set of stairs that would lead up to one of the many towers of the wall.</p>"],),
   new room("Garden",
    [ShovelItem],"Outer Tower",null,"Guard Barracks","Front Door","Castle Gate","Garden",null,
    ["A small yet strangely peaceful garden with well-kept roses and flowers spread throughout. There are small deer standing watch as you enter, keeping their distance from you yet always facing you. ",0,"<p>Back leads to the Courtyard.</p>"],),
    
    //Front Path Rooms
    new room("Front Door",
    [],null,null,null,"Entrance Room","Courtyard",null,[skelWar, skelWar],
    ["A small foyer before one would enter the entrance room, decorated with small paintings depicting the many members of the Metus noble family in various states of pain.<p> Forward through a set of old mahogany wooden doors lies the entrance room, while back leads to the castle's peaceful courtyard.</p>"],
      5, "As you enter the Front foyer two skeleton warriors clad in crumbling armor and wielding broken, rusted swords swing out at you."),  
    new room("Entrance Room",
    [],"Upstairs",null,"Library",null,"Front Door","Dinning Room",null,
    ["A large and fancy entrance room with old, expensive furniture lining the walls. A large golden chandelier overhead keeps the room alit. At the end of the room, there is a fancy red velvet-lined staircase leading up to the upper half of the room. To the left, there is a door with a small inscription carved into it 'Spiyhyf vm Qbynlu Slpauly'. To the right sight a strong scent of good food billows out of an open door."],),
    new room("Upstairs",
    [],null,"Entrance Room","Library 2nd","Grand Ballroom",null,"Grand Bedroom",null,
    ["Overlooking the entrance room below the upper part of this room is decorated with many beautiful works of art, such as 'The Dead Mother', 'Man Proposes, God Disposes', and 'Aus den Augen, aus dem Sinn'. Strangely, as you move about the area, the eyes on the paintings seem to follow your movements. <p> Forward lies the entrance to the Grand Ballroom of Metus, which is said to hold the largest of gatherings in all the lands. To the right is the bedroom of Lord Theologos Metus. To the left lies the upper part of the library. Down below is the entrance room.</p>"],),
    new room("Grand Ballroom",
    [],null,null,null,null,null,"Upstairs",null,
    ["You have reached the end of the demo we at the Sumu game studio thank you for playing you may return the fort with go back"],10,"A fight breaks out."),
  // Upstairs left
    new room("Library 2nd",
    [FtomeIte],"Mage Tower","Library",null,null,null,"Upstairs",null,
    ["The upper floor of the library is surrounded by towering bookshelves spiraling up above each book seems to give a strange feeling of pain when your hands are brought close to them.",0,"<p>There is a spiral staircase leading up where you can hear ominous chanting resonating down the stairs. A staircase leading down the lower part of the library lies only a few feet away, while to the right, a door leading to the upper part of the Entrance room lies. </p>"],),
     new room("Mage Tower",
    [scrollI],null,"Library 2nd",null,null,null,null,[Mage],
    ["A strange room covered in ancient alchemical carvings with a large crystal window overlooking the fort walls, looking through it you can see hundreds of corpses piling up against the wall. The walls are lined with quartz crystals, each glowing a strange yet vibrant color.",0,"There is a staircase leading down to the library."],
  5,"A man dressed in old black robes turns to curse you as you enter the room."),
  // Upstairs Right
   new room("Grand Bedroom",
    [fancy],null,null,null,"Study","Upstairs",null,null,
    ["A fancy bedroom with a large bed in its center, the walls are lined with old trophies of monsters slain, ranging from A dragon's head to that of a lowly human. ",0," Forward at the end of the room is a door labeled Study, while back leads into the 2nd floor of the entrance room."],),
    new room("Study",
    [titem],null,null,null,null,"Grand Bedroom",null,[Noble],
    ["A small personal study with piles of old books focused on old wars. There is a balcony overlooking a small field within the fort's walls. Looking down, you can see six little rabbits hopping in a circle, while 4 are lying down in the dirt.",0,"<p> Back leads to the bedroom.</p>"],
      5, "As you enter the Study a large man that had been sitting at a small table rises and draws his blade screeming 'I'll add your head to my wall little rabbit!'."),  
    // inside Right
   new room("Dinning Room",
    [health],null,null,null,"Kitchen","Entrance Room",null,null,
    ["A large dining room with a table that spans its whole length, covered in old and rotten food, and some of the meat still seems to be squirming.",0,"<p> Forward at the end of the room is a small door leading to the kitchen, and back leads to the Entrance room.</p>"],),
   new room("Kitchen",
    [],null,"Alchemist's Room",null,null,"Dinning Room",null,[rat,rat,rat,rat,Flamerat],
    ["Full of strange smells as a small amount of strange pink meat is being cooked on one of the room's many stoves. Hanging from the roof is a large number of large spider corpses, each of them covered in a large amount of blood.  A set of stairs leads down to a solid iron door, while back leads to the Dining room."],
    5, "Your jumped by a bunch of rats one of which happens to be on fire."),
    new room("Alchemist's Room",
    [AltomeIte],"Kitchen",null,null,null,null,null,[Alchemist],
    ["A small experimentation room filled with small cages filled with dead and deformed rabbits. In the center of the room is a small table with a large amount of strange ingredients and beakers lying on top",0,". Up leads to the Kitchen."],
    5, "A disfigured human? man stands over a headless rabbit corpse with his limbs breaking and twisting with each move as he stands to face you, slowly laughing."),
    // inside Left
     new room("Library",
    [Rbook],"Library 2nd",null,null,"Church","Entrance Room",null,[skelWar],
    ["A sprawling room with bookshelves that stretch from the bottom to the top, each with titles unintelligible to the human mind yet clearly of some value. There are rows of study tables with half-written papers laid across them, with what appear to be the corpses of scholars face down upon each table. When you first entered the room, each of the scholars' heads snapped to your position before slowly turning back.",0,"<p>  A set of stairs leads up to the second floor of the library, while forward leads to a large stone door with the words 'Il Hmyhpk' carved into it. Back leads to the main entrance room.</p>"],
      5, "A Skeleton Warrior leaps at you as you enter the library."),
    new room("Hidden Study",
    [],null,null,null,"Library",null,null,null,
    ["Your in the hidden study room you discovered behind one of the old library book cases. You've been hiding in here while trying to understand the things that lie within the fort. Forward will lead you to the library"],),
    new room("Church",
    [Pbook],null,null,null,null,"Library",null,null,
    ["A large stone-carved room with holy symbols from each religion carved onto the walls. Four Stainglass windows are embedded into the walls with vibrant light streaming through them. Touching the beams of light brings an intense burning sensation to the skin. There is an altar placed at the end of the room with a symbol of two hands placed together on it. ",0,"The door at the back will take you to the library."],),
    //outside left
    new room("Guard Barracks",
    [health,health],null,"Dungeon",null,"Weapon Room","Courtyard","Stables",null,
    ["A small blood-coated room with rows of beds lining the room. Broken and discarded sets of armor and weapons fill the room, each coated in human blood. There is a small table on the left side.",0," ",1,"<p>To the right is a small door leading to the stables. Forward leads to a broken wooden door, where you can hear the clashing of metal. Back leads to the Courtyard. A small stair case leads down into darkness.</p>"],),
    new room("Stables",
    [],null,null,null,null,"Guard Barracks",null,null,
    ["Large stables with piles and piles of hay placed end-to-end take up most of the room, with the rest being taken up by four stalls. Four iron status of horses are placed in each of the 4 stalls. Back leads to the Guard Barracks."],),
    new room("Weapon Room",
    [MBItem],null,null,null,"Forge","Guard Barracks",null,[Quartermaster],
    ["A large weapon room filled with empty weapon racks and barren armor stands. Lying in a circle on the ground are what appear to be half-decayed human guard bodies. Small worms can be seen crawling through their intestines on open wounds.",0,"<p> Back is a door leading to the Guard Barracks, and Forward leads to the forge.</p>"],
      5, "A man covered in iron armor that's barely being held together by small strands of skin stands at the center of the room. He slowly raises his hammer."),
    new room("Forge",
    [PlateItem],null,null,null,null,"Weapon Room",null,null,
    [" A large room that is blazing hot as you enter, with a roaring forge in its center, a half-finished sword is sitting on the anvil in its center. There are many small iron ingots and metal molds scattered around the room, making it hard to walk around.",0,"<p> Back leads to the Weapon Room. </p>"],),

    //outside right
    new room("Outer Tower",
    [longbowItem, leatheritem],null,"Courtyard",null,null,null,"Outer Wall",null,
    ["A large stone brick-lined tower that seems to go up into infinity with no end in sight. There are small slits in the side of the tower that look over the forest and the lands beyond, allowing you to see the ever-encroaching fog that befells these lands. Within the fog, you can make out the shapes of the ever-changing beast and the souls of all the people lost to its wrath. In the room's corner, there is a rotting corpse",0,1,". <p>Going down the spiral staircase will take you to the courtyard. On the right side of the tower is a doorway leading to the wall.</p>"],),
  new room("Outer Wall",
    [],null,null,null,null,"Outer Tower",null,[skelarch, skelarch],
    ["The stone wall has long been overgrown with vines and bushes, coating every bit of the wall. With each step, you can feel the vines attempt to wrap around your legs, trying to pull you over the edge. Looking out from the fort's wall, you can see its many winding towers and beautiful glass windows. Far above the fort, a humanoid figure with a hundred eyes and a thousand wings keeps guard. Looking out from the wall lets you see the forest looking back at you. At the end of the wall is a tower that's been closed off and has green magical runes carved into its face that seem to be slumbering. Back leads to the outer tower."],
      5, "The once ever watchful guards of the wall raise their bows and swords to face you."),
    new room("Painter's Tower",
    [],null,"Outer Tower",null,null,null,"Outer Wall",null,
    ["You find yourself in your studio situated in the tower on top of one of the outer towers of Fort Metus. Full of half-painted pictures and empty canvases. There is a trap door that will lead you to the tower below."],),
 
    // lower level
    new room("Dungeon",
    [RoItem],"Guard Barracks","Catacombs",null,"Dungeon 2nd",null,null,null,
    ["A dark and decrepit stone room with a singular torch keeping the room lit. Chains dangle from the roof in a tangled mess with what appear to be corpses suspended in the center of the mess. ",0," Forward leads around a corner in the dungeon hallway. A staircase leading up will take you to the Guard Barracks."],),
    new room("Dungeon 2nd",
    [],null,null,null,"Jailer's Office","Dungeon",null,null,
    ["A long cobblestone hallway with iron cells lining the walls, most only filled with corpses and bones of those who were forgotten and left to their fate. As you walk down the hallway, you hear a voice coming from Cell B 5. A small, balled-up little humanoid figure in the corner of the cell says to you.<p>“Please free me, little rabbit. They have kept me here for so long, and it has gotten so cold because they have taken away my smile. You want to find someone who is lost, right, little rabbit? I can help, just get the key from the Jailer and let me out.” To open the cell, type use Cell Key.</p><p>Forward leads to an old, sturdy iron door with Jailer's Office inscribed into its face. Back leads to the Dungeon main hallway.</p>"],),
   new room("Jailer's Office",
    [Ckey],null,null,null,null,"Dungeon 2nd",null,[Jailer],
    ["A large room with many rusted torture tools hanging from the walls, all coated in bits of blood and viscera. There is a large amount of scattered papers on the floor detailing the prisoners of the dungeon. There are a few names you can make out on the sheets “Mr. Ztpsl”, “Nobody”, and “Isaac Hartwell”. ",0," Back leads to the Dungeon side hallway."],
    5, " A large man covered in iron chains and holding metal pliers strikes out at you."
  ),
    new room("Catacombs",
    [BclubItem],null,null,null,null,"Dungeon 2nd",null,[skelGia, skelWar, skelWar],
    ["A dead, silent chamber with coffins lining the walls, each filled with piles of bones of the souls that have lost their lives in this place. With each step you take, you can feel thousands of years of pain enter your mind, nearly knocking you to the ground. One of the coffins has the name “Airi Peura”.",0," There is a staircase leading to a lit-up room going up."],),
    
  ];
  

let skills = [Godblast];
let equipment = [BaseballBat, Robes, AncTome, ""];
let inv = [AncTome,CKnife];
function setclass(usern){
    switch(usern){
    case "AdminGuy2":
      Cclass = "Mr.Cool";
      Cname = "God";
      hp = 505050505;
      maxhp = 505050505;
      attack = 5;
      inv = [Robes, Godsword, AncTome];
      equipment = [Godsword, Robes, AncTome];
      enterRoom("Hidden Study");
      break;
    case "VizlzzpclVjjbsapza": // Calx
      Cclass = "Cultist";
      Cname = "Calx";
      hp = 35;
      maxhp = 35;
      inv = [Robes, BaseballBat, AncTome];
      equipment = [BaseballBat, Robes, AncTome];
      enterRoom("Hidden Study");
      break;
    case "MlyvjpvbzWyvaljavy": // Nick
      Cclass = "Brawler";
      Cname = "Nicholas";
      hp = 40;
      maxhp = 40;
      inv = [Leather, CKnife, BTome];
      equipment = [CKnife, Leather, BTome];
      enterRoom("Stables");
      break;
    case "UlycvbzPuclzapnhavy": // Tommy
      Cclass = "Runner";
      Cname = "Thomas";
      hp = 30;
      maxhp = 30;
      inv = [Traveler, Gun, RTome];
      equipment = [Gun, Traveler, RTome];
      enterRoom("Castle Gate");
      break;
    case "Uv-UvuzluzlPuclzapnhavy": // Vinny 
      Cclass = "Advisor";
      Cname = "Vinny";
      hp = 35;
      maxhp = 35;
      inv = [Traveler, Gun, ATome];
      equipment = [Gun, Traveler, ATome];
      enterRoom("Castle Gate");
      document.getElementById("gamestart").play();
      document.getElementById("gamestart").volume = v;
      break;
    case "SprlhislLsvjbapvupza": // Lyra
      Cclass = "Jester";
      Cname = "Lyra";
      hp = 30;
      maxhp = 30;
      inv = [JesterOutfit, Lamp, JTome];
      equipment = [Lamp, JesterOutfit, JTome];
      enterRoom("Castle Gate");
      break;
    case "YhaolyIlYlhkpun": // Cecil
      Cclass = "Painter";
      Cname = "Cecil";
      hp = 30;
      maxhp = 30;
      inv = [Robes, Brush, PTome];
      equipment = [Brush, Robes, JTome];
      enterRoom("Painter's Tower");
      break;
    case "Zolpzsvza": // amanda
      Cclass = "????";
      Cname = "Amanda";
      hp = 45;
      maxhp = 45;
      inv = [Robes, BaseballBat, AncTome];
      equipment = [BaseballBat, Robes, AncTome];
      skills = [];
      break;
    
  }
}

function enter(event){
  GS = document.getElementById("GameScreen");
  if(event.key=="Enter"){
    let inputfield = document.getElementById("inputfield");
    let inp = inputfield.value;
    inputfield.value = "";
    GS.innerHTML+=("<p style='color: darkgreen;'>"+inp+"</p>");
    //document.body.insertBefore(newP, document.getElementById("bottomGame"));
    let inputarray = inp.split(" ");
    switch(inputarray[0]){
      case "help":
        help(inp);
        break;
        case "inv":
        info(inputarray);
        break;
        case "equip":
        equip(inputarray);
        break;
        case "amgod":
        setclass("AdminGuy2");
        break;
        case "fight":
          startcombat([rat, Flamerat]);
          break;
        case "strike":
          strike(inputarray[1],false,0);
          break;
        case "wait":
          turn+=1;
          foeturn();
          break;
        case "get":
          get(inputarray);
          break;
        case "skill":
          skillinfo(inputarray);
          break;
        case "start":
          setclass(inputarray[1]);
          document.getElementById("gamestart").play();
          document.getElementById("gamestart").volume = v;
          break;
        case "roll":
           if(find(conditons,"Fire") != 2000){
            GS.innerHTML+=("<p> You've no longer on fire. </p>");
            find(conditons,"Fire")
            conditons[find(conditons,"Fire")].type = " ";
            }
          break;
        case "Remember":
           if(find(conditons,"Forget") != 2000){
            GS.innerHTML+=("<p> You've try to Remeber. </p>");
            find(conditons,"Forget")
            conditons[find(conditons,"Forget")].type = "";
            }
          break;
        case "go":
          switch(inputarray[1]){
            case "up":
              enterRoom(currentroom.ledU);
              break;
            case "down":
              enterRoom(currentroom.leadD);
              break;
            case "right":
              enterRoom(currentroom.leadR);
              break;
            case "back":
              enterRoom(currentroom.leadB);
              break;
            case "forward":
              enterRoom(currentroom.leadF);
              break;
            case "left":
              enterRoom(currentroom.leadL);
              break;
          }
            

          break;
        case "char":
          GS.innerHTML+=("<p> You are "+Cname+" a "+Cclass+" with "+hp+"/"+maxhp+" HP and "+sp+"/"+equipment[1].maxsp+" SP </p>");
          GS.innerHTML+=("<p> AC:"+equipment[1].AC+" Attack:"+equipment[0].minattack+"-"+equipment[0].maxattack+" Gold:"+Gold+"</p>");
          GS.innerHTML+=("<p> You are wielding "+equipment[0].type+" as your weapon. You are wearing "+equipment[1].type+". You have "+equipment[2].type+" in your offhand."+"</p>"); //You are wearing"+equipment[3]+" on your finger."
          break;
        case "use":
        let x = 0;
        let newinp = [];
        let input;
        let t = 0;
        inputarray = inp.split(" ");
        console.log(inputarray);
        inputarray.forEach(element => {
          if(x != 0){
            if(Number.isInteger(parseInt(element))){
              t = parseInt(element);
              console.log(t);
            }
            else{
            console.log(element);
            newinp.push(element);}
          }
          x+=1;
        });
        input = newinp.join(" ");
          if(find(equipment[2].skills,input) != 2000){
            if(equipment[2].skills[find(equipment[2].skills,input)].reqtarg){if(t == 0)
              {
              GS.innerHTML+=("<p> This skill needs a target. Example use skill targetnum </p>");
              return;}
              equipment[2].skills[find(equipment[2].skills,input)].use(t);} else{
                equipment[2].skills[find(equipment[2].skills,input)].use(100);
              }
          }
          else if(find(inv,input) != 2000){
            switch(input){
              case "Red Potion":
                GS.innerHTML+=("<p> You. </p>");
                hp += 10;
                if(hp>maxhp){hp = maxhp;}
                removeitem("Red Potion");
                break;
                case "Cell Key":
                  if(currentroom.type == "Dungeon 2nd"){
                  rooms[find(rooms,"Dungeon 2nd")].des[0] = "A long cobblestone hallway with iron cells lining the walls, most only filled with corpses and bones of those who were forgotten and left to their fate. As you walk down the hallway, you hear a voice coming from Cell B 5.<p>Forward leads to an old, sturdy iron door with Jailer's Office inscribed into its face. Back leads to the Dungeon main hallway.</p>";
                  GS.innerHTML+=("<p> The figure slowly stands up, revealing a towering skinny form with a big yellow smilly face for its head staring down at you.</p>");
                  GS.innerHTML+=("<p> 'Thank you little rabbit' the figure states before leading the Dungeon. </p>");
                  removeitem("Cell Key");
                }
                  else{
                    GS.innerHTML+=("<p> No place to use the key here. </p>");
                  }
                break;
                case "Magic Scroll":
                if(currentroom.type == "Outer Wall"){
                  GS.innerHTML+=("<p> 'Thank you little rabbit' </p>");
                  removeitem("Magic Scroll");
                }else{
                  GS.innerHTML+=("<p> You read out the magic words on the scroll and green magic fills the area before quickly fadding away. </p>");
                }
                break;
            }
          }
          else{
              GS.innerHTML+=("<p> You don't seem to have that skill or Item. </p>");
          }
          break;
    }
  }
  GS.scrollTop = GS.scrollHeight;
}

function find(Flist,lookingfor){
  console.log(lookingfor);
  let x = 0;
  let f = false;
  Flist.forEach(element => {
    console.log(element.type==lookingfor);
    if(element.type == lookingfor){
      f = true;
    }else{
      if(f != true){
            x+=1;
      }
    }
  });
  if(f == false){
    return 2000;
  }else{
  return x;}
}

function get(input){
  let x = 0;
  input.shift();
  input = input.join(" ");
  x = find(currentroom.items, input);
  if(x != 2000){
    if(currentroom.items[x].tieditem != null){
      inv.push(currentroom.items[x].tieditem);
    }else{
    inv.push(currentroom.items[x]);}
    GS.innerHTML+=("<p> You got "+currentroom.items[x].type+". </p>");
    rooms[find(rooms,currentroom.type)].items[x] = emptyItem;
    enterRoom(rooms[find(rooms,currentroom.type)].type);
  }
  else{
    console.log(input);
    GS.innerHTML+=("<p> There doesn't seem to be "+input+" in this room. </p>");
  }
}
function removeitem(Ritem){
  inv = inv.toSpliced(find(inv,Ritem), 1); 
}
function help(inp){
    let GS = document.getElementById("GameScreen");
    const inputarray = inp.split(" ");
    //if(combat){return;}
      if(inputarray.length == 1){
        GS.innerHTML+=("<p> info <item/skill>   go <direction>  get <item>   skill  help <command>  inv  use <item/skill>  equip <item>  char  </p><p>Combat: Strike</p>");
      }
      else{
        switch(inputarray[1]){
          case "info":
            GS.innerHTML+=("<p> Info: Provides information on the item or skill. Example: info shortsword </p>");
            break;
          case "go":
            GS.innerHTML+=("<p> go: Moves you either forward, back, left, right, up, or down. Only works if there is an open door, hallway, or stairway in that direction. Example: go right </p>");
            break;
          case "get":
            GS.innerHTML+=("<p> get: Adds the item to your inventory if it can be picked up. Example: get Worn book</p>");
            break;
          case "skill":
            GS.innerHTML+=("<p> skill: Gives a list of your skills can also be used as skill <skill> to get info on a skill. Example: skill fireball</p>");
            break;
          case "help":
            GS.innerHTML+=("<p>help: Gives you info on commands. </p>");
            break;
          case "inv":
            GS.innerHTML+=("<p>inv: Shows you a list of all items in your backpack. Can be used to get info on an item in your backpack by doing inv <item>. Example: inv shortsword</p>");
            break;
          case "use":
            GS.innerHTML+=("<p> use: If the object has a use like a healing potion or a magic scroll its used. Example: Use red potion. </p>");
            break;
          case "equip":
            GS.innerHTML+=("<p> equip: Puts armor on or equips weapons. Example: equip scalemail, equip shortsword. </p>");
            break;
          case "char":
            GS.innerHTML+=("<p> char: Shows you all the info of your character. </p>");
            break;
          case "look":
            GS.innerHTML+=("<p> look: Take a closer look at an item in your backpack or an object in the room. Example: look bookcase </p>");
            break;
          case "strike":
            GS.innerHTML+=("<p> strike: Makes an attack with your main weapon for combat . Example: strike 1 </p>");
            break;
          default:
            GS.innerHTML+=("<p> info <item/skill>   go <direction>  get <item>   skill    help <command>   inv    use   wear   look <object> </p><p>Combat:</p>");
            break;
        }
      }
}

function skillinfo(input){
  let skillsmes = "<p> Your current skills: ";
  if(input.length == 1){
    equipment[2].skills.forEach(skillt => {
        skillsmes += skillt.type + ", ";
    });
  }else{
    let x = 0;
        let newinp = [];
        input.forEach(element => {
          if(x != 0){
            newinp.push(element);
          }
          x+=1;
        });
        input = newinp.join(" ");
    skillsmes = equipment[2].skills[find(equipment[2].skills,input)].type + ": " + equipment[2].skills[find(equipment[2].skills,input)].des;
  }
  GS.innerHTML+=(skillsmes);

}

function info(input){
    let invmess = "<p> Your current items: ";
    if(input.length == 1){
        inv.forEach(skillt => {
        invmess += skillt.type + ", ";
    });
      }
      else{
        let x = 0;
        let newinp = [];
        input.forEach(element => {
          if(x != 0){
            newinp.push(element);
          }
          x+=1;
        });
        input = newinp.join(" ");
        invmess = inv[find(inv,input)].type + ": " + inv[find(inv,input)].des;
      }
      GS.innerHTML+=(invmess);
    }
function copyarray(array){
  let newarray = [];
  array.forEach(element => {
    newarray.push(element);
  });
  return newarray;
}

function enterRoom(name){
  if(find(rooms,name) == 2000){
    return;
  }
  if(name == "Grand Ballroom"){
    if(find(inv,"Shiny Key") == 2000){
    GS.innerHTML+=("<p> You don't have the key to enter into the Ballroom. </p>");
    return;}
  }
  
  let newroom = rooms[find(rooms,name)];
  if(name == "Grand Ballroom" && ballroomfought == false){
    if(find(inv,"Shiny Key") == 2000){
    GS.innerHTML+=("<p> You don't have the key to enter into the Ballroom. </p>");
    return;}
    else{
      currentroom = rooms[find(rooms,name)];
      ballroomfought = true;
      switch(Cname){
        case "Cecil":
          startcombat([WeepingWoman]);
          break;
        case "Nicholas":
          startcombat([JustADeer]);
          break;
        case "Cecil":
          startcombat([WeepingWoman]);
          break;
        case "Calx":
          startcombat([NighttimeKing]);
          break;
        case "Thomas":
          startcombat([TheSilentwoods]);
          break;
        case "Lyra":
          startcombat([TheOutsider]);
          break;
        case "Vinny":
          startcombat([Puppet, Puppet, Puppet, PuppetMaster]);
          break;
      }
    }
  }
  currentroom = rooms[find(rooms,name)];
  if(currentroom.foes != null){
    startcombat(currentroom.foes);
    currentroom.foes = null;
    return;
  }
  let x = 0;
  let y = -1;
  document.getElementById("steps").play();
  document.getElementById("steps").volume = 1;
  let dets = []; 
  newroom.des.forEach(element => {
    if(Number.isInteger(element)){
    console.log(element + "is nmu");
    if(newroom.items[element] == null){
      dets.push("");
    }else{dets.push(newroom.items[element].pickupdes);}
    }else{
      dets.push(element);
    }
    x+=1;
  });
  dets = dets.join(" ");
  GS.innerHTML+=(dets);
}

function startcombat(newfoes)
{
  foes = [];
  combat = true;
  conditons = [];
  fallen = 0;
  GS.innerHTML+=("<p> You've been attacked. </p>");
  GS.innerHTML+=("<p> "+currentroom.combatstartmess+" </p>");
  let combatmessage = "<p> A fight starts out you vs ";
  let x = 0;
  newfoes.forEach(element => {
    combatmessage += element.type;
    foes.push(new foe(element.hp, element.AC, element.type, element.skills, element.weakness));
    x+=1;
    if(x<newfoes.length){
          combatmessage += " and ";
    }
  });
  GS.innerHTML+=(combatmessage+"</p>");
  playerturn();
}


function equip(input){
    let x = 0;
    let newinp = [];
    input.forEach(element => {
          if(x != 0){
            newinp.push(element);
          }
          x+=1;
        });
        input = newinp.join(" ");
        if(find(inv,input) == 2000){
            GS.innerHTML+=("<p>You don't seem to have that. </p>");
          return;
        }
        if(inv[find(inv,input)].AC != undefined){
          equipment[1] = inv[find(inv,input)];
          GS.innerHTML+=("<p>Equiped into Armor: "+equipment[1].type+" </p>");
        }else if(inv[find(inv,input)].minattack != undefined){
          equipment[0] = inv[find(inv,input)];
          GS.innerHTML+=("<p>Equiped into Weapon: "+equipment[0].type+" </p>");
        }else if(inv[find(inv,input)].skills != undefined){
          equipment[2] = inv[find(inv,input)];
          GS.innerHTML+=("<p>Equiped into Offhand: "+equipment[2].type+" </p>");
        }else {
          GS.innerHTML+=("<p>You can't equip that. </p>");
        }
        
}

function endcombat(){
  combat = false;
  GS.innerHTML+=("<p> You've won.</p>");
  enterRoom(currentroom.type);
}
function strike(target, skillstrike, attackminus){
  let damageroll = Math.floor(Math.random() * (equipment[0].maxattack-equipment[0].minattack)) + equipment[0].minattack;
  let attackplus = 0;
  if(find(conditons, "Focus") != 2000){
    attackplus += conditons[find(conditons, "Focus")].strength;
  }
  let hitroll = Math.floor(Math.random() * 20) + equipment[0].hitbonus - attackminus + attackplus;
  GS.innerHTML+=("<p> You got a "+hitroll+" on your attempt to hit. </p>");
  if(sp<equipment[1].maxsp){sp+=equipment[0].spgain; if(sp >equipment[1].maxsp){sp = equipment[1].maxsp;}}
  if(turn != 0){return;}
  if(foes[target-1].hp <= 0){GS.innerHTML+=("<p> That target is already dead. Pick another target. </p>"); return;}
  let targetdodge = 0;
  if(find(foes[target-1].cons, "Dodge") != 2000){
      targetdodge += foes[target-1].cons[find(foes[target-1].cons, "Dodge")].strength;
    }
    if(find(foes[target-1].cons, "Slowness") != 2000){
      attackplus += foes[target-1].cons[find(foes[target-1].cons, "Slowness")].strength;
    }
  if(hitroll > foes[target-1].AC + targetdodge){
      document.getElementById("phit").play();
      damagefoe(damageroll,foes[target-1],equipment[1].damtype,true)
  }
  else{
    GS.innerHTML+=("<p> You've missed your target. </p>");
  }
    GS.scrollTop = GS.scrollHeight;
  if(skillstrike == false){ 
      turn += 1;
      setTimeout(() => {
       foeturn();}, 2000);
      }
  }


function damagefoe(amount, target, type, neeedmess){
  if(target.weakness != undefined){ 
    if(target.hp <= 0){
      return;
    }
  if(find(target.weakness,type) == true){
    amount *=2;
  }}
  if(find(target.cons, "Protection") != 2000){
    amount -= target.cons[find(target.cons, "Protection")].strength;
  }
  if(find(target.cons, "Broken") != 2000){
    amount += target.cons[find(target.cons, "Broken")].strength;
  }
  if(amount < 0){amount = 0;}
  target.hp -= amount;
 if(neeedmess != false){GS.innerHTML+=("<p> You've hit "+target.type+" for "+amount+" damage. </p>");}
 if(find(conditons,"Attach Strings") != 2000){
  GS.innerHTML+=("<p> You've knocked the strings off. </p>");
  find(conditons,"Attach Strings")
  conditons[find(conditons,"Attach Strings")].type == "";
 }
 if(target.hp <= 0){
   GS.innerHTML+=("<p> You've killed "+target.type+". </p>");
   GS.innerHTML+=("<p> You gain 3 SP. </p>");
   sp += 3; if(equipment[1].maxsp < sp){
    sp = equipment[1].maxsp;
   }
   fallen +=1;
   document.getElementById("kill").play();
   target.cons == [];
   if(fallen >= foes.length){
    endcombat();
    return;
   }
 }
}
function playerturn(){
  turn = 0;
  let x = 1;
  let cmeess = "<p> ";
  if(combat != true){return;}
  playerconditons();
  foes.forEach(foe => {
    cmeess += "  Spot:"+x+" "+foe.type+" HP: "+foe.hp+"/"+foe.maxhp;
    x+=1;
  });
  GS.innerHTML+=(cmeess);
  GS.innerHTML+=("<p> Your HP: "+hp+"/"+maxhp+" Your SP: "+sp+"/"+equipment[1].maxsp+" </p>")
  GS.innerHTML+=("<p> Its your turn what to do. </p>")
  GS.scrollTop = GS.scrollHeight;
}
function foeturn()
{
  if(combat != true){
    return;
  }
  hit = false;
  if(turn > foes.length){
    playerturn();
    return;
  }
  let currentfoe = foes[turn-1];
  foeconditons(currentfoe);
  if(currentfoe.hp <= 0){
    turn += 1;
    if(turn > foes.length)
    {
      conditons.forEach(element => { 
      element.rounds -= 1;
      if(element.rounds <= 0){
        GS.innerHTML+=("<p> You are no longer effected by "+element.type+"</p>")
        conditons[find(conditons,element.type)].type = "";
      }
    });
      playerturn();
      
    }
    else{foeturn();}
  }
  else{
    let sroll = Math.floor(Math.random() * currentfoe.skills.length);
    switch(currentfoe.skills[sroll]){
      case "bite":
        foeattack(1,2,1,"bite");
        break;
      case "fire bite":
        if(foeattack(1,2,1,"fire bite") == true){
          addcondition(lowfire);
        }
        break;
      case "Cup":
        if(foeattack(4,7,4,"Cup Splash") == true){
          addcondition(lowdizzy);
        }
        break;
      case "Curse":
        addcondition(lowbroken);
        addcondition(lowweakness);
        GS.innerHTML+=("<p> An evil chant rings through out your mind cursing you to be weaker and take more damage for a few turns.</p>")
        break;
      case "Cut":
        foeattack(8,11,1,"Cut");
        break;
      case "Heal":
        let healroll = Math.floor(Math.random() * 7) + 1;
        GS.innerHTML+=("<p>The "+currentfoe.type+" healed for "+healroll+". </p>")
        currentfoe.hp += healroll;
        if(currentfoe.hp > currentfoe.maxhp){
          currentfoe.hp = currentfoe.maxhp;
        }
        break;
      case "Trap":
        if(foeattack(2,3,4,"Trap") == true){
          addcondition(lowslow);
          GS.innerHTML+=("<p>Horrid Chains wrap around your body trapping you in place making you easier to hit. </p>")
        }
        break;
      case "Abuse":
        foeattack(2,7,3,"Abuse");
        foeattack(2,7,3,"Abuse");
        foeattack(2,7,3,"Abuse");
        break;
      case "Rip":
        if(foeattack(12,12,0,"Rip") == true){
          addcondition(lowbroken);
          GS.innerHTML+=("<p>A chunk of flesh is ripped out leaving you broken.</p>")
        }
        break;
      case "Stab":
        foeattack(3,6,4,"Stab");
        break;
      case "slash":
        foeattack(2,6,1,"Slash");
        break;
      case "Burn":
        if(foeattack(4,4,6,"Burn") == true){
          addcondition(highfire);
          GS.innerHTML+=("<p>Has thrown boling Oil at you.</p>")
        }
        break;
      case "Splash":
        if(foeattack(0,0,4,"Splash") == true){  
          GS.innerHTML+=("<p>Your splashed with a horrid concoction</p>");
          addcondition(lowdizzy);
          addcondition(lowbroken);
          addcondition(lowweakness);
          addcondition(lowslow);}
        break;
      case "Break":
        if(foeattack(5,10,3,"Break") == true){
          addcondition(lowbroken);
          addcondition(lowslow);
          GS.innerHTML+=("<pYour slamed with the weapon breaking some bones.</p>")
        }
        break;
      case "shield up":
          GS.innerHTML+=("<p"+currentfoe.type+" raises its shield taking less damage for a few turns.</p>")
          foeaddcondition(currentfoe,lowprot);
        break;
      case "Abuse":
        foeattack(4,4,2,"Rapid Fire");
        foeattack(4,4,2,"Rapid Fire");
        break;
      case "Weaken":
        if(foeattack(4,4,3,"Weakn") == true){
          addcondition(lowweakness);
        }
        break;
      case "Shatter":
        if(foeattack(11,15,-2,"Weakn") == true){
          addcondition(lowbroken);
        }
        break;
      case "Fireball":
        if(foeattack(4,8,5,"Fireball") == true){
          addcondition(lowfire);
        }
        break;
      case "Blind":
        if(foeattack(1,1,5,"Blind") == true){
          addcondition(highdizzy);
        }
        break;
      case "Magic Shield":
          if(equipment[0].type != "Mage Bane"){
          GS.innerHTML+=("<p"+currentfoe.type+" summons a large magical shield to protect it self.</p>")
          foeaddcondition(currentfoe,highdodge);
          foeaddcondition(currentfoe,prot);
          }
          else{
            GS.innerHTML+=("<p"+currentfoe.type+" summons a large magical shield to protect itself self but Mage Bane flashes green, dispelling the shield..</p>")
          }
        break;
      case "Dance Little Puppet":
          foes.forEach(element => {
            foeaddcondition(element,lowfocus);
            foeaddcondition(element,lowpower);
          });
          if(find(conditons,"Attach Strings") != 2000){
            addcondition(lowdizzy);
            addcondition(lowbroken);}
        break;
      case "Attach String":
      if(find(conditons,"Attach Strings") == 2000){
        if(foeattack(5,8,5,"Attach String") == true){
          addcondition(lowstrings);
        }
      }
      else{
        foeattack(5,12,6,"Attach String");
      }
        break;
      case "Dark Beasts":
        foeattack(4,8,2,"Dark Beasts");
        foeattack(4,8,2,"Dark Beasts");
        break;
      case "Crushing Shadows":
        if(foeattack(6,6,5,"Crushing Shadows") == true){
          addcondition(lowbroken);
        }
        break;
      case "Strike":
        GS.innerHTML+=("<p> The "+currentfoe.type+" strikes at you using a copy of your weapon.</p>")
        foeattack(equipment[0].minattack,equipment[0].maxattack,equipment[0].hitbonus,"Strike");
        break;
      case "Eat":
        foeattack(3,6,2,"Eat");
        foeattack(3,6,2,"Eat");
        foeattack(3,6,2,"Eat");
        break;
      case "Strangle":
        if(foeattack(5,12,0,"Strangle") == true){
          addcondition(lowdizzy);
        }
        break;
      case "Drown":
        foeattack(2,2,3,"Drown");
        foeattack(2,2,3,"Drown");
        foeattack(2,2,3,"Drown");
        foeattack(2,2,3,"Drown");
        foeattack(2,2,3,"Drown");
        foeattack(2,2,3,"Drown");
        break;
      case "That Beutiful Music":
        addcondition(highdizzy);
        addcondition(lowweakness);
        break;
      case "Multilate":
        if(foeattack(5,17,0,"Multilate") == true){
          addcondition(lowbroken);
        }
        break;
      case "Accident":
        GS.innerHTML+=("<p> You find yourself strangely damage losing 3 hp.</p>")
        damageplayer(3);
        break;
      case "Remove":
        GS.innerHTML+=("<p> You find a bit of yourself gone.</p>")
        damageplayer(7);
        break;
      case "Forget":
        GS.innerHTML+=("<p> You find a bit of yourself forgotten and slowly are losing more. You lose 3 SP.</p>")
        addcondition(lowdizzy);
        addcondition(lowForget);
        sp-=3;if(sp<0){sp = 0;}
        break;
      case "Silince":
        GS.innerHTML+=("<p> You find a bit of yourself falling silent.</p>")
        addcondition(lowweakness);
        if(foeattack(0,0,6,"Multilate") == true){
        sp-=3;if(sp<0){sp = 0;}
      }
        break;
    }
    if(foes[turn-1].cons.length != 0){
    foes[turn-1].cons.forEach(element => { 
      element.rounds -= 1;
      if(element.rounds <= 0 && element.type != ""){
        GS.innerHTML+=("<p> The "+foes[turn-1].type+" is no longer effected by "+element.type+"</p>")
        foes[turn-1].cons[find(foes[turn-1].cons, element.type)].type = "";
      }
      
    });}
    turn+=1;
    GS.scrollTop = GS.scrollHeight;
      setTimeout(() => {
      foeturn();}, 2000);
  }
}

function foeattack(mindamage, maxdamage, chance, sname){
  let h = false;
  let mins = 0;
  if(find(foes[turn-1].cons, "Dizzy") != 2000){
    mins += foes[turn-1].cons[find(foes[turn-1].cons, "Dizzy")].strength;
  }
  if(find(conditons, "Dodge") != 2000){
      mins += conditons[find(conditons, "Dodge")].strength;
  }
  if(find(conditons, "Slowness") != 2000){
      mins -= conditons[find(conditons, "Slowness")].strength;
  }
    if(find(foes[turn-1].cons, "Focus") != 2000){
      mins -= currentfoe.cons[find(conditons, "Focus")].strength;
  }
  let hitroll = Math.floor(Math.random() * 20) + 1;
  console.log(hitroll); 
  hitroll -= mins;
  console.log(hitroll);
  if(hitroll+chance >= equipment[1].AC){
    let damageroll = Math.floor(Math.random() * (maxdamage-mindamage)) + mindamage;
    if(find(foes[turn-1].cons, "Power") != 2000){
      damageroll += currentfoe.cons[find(currentfoe.cons, "Power")].strength;
  }
    GS.innerHTML+=("<p> The "+foes[turn-1].type+" used "+sname+" and hit you for "+damageroll+" damage </p>")
    damageplayer(damageroll);
    h = true;
  }else{
    GS.innerHTML+=("<p> The "+foes[turn-1].type+" missed its attack.</p>")
  }
  return h;
}

function addcondition(conditont){
  if(find(conditons, conditont.type) != 2000){
    return;}
 if(conditont.type == "Weakness" && equipment[1].type == "Fancy Clothes"){
   GS.innerHTML+=("<p> Your Fancy Clothes protected you from weakness. </p>");
  return;
 }
  conditons.push(new conditon(conditont.rounds, conditont.strength, conditont.type));
  GS.innerHTML+=("<p> You've been inflicted with "+conditont.type+".</p>");
}
function foeaddcondition(target, conditont){
  if(find(target.cons, conditont.type) != 2000){
    return;}
  target.cons.push(new conditon(conditont.rounds, conditont.strength, conditont.type));
  GS.innerHTML+=("<p> "+target.type+" has been inflicted with "+conditont.type+".</p>");
}

function playerconditons(){
  conditons.forEach(cond => {
    switch(cond.type){
      case "Fire":
        GS.innerHTML+=("<p> You've been burned for "+cond.strength+". Type roll to put your self out.</p>")
        damageplayer(cond.strength);
        break;
      case "Forget":
        GS.innerHTML+=("<p> You've forgotten more of yourself "+cond.strength+". Type Remember.</p>")
        damageplayer(cond.strength);
        break;
    }
  });
}
function foeconditons(foe){
  foe.cons.forEach(cond => {
    switch(cond.type){
      case "Fire":
        GS.innerHTML+=("<p> "+foe.type+" was burned for "+cond.strength+".</p>")
        damagefoe(cond.strength,foe,"Fire", false);
        break;
    }
  });
}

function damageplayer(amount){
    if(find(conditons, "Protection") != 2000){
    amount -= conditons[find(conditons, "Protection")].strength;
  }
  if(find(conditons, "Broken") != 2000){
    amount += conditons[find(conditons, "Broken")].strength;
  }
      hp -= amount;
      if(hp <= 0){
        GS.innerHTML+=("<p> You've been slain.</p>")
      }
}
