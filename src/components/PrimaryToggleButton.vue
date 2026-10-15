<script>
import PrimaryButton from "@/components/PrimaryButton";

export default {
  name: "PrimaryToggleButton",
  components: {
    PrimaryButton
  },
  props: {
    label: {
      type: String,
      required: false,
      default: ""
    },
    on: {
      type: String,
      required: false,
      default: "ON"
    },
    off: {
      type: String,
      required: false,
      default: "OFF"
    },
    value: {
      type: Boolean,
      required: true
    },
  },
  computed: {
    displayText() {
      return `${this.label} ${this.value ? this.on : this.off}`.trim();
    }
  },
  methods:{
    createSound(){
      AudioManagement.playSound(this.value ?"click_light-reverse":"click_light")
    }
  }
};
</script>

<template>
  <PrimaryButton
    v-bind="$attrs"
    @click="emitInput(!value);createSound()"
  >
    {{ displayText }}
  </PrimaryButton>
</template>

