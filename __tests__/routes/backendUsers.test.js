const app = require('../../app');
const request = require('supertest');
const backendUserQueries = require('../../models/backendUserQueries');

const mockBackendUsers = [
  {
    employee: 'test1@gmail.com',
    actid: 1
  },
  {
    employee: 'test2@gmail.com',
    actid: 1
  }
];

describe('Test bankend user routes', () => {
  beforeAll(async done => {
    try {
      const names = mockBackendUsers.map(user => user.employee);
      await backendUserQueries.removeBackendUserByNames(names);
      done();
    } catch (error) {
      done(error);
    }
  });

  test('It should create a new backend user fail by without employee', async done => {
    try {
      const mockUserWithoutEmployee = {actid: 1};

      const response = await request(app)
      .post('/v1/backend_users')
      .set('Content-Type', 'application/json')
      .send(mockUserWithoutEmployee);

      expect(response.statusCode).toBe(400);
      expect(response.body.data.message).toBe('employee 不可為空');
      done();
    } catch (error) {
      done(error);
    }
  });

  test('It should create a new backend user fail by without actid', async done => {
    try {
      const mockUserWithoutEmployee = {employee: 'test1@gmail.com',};

      const response = await request(app)
      .post('/v1/backend_users')
      .set('Content-Type', 'application/json')
      .send(mockUserWithoutEmployee);

      expect(response.statusCode).toBe(400);
      expect(response.body.data.message).toBe('actid 不可為空');
      done();
    } catch (error) {
      done(error);
    }
  });

  test('It should create a new backend user succese', async done => {
    try {
      const response = await request(app)
      .post('/v1/backend_users')
      .set('Content-Type', 'application/json')
      .send(mockBackendUsers[0]);
      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.backend_user_id).not.toBe(undefined);
      done();
    } catch (error) {
      done(error);
    }
  });

  test('It should create a new backend user fail by user exist', async done => {
    try {
      const response = await request(app)
      .post('/v1/backend_users')
      .set('Content-Type', 'application/json')
      .send(mockBackendUsers[0]);
      expect(response.statusCode).toBe(400);
      expect(response.body.data.message).toBe('使用者已存在');
      done();
    } catch (error) {
      done(error);
    }
  });
});
