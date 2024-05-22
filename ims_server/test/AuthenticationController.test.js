import { expect } from 'chai';
import request from 'supertest';
import app from '../server.js';

// Test cases for Registration
let testNo = 0;

describe('POST /register', () => {
  it('Test '+(++testNo)+' : should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        fullName: "John Doe",
        dob: "1990-01-01",
        email: "johndoe@example.com",
        phoneNo: "1234567890",
        password: "password123"
      });

    expect(res.statusCode).equal(201);
    expect(res.text).equal('SRL2 :: Registration successfull');
  });
});

describe('POST /register', () => {
  it('Test '+(++testNo)+' : should give an error while registration', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        fullName: "John Doe",
        dob: "1990-01-01",
        email: "johndoe@example.com",
        phoneNo: "1234567890",
        password: "password123"
      });

    expect(res.statusCode).equal(400);
    expect(res.text).equal('FRL2 :: Registration failed');
  });
});

// Test cases for Login
describe('POST /login', () => {
  it('Test '+(++testNo)+' : should login a user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        "email": "johndoe@example.com",
        "phoneNo": "1234567890",
        "password": "password123"
      });
    expect(res.statusCode).equal(200);
    expect(res.text).equal('SRL2 :: Login successful');
  });
});

describe('POST /login', () => {
  it('Test '+(++testNo)+' : should give an error while login', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        "email": "johndoe@example.com",
        "phoneNo": "1234567890",
        "password": "password123"
      });

    expect(res.statusCode).equal(401);
    expect(res.text).equal('FRL2 :: Login failed');
  });
});

// Test cases for Check Login Status
describe('GET /check-login-status', () => {
  it('Test '+(++testNo)+' : should check login status', async () => {
    const res = await request(app)
      .get('/auth/check-login-status');

    expect(res.statusCode).equal(200);
    expect(res.text).equal('SRL2 :: Active Session');
  });
});

describe('GET /check-login-status', () => {
  it('Test '+(++testNo)+' : should give an error while checking login status', async () => {
    const res = await request(app)
      .get('/auth/check-login-status');

    expect(res.statusCode).equal(401);
    expect(res.text).equal('FRL2 :: No Active Session');
  });
});

// Test cases for Logout
describe('POST /logout', () => {
  it('Test '+(++testNo)+' : should logout a user', async () => {
    const res = await request(app)
      .post('/auth/logout');

    expect(res.statusCode).equal(200);
    expect(res.text).equal('SRL2 :: Logout successful');
  });
});

describe('POST /logout', () => {
  it('Test '+(++testNo)+' : should give an error while logout', async () => {
    const res = await request(app)
      .post('/auth/logout');

    expect(res.statusCode).equal(400);
    expect(res.text).equal('FRL2 :: Logout failed');
  });
});

