<script>
import LoadGameEntry from "@/components/modals/LoadGameEntry";
import ModalWrapperOptions from "@/components/modals/options/ModalWrapperOptions";

export default {
  name: "LoadGameModal",
  components: {
    ModalWrapperOptions,
    LoadGameEntry
  }
};
</script>

<template>
  <ModalWrapperOptions class="l-wrapper">
    <template #header>
      Save Selection
    </template>
    <div class="c-entry-container">
    <LoadGameEntry
      v-for="id in 5"
      :key="id"
      :save-id="id - 1"
      class="c-entry-border o-descriptionBlock"
    />      
    </div>
  </ModalWrapperOptions>
</template>

<style scoped>
.l-wrapper{
  width:60rem
}
.c-entry-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}
.c-entry-border {
  width: 28rem;
  border-radius: var(--var-border-radius, 0.4rem);
  padding: 0.5rem 0.3rem;
  margin: 0.3rem;
}

</style>
