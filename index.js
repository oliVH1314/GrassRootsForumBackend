const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const fs = require('fs');

const private_key = fs.readFileSync('private_key.txt', 'utf8').trim();

const app = express();
app.use(cors());
app.use(express.json());

const credentials = {
  client_email: 'grassrootsforum@grassrootsforum.iam.gserviceaccount.com',
  private_key: private_key,
};

const spreadsheetId = '1NXHZ1E7-yTeD-NkS5H6Mw7fzkpKz5_1jdElVRpaPbWo';
const range = 'Sheet1';

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.post('/api/insert', async (req, res) => {
  const { username, email, town, postcode } = req.body;

  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[username, email, town, postcode]],
      },
    });

    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred', message: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
