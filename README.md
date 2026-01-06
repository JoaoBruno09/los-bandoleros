# 🏴‍☠️ Los Bandoleros

Los Bandoleros is a Distributed Systems application developed during my Master’s degree, focused on the design and implementation of a Service-Oriented Architecture (SOA) using RESTful APIs compliant with the Richardson Maturity Model (Level 3 – HATEOAS).
The platform manages plans, subscriptions, authentication, and dashboards, emphasizing scalability, fault tolerance, security, and service autonomy.

This project demonstrates advanced distributed systems concepts such as load balancing, redundancy, stateless services, API Gateway security, asynchronous communication, and mature REST API design.

## 🔍 Key Features
- <b>Microservices Architecture:</b> Deployed with multiple instances (3 for Plans, 2 for Subscriptions) to ensure scalability and service redundancy.
- <b>Richardson Maturity Model – Level 3 (HATEOAS):</b> REST APIs expose hypermedia links that guide clients through available actions and resource transitions.
- <b>Service-Oriented Architecture (SOA):</b> Independent microservices for Plans, Subscriptions, and Dashboard.
- <b>API Gateway with Authentication:</b> Secure access to private resources using JWT tokens.
- <b>Scalability:</b> Multiple service instances with load balancing support.
- <b>Fault Tolerance:</b> Redundant services and MongoDB clustering for high availability.
- <b>RESTful API Design:</b> Clear resource naming, HTTP verbs, and standardized response codes.
- <b>Real-Time Metrics:</b> Asynchronous communication for dashboard data.
- <b>OpenAPI Documentation:</b> API discovery through standardized API contracts.

## 🧭 REST API Maturity (Richardson Maturity Model)

The Los Bandoleros REST API fully implements the Richardson Maturity Model, achieving Level 3 (HATEOAS):

✔ Level 0 – The Swamp of POX - Avoided. The system does not rely on RPC-style calls or a single endpoint. <br>
✔ Level 1 – Resources - Clear and meaningful resource identifiers <br>
✔ Level 2 – HTTP Verbs & Status Codes - Proper use of HTTP methods: GET, POST, PUT, PATCH DELETE and correct HTTP status codes to represent success and failure scenarios. <br>
✔ Level 3 – Hypermedia as the Engine of Application State (HATEOAS) - Responses include hypermedia links for: Available next actions, Related resources, Valid state transitions. So, clients can navigate the API dynamically without prior knowledge of URI structures. <br>

💯 Current Maturity Level: Level 3 (HATEOAS) ✅

## 🧩 Architecture Overview

| Service               | Instances | Description                                                     |
| --------------------- | --------- | --------------------------------------------------------------- |
| Plans Service         | 3         | Handles plan lifecycle and exposes hypermedia-driven navigation |
| Subscriptions Service | 2         | Manages subscriptions and devices with HATEOAS links            |
| Dashboard Service     | 1         | Provides aggregated metrics asynchronously                      |
| Auth (API Gateway)    | 1         | Handles authentication and JWT validation                       |

<img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/cafaa551-0dca-403d-9b26-44f014c92897" />

## 🔗 API Endpoints

<b>Authentication</b>
- POST /auth/login

<b>Plans Service</b>
- GET /plan
- POST /plan
- GET /plan/{pid}
- PUT /plan/{pid}
- POST /plan/{pid}
- DELETE /plan{pid}
- PATCH /plan/{pid}
- PATCH /plan/{pid}/promotion
- GET /plan/{pid}/history
  
<b>Subscriptions Service</b>
- POST /subscription/plan/{pid}
- GET /subscription/{uid}
- PUT /subscription/{uid}
- DELETE /subscription/{uid}
- GET /subscription/{uid}/devices
- POST /subscription/{uid}/devices
- PUT /subscription/{uid}/devices/{did}
- DELETE /subscription/{uid}/devices/{did}
- PUT /subscription/{opid}/migration/{npid}

<b>Dashboard Service</b>
- GET /dashboard
- GET /dashboard/cashflow
- GET /dashboard/revenue

## 🔐 Security

- JWT-based authentication handled at the API Gateway
- Role-based access for private endpoints
- Stateless services to support horizontal scaling

## 🧠 Distributed Systems Characteristics

- <b>Heterogeneity:</b> REST-compliant services following SOA principles
- <b>Scalability:</b> Horizontal scaling through multiple service instances
- <b>Failure Handling:</b> Redundant services and MongoDB primary/secondary clusters
- <b>Statelessness:</b> Client-side or database-persisted session state
- <b>Service Autonomy:</b> Independent services with strong isolation
- <b>Loose Coupling:</b> Reduced inter-service dependencies
- <b>Discoverability:</b> OpenAPI-based documentation

## 👨‍💻 Technologies
<div style="display: inline_block"><br> 
<img align="center" alt="Ts" height="40" width="40" src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-plain.svg">
<img align="center" alt="NodeJS" height="40" width="40" src="https://github.com/devicons/devicon/blob/master/icons/nodejs/nodejs-original.svg"> 
<img align="center" alt="Express" height="40" width="40" src="https://github.com/devicons/devicon/blob/master/icons/express/express-original.svg"> 
<img align="center" alt="MongoDB" height="40" width="40" src="https://github.com/devicons/devicon/blob/master/icons/mongodb/mongodb-original.svg"> 
<img align="center" alt="Docker" height="40" width="40" src="https://github.com/devicons/devicon/blob/master/icons/docker/docker-original.svg"> 
<img align="center" alt="JWT" height="40" width="40" src="https://cdn.worldvectorlogo.com/logos/jwt-3.svg">
</div>

## 📂 Repository Structure

The repository is organized as follows:

- `api-gateway`: API Gateway configuration and models 
- `docs`: API Swagger documentation json file and application diagrams
- `postman`: Postman collections and schemas
- `services\auth`: Auth Service with its configs, models and routes
- `services\plans`: Plans Service with its configs, models and routes
- `services\subscriptions`: Subscriptions Service with its configs, models and routes

## Prerequisites 📋

- Typescript
- Node.js (LTS)
- Docker & Docker Compose
- MongoDB
- REST client (Postman / Insomnia)

## 🌟 Additional Resources

[Richardson Maturity Model](https://martinfowler.com/articles/richardsonMaturityModel.html)<br>
[REST API Design Best Practices](https://restfulapi.net/)<br>
[OpenAPI Specification](https://swagger.io/specification/)<br>
[JWT Introduction](https://www.jwt.io/introduction#what-is-json-web-token)
