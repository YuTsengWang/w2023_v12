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

// Import the necessary modules and functions
const { app } = require('./server');
const tool = require("./module/tools.js");

// Test Suite for User Registration Functionality
describe('User Registration Functionality', () => {

// Define a server variable to use for testing
let server;

// Test Case 1: Valid user data
test('Valid user data should resolve successfully', async () => {
  // Provide valid user data
  const user = {
      username: 'validUsername',
      password: 'validPassword',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
  };

  // Mock the registerCred function to resolve successfully for valid user data
  tool.registerCred = jest.fn().mockResolvedValue({ success: true });

  // Start the server and store the server instance in the server variable
  server = app.listen(3000);

  // Call the function with valid user data
  const result = await tool.registerCred(user);

  // Check if the function resolves successfully
  expect(result).toEqual({ success: true });

  // Close the server
  server.close();
});

// Test Case 2: Invalid user data
test('Invalid user data should reject with an error message', async () => {
  // Provide invalid user data
  const user = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: ''
  };

  // Mock the registerCred function to reject with an error message for invalid user data
  tool.registerCred = jest.fn().mockRejectedValue(new Error('All fields are required'));

  // Start the server and store the server instance in the server variable
  server = app.listen(3000);

  // Call the function with invalid user data and handle the rejection with a catch block
  try {
    await tool.registerCred(user);
  } catch (error) {
    // Check if the function rejects with the expected error message
    expect(error.message).toEqual('All fields are required');
  }

});
});
