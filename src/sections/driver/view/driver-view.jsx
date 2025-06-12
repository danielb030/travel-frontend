import { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import DialogContentText from '@mui/material/DialogContentText';

// import { users } from 'src/_mock/user';
import { getHotelData } from 'src/lib/hotel';
import { getAgencyData } from 'src/lib/agency';
import {
  getDriverData,
  putDriverData,
  deleteDriverData,
  getDriverDataWithDate,
} from 'src/lib/driver';

import Scrollbar from 'src/components/scrollbar';

import DriverModal from '../driver-model';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator, handleExportPdf } from '../utils';

// ----------------------------------------------------------------------

export default function DriverPlanningPage() {
  const [driverData, setDriverData] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('_id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [current, setCurrent] = useState(null);
  const [currentEnd, setCurrentEnd] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [maxDossierNo, setMaxDossierNo] = useState('');
  const [hotel, setHotel] = useState([]);
  const [agency, setAgency] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  useEffect(() => {
    const getListData = async () => {
      try {
        setLoading(true);
        const hotelres = await getHotelData();
        const agencyRes = await getAgencyData();
        setHotel(hotelres.data);
        setAgency(agencyRes.data);
      } catch {
        alert('network Error. Refresh page');
      } finally {
        setLoading(false);
      }
    };
    getListData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: driverData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const handleDailyData = async (dateStr) => {
    const date = new Date(dateStr);
    const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

    const newDate =
      timezoneOffsetHours === 2 ? new Date(date.getTime() + 10800000).toString() : dateStr;

    setCurrent(newDate);
  };

  const handleEndDailyDate = async (dateStr) => {
    const date = new Date(dateStr);
    const timezoneOffsetHours = -date.getTimezoneOffset() / 60;

    const newDate =
      timezoneOffsetHours === 2 ? new Date(date.getTime() + 10800000).toString() : dateStr;

    setCurrentEnd(newDate);
  };

  useEffect(() => {
    const confirmGetData = async () => {
      if (!current || !currentEnd) {
        const res = await getDriverData();
        if (res === 500) {
          alert('Network Error');
        } else {
          setDriverData(res.data);
          setMaxDossierNo(res.max_num);
        }
      } else {
        setPage(0);

        try {
          const data = { start: current, end: currentEnd };
          const resa = await getDriverDataWithDate(data);
          if (resa === 500) {
            alert('Network Error');
          } else {
            setDriverData(resa.data);
            setMaxDossierNo(resa.max_num);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          alert('An unexpected error occurred');
        }
      }
    };
    confirmGetData();
  }, [current, currentEnd]);

  const handleNewReservation = () => {
    setCurrentRow(null); // Clear current row data
    setIsModalOpen(true); // Open modal
  };

  const handleEdit = (rowData) => {
    setCurrentRow(rowData); // Set current row data
    setIsModalOpen(true); // Open modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalSave = async (formData) => {
    const params = {
      start: current,
      end: currentEnd,
      newData: formData,
    };

    const res = await putDriverData(params);
    if (res === 500) {
      alert('Network Error');
    } else {
      if (currentRow) {
        alert('A data updated successfully');
      } else {
        alert('A data added successfully');
      }
      setDriverData(res.data);
      setMaxDossierNo(res.max_num);
    }
  };

  const handleDelete = (data) => {
    setDeleteId(data._id);
    setConfirmOpen(true);
  };

  // Handle the deletion after confirmation
  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    const params = {
      start: current,
      end: currentEnd,
      id: deleteId,
    };

    const res = await deleteDriverData(params);
    if (res === 500) {
      alert('Network Error.');
    } else {
      alert('A data deleted successfully.');
      setDriverData(res.data);
      setMaxDossierNo(res.max_num);
    }
  };

  // Handle closing of the confirmation dialog
  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const handlePdf = (row) => {
    handleExportPdf(row);
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Driver Planning</Typography>
      </Stack>

      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          onGetDate={handleDailyData}
          onGetEndDate={handleEndDailyDate}
          NewAction={handleNewReservation}
          loading={loading}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'auto', height: '76vh' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'driver_no', label: 'No' },
                  { id: 'order_for', label: 'Trnsfer order for' },
                  { id: 'agency', label: 'Agency' },
                  { id: 'client', label: 'Client Name' },
                  { id: 'from', label: 'From' },
                  { id: 'to', label: 'To' },
                  { id: 'pickup_time', label: 'Pick Up Time' },
                  { id: 'fligth_no', label: 'Flight No' },
                  { id: 'arb_dep', label: 'Arv / Dep' },
                  { id: 'service_date', label: 'Service Date' },
                  { id: 'adult', label: 'Adult' },
                  { id: 'child', label: 'Child' },
                  { id: 'infant', label: 'Infant' },
                  { id: 'teen', label: 'Teen' },
                  { id: 'resa_remark', label: 'Resa_remarks' },
                  { id: 'veh_cat', label: 'Vehicle Category' },
                  { id: 'veh_no', label: 'Vehicle Number' },
                  { id: 'comments', label: 'Comments' },
                  { id: '', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row._id}
                      id={row._id}
                      driver_no={row.driver_no}
                      order_for={row.order_for}
                      agency={row.agency}
                      client={row.client}
                      from={row.from}
                      to={row.to}
                      pickup_time={row.pickup_time}
                      fligth_no={row.fligth_no}
                      arb_dep={row.arb_dep}
                      service_date={row.service_date}
                      adult={row.adult}
                      child={row.child}
                      infant={row.infant}
                      teen={row.teen}
                      resa_remark={row.resa_remark}
                      veh_cat={row.veh_cat}
                      veh_no={row.veh_no}
                      comments={row.comments}
                      deleteAction={() => handleDelete(row)}
                      editAction={() => handleEdit(row)}
                      exportAction={() => handlePdf(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, driverData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={driverData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <DriverModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        initialData={currentRow}
        maxNumber={maxDossierNo}
        hotel={hotel}
        agency={agency}
      />

      <Dialog
        open={confirmOpen}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
