/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if (!element) {
      throw new Error ('Передан пустой элемент');
    }
    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const create = document.querySelector('.create-account');
    create.addEventListener('click', () => {
      App.getModal('createAccount').open();
    })

    const accounts = document.querySelectorAll('.account');
    accounts.forEach(item => {
      item.addEventListener('click', () => {
        this.onSelectAccount(item);
      })
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list({}, (err,response) => {
        App.getWidget('accounts').clear();
        App.getWidget('accounts').renderItem(response.data);
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const acc = document.querySelectorAll('.account');
    if(acc.length) {      
      for (let i = 0; i < acc.length; i++) {
        acc[i].remove();
      }
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    const acc = Array.from(document.querySelectorAll('.account'));
    for (let i in acc) {
      acc[i].classList.remove('active');
    }
    element.classList.add('active');
    App.getPage('transactions').clear();
    App.showPage( 'transactions', { account_id: element.getAttribute('data-id')})
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    const acc = document.createElement('li');
    acc.classList.add('account');
    acc.dataset.id = item.id;
    const link = document.createElement('a');
    link.setAttribute('href', '#');
    const name = document.createElement('span');
    name.textContent = item.name + ' / ';
    const sum = document.createElement('span');
    sum.textContent = item.sum + ' ₽';
    link.appendChild(name);
    link.appendChild(sum);
    acc.appendChild(link);
    return acc;

  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    for ( let i in data) {
      this.element.appendChild(this.getAccountHTML(data[i]));
    }
    this.registerEvents();
  }
}
