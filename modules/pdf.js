const exportPDF = {
  exportButton: document.querySelector('.pdf'),

  init() {
    this.exportButton.addEventListener('click', this.createPDF);
  },

  createPDF() {
    const expense = document.getElementById('expenseDisplay').innerText,
      income = document.getElementById('incomeDisplay').innerText,
      total = document.getElementById('totalDisplay').innerText,
      date = new Date(),
      today = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      descriptions = document.querySelectorAll('td.description'),
      values = document.querySelectorAll('td.value'),
      dates = document.querySelectorAll('td.date'),
      doc = new jsPDF();

    //header
    doc.text('dev.finance$', 90, 20);
    doc.text(today, 168, 20);

    //create cards
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(73, 170, 38);
    doc.roundedRect(20, 40, 50, 25, 1, 1, 'FD');

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(255, 0, 0);
    doc.roundedRect(80, 40, 50, 25, 1, 1, 'FD');

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(0, 0, 0);
    doc.roundedRect(140, 40, 50, 25, 1, 1, 'FD');

    doc.setFont('Montserrat', 'bold');

    //set cards text
    doc.setTextColor(73, 170, 38);
    doc.text('Entradas', 25, 50);
    doc.text(income, 25, 59);

    doc.setTextColor(255, 0, 0);
    doc.text('Saídas', 85, 50);
    doc.text(expense, 85, 59);

    doc.setTextColor(0, 0, 0);
    doc.text('Total', 145, 50);
    if (total.indexOf('-') === -1) {
      doc.setTextColor(73, 170, 38);
    } else {
      doc.setTextColor(255, 0, 0);
    }
    doc.text(total, 145, 59);

    //table names
    doc.setTextColor(0, 0, 0);
    doc.text('Descrição', 20, 90);
    doc.text('Valor', 100, 90);
    doc.text('Data', 165, 90);

    doc.setDrawColor(73, 170, 38);
    doc.line(200, 93, 10, 93);

    //set table content/positions
    let sizeX = 20;
    let sizeY = 90;

    doc.setFont('Montserrat', 'normal');

    descriptions.forEach((td) => {
      sizeY += 12;
      doc.text(td.innerText, sizeX, sizeY);
    });

    sizeX = 100;
    sizeY = 90;

    values.forEach((td) => {
      sizeY += 12;
      if (td.classList.contains('expense')) {
        doc.setTextColor(255, 0, 0);
      } else {
        doc.setTextColor(73, 170, 38);
      }
      doc.text(td.innerText, sizeX, sizeY);
    });

    sizeX = 165;
    sizeY = 90;

    doc.setTextColor(0, 0, 0);
    dates.forEach((td) => {
      sizeY += 12;
      doc.text(td.innerText, sizeX, sizeY);
    });

    doc.save(`Dev-Finances-${today}.pdf`);
  },
};

export default exportPDF;
