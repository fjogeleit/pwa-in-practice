<template>
  <v-container fluid>
    <v-row>
      <template v-for="article in articles">
        <v-col :key="article.id">
          <v-card max-width="400" class="fill-height">
            <v-img
              class="white--text align-end"
              height="200px"
              :src="article.thumbnailUrl"
            >
              <v-card-title>{{ article.title }}</v-card-title>
            </v-img>
            <v-card-text>
              {{ article.body }}
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script>
export default {
  subscriptions() {
    return {
      articles: this.$articleService.list()
    };
  },
  created() {
    this.$articleService.fetch();
  }
};
</script>
