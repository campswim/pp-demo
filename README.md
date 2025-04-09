# P&P Demo

A unique system that allows users to log into accounts containing sensitive information by saying or entering a predetermined PIN via telephone.

## Stack

I. Frontend

  A. React
  B. TailwindCSS

II. Backend

III. Database

  A. Postgres: an open-source SQL database.

  B. Supabase: an open-source backend-as-a-service (BaaS) platform that provides an easy way to set up a fully functional backend for web and mobile applications, including an auto-generated REST API based on the structure of the database.

  C. Prisma: an open-source ORM (Object-Relational Mapping) tool that allows for the querying and manipulation of database using JavaScript or TypeScript, without needing to write raw SQL queries, by generating a strongly typed API based on the database's schema.
  
    - Prisma server: A standalone infrastructure component sitting on top of your database.
    - Prisma client: An auto-generated library that connects to the Prisma server and lets you read, write and stream data in your database. It is used for data access in your applications.

## Instructions

### Supabase

[Docs](https://supabase.com/)

### [Prisma](https://www.prisma.io/docs)

[Prisma CRUD Documentation](https://www.prisma.io/docs/concepts/components/prisma-client/crud)

- Install prisma vs-code extension.
- Install Prisma: `npm install prisma --save-dev`
- Install the Prisma client: `npm install @prisma/client`
- Initialize Prisma: `npx prisma init`
- Push changes to the DB (one or the other):
  - Merge into the DB: `npx prisma migrate dev --name init`
  - Overwrite the DB: `npx prisma db push`
- To view the DB in a UI: `npx prisma studio`
- To avoid re-connecting to the DB when there's already a connection ([Prisma Instance](https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution)):
  - Create utils/db.ts
  - Add the following code:

  ```ts
  import { PrismaClient } from '@prisma/client';

  const prismaClientSingleton = () => {
    return new PrismaClient();
  };

  type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClientSingleton | undefined;
  };

  const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

  export default prisma;

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
  ```

### Connect Supabase with Prisma

- Log into your Supabase account.
- Click the Connect button in the navbar.
- Choose ORMs from the "Connect to your project" modal's navbar.
- Select Prisma and copy and paste the ENV values into your .env and the schema values into your prisma/schema.prisma file.

## User Stories

As a user, I’d like to:

- [ ] create a new account and configure my login credentials for both password and phone-and-pin authentication;
- [ ] record my PIN for authenticating via phone, during the setup stage;
- [ ] optionally record my safe word(s) via phone, during the setup stage;
- [ ] have my PIN and safe word(s) repeated to me during the setup stage, allowing me to confirm or change them;
- [ ] have access to a method of safely resetting my password and/or PIN and/or safe words, in the event that I forget them or otherwise feel they are in need of change, e.g., have been compromised;
- [ ] hear my safe word(s) via phone before I enter my PIN;
- [ ] be presented with clear instructions via phone about what to do when;
- [ ] hear a polite voice via phone with correct grammar and a proper salutation and valediction;
- [ ] log into my account:
  - [ ] with a password via the website or;
  - [ ] with a PIN via phone.
- [ ] see a spinner on the login page while the phone call is in progress;
- [ ] see a message on the webpage communicating the result of the authentication process, whether successful or otherwise;
- [ ] have at least three chances to enter my password or my PIN in the event that my previous attempt was unsuccessful;
- [ ] be logged into my account after successfully authenticating;
- [ ] be presented with a method for contacting customer support in the event that my attempts to authenticate fail;
- [ ] be presented with clear error messages in the event of a failure, whether on my part or that of the system, and a method for resolving the errors.

As an administrator, I’d like to:

- [ ] create customer accounts, e.g., a bank, under which to save UI settings and user account information;
- [ ] adjust the basic formatting of the demo’s UI to match the potential customer’s website, including:
  - [ ] the background color;
  - [ ] the banner color;
  - [ ] the company logo;
  - [ ] the navbar color, font style, and font size.
- [ ] create user accounts;
- [ ] edit users’ account details;
- [ ] delete users from the database;
- [ ] have access to the code base;
- [ ] have clear and concise documentation related to:
  - [ ] the deployment of the demo in a development environment;
  - [ ] the deployment of the demo in a production environment;
  - [ ] the use of the settings page to alter the UI;
  - [ ] all third-party services, their purposes, their costs, and the credentials required to access them.
