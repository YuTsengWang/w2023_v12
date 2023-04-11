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

// This test suite demonstrates vaildators Functionality testing
// using Jest for testing and mocking.

// Prerequisites:
// Before running these tests, please make sure to do the following:
// 1. Install Node.js in your development environment.
// 2. Initialize your project with "npm init" and follow the prompts.
// 3. Install the necessary packages by running:
// npm install jest express supertest --save-dev
// 4. Update the "scripts" section of your package.json file to include:
// "test": "jest"

import {
    validateName,
    validateConfirmPassword,
    validateEmail
  } from './validators';
  let result;
  
  test('validateName()', () => {
    result = validateName('John Doe');
    expect(result).not.toEqual({
      valid: true,
      error: 'Must not be empty'
    });
    result = validateName(' ');
    expect(result).toEqual({
      valid: false,
      error: 'Must not be empty'
    });
  });
  
  test('confirmPassword()', () => {
    result = validateConfirmPassword('123456a', '1234567a');
    expect(result).toEqual({
      valid: false,
      error: 'Passwords must match'
    });
  });
  
  test('validateEmail()', () => {
    result = validateEmail('john@email');
    expect(result).toEqual({
      valid: false,
      error: 'Must be a valid email address'
    });
  });