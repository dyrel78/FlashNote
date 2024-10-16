// api.test.js
import request from 'supertest';
import { expect, jest } from '@jest/globals';
import app from '../index.js';  // Make sure to include the .js extension
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {

    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
});

afterAll(async () => {

  //delete the user i amde in the registration
  await mongoose.connection.close();
});

describe('Basic Math', () => {
  it('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });
});

describe('Get Users', () => {
  it('Should have a successful connection to the users table', async () => {
    const res = await request(app)
      .get('/api/users/')
      .expect(200);
    
    expect(res.status).toBe(200);
  }, 10000); // Setting timeout directly on the test
});


// import request from "supertest";
// import app from "../index.js";

// test('adds 1 + 3 to equal 3', () => {
// 	expect(3).toBe(3);
// })
// describe('Get Users', () => {
//     it('Should have a successful connection to the users table', async () => {
//       const res = await request(app)
//         .get('/api/users/')  
//       // console.log(res);
//       // 200 code means success for get
//       expect(res.statusCode).toEqual(200);

//       expect(1).toEqual(1);
//     });
  
//     // Additional tests...
//   });

//   describe('Get Notes', () => {
//     it('Should have a successful connection to the notes table', async () => {
//       const res = await request(app)
//         .get('/api/notes/')  
//       // console.log(res);
//       // 200 code means success for get
//       expect(res.statusCode).toEqual(200);

//       expect(1).toEqual(1);
//     });
  
//     // Additional tests...
//   }
//   );

  describe('User API', () => {
  
    // Test for getting all users
    describe('GET /api/users/', () => {
      it('Should return a successful response and a list of users', async () => {
        const res = await request(app).get('/api/users/');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy(); // Check if the response is an array
      });
    });
  
    // Test for user login
    describe('POST /api/users/login', () => {
      // it('Should return a successful login', async () => {
      //   const loginData = {
      //     email: 'dyrellumiwes.com',  // Replace with actual test data
      //     password: '$2a$10$MAPDBMrsg2x.UHpbjIZx/upk15NL1KtfpkIlXP957/.KiRlRH2RuW',
      //   };
      //   const res = await request(app)
      //     .post('/api/users/login')
      //     .send(loginData);
        
      //   expect(res.statusCode).toEqual(200);
      //   expect(res.body).toHaveProperty('message', 'Login successful');
      // });
  
      it('Should return 401 for incorrect password', async () => {
        const loginData = {
          email: 'dyrellumiwes@gmail.com',  // Replace with actual test data
          password: 'wrongpassword',
        };
        const res = await request(app)
          .post('/api/users/login')
          .send(loginData);
        
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Incorrect password');
      });
  
      it('Should return 404 for non-existent user', async () => {
        const loginData = {
          email: 'nonexistentuser@example.com',
          password: 'password123',
        };
        const res = await request(app)
          .post('/api/users/login')
          .send(loginData);
        
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'User not found');
      });
    });
  
    // Test for registering a new user
    describe('POST /api/users/register', () => {
      it('Should register a new user', async () => {

        const newUser = {
          first_name: 'John',
          last_name: 'Doe',
          email: 'johnJest@example.com',
          password: 'password123',
          username: 'testJohnJest',
        
        };
        const res = await request(app)
          .post('/api/users/register')
          .send(newUser)
          .set('Content-Type', 'application/json');
          ;
  
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
        
      });

      it('Should delete the user i just made', async () => {
        const newUser = {
          first_name: 'John',
          last_name: 'Doe',
          email: 'johnJest@example.com',
          password: 'password123',
          username: 'testJohnJest',
        };
        const res = await request(app)

          .delete('/api/users/username/testJohnJest')
          ;
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveProperty('message', 'User deleted successfully');
      });

  
      it('Should return 400 for duplicate username', async () => {
        const newUser = {
          first_name: 'Jane',
          last_name: 'Doe',
          email: 'jane@example.com',
          username: 'john_doe',  // Duplicate username
          password: 'password123',
        };
        const res = await request(app)
          .post('/api/users/register')
          .send(newUser);
  
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Username already exists');
      });
    });
  });
  
  // Test suite for notes routes (if there is a notes API)
  describe('Notes API', () => {
    
    // Test for getting all notes
    describe('GET /api/notes/', () => {
      it('Should return a successful response and a list of notes', async () => {
        const res = await request(app).get('/api/notes/');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy(); // Check if the response is an array
      });
    });
  });
