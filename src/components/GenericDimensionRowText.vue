<script>
export default {
  name: "GenericDimensionRowText",
  props: {
    tier: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    multiplierText: {
      type: String,
      required: true
    },
    amountText: {
      type: String,
      required: true
    },
    rate: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      isSmall: 0,
      isCursedCore: false
    };
  },
  computed: {
    rateText() {
      return this.rate.neq(0)
        ? (this.rate.gte(900) ? ` (+${format(this.rate.div(100).add(1).log10(), 2, 2)} OoMs/s)` : ` (+${format(this.rate, 2, 2)}%/s)`)
        : "";
    },
    showPercentage() {
      return player.options.showHintText.showPercentage || ui.view.shiftDown;
    },

  },
  methods: {
    update() {
      // Needs to be reactive or else rows that don't have changing values (eg. the highest dimension and any higher
      // locked ones) won't change layout when the window size changes
      this.isSmall = window.innerWidth < 1573;
      this.isCursedCore = player.celestials.slabdrill.core.isActive;
    },
    adjustableTextClass() {
      return {
        "l-narrow-box": this.isSmall && !this.isCursedCore,
        "l-wide-box": !this.isSmall && !this.isCursedCore,
        "l-cursed-box": this.isCursedCore
      };
    },
    dimensionClass() {
      return {
        "l-dimension-text-container": !this.isCursedCore,
        "l-cursed-dimension-text-container": this.isCursedCore
      };
    }
  }
};
</script>

<template>
  <div :class="dimensionClass()">
    <div :class="adjustableTextClass()">
      <span class="c-dim-row__large c-dim-row__title">
        {{ name }}
      </span>
      <span
        v-if="!isCursedCore"
        class="c-dim-row__small"
      >
        {{ multiplierText }}
      </span>
    </div>
    <div
      v-if="isCursedCore"
      :class="adjustableTextClass()"
    >
      <span class="c-dim-row__small">
        {{ multiplierText }}
      </span>
    </div>
    <div :class="adjustableTextClass()">
      <span class="c-dim-row__large">
        {{ amountText }}
      </span>
      <span
        v-if="rate.neq(0) && showPercentage"
        class="c-dim-row__small"
      >
        {{ rateText }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.l-dimension-text-container {
  display: flex;
  height: 3.5rem;
  align-content: center;
  grid-column: 1 / 5;
}

.l-cursed-dimension-text-container {
  display: flex;
  height: 3.5rem;
  width: 100%;
}

.l-narrow-box {
  display: flex;
  text-align: left;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}

.l-wide-box {
  display: flex;
  text-align: left;
  width: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.l-cursed-box {
  display: flex;
  text-align: center;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
}

.c-dim-row__large {
  text-align: left;
  margin-right: 1rem;
}
.c-dim-row__small {
  font-size: 1.2rem;
  margin-right: 1rem;
  font-style: italic;
  text-shadow: var(--var-text-shadow, 
  0.1rem 0.1rem 0.2rem var(--border),
  -0.1rem 0.1rem 0.2rem var(--color-text-inverted),
  0.1rem -0.1rem 0.2rem var(--color-text-inverted),
  -0.1rem -0.1rem 0.2rem var(--border));
}
.c-dim-row--unstable .c-dim-row__large,
.c-dim-row--unstable .c-dim-row__small {
  color:var(--color-laitela--base);
  font-weight: bold;
  text-shadow: 0.1rem 0.1rem 0.2rem var(--color-laitela--accent),-0.1rem 0.1rem 0.2rem var(--color-laitela--accent),0.1rem -0.1rem 0.2rem var(--color-laitela--accent),-0.1rem -0.1rem 0.2rem var(--color-laitela--accent);
}
.c-dim-row__title{
  font-size:1.9rem;
  font-family: cambria;
  font-weight:bold
}
</style>
