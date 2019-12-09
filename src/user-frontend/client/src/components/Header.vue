<template>
  <div id="header-el" class="d-flex flex-grow-0 p-3">
    <h4 class="p-0"><i class="fas fa-plug"></i> <i>e</i>-töltőállomás</h4>
    <h5 class="ml-auto p-0" @click="$emit('action', 'feedback')"><i class="fas fa-comment-medical"></i></h5>
  </div>
</template>

<script>
export default {
  name: "Header",
  props: {
    msg: String
  }
};
</script>

<style scoped>
#header-el {
  width: 100%;
  height: 60px;
  background-color: green;
  color: white;
}
</style>
