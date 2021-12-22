import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs'
import { parse } from 'csv-parse/sync';

const SAMPLE_FILENAME = 'Student_Time_Sheet_Fillable.pdf';
const CSV_FILE = 'test.csv';

const uint8Array = fs.readFileSync(SAMPLE_FILENAME);
const pdfDoc = await PDFDocument.load(uint8Array);


const table = {
  1: { // section
    1: { Date: "DateRow1", In: "InRow1",  Out: "ClassTutorRow1", Item: "OutRow1", "Total Hours": "Total HoursRow1"},
    2: { Date: "DateRow2", In: "InRow2",  Out: "ClassTutorRow2", Item: "OutRow2", "Total Hours": "Total HoursRow2"},
    3: { Date: "DateRow3", In: "InRow3",  Out: "ClassTutorRow3", Item: "OutRow3", "Total Hours": "Total HoursRow3"},
    4: { Date: "DateRow4", In: "InRow4",  Out: "ClassTutorRow4", Item: "OutRow4", "Total Hours": "Total HoursRow4"},
    5: { Date: "DateRow5", In: "InRow5",  Out: "ClassTutorRow5", Item: "OutRow5", "Total Hours": "Total HoursRow5"},
    6: { Date: "DateRow6", In: "InRow6",  Out: "ClassTutorRow6", Item: "OutRow6", "Total Hours": "Total HoursRow6"},
    7: { Date: "DateRow7", In: "InRow7",  Out: "ClassTutorRow7", Item: "OutRow7", "Total Hours": "Total HoursRow7"},
  },
  2: { // section
    1: { Date: "DateRow1_2", In: "InRow1_3",  Out: "ClassTutorRow1_2", Item: "OutRow1_3", "Total Hours": "Total HoursRow1_2"},
    2: { Date: "DateRow2_2", In: "InRow2_3",  Out: "ClassTutorRow2_2", Item: "OutRow2_3", "Total Hours": "Total HoursRow2_2"},
    3: { Date: "DateRow3_2", In: "InRow3_3",  Out: "ClassTutorRow3_2", Item: "OutRow3_3", "Total Hours": "Total HoursRow3_2"},
    4: { Date: "DateRow4_2", In: "InRow4_3",  Out: "ClassTutorRow4_2", Item: "OutRow4_3", "Total Hours": "Total HoursRow4_2"},
    5: { Date: "DateRow5_2", In: "InRow5_3",  Out: "ClassTutorRow5_2", Item: "OutRow5_3", "Total Hours": "Total HoursRow5_2"},
    6: { Date: "DateRow6_2", In: "InRow6_3",  Out: "ClassTutorRow6_2", Item: "OutRow6_3", "Total Hours": "Total HoursRow6_2"},
    7: { Date: "DateRow7_2", In: "InRow7_3",  Out: "ClassTutorRow7_2", Item: "OutRow7_3", "Total Hours": "Total HoursRow7_2"},
  }
}

const form = pdfDoc.getForm()
const fields = form.getFields()
fields.forEach(field => {
  const type = field.constructor.name
  const name = field.getName()
  console.log(`${type}: ${name}`)
});


function fillRow(section, row, record, form) {
  for (const [f, v] of Object.entries(record)) {
    console.log(record);
    let fieldName = table[section][row][f];
    if (!fieldName) continue;
    console.log(fieldName);
    form.getTextField(fieldName).setText(v);
  }

  console.log(`filled section: ${section}, row: ${row} `);
}

async function fillForm(records, form) {
  let section = 1, row = 1;
  for (let record of records) {
    if (record.Day === "X") {
      section = 2;
      row = 1;
      continue;
    }
    if (!record.Date) {
      continue;
    }
    fillRow(section, row, record, form);
    row++;
  }
}

function readCsvFile(filename) {
  let input = fs.readFileSync(filename);
  return parse(input, {
    columns: true,
    delimiter: ",",
    skip_empty_lines: true
  });
}

async function main() {
  let records = readCsvFile(CSV_FILE);
  console.log("records");
  console.log(records);

  const uint8Array = fs.readFileSync(SAMPLE_FILENAME);
  const pdfDoc = await PDFDocument.load(uint8Array);
  const form = pdfDoc.getForm();
  fillForm(records, form);
  let nameField = form.getTextField("Name");
  nameField.setText("Jason Pereira");
  form.getTextField("Begin").setText("");
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync("ok.pdf", pdfBytes);
}

main();