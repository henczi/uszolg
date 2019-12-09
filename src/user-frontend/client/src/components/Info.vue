<template>
  <div id="backdrop" class="pt-3 d-flex flex-column">
    <div id="border" class="w-100 d-flex align-items-center justify-content-around" @click="$emit('close')">
      <div style="width: 80px; border: 1px solid gray"></div>
    </div>
    <div id="content" class="p-3 flex-grow-1 d-block" >
      <h1>Hello</h1>
      <p>Hello</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    selected: Object
  }
};
</script>

<style scoped>
#backdrop {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.15);
}
#border {
  height: 40px;
  background-color: #eee;
  border-radius: 15px 15px 0 0;
}
#content {
  background-color: white;
  text-align: initial;
}
</style>
