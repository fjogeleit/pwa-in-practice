/* eslint-disable no-unused-vars */
import { BehaviorSubject } from 'rxjs';
import { AxiosInstance } from 'axios';

import Worker from '../worker/article.worker';

class ArticleDatabase {
  /**
   * @param {IDBDatabase} database
   */
  constructor(database) {
    this.database = database;
  }

  list() {
    return this.database
      .getAllFromIndex('articles', 'published')
      .catch(() => []);
  }

  async saveAll(articles) {
    await this.database.clear('articles');
    const tx = this.database.transaction('articles', 'readwrite');

    articles.forEach(article =>
      tx.store.put({ ...article, pubished: new Date(article.pubished) })
    );

    await tx.done;
  }
}

class ArticleService {
  /**
   * @param {ArticleDatabase} database
   * @param {AxiosInstance} http
   */
  constructor(database, http) {
    this.$data = new BehaviorSubject([]);
    this.database = database;
    this.http = http;

    this.refresh();
  }

  list() {
    return this.$data;
  }

  async fetch() {
    try {
      const { data } = await this.http.get('/articles');

      await this.database.saveAll(data);

      return this.refresh();
    } catch (e) {
      console.error(e);
    }
  }

  async refresh() {
    return this.database.list().then(articles => this.$data.next(articles));
  }
}

/**
 * @param {ArticleService} service 
 */
const preloadArticles = (service) => {
  const worker = new Worker();
  let retryCounter = 0;

  worker.postMessage({});
  worker.addEventListener('message', ({ data }) => {
    if (data === 'prepared') {
      service.refresh();
      console.log('article prepertion completed');
      worker.terminate()
      console.log('worker terminated');

      return;
    }

    console.log('preperation failed');

    if (data === 'failed' && retryCounter < 3) {
      retryCounter++;
      
      setTimeout(() => {
        console.warn(`${retryCounter}. Retry started`)
        worker.postMessage({});
      }, 1000);
    }
  });
}

export const ArticleServicePlugin = {
  install(instance, { database, http }) {
    const service = new ArticleService(new ArticleDatabase(database), http);

    instance.mixin({
      beforeCreate() {
        this.$articleService = service;
      }
    });

    preloadArticles(service);
  }
};
