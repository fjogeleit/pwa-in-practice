<template>
  <v-container fluid>
    <v-row no-gutters>
      <v-col>
        <v-list v-if="todos.length > 0">
          <template v-for="(todo, index) in todos">
            <v-list-item :key="todo.id">
              <v-list-item-content>
                <strike v-if="todo.completed">{{ todo.title }}</strike>
                <span v-else>{{ todo.title }}</span>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn icon @click="removeTodo(todo)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-list-item-action>
              <v-list-item-action>
                <v-btn icon @click="toggleTodo(todo)">
                  <v-icon color="white">{{ todo.completed ? 'close' : 'check' }}</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="todo.id + '_divider'" v-if="todos.length > (index + 1)" />
          </template>
        </v-list>

        <todo-dialog />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import TodoDialog from "../components/TodoDialog";

export default {
  components: {
    TodoDialog
  },
  methods: {
    toggleTodo(todo) {
      this.$todoService.edit({ ...todo, completed: !todo.completed });
    },
    removeTodo(todo) {
      this.$todoService.remove(todo);
    },
    createTodo() {}
  },
  subscriptions() {
    return {
      todos: this.$todoService.list()
    };
  },
  created() {
    this.$todoService.fetch();
    this.$todoService.syncChanges();
  }
};
</script>
