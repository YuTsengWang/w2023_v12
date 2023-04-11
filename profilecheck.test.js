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

describe("User Profile Test", () => {
    test("Should display user profile when click the user profile page", async () => {
        // Simulate user login by setting up a mock session
        const mockSession = {
            user: {
                username: "testuser",
                email: "testuser@test.com",
                isAdmin: false,
                firstName: "Test",
                lastName: "User"
            }
        };

        // Access the profile page
        const loginResponse = await request(app)
            .post("/login")
            .send({
                username: "testuser",
                password: "password"
            })
            .expect(302);

        const cookies = loginResponse.headers["set-cookie"];

        const profileResponse = await request(app)
            .get("/profile")
            .set("Cookie", cookies);

        // Check if the request was successful and the profile page was rendered
        expect(profileResponse.statusCode).toBe(200);
        expect(profileResponse.text).toContain("Profile");
    });
});
