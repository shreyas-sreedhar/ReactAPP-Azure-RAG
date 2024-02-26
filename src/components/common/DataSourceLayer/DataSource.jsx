import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, Box, Checkbox, Typography, Button } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import '../Chatbot/chatbot.css';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress';
import dsj from './dataSources.json'
import sbj from './subBuckets.json';


import axios from 'axios';


const DataSource = ({ loggedUser }) => {
    const [dataSources, setDataSources] = useState([]);
    const location = useLocation();
    // @ts-ignore
    useEffect(() => {

        const loadDataSources = async () => {
            try {

                await new Promise(resolve => setTimeout(resolve, 1000));

                const dataSourcesJson = dsj;
                const subBucketsJson = sbj;

                setDataSources(dataSourcesJson.map(item => ({
                    ...item,
                    subBuckets: subBucketsJson[item.key] ? Object.entries(subBucketsJson[item.key]).map(([domain, buckets]) => ({
                        domain,
                        buckets: buckets.map(bucket => ({ name: bucket, isSelected: false }))
                    })) : []
                })));
            } catch (error) {
                console.error('Error loading data sources:', error);
            }
        };

        loadDataSources();
    }, []);

    const handleBucketSelection = (dataSourceKey, domain, bucketName) => {

        setDataSources(prevDataSources => {
            const updatedDataSources = prevDataSources.map(dataSource => {
                if (dataSource.key === dataSourceKey) {
                    const updatedSubBuckets = dataSource.subBuckets.map(subBucket => {
                        if (subBucket.domain === domain) {
                            return {
                                ...subBucket,
                                buckets: subBucket.buckets.map(bucket => {
                                    if (bucket.name === bucketName) {
                                        return {
                                            ...bucket,
                                            isSelected: !bucket.isSelected
                                        };
                                    }
                                    return bucket;
                                })
                            };
                        }
                        return subBucket;
                    });
                    return {
                        ...dataSource,
                        subBuckets: updatedSubBuckets
                    };
                }
                return dataSource;
            });
            return updatedDataSources;
        });
    };

    const handleNextButtonClick = async () => {

        try {
            const selectedBuckets = dataSources.flatMap(dataSource =>
                dataSource.subBuckets.flatMap(subBucket =>
                    subBucket.buckets.filter(bucket => bucket.isSelected).map(bucket => ({
                        dataSourceKey: dataSource.key,
                        domain: subBucket.domain,
                        bucketName: bucket.name
                    }))
                )
            );

            await axios.post(`${process.env.REACT_APP_API_URL}/saveSelectedBuckets`, { selectedBuckets });


            window.location.href = '/chatbot-3';
        } catch (error) {
            console.error('Error processing next button click:', error);
        }
    };
    const steps = ['Catalog Selection', 'Data Source Selection', 'Data Selection', 'Finish'];


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
        }, 1000);
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
                                                    {row.subBuckets.map((domain) => (
                                                        <div key={domain.domain}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Domain: {domain.domain}
                                                            </Typography>
                                                            {domain.buckets.map(bucket => (
                                                                <div key={bucket.name}>
                                                                    <Checkbox
                                                                        checked={bucket.isSelected}
                                                                        onChange={() => handleBucketSelection(row.key, domain.domain, bucket.name)}
                                                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                                                    />
                                                                    <span>{bucket.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
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
                    <button className="next-button" onClick={handleNextButtonClick}>Next</button>
                </div>
            </div>
        </>
    );
};

export default DataSource;