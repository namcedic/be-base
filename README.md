## Docs

- Swagger:
  <a href="http://localhost:3000/docs" target="blank">http://localhost:3000/docs
</a>

## Requirements
- Node.js >= 20, yarn >= 1.22
- mysql
- Redis

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
``` 

## Database
**Create migration**
```bash
$ npm run migration:generate [name] # filename
```
**Run migration**
```bash
$ npm run migration:run
```

**Seed data**
```bash
// Clean database first
$ npm run schema:drop

// Seed database
$ npm run db:seed
```

## Coding Rules

**Each module will contain the following parts:**

- **controller:**
  - define routers of modules.
- **service:**
  - define business logic.
  - *. Example: when creating a user, we need to validate the existing user, and then insert the user to the database. Those will be defined in service.*
- **repository:**
  - define actions that are related to databases such as: create, update, delete
- **validator**:
  - Please define a validator function before inserting anything into the database. It is important to ensure data accuracy and integrity.
  - All validator functions must call in the service.
- **mapper:**
  - All raw data before a response to API must go through the mapper to protect sensitive data.
- **dto:**
  - Define request, response type, or anything related to the type inside the module.
```
## Note:
- It is not recommended to call other modules when not needed. You can call the repository if you need to search information on related tables. *This rule will prevent inject dependencies loopback issues.*
- It is recommended to separate the modules based on their respective business logic.

*Updating...*

