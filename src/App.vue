<template>
  <v-app id="inspire">
    <v-app-bar app clipped-left>
      <v-toolbar-title>PWA</v-toolbar-title>
      <v-spacer />

      <v-btn text :to="{ name: 'todos' }" class="mr-3" exact>
        Todos
      </v-btn>
      <v-btn text :to="{ name: 'articles' }">
        Articles
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>

    <v-footer app>
      <span>&copy; 2020</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'App'
};
</script>
