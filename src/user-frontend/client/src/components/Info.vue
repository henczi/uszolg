<template>
  <div id="backdrop" class="pt-5 d-flex flex-column">
    <div
      id="border"
      class="w-100 d-flex align-items-center justify-content-around flex-grow-0 flex-shrink-0"
      @click="$emit('close')"
    >
      <div style="width: 80px; border: 1px solid gray"></div>
    </div>
    <div id="content" class="p-3 flex-grow-1 d-block overflow-auto">
      <template v-if="selected">
        <h3>{{selected.name}}</h3>
        <p>
          <strong>Stations:</strong>
          {{selected.stations}}
        </p>
        <p>
          <strong>Kilowatts:</strong>
          {{selected.kilowatts}}
        </p>
        <p>
          <strong>Connectors:</strong>
          {{selected.connector}}
        </p>
      </template>
      <template v-if="companyInfo">
        <h5>{{companyInfo.name}}</h5>
        <p><strong>Cím: </strong>{{companyInfo.address}}</p>
        <p>{{companyInfo.description}}</p>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Info",
  props: {
    selected: Object,
  },
  data() {
    return {
      companyInfo: null
    }
  },
  watch: {
    async selected(newVal, oldVal) {
        console.log(newVal, oldVal)

      if (oldVal !== newVal && newVal && newVal.company) {
      console.log('alma', oldVal !== newVal , newVal , newVal.company)
        this.companyInfo = (await axios.get("/api/company/find", {
          params: { name: newVal.company }
        })).data;
        console.log(this.companyInfo)
      }
    }
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
