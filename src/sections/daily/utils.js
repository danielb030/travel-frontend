import {autoTable} from 'jspdf-autotable';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

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

  return serviceDateOnly >= startDateOnly && serviceDateOnly <= endDateOnly;
}

function getMatchingServices(services, startDateStr, endDateStr) {
  return services.filter((service) =>
    isDateInRange(service.service_date, startDateStr, endDateStr)
  );
}
export function applyFilter({ inputData, comparator, filterName, current, currentEnd }) {
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

  if (filterName) {
    inputData = inputData.filter(
      (user) => user.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

export const handleExportExcel = (resaData) => {
  resaData.sort((a, b) => new Date(b.service_date) - new Date(a.service_date));
  // Create a new workbook and a new worksheet
  const workbook = XLSX.utils.book_new();

  const worksheetData = [
    [
      'File No',
      'Client Name',
      'Agency Reference',
      'Agency',
      'From',
      'To',
      'Excursion',
      'Service',
      'Service Date',
      'Service Type',
      'Flight No',
      'Flight Time',
      'Pick up Time',
      'Adult',
      'Child(3-11)',
      'Infant(0,2)',
      'Teen(12-18)',
      'Type of Vehicle',
      'Driver',
      'Guide',
      'Remarks',
      'By',
      'Status',
    ],
    ...resaData.map((row) => [
      row.dossier_no,
      row.client,
      row.agency_ref,
      row.agency,
      row.from,
      row.to,
      row.excursion,
      row.service,
      formatDate(row.service_date),
      row.service_type,
      row.flight_no,
      formatTime(row.flight_time),
      formatTime(row.pickup_time),
      row.adult,
      row.child,
      row.infant,
      row.teen,
      row.vehicle_type,
      row.driver,
      row.guid,
      row.resa_remark,
      row.by,
      row.status,
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Append the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Daily Planning');

  // Export the workbook to Excel
  XLSX.writeFile(workbook, `daily_planning${Date.now()}.xlsx`);
};

export const handleExportPdf = (resaData) => {
  resaData.sort((a, b) => new Date(b.service_date) - new Date(a.service_date));
  const doc = new jsPDF({
    orientation: 'landscape', // Change orientation to landscape
    unit: 'pt', // Unit: 'pt' (points), 'mm', 'cm', 'in'
    format: [1500, 600], // Custom width and height in points
  });

  // Define the columns
  const columns = [
    { header: 'File No', dataKey: 'dossier_no' },
    { header: 'Client Name', dataKey: 'client' },
    { header: 'Agency Reference', dataKey: 'agency_ref' },
    { header: 'Agency', dataKey: 'agency' },
    { header: 'From', dataKey: 'from' },
    { header: 'To', dataKey: 'to' },
    { header: 'To', dataKey: 'excursion' },
    { header: 'Excursion', dataKey: 'service_type' },
    { header: 'Service', dataKey: 'service' },
    { header: 'Service Date', dataKey: 'service_date' },
    { header: 'Service Type', dataKey: 'service_type' },
    { header: 'Flight No', dataKey: 'flight_no' },
    { header: 'Flight Time', dataKey: 'flight_time' },
    { header: 'Pick up Time', dataKey: 'pickup_time' },
    { header: 'Adult', dataKey: 'adult' },
    { header: 'Child(3-11)', dataKey: 'child' },
    { header: 'Infant(0-2)', dataKey: 'infant' },
    { header: 'Teen(12-18)', dataKey: 'teen' },
    { header: 'Type of Vehicle', dataKey: 'vehicle_type' },
    { header: 'Driver', dataKey: 'driver' },
    { header: 'Guide', dataKey: 'guid' },
    { header: 'Remarks', dataKey: 'remarks' },
    { header: 'By', dataKey: 'by' },
    { header: 'Status', dataKey: 'status' },
  ];

  // Map data to rows
  const rows = resaData.map((row) => ({
    dossier_no: row.dossier_no,
    client: row.client,
    agency_ref: row.agency_ref,
    agency: row.agency,
    from: row.from,
    to: row.to,
    excursion: row.excursion,
    service: row.service,
    service_date: formatDate(row.service_date),
    service_type: row.service_type,
    flight_no: row.flight_no,
    flight_time: formatTime(row.flight_time),
    pickup_time: formatTime(row.pickup_time),
    adult: row.adult,
    child: row.child,
    infant: row.infant,
    teen: row.teen,
    vehicle_type: row.vehicle_type,
    driver: row.driver,
    guid: row.guid,
    resa_remark: row.resa_remark,
    by: row.by,
    status: row.status,
  }));

  // Add table to the PDF
  autoTable(doc, {
    head: [columns.map((col) => col.header)],
    body: rows.map((row) => columns.map((col) => row[col.dataKey])),
  });

  // Save the PDF
  doc.save(`daily_planning${Date.now()}.pdf`);
};
