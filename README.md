# Pure approval

In this exercise, you should write a web application with [Express](http://expressjs.com/) and persistent data stored by MongoDB through [Mongoose](http://mongoosejs.com/). This exercise is also about how to validate user input through Mongoose schema and to present information to the user through "flash messages".

The application is a simple type where the user can write a number between 1 and 42 to be stored persistently.

The application's start page should have a navigation bar with a home- and a create link. On this page, show all the objects in the database (numbers with creation timestamp).

![index](./.readme/index.png)

## Create

When clicking on the create-link, the user should see a form for entering a number.

![create](./.readme/create.png)

### Success

If the number is between 1 and 42, save the number in the database (with a timestamp of the creation). If saving the number was successful, the server redirects the client to the page listing all the numbers. After the redirect, inform the user saving the number was successful.

![success](./.readme/success.png)

### Error

If the user gives a number that is not between 1 and 42, the application should respond with an error message; the same goes for any other type of error.

![error](./.readme/validation-error.png)

## Custom handling of 404 and 500

Of course, there should be a custom handling of the 404 and 500 errors in your application.

## Hints

For handling the errors, you should look up how to handle "flash messages", schema validation in mongoose and the understanding of middleware in Express.

## Solution

- <https://github.com/1dv023/exercise-pure-approval-SOLUTION>
