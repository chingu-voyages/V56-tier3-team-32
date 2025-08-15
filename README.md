# SurgeVenger
<div align="left">
    <div style="display: inline-block;">
    <br>
	<img src="https://img.shields.io/github/last-commit/chingu-voyages/V56-tier3-team-32?style=default&logo=git&logoColor=white&color=474747" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/chingu-voyages/V56-tier3-team-32?style=default&color=474747" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/chingu-voyages/V56-tier3-team-32?style=default&color=474747" alt="repo-language-count">
  <img src="https://img.shields.io/github/contributors/chingu-voyages/V56-tier3-team-32?style=default&color=474747" alt="contributors">    
  </div>
</div>
<br clear="left"/>

##  Table of Contents

- [Table of Contents](#table-of-contents)
- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
- [Setup](#setup)
- [Database Config](#database-config)
- [User Stories](#user-stories)
- [Our Team](#our-team)
- [Contributor Graph](#contributor-graph)
- [Deployments](#deployments)

## Overview

The Surgery Center Status Board is a web application that enables surgical center staff to manage and track patient surgery progress. The application provides different interfaces for Admins, Surgical Team Members, and Guests. Admins enter patient information, Surgical Team Members update surgery statuses, and Guests can view anonymized status updates from the waiting area. The system improves operational visibility, reduces anxiety for waiting families, and ensures status updates are compliant with privacy regulations.

## Features

### Admin Features
- [X] Create new patient (auto-generate patient ID)
- [X] Edit patient info (except ID)
- [X] View patient details (Full)
- [ ] Add surgeries to tiers for statistics collection and hospital attractiveness
- [ ] Create more status options to expand later
- [ ] View analytics of status durations per patient to identify bottlenecks
- [ ] Restrict surgery team members to only see/edit assigned patients

### Surgery Team Features
- [X] Update patient surgery status
- [X] View patient details (Partial)
- [ ] Surgery team members can only manage assigned patients (per admin restriction)
- [ ] Get notifications when a patient is done with surgery to prep for next surgery

### Guest Features
- [ ] View hospital visitation guidelines and support information
- [ ] Subscribe to status updates to know when to pick up or visit

## 🔄 Shared Features (with Role Tags)
- [X] View status count dashboard _(Admin, Surgery Team)_
- [X] View patient list _(Admin, Surgery Team)_
- [X] Search patients by last name _(Admin, Surgery Team)_
- [X] Track status duration timers _(Admin, Surgery Team)_
- [X] Real-time status updates _(Admin, Surgery Team)_
- [X] View anonymized patient status board _(All Users)_
- [X] Fullscreen mode for waiting room displays of Status Board _(All Users)_
- [X] Auto-rotating patient display (10-second intervals) _(All Users)_
- [X] Color-coded status indicators _(All Users)_
- [ ] See patient’s surname initial and first name in Status Board for identification _(All Users)_
- [ ] Sort patients alphabetically _(Admin, Surgery Team)_

## Authentication & Security
- [X] Clerk Authentication integration
- [X] Role-based access control
- [X] JWT token authorization

## Global Platform Features
- [X] Google Gemini AI chat support
- [X] Application guidance and navigation help
- [X] Context-aware responses
- [X] PWA integration
- [X] App installaion capability
- [X] Offline functionality
- [X] Responsive mobile-first desgin
- [ ] Theme switching for user preference
- [ ] Enable multiple hospitals to subscribe with different staff/users (subscriptions)

##  Getting Started

###  Prerequisites

#### Node.js & Package Manager
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (or **yarn**: Version 1.22.0 or higher)

#### Database

The project uses [MongoDb Atlas](https://www.mongodb.com/products/platform/atlas-database). To set up the database:
1) Log in to MongoDb Atlas
2) Create a Cluster and the database
3) Create two users: one with read and write access. The other with readonly access.
4) Get connection strings for both users (will be used in environmental variables).

#### Authentication/Authorization

The project uses [Clerk](https://clerk.com/).

To set it up:
1) Log in to Clerk.
2) Setup a project.
3) Get the public and private keys (used in environmental variables).

#### AI

The project uses Gemini API as a chatbot.

To set it up: Follow [this guide](https://aistudio.google.com/app/apikey) to get the API key (it will be used as an environmental variable).

#### Environment Variables

You can store env variables in your computer, or inside `.env` files.

##### Backend

Do not expose the following variables in code or other place accessible for foreign entities:

- **`CLERK_SECRET_KEY`**: private key provided by Clerk allowing your backend server to validate JWTs (JSON Web Tokens) issued by Clerk.
- **`GEMINI_API_KEY`**: Credentials for accesing Gemini API chatbot.
- **`SURGERY_DATABASE_CONNECTION_CREDENTIALS`**: User credentials with Read/write access, pointing to a MongoDb database. Example: mongodb+srv://username:password@cluster_address/database_name.
- **`SURGERY_DATABASE_CONNECTION_READONLY_CREDENTIALS`**: User credentials with readonly access, pointing to a MongoDb database. Used for AI to make on readonly queries on the spot.

##### Frontend

- **`REACT_APP_CLERK_PUBLISHABLE_KEY`**: Clerk key used to enable frontend authentication.
- **`REACT_APP_BASE_URL`**: URL pointing to your backend service address.

### Running the project

To Clone the repository:

```
git clone https://github.com/chingu-voyages/V56-tier3-team-32.git
```

To run backend, execute:

```
cd V56-tier3-team-32/backend
npm install
npm run dev
```

To run frontend, execute:
(Note: Use another terminal to run frontend)

```
cd V56-tier3-team-32/frontend
npm install
npm start
```

## Our Team

- Hancke le Roux(Scrum master) #1: [GitHub](https://github.com/HawkCoding) / [LinkedIn](https://www.linkedin.com/in/hancke-chris-le-roux-19981206za/)
- Shivanand Gupta (Svont)(Developer) #2: [GitHub](https://github.com/Shivanand-0) / [LinkedIn](https://www.linkedin.com/in/ishivanandgupta/)
- Win Win Khaing (Thea) (Developer) #3: [GitHub](https://github.com/TheaWin) / [LinkedIn](https://www.linkedin.com/in/thea-win/)
- Evaldas Visockas (Developer) #4: [Github](https://github.com/EvalVis) / [LinkedIn](https://www.linkedin.com/in/evaldas-visockas/)
- Brandon Datch (Developer) #5: [GitHub](https://github.com/Brandon-Isaac) / [LinkedIn](https://linkedin.com/in/isaac-datch-947067288)
- Tunde Ademola Kujore (Product Owner) #6: [GitHub](https://github.com/Dhemmyhardy) / [LinkedIn](https://linkedin.com/in/tundeademolakujore/)

## <summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/chingu-voyages/V56-tier3-team-32/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=chingu-voyages/V56-tier3-team-32">
   </a>
</p>
</details>

## Deployments

The project uses [Vercel](https://vercel.com) for frontend deployments and [Render](https://render.com/) for backend deployments.

Development (dev branch)
- [Frontend](https://v56-tier3-team-32dev-git-dev-evaldas-projects-1b81790e.vercel.app/)
- [Backend](https://surgery-status.onrender.com)

Production (main branch)
- [Frontend](https://v56-tier3-team-32main.vercel.app)
- [Backend](https://v56-tier3-team-32.onrender.com)
