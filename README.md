# QuickNotes System Design

## Description
QuickNotes is a scalable, full-stack note-taking application designed to support 1 million users. This repository contains the frontend API client (built with vanilla HTML/CSS/JS) and the comprehensive system design documentation, including REST API specifications, relational database schemas, and high-availability cloud architecture.

## How to run the API client
1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/quicknotes-system-design.git
   cd quicknotes-system-design
   
2. Open the index.html file in any modern web browser (e.g., Chrome, Firefox, Edge).
(Note: No build steps or local servers are required for the frontend client, as it communicates directly with the JSONPlaceholder practice API).

## Links to the three documents
The backend system design is detailed in the following three documents located in the docs/ folder:
[API Design](docs/api-design.md)
[Data Model](docs/data-model.md)
[Architecture](docs/architecture.md)

## What I learned
1. RESTful API Design: I learned how to structure standardized REST endpoints, implement proper HTTP status codes, and design consistent JSON error responses for robust client-side handling.
2. Relational Database Modeling: I gained practical experience designing normalized SQL schemas, utilizing JOIN operations, and applying indexes to optimize query performance for high-read environments.
3. Scalable System Architecture: I learned to design for high availability by incorporating load balancers, read replicas, and caching layers, while explicitly identifying and mitigating Single Points of Failure (SPOF).