    // import { S3Client, ListObjectsV2Command, GetObjectTaggingCommand } from "@aws-sdk/client-s3";
    const { S3Client, ListObjectsV2Command, GetObjectCommand,   GetObjectTaggingCommand } = require("@aws-sdk/client-s3");

    // const AWS = require('aws-sdk');
    const express = require('express');
    const mysql = require('mysql2/promise');
    const cors = require('cors');
    const app = express();
    const port = 3001;
    app.use(cors());
    require('dotenv').config();
    const apiKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    //put in env later
    const bodyParser = require('body-parser');
    app.use(bodyParser.json()); // for parsing application/json
    const AWS_REGION = "us-east-2"

    // AWS.config.update({
    //     accessKeyId: AWS_ACCESS_KEY_ID,
    //     secretAccessKey: AWS_SECRET_ACCESS_KEY,
    //     region: AWS_REGION,
    //   });
    
    // S3 instance
    //   const s3 = new AWS.S3();
    const s3Client = new S3Client({
        region: AWS_REGION,
        credentials:  {
            accessKeyId: apiKey, 
            secretAccessKey: secretKey, 
        },
        
    });
    
    const bucketName = "shreyaswapi";


    const fileTypeFolderMap = {
        PDFs: "pdf/",
        Databases: "db/",
        CSVs: "csv/",
        Texts: "txt/",
    };
    
    async function getDatabaseDetails() {
        let connection;
    try {
        // Create a connection to the database
        connection = await mysql.createConnection({
        host: "database-1.cdqeqosmixdf.us-east-1.rds.amazonaws.com",
        user: "admin",
        password: "shreyas1",
        database: "database-1"
        });

        // Query to get table information
        const [tables] = await connection.execute('SHOW TABLES');
    console.log(tables+"dfdfdfdfbroo")
        // Structure to hold the details
        const dbDetails = {};
        const dbname = "database-1"
        for (let table of tables) {
        const tableName = table[`Tables_in_${dbname}`];
        dbDetails[tableName] = { columns: [], foreignKeys: [] };

        // Query to get column information for each table
        const [columns] = await connection.execute(`SHOW COLUMNS FROM ${tableName}`);
        for (let column of columns) {
            dbDetails[tableName].columns.push({
            Field: column.Field,
            Type: column.Type,
            Null: column.Null,
            Key: column.Key,
            Default: column.Default,
            Extra: column.Extra
            });
        }

        // Query to get foreign key information for each table
        const [foreignKeys] = await connection.execute(`
            SELECT TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
            WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? AND REFERENCED_TABLE_NAME IS NOT NULL;
        `, [tableName, dbname]);

        for (let fk of foreignKeys) {
            dbDetails[tableName].foreignKeys.push({
            column: fk.COLUMN_NAME,
            constraint: fk.CONSTRAINT_NAME,
            referencedTable: fk.REFERENCED_TABLE_NAME,
            referencedColumnName: fk.REFERENCED_COLUMN_NAME
            });
        }
        }

        return dbDetails;
    } catch (error) {
        console.error('Error connecting to the database: ', error);
        throw error; // Rethrow or handle error as needed
    } finally {
        if (connection && connection.end) connection.end(); // close the connection
    }
    }

    app.use(bodyParser.json());
    
    // Assuming fileTypeFolderMap and s3Client are initialized correctly elsewhere in your code

    async function listFilesWithDetails(bucketName, fileTypes, utypename) {
        // Check if utypename is provided, if not, log a warning and return an empty object
        if (!utypename) {
            console.warn("utypename is undefined or not provided.");
            return {};
        }

        // Initialize an empty object to store filenames
        const filenames = {};

        // Iterate through each fileType provided
        for (const fileType of fileTypes) {
            // Initialize an empty array to store file URLs
            const fileURLs = [];

            // Construct parameters for listing objects in the S3 bucket
            const params = {
                Bucket: bucketName,
                Delimiter: '/',
                Prefix: fileTypeFolderMap[fileType]
            };

            try {
                // Fetch objects from S3 bucket based on parameters
                const command = new ListObjectsV2Command(params);
                const response = await s3Client.send(command);
                const s3Items = response.Contents || [];

                // Iterate through each item fetched from S3
                for (const item of s3Items) {
                    // Skip directories
                    if (item.Key.endsWith('/')) {
                        continue;
                    }

                    try {
                        // Fetch tags for the current S3 object
                        const input = {
                            Bucket: bucketName,
                            Key: item.Key
                        };
                        const command = new GetObjectTaggingCommand(input);
                        const response = await s3Client.send(command);
                        const tagSet = response.TagSet || [];

                        // Check if the object has a matching department tag
                        const hasMatchingTag = tagSet.some(tag => tag.Key === 'department' && tag.Value === utypename);
                        if (hasMatchingTag) {
                            // Construct the file URL
                            const fileURL = `https://${bucketName}.s3.amazonaws.com/${item.Key}`;

                            // Push the file URL to the array
                            fileURLs.push({
                                Key: item.Key,
                                URL: fileURL
                            });
                        }
                    } catch (error) {
                        console.error(`Error getting tags for ${item.Key}:`, error.message);
                    }
                }

                // Add the array of file URLs to the filenames object
                filenames[fileType] = fileURLs;
            } catch (err) {
                console.error(`Error viewing files for ${fileType}:`, err.message);
                // If an error occurs, assign an empty array to the filenames object for the current fileType
                filenames[fileType] = [];
            }
        }

        // Return the filenames object
        return filenames;
    }


    async function getCSVContent(bucketName, key) {
        const params = {
            Bucket: bucketName,
            Key: key
        };

        try {
            const command = new GetObjectCommand(params);
            const response = await s3Client.send(command);
            return response.Body.toString('utf-8');
        } catch (error) {
            console.error(`Error getting CSV content for ${key}:`, error.message);
            return null;
        }
    }

    function displayCSVContent(csvContent) {
        if (!csvContent) {
            return ''; // If content is null or empty, return empty string
        }

        const rows = csvContent.trim().split('\n');
        const headers = rows[0].split(',');

        let tableHTML = '<table border="1"><tr>';
        for (const header of headers) {
            tableHTML += `<th>${header}</th>`;
        }
        tableHTML += '</tr>';

        for (let i = 1; i < rows.length; i++) {
            const rowValues = rows[i].split(',');
            tableHTML += '<tr>';
            for (const value of rowValues) {
                tableHTML += `<td>${value}</td>`;
            }
            tableHTML += '</tr>';
        }

        tableHTML += '</table>';
        return tableHTML;
    }

    // async function dbfunctiontodisplaydata() {
        
    // }

    app.post('/chatbot', async (req, res) => {
        // Correct extraction from req.body.payload
        console.log(req.body)
        const { fileTypes, utypename } = req.body;
        // Check for the presence of fileTypes and utypename
        if (!fileTypes || !utypename) {
            console.error('Missing fileTypes or utypename in payload');
            return res.status(400).json({ error: 'Missing fileTypes or utypename in payload' });
        }

        try {
            let firstResponse = null;

            // Example of iterating over fileTypes array
            for (const fileType of fileTypes) {
                console.log(fileType); // Do something with each fileType
                const filesWithDetails = await listFilesWithDetails(bucketName, fileType, utypename);
                
                // Check if filesWithDetails is not empty
                if (filesWithDetails.length > 0) {
                    firstResponse = filesWithDetails;
                    break; // Exit loop if response is obtained
                }
            }

            if (!firstResponse) {
                res.status(404).json({ message: 'No data available' });
            } else {
                res.json(firstResponse);
            }
        } catch (error) {
            console.error('Error fetching files with details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.post('/process-selected-files', (req, res) => {
        try {
        const selectedFiles = req.body.selectedFileUrls; // Access selectedFileUrls from the request body
        
        // Process the selected files here, for example, send them to another backend or perform any other action
        console.log('Selected Files:', selectedFiles);
        opaibot(selectedFiles)
        
        // Send a response indicating success
        res.status(200).json({ message: 'Selected files received and processed successfully' });
        } catch (error) {
        // If an error occurs, send a 500 internal server error response
        console.error('Error processing selected files:', error);
        res.status(500).json({ error: 'Internal server error' });
        }
    });
    
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
    

    async function opaibot(selectedFiles){
    console.log(selectedFiles)
    }