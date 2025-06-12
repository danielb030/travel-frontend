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
    ['Agency Id', 'Agency Name', 'Agency Reference', 'Country', 'Tel', 'Email', 'Website'],
    ...resaData.map((row) => [
      row.ageycy_id,
      row.name,
      row.ref,
      row.country,
      row.tel,
      row.email,
      row.website,
    ]),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Agency');

  // Export the workbook to Excel
  XLSX.writeFile(workbook, `Agencies${Date.now()}.xlsx`);
};

export const handleExportPdf = (resaData) => {
  const doc = new jsPDF({
    orientation: 'landscape', // Change orientation to landscape
    unit: 'pt', // Unit: 'pt' (points), 'mm', 'cm', 'in'
    format: [1500, 600], // Custom width and height in points
  });
  // Define the columns
  const columns = [
    { header: 'Agency Id', dataKey: 'ageycy_id' },
    { header: 'Agency Name', dataKey: 'name' },
    { header: 'Agency Reference', dataKey: 'ref' },
    { header: 'Country', dataKey: 'country' },
    { header: 'Tel', dataKey: 'tel' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Website', dataKey: 'website' },
  ];

  // Map data to rows
  const rows = resaData.map((row) => ({
    ageycy_id: row.ageycy_id,
    name: row.name,
    ref: row.ref,
    country: row.country,
    tel: row.tel,
    email: row.email,
    website: row.website,
  }));

  // Add table to the PDF
  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.dataKey])),
  });

  // Save the PDF
  doc.save(`Agencies${Date.now()}.pdf`);
};
