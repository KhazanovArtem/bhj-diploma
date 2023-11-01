/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {  
    Account.list(User.current(), (err, response) => {
      const opt = document.querySelectorAll('option');
      if(opt.length) {
        for (let i = 0; i < opt.length; i++) {
          opt[i].remove();
        }
      }
      const selectincome = document.getElementById('income-accounts-list');
      for (let i = 0; i < response.data.length; i++) {
        const option = document.createElement('option');
        option.setAttribute('value', response.data[i].id);
        option.textContent = response.data[i].name;
        selectincome.appendChild(option);
      }
      const selectexpense = document.getElementById('expense-accounts-list');
      for (let i = 0; i < response.data.length; i++) {
        const option = document.createElement('option');
        option.setAttribute('value', response.data[i].id);
        option.textContent = response.data[i].name;
        selectexpense.appendChild(option);
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        App.getModal('newIncome').close();
        App.getModal('newExpense').close();
        App.getPage('transactions').clear();
        App.update();
      }
      if (err) {
        throw new Error(err);
      }
    });
    this.element.reset();
  }
}