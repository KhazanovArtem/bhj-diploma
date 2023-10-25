/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (err, response) => {
      if (response.success) {
        App.getModal('createAccount').close();
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