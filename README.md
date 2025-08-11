# Vehicle Health Dashboard

A real-time vehicle monitoring dashboard with AI-powered chatbot support and predictive analytics.

## Features

- 🚗 **Real-time Vehicle Monitoring**: Live updates every 10 seconds
- 🤖 **AI Chatbot**: Interactive assistant for vehicle diagnostics  
- 📊 **Predictive Analytics**: Battery health prediction and maintenance insights
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 🎨 **Modern UI**: Automotive-themed design with status indicators

## API Integration

The dashboard integrates with localhost API endpoints to fetch real-time vehicle data.

### Required API Endpoints

#### GET /api/vehicle/status
Returns current vehicle status data:

```json
{
  "battery": {
    "level": 87,
    "temperature": 32
  },
  "engine": {
    "temperature": 195,
    "oilPressure": 45
  },
  "brakes": {
    "fluidLevel": 85
  },
  "tires": {
    "pressure": 31
  }
}
```

### Setting up Local API Server

To test with real data, you'll need a local API server running on `localhost:3001`. Here's a simple Express.js example:

```javascript
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock vehicle data endpoint
app.get('/api/vehicle/status', (req, res) => {
  res.json({
    battery: {
      level: Math.floor(Math.random() * 100),
      temperature: Math.floor(Math.random() * 25) + 20
    },
    engine: {
      temperature: Math.floor(Math.random() * 40) + 180,
      oilPressure: Math.floor(Math.random() * 30) + 30
    },
    brakes: {
      fluidLevel: Math.floor(Math.random() * 100)
    },
    tires: {
      pressure: Math.floor(Math.random() * 10) + 25
    }
  });
});

app.listen(3001, () => {
  console.log('Vehicle API server running on http://localhost:3001');
});
```

**URL**: https://lovable.dev/projects/c063f8c8-514d-4e6f-bd6d-95d2a4ab6c73

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c063f8c8-514d-4e6f-bd6d-95d2a4ab6c73) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c063f8c8-514d-4e6f-bd6d-95d2a4ab6c73) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
