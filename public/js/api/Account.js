/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  /**
   * Получает информацию о счёте
   * */
  static get(id = '', callback){
    const xhr = new XMLHttpRequest();

    xhr.open('GET', this.URL + '/' + id)
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
