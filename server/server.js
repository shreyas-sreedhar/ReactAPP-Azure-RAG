const { S3Client, ListObjectsV2Command,ListObjectsCommand, GetObjectCommand, PutObjectCommand, GetObjectTaggingCommand } = require("@aws-sdk/client-s3");
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

app.get('/api/existing-catalogs', async (req, res) => {
    try {
   
      const jsonData = await fetchJSONData('catalogs.json');
  
     
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
            return; 
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
        
        const selectedDomains = req.body.selectedDomains;
        const theUser = req.body.uType;

        
        const selectedDomainsData = await fetchSelectedDomainsData(selectedDomains, theUser);
        
       
        const bucketName = process.env.S3_BUCKET_NAME;
        const keyPrefix = 'selectedDomainsData';

        const dataUrl = await uploadDataToS3(selectedDomainsData, bucketName, keyPrefix, theUser);

      
        res.json({ url: dataUrl });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



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
  
  app.post('/database-details', (req, res) => {
    const data = loadDatabaseConfig();
    console.log(data)
    res.json(data.tables || []);
  });
  
  const path = require('path');
  
  // app.post('api/saveSelectedBuckets', (req, res) => {
  //     // Get the selected buckets data and data source name from the request body
  //     const { selectedBuckets, dataSourceName } = req.body;
      
  
  //     // Define the directory path where you want to save the file
  //     const directoryPath = "../src/components/common/DataSourceLayer/"; // Replace this with your custom directory path
  
  //     // Ensure the directory exists, if not, create it
  //     if (!fs.existsSync(directoryPath)) {
  //         fs.mkdirSync(directoryPath, { recursive: true });
  //     }
  
  //     // Define the file path
  //     const filePath = path.join(directoryPath, 'selectedBuckets.json');
  
  //     // Write the selected buckets data and data source name to the JSON file
  //     const jsonData = JSON.stringify({ selectedBuckets, dataSourceName });
  //     console.log(jsonData);
  
  //     fs.writeFile(filePath, jsonData, (err) => {
  //         if (err) {
  //             console.error('Error writing to file:', err);
  //             res.status(500).json({ error: 'An error occurred while saving the selected buckets.' });
  //         } else {
  //             console.log('Selected buckets data saved successfully.');
  //             res.status(200).json({ message: 'Selected buckets data saved successfully.' });
  //         }
  //     });
  // });
  app.post('api/saveSelectedBuckets', (req, res) => {
    // Get the selected buckets data and data source name from the request body
    const { selectedBuckets, dataSourceName } = req.body;
    

    // Define the directory path where you want to save the file
    const directoryPath = "../src/components/common/DataSourceLayer/"; // Replace this with your custom directory path

    // Ensure the directory exists, if not, create it
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Define the file path
    const filePath = path.join(directoryPath, 'selectedBuckets.json');

    // Write the selected buckets data and data source name to the JSON file
    const jsonData = JSON.stringify({ selectedBuckets, dataSourceName });
    console.log(jsonData);

    fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).json({ error: 'An error occurred while saving the selected buckets.' });
        } else {
            console.log('Selected buckets data saved successfully.');
            res.status(200).json({ message: 'Selected buckets data saved successfully.' });
        }
    });
});
app.post('/saveSelectedBuckets', (req, res) => {
  // Get the selected buckets data and data source name from the request body
  const { selectedBuckets, dataSourceName } = req.body;
  

  // Define the directory path where you want to save the file
  const directoryPath = "../src/components/common/DataSourceLayer/"; // Replace this with your custom directory path

  // Ensure the directory exists, if not, create it
  if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Define the file path
  const filePath = path.join(directoryPath, 'selectedBuckets.json');

  // Write the selected buckets data and data source name to the JSON file
  const jsonData = JSON.stringify({ selectedBuckets, dataSourceName });
  console.log(jsonData);

  fs.writeFile(filePath, jsonData, (err) => {
      if (err) {
          console.error('Error writing to file:', err);
          res.status(500).json({ error: 'An error occurred while saving the selected buckets.' });
      } else {
          console.log('Selected buckets data saved successfully.');
          res.status(200).json({ message: 'Selected buckets data saved successfully.' });
      }
  });
});

  app.post('/api/chatbotdata', (req, res) => {
    const jsonData = req.body; // Assuming data is sent in the request body

    console.log('Received data:', jsonData);

    // Define the directory path where you want to save the file
    const directoryPath = "../src/components/common/DataSourceLayer/"; // Replace this with your custom directory path

    // Ensure the directory exists, if not, create it
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    const filePath = path.join(directoryPath, 'chatbotData.json');

    // Write the received JSON data to a JSON file
    fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
            console.error('Error writing data to file:', err);
            res.status(500).json({ error: 'Failed to store data' });
        } else {
            console.log('Data stored successfully');
            res.status(200).json({ message: 'Data stored successfully' });
        }
    });
});


const fetchS3Buckets = async () => {
  try {
      const bucketDescriptions = {};

      const listSubfoldersRecursive = async (prefix) => {
          const response = await s3Client.listObjectsV2({ Bucket: process.env.AWS_BUCKET_NAME, Prefix: prefix }).promise();

          
          const subfolders = response.CommonPrefixes.map(commonPrefix => commonPrefix.Prefix);

          
          const category = prefix.replace(/\//g, ''); // Extract category from prefix
          bucketDescriptions[category] = {};

          for (const subfolder of subfolders) {
              const subfolderName = subfolder.replace(prefix, '').replace('/', ''); // Extract subfolder name
              const subfolderPrefix = subfolder;

              // Recursively fetch subfolders of the current subfolder
              const subSubfolders = await listSubfoldersRecursive(subfolderPrefix);

              // Add subfolder and its subfolders to the category
              bucketDescriptions[category][subfolderName] = subSubfolders;
          }
      };

      // Start recursive listing for each top-level folder
      const topLevelFoldersResponse = await s3Client.listObjectsV2({ Bucket: process.env.AWS_BUCKET_NAME, Delimiter: '/' }).promise();
      const topLevelFolders = topLevelFoldersResponse.CommonPrefixes.map(commonPrefix => commonPrefix.Prefix);
      
      for (const folder of topLevelFolders) {
          await listSubfoldersRecursive(folder);
      }

      return bucketDescriptions;
  } catch (error) {
      console.error('Error fetching S3 buckets:', error);
      throw error;
  }
};
 
app.get('/api/fetchawsdata', async (req, res) => {
  try {
      // Your fetchS3Buckets function goes here (assuming you have defined it)
      const bucketDescriptions = await fetchS3Buckets();

      // Send the bucketDescriptions as the response
      res.json(bucketDescriptions);
  } catch (error) {
      console.error('Error:', error);
      // Send an error response
      res.status(500).json({ error: 'Failed to fetch AWS data' });
  }
});

const fetchSubfoldersFromAWS = async (bucketName, folderPath, depth) => {
  try {
      // Base case: If depth is 0, return an empty array
      if (depth === 0) {
          return [];
      }

      const params = {
          Bucket: bucketName,
          Prefix: folderPath,
          Delimiter: '/'
      };

     // Fetch objects from AWS S3
const data = await s3Client.send(new ListObjectsCommand(params));

// Extract subfolder names
const subfolders = data.CommonPrefixes ? data.CommonPrefixes.map(obj => obj.Prefix.replace(folderPath, '').replace('/', '')) : [];

// Extract file names if Contents is defined
const files = data.Contents ? data.Contents.filter(obj => !obj.Key.endsWith('/')).map(obj => obj.Key.replace(folderPath, '')) : [];

      // Recursively fetch subfolders up to the specified depth
      const subfolderPromises = subfolders.map(async (subfolder) => {
          const subfolderPath = subfolder ? `${folderPath}${subfolder}/` : folderPath;
          const subSubfolders = await fetchSubfoldersFromAWS(bucketName, subfolderPath, depth - 1);
          return { [subfolder]: subSubfolders };
      });

      // Wait for all subfolder promises to resolve
      const resolvedSubfolders = await Promise.all(subfolderPromises);

      const objects = [...resolvedSubfolders, ...files];
      return objects;
  } catch (error) {
      console.error('Error fetching subfolders from AWS:', error);
      throw error;
  }
};

// Function to initialize backend
const initializeBackend = async () => {
  try {
      // Read environment variables
      const bucketName = "shreyaswapi";
      const folderPath = "LLM2/";
      const depth = 3; // Specify the depth of traversal

      // Fetch subfolders from AWS up to the specified depth
      const subfolders = await fetchSubfoldersFromAWS(bucketName, folderPath, depth);

      // Construct JSON object with fetched subfolders
      const jsonObject = { [folderPath]: subfolders };
      const existingData = require('../src/components/common/DataSelectionLayer/data.json');
      const combinedData = { ...existingData, ...subfolders };
      // Write JSON object to the file
      fs.writeFileSync("../src/components/common/DataSelectionLayer/newdata.json", JSON.stringify(combinedData, null, 2));

      console.log('Subfolders fetched from AWS and updated in JSON file successfully.');
  } catch (error) {
      console.error('Error initializing backend:', error);
  }
};


// initializeBackend();
module.exports = app;