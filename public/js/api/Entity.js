/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {

  static URL = '';
  /**
   * Запрашивает с сервера список данных.
   * Это могут быть счета или доходы/расходы
   * (в зависимости от того, что наследуется от Entity)
   * */
  static list(data, callback){
    const xhr = new XMLHttpRequest();

    xhr.open('GET', this.URL + '?mail=' + data.mail + '&password=' + data.password)
    xhr.responseType = 'json';
    xhr.send();

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState == xhr.DONE) {
          const res = xhr.response;
          callback(res.error, res.user);
        }
    })
  }

  /**
   * Создаёт счёт или доход/расход с помощью запроса
   * на сервер. (в зависимости от того,
   * что наследуется от Entity)
   * */
  static create(data, callback) {
    const xhr = new XMLHttpRequest();

    xhr.open('PUT', this.URL + '?mail=' + data.mail)
    xhr.responseType = 'json';
    xhr.send();

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState == xhr.DONE) {
          const res = xhr.response;
          callback(res.error, res.user);
        }
    })
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе
   * (в зависимости от того, что наследуется от Entity)
   * */
  static remove(data, callback ) {
    const xhr = new XMLHttpRequest();

    xhr.open('DELETE', this.URL + '?mail=' + data.mail)
    xhr.responseType = 'json';
    xhr.send();

    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState == xhr.DONE) {
          const res = xhr.response;
          callback(res.error, res.user);
        }
    })
  }
}
