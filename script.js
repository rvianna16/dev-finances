import DarkMode from './modules/darkmode.js';
import Modal from './modules/modal.js';
import exportPDF from './modules/pdf.js';
import { Transaction, Form } from './modules/transaction.js';

const modal = new Modal('modal-overlay', '.btn-new', 'close-modal');

const App = {
  init() {
    Transaction.init();
    DarkMode.init();
    exportPDF.init();
    modal.init();
    Form.init();
  },
};

App.init();
