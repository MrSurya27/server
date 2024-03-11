const request = require('supertest');
const app = require('../server'); 

describe('User API endpoints', () => {
    // it('should register a new user', async () => {
    //     const res = await request(app)
    //         .post('/auth/register')
    //         .send({
    //             name: 'Test User',
    //             email: 'police1244@example.com',
    //             password: 'password123'
    //         });
    //     // console.log(res);
    //     expect(res.statusCode).toEqual(201);
    //     expect(res.body).toHaveProperty('token');
    // }, 50000);

    it('should log in an existing user', async () => {
        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    },50000);

});

const loginAndGetToken = async () => {
    const loginResponse = await request(app)
        .post('/auth/login')
        .send({
            email: 'admin1@gmail.com', 
            password: 'password' 
        });

    const token = loginResponse.body.token;

    return token;
};

describe('Protected Routes', () => {
    let token;

    beforeEach(async () => {
        token = await loginAndGetToken();
    });

    it('should access the protected user route', async () => {
        const response = await request(app)
            .get('/user')
            .set('Cookie', [`token=${token}`]);
        expect(response.status).toBe(200);
    });

    it('should access the protected policy holders route', async () => {
        const response = await request(app)
            .get('/policy-holders')
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });
    // it('should successfully logout a user', async () => {
    //     const res = await request(app)
    //         .get('/auth/logout')
    //         .set('Cookie', [`token=${token}`]);
    //     expect(res.statusCode).toEqual(200);
    // }, 50000);
    // it('should successfully send a password reset email', async () => {
    //     const res = await request(app)
    //         .post('/auth/password/forgot')
    //         .send({
    //             email: 'test@example.com'
    //         });
    //     expect(res.statusCode).toEqual(200);
    //     // Add further assertions if required
    // }, 50000);
    // it('should successfully reset password with valid token', async () => {
    //     // Assuming you have a valid reset token
    //     const token = 'valid_reset_token';
    //     const res = await request(app)
    //         .put(`/password/reset/${token}`)
    //         .send({
    //             password: 'newpassword123'
    //         });
    //     expect(res.statusCode).toEqual(200);
    //     // Add further assertions if required
    // }, 50000);
    it('should update user profile successfully', async () => {
        const res = await request(app)
            .put('/user')
            .set('Cookie', [`token=${token}`])
            .send({
                name: 'Updated Test User'
            });
        expect(res.statusCode).toEqual(200);
    }, 50000);
    it('should update user password successfully', async () => {
        const res = await request(app)
            .put('/user/password')
            .set('Cookie', [`token=${token}`])
            .send({
                oldPassword: 'password',
                newPassword: 'password',
                confirmPassword:'password'
            });
        
        expect(res.statusCode).toEqual(200);
    }, 50000);
    it('should change user role successfully', async () => {
        const userId = '65dd8f9a1568775fa27c97e2';
        const res = await request(app)
            .put(`/change-role/${userId}`)
            .set('Cookie', [`token=${token}`])
            .send({
                role: 'admin'
            });
        expect(res.statusCode).toEqual(200);
    }, 50000);

});