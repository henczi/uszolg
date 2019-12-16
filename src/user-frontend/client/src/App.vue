<template>
  <div id="app" class="d-flex flex-column">
    <Header class="flex-grow-0" style="height: 55px;" @action="headerAction" />
    <div class="flex-grow-1 w-100 position-relative overflow-hidden">
      <Map class="position-absolute w-100 h-100" :markers="markers" :center="currPos" @select="select" />
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
      <News id="news-box" class="position-absolute w-100 h-100" v-bind:class="{ active: newsVisible }" @close="closeNews()" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Map from "./components/Map.vue";
import Header from "./components/Header.vue";
import Info from "./components/Info.vue";
import Feedback from "./components/Feedback.vue";
import News from "./components/News.vue";

import locImg from './assets/loc.png';
import unknownImg from './assets/unknown.png';
import freeImg from './assets/free.png';
import busyImg from './assets/busy.png';

export default {
  name: "app",
  components: {
    Header,
    Map,
    Info,
    Feedback,
    News
  },
  data() { 
    return {
      infoVisible: false,
      feedbackVisible: false,
      newsVisible: false,
      selected: null,
      markers: [],
      markersKeyMap: {},
      currPos: {lat:47.4979, lng:19.0402}
    };
  },
  methods: {
    closeInfo() {
      this.infoVisible = false;
    },
    openInfo() {
      this.closeFeedback();
      this.closeNews();
      this.infoVisible = true;
    },
    closeFeedback() {
      this.feedbackVisible = false;
    },
    openFeedback() {
      this.closeInfo();
      this.closeNews();
      this.feedbackVisible = true;
    },
    closeNews() {
      this.newsVisible = false;
    },
    openNews() {
      this.closeInfo();
      this.closeFeedback();
      this.newsVisible = true;
    },
    headerAction(action) {
      switch(action) {
        case 'feedback': this.feedbackVisible ? this.closeFeedback() : this.openFeedback(); break;
        case 'news': this.newsVisible ? this.closeNews() : this.openNews(); break;
      }
    },
    select(idx) {
      this.selected = this.markers[idx];
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
    },

    async getUsages(keys) {
      const usages = (await axios.get('/api/usage/state', { params: { keys: keys.toString() }})).data;

      keys.forEach(key => {
        const isInUse = usages[key];
        this.markersKeyMap[key].icon = (isInUse === undefined ? unknownImg : (isInUse ? busyImg : freeImg));
      });

      setTimeout(() => this.getUsages(keys), 5000);
    }
  },
  async created() {
    const {lon, lat} = await this.getCoord();
    this.currPos = { lat: lat, lng: lon };

    // get POI markers
    const res = (await axios.get('/api/poi/nearby', { params: { lon, lat, dist: 5 }})).data;
    const markers = res.map(x => ({
      position: { lat: x.lat, lng: x.lon },
      icon: unknownImg,
      ...x
    }));

    // key based marker mapping
    const keyMap = {};
    markers.forEach(x => x.key && (keyMap[x.key] = x));
    this.markersKeyMap = keyMap;


    this.markers = [
      ...markers,
      { position: this.currPos, icon: locImg }, // location marker
    ]

    // start polling usages
    setTimeout(() => this.getUsages(Object.keys(keyMap)));
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

#news-box {
  left: -100%;
  transition: all 0.2s;
}

#news-box.active {
  left: 0;
}
</style>
