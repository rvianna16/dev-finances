const Storage = {
  setStorage() {
    localStorage.setItem(
      'dev.finances: transactions',
      JSON.stringify(Transaction.transactions)
    );
  },

  getStorage() {
    return JSON.parse(localStorage.getItem('dev.finances: transactions')) || [];
  },
};

const Transaction = {
  tableContainer: document.querySelector('.transactions__table tbody'),
  transactions: Storage.getStorage(),

  addEditEvent() {
    const editBtns = document.querySelectorAll('.edit');
    editBtns.forEach((editBtn, index) => {
      editBtn.addEventListener('click', () => {
        Form.editValues(index);
      });
    });
  },

  addRemoveEvent() {
    const removeBtns = document.querySelectorAll('.minus');
    removeBtns.forEach((removeBtn, index) => {
      removeBtn.addEventListener('click', () => {
        this.remove(index);
      });
    });
  },

  incomes() {
    let incomes = 0;

    this.transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        incomes += transaction.amount;
      }
    });

    return incomes;
  },

  expenses() {
    let expenses = 0;

    this.transactions.forEach((transaction) => {
      if (transaction.amount < 0) {
        expenses += transaction.amount;
      }
    });

    return expenses;
  },

  total() {
    return this.incomes() + this.expenses();
  },

  updateCard() {
    const card = document.querySelector('.card.total');

    if (this.total() < 0) {
      card.classList.add('negative');
    } else {
      card.classList.remove('negative');
    }
  },

  updateBalance() {
    document.getElementById('incomeDisplay').innerHTML = this.formatCurrency(
      this.incomes()
    );
    document.getElementById('expenseDisplay').innerHTML = this.formatCurrency(
      this.expenses()
    );

    document.getElementById('totalDisplay').innerHTML = this.formatCurrency(
      this.total()
    );

    this.updateCard();
  },

  appendTransaction(html) {
    const tr = document.createElement('tr');
    tr.innerHTML = html;
    this.tableContainer.appendChild(tr);
  },

  editTransaction(index) {},

  addTransaction() {
    this.transactions.forEach((transaction, index) => {
      const cssClass = transaction.amount > 0 ? 'income' : 'expense';
      const amount = this.formatCurrency(transaction.amount);

      const html = `    
      <td class="description">${transaction.description}</td>
      <td class="value ${cssClass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td class="edit"><i class="fas fa-edit"></i></td>
      <td class="minus"><i class="fas fa-minus-circle"></i></td>    
      
    `;
      this.appendTransaction(html);
    });
  },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : '';

    value = String(value).replace(/\D/g, '');
    value = Number(value) / 100;
    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return signal + value;
  },

  edit(index, transaction) {
    this.transactions.splice(index, 1, transaction);
    this.reload();
  },

  remove(index) {
    this.transactions.splice(index, 1);
    this.reload();
  },

  add(transaction) {
    this.transactions.push(transaction);
    this.reload();
  },

  clearTransactions() {
    this.tableContainer.innerHTML = '';
  },

  reload() {
    this.clearTransactions();
    this.init();
  },

  init() {
    this.addTransaction();
    this.updateBalance();
    this.addRemoveEvent();
    this.addEditEvent();

    Storage.setStorage();
  },
};

const Form = {
  modal: document.getElementById('modal-overlay'),
  form: document.getElementById('transactionForm'),
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  setDefaultModal() {
    const openBtns = document.querySelectorAll('.btn-new');
    openBtns.forEach((openBtn) => {
      openBtn.addEventListener('click', () => {
        this.reload();
        this.form.dataset.index = 'add';
        this.modal.querySelector('h2').innerText = 'Nova transação';
      });
    });
  },

  setDefaultDate() {
    this.date.value = new Date().toISOString().slice(0, 10);
  },

  clearFields() {
    this.description.value = '';
    this.amount.value = '';
    this.date.value = '';
  },

  get values() {
    return {
      description: this.description.value,
      amount: this.amount.value,
      date: this.date.value,
    };
  },

  validateFields() {
    const { description, amount, date } = this.values;

    if (
      description.trim() === '' ||
      amount.trim() === '' ||
      date.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos');
    } else if (description.length > 24) {
      throw new Error('Descrição está muito longa');
    } else if (amount > 100000000 || amount < -100000000) {
      throw new Error('Valor inválido, digite um valor sem exageros.');
    }
  },

  editValues(index) {
    this.modal.classList.add('active');
    this.form.dataset.index = index;
    this.modal.querySelector('h2').innerText = 'Editar transação';

    const transaction = Transaction.transactions[index];

    this.description.value = transaction.description;
    this.amount.value = transaction.amount / 100;

    const splittedEditDate = transaction.date.split('/');
    const editDate = `${splittedEditDate[2]}-${splittedEditDate[1]}-${splittedEditDate[0]}`;

    this.date.value = editDate;
  },

  formatValues() {
    let { description, amount, date } = this.values;

    //amount
    amount = Number(amount) * 100;

    //date
    const splittedDate = date.split('-');
    date = `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;

    return {
      description,
      amount,
      date,
    };
  },

  submit() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (this.form.dataset.index === 'add') {
        try {
          this.validateFields();

          Transaction.add(this.formatValues());

          this.modal.classList.remove('active');
        } catch (error) {
          alert(error.message);
        }
      } else {
        try {
          this.validateFields();

          Transaction.edit(+this.form.dataset.index, this.formatValues());

          this.modal.classList.remove('active');
        } catch (error) {
          console.log(this.formatValues());
          alert(error.message);
        }
      }
    });
  },

  reload() {
    this.clearFields();
    this.setDefaultDate();
  },

  init() {
    this.setDefaultModal();
    this.submit();
  },
};

export { Transaction, Form };
