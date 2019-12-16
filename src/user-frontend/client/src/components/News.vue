<template>
  <div class="news p-3 h-100 d-flex flex-column">
    <div style="color: #64c074" class="flex-grow-0 flex-shrink-0 d-flex justify-content-between align-items-center border-bottom mb-3">
      <div @click="$emit('close')"><i class="fas fa-2x fa-chevron-left"></i></div>
      <h1 class="m-0">News</h1>
    </div>
    <div class="flex-grow-1 w-100 overflow-auto">
      <div class="mb-3" :key="n.id" v-for="n in news">
          <div class="position-relative">
            <img class="position-relative" style="width:100%" :src="'data:image/png;base64,' + n.image" :alt="n.title">
            <div style="top:0; left:0; right:0; background: linear-gradient(0deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.6) 50%);" class="position-absolute text-light p-2">
              <h3>{{n.title}}</h3>
              <p>{{n.message}}</p>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "News",
  data() {
    return {
      news: []
    }
  },
  async created() {
    try {

      const response = (await axios.get('http://localhost:5080/api/usage/proxy?http://52.141.217.11/api/news-user/GetNews?PageSize=10&Page=0&OrderBy=Id')).data;
      if (response) {
        const news = response.results;
        this.news = news;
      }
    } catch { console.log('news :: Error'); }
  }
};
</script>

<style scoped>
.news {
  background-color: white;
}
</style>
