<script>
import InfinityUpgradeButton from "@/components/InfinityUpgradeButton";
import IpMultiplierButton from "./IpMultiplierButton";
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "InfinityUpgradesTab",
  components: {
    PrimaryButton,
    InfinityUpgradeButton,
    IpMultiplierButton
  },
  data() {
    return {
      isDoomed: false,
      isUseless: false,
      alwaysRecpec: false,
      chargeUnlocked: false,
      totalCharges: 0,
      chargesUsed: 0,
      disCharge: false,
      ipMultSoftCap: 0,
      ipMultHardCap: 0,
      eternityUnlocked: false,
      bottomRowUnlocked: false,
      styleOfColumnBg: undefined,
      isUncapped: false,
      isSoftcapApplicable: false
    };
  },
  computed: {
    grid() {
      return [
        [
          InfinityUpgrade.dim18mult,
          InfinityUpgrade.dim27mult,
          InfinityUpgrade.dim36mult,
          InfinityUpgrade.dim45mult
        ],
        [
          InfinityUpgrade.buy10Mult,
          InfinityUpgrade.resetBoost,
          InfinityUpgrade.galaxyBoost,
          InfinityUpgrade.dimboostMult
        ],
        [
          InfinityUpgrade.totalTimeMult,
          InfinityUpgrade.thisInfinityTimeMult,
          InfinityUpgrade.unspentIPMult,
          InfinityUpgrade.ipGen
        ],
        [
          InfinityUpgrade.skipReset1,
          InfinityUpgrade.skipReset2,
          InfinityUpgrade.skipReset3,
          InfinityUpgrade.skipResetGalaxy
        ]
      ];
    },
    allColumnUpgrades() {
      return this.grid.flat();
    },
    disChargeClassObject() {
      return {
        "o-primary-btn--subtab-option": true,
        "o-primary-btn--charged-respec-active": this.disCharge ||
          this.alwaysRecpec, // See src/core/celestials/pelle/pelle.js armageddon(...)
        "o-pelle-disabled-pointer": this.alwaysRecpec
      };
    },
    offlineIpUpgrade: () => InfinityUpgrade.ipOffline
  },
  watch: {
    disCharge(newValue) {
      player.celestials.ra.disCharge = newValue;
    }
  },
  created() {
    this.on$(GAME_EVENT.INFINITY_UPGRADE_BOUGHT, () => this.setStyleOfColumnBg());
    this.on$(GAME_EVENT.INFINITY_UPGRADE_CHARGED, () => this.setStyleOfColumnBg());
    this.on$(GAME_EVENT.INFINITY_UPGRADES_DISCHARGED, () => this.setStyleOfColumnBg());

    this.setStyleOfColumnBg();
  },
  methods: {
    update() {
      this.isDoomed = Pelle.isDoomed;
      this.isUseless = Pelle.isDoomed && !PelleCelestialUpgrade.raTeresa2.canBeApplied;
      this.alwaysRecpec = this.isDoomed && Pelle.isAlwaysDischargeCIU;
      this.chargeUnlocked = Ra.unlocks.chargedInfinityUpgrades.canBeApplied && !this.isUseless && !player.disablePostReality;
      this.totalCharges = Ra.totalCharges;
      this.chargesUsed = Ra.totalCharges - Ra.chargesLeft;
      this.disCharge = player.celestials.ra.disCharge;
      this.ipMultSoftCap = InfinityUpgrade.ipMult.costIncreaseThreshold;
      this.ipMultHardCap = InfinityUpgrade.ipMult.costCap;
      this.eternityUnlocked = PlayerProgress.current.isEternityUnlocked;
      this.bottomRowUnlocked = Achievement(41).isUnlocked;
      this.isUncapped = BreakEternityUpgrade.doubleIPUncap.isBought && !player.disablePostReality;
      this.isSoftcapApplicable = !EndgameUpgrade(21).isBought || player.disablePostReality ||
        (player.infinityPoints.gte("e1e125") && !Ascensions.ipA.isUnlocked);
    },
    btnClassObject(column) {
      const classObject = {
        "l-infinity-upgrade-grid__cell": true
      };
      if (column > -1) {
        // Indexing starts from 0, while css classes start from 2 (and first column has default css class)
        classObject[`o-infinity-upgrade-btn--color-${column + 1}`] = true;
      }
      else {
        classObject[`o-infinity-upgrade-btn--multiplier`] = true;
      }
      return classObject;
    },
    ColumnObject(column) {
      return `c-infinity-upgrade-grid__column--background c-infinity-upgrade-grid__column--background--color-${column + 1}`;
    },
    getColumnColor(location) {
      if (location.isCharged) return "var(--color-teresa--base)";
      if (location.isBought) return "var(--column-color)";
      return "transparent";
    },
    setStyleOfColumnBg() {
      this.styleOfColumnBg = this.grid.map(col => ({
        background:
          `linear-gradient(to bottom,
          ${this.getColumnColor(col[0])} 15%,
          ${this.getColumnColor(col[1])} 35% 40%,
          ${this.getColumnColor(col[2])} 60% 65%,
          ${this.getColumnColor(col[3])} 85% 100%`
      }));
    },
  }
};
</script>

<template>
  <div class="l-infinity-upgrades-tab">
    <div
      v-if="chargeUnlocked"
      class="c-subtab-option-container c-subtab-option-container--border c-subtab-option-container--border--infinity"
    >
      <PrimaryButton
        :class="disChargeClassObject"
        @click="disCharge = !disCharge"
      >
        Respec Charged Infinity Upgrades on next {{ isDoomed ? "Armageddon" : "Reality" }}
      </PrimaryButton>
    </div>
    <div v-if="chargeUnlocked">
      You have charged {{ formatInt(chargesUsed) }}/{{ formatInt(totalCharges) }} Infinity Upgrades.
      Charged Infinity Upgrades have their effect altered.
      <br>
      Hold shift to show Charged Infinity Upgrades.
      <span v-if="!isDoomed || !alwaysRecpec"> You can freely respec your choices on Reality.</span>
    </div>
    <div v-if="isUseless">
      You cannot Charge Infinity Upgrades while Doomed.
    </div>
    <div v-if="isDoomed && !isUseless && alwaysRecpec">
      Charged Infinity Upgrades always reset on Armageddon, until you can keep your Break Infinity Upgrades on Armageddon.
    </div>
    <br>
    Within each column, the upgrades must be purchased from top to bottom.
    <br>
    <div class="l-infinity-upgrade-grid l-infinity-upgrades-tab__grid">
      <div
        v-for="(column, columnId) in grid"
        :key="columnId"
        class="c-infinity-upgrade-grid__column"
      >
        <InfinityUpgradeButton
          v-for="upgrade in column"
          :key="upgrade.id"
          :upgrade="upgrade"
          :class="btnClassObject(columnId)"
        />
        <div
          :class="ColumnObject(columnId)"
          :style="styleOfColumnBg[columnId]"
        />
      </div>
    </div>
    <div
      v-if="bottomRowUnlocked"
      class="l-infinity-upgrades-bottom-row"
    >
      <IpMultiplierButton class="l-infinity-upgrades-tab__mult-btn" />
      <InfinityUpgradeButton
        :upgrade="offlineIpUpgrade"
        :class="btnClassObject(-1)"
      />
    </div>
    <div v-if="eternityUnlocked && bottomRowUnlocked && isSoftcapApplicable">
      The Infinity Point multiplier becomes more expensive
      <br>
      above {{ formatPostBreak(ipMultSoftCap, 2, 1) }} Infinity
      Points<span v-if="!isUncapped">, and cannot be purchased past {{ formatPostBreak(ipMultHardCap, 2, 1) }} Infinity Points</span>.
    </div>
  </div>
</template>

<style scoped>
.c-infinity-upgrade-grid__column {
  display: flex;
  overflow: hidden;
  flex-direction: column;
  position: relative;
  border-radius: var(--var-border-radius, 0.3rem);
  margin: 0 0.3rem;
}

.c-infinity-upgrade-grid__column--background {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  box-shadow: 0 0 1rem var(--color-background) inset;
  opacity: 0.7;
}
.t-s14 .c-infinity-upgrade-grid__column--background {
  --color-teresa--base: rgb(182, 182, 182);
}
.s-base--dark .c-infinity-upgrade-grid__column--background {
  opacity: 0.5;
}

.l-infinity-upgrades-bottom-row .l-infinity-upgrade-grid__cell,
.l-infinity-upgrades-bottom-row .l-infinity-upgrades-tab__mult-btn {
  margin: 0.5rem 1.1rem;
}
</style>
