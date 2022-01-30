# Dear Blueno Backend

## Environment Variables

To develop locally, you can use the following environment variables (use a `.env` file to store them):

```
PORT = 5000
CLIENT_URL = "http://localhost:3000"
GOOGLE_CALLBACK_URL = "http://localhost:5000/auth/google/callback"
MONGODB_URI = "mongodb+srv:// ... ?retryWrites=true&w=majority"
GOOGLE_CLIENT_ID = "... .apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET = "..."
SESSION_SECRET = "..."
VERIFIED_GOOGLE_SHEET_ID = "..."
UNVERIFIED_GOOGLE_SHEET_ID = "..."
TESTING_GOOGLE_SHEET_ID = "..."
GOOGLE_SHEET_CLIENT_EMAIL = "...@... .iam.gserviceaccount.com"
GOOGLE_SHEET_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n ... \n-----END PRIVATE KEY-----\n"
```

## Getting Started with Express

The backend portion of this project is powered by [Express](https://expressjs.com/).

### Available Scripts

In the project directory, you can run:

#### `npm install`

Installs the backend dependencies necessary for development.

#### `npm start`

Runs the backend in the development mode.\
Open [http://localhost:5000](http://localhost:5000) to view it in your favorite REST client.

#### `npm test`

Runs the backend test suites.\
If you changed the backend code, you should run this script before committing.\
Alternatively, you can run `npm run coverage` to run the test suites with code coverage analysis.
