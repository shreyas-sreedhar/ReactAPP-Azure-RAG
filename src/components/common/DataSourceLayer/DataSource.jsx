import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Box, IconButton, Typography, Button } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import '../Chatbot/chatbot.css'; // Ensure this points to your CSS file correctly
import CatalogCard from '../CatalogLayer/Catalog-card/CatalogCard';
import awsimg from './images/aws.svg'
import snwflkimg from './images/snowflake.svg'
import oracleimg from './images/oracle.svg'
import azureimg from './images/azure.svg'
import webimg from './images/web.svg'
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';

const createData = (key, name, img, isConnected = false) => ({
    key, name, img, isConnected, open: false, loading: false,
});

const DataSource = ({ loggedUser }) => {
    const [dataSources, setDataSources] = useState([
        createData('aws', 'AWS S3 Buckets', awsimg),
        createData('azure', 'Azure Blob', azureimg),
        createData('snowflake', 'SnowFlake DB', snwflkimg),
        createData('oracle', 'Oracle DB', oracleimg),
        createData('webpages', 'Web Pages', webimg),

    ]);
    const steps = [
        'Catalog Selection', 'Data Source Selection', 'Data Selection'
    ];

    const toggleRow = (key) => {
        const newDataSources = dataSources.map(dataSource => {
            if (dataSource.key === key) {
                return { ...dataSource, loading: true };
            }
            return dataSource;
        });
        setDataSources(newDataSources);

        setTimeout(() => {
            const updatedDataSources = newDataSources.map(dataSource => {
                if (dataSource.key === key) {
                    return { ...dataSource, open: !dataSource.open, loading: false };
                }
                return dataSource;
            });
            setDataSources(updatedDataSources);
        }, 1000); // 1 second delay
    };
    const handleConnectionToggle = (key) => {
        const newDataSources = dataSources.map(dataSource => {
            if (dataSource.key === key) {
                return { ...dataSource, isConnected: !dataSource.isConnected };
            }
            return dataSource;
        });
        setDataSources(newDataSources);
    };
    

    return (
        <>

            <div className='main-header'>
                <Box sx={{ width: '100%' }}>
                    <Stepper activeStep={1} alternativeLabel>
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
                    <h1 className='pagetitle'>Choose Your Catalog</h1>
                    <div className="div-3">
                        Choose the type of data source and its location from the available options below.
                    </div>
                </header>
                <TableContainer component={Paper}>
                    <Table aria-label="collapsible table">
                        <TableHead>
                            <TableRow>
                                <TableCell> <div className='table-title'> Data Source </div></TableCell>
                                <TableCell align="right"> <div className='table-title'> Action </div></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataSources.map((row) => (
                                <React.Fragment key={row.key}>
                                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                        <TableCell component="th" scope="row">
                                            <img src={row.img} alt={row.name} style={{ width: 50, height: 50, marginRight: 10 }} /> {row.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button variant="contained" className="next-button5" onClick={() => toggleRow(row.key)}>
                                                {row.loading ? <CircularProgress size={24} /> : row.open ? 'View' : 'Scan'}
                                                {row.open && !row.loading ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                            <Collapse in={row.open} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 1 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        Details
                                                        <CatalogCard
                                                            name={row.name}
                                                            // description="Add"
                                                            isConnected={row.isConnected}
                                                            onConnect={() => handleConnectionToggle(row.key)}
                                                        />
                                                    </Typography>
                                                    Placeholder for {row.name} details or actions.
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="layout-footer">
                    <Link to="/chatbot-3">
                        <button className="next-button">Next</button>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default DataSource;
