<template>
  <v-container fluid class="bg-grey-lighten-4 pa-6">
    <h1 class="text-h2 mt-0">Самые просматриваемые новости</h1>

    <v-row>
      <v-col
        v-for="(item, index) in newsList"
        :key="item.newId"
        :cols="12"
        :sm="index === 0 ? 12 : 6"
        :md="index === 0 ? 12 : 3"
      >
        <MainNews v-if="index === 0" :news="item" />
        <SecondaryNews v-else :news="item" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MainNews from '../components/UI/MainNews.vue';
import SecondaryNews from '../components/UI/SecondaryNews.vue';
import newsData from '../../NarfuNewsData.json';

export default {
  name: 'HomeView',
  components: {
    MainNews,
    SecondaryNews,
  },
  data() {
    return {
      newsList: newsData.NewsArray,
    };
  },
};
</script>
