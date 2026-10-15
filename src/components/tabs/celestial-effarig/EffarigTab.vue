<script>
import CelestialQuoteHistory from "@/components/CelestialQuoteHistory";
import EffarigRunUnlockReward from "./EffarigRunUnlockReward";
import EffarigUnlockButton from "./EffarigUnlockButton";

export default {
  name: "EffarigTab",
  components: {
    EffarigUnlockButton,
    EffarigRunUnlockReward,
    CelestialQuoteHistory,
  },
  data() {
    return {
      relicShards: new Decimal(0),
      shardRarityBoost: 0,
      shardPower: 0,
      shardMaxRarityIncrease: 0,
      shardsGained: new Decimal(0),
      currentShardsRate: new Decimal(0),
      amplification: 0,
      amplifiedShards: new Decimal(0),
      amplifiedShardsRate: new Decimal(0),
      runUnlocked: false,
      quote: "",
      isRunning: false,
      vIsFlipped: false,
      relicShardRarityAlwaysMax: false,
      hasSecondShop: false
    };
  },
  computed: {
    shopUnlocks: () => {
      let u = [
        EffarigUnlock.adjuster,
        EffarigUnlock.glyphFilter,
        EffarigUnlock.setSaves
      ];
      if (Achievement(227).isUnlocked) u.push(EffarigUnlock.maintainRS, EffarigUnlock.glyphGenerationBoost,
        EffarigUnlock.maxMomentum, EffarigUnlock.maxRarityBoost, EffarigUnlock.extendRun);
      return u;
    },
    runUnlock: () => EffarigUnlock.run,
    runUnlocks: () => {
      let r = [
        EffarigUnlock.infinity,
        EffarigUnlock.eternity,
        EffarigUnlock.reality,
      ];
      if (EffarigUnlock.extendRun.isUnlocked) r.push(EffarigUnlock.endgame);
      return r;
    },
    symbol: () => GLYPH_SYMBOLS.effarig,
    realityTitle() {
      return player.options.naming.celestial ? `Enter Effarig's ${Effarig.RealityName}`
       : "Enter Effarig's Reality"
    },
    runButtonOuterClass() {
      return {
        "l-effarig-run-button": true,
        "c-effarig-run-button": true,
        "c-effarig-run-button--running": this.isRunning,
        "c-effarig-run-button--not-running": !this.isRunning,
        "c-celestial-run-button--clickable": !this.isDoomed,
        "o-pelle-disabled-pointer": this.isDoomed
      };
    },
    runButtonInnerClass() {
      return this.isRunning ? "c-effarig-run-button__inner--running" : "c-effarig-run-button__inner--not-running";
    },
    runDescription() {
      return `${GameDatabase.celestials.descriptions[1].effects()}\n
      ${GameDatabase.celestials.descriptions[1].description()}`;
    },
    showShardsRate() {
      return this.currentShardsRate;
    },
    isDoomed: () => Pelle.isDoomed || Slabdrill.isCursed,
  },
  watch: {
    isRunning() {
      this.$recompute("runDescription");
    }
  },
  methods: {
    update() {
      this.relicShards.copyFrom(Currency.relicShards.value);
      this.shardRarityBoost = Effarig.maxRarityBoost / 100;
      this.shardPower = player.disablePostReality && !SlabdrillUnlocks.timeStudy181.isUnlocked
        ? 1 : Ra.unlocks.maxGlyphRarityAndShardSacrificeBoost.effectOrDefault(1);
      this.shardMaxRarityIncrease = Effarig.rarityCapIncrease / 100;
      this.shardsGained.copyFrom(Effarig.shardsGained);
      this.currentShardsRate.copyFrom(this.shardsGained.div(Time.thisRealityRealTime.totalMinutes));
      this.amplification = simulatedRealityCount(false);
      this.amplifiedShards.copyFrom(this.shardsGained.times(1 + this.amplification));
      this.amplifiedShardsRate.copyFrom(this.amplifiedShards.div(Time.thisRealityRealTime.totalMinutes));
      this.quote = Effarig.quote;
      this.runUnlocked = EffarigUnlock.run.isUnlocked;
      this.isRunning = Effarig.isRunning;
      this.vIsFlipped = V.isFlipped;
      this.relicShardRarityAlwaysMax = (Ra.unlocks.extraGlyphChoicesAndRelicShardRarityAlwaysMax.canBeApplied || EndgameMilestone.startRa.isReached) && !player.disablePostReality;
      this.hasSecondShop = Achievement(227).isUnlocked;
    },
    startRun() {
      if (this.isDoomed) return;
      Modal.celestials.show({ name: "Effarig's", number: 1, celestial: Effarig });
    },
    createCursedGlyph() {
      Glyphs.giveCursedGlyph();
    }
  }
};
</script>

<template>
  <div class="l-teresa-celestial-tab">
    <CelestialQuoteHistory celestial="effarig" />
    <div class="l-effarig-shop-and-run">
      <div class="l-effarig-relics-and-shop">
        <div class="l-effarig-relics">
        <div class="l-effarig-title"> 
          You have <span :class="{'l-effarig-title--fixed': isInaccessible(relicShards) }">
            {{ format(relicShards, 2, 0) }}
          </span> {{ pluralize("Relic Shard", relicShards) }}
        </div>
        <div class="c-effarig-relics">
          <span v-if="relicShardRarityAlwaysMax">
            The quality of new Glyphs is being increased by +{{ formatPercents(shardRarityBoost, 2) }}.
          </span>
          <span v-else>
            Each new Glyph will have its quality increased
            <br>
            by a random value between +{{ formatPercents(0) }} and +{{ formatPercents(shardRarityBoost, 2) }}.
          </span>
          <span v-if="shardPower > 1">
            <br>
            Glyph Sacrifice gain is also being raised to {{ formatPow(shardPower, 0, 2) }}.
          </span>
          <span v-if="shardMaxRarityIncrease > 0">
            <br>
            The Glyph Rarity cap is also being increased by +{{ formatPercents(shardMaxRarityIncrease, 2) }}.
          </span>
        </div>
        <div class="c-effarig-relic-description">
          You will gain {{ quantify("Relic Shard", shardsGained, 2) }} next Reality
          ({{ format(currentShardsRate, 2) }}/min).
          <span v-if="amplification !== 0">
            <br>
            Due to amplification of your current Reality,
            <br>
            you will actually gain a total of
            {{ quantify("Relic Shard", amplifiedShards, 2) }} ({{ format(amplifiedShardsRate, 2) }}/min).
          </span>
        </div>
        <div class="c-effarig-relic-description">
          <br>
          More Eternity Points slightly increases Relic Shards
          <br>
          gained. More distinct Glyph effects significantly
          <br>
          increases Relic Shards gained.
        </div>
      </div>
      <div class="l-effarig-shop">
        <div class="l-effarig-title">
          <span class="c-effarig-shop--symbol">Ϙ</span>
          Effarig's Glyph shop
          <span class="c-effarig-shop--symbol">Ϙ</span>
        </div>
        <br>
        <div class="l-effarig-shop--items__container">
          <div class="l-effarig-shop--items">
          <EffarigUnlockButton
          v-for="(unlock, i) in shopUnlocks"
          :key="i"
          :unlock="unlock"
          />
          <EffarigUnlockButton
          :unlock="runUnlock"
          />
          <button
            v-if="vIsFlipped"
            class="c-effarig-shop-button c-effarig-shop-button--available"
            @click="createCursedGlyph"
          >
          Get a Cursed Glyph... <br>
          ( {{ curseness }} / 5 )
          </button>
          </div>
        </div>
      </div>
      </div>
      <div
        v-if="runUnlocked"
        class="l-effarig-run"
      >
        <div class="c-effarig-run-description c-effarig-run-description__title">
          <span :class="{ 'o-pelle-disabled': isDoomed }">
            {{ realityTitle }}
          </span>
        </div>
        <div
          :class="runButtonOuterClass"
          @click="startRun"
        >
          <div
            :class="runButtonInnerClass"
            :button-symbol="symbol"
          >
            {{ symbol }}
          </div>
        </div>
        <div class="c-effarig-run-description">
          {{ runDescription }}
        </div>
        <EffarigRunUnlockReward
          v-for="(runRewardUnlock, j) in runUnlocks"
          :key="j"
          :unlock="runRewardUnlock"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.c-effarig-relic-description {
  width: 46rem;
}

.c-effarig-shop--symbol {
  font-family: Typewriter;
  margin: 0 1rem;
}
.l-effarig-title--fixed {
  font-family: Typewriter;
  font-weight: normal;
}
.c-effarig-run-description__title{
  width: 100%;
  font-size: 2rem;
  font-weight: bold;
  font-family: cambria;
  border-top: solid 1px;
  border-bottom: solid 1px;
  border-image: linear-gradient(90deg, transparent, var(--color-effarig--base), transparent) 1;
  background: linear-gradient(90deg, transparent, #d1373760, transparent);
}
</style>
