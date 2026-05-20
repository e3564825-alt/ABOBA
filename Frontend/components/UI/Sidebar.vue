<template>
  <v-navigation-drawer
    permanent
    rail
    rail-width="80"
    color="#003366"
    order="-1"
    class="border-none main-sidebar"
  >
    <v-list density="compact" nav class="pa-0">
      <v-list-item
        v-for="item in railItems"
        :key="item.value"
        :value="item.value"
        class="py-3 justify-center"
      >
        <template v-slot:prepend>
          <div class="icon-wrapper">
            <component :is="item.icon" class="custom-icon" />
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    permanent
    width="300"
    class="border-right"
  >
    <v-list density="compact">
      <v-list-item
        title="Последние новости"
        value="latest"
        to="/"
        color="primary"
      >
        <template v-slot:prepend>
          <div class="icon-wrapper mr-4">
            <component :is="IconHome" class="custom-icon" />
          </div>
        </template>
      </v-list-item>

      <v-list-item
        title="Самые просматриваемые"
        value="popular"
        to="/prosmotr"
        color="primary"
      >
        <template v-slot:prepend>
          <div class="icon-wrapper mr-4">
            <component :is="IconFire" class="custom-icon" />
          </div>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import IconArchive from './icons/IconArchive.vue';
import IconBaseKnowledge from './icons/IconBaseKnowledge.vue';
import IconCalendar from './icons/IconCalendar.vue';
import IconEdo from './icons/IconEdo.vue';
import IconEmployees from './icons/IconEmployees.vue';
import IconFire from './icons/IconFire.vue';
import IconHome from './icons/IconHome.vue';
import IconNews from './icons/IconNews.vue';
import IconPortal from './icons/IconPortal.vue';
import IconServices from './icons/IconServices.vue';

export default {
  name: 'Sidebar',
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      IconHome,
      IconFire,
      railItems: [
        { value: 'portal', icon: IconPortal, name: 'Портфель' },
        { value: 'docs', icon: IconEdo, name: 'Документы' },
        { value: 'calendar', icon: IconCalendar, name: 'Календарь' },
        { value: 'base', icon: IconBaseKnowledge, name: 'Базы знаний' },
        { value: 'archive', icon: IconArchive, name: 'Архив' },
        { value: 'staff', icon: IconEmployees, name: 'Сотрудники' },
        { value: 'news', icon: IconNews, name: 'Новости' },
        { value: 'services', icon: IconServices, name: 'Сервис' },
      ],
    };
  },
};
</script>

<style scoped></style>
