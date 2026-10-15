<script>
export default {
  name: "RaPetRemembranceButton",
  props: {
    petConfig: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isUnlocked: false,
      hasRemembrance: false,
    };
  },
  computed: {
    pet() {
      return this.petConfig.pet;
    },
    name() {
      return this.pet.name;
    },
    symbol() {
      return this.pet.symbol;
    },
    petStyle() {
      return {
        color: this.hasRemembrance ? "white" : "#746d81",
        "--border": this.hasRemembrance ? this.pet.color : "#746d81",
        "--bg-dark": this.hasRemembrance ? this.pet.color : "#555",
        "--bg-bright": this.hasRemembrance ? "#170a1e" : "#111",
        "text-shadow": this.hasRemembrance ? `0.1rem 0.1rem 0.3rem ${this.pet.color}, -0.1rem -0.1rem 0.3rem ${this.pet.color}` : "0.1rem 0.1rem 0.3rem black, -0.1rem -0.1rem 0.3rem black",
      };
    }
  },
  methods: {
    update() {
      const pet = this.pet;
      this.isUnlocked = pet.isUnlocked;
      if (!this.isUnlocked) return;
      this.hasRemembrance = pet.hasRemembrance;
    },
    toggleRemembrance() {
      Ra.petWithRemembrance = Ra.petWithRemembrance === this.pet.name ? "" : this.pet.name;
    }
  },
};
</script>

<template>
  <button
    v-if="isUnlocked"
    class="c-ra-pet-remembrance-button"
    :style="petStyle"
    :ach-tooltip="name"
    @click="toggleRemembrance"
  >
  {{ symbol }}
  </button>
</template>
