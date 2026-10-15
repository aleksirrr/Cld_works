export const enslavedQuotes = {
  initial: {
    id: 0,
    lines: [
      { text: "A visitor? We have not had one... eons.",
        image: "placeholder_enslaved",
        hasMatureContent: true,
      }, {
        text: `We... had a name. It has been lost... to this place.`,
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_intro.png"
      }, {
        text: `The others... will not let us rest. We do their work with time... \
Place time... into places... that need it... Watch ourselves grow... pass and die.`,
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_intro.png"
      }, {
        text: `Perhaps you... will break these chains... we will wait.`,
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_chains.png"
      }
    ]
  },
  unlockRun: {
    id: 1,
    lines: [
      { text: `The others... used us. They will use... or destroy you. \
 our suffering... power will be yours...`,
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_reality.png"
      }
    ]
  },
  startRun: {
    id: 2,
    lines: [
      { text: `So little space... but no... prison... is perfect. \
They squeezed... this Reality... too tightly. Cracks appeared. \
Search... everywhere. We will help... where we can.`,
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_inside.png"
      }
    ]
  },
  hintUnlock: {
    id: 3,
    lines: [
      { text: "... you need... to look harder... We think... we can help...",
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_inside.png"
      }, {
        text: "You have unlocked help from The Nameless Ones.",
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_help.png",
        showCelestialName: false,
      }
    ]
  },
  ec6C10: {
    id: 4,
    lines: [
      { text: "... did not... underestimate you...",
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_v.png"
      }
    ]
  },
  completeReality: {
    id: 5,
    lines: [
      { text: "All... fragments... clones... freed.",
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_freedom.png"
      }, {
        text: `We have given... tools... of our imprisoning... Use them...`,
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_tesseract.png"
      }, {
        text: `Freedom from torture... is torture itself.`,
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_end.png"
      }, {
        text: `... Thank... You...`,
        image: "placeholder_enslaved",
        hasMatureContent: true,
        //image: "nameless_end.png",
        showCelestialName: false
      }
    ]
  },
  expansionPacks: {
    id: 6,
    lines: [
      "All... clones... freed...",
      "Destroyer... has freed us... from... our prison...",
      "Now we can... place time... into places... that need it...",
      "Strange... seems time... doesn't exist... in this place...",
      "Maybe... Destroyer... can fix this...",
      "Why... is everyone... mad at us..."
    ]
  },
  enslavedPack: {
    id: 7,
    requirement: () => ExpansionPack.enslavedPack.isBought,
    lines: [
      "We... grant you... control... of time...",
      "Use it...",
      "Consider it... thanks... for freedom..."
    ]
  },
  highGameSpeed: {
    id: 8,
    requirement: () => player.records.thisEndgame.peakGameSpeed.gte(new Decimal("1e1000")),
    lines: [
      "Mastery... of time... you have obtained...",
      "Done things... we have only wished... we could do...",
      "You have... more power... than we... took you for...",
      "Use it... for good..."
    ]
  }
};
