// import { S3Client, ListObjectsV2Command, GetObjectTaggingCommand } from "@aws-sdk/client-s3";
const { S3Client, ListObjectsV2Command, GetObjectCommand, GetObjectTaggingCommand } = require("@aws-sdk/client-s3");

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


const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
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



app.use(bodyParser.json());


// async function listFilesWithDetails(bucketName, fileTypes, utypename) {
    
//     const params = {
//         Bucket: 'bucketName',
//     };

// }




app.post('/chatbot', async (req, res) => {
    console.log(req.body);
    const { fileTypes, utypename } = req.body;

    const params = {
        Bucket: bucketName,
    };

    try {
        const data = await s3Client.send(new ListObjectsV2Command(params));
        console.log("Data from S3:", data);

        const files = [];

        for (const obj of data.Contents) {
            try {
                const tagging = await s3Client.send(new GetObjectTaggingCommand({ Bucket: bucketName, Key: obj.Key }));
                const departmentTag = tagging.TagSet.find(tag => tag.Key === "department");
                console.log("Tags for object:", obj.Key, tagging.TagSet);
            

                if (obj.Key && departmentTag && departmentTag.Value === utypename) {
                    const filename = obj.Key.split('/')[1]; // Assuming the filename is the third part of the Key
                    files.push({
                        fileName: filename,
                        fileURL: `https://${bucketName}.s3.amazonaws.com/${obj.Key}` // Assuming the bucket is not configured for website hosting
                    });
            
            }
            } catch (err) {
                console.error(`Error fetching tags for object ${obj.Key}:`, err);
                // Handle the error appropriately
                // You might want to continue or break the loop depending on the error
            }
        }

        console.log("Filtered files:", files);
        res.json(files); // Send the files array as the response
    } catch (err) {
        console.error('Error retrieving files from S3:', err);
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


async function opaibot(selectedFiles) {
    console.log(selectedFiles)
}


