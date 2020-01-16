/* eslint-disable no-case-declarations */
/* eslint-disable no-fallthrough */
import { openDB } from 'idb';

export const initDB = () => {
  return openDB('pwa-in-practice', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const todoStore = db.createObjectStore('todos', {
          keyPath: 'id'
        });

        todoStore.createIndex('created', 'created', {
          unique: false
        });

        const todoEditStore = db.createObjectStore('todos_edit', {
          keyPath: 'id'
        });

        todoEditStore.createIndex('persistence', 'persistence', {
          unique: false
        });

        const articleStore = db.createObjectStore('articles', {
          keyPath: 'id'
        });

        articleStore.createIndex('published', 'published', {
          unique: false
        });
      }
    }
  });
};

export const IndexedDBPlugin = {
  install(instance, { database }) {
    instance.prototype.$database = database;
    instance.database = database;
  }
};
