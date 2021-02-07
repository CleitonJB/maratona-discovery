const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("transactions")) || [];
  },

  set(transaction) {
    localStorage.setItem("transactions", JSON.stringify(transaction));
  }
}

// Functions - Transaction
const Transaction = {

  all: Storage.get(),

  add(transaction) {
    Transaction.all.push(transaction);

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let value = 0;

    Transaction.all.forEach(transaction => {
      value += transaction.amount > 0 ? transaction.amount : 0; 
    });

    return String(value);
  },

  expenses() {
    let value = 0;

    Transaction.all.forEach(transaction => {
      value -= transaction.amount < 0 ? transaction.amount : 0;
    });

    return String(value);
  },

  total() {
    return Transaction.incomes() - Transaction.expenses();
  }
}

// Set Initial Data into table
const DOM = {
  transactionContainer: document.querySelector("tbody#data-table"),

  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionContainer.appendChild(tr);
  },

  innerHTMLTransaction(transaction, index) {

    const cssClass = transaction.amount > 0 ? 'positive-value' : 'negative-value';

    const amount = Utils.formatCurrency(transaction.amount);

    const html = `
      <td>${transaction.description}</td>
      <td class="${cssClass}">${amount}</td>
      <td>${transaction.date}</td>
      <td>
        <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação (minus)">
      </td>
    `;

    return html;
  },

  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML  = Utils.formatCurrency(Transaction.incomes());
    document.getElementById("expenseDisplay").innerHTML = Utils.formatCurrency(-Transaction.expenses());
    document.getElementById("totalDisplay").innerHTML   = Utils.formatCurrency(Transaction.total());
  },

  clearTransactions() {
    DOM.transactionContainer.innerHTML = "";
  }
}

// Global Functions 
const Utils = {
  //* Convert to format: R$ 000,00
  formatCurrency(amount) {
    const signal = Number(amount) > 0 ? "+" : "-";

    value = String(amount).replace(/\D/g, + "");
    value = Number(value / 100);
    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    });

    value = value.replace("R$", "R$ " + signal);

    return value;
  },

  formatAmount(amount) {
    amount = Number(amount.replace(/\,\./g, "")) * 100;

    return amount;
  },

  formatDate(date) {
    const splitDate = date.split("-");

    return `${splitDate[2]}/${splitDate[1]}/${splitDate[0]}`;
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount:      document.querySelector('input#amount'),
  date:        document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount:      Form.amount.value,
      date:        Form.date.value
    }
  },

  validadeFields() {

    const { description, amount, date } = Form.getValues();

    if(description.trim() === "" || amount.trim() === "" || date.trim() === "") {
      throw new Error("Por favor, todos os campos devem ser preenchidos!");
    }
  },

  formatFields() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    date = Utils.formatDate(date);

    return {
      description,
      amount,
      date
    }
  },

  saveTransaction(newTransaction) {
    Transaction.add(newTransaction);
  },

  clearFields() {
    Form.description.value = ""
    Form.amount.value      = ""
    Form.date.value        = ""
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validadeFields();

      const newTransaction = Form.formatFields();

      Form.saveTransaction(newTransaction);

      Form.clearFields();

      Modal.close();
    } catch (error) {
      alert(error.message);
    }
  }
}

const App = {
  init() {
    //* Add initial transactions into HTML
    Transaction.all.forEach(DOM.addTransaction); 

    // Calculate values of incomes, expenses and total
    DOM.updateBalance();

    Storage.set(Transaction.all);
  },

  reload() {
    DOM.clearTransactions();
    App.init();
  }
}

App.init();