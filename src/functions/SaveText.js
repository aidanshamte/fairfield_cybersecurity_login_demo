const { app } = require('@azure/functions');
const { BlobServiceClient } = require('@azure/storage-blob');

app.http('SaveText', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        try {
            const body = await request.json();
            const textData = body.text;

            if (!textData) {
                return { status: 400, body: "Please pass a 'text' property in your JSON body." };
            }

            const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;
            const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);
            const containerClient = blobServiceClient.getContainerClient('user-uploads');

            const fileName = `log-${Date.now()}.txt`;
            const blockBlobClient = containerClient.getBlockBlobClient(fileName);

            await blockBlobClient.upload(textData, textData.length);

            return { 
                status: 200, 
                jsonBody: { message: `Successfully saved ${fileName} to Azure!` } 
            };
        } catch (err) {
            return { status: 500, body: `Server error: ${err.message}` };
        }
    }
});