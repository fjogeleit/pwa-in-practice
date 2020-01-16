/* eslint-disable no-unused-vars */
import { BehaviorSubject } from 'rxjs';
import { AxiosInstance } from 'axios';
import uuid from 'uuid/v4';

class TodoDatabase {
  /**
   * @param {IDBDatabase} database
   */
  constructor(database) {
    this.database = database;
  }

  list() {
    return this.database.getAllFromIndex('todos', 'created').catch(() => []);
  }

  findByPersistence(persistence) {
    return this.database
      .getAllFromIndex('todos_edit', 'persistence', persistence)
      .catch(() => []);
  }

  async saveAll(todos) {
    await this.database.clear('todos');
    const tx = this.database.transaction('todos', 'readwrite');

    todos.forEach(todo => tx.store.put({ ...todo, created: new Date(todo.created) }));

    await tx.done;
  }

  async create(todo) {
    this.database.put('todos_edit', { ...todo, persistence: 'created' });
    return this.database.put('todos', todo);
  }

  async edit(todo) {
    this.database.put('todos_edit', { ...todo, persistence: 'changed' });
    return this.database.put('todos', todo);
  }

  async remove(todo) {
    this.database.put('todos_edit', { ...todo, persistence: 'removed' });
    return this.database.delete('todos', todo.id);
  }

  async deleteFromQueue(todo) {
    await this.database.delete('todos_edit', todo.id);
  }
}

class TodoService {
  syncTimer;

  /**
   * @param {TodoDatabase} database
   * @param {AxiosInstance} http
   */
  constructor(database, http) {
    this.$data = new BehaviorSubject([]);
    this.database = database;
    this.http = http;

    this.database.list().then(todos => this.$data.next(todos));
  }

  list() {
    return this.$data;
  }

  async create(title) {
    await this.database.create({ id: uuid(), title, completed: false, created: new Date() });

    return this.database.list().then(todos => this.$data.next(todos));
  }

  async edit(todo) {
    await this.database.edit(todo);

    return this.database.list().then(todos => this.$data.next(todos));
  }

  async remove(todo) {
    await this.database.remove(todo);

    return this.database.list().then(todos => this.$data.next(todos));
  }

  async fetch() {
    try {
      const { data } = await this.http.get('/todos');

      await this.database.saveAll(data);

      return this.database.list().then(todos => this.$data.next(todos));
    } catch (e) {
      console.error(e);
    }
  }

  async syncChanges() {
    this.syncTimer = setInterval(() => {
      this.database.findByPersistence('created').then(async todos => {
        todos.map(async ({ persistence, ... todo }) => {
          try {
            await this.http.post('/todos', todo);
            await this.database.deleteFromQueue(todo);
          } catch (e) {
            console.warn(e);
          }
        });
      });

      this.database.findByPersistence('changed').then(async todos => {
        todos.map(async ({ persistence, ... todo }) => {
          try {
            await this.http.patch(`/todos/${todo.id}`, todo);
            await this.database.deleteFromQueue(todo);
          } catch (e) {
            console.warn(e);
          }
        });
      });

      this.database.findByPersistence('removed').then(async todos => {
        todos.map(async todo => {
          try {
            await this.http.delete(`/todos/${todo.id}`);
            await this.database.deleteFromQueue(todo);
          } catch (e) {
            if (e.response.status) {
              return this.database.deleteFromQueue(todo);
            }

            console.warn(e);
          }
        });
      });
    }, 2000);
  }
}

export const TodoServicePlugin = {
  install(instance, { database, http }) {
    const service = new TodoService(new TodoDatabase(database), http);

    instance.mixin({
      beforeCreate() {
        this.$todoService = service;
      }
    });
  }
};
