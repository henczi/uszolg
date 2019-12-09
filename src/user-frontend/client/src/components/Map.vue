<template>
  <GmapMap
    :center="center"
    :zoom="13"
    map-type-id="roadmap"
    :options="{disableDefaultUI:true}"
  >
    <GmapMarker
      :key="index"
      v-for="(m, index) in items"
      :position="m.position"
      :clickable="true"
      :draggable="false"
      :icon="m.icon"
      @click="select(index)"
    />
  </GmapMap>
</template>

<script>
export default {
  name: "Map",
  props: {
    center: Object,
    items: Array
  },
  methods: {
    select(idx) {
      this.$emit("select", idx);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
