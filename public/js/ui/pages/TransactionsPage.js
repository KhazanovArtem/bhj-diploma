/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
      throw new Error ('Передан пустой элемент');
    }
    this.element = element;
    this.registerEvents();
    this.lastOption;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOption) {
      this.render(this.lastOption)
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const remacc = document.querySelector('.remove-account');
    const remtran = document.querySelectorAll('.transaction__remove');
    remacc.onclick = () => {
      this.removeAccount();
    };

    remtran.forEach(item => {
      item.onclick = () => {
        for (let i = 0; i < remtran.length; i++) {
          if (remtran[i].getAttribute('data-id') === item.getAttribute('data-id')) {
            this.removeTransaction(remtran[i].getAttribute('data-id'));
          }
        }
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOption) {
      let question = confirm('Вы действительно хотите удалить счет?');
      if (question) {
        const acc = document.querySelectorAll('.account');      
        for (let i = 0; i < acc.length; i++) {
          if(acc[i].classList.contains('active')) {
            Account.remove({id: acc[i].getAttribute('data-id')}, (err, response) => {
              if (response.success) {
                this.lastOption = 0;
                App.getPage('transactions').clear();
                this.renderTitle('Название счета');
                App.updateWidgets();
                App.updateForms();
              }
              if (err) {
                throw new Error(err);
              }
            })
          }
          }
        }
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    let question = confirm('Вы действительно хотите удалить транзакцию?');
    if (question) {
      const trans = document.querySelectorAll('.transaction__remove');
      for (let i = 0; i < trans.length; i++) {
        if (trans[i].getAttribute('data-id') === id) {
          Transaction.remove({id: trans[i].getAttribute('data-id')}, (err, response) => {
            if (response.success) {
              App.getPage('transactions').clear();
              App.update();
            }
            if (err) {
              throw new Error(err);
            }
          })
        }
      }
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (options) {
      Account.get(options, (err, response) => {
        App.getPage('transactions').renderTitle(response.data.name);
      });
      Transaction.list(options, (err, response) => {
        App.getPage('transactions').renderTransactions(response.data);
      });
      this.lastOption = options;
    }
  }


  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    const acc = document.querySelectorAll('.transaction');
    if(acc.length) {      
      for (let i = 0; i < acc.length; i++) {
        acc[i].remove();
      }
    }
    this.renderTransactions([]);
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){ 
    const title = document.querySelector('.content-title');
    title.textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const formattedDate = new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    return formattedDate;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const transaction = document.createElement('div');
    transaction.classList.add('transaction');
    if (item.type === "income") {
      transaction.classList.add('transaction_income');
    } else {
      transaction.classList.add('transaction_expense');
    }
    transaction.classList.add('row');
    const transaction_det = document.createElement('div');
    transaction_det.classList.add('col-md-7');
    transaction_det.classList.add('transaction__details');
    const icon = document.createElement('div');
    icon.classList.add('transaction__icon');
    const fa = document.createElement('span');
    fa.classList.add('fa');
    fa.classList.add('fa-money');
    fa.classList.add('fa-2x');
    icon.appendChild(fa);
    const info = document.createElement('div');
    info.classList.add('transaction__info');
    const title = document.createElement('h4');
    title.classList.add('transaction__title');
    title.textContent = item.name;
    const date = document.createElement('div');
    date.classList.add('transaction__date');
    date.textContent = this.formatDate(item.created_at);
    info.appendChild(title);
    info.appendChild(date);
    transaction_det.appendChild(icon);
    transaction_det.appendChild(info);

    const col = document.createElement('div');
    col.classList.add('col-md-3');
    const summ = document.createElement('div');
    summ.classList.add('transaction__summ');
    summ.textContent = item.sum;
    const curr = document.createElement('span');
    curr.classList.add('currency');
    curr.textContent = '₽';
    summ.appendChild(curr);
    col.appendChild(summ);
    const control = document.createElement('div');
    control.classList.add('col-md-2');
    control.classList.add('transaction__controls');
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.classList.add('btn-danger');
    btn.classList.add('transaction__remove');
    btn.dataset.id = item.id;
    const i = document.createElement('i');
    i.classList.add('fa');
    i.classList.add('fa-trash');
    btn.appendChild(i);
    control.appendChild(btn);
    transaction.appendChild(transaction_det);
    transaction.appendChild(col);
    transaction.appendChild(control);

    return transaction;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = document.querySelector('.content');
    for (let i in data) {
      content.appendChild(this.getTransactionHTML(data[i]));
    }
    this.registerEvents();
  }
}