<script>
import BackgroundAnimations from "@/components/BackgroundAnimations";
import ClassicUi from "@/components/ui-modes/classic/ClassicUi";
import GameUiComponentFixed from "@/components/GameUiComponentFixed";
import ModernUi from "@/components/ui-modes/modern/ModernUi";
import TabComponents from "@/components/tabs";

import S12DesktopIcons from "@/components/ui-modes/s12/DesktopIcons";
import S12Ui from "@/components/ui-modes/s12/S12Ui";
import S12UiFixed from "@/components/ui-modes/s12/S12UiFixed";

export default {
  name: "GameUIComponent",
  components: {
    ...TabComponents,
    ClassicUi,
    ModernUi,
    GameUiComponentFixed,
    BackgroundAnimations,
    S12Ui,
    S12UiFixed,
    S12DesktopIcons,
  },
  data(){
    return {
      inCursedCore: false,
      transform:5,
      width:"12.8rem",
      fade:1,
      sidebarSideSwitch:false
    }
  },
  computed: {
    view() {
      return this.$viewModel;
    },
    isThemeS12() {
      return this.view.theme === "S12";
    },
    uiLayout() {
      if (this.isThemeS12) return "S12Ui";
      return this.view.newUI ? "ModernUi" : "ClassicUi";
    },
    containerClass() {
      return this.view.newUI ? "new-ui" : "old-ui";
    },
    page() {
      const subtab = Tabs.current[this.$viewModel.subtab];
      return subtab.config.component;
    },
    themeCss() {
      return `stylesheets/theme-${this.view.theme}.css`;
    },
    gameUI() {
      return {
        "c-game-ui": true,
        "c-game-ui-default": !this.inCursedCore
      };
    }
  },
  methods: {
    update() {
      this.inCursedCore = player.celestials.slabdrill.core.isActive;
      this.sidebarSideSwitch = Theme.currentName() !== "S12" && player.options.sidebarSideSwitch && ui.newUI;
      const end = GameEnd.endState;
      const fading = end > 1 && end < END_STATE_MARKERS.CREDITS_START;
      this.width = Theme.currentName() === "S12"
        ? 0
        : `${player.options.sidebarWidth * Math.clamp(fading ? 1 - (end - 2) : 1, 0, 1)}rem`;
      this.fade = fading ? Math.clamp(1 - (end - 3), 0, 1) : 1;
    }
  }
};
</script>

<template>
  <div
    v-if="view.initialized"
    id="ui-container"
    :class="containerClass"
    :style="{'--sidebar-width':width,'width':sidebarSideSwitch?'calc(100% - var(--sidebar-width))':undefined}"
    class="ui-wrapper"
  >
    <div
      id="ui"
      :class="gameUI"
    >
      <component :is="uiLayout">
        <component
          :is="page"
          class="c-game-tab"
          :style="{'opacity':fade}"
        />
      </component>
      <S12DesktopIcons v-if="isThemeS12" />
      <link
        v-if="view.theme !== 'Normal'"
        type="text/css"
        rel="stylesheet"
        :href="themeCss"
      >
    </div>
    <GameUiComponentFixed v-if="!isThemeS12" />
    <BackgroundAnimations v-if="!isThemeS12" />
    <S12UiFixed v-if="isThemeS12" />
  </div>
</template>

<style scoped>
.ui-wrapper {
  display: flex;
  position: relative;
  justify-content: center;
}

.c-game-ui-default {
  position: relative;
}
</style>
