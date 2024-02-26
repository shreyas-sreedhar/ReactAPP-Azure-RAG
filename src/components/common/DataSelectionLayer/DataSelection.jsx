import React, { useState, useEffect } from 'react';
import { Box, Button, Checkbox, Collapse, TextareaAutosize, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Step, StepLabel, Stepper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import tablesData from './data.json';
import selectedBucketsData from '../DataSourceLayer/selectedBuckets.json';
import axios from 'axios';
import { Link } from "react-router-dom";
import "../Chatbot/chatbot.css"



const DataSelection = ({ loggedUser }) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedTableData, setSelectedTableData] = useState({});
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selectedBuckets, setSelectedBuckets] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);

    useEffect(() => {
        setRows(tablesData.tables);
        setSelectedBuckets(selectedBucketsData.selectedBuckets);
    }, []);

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
        setOpenModal(true);
    };

    function trimDescription(description, maxWordCount) {
        const words = description.split(' ');
        if (words.length > maxWordCount) {
            return words.slice(0, maxWordCount).join(' ') + '...';
        }
        return description;
    }

    const handleRowSelect = (id, tableData) => {
        setSelectedRows(prevSelectedRows => {
            const isSelected = prevSelectedRows.some(row => row.id === id);
            if (isSelected) {
                return prevSelectedRows.filter(row => row.id !== id);
            } else {
                return [...prevSelectedRows, { id, ...tableData }];
            }
        });
    };



    const convertSelectedRowsToJson = () => {
        const selectedRowsArray = Object.values(selectedRows).filter(row => row !== undefined);
        const selectedRowsJson = JSON.stringify(selectedRowsArray, null, 2);
        console.log(selectedRowsJson);

        axios.post('http://localhost:3001/chatbotdata', { data: selectedRowsJson })
            .then(response => {
                console.log('Data sent successfully:', response.data);
            })
            .catch(error => {
                console.error('Error sending data:', error);
            });



    };

    const steps = ['Catalog Selection', 'Data Source Selection', 'Data Selection', 'Finish'];
    const CheckboxRow = ({ id, tableData, selectedRows, handleRowSelect }) => {
        const isChecked = selectedRows.some(row => row.id === id);

        const handleChange = () => {
            handleRowSelect(id, tableData);
        };

        return (
            <Checkbox
                onChange={handleChange}
                checked={isChecked}
            />
        );
    };
    const handleDescriptionChange = (index, value) => {
        setSelectedTableData(prevData => {
            const updatedColumns = [...prevData.columns];
            updatedColumns[index].description = value;
            return { ...prevData, columns: updatedColumns };
        });
    };

    const handleSaveChanges = () => {

        console.log("Updated table data:", selectedTableData);
        setOpenModal(false);
    };
    const handleTableDescriptionChange = (bucketIndex, rowIndex, value) => {
        console.log("Updating table description:", bucketIndex, rowIndex, value);
        setRows(prevRows => {
            return prevRows.map((bucket, bIndex) => {
                if (bIndex === bucketIndex && bucket.rows) {
                    return {
                        ...bucket,
                        rows: bucket.rows.map((row, rIndex) => {
                            if (rIndex === rowIndex) {
                                console.log("Updating row description:", row.id, value);
                                return { ...row, description: value };
                            }
                            return row;
                        })
                    };
                }
                return bucket;
            });
        });
    };
    const handleCardinalityChange = (index, value) => {
        // Assuming selectedTableData.columns is the array of columns
        const updatedColumns = [...selectedTableData.columns];
        updatedColumns[index].cardinality = value; // Update the cardinality value for the specific column
        setSelectedTableData({ ...selectedTableData, columns: updatedColumns });
    };

    const handleForeignKeyChange = (index, value) => {
        // Assuming selectedTableData.columns is the array of columns
        const updatedColumns = [...selectedTableData.columns];
        // Split the value into table and column
        const [table, column] = value.split('.');
        // Update the foreign key details for the specific column
        updatedColumns[index].foreignKey = {
            table: table.trim(),
            column: column.trim()
        };
        setSelectedTableData({ ...selectedTableData, columns: updatedColumns });
    };



    return (
        <>
            <div className='main-header'>
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={3} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </div>
            <div className="layout-container">
                <header className="layout-header">
                    <h1 className='pagetitle'>Choose Data</h1>
                    <div className="div-3">
                        Choose the data source and add the description from the available options below. Click on the Arrow to describe the respective data sources
                    </div>
                </header>
                <div>
                    {selectedBuckets.map((bucket, bucketIndex) => (
                        <Paper key={bucketIndex}>
                            <Box p={3}>
                                <div className='table-title-ds'>Data Source: {bucket.dataSourceKey}</div>
                                <Typography variant="h6">Bucket Name: {bucket.bucketName}</Typography>
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
                                        <Button variant="contained" >Add</Button>
                                        <Button variant="contained" style={{ marginLeft: '8px' }}>Remove</Button>
                                    </Box>
                                </Box>
                                <TableContainer component={Paper}>
                                    <Table aria-label="collapsible table">
                                        <TableHead>
                                            <TableRow>
                                                {bucket.dataSourceKey === 'oracle' || bucket.dataSourceKey === 'snowflake' ? (
                                                    <>
                                                        <TableCell align='center'>Select</TableCell>
                                                        <TableCell align='center'>Table Name</TableCell>
                                                        <TableCell align="center">Description</TableCell>
                                                        <TableCell align='center'>View Columns</TableCell>
                                                    </>
                                                ) : (
                                                    <>
                                                        <TableCell align='center'>Select</TableCell>
                                                        <TableCell align='center'>File Name</TableCell>
                                                        <TableCell align="center">Description</TableCell>
                                                    </>
                                                )}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, rowIndex) => (
                                                <React.Fragment key={bucketIndex + '-' + rowIndex}>
                                                    <TableRow>
                                                        <TableCell align='center'>
                                                            <CheckboxRow
                                                                id={bucketIndex + '-' + rowIndex}
                                                                tableData={row}
                                                                selectedRows={selectedRows}
                                                                handleRowSelect={handleRowSelect}
                                                            />
                                                        </TableCell>
                                                        <TableCell align='center'>{row.name}</TableCell>
                                                        <TableCell align="center">{trimDescription(row.description, 10)}
                                                            <IconButton size="small" onClick={() => toggleCollapse(row)}>
                                                                {row.open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                            </IconButton>
                                                        </TableCell>
                                                        {bucket.dataSourceKey === 'oracle' || bucket.dataSourceKey === 'snowflake' ? (
                                                            <>  <TableCell align='center'>
                                                                <Button variant="contained" onClick={() => handleOpenModal(row)}>View</Button>
                                                            </TableCell>
                                                            </>) : (<> </>)}
                                                    </TableRow>
                                                    {row.open && (
                                                        <TableRow>
                                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                                <Collapse in={row.open} timeout="auto" unmountOnExit>
                                                                    <Box sx={{ margin: 1 }}>
                                                                        {bucket.dataSourceKey === 'oracle' || bucket.dataSourceKey === 'snowflake' ? (
                                                                            <div>
                                                                                {row.description}
                                                                                <IconButton size="small" onClick={() => toggleCollapse(row)}>
                                                                                    <KeyboardArrowUp />
                                                                                </IconButton>
                                                                            </div>
                                                                        ) : (
                                                                            <TextField
                                                                                variant="outlined"
                                                                                label="Description"
                                                                                placeholder="Enter description"
                                                                                fullWidth
                                                                                value="-"
                                                                                onChange={(e) => handleTableDescriptionChange(bucketIndex, rowIndex, e.target.value)}
                                                                            />
                                                                        )}
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

                                <Dialog
                                    open={openModal}
                                    onClose={() => setOpenModal(false)}
                                    aria-labelledby="table-columns-dialog-title"
                                    fullWidth
                                    maxWidth="xl" // Set maximum width to extra large
                                >
                                    <DialogTitle id="table-columns-dialog-title">{selectedTableData.name}</DialogTitle>
                                    <DialogContent dividers sx={{ width: '100vw' }}>
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Name</TableCell>
                                                        <TableCell>Description</TableCell>
                                                        <TableCell>Foreign Key</TableCell>
                                                        <TableCell>Cardinality</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selectedTableData.columns && selectedTableData.columns.map((column, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{column.name}</TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    defaultValue={column.description}
                                                                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                                                    fullWidth
                                                                    style={{ width: '100%' }}
                                                                />
                                                            </TableCell>
                                                            <TableCell>

                                                                <TextField
                                                                    defaultValue={column.foreignKey ? `${column.foreignKey.table}+${column.foreignKey.column}` : ''}
                                                                    onChange={(e) => handleForeignKeyChange(index, e.target.value)}
                                                                    fullWidth
                                                                    style={{ width: '100%' }}
                                                                />


                                                            </TableCell>
                                                            <TableCell>

                                                                <Select
                                                                    value={column.cardinality}
                                                                    onChange={(e) => handleCardinalityChange(index, e.target.value)}
                                                                >
                                                                    <MenuItem value="One to One">One to One</MenuItem>
                                                                    <MenuItem value="One to Many">One to Many</MenuItem>
                                                                    <MenuItem value="Many to One">Many to One</MenuItem>
                                                                    <MenuItem value="Many to Many">Many to Many</MenuItem>
                                                                </Select>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => handleSaveChanges()}>Save</Button>
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
                    ))}
                </div>
                <div className="layout-footer">
                    <Link to="/chatbot-4" onClick={convertSelectedRowsToJson}>
                        <div className='next-button'> Next </div>
                    </Link>
                </div>
            </div>
        </>

    );
};

export default DataSelection;
