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


const request = require("supertest");
const { app } = require("./server.js");

// Mock user data for editing the profile
const updatedUserData = {
    username: "testuser",
    firstName: "New",
    lastName: "User",
    email: "newuser@test.com"
};

describe("Edit User Profile Test", () => {
    test("Should successfully edit user profile", async () => {
        // Simulate user login by setting up a mock session
        const mockSession = {
            user: {
                username: "testuser",
                email: "testuser@test.com",
                firstName: "Test",
                lastName: "User"
            }
        };
        
        // Update the user profile
        const response = await request(app)
            .post("/profile/edit")
            .set("Cookie", `Cap805Session=${JSON.stringify(mockSession)}`)
            .send(updatedUserData);

        // Check if the request was successful and the user was redirected to the profile page
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe("/Profile");

        // Check if the user profile was updated correctly
        expect(mockSession.user.username).toBe(updatedUserData.username);
        expect(mockSession.user.firstName).toBe(updatedUserData.firstName);
        expect(mockSession.user.lastName).toBe(updatedUserData.lastName);
        expect(mockSession.user.email).toBe(updatedUserData.email);
    });
});
