# BizScout

BizScout is a full-stack application designed to help freelance web developers find clients efficiently. Identifying a gap in the market where many small businesses needed web development services but lacked online visibility, I developed this application. It uses the Google Places API to locate businesses without websites, allowing freelancers to reach out to potential clients. The application features user authentication, bookmarking, and search functionalities, with both frontend and backend development handled.

## Demo

Watch the video below to see a demonstration of the BizScout application in action:

[![BizScout Demo](https://img.youtube.com/vi/KB7oE8q5B4U/maxresdefault.jpg)](https://www.youtube.com/watch?v=KB7oE8q5B4U)`

## Features

- **Search Functionality**: Search for businesses using the Google Places API, with results displayed in a user-friendly format.
- **User Authentication**: Secure login with Google OAuth 2.0 using Passport.js.
- **Bookmarking**: Save and manage favorite places.

## Project Structure

- **`client`**: Contains the frontend application built with React.
  - **`src/components`**: Includes React components such as `Search`, `Login`, and `Navbar`.
  - **`src/App.js`**: Main application file with routing and state management.
  - **`src/index.js`**: Entry point for the React application.
- **`server`**: Contains backend services.
  - **`LoginServer.js`**: Handles authentication using Passport.js.
  - **`SearchServer.js`**: Fetches and serves place data using the Google Places API.
- **`package.json`**: Manages dependencies and scripts for both client and server.

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- MongoDB

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/BizScout.git
    cd BizScout
    ```

2. **Install dependencies**:
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

3. **Start the application**:
    ```bash
    npm start
    ```

### Environment Variables

Ensure you have the necessary environment variables set up. You may need to configure your `.env` files for both the client and server environments. Required variables include:

- **Google Client ID**
- **Google Client Secret**
- **Google Places API Key**
- **MongoDB URI**
    
   
