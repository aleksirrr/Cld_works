<script>
export default {
  name: "VUnlockRequirement",
  props: {
    dbEntry: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      resource: new Decimal(0),
      progress: new Decimal(0),
    };
  },
  computed: {
    barProgressStyle() {
      const color = this.progress.eq(1)
        ? "var(--color-v--base)"
        : "#ead58460";
      return {
        background: color,
        width: `${this.progress.times(100).toNumber()}%`
      };
    },
    textStyle() {
      return {
        color: this.progress.eq(1)
          ? "black"
          : "white",
      };
    },
  },
  methods: {
    update() {
      this.resource.copyFrom(new Decimal(this.dbEntry.resource()));
      this.progress.copyFrom(Decimal.clampMax(this.dbEntry.progress(), 1));
    }
  }
};
</script>

<template>
  <div class="c-v-unlock-category">
    <div 
      v-html="symbol"
      v-tooltip="`${dbEntry.name}<br><i>${formatPercents(progress2,2)}</i>`"
      class="c-v-unlock-resource"
      :class="{'c-v-unlock-resource-available':progress >= 1}"
      :style="{'--color':color}"
    />
  <div
    class="c-v-unlock-bar"
    :style="textStyle"
  >
    <div
      class="c-v-unlock-bar__progress"
      :style="barProgressStyle"
    />
    {{ dbEntry.format(resource) }} / {{ dbEntry.format(dbEntry.requirement) }}
  </div>
</template>
