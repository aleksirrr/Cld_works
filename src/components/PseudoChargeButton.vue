<script>
export default {
    name: "PseudoChargeButton",
    props: {
    upgrade: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
        chargePossible: false,
        isCharged: false
    };
  },
  computed: {
    classObject() {
    return {
        "l-charger-button": true,
        "o-charger-button--chargeable": !this.isCharged && this.chargePossible,
        "o-charger-button--charged": this.isCharged,
            };
        },
    symbol(){
      return this.isCharged ? "Ϟ":"∞"
    }
  },
  methods: {
    update() {
        const upgrade = this.upgrade;
        this.chargePossible = upgrade.canCharge;
        this.isCharged = upgrade.isCharged;
    }
  }
};
</script>

<template>
    <button
    :class="classObject"
    @click="upgrade.purchase()"
    >{{symbol}}
    </button>
</template>
  
  <style scoped>
  
  </style>