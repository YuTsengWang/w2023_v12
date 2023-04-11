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

describe("User Dashboard Test", () => {
    test("Should display user dashboard when logged in", async () => {
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

        // Access the dashboard page
        const response = await request(app)
            .get("/dashboard")
            .set("Cookie", `Cap805Session=${JSON.stringify(mockSession)}`);

        // Check if the request was successful and the dashboard page was rendered
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain("Dashboard");
    });

    test("Should redirect to login page when not logged in", async () => {
        // Access the dashboard page without a session
        const response = await request(app).get("/dashboard");

        // Check if the request was redirected to the login page
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe("/login");
    });
});
