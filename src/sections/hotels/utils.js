import {autoTable} from 'jspdf-autotable';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

function formatDate(dateString) {
  const date = new Date(dateString);
  const days = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = days[date.getMonth()];
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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
    ['Hotel Id', 'Hotel Name', 'Hotel Group', 'Hotel Address', 'Hotel Region', 'Hotel Plan Region'],
    ...resaData.map((row) => [
      row.hotel_id,
      row.name,
      row.h_group,
      row.h_addr,
      row.h_region,
      row.h_plan_region,
    ]),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'hotel');

  // Export the workbook to Excel
  XLSX.writeFile(workbook, `Hotels${Date.now()}.xlsx`);
};

export const handleExportPdf = (resaData) => {
  const doc = new jsPDF({
    unit: 'pt', // Unit: 'pt' (points), 'mm', 'cm', 'in'
    format: [1500, 600], // Custom width and height in points
  });
  // Define the columns
  const columns = [
    { header: 'Hotel Id', dataKey: 'hotel_id' },
    { header: 'Hotel Name', dataKey: 'name' },
    { header: 'Hotel Group', dataKey: 'h_group' },
    { header: 'Hotel Address', dataKey: 'h_addr' },
    { header: 'Hotel Region', dataKey: 'h_region' },
    { header: 'Hotel Plan Region', dataKey: 'h_plan_region' },
  ];

  // Map data to rows
  const rows = resaData.map((row) => ({
    hotel_id: row.hotel_id,
    name: row.name,
    h_group: row.h_group,
    h_addr: row.h_addr,
    h_region: row.h_region,
    h_plan_region: row.h_plan_region,
  }));

  // Add table to the PDF
  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.dataKey])),
  });

  // Save the PDF
  doc.save(`Hotels${Date.now()}.pdf`);
};
