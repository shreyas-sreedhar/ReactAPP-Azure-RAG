import React, { useState, Fragment } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody, Paper, Box, TableContainer,
  TextField, Select, MenuItem, IconButton, Collapse, Dialog, DialogActions,
  DialogContent, DialogTitle, Button
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';

// Assuming `columns` can now include types (text, select, button) and additional props per column
const GenericTableRow = ({ rowData, columnMapping, handleRowChange, toggleCollapseRow }) => (
  <Fragment>
    <TableRow>
      {columnMapping.map((column, index) => {
        let cellContent;
        switch (column.type) {
          case 'text':
            cellContent = (
              <TextField
                defaultValue={rowData[column.id]}
                onChange={(e) => handleRowChange(rowData, column.id, e.target.value)}
                fullWidth
              />
            );
            break;
          case 'select':
            cellContent = (
              <Select
                defaultValue={rowData[column.id]}
                onChange={(e) => handleRowChange(rowData, column.id, e.target.value)}
                fullWidth
              >
                {column.options.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            );
            break;
          case 'button':
            cellContent = (
              <Button onClick={() => column.action(rowData)}>{column.label}</Button>
            );
            break;
          case 'collapseControl':
            cellContent = (
              <IconButton size="small" onClick={() => toggleCollapseRow(rowData)}>
                {rowData.open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </IconButton>
            );
            break;
          default:
            cellContent = rowData[column.id];
            break;
        }
        return (
          <TableCell key={index} align={column.align || 'left'}>
            {cellContent}
          </TableCell>
        );
      })}
    </TableRow>
    {rowData.open && (
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columnMapping.length}>
          <Collapse in={rowData.open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {/* Custom component or additional details for the expanded row */}
              {rowData.detailsComponent}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    )}
  </Fragment>
);

const GenericTable = ({ data, columns, title, onRowChange, toggleCollapseRow }) => (
  <Paper>
    <Box p={3}>
      <div className='table-title'>{title}</div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <GenericTableRow
                key={index}
                rowData={row}
                columnMapping={columns}
                handleRowChange={onRowChange}
                toggleCollapseRow={toggleCollapseRow}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </Paper>
);

export default GenericTable;
