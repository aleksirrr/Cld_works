<script>
import AlchemyResourceArc from "./AlchemyResourceArc";
import HintText from "@/components/HintText";

export default {
  name: "AlchemyCircleNode",
  components: {
    HintText,
    AlchemyResourceArc
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    isFocused: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      isReactionActive: false,
      amount: 0,
      percent: 0,
      flow: 0,
      isUnlocked: false,
      wobbly: false,
    };
  },
  computed: {
    resource() {
      return this.node.resource;
    },
    isBaseResource() {
      return this.resource.isBaseResource;
    },
    layoutStyle() {
      const scaledFlow = Math.clamp(0.7 * Math.sqrt(Math.abs(this.flow)), 0, 1);
      return {
        left: `${this.node.x}%`,
        top: `${this.node.y}%`,
        "box-shadow": `0 0 0.5rem 0.65rem
          rgba(${this.flow > 0 ? "156, 204, 101" : "204, 102, 102"}, ${scaledFlow})`
      };
    },
    GlowStyle() {
      const scaledFlow = Math.clamp(0.7 * Math.sqrt(Math.abs(this.flow)), 0, 1);
      return {
        "box-shadow": `0 0 0.5rem 0.25rem
          rgba(${this.flow > 0 ? "156, 204, 101" : "204, 102, 102"}, ${scaledFlow})`
      };
    },
    classObject() {
      return {
        "o-alchemy-node--base": this.isBaseResource,
        "o-alchemy-node--active": this.isReactionActive,
        "o-alchemy-node--unfocused": !this.isFocused,
        "o-alchemy-node--locked": !this.isUnlocked,
        "a-wobble-node": this.wobbly && this.isUnlocked,
      };
    },
    color() {
      return {
        "background": this.color
      };
    },
    hintClassObject() {
      return this.isFocused ? undefined : "o-hint-text--alchemy-node--unfocused";
    }
  },
  methods: {
    update() {
      this.wobbly = player.options.animations.wobbly,
      this.isReactionActive = !Pelle.isDoomed && !this.isBaseResource && this.node.resource.reaction.isActive;
      this.amount = this.resource.amount;
      this.percent = this.resource.amount / this.resource.cap;
      this.flow = this.resource.flow;
      this.isUnlocked = this.resource.isUnlocked;
    }
  }
};
</script>

<template>
  <div
    class="o-alchemy-node"
    :style="layoutStyle"
    :class="classObject"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    @click="emitClick"
  >
    <AlchemyResourceArc
      :resource="resource"
      :class-object="classObject"
      :style="GlowStyle"
    />
    <span v-if="isUnlocked">
      <HintText
        type="alchemy"
        :class="hintClassObject"
        class="o-hint-text--alchemy-node l-hint-text--alchemy-node"
      >
        {{ formatHybridSmall(amount, 3) }}
      </HintText>
    </span>
  </div>
</template>

<style scoped>

</style>
