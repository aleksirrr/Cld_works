<script>
import { firebaseConfig } from '../../../core/storage/firebase-config';

export default {
  name: "AlchemyResourceArc",
  props: {
    resource: {
      type: Object,
      required: true
    },
    classObject: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      amount: 0,
      fillFraction: 0,
      color:undefined,
      isReactionActive: false,
    };
  },
  computed: {
    isBaseResource() {
      return this.resource.isBaseResource;
    },
    spinnerTransform() {
      return {
        transform: `rotate(${this.fillFraction * 360}deg)`,
        background: this.fillFraction === 1 ? "url(./images/glyphs-alchemy/alchemy-arc_cap.png)" : undefined,
        animation: this.fillFraction === 1 ? "a-ac-flow2 10s infinite,a-ac 10s infinite linear" : undefined
      };
    },
    fillerTransform() {
      return {
        opacity: this.fillFraction > 0.5 ? 1 : 0,
        background: this.fillFraction === 1 ? "url(./images/glyphs-alchemy/alchemy-arc_cap.png)" : undefined,
        animation: this.fillFraction === 1 ? "a-ac-flow2 10s infinite,a-ac 10s infinite linear" : undefined
      };
    },
    maskTransform() {
      return {
        opacity: this.fillFraction > 0.5 ? 0 : 1
      };
    },
    //colorStyle(){
    //  return {
    //    background: this.isColorful && (this.isBaseResource || this.isReactionActive) ? `radial-gradient(at top,white -50%,${this.color},black)` : undefined,
    //    color: this.isColorful && (this.isBaseResource || this.isReactionActive) ? "white" : undefined
    //  };
    //}
  },
  methods: {
    update() {
      this.isReactionActive = !Pelle.isDoomed && !this.isBaseResource && this.resource.reaction.isActive;
      this.amount = this.resource.amount;
      this.color = this.resource._config.color;
      this.fillFraction = this.resource.fillFraction;
    }
  }
};
</script>

<template>
  <div class="o-alchemy-resource-arc-wrapper">
    <div
      class="o-alchemy-resource-arc-spinner o-alchemy-resource-arc-circle"
      :style="spinnerTransform"
    />
    <div
      class="o-alchemy-resource-arc-filler o-alchemy-resource-arc-circle"
      :style="fillerTransform"
    />
    <div
      class="o-alchemy-resource-arc-mask"
      :style="maskTransform"
    />
    <div
      class="o-alchemy-node-mask"
      :class="classObject"
    >
      {{ resource.symbol }}
    </div>
  </div>
</template>

<style scoped>

</style>
