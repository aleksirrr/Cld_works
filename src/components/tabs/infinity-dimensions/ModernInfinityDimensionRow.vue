<script>
import FillBar from "@/components/FillBar";
import GenericDimensionRowText from "@/components/GenericDimensionRowText";
import PrimaryButton from "@/components/PrimaryButton";
import PrimaryToggleButton from "@/components/PrimaryToggleButton";

export default {
  name: "ModernInfinityDimensionRow",
  components: {
    FillBar,
    GenericDimensionRowText,
    PrimaryButton,
    PrimaryToggleButton
  },
  props: {
    tier: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      hasPrevTier: false,
      isUnlocked: false,
      canUnlock: false,
      multiplier: new Decimal(0),
      baseAmount: new Decimal(0),
      amount: new Decimal(0),
      purchases: new Decimal(0),
      rateOfChange: new Decimal(0),
      isAutobuyerUnlocked: false,
      cost: new Decimal(0),
      isAvailableForPurchase: false,
      isCapped: false,
      capIP: new Decimal(0),
      isContinuumActive: false,
      continuumValue: new Decimal(0),
      isAutobuyerOn: false,
      isEC8Running: false,
      hardcap: new Decimal(InfinityDimensions.HARDCAP_PURCHASES),
      eternityReached: false,
      enslavedRunning: false,
      isDestabilized:false,
      percentage:0,
    };
  },
  computed: {
    shiftDown() {
      return ui.view.shiftDown;
    },
    name() {
      return player.options.naming.dimensions?
      `Infinity ${InfinityDimension(this.tier).uniqueName}`:
      `${InfinityDimension(this.tier).shortDisplayName} Infinity Dimension`;
    },
    costDisplay() {
      if (this.isUnlocked || this.shiftDown) {
        if (this.isCapped) return "Capped";
        if (this.isContinuumActive) return `Continuum: ${this.continuumString}`;
        return this.showCostTitle ? `Cost: ${format(this.cost)} IP` : `${format(this.cost)} IP`;
      }

      if (this.canUnlock) {
        return "Unlock";
      }

      return `Reach ${formatPostBreak(InfinityDimension(this.tier).amRequirement)} AM`;
    },
    continuumString() {
      return formatHybridFloat(this.continuumValue, 2);
    },
    hasLongText() {
      return this.costDisplay.length > 25;
    },
    capTooltip() {
      if (this.enslavedRunning) return `Nameless prevents the purchase of more than ${format(10)} Infinity Dimensions`;
      if (this.isCapped) return `Cap reached at ${format(this.capIP)} IP`;
      if (this.isContinuumActive) return "Continuum produces all your Infinity Dimensions";
      return `Purchased ${quantifyHybridLarge("time", this.purchases)}`;
    },
    showRow() {
      return this.eternityReached || this.isUnlocked || this.canUnlock || this.amount.gt(0) ||
        this.hasPrevTier;
    },
    showCostTitle() {
      return this.cost.log10().lt(1e5);
    }
  },
  watch: {
    isAutobuyerOn(newValue) {
      Autobuyer.infinityDimension(this.tier).isActive = newValue;
    }
  },
  methods: {
    update() {
      const tier = this.tier;
      const dimension = InfinityDimension(tier);
      this.hasPrevTier = tier === 1 || InfinityDimension(tier - 1).isUnlocked;
      this.isUnlocked = dimension.isUnlocked;
      this.canUnlock = dimension.canUnlock;
      this.multiplier.copyFrom(dimension.multiplier);
      this.baseAmount.copyFrom(dimension.baseAmount);
      this.purchases.copyFrom(dimension.purchases);
      this.amount.copyFrom(dimension.totalAmount);
      this.rateOfChange.copyFrom(dimension.rateOfChange);
      this.isAutobuyerUnlocked = Autobuyer.infinityDimension(tier).isUnlocked;
      this.cost.copyFrom(dimension.cost);
      this.isAvailableForPurchase = dimension.isAvailableForPurchase;
      this.isCapped = dimension.isCapped;
      this.percentage = `${Math.min(100, Math.max(0, new Decimal(dimension.purchases).div(dimension.purchaseCap).times(100).toNumber() || 0))}%`
      if (this.isCapped) {
        this.capIP.copyFrom(dimension.hardcapIPAmount);
        this.hardcap.copyFrom(dimension.purchaseCap);
      }
      this.isContinuumActive = Laitela.continuumActive && !this.isEC8Running && Alpha.currentStage >= 9 && !player.disablePostReality;
      if (this.isContinuumActive) this.continuumValue.copyFrom(dimension.continuumValue);
      this.isEC8Running = EternityChallenge(8).isRunning;
      this.isAutobuyerOn = Autobuyer.infinityDimension(tier).isActive;
      this.eternityReached = PlayerProgress.eternityUnlocked();
      this.enslavedRunning = Enslaved.isRunning;
      if (tier > 8-Laitela.difficultyTier) {
        this.isDestabilized = Laitela.isRunning ? true : false
      }
    },
    buySingleInfinityDimension() {
      if (this.isContinuumActive) return;
      InfinityDimension(this.tier).buySingle();
    },
    buyMaxInfinityDimension() {
      if (this.isContinuumActive) return;
      InfinityDimension(this.tier).buyMax(false);
    },
    buttonClass() {
      return {
        "o-primary-btn--buy-id o-primary-btn o-primary-btn--new o-primary-btn--buy-dim": true,
        "l-dim-row-small-text": this.hasLongText,
        "o-non-clickable o-continuum": this.isContinuumActive
      };
    },
    maxButtonClass() {
      return {
        "o-primary-btn--id-auto": true,
        "o-non-clickable o-continuum": this.isContinuumActive
      };
    }
  }
};
</script>

<template>
  <div
    v-show="showRow"
    class="c-dimension-row l-dimension-row-infinity-dim l-dimension-single-row"
    :class="{ 'c-dim-row--not-reached': !isUnlocked && !canUnlock,'c-dim-row--unstable': isDestabilized }"
  >
    <GenericDimensionRowText
      :tier="tier"
      :name="name"
      :multiplier-text="!isDestabilized?formatX(multiplier, 2, 1) : 'Destabilized'"
      :amount-text="format(amount, 2)"
      :rate="rateOfChange"
    />
    <div class="l-dim-row-multi-button-container c-modern-dim-tooltip-container">
      <div class="c-modern-dim-purchase-count-tooltip">
        {{ capTooltip }}
      </div>
      <PrimaryButton
        :enabled="isAvailableForPurchase || (!isUnlocked && canUnlock)"
        :class="buttonClass()"
        @click="buySingleInfinityDimension"
      >
        <div class="button-content">{{ costDisplay }}</div>
        <div class="o-fill-container" v-if="!isCapped&&tier!==8">
          <FillBar
          class="o-fill-bar--infinity-dim"
          :width="percentage"
          />
        </div>
      </PrimaryButton>
      <PrimaryToggleButton
        v-if="isAutobuyerUnlocked && !isEC8Running"
        v-model="isAutobuyerOn"
        class="o-primary-btn--id-auto"
        label="Auto:"
      />
      <PrimaryButton
        v-else
        :enabled="isAvailableForPurchase"
        :class="maxButtonClass()"
        @click="buyMaxInfinityDimension"
      >
        Buy Max
      </PrimaryButton>
    </div>
  </div>
</template>

<style scoped>
.c-modern-dim-tooltip-container .c-modern-dim-purchase-count-tooltip {
  position: absolute;
  width: 20rem;
  top: 50%;
  font-size: 1.3rem;
  line-height: 1.6rem;
  color: white;
  background: black;
  border: 0.1rem solid var(--color-text);
  border-radius: var(--var-border-width, 0.5rem);
  /* Buttons are 40rem wide, tooltip is 20rem */
  transform: translate(calc(-175% - 1rem), -50%);
  padding: 0.5rem;
  visibility: hidden;
}

.o-non-clickable {
  cursor: auto;
}

.o-continuum {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--accent);
  background: var(--color-laitela--base);
}

.o-continuum:hover {
  border-color: var(--color-laitela--accent);
  color: var(--color-laitela--base);
  background: var(--color-laitela--accent);
}
</style>
