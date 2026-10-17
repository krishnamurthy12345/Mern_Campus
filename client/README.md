# CampusReview — Client

## Overview

CampusReview is a college review platform built with React and Vite. It allows users to explore colleges, submit reviews, manage their reviews, and access role-based features.

## Tech Stack

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Router (if used in the project)

## Features

- User registration and login
- Browse colleges and view college details
- Submit and manage college reviews
- View My Reviews
- Admin dashboard for college management
- Role-based access for students and administrators
- Responsive user interface

## Prerequisites

- Node.js and npm
- CampusReview backend running locally

## Installation

Open a terminal in the `client` directory and run:

```bash
npm install
```

## Environment Configuration

Configure the backend API URL in your API service file, such as `src/services/api.js`.

Default local backend URL:

```text
http://localhost:5000/api
```

Update this URL if your backend uses a different port or is deployed.

## Run the Development Server

```bash
npm run dev
```

Open the URL displayed in the terminal, typically:

```text
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

## Preview the Production Build

```bash
npm run preview
```

## Project Structure

```text
client/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── README.md
```

## Notes

- Start the backend before using features that require API access.
- Never commit passwords, API keys, or other secrets to the repository.
- Update the API base URL when deploying the application.
