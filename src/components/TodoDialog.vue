<template>
  <v-dialog v-model="open" max-width="500">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" color="grey darken-1" dark fixed bottom right fab>
        <v-icon small>add</v-icon>
      </v-btn>
    </template>
    <v-card>
        <v-card-title>
          <h2>Create new ToDo</h2>
        </v-card-title>
      <v-card-text>
        <v-text-field v-model="text" />
      </v-card-text>
      <v-card-actions>
        <v-btn @click="close" text>cancel</v-btn>
        <v-spacer />
        <v-btn @click="create" :disabled="!text || text.length === 0" text>
          save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TodoDialog",
  data: () => ({
    open: false,
    text: ''
  }),
  methods: {
    close() {
      this.open = false;
      this.text = '';
    },
    create() {
      this.$todoService.create(this.text);
      this.open = false;
      this.text = '';
    }
  }
};
</script>
