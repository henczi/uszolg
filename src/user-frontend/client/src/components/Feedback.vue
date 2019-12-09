<template>
  <div class="feedback p-3">
    <h1>Feedback</h1>
    <div class="row mb-3">
      <div class="col-12">
        <b-form-input v-model="name" placeholder="Enter your name"></b-form-input>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12">
        <b-form-textarea
          id="textarea"
          v-model="description"
          placeholder="Enter something..."
          rows="5"
        ></b-form-textarea>
      </div>
    </div>
    <div class="row mb-3">
      <div class="col-12 d-flex justify-content-between">
        <b-button @click="close()">Cancel</b-button>
        <b-button variant="success" @click="send()">Send</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Feedback",
  data() {
    return {
      name: "",
      description: ""
    };
  },
  props: {
    selected: Object
  },
  methods: {
    close() {
      this.name = "";
      this.description = "";
      this.$emit('close');
    },
    async send() {
      await axios.post('/api/feedback/send', { name: this.name, description: this.description });
      this.close();
    }
  }
};
</script>

<style scoped>
.feedback {
  background-color: white;
}
</style>
