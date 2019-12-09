<template>
  <div id="app" class="d-flex flex-column">
    <Header class="flex-grow-0" style="height: 55px;" @action="headerAction" />
    <div class="flex-grow-1 w-100 position-relative overflow-hidden">
      <Map class="position-absolute w-100 h-100" :items="items" :center="currPos" @select="select" />
      <Info
        id="info-box"
        class="position-absolute w-100 h-100"
        v-bind:class="{ active: infoVisible }"
        :selected="selected"
        @close="closeInfo()"
      />
      <Feedback
        id="feedback-box"
        class="position-absolute w-100 h-100"
        v-bind:class="{ active: feedbackVisible }"
        @close="closeFeedback()"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Map from "./components/Map.vue";
import Header from "./components/Header.vue";
import Info from "./components/Info.vue";
import Feedback from "./components/Feedback.vue";

export default {
  name: "app",
  components: {
    Header,
    Map,
    Info,
    Feedback
  },
  data() { 
    return {
      infoVisible: false,
      feedbackVisible: false,
      selected: null,
      items: [],
      currPos: {lat:47.4979, lng:19.0402}
    };
  },
  methods: {
    closeInfo() {
      this.infoVisible = false;
    },
    openInfo() {
      this.closeFeedback();
      this.infoVisible = true;
    },
    closeFeedback() {
      this.feedbackVisible = false;
    },
    openFeedback() {
      this.closeInfo();
      this.feedbackVisible = true;
    },
    headerAction(action) {
      switch(action) {
        case 'feedback': this.openFeedback(); break;
      }
    },
    select(idx) {
      this.selected = this.items[idx];
      this.openInfo();
    },

    getCoord() {
      return new Promise(r => {
        let lon = 47.4979, lat = 19.0402;

        navigator.geolocation.getCurrentPosition((position) => {
          lon = position.coords.longitude;
          lat = position.coords.latitude;
          r({lon, lat});
        }, () => r({lon, lat}));
      })
    }
  },
  async created() {
    const {lon, lat} = await this.getCoord();
    this.currPos = { lat: lat, lng: lon };
    const res = (await axios.get('/api/poi/nearby', { params: { lon, lat, dist: 5 }})).data;
    this.items = [
      { position: this.currPos, icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/info-i_maps.png'  }, 
      ...res.map(x => ({
        position: { lat: x.lat, lng: x.lon },
        ...x
      }))
    ]
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
#info-box {
  top: 100%;
  transition: all 0.2s;
}

#info-box.active {
  top: 0;
}

#feedback-box {
  top: -100%;
  transition: all 0.2s;
}

#feedback-box.active {
  top: 0;
}
</style>
