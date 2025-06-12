import {autoTable} from 'jspdf-autotable';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

function formatDate(dateString) {
  if (!dateString) return '';
  const date = dayjs(dateString);

  // Month abbreviations
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Extract date components correctly
  const day = date.date(); // Use `.date()` instead of `.getDate()`
  const month = months[date.month()]; // Use `.month()` instead of `.getMonth()`
  const year = date.year(); // Use `.year()` instead of `.getFullYear()`

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

export const formatTime = (timeString) => {
  if (!timeString) return '';

  // Split the time into components
  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');

  // Convert to 24-hour format
  if (modifier === 'PM' && hours !== '12') {
    hours = String(parseInt(hours, 10) + 12);
  }
  if (modifier === 'AM' && hours === '12') {
    hours = '00';
  }

  // Ensure double digits for hours and minutes
  hours = hours.padStart(2, '0');
  minutes = minutes.padStart(2, '0');

  return `${hours}:${minutes}`;
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

function isDateInRange(serviceDateStr, startDateStr, endDateStr) {
  const serviceDate = new Date(serviceDateStr);
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const serviceDateOnly = new Date(
    serviceDate.getFullYear(),
    serviceDate.getMonth(),
    serviceDate.getDate()
  );
  const startDateOnly = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );
  const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

  if (serviceDateOnly >= startDateOnly && serviceDateOnly <= endDateOnly) {
    return true;
  }
}

function getMatchingServices(services, startDateStr, endDateStr) {
  return services.filter((service) =>
    isDateInRange(service.service_date, startDateStr, endDateStr)
  );
}

export function applyFilter({
  inputData,
  comparator,
  searchOption,
  filterName,
  current,
  currentEnd,
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (current && currentEnd) {
    inputData = getMatchingServices(inputData, current, currentEnd);
  }
  if (!searchOption || !filterName) return inputData;

  if (filterName) {
    inputData = inputData.filter(
      (user) => user[searchOption].toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const handleExportExcel = (resaData) => {
  resaData.sort((a, b) => new Date(a.service_date) - new Date(b.service_date));
  const workbook = XLSX.utils.book_new();
  const worksheetData = [
    [
      'dossier_no',
      'by',
      'verified',
      'status',
      'service',
      'service_type',
      'agence_ref',
      'client',
      'agency',
      'from',
      'to',
      'excursion',
      'service_date',
      'flight_no',
      'flight_time',
      'adult',
      'child',
      'infant',
      'teen',
      'resa_remark',
      'from_region',
      'to_region',
      'vehicle_type',
      'invoice_no',
      'amount',
      'adult_price',
      'child_price',
      'teen_price',
      'total_price',
      'currency',
      'last_update',
      'license',
    ],
    ...resaData.map((row) => [
      row.dossier_no,
      row.by,
      row.verified,
      row.status,
      row.service,
      row.service_type,
      row.agency_ref,
      row.client,
      row.agency,
      row.from,
      row.to,
      row.excursion,
      formatDate(row.service_date),
      row.flight_no,
      formatTime(row.flight_time),
      row.adult,
      row.child,
      row.infant,
      row.teen,
      row.resa_remark,
      row.from_region,
      row.to_region,
      row.vehicle_type,
      row.invoice_no,
      row.amount,
      row.adult_price,
      row.child_price,
      row.teen_price,
      row.total_price,
      row.currency,
      formatDate(row.last_update),
      row.license.join(', '),
    ]),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'resa');

  // Export the workbook to Excel
  XLSX.writeFile(workbook, `Maindata${Date.now()}.xlsx`);
};

export const handleExportPdf = (resaData) => {
  resaData.sort((a, b) => new Date(a.service_date) - new Date(b.service_date));
  const doc = new jsPDF({
    orientation: 'landscape', // Change orientation to landscape
    unit: 'pt', // Unit: 'pt' (points), 'mm', 'cm', 'in'
    format: [2000, 800], // Custom width and height in points
  });
  // Define the columns
  const columns = [
    { datakey: 'dossier_no', header: 'dossier_no' },
    { datakey: 'by', header: 'by' },
    { datakey: 'verified', header: 'verified' },
    { datakey: 'status', header: 'status' },
    { datakey: 'service', header: 'service' },
    { datakey: 'service_type', header: 'service_type' },
    { datakey: 'agency_ref', header: 'agency_ref' },
    { datakey: 'client', header: 'client' },
    { datakey: 'agency', header: 'agency' },
    { datakey: 'from', header: 'from' },
    { datakey: 'to', header: 'to' },
    { datakey: 'excursion', header: 'excursion' },
    { datakey: 'service_date', header: 'service_date' },
    { datakey: 'flight_no', header: 'flight_no' },
    { datakey: 'flight_time', header: 'flight_time' },
    { datakey: 'adult', header: 'adult' },
    { datakey: 'child', header: 'child' },
    { datakey: 'infant', header: 'infant' },
    { datakey: 'teen', header: 'teen' },
    { datakey: 'resa_remark', header: 'resa_remark' },
    { datakey: 'from_region', header: 'from_region' },
    { datakey: 'to_region', header: 'to_region' },
    { datakey: 'vehicle_type', header: 'vehicle_type' },
    { datakey: 'invoice_no', header: 'invoice_no' },
    { datakey: 'amount', header: 'amount' },
    { datakey: 'adult_price', header: 'adult_price' },
    { datakey: 'child_price', header: 'child_price' },
    { datakey: 'teen_price', header: 'teen_price' },
    { datakey: 'total_price', header: 'total_price' },
    { datakey: 'currency', header: 'currency' },
    { datakey: 'last_update', header: 'last_modified' },
    { datakey: 'license', header: 'license' },
  ];

  // Map data to rows
  const rows = resaData.map((row) => ({
    dossier_no: row.dossier_no,
    by: row.by,
    verified: row.verified,
    status: row.status,
    service: row.service,
    service_type: row.service_type,
    agency_ref: row.agency_ref,
    client: row.client,
    agency: row.agency,
    from: row.from,
    to: row.to,
    excursion: row.excursion,
    service_date: formatDate(row.service_date),
    flight_no: row.flight_no,
    flight_time: formatTime(row.flight_time),
    adult: row.adult,
    child: row.child,
    infant: row.infant,
    teen: row.teen,
    resa_remark: row.resa_remark,
    from_region: row.from_region,
    to_region: row.to_region,
    vehicle_type: row.vehicle_type,
    invoice_no: row.invoice_no,
    amount: row.amount,
    adult_price: row.adult_price,
    child_price: row.child_price,
    teen_price: row.teen_price,
    total_price: row.total_price,
    currency: row.currency,
    last_update: formatDate(row.last_update),
    license: row.license.join(', '),
  }));

  // Add table to the PDF
  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.datakey])),
  });

  // Save the PDF
  doc.save(`Maindata${Date.now()}.pdf`);
};
