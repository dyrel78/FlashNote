// import request from "supertest";
// import app from "index.js";


import request from 'supertest';
import app from '../index.js';


describe('Get Users', () => {
    it('Should have a successful connection to the users table', async () => {
      const res = await request(app)
        .get('/api/users/')  
      // console.log(res);
      // 200 code means success for get
      expect(res.statusCode).toEqual(200);

      expect(1).toEqual(1);
    });
  
    // Additional tests...
  });

  describe('Get Notes', () => {
    it('Should have a successful connection to the notes table', async () => {
      const res = await request(app)
        .get('/api/notes/')  
      // console.log(res);
      // 200 code means success for get
      expect(res.statusCode).toEqual(200);

      expect(1).toEqual(1);
    });
  
    // Additional tests...
  }
  );

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
      it('Should return a successful login', async () => {
        const loginData = {
          email: 'testuser@example.com',  // Replace with actual test data
          password: 'password123',
        };
        const res = await request(app)
          .post('/api/users/login')
          .send(loginData);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Login successful');
      });
  
      it('Should return 401 for incorrect password', async () => {
        const loginData = {
          email: 'testuser@example.com',  // Replace with actual test data
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
          email: 'john@example.com',
          username: 'john_doe',
          password: 'password123',
        };
        const res = await request(app)
          .post('/api/users/register')
          .send(newUser);
  
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
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
