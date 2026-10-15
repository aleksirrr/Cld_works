<script>
export default {
   name: "FillBar",
   props: {
    width: {
      type: String,
      required: true
    }
    },
   data() {
    return {

    };
   },
   methods: {

   }
}
</script>

<template>
    <div class="o-fill-bar" :style="{width}"/>
</template>

<style scoped>

</style>