import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';


import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Box, IconButton, Typography, Button, TablePagination, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import './dataselection.css';
import tablesData from './data.json';

const DataSelction = ({ loggedUser }) => {
    // Sample data
    // const [rows, setRows] = useState(tablesData.tables);
    const [openModal, setOpenModal] = useState(false);
    const [selectedTableData, setSelectedTableData] = useState({});

    const [rows, setRows] = useState([]);

    useEffect(() => {
        // Assuming your JSON structure matches the expected format
        setRows(tablesData.tables);
    }, []);


    const [editableDescription, setEditableDescription] = useState("");


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const toggleCollapse = (row) => {
        const newRows = rows.map(r => {
            if (r === row) {
                return { ...r, open: !r.open };
            }
            return r;
        });
        setRows(newRows);
    };
    const handleOpenModal = (tableData) => {
        setSelectedTableData(tableData);
        setEditableDescription(tableData.description); // Initialize with current description
        setOpenModal(true);
    };

    function trimDescription(description, maxWordCount) {
        const words = description.split(' ');
        if (words.length > maxWordCount) {
            return words.slice(0, maxWordCount).join(' ') + '...';
        }
        return description;
    }


    return (
        <>
            <div className="layout-container">
                <header className="layout-header">
                    <h1 className='pagetitle'>Choose Data</h1>
                    <div className="div-3">
                        Choose the data source and add the description from the available options below. Click on the Arrow to describe  the respective data sources
                    </div>
                </header>
                <Paper>
                    <Box p={3}>
                        <Typography variant="h6">Sales_AWS</Typography>
                        <Typography variant="subtitle1">Choose the specific datasets you want to work with from the options presented.</Typography>
                        <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                            <TextField label="Search" variant="outlined" size="small" />
                            <FormControl size="small" style={{ minWidth: 120 }}>
                                <InputLabel>Type of File</InputLabel>
                                <Select label="Property" defaultValue="">
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="option1">PDF</MenuItem>
                                    <MenuItem value="option2">Database</MenuItem>
                                </Select>
                            </FormControl>
                            <Box>
                                <Button variant="contained">Add</Button>
                                <Button variant="contained" style={{ marginLeft: '8px' }}>Remove</Button>
                            </Box>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>Table Name</TableCell>
                                        <TableCell align="center">Description</TableCell>
                                        <TableCell align='center'>View Columns</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                        <React.Fragment key={index}>
                                            <TableRow>
                                                <TableCell align='center'>{row.name}</TableCell>
                                                <TableCell align="center"> {trimDescription(row.description, 10)}<IconButton size="small" onClick={() => toggleCollapse(row)}>
                                                    {row.open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                </IconButton></TableCell>
                                                <TableCell align='center'>
                                                    <Button variant="contained" onClick={() => handleOpenModal(row)}>View</Button>
                                                </TableCell>
                                            </TableRow>
                                            {row.open && (
                                                <TableRow>
                                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                        <Collapse in={row.open} timeout="auto" unmountOnExit>
                                                            <Box sx={{ margin: 1 }}>
                                                                {/* Iterate over columns to display them */}
                                                                {/* {row.columns.map((column, columnIndex) => (
                                                            <div key={columnIndex}>
                                                                {column.name}: {column.description}
                                                            </div>
                                                        ))} */}

                                                                <div>
                                                                    {row.description}
                                                                </div>
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                        {/* <Dialog open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="table-columns-dialog-title">
                            <DialogTitle id="table-columns-dialog-title">{selectedTableData.name}</DialogTitle>
                            <DialogContent dividers>
                                {selectedTableData.columns && selectedTableData.columns.map((column, index) => (
                                    // <DialogContentText key={index}>
                                    //     <strong>{column.name}:</strong> {column.description}
                                    // </DialogContentText>
                                    <DialogContent dividers>
                                        {selectedTableData.columns && selectedTableData.columns.map((column, index) => (
                                            <div key={index}>
                                                <strong>{column.name}:</strong> {column.description}
                                            </div>
                                        ))}
                                        <TextField
                                            margin="dense"
                                            id="description"
                                            label="Description"
                                            type="text"
                                            fullWidth
                                            multiline
                                            variant="standard"
                                            value={editableDescription}
                                            onChange={(e) => setEditableDescription(e.target.value)}
                                        />
                                    </DialogContent>
                                ))}
                            </DialogContent>
                        </Dialog> */}

<Dialog open={openModal} onClose={() => setOpenModal(false)} aria-labelledby="table-columns-dialog-title">
    <DialogTitle id="table-columns-dialog-title">{selectedTableData.name}</DialogTitle>
    <DialogContent dividers>
        {/* Display each column's details */}
        {selectedTableData.columns && selectedTableData.columns.map((column, index) => (
            <div key={index}>
                <strong>{column.name}:</strong> {column.description}
            </div>
        ))}
        {/* TextField for editing the table's description (if needed outside the columns listing) */}
        <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            variant="standard"
            value={editableDescription}
            onChange={(e) => setEditableDescription(e.target.value)}
        />
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenModal(false)}>Close</Button>
    </DialogActions>
</Dialog>

                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>
                </Paper>
                <div className="layout-footer">
                    <Link to="/chatbot-3">
                        <button className="footer-button primary">Next</button>
                    </Link>
                </div>
            </div>


        </>
    );
};

export default DataSelction;
