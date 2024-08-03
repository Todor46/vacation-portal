# Welcome to Vacation Portal!

This is just a fun little hobby project that I used to learn the basics of Remix and Prisma.
If it proves useful, it might become a tool that we use in the company I work for.

## Technology stack

- Remix
- React.js
- Prisma
- Postgresql
- Tailwindcss
- Vite
- Shadcn

## How to run the project?

1. To run the project first you need to run `npm install`.
2. Make sure you have **postgresql** database running and a dedicated database for this project
3. Add the URL and credentials to your DB to the **.env** file

```
DATABASE_URL=postgresql://username:password@localhost:5432/dbname?schema=public
```

Make sure to replace the values in the provided example with your own. More on how to connect prisma with your database [here](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases/connect-your-database-typescript-postgresql)

4.  Before running the project you need to generate and migrate DB by running `npx prisma migrate dev`
5.  Run the project by entering `npm run dev`
6.  Enjoy 😎

## How to authenticate in app?

At the moment there is no support for creating a user from the application itself. You need create a new user in your DB directly. You can use Prisma Studio (`npx prisma studio`), pgadmin or a tool of your own liking.

When creating a new user, only name, email and role are necessary fields.
On first login, the password that you enter will be hashed and saved as the user's password.

This implementation is temporary as in the future the users will always be supplemented externaly, instead of offering the users an option to create their own account.
