//#region Comment Header
/*
Author: Wang Yu Tseng
Date: Feb 14, 2023
Title: CAP805 W2023 - Trio Discussion Forum Application
Version: 
    1.0.0 - Initial setup and configuration
    1.0.1 - Connect database access
    1.0.2 - Design User interface and layout
    */
//#endregion

// This test suite demonstrates utilityFunctions Functionality testing
// using Jest for testing and mocking.

// Prerequisites:
// Before running these tests, please make sure to do the following:
// 1. Install Node.js in your development environment.
// 2. Initialize your project with "npm init" and follow the prompts.
// 3. Install the necessary packages by running:
// npm install jest express supertest --save-dev
// 4. Update the "scripts" section of your package.json file to include:
// "test": "jest"


import { isEmpty, checkIfEmpty, setValidationRes } from './utilityFunctions';

let result;

test('default test', () => {
  result = 2 + 3;
  expect(result).toBe(5);
  result = true;
  expect(result).toBe(true);
});

test('isEmpty()', () => {
  result = isEmpty('');
  expect(result).toBeTruthy();
  result = isEmpty(' ');
  expect(result).toBeFalsy();
});

test('checkIfEmpty()', () => {
  result = checkIfEmpty(' ');
  // { valid: false, error: 'Must not be empty'}
  let expectedResult = { valid: false, error: 'Must not be empty' };
  expect(result).toEqual(expectedResult);
  result = checkIfEmpty('John Doe');
  expect(result).toEqual({ valid: true });
  result = checkIfEmpty('John');
  expect(result.error).toBeUndefined();
});