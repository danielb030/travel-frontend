import {autoTable} from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

function descendingComparator(a, b, orderBy) {
  if (a[orderBy] === null) {
    return 1;
  }
  if (b[orderBy] === null) {
    return -1;
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
export function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export function applyFilter({ inputData, comparator, filterName }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const handleExportExcel = (resaData) => {
  // Create a new workbook and a new worksheet
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    ['Guid Id', 'Guid Name', 'Language Spoken', 'License No'],
    ...resaData.map((row) => [
      row.guid_id,
      row.name,
      row.language.join(', '),
      row.license.join(', '),
    ]),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'guid');

  // Export the workbook to Excel
  XLSX.writeFile(workbook, `guid${Date.now()}.xlsx`);
};

export const handleExportPdf = (resaData) => {
  const doc = new jsPDF({
    unit: 'pt', // Unit: 'pt' (points), 'mm', 'cm', 'in'
    format: [1500, 600], // Custom width and height in points
  });
  // Define the columns
  const columns = [
    { header: 'Guid Id', dataKey: 'guid_id' },
    { header: 'Guid', dataKey: 'name' },
    { header: 'Language Spoken', dataKey: 'language' },
    { header: 'License No', dataKey: 'license' },
  ];

  // Map data to rows
  const rows = resaData.map((row) => ({
    guid_id: row.guid_id,
    name: row.name,
    language: row.language.join(', '),
    license: row.license.join(', '),
  }));

  // Add table to the PDF
  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.dataKey])),
  });

  // Save the PDF
  doc.save(`guid${Date.now()}.pdf`);
};
