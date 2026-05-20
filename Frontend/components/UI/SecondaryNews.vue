<template>
  <v-card elevation="0" class="secondary-news rounded-0">
    <div class="place-secondary-img secondary-img"></div>
    <v-card-text class="pa-3">
      <div class="text-caption text-grey mb-1">{{ news.newsDate }}</div>
      <div class="text-h4 mb-1 font-weight-bold">
        {{ news.newsTitle }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'SecondaryNews',
  props: {
    news: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.place-secondary-img {
  width: 100%;
  background-color: #bdbdbd;
}
.secondary-img {
  aspect-ratio: 16 / 9;
}
.secondary-news :deep(.v-card__text) {
  padding: 12px;
}
</style>
