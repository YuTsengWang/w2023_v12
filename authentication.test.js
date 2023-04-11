// This test suite demonstrates User Registration Functionality testing
// using Jest for testing and mocking.

// Prerequisites:
// Before running these tests, please make sure to do the following:
// 1. Install Node.js in your development environment.
// 2. Initialize your project with "npm init" and follow the prompts.
// 3. Install the necessary packages by running:
// npm install jest express supertest --save-dev
// 4. Update the "scripts" section of your package.json file to include:
// "test": "jest"

// Import required modules
const tool = require("./module/tools");
const UserModel = require("./models/userModel");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { app } = require("./server");

// Load environment variables from .env file
dotenv.config();

// Create a new Mongoose instance for testing
const testMongoose = new mongoose.Mongoose();

// Increase the default timeout limit for Jest
jest.setTimeout(60000);

// Describe the test suite for user authentication functionality
describe("User Authentication Functionality", () => {
  let server;

  // Set up the database connection and server for testing before all tests run
  beforeAll(async () => {
    const uri = process.env.dbConn;

    // Connect to the test database
    await testMongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Update the model to use the testMongoose instance
    UserModel(testMongoose);

    // Start the server on a predefined port for testing
    const port = 8083; // Use a predefined port for testing
    server = app.listen(port);
  });

  // Test case for successful login with correct credentials
  test("Should successfully log in with correct credentials", async () => {
    // Create a sample user
    const sampleUser = new UserModel({
      username: "testuser",
      password: "testpassword",
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      isAdmin: false,
    });
    await sampleUser.save();

    // Attempt to log in with correct credentials
    const isAuthenticated = await tool.loginFieldCheck("testuser", "testpassword");

    // Verify successful login
    expect(isAuthenticated).toBeTruthy();
  });

  // Test case for unsuccessful login with incorrect credentials
  test("Should fail to log in with incorrect credentials", async () => {
    // Create a sample user
    const sampleUser = new UserModel({
      username: "testuser2",
      password: "testpassword",
      firstName: "Test",
      lastName: "User",
      email: "testuser2@example.com",
      isAdmin: false,
    });
    await sampleUser.save();

    // Attempt to log in with incorrect credentials
    const isAuthenticated = await tool.loginFieldCheck("testuser2", "wrongpassword");

    // Verify unsuccessful login
    expect(isAuthenticated).toBeUndefined();

    // Note: using expect(isAuthenticated).toBeFalsy() is not suitable here
    // because loginFieldCheck() does not return a boolean value for authentication.
    // It returns a rejection with an error message if the user credentials are incorrect.
  });

  // Close the server and mongoose connection after all tests are completed
  afterAll(async () => {
    await testMongoose.disconnect();
    await server.close();
  });
});
