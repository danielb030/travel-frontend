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
import { deleteData, getGuidData, putGuidData } from 'src/lib/guid';

import Scrollbar from 'src/components/scrollbar';

import GuidModal from '../guid-model';
import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import {
  emptyRows,
  applyFilter,
  getComparator,
  handleExportPdf,
  handleExportExcel,
} from '../utils';

// ----------------------------------------------------------------------

export default function GuidPage() {
  const [guidData, setGuidData] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('_id');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState('');
  const [maxGuidNo, setMaxGuidNo] = useState('');

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

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
    inputData: guidData,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getGuidData();
        if (res === 500) {
          alert('Network Error');
        } else {
          setGuidData(res.data);
          setMaxGuidNo(res.max_num);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('An unexpected error occurred');
      }
    };
    getData();
  }, []);

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
      newData: formData,
    };

    const res = await putGuidData(params);
    if (res === 500) {
      alert('Network Error');
    } else {
      if (currentRow) {
        alert('A data updated successfully');
      } else {
        alert('A data added successfully');
      }
      setGuidData(res.data);
      setMaxGuidNo(res.max_num);
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
      id: deleteId,
    };

    const res = await deleteData(params);
    if (res === 500) {
      alert('Network Error.');
    } else {
      alert('A data deleted successfully.');
      setGuidData(res.data);
      setMaxGuidNo(res.max_num);
    }
  };

  const handleCloseConfirm = () => {
    setConfirmOpen(false);
  };

  const handlePdf = () => {
    handleExportPdf(guidData);
  };

  const handleExcel = () => {
    handleExportExcel(guidData);
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container maxWidth={false}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Guids</Typography>
      </Stack>

      <Card>
        <UserTableToolbar
          filterName={filterName}
          onFilterName={handleFilterByName}
          onNewHotel={handleNewReservation}
          pdfAction={handlePdf}
          excelAction={handleExcel}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'auto', height: '76vh' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleSort}
                headLabel={[
                  { id: 'guid_id', label: 'Guid Id', align: 'center' },
                  { id: 'name', label: 'Guid Name', align: 'center' },
                  { id: 'language', label: 'Language Spoken', align: 'center' },
                  { id: 'license', label: 'License No', align: 'center' },
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
                      name={row.name}
                      language={row.language}
                      license={row.license}
                      guid_id={row.guid_id}
                      deleteAction={() => handleDelete(row)}
                      editAction={() => handleEdit(row)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, guidData.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={guidData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 15, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <GuidModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        initialData={currentRow}
        maxNumber={maxGuidNo}
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
