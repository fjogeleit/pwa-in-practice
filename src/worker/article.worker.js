import http from '../plugins/axios';
import { initDB } from '../services/database';

const init = async () => {
  const database = await initDB();

  try {
    const { data } = await http.get('/articles');

    await database.clear('articles');
    
    const tx = database.transaction('articles', 'readwrite');

    data.forEach(article => tx.store.put({ ...article, pubished: new Date(article.pubished) }));

    await tx.done;

    self.postMessage('prepared');
  } catch (_) {
    self.postMessage('failed');
  }
};

self.addEventListener('message', init, false);
