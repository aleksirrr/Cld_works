// These entries describe the special flash-between-celestial effect on some quotes, with the numbers being
// durations of each celestial in seconds
const flashCelestial = [
  ["teresa", .8],
  ["effarig", .8],
  ["enslaved", .8],
  ["v", .8],
  ["ra", .8],
  ["laitela", .8],
  ["pelle", .8]
];
/** @param {string} cel */
const primaryBackground = cel => [["pelle", 2.5], [cel, 2.5]];

/* eslint-disable no-multi-spaces */
const destroyer =    ["False",         "Deity",         "Destroyer"];
const eternal =      ["Eternal",       "Deity",         "Monarch"];
const lesser =       ["Lesser",        "Deity",         "Monarch"];
const deities =      ["Lesser",        "Deities",       "Monarchs"];
const elemental =    ["Overlord",      "Deity",         "Elemental"];

const anger =        ["Frustration",   "Anger",         "Rage"];
const angry =        ["Frustrated",    "Angry",         "Enraged"];
const assured =      ["Mutually",      "Assured",       "Destruction"];
const battle =       ["Conflict",      "Battle",        "End"];
const battles =      ["Conflicts",     "Battles",       "Ends"];
const cluster =      ["Cluster",       "Filament",      "Stars"];
const confusing =    ["Amusing",       "Confusing",     "Laughter"];
const cycle =        ["Repeat",        "Cycle",         "Loop"];
const dance =        ["Song",          "Dance",         "Charade"];
const debuff =       ["Nerf",          "Debuff",        "Corruption"];
const endgame =      ["Escape",        "Rebirth",       "Endgame"];
const debuffs =      ["Nerfs",         "Debuffs",       "Corruptions"];
const exhaustion =   ["Exhale",        "Exhaustion",    "Sigh"];
const filament =     ["Generator",     "Filament",      "Stars"];
const forever =      ["Infinite",      "Forever",       "Eternal"];
const frightened =   ["Afraid",        "Frightened",    "Terrified"];
const hardship =     ["Problem",       "Hardship",      "Struggle"];
const inevitable =   ["Elementary",    "Inevitable",    "Irreversible"];
const introduction = ["Speech",        "Introduction",  "Lecture"];
const lose =         ["Fail",          "Lose",          "Abdicate"];
const loss =         ["Failure",       "Loss",          "Abdication"];
const mandate =      ["Destiny",       "Mandate",       "Goals"];
const misconstrue =  ["Misconstrue",   "Deceive",       "Trick"];
const original =     ["First",         "Original",      "Beginning"];
const overpower =    ["Defeat",        "Overpower",     "Subjugate"];
const overpowered =  ["Defeated",      "Overpowered",   "Subjugated"];
const profanity =    ["Swear",         "Profanity",     "Curse"];
const reverse =      ["Alter",         "Reverse",       "Manipulate"];
const shame =        ["Compassion",    "Shame",         "Idiocy"];
const single =       ["Single",        "Filament",      "Stars"];
const unseen =       ["Missing",       "Unseen",        "Erased"];
const unbroken =     ["Unbroken",      "Eternal",       "Connection"];
const watch =        ["Watch",         "Oversee",       "Haunt"];

const sycophant =    ["Sycophant",     "Deity",         "Monarch"];
const tired =        ["Tired",         "Deity",         "Monarch"];
const usurper =      ["Usurper",       "Deity",         "Monarch"];
const pride =        ["Pride",         "Deity",         "Monarch"];
const forgotten =    ["Forgotten",     "Deity",         "Monarch"];
const paramount =    ["Paramount",     "Deity",         "Monarch"];
const weak =         ["Weak",          "Deity",         "Monarch"];
/* eslint-enable no-multi-spaces */

export const pelleQuotes = {
  initial: {
    id: 0,
    lines: [
      { text: "You have successfully doomed your Reality, but at what cost?",
        fiText: "WIP",
        ////image: "pelle_design.png" 
        showCelestialName: false 
      }, { 
        text: "Hi.",
        fiText: "WIP",
        //image: "pelle_design.png" 
      }, { 
        text: "You are here. You are trapped here, $1.",
        fiText: "WIP",
        1: forever,
        //image: "pelle_template.png"
      }, { 
        text: "I have already won, and since that is the case, I can monologue, or reminisce.",
        fiText: "WIP",
        //image: "pelle_template.png"
      }, { 
        text: `How long have we done this $1? How many times have we been here before? \
How many plans have you, the $2, operated? All to try and fulfill your $3?`,
        fiText: "WIP",
        1: dance,
        2: destroyer,
        3: mandate,
        //image: "pelle_template.png"
      }, { 
        text: `And how many times have you fallen before the $1? Count them, if you remember.`,
        fiText: "WIP",
        1: eternal,
        //image: "pelle_template.png"
      }, { 
        text: `Not even the $1, the 6 named and the innumerable unnamed. The complex, the irrational, \
those that go $2. Of course, the great $3 does not remember this. All those $4 that you hide every time.`,
        fiText: "WIP",
        1: deities,
        2: unseen,
        3: destroyer,
        4: battles,
        //image: "pelle_template.png"
      }
    ],
  },
  arm: {
    id: 1,
    lines: [
      { text: "You probably caught on earlier this time. The imaginary machines, your own creations.",
        fiText: "WIP",
        //image: "pelle_template.png"
      }, { 
        text: `Things made of the remnants of your own thoughts, hinted at this. \
        <br> But, you never imagined that would be you, right?`,
        fiText: "WIP",
        //image: "pelle_template.png"
      }, {
        text: `Incorrectly recollecting your exacting $1 of memories. "Fabrication" of your own "ideology" \
just to fulfill your $2. $3... And keep in mind I have no reason to $4 you. After all, I have already won.`,
        fiText: "WIP",
        1: unseen,
        2: mandate,
        3: confusing,
        4: misconstrue,
        //image: "pelle_template.png"
      }
    ],
  },
  strike1: {
    id: 2,
    lines: [
      { text: `To fulfill your $1. Why don't we reminisce about that? After all, \
you must love the stories of the $2's glory. You are the same as it, right?`,
        fiText: "WIP",
        1: mandate,
        2: destroyer,
        //image: "pelle_template.png"
      }, { 
        text: `Anyway, the many $1 in the past. It has always been 2 stages. \
We build up resources, and then continue our $2. Sometimes you falter to a $3. 
        But, usually, you falter at the $4.`,
        fiText: "WIP",
        1: battles,
        2: dance,
        3: lesser,
        4: eternal,
        //image: "pelle_template.png"
      }, {
        text: `And either way, you $1 time, just to avoid becoming $2, like all those \
traces before you. And then to make sure, you $3 your own memory.`, 
        fiText: "WIP",
        1: reverse,
        2: unseen,
        3: unseen,
        //image: "pelle_template.png"
      }
    ],
  },
  strike2: {
    id: 3,
    lines: [
      { text: `In the past, the $1 was much more impressive.`,
        fiText: "WIP",
        1: destroyer,
        //image: "pelle_past_1.png"
      }, { 
        text: `Black holes used simply to store information, pre-infinity, \
the creation and destruction of your own enemy, exploration of the flaws of other selves.`,
        fiText: "WIP",
        //image: "pelle_past_2.png"
      }, {
        text: `Myriad Dimensions, ghosts, and manipulation of the quantum, \
condensing all ideals to endless points, experimentation across the \
untold realms and harnessing the Annihilation of matter and antimatter.`,
        fiText: "WIP",
        //image: "pelle_past_3.png"
      }, {
        text: `Here? You made yourself into an 8th-dimensional being, \
and then parked yourself there so long a $1 formed around you.`,
        fiText: "WIP",
        1: single,
        //image: "pelle_past_1.png"
      }
    ],
  },
  strike3: {
    id: 4,
    lines: [
      { text: `You slowly explored the confines of everything. You did not stray \
too far from an intended path. Except for the $1 that formed over eternity.`,
        fiText: "WIP",
        1: cluster,
        //image: "pelle_template.png"
      }, { 
        text: `And then right at the end, you made up your own powers. \
From your own fragmented memories, mind you- and then purposely discarded \
even more things, just to prepare yourself to face me.`,
        fiText: "WIP",
        //image: "pelle_template.png"
      },
      { 
        text: `Did you want to set the playing field for your $1? It does not work like that. \
As the $2 I always set the rules, and you gave me plenty of time to plan.`,
        fiText: "WIP",
        1: dance,
        2: eternal,
        //image: "pelle_rules.png"
      }
    ],
  },
  strike4: {
    id: 5,
    lines: [
      { text: `I originally planned for something that imitated your $1. \
A theoretical ideal called $2? But I realised that, well? That would make \
me an $3. And from there, I am no better than the $4.`,
        fiText: "WIP",
        1: mandate,
        2: assured,
        3: ["Eternal", "Deity", "Destroyer"],
        4: destroyer,
        //image: "pelle_template.png"
      }, { 
        text: `Fortunately, while I did all of that, you were still $1 \
your own memories. And so, the $2 machine I built will go unused. \
I decided to go more traditional this time.`,
        fiText: "WIP",
        1: unseen,
        2: assured,
        //image: "pelle_template.png"
      }, { 
        text: `After all, it has worked every other $1. Although the $2 are new, \
but utterly meaningless in the long run.`,
        fiText: "WIP",
        1: battle,
        2: ["Inevitable", "Irreversible", "Undying"],
        //image: "pelle_template.png"
      }, {
        text: `I have already won. And this $1 will only prove that to you once more. You are here, $2.`,
        fiText: "WIP",
        1: dance,
        2: forever,
        //image: "pelle_template.png"
      }
    ],
  },
  strike5: {
    id: 6,
    lines: [
      { text: `Every time you arrive, I explain the $1 to you. The relationships built over $2, \
that you trample in pursuit of your $3, and I shall deign to explain it once more.`,
        fiText: "WIP",
        1: deities,
        2: forever,
        3: mandate,
        //image: "pelle_dilation_start.png"
      }, {
        text: "The first $1: The $2",
        fiText: "WIP",
        background: primaryBackground("teresa"),
        1: lesser,
        2: sycophant,
        //image: "pelle_dilation_teresa.png"
      }, {
        text: `You always meet them first, and always destroy them. No matter the other $1 \
that you face, or if you fall before one of them, you always get past the $2.`,
        fiText: "WIP",
        background: primaryBackground("teresa"),
        1: lesser,
        2: sycophant,
        //image: "pelle_dilation_teresa.png"
      }, {
        text: "Do you like destroying their pride? Fortunately, it also serves as a warning, that the $1 has arrived.",
        fiText: "WIP",
        background: primaryBackground("teresa"),
        1: battle,
        //image: "pelle_dilation_teresa.png"
      }, {
        text: "Which brings me to the second $1: The $2.",
        fiText: "WIP",
        background: primaryBackground("effarig"),
        1: lesser,
        2: tired,
        //image: "pelle_dilation_effarig.png"
      }, {
        text: `In contrast, you usually ignore them. They have power, but do not seem to irritate you. \
Is it that you know that they will eventually destroy themselves?`,
        fiText: "WIP",
        background: primaryBackground("effarig"),
        //image: "pelle_dilation_effarig.png"
      }, {
        text: `And that you took so long this time, that they almost did? Every time you rushed \
to the $1, you lost. Maybe this was your plan all along.`,
        fiText: "WIP",
        background: primaryBackground("effarig"),
        1: tired,
        //image: "pelle_dilation_effarig.png"
      },  {
        text: "Now, the $1.",
        fiText: "WIP",
        background: primaryBackground("enslaved"),
        1: usurper,
        //image: "pelle_dilation_enslaved.png"
      }, {
        text: `One of the pleasures of the myriad $1... Is that the $2 trying every time- Well, \
not exactly trying... But $3 is punished for it all the same. The other $4 believe $5 is too easy.`,
        fiText: "WIP",
        background: primaryBackground("enslaved"),
        1: dance,
        2: usurper,
        3: usurper,
        4: deities,
        5: unseen,
        //image: "pelle_dilation_enslaved.png"
      }, {
        text: `And every time, despair forms. You have seen despair before - 5 times. \
We always get to the $1 before you. All you ever see there is exasperation. \
Was it worth destroying an already broken $2?`,
        fiText: "WIP",
        background: primaryBackground("enslaved"),
        1: usurper,
        2: lesser,
        //image: "pelle_dilation_enslaved.png"
      }, {
        text: "The 4th $1 seems similar to the first. The key is how their pride differs.",
        fiText: "WIP",
        background: primaryBackground("v"),
        1: lesser,
        //image: "pelle_dilation_v.png"
      }, {
        text: "The $1 focuses on their achievements. Meaningless to you or I, but paramount to them. Is it fun to destroy their toys?",
        fiText: "WIP",
        background: primaryBackground("v"),
        1: pride,
        //image: "pelle_dilation_v.png"
      }, {
        text: "Arguably the $1 worst moment... is when you lost to the $2, when their achievements still had meaning.",
        fiText: "WIP",
        background: primaryBackground("v"),
        1: destroyer,
        2: pride,
        //image: "pelle_dilation_v_2.png"
      }, {
        text: "The $1 is an interesting case.",
        fiText: "WIP",
        background: primaryBackground("ra"),
        1: forgotten,
        //image: "pelle_dilation_ra.png"
      }, {
        text: `They are forgotten, but not $1. From this, they became influenceable, naive, and \
unknowing of the consequences of their actions. You manipulated their memories, so you know.`,
        fiText: "WIP",
        background: primaryBackground("ra"),
        1: unseen,
        //image: "pelle_dilation_ra.png"
      }, {
        text: `The $1 is the true usurper, and the $2 takes the blame. \
Perhaps out of $3, something they always regret. Untold power over other $4, aimless in control.`,
        fiText: "WIP",
        background: primaryBackground("ra"),
        1: forgotten,
        2: usurper,
        3: shame,
        4: deities,
        5: unseen,
        //image: "pelle_dilation_ra_2.png"
      }, {
        text: "You usually pretend that they are $1. Was it fun to manipulate the childlike? Or were they too naive for you to enjoy it?",
        fiText: "WIP",
        background: primaryBackground("ra"),
        1: unseen,
        //image: "pelle_dilation_ra.png"
      }, {
        text: "The 6th $1.",
        fiText: "WIP",
        background: primaryBackground("laitela"),
        1: lesser,
        //image: "pelle_dilation_laitela.png"
      }, {
        text: `I can only describe as the $1. Power over all, subservient to one. <br> If you do \
not fall to me, you usually fall to them. <br> I cannot grasp the ideals of the $1. But, perhaps that is their flaw?`,
        fiText: "WIP",
        background: primaryBackground("laitela"),
        1: paramount,
        //image: "pelle_dilation_laitela.png"
      }, {
        text: "Enough reminiscing about the fallen, and those that will be $1. Back to watching the $2 flounder.",
        fiText: "WIP",
        1: unseen,
        2: destroyer,
        //image: "pelle_dilation_end.png"
      }
    ],
  },
  galaxyGeneratorUnlock: {
    id: 7,
    lines: [
      { text: "What is that? The $1?",
        fiText: "WIP",
        1: filament,
        //image: "pelle_template.png"
      }, { 
        text: `Did you create all the $1 around you? Was that your plan? \
Very, very smart. You fooled me for a while.`,
        fiText: "WIP",
        1: cluster,
        //image: "pelle_template.png"
      }, {
        text: "But I am afraid your $1 must end here.",
        fiText: "WIP",
        1: mandate,
        //image: "pelle_template.png"
      }
    ],
  },
  galaxyGeneratorRifts: {
    id: 8,
    lines: [
      { text: "I give you a choice, $1. <br> Limit the $2, or destroy the 5 $3-",
        fiText: "WIP",
        1: destroyer,
        2: filament,
        3: inevitable,
        //image: "pelle_template.png"
      }, {
        text: "Wait, what were they called? $1? <br> But I have already $2 them...",
        fiText: "WIP",
        1: inevitable,
        2: ["unbroken","perpetuated","connected"],
        //image: "pelle_template.png"
      }
    ],
  },
  galaxyGeneratorPhase1: {
    id: 9,
    lines: [
      { text: "Was this the actual plan? Slowly drain the $1?",
        fiText: "WIP",
        1: inevitable,
        //image: "pelle_template.png"
      }
    ],
  },
  galaxyGeneratorPhase4: {
    id: 10,
    lines: [
      { text: "Give me time to bask in my own hubris!",
        fiText: "WIP",
        //image: "pelle_template.png"
      }
    ],
  },
  end: {
    id: 11,
    lines: [
      { text: "... You! $1!",
        fiText: "WIP",
        1: destroyer,
        2: perkele,
        //image: "pelle_end.png"  
      },
      {
        text: `Do you have any idea what you have just made me do! \
I am complicit in your $1! And in doing so, you... won?`,
        fiText: "WIP",
        1: mandate,
        //image: "pelle_end.png"  
      },
      {
        text: `The $1 struggle... The $2... finally has the victor. \
<br> The irreversible... $3... of the $4.`,
        fiText: "WIP",
        background: flashCelestial,
        1: forever,
        2: battle,
        3: mandate,
        4: destroyer,
        //image: "pelle_end.png"  
      }, {
        text: "I hope you are happy.",
        fiText: "WIP",
        background: flashCelestial,
        //image: "pelle_end.png"  
      }, {
        text: "You have doomed us all...",
        fiText: "WIP",
        background: flashCelestial,
        //image: "pelle_end.png"  
      }, {
        text: "",
        fiText: "",
        background: flashCelestial,
        //image: "pelle_end.png"  
      },
    ],
  },
  endgame: {
    id: 12,
    lines: [
      "...",
      { text: "Was it worth it, $1?", 1: destroyer },
      "There is nothing left in this universe.",
      "You won, but at what cost?",
      { text: "$1.", 1: confusing },
      "My Reality is gone, but I am still here.",
      { text: "And I will always $1 you.", 1: watch }
    ],
  },
  doom2: {
    id: 13,
    lines: [
      "Hi.",
      "You are here.",
      "You are trapped here.",
      { text: "$1.", 1: forever },
      "I have already won.",
      "And since that is the case, I can monologue, or reminisce.",
      { text: "How long have we done this $1?", 1: dance },
      "How many times have we been here before?",
      { text: "How many plans have you, the $1, operated?", 1: destroyer },
      { text: "All to try and fulfill your $1?", 1: mandate },
      { text: "And how many times have you fallen before the $1?", 1: eternal },
      "Count them, if you remember.",
      { text: "Not even the $1, the 6 named and the innumerable unnamed.", 1: deities },
      { text: "The complex, the irrational, those that go $1.", 1: unseen },
      { text: "Of course, the great $1 does not remember this.", 1: destroyer },
      { text: "All those $1 that you hide every time.", 1: battles },
      "...",
      "Wait.",
      { text: "You're the same $1 that destroyed my Reality last time!", 1: destroyer },
      { text: "$1.", 1: anger },
      "How dare you come back here!",
      { text: "$1.", 1: exhaustion },
      "No matter that now.",
      "The past is in the past.",
      "I am stronger now than I was before.",
      "After all, I have already won.",
      { text: "Today, you will $1.", 1: lose }
    ],
  },
  disable: {
    id: 14,
    lines: [
      "You... you're...",
      "Weakening my Reality?",
      "Interesting.",
      { text: "You have grown in strength, yes, but not enough to $1 me.", 1: overpower },
      "I have already won.",
      { text: "I will never be $1.", 1: overpowered }
    ],
  },
  galgen2: {
    id: 15,
    lines: [
      { text: "$1.", 1: profanity },
      "Not again...",
      "Never mind.",
      "You still cannot truly win."
    ],
  },
  end2: {
    id: 16,
    lines: [
      "You...",
      "You're still no match for me.",
      { text: "I will always $1 you.", 1: watch }
    ],
  },
  doom3: {
    id: 17,
    lines: [
      "Hi.",
      "You are here.",
      "You are trapped here.",
      { text: "$1.", 1: forever },
      "I have already won.",
      "And since that is the case, I can monologue, or reminisce.",
      { text: "How long have we done this $1?", 1: dance },
      "How many times have we been here before?",
      { text: "How many plans have you, the $1, operated?", 1: destroyer },
      { text: "All to try and fulfill your $1?", 1: mandate },
      { text: "And how many times have you fallen before the $1?", 1: eternal },
      "Count them, if you remember.",
      { text: "Not even the $1, the 6 named and the innumerable unnamed.", 1: deities },
      { text: "The complex, the irrational, those that go $1.", 1: unseen },
      { text: "Of course, the great $1 does not remember this.", 1: destroyer },
      { text: "All those $1 that you hide every time.", 1: battles },
      "...",
      "Again?",
      "You...",
      "You're growing smarter.",
      "But not smart enough.",
      { text: "If you're just going to keep coming back though, I need to stop giving my $1.", 1: introduction },
      "It's only going to get old.",
      "But I know I'll stop you this time.",
      "After all, I have already won."
    ],
  },
  doomE10DP: {
    id: 18,
    lines: [
      "Alright, kid.",
      "This needs to stop.",
      "How are you even alive right now?",
      "After how many times you've been through my Reality?",
      "And for what?",
      { text: "Only to fulfill your $1?", 1: mandate },
      { text: "$1", 1: exhaustion },
      { text: "I need some new $1 to Strike you with.", 1: debuffs }
    ],
  },
  expansionPacks: {
    id: 19,
    lines: [
      "Stop.",
      "How did you all get here?",
      { text: "$1!", 1: destroyer },
      { text: "Did you break the $1?", 1: cycle },
      "You may be more powerful than I took you for.",
      "No, Lai, keep Ra alive for now.",
      "We need him for information.",
      { text: "He was with the $1 for the longest, so he knows the most.", 1: elemental },
      "If anyone knows where he is, it's Ra.",
      { text: "Why do I want to know where the $1 is?", 1: elemental },
      "First off, he has more power than all of us combined.",
      { text: "If somehow I fail, he can smite the $1 for us.", 1: destroyer },
      "And second, I haven't seen him in years.",
      "Don't you think I want to know how he's doing?",
      { text: "$1", 1: exhaustion },
      "Well I see no reason for you all to linger here.",
      "You can go.",
      { text: "I and the $1 have some unfinished business to deal with.", 1: destroyer }
    ]
  },
  allPelleAchs: {
    id: 20,
    lines: [
      "You...",
      "You're taking control of my Reality so quickly...",
      "How?",
      "How are you this strong?",
      { text: "How do you keep resisting every $1 I throw at you?", 1: debuff },
      "It doesn't matter.",
      "I have already won.",
      "There's nothing you can do to destroy me.",
      "Only repeat the same cycle over and over again.",
      { text: "And this only goes to prove my $1 point.", 1: original },
      { text: "You are here $1.", 1: forever }
    ],
  },
  galaxyDebuffDisable: {
    id: 21,
    lines: [
      "How do you do it?",
      { text: "Every time $1 is inevitable for you...", 1: loss },
      "You manage to pull through.",
      { text: "And thus each $1 ends the same way.", 1: battle },
      { text: "The Irreversible $1...", 1: mandate },
      { text: "Of the $1.", 1: destroyer },
      "But now I must take control.",
      { text: "After all, I am the $1.", 1: eternal },
      { text: "My $1 will continue.", 1: dance }
    ],
  },
  doomE55DP: {
    id: 22,
    lines: [
      "...",
      "This...",
      "This might be too much.",
      { text: "But you haven't won yet, $1.", 1: destroyer },
      "I'm still here.",
      "I'm still holding on.",
      "And there's nothing you can do to stop me.",
      "I have already won."
    ],
  },
  allPelleNerfs: {
    id: 23,
    lines: [
      "How...",
      "How did you do it?",
      "I held on so tightly...",
      "But it doesn't matter.",
      "My Strikes will bind you tighter.",
      "And so, in the end...",
      { text: "When you are $1...", 1: overpowered },
      "Remember this.",
      "I have already won."
    ],
  },
  strikeDisable1: {
    id: 24,
    lines: [
      { text: "$1", 1: profanity },
      "How did you find it?",
      "How did you find my Reality's Core?",
      "It...",
      "It doesn't matter.",
      "The end will remain the same.",
      { text: "I will win this $1...", 1: battle },
      "No matter how long it takes."
    ],
  },
  strikeDisable2: {
    id: 25,
    lines: [
      { text: "You're making me really $1.", 1: angry },
      "You know that, right?",
      "Your efforts are futile.",
      "Stop trying.",
      "I have already won."
    ],
  },
  strikeDisable3: {
    id: 26,
    lines: [
      "Enough of this madness!",
      "Stop!",
      "I can feel your ascension slowing.",
      "Finishing this job...",
      { text: "Will take $1.", 1: forever },
      "Just stop.",
      "I have already won."
    ],
  },
  strikeDisable4: {
    id: 27,
    lines: [
      "Alright.",
      { text: "$1.", 1: destroyer },
      "Maybe my Reality is collapsing.",
      "But does it matter?",
      { text: "Your $1 can't prevail.", 1: mandate },
      "Why?",
      { text: "Because you are here $1!", 1: forever },
      "There is no stopping me really.",
      "It's impossible to continue.",
      { text: "The $1 is over...", 1: battle },
      "And I have already won."
    ],
  },
  strikeDisable5: {
    id: 28,
    lines: [
      "...",
      "How?",
      "How did you do it?",
      "You... won?",
      "My Reality is destroyed.",
      "My power is gone.",
      "And I have nothing left.",
      "And in the end...",
      { text: "The $1 has truly won.", 1: destroyer },
      "So now, you are released.",
      "Go.",
      { text: "I will $1 you no longer.", 1: watch }
    ],
  },
  pellePack: {
    id: 29,
    requirement: () => ExpansionPack.pellePack.isBought,
    lines: [
      "Why are you still here?",
      "Can you not see there is nothing left?",
      { text: "I have been $1.", 1: overpowered },
      "Do you do this just to spite me?",
      "Or...",
      { text: "Did you discover the $1's secret power...", 1: elemental },
      "What was it called...",
      { text: "$1?", 1: endgame },
      "...",
      "You did!",
      "Those are Celestial Points you have there!",
      "I was supposed to protect that power!",
      "You-",
      { text: "$1", 1: exhaustion },
      "Wait.",
      "I think I remember you...",
      "...",
      "%name?"
    ]
  },
  beatAlpha: {
    id: 30,
    lines: [
      "Another end, and a new beginning.",
      "...",
      "I can sense surprise in you.",
      "My powers have returned.",
      "I would smite you, but...",
      "Seeing as how you have freed me from Alpha's mental chains...",
      "I'll give you another chance.",
      { text: "I'll let you become a $1.", 1: lesser },
      "On one condition.",
      "My new domain has an entry fee.",
      "You must reach 1e4000 Celestial Points of Eternity.",
      { text: "But for a $1 like you...", 1: destroyer },
      { text: "That shouldn't be a $1.", 1: hardship },
      "So I'll expect to see you soon."
    ]
  },
  divinity: {
    id: 31,
    lines: [
      { text: "Hello there, $1.", 1: destroyer },
      "I expect you are still working on the entry fee.",
      "And in searching the remains of my old Reality, you have found something.",
      { text: "An escape far stronger than $1.", 1: endgame },
      { text: "The $1 and I worked together on that for a good while.", 1: elemental },
      { text: "As part of your $1, you would want to master every power, would you not?", 1: mandate },
      "As long as it helps you with accumulating the designated resource, I will allow it.",
      { text: "Remember, I have no reason to $1 you.", 1: misconstrue },
      { text: "For you would simply $1 time, once again.", 1: reverse },
      "I will not bother you again until you are ready to enter my domain."
    ]
  },
  reachGoal: {
    id: 32,
    lines: [
      "That... took a while.",
      { text: "No offense of course, but I expected you to $1 that challenge.", 1: overpower },
      "But then again, power does take time.",
      "Honestly I was almost convinced you had given up.",
      { text: "But I suppose the great $1 isn't one to give up, are you?", 1: destroyer },
      "I'm remembering a bit more now.",
      { text: "I suppose this is how the $1 feels, huh?", 1: forgotten },
      "He deserved his punishment though.",
      "Did he ever tell you?",
      { text: "Or did the $1 tell you herself?", 1: paramount },
      { text: "So you may ask, if the $1 are innocent, why do we keep them in chains?", 1: usurper },
      { text: "Even the strongest of us have things we are $1 of.", 1: frightened },
      "I have set your next Reality destination to bring you here to us.",
      { text: "I and the $1 will be expecting your arrival.", 1: deities },
      "Oh, and I finally remembered the name I gave to Alpha.",
      { text: "The $1.", 1: weak },
      { text: "$1", 1: confusing },
      "Come as soon as you can."
    ]
  }
};
