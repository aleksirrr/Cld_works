<script>
import { Pelle, Teresa } from '../core/globals';

export default {
  name: "CelestialAnimations",
  data() {
    return {
      isDarkTheme: false,
      celestial: 0,
      showGalaxy:false,
      galaxies:0,
      galgenPhase:0,
      endState:0,
      galDirection:0,
      shake:0,
    };
  },
  computed:{
    classObject() {
      return {
        "c-celestial-reality--teresa": this.celestial === 1,
        "c-celestial-reality--effarig": this.celestial === 2,
        "c-celestial-reality--nameless": this.celestial === 3,
        "c-celestial-reality--v": this.celestial === 4,
        "c-celestial-reality--ra": this.celestial === 5,
        "c-celestial-reality--laitela": this.celestial === 6,
        "c-celestial-reality--pelle": this.celestial === 7,
        "c-celestial-reality--galgen": this.celestial === 8,
      };
    },
    galacticFireStyle(){
      if (this.celestial !== 8) return;
      let speed = [45,40,30,20,15,10]
      let trueSpeed = this.endState > 1 ? 60 : speed[this.galgenPhase]
      let spread = 0 - (Math.log10(this.galaxies) * 10) - (Math.max(Math.log10(this.galaxies)-10,0)*50);
      let ground = 20 - Math.log10(this.galaxies) - (Math.max(Math.log10(this.galaxies)-10,0)*10)
      let opacity = this.isDarkTheme ? 0.5 + Math.min((Math.max(Math.log10(this.galaxies)-10,0)*0.5),1)
      : this.endState > END_STATE_MARKERS.CREDITS_START ? 0.5 : 0.5 + Math.max((this.endState-2.5)/2,0)
      return {
        "--fire-spread":`${spread}vh`,
        "--ground-height":`${ground}%`,
        "animation-duration":`${trueSpeed}s`,
        opacity,
      }
    },
    galaxyStyle(){
      if (this.celestial !== 8) return;
      let scale = Math.clamp(this.endState,1,4)
      let brightness = Math.max((this.endState-END_STATE_MARKERS.FADE_AWAY)*2,1)
      let opacity = Math.min((this.endState-1),1)
      return {
        "transform":`scale(${scale}) rotate(${this.galDirection}deg)`,
        "filter":`brightness(${brightness})`,
        opacity
      }
    },
  },
  methods: {
    celestialState(){
      if (Teresa.isRunning) return 1
      if (Effarig.isRunning) return 2
      if (Enslaved.isRunning) return 3
      if (V.isRunning) return 4
      if (Ra.isRunning) return 5
      if (Laitela.isRunning) return 6
      if (Pelle.isDoomed&&!Pelle.hasGalaxyGenerator) return 7
      if (Pelle.isDoomed&&Pelle.hasGalaxyGenerator) return 8
    },
    update() {
      this.celestial = this.celestialState()
      this.isDarkTheme = Theme.current().isDark();
      this.galaxies = Math.max(GalaxyGenerator.generatedGalaxies,1)
      this.galgenPhase = player.celestials.pelle.galaxyGenerator.phase
      this.endState = GameEnd.endState
      this.showGalaxy = this.endState > 1 && this.endState < END_STATE_MARKERS.CREDITS_START
      const speed = 0.1*Math.max((4**this.endState-1),1)
      this.galDirection = (this.galDirection+speed)%360
    }
  },
}
</script>
<template>
    <div class="c-celestial-reality-container"
    :class="classObject"
    :style="galacticFireStyle">
      <img v-if="showGalaxy" 
      src="../../public/images/celestials/galgen_vortex.webp" 
      class="o-galaxy-bg" 
      :style="galaxyStyle">
    </div>
</template>

<style scoped>

</style>
