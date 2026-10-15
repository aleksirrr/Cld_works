<script>
import wordShift from "@/core/word-shift";

import PelleUpgrade from "./PelleUpgrade";

export default {
  name: "GalaxyGeneratorPanel",
  components: {
    PelleUpgrade
  },
  data() {
    return {
      isUnlocked: false,
      isDilated: false,
      isFinalized: false,
      galaxies: new Decimal(0),
      generatedGalaxies: new Decimal(0),
      galaxiesPerSecond: new Decimal(0),
      cap: 0,
      isCapped: false,
      capRift: null,
      sacrificeActive: false,
      isCollapsed: false,
      barWidth: 0,
      capRiftName: "",
      galGenInstability: 0,
      harshGalGenInstability: 0,
      effectiveInstability: new Decimal(0),
      instabilityStart: new Decimal(0),
      harshInstabilityStart: new Decimal(0),
      generationReduction: new Decimal(0),
      trueGenerationReduction: new Decimal(0),
      isInstabilityShown: false,
      isSecondInstabilityShown: false,
    };
  },
  computed: {
    collapseIcon() {
      return this.isCollapsed
        ? "fas fa-expand-arrows-alt"
        : "fas fa-compress-arrows-alt";
    },
    upgrades() {
      if (!EndgameMilestone.fasterGalaxies.isReached || player.disablePostReality) return GalaxyGeneratorUpgrades.all.filter(u => u.id !== "galaxyGeneratorRSMult" && u.id !== "galaxyGeneratorDTMult" && u.id !== "galaxyGeneratorRemnantPow" && u.id !== "galaxyGeneratorExponential" && u.id !== "galaxyGeneratorSuperExponential");
      if (!DivinityMilestone.firstDivine.isReached || player.disablePostReality) return GalaxyGeneratorUpgrades.all.filter(u => u.id !== "galaxyGeneratorDTMult" && u.id !== "galaxyGeneratorRemnantPow" && u.id !== "galaxyGeneratorExponential" && u.id !== "galaxyGeneratorSuperExponential");
      if (!DivinityMilestone.divineDimensions.isReached || player.disablePostReality) return GalaxyGeneratorUpgrades.all.filter(u => u.id !== "galaxyGeneratorRemnantPow" && u.id !== "galaxyGeneratorExponential" && u.id !== "galaxyGeneratorSuperExponential");
      if (!DivinityMilestone.celestialSurge.isReached || player.disablePostReality) return GalaxyGeneratorUpgrades.all.filter(u => u.id !== "galaxyGeneratorExponential" && u.id !== "galaxyGeneratorSuperExponential");
      if (!Accelerators.cosmic._milestones[1].isUnlocked || player.disablePostReality) return GalaxyGeneratorUpgrades.all.filter(u => u.id !== "galaxyGeneratorSuperExponential");
      return GalaxyGeneratorUpgrades.all;
    },
    galaxyText() {
      let text = format(Decimal.max(this.galaxies, 0), 2);
      if (this.galaxies.lt(0)) text += ` [${format(this.galaxies, 2)}]`;
      return text;
    },
    sacrificeText() {
      return this.capRift.galaxyGeneratorText.replace("$value", this.capRiftName);
    },
    emphasisedStart() {
      return Decimal.pow(this.generatedGalaxies.div(this.cap), 0.45).toNumber();
    }
  },
  methods: {
    update() {
      this.isUnlocked = Pelle.hasGalaxyGenerator;
      this.isDilated = player.dilation.active;
      this.isFinalized = PelleStrikes.dilation.isDestroyed();
      this.isCapped = GalaxyGenerator.isCapped;
      this.isCollapsed = player.celestials.pelle.collapsed.galaxies && !this.isCapped;
      if (this.isCollapsed || !this.isUnlocked) return;
      this.galaxies.copyFrom(player.galaxies.add(GalaxyGenerator.galaxies));
      this.generatedGalaxies.copyFrom(GalaxyGenerator.generatedGalaxies);
      this.galaxiesPerSecond.copyFrom(GalaxyGenerator.gainPerSecond);
      this.cap = GalaxyGenerator.generationCap;
      this.capRift = GalaxyGenerator.capRift;
      this.sacrificeActive = GalaxyGenerator.sacrificeActive;
      this.barWidth = (this.isCapped ? this.capRift.reducedTo : this.emphasisedStart);
      if (this.capRift) this.capRiftName = wordShift.wordCycle(this.capRift.name);
      this.galGenInstability = GalaxyGenerator.galGenInstability;
      this.harshGalGenInstability = GalaxyGenerator.harshGalGenInstability;
      this.effectiveInstability.copyFrom(Decimal.pow(this.galGenInstability, this.harshGalGenInstability));
      this.instabilityStart.copyFrom(GalaxyGenerator.instabilityStart);
      this.harshInstabilityStart.copyFrom(GalaxyGenerator.harshInstabilityStart);
      this.generationReduction.copyFrom(Decimal.max(1, Decimal.pow(this.galGenInstability, Decimal.log10(Decimal.max(Decimal.pow(this.galaxies.div(this.instabilityStart), 0.75), 1)))));
      this.trueGenerationReduction.copyFrom(Decimal.max(1, Decimal.pow(Decimal.pow(this.galGenInstability, this.harshGalGenInstability), Decimal.log10(Decimal.max(Decimal.pow(this.galaxies.div(this.instabilityStart), 0.75), 1)))));
      this.isInstabilityShown = PlayerProgress.endgameUnlocked() || this.galaxies.gte(this.instabilityStart);
      this.isSecondInstabilityShown = this.galaxies.gte(this.harshInstabilityStart);
    },
    increaseCap() {
      if (GalaxyGenerator.isCapped) GalaxyGenerator.startSacrifice();
    },
    toggleCollapse() {
      player.celestials.pelle.collapsed.galaxies = !this.isCollapsed;
    },
    unlock() {
      player.celestials.pelle.galaxyGenerator.unlocked = true;
      player.options.animations.celreality = true;
      Pelle.quotes.galaxyGeneratorUnlock.show();
      if (player.endgames >= 1) Pelle.quotes.galgen2.show();
    }
  },
};
</script>

<template>
  <div class="l-pelle-panel-container c-galgen-panel-container">
    <div class="c-pelle-panel-title">
      <i
        v-if="!isCapped"
        :class="collapseIcon"
        class="c-collapse-icon-clickable"
        @click="toggleCollapse"
      />
      Galaxy Generator
    </div>
    <div
      v-if="!isCollapsed"
      class="l-pelle-content-container"
    >
      <div v-if="isUnlocked">
        <div>
          You have a total of
          <span class="c-galaxies-amount" :class="{'c-galaxies--fixed': isInaccessible(Math.max(galaxies, 0)) }">{{ galaxyText }}</span>
          Galaxies.
          <span class="c-galaxies-amount">+{{ format(galaxiesPerSecond, 2, 1) }}/s</span>
          <div v-if="isInstabilityShown">
            Your Galaxy Generator Instability Magnitude is
            <span class="c-galaxies-amount">{{ format(galGenInstability, 2, 1) }}</span>,
            which is dividing Galaxies above {{ format(instabilityStart, 2, 1) }} by
            <span class="c-galaxies-amount">{{ format(generationReduction, 2, 1) }}</span>.
          </div>
          <br>
          <div v-if="isSecondInstabilityShown">
            <span class="c-danger-text">
              Your Galaxy Generator has produced too many Galaxies, and is starting to break down.
              This started at {{ format(harshInstabilityStart, 2, 1) }} Galaxies.
              <br>
              This effect is currently raising your Galaxy Generator Instability Magnitude by
              <span class="c-galaxies-amount">{{ formatPow(harshGalGenInstability, 2, 3) }}</span>,
              making it effectively equal to
              <span class="c-galaxies-amount">{{ format(effectiveInstability, 2, 1) }}</span>.
              <br>
              Therefore, whereas your Galaxy production would normally be divided by the number above,
              it is instead being divided by
              <span class="c-galaxies-amount">{{ format(trueGenerationReduction, 2, 1) }}</span>.
            </span>
          </div>
        </div>
        <div>
          <button
            class="c-increase-cap"
            :class="{
              'c-increase-cap-available': isCapped && capRift && !sacrificeActive,
              'c-increase-cap-active': sacrificeActive,
              'tutorial--glow': cap === Infinity,
              'c-increase-cap-ascended': cap === Infinity
            }"
            @click="increaseCap"
          >
            <div
              class="c-increase-cap-background"
              :style="{ 'width': `${barWidth * 100}%` }"
            />
            <div
              v-if="isCapped && capRift"
              class="c-increase-cap-text"
            >
            <div class="c-sac-text">{{ sacrificeText }}.</div>
              <span
                v-if="!sacrificeActive"
                class="c-big-text"
              >
                Sacrifice your 
                <span style="font-family:Typewriter;font-size:2.5rem">{{ capRiftName }}</span>
              </span>
              <span
                v-else
                class="c-big-text"
              >
              Getting rid of all that 
              <span style="font-family:Typewriter;font-size:2.5rem">{{ capRiftName }}</span>
              ...
              </span>
            </div>
            <div
              v-else
              class="c-increase-cap-text c-medium-text"
            >
            <span :class="{'c-galaxies--fixed': isInaccessible(generatedGalaxies) }">{{ formatInt(generatedGalaxies) }}</span>
            <span v-if="cap !== Infinity" :class="{'c-galaxies--fixed': isInaccessible(cap) }"> / {{ formatInt(cap) }}</span><br> 
            <div class="c-small-text">Galaxies generated</div>
            </div>
          </button>
        </div>
        <div class="l-galaxy-generator-upgrades-container">
          <PelleUpgrade
            v-for="upgrade in upgrades"
            :key="upgrade.config.id"
            :upgrade="upgrade"
            :galaxy-generator="true"
          />
        </div>
      </div>
      <button
        v-if="(isDilated || isFinalized) && !isUnlocked"
        class="c-generator-unlock-button"
        @click="unlock"
      >
        Unlock the Galaxy Generator
      </button>
      <button
        v-if="!isDilated && !isFinalized"
        class="c-generator-locked-button"
      >
        You must be inside Dilation to unlock the Galaxy Generator
      </button>
    </div>
  </div>
</template>

<style scoped>
.c-galgen-panel-container{
  border: var(--var-border-width, 0.1rem) solid var(--color-pelle--secondary);
  box-shadow: var(--var-box-shadow, 0 0 2rem black inset, 0 0 0 0.3rem var(--color-pelle--secondary) inset);
  background: url(../../../../public/images/upgrades/pelle.png),linear-gradient(#000000, var(--color-pelle--secondary) 200%);
}
.c-galgen-panel-container .l-pelle-content-container{
  color:white
}
.c-galgen-panel-container .c-pelle-panel-title{
  color: var(--color-pelle--secondary);
}
.c-collapse-icon-clickable {
  position: absolute;
  top: 50%;
  right: 1.5rem;
  width: 3rem;
  align-content: center;
  transform: translateY(-50%);
  cursor: pointer;
}

.c-generator-unlock-button {
  width: 50rem;
  height: 10rem;
  font-family: Typewriter;
  font-size: 2rem;
  color: rgb(255, 255, 255);
  background: url(../../../../public/images/prestige/galgen-unlock.png),url(../../../../public/images/prestige/galgen-unlock-2.png),url(../../../../public/images/background/galgen-unlock.png);
  border-radius: var(--var-border-radius, 0.5rem);
  box-shadow: 0 -.3rem 1rem var(--color-pelle--secondary),0 .3rem 1rem var(--color-pelle--base);
  border: 1px solid;
  border-image: linear-gradient(var(--color-pelle--secondary),var(--color-pelle--base)) 1;
  padding: 2rem;
  cursor: pointer;
  transition: 0.2s;
  animation:a-galgenunlock 5s infinite linear;
}
.c-generator-unlock-button:hover {
  color: rgb(255, 255, 255);
  text-shadow: 1px 1px 0px var(--color-pelle--secondary),-1px -1px 0px var(--color-pelle--base);
  box-shadow: 0 0 2rem var(--color-pelle--secondary),0 0 2rem var(--color-pelle--base),0 -.3rem 1rem inset var(--color-pelle--secondary),0 .3rem 1rem inset var(--color-pelle--base);
  border: 1px solid white;
}
@keyframes a-galgenunlock{
  0%{background-position: 0 0, 0 0, 0 0;}
  100%{background-position: 256px 256px, -256px -256px,0 0;}
}

.c-generator-locked-button {
  width: 25rem;
  height: 10rem;
  font-family: Typewriter;
  font-size: 1.5rem;
  font-weight: bold;
  color: black;
  background: #5f5f5f;
  border-radius: var(--var-border-radius, 0.5rem);
  padding: 2rem;
  cursor: pointer;
}

.l-galaxy-generator-upgrades-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.c-galaxies-amount {
  font-size: 2.8rem;
  color:white;
  font-family: cambria;
  font-weight: bold;
  line-height: 1.1;
  text-shadow: 0.15rem 0.15rem 0.3rem var(--color-pelle--base),-0.15rem -0.15rem 0.3rem var(--color-pelle--secondary);
}

.highlight {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-pelle--base);
}

.c-increase-cap {
  overflow: hidden;
  width: 100%;
  height: 8.5rem;
  max-width: 90rem;
  position: relative;
  font-family: Typewriter;
  font-size: 1.1rem;
  color: white;
  text-shadow: var(--var-text-shadow, 0 0 0.5rem black,0 0 0.5rem black,0 0 0.5rem black);
  background: url(../../../../public/images/background/galgen-bar.jpg);
  border: var(--var-border-width, 0.1rem) solid var(--color-pelle--base);
  border-radius: var(--var-border-radius, 0.5rem);
  /* box-shadow is here to prevent a weird grey border forming around the background */
  box-shadow: inset 0 0 0.1rem 0.1rem var(--color-pelle--base),inset 0 0 1rem 0.1rem var(--color-pelle--secondary);
  margin: 1rem;
  padding: 1rem;
  animation:a-galgenbar 15s infinite linear;
  transition: all 0.2s, background 1s;
}
.c-increase-cap-active{
  background: url(../../../../public/images/background/galgen-ascended.jpg);
}
.c-increase-cap-ascended {
  border-color:gold;
  animation:a-galgenbar-fade 5s infinite linear, a-galgenbar 5s infinite linear;
  box-shadow: inset 0 0 0.1rem 0.1rem gold,inset 0 0 2rem 0.1rem gold,0 0 1rem gold;
}
@keyframes a-galgenbar{
  0%{background-position-x: 0}
  100%{background-position-x: -448px}
}
@keyframes a-galgenbar-fade{
  0%{  background: url(../../../../public/images/background/galgen-bar.jpg);}
  25%{  background: url(../../../../public/images/background/galgen-ascended.jpg);}
  50%{  background: url(../../../../public/images/background/galgen-cap.jpg);}
  75%{  background: url(../../../../public/images/background/galgen-ascended.jpg);}
  100%{  background: url(../../../../public/images/background/galgen-bar.jpg);}
}
.s-base--dark .c-increase-cap {
  background-color: #004b55;
}

.c-increase-cap:hover {
  box-shadow: inset 0 0 0.1rem 0.1rem var(--color-pelle--base),inset 0 0 1rem 0.1rem var(--color-pelle--secondary), 0.1rem 0.1rem 0.5rem var(--color-pelle--base);
}
.c-increase-cap-ascended:hover {
  box-shadow: inset 0 0 0.1rem 0.1rem gold,inset 0 0 3rem 0.1rem gold, 0 0 2rem gold;
}
.c-increase-cap-available {
  cursor: pointer;
}

.c-increase-cap-text {
  position: relative;
  z-index: 1;
}

.c-increase-cap-background {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  box-shadow: 0 0 2rem var(--color-pelle--base) inset,.5rem 0 1rem var(--color-pelle--base);
  background: url(../../../../public/images/background/galgen-cap.jpg);
  transition: width 0.1s;
  animation:a-galgencap 10s infinite linear;
}
@keyframes a-galgencap{
  0%{background-position-x: 0}
  100%{background-position-x: 448px}
}
.c-big-text {
  font-size: 2.8rem;
  font-family: cambria;
  font-weight: bold;
  line-height: 1.1;
  text-shadow: var(--var-text-shadow, 0.2rem 0.2rem 0.2rem var(--color-pelle--base),-0.2rem -0.2rem 0.2rem var(--color-pelle--base));
}

.c-medium-text {
  font-size: 2.5rem;
  font-family: cambria;
  font-weight: bold;
  line-height: 1.1;
}
.c-small-text {
  font-size: 2rem;
}
.c-sac-text{
  border-bottom: 1px solid;
  margin:0.2rem;
  padding:0.2rem;
  border-image: linear-gradient(90deg, transparent, white, transparent) 1;
}

.c-galaxies--fixed {
  font-family: Typewriter;
  font-weight: normal;
}

.c-danger-text {
  font-weight: bold;
  color: var(--color-pelle--base);
  text-shadow: 0.2rem 0.2rem 0.2rem black;
}
</style>
