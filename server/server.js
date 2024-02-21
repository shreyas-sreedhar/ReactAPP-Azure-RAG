const { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand, GetObjectTaggingCommand } = require("@aws-sdk/client-s3");
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

require('dotenv').config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
const yaml = require('js-yaml');
const fs = require('fs');


const apiKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = "us-east-2"
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

let jsonData = {
    user_type: "", 
    catalogs: []   
  };
  


function addCatalog(catalogName, domain) {
    const catalog = {
      catalog_name: catalogName,
      domain: domain,
      objects: []
    };
    jsonData.catalogs.push(catalog);
  }
  

  function addObject(catalogIndex, objectType) {
    const object = {
      type: objectType,
      files: []
    };
    jsonData.catalogs[catalogIndex].objects.push(object);
  }
  

  function addFile(catalogIndex, objectIndex, fileType, fileName, fileURL) {
    const file = {
      file_type: fileType,
      file_name: fileName,
      file_url: fileURL
    };
    jsonData.catalogs[catalogIndex].objects[objectIndex].files.push(file);
  }
  
// // Function to fetch all catalogs
function getAllCatalogs() {
    return jsonData.catalogs;
  }
  
  // Function to fetch a specific catalog by its name
  function getCatalogByName(catalogName) {
    return jsonData.catalogs.find(catalog => catalog.catalog_name === catalogName);
  }
  
  // Function to fetch all objects within a catalog
  function getAllObjectsInCatalog(catalogName) {
    const catalog = getCatalogByName(catalogName);
    return catalog ? catalog.objects : [];
  }
  
  // Function to fetch specific objects based on their type
  function getObjectsByType(catalogName, objectType) {
    const objects = getAllObjectsInCatalog(catalogName);
    return objects.filter(object => object.type === objectType);
  }
  
//Consolelogs 
  console.log("All catalogs:", getAllCatalogs());
  console.log("Catalog by name:", getCatalogByName("Catalog 1"));
  console.log("All objects in catalog:", getAllObjectsInCatalog("Catalog 1"));
  console.log("Objects by type:", getObjectsByType("Catalog 1", "Object 1"));

  
  console.log(jsonData); // Updated JSON data
  console.dir(jsonData, { depth: null });

  async function fetchJSONData(filePath) {
    try {
      // Retrieve JSON data from S3 bucket
      const data = await s3Client.send(new GetObjectCommand({ Bucket: BUCKET_NAME, Key: filePath }));
      return JSON.parse(data.Body.toString('utf-8'));
    } catch (error) {
      console.error('Error fetching JSON data:', error);
      throw error;
    }
  }
  
  async function updateJSONDataInS3(data, filePath) {
    try {
      // Convert JSON data to string
      const jsonDataString = JSON.stringify(data);
      
      // Upload JSON data to S3 bucket
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
        Body: jsonDataString,
        ContentType: 'application/json'
      }));
  
      console.log(`JSON data updated in S3: ${filePath}`);
    } catch (error) {
      console.error('Error updating JSON data in S3:', error);
      throw error;
    }
  }


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

app.get('/existing-catalogs', async (req, res) => {
    try {
      // Fetch JSON data from S3 bucket
      const jsonData = await fetchJSONData('catalogs.json');
  
      // Send JSON data as response
      res.json(jsonData.catalogs);
      console.log("this is catalogs" +jsonData.catalogs)
    } catch (error) {
      console.error('Error fetching existing catalogs:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const fetchSelectedDomainsData = async (selectedDomains, loggedUser) => {
    try {
        if (!selectedDomains) {
            console.error('Selected domains are not defined.');
            return; // Exit the function if selectedDomains is undefined
        }

        let selectedDomainData = [];
        console.log("Fetching selected domains:", selectedDomains);
        console.log("Fetching for logged user:", loggedUser);

        for (const domain of selectedDomains) {
            const listParams = {
                Bucket: process.env.S3_BUCKET_NAME,
            };

            console.log("List params:", listParams);

            const { Contents } = await s3Client.send(new ListObjectsV2Command(listParams));

            if (Contents && Array.isArray(Contents)) {
                for (const item of Contents) {
                    console.log(`Processing object: ${item.Key}`);

                    const getObjectTaggingParams = {
                        Bucket: process.env.S3_BUCKET_NAME,
                        Key: item.Key,
                    };

                    const { TagSet } = await s3Client.send(new GetObjectTaggingCommand(getObjectTaggingParams));
                    console.log(`Object tags for ${item.Key}:`, JSON.stringify(TagSet));

                    const domainTag = TagSet.find(tag => tag.Key === `${domain}_${loggedUser}`);
                    
                    if (domainTag && domainTag.Value === loggedUser) {
                        console.log(`Object ${item.Key} matches loggedUser: ${loggedUser}`);
                        selectedDomainData.push({
                            domain: domain,
                            file_name: item.Key.split('/').pop(), // Extract file name from S3 object key
                            file_path: item.Key, // Full file path in S3 bucket
                        });
                    } else {
                        console.log(`Object ${item.Key} does not match loggedUser: ${loggedUser}`);
                    }
                }
            }
        }

        console.log('Selected domain data:', JSON.stringify(selectedDomainData));
        return selectedDomainData;
    } catch (error) {
        console.error('Error fetching or processing data:', error);
        throw error;
    }
};



// app.post('/selected-domains', async (req, res) => {
//     try {
//         // Extract selected domain names from request body
//         const selectedDomains = req.body.selectedDomains;
//         const theUser = req.body.uType;
//         console.log("User type:", theUser);
//         console.log("Selected domains:", selectedDomains);

//         // Fetch data tagged under selected domain names from S3 bucket
//         const selectedDomainsData = await fetchSelectedDomainsData(selectedDomains, theUser);
        
//         // Send the fetched data as response
//         res.send(selectedDomainsData);

//         // Log the fetched data correctly
//         console.log("selectedDomainsData:", selectedDomainsData);
//     } catch (error) {
//         console.error('Error fetching selected domains data:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

app.post('/selected-domains', async (req, res) => {
    try {
        // Extract selected domain names and user type from request body
        const selectedDomains = req.body.selectedDomains;
        const theUser = req.body.uType;

        // Fetch data tagged under selected domain names from S3 bucket
        const selectedDomainsData = await fetchSelectedDomainsData(selectedDomains, theUser);
        
        // Specify your S3 bucket name and key prefix
        const bucketName = process.env.S3_BUCKET_NAME;
        const keyPrefix = 'selectedDomainsData';

        // Upload the data to S3 and get the file URL
        const dataUrl = await uploadDataToS3(selectedDomainsData, bucketName, keyPrefix, theUser);

        // Send the URL of the uploaded file as the response
        res.json({ url: dataUrl });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Function to upload data to S3 and return the file URL
async function uploadDataToS3(data, bucketName, keyPrefix, theUser) {
    // const timestamp = Date.now();
    const key = `${keyPrefix}/${theUser}.json`;
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: JSON.stringify(data),
        ContentType: 'application/json'
    };

    try {
        await s3Client.send(new PutObjectCommand(params));
        return `https://${bucketName}.s3.amazonaws.com/${key}`;
    } catch (error) {
        console.error('Error uploading data to S3:', error);
        throw error;
    }
}

function loadDatabaseConfig() {
    try {
      return yaml.load(fs.readFileSync('./idk.yml', 'utf8'));
    } catch (e) {
      console.error(e);
      return [];
    }
  }
  
  app.get('/api/database-details', (req, res) => {
    const data = loadDatabaseConfig();
    console.log(data)
    res.json(data.tables || []);
  });
  
  