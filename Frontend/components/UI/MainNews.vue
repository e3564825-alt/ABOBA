<template>
  <v-card class="mb-8 main-news rounded-0" elevation="0">
    <v-row no-gutters>
      <v-col cols="12" sm="6" md="5">
        <div class="placemain-img main-img"></div>
      </v-col>
      <v-col cols="12" sm="6" md="7">
        <v-card-text class="pa-4 pa-sm-6">
          <div class="text-caption text-grey mb-2">{{ news.newsDate }}</div>
          <div class="text-h4 mt-0 font-weight-bold">
            {{ news.newsTitle }}
          </div>

          <div class="text-body-1 mb-4">{{ news.newsDescription }}</div>
          <v-btn color="primary" variant="flat" size="large"
            >Читать далее</v-btn
          >
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  name: 'MainNews',
  props: {
    news: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.placemain-img {
  width: 100%;
  background-color: #bdbdbd;
}
.main-img {
  aspect-ratio: 16 / 9;
}
.main-news {
  background-color: #ffffff;
}
</style>
