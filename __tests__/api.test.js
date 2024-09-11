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
