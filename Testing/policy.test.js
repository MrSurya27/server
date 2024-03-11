const request = require('supertest');
const app = require('../server');

describe('Protected Routes', () => {
    let token;

    beforeEach(async () => {
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        token = loginResponse.body.token;
    });

    it('should access the protected route with valid token', async () => {
        const response = await request(app)
            .get('/user/policies')
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should not access the protected route without token', async () => {
        const response = await request(app)
            .get('/user/policies');

        expect(response.status).toBe(401);
    });
    it('should access the protected route /policy with valid token', async () => {
        const policyData = {
            policyType: 'Car Insurance',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2023-01-01'),
            premiumAmount: Math.floor(Math.random() * 1000) + 500,
            sumAssured: Math.floor(Math.random() * 100000) + 50000,
            termsAndConditions: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            policyTerm: '1 Year',
            paymentFrequency: 'Monthly',
            lastPaymentDate: new Date('2023-01-01')
        };

        const response = await request(app)
            .post('/policy')
            .set('Cookie', [`token=${token}`])
            .send(policyData);

        expect(response.status).toBe(200);
    });
    it('should access the protected route /policies with valid token', async () => {
        const response = await request(app)
            .get('/policies')
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should access the protected route /user/policies with valid token', async () => {
        const response = await request(app)
            .get('/user/policies')
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should access the protected route /policy/:id with valid token', async () => {
        const policyId = '65e6b0501481ced4bcf06fa0';
        const response = await request(app)
            .get(`/policy/${policyId}`)
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should access the protected route /policy/:id (PUT) with valid token', async () => {
        const policyId = '65e6b0501481ced4bcf06fa0';

        const updatedPolicyData = {
            policyType: 'Updated Car Insurance',
            startDate: new Date('2023-01-01'),
            endDate: new Date('2024-01-01'),
            premiumAmount: Math.floor(Math.random() * 1000) + 500,
            sumAssured: Math.floor(Math.random() * 100000) + 50000,
            termsAndConditions: 'Updated Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            policyTerm: '2 Years',
            paymentFrequency: 'Yearly',
            lastPaymentDate: new Date('2024-01-01')
        };

        const response = await request(app)
            .put(`/policy/${policyId}`)
            .set('Cookie', [`token=${token}`])
            .send(updatedPolicyData);

        expect(response.status).toBe(200);
    });

    // it('should access the protected route /policy/:id (DELETE) with valid token', async () => {
    //     const policyId = '65dd7ae6f9bdaf409b452f02';
    //     const response = await request(app)
    //         .delete(`/policy/${policyId}`)
    //         .set('Cookie', [`token=${token}`]);

    //     expect(response.status).toBe(200);
    // });

    it('should access the protected route /assign-policy/:id with valid token', async () => {
        const policyId = '65e6b0501481ced4bcf06fa0';

        const userEmail = 'policyHolder2@gmail.com';

        const response = await request(app)
            .post(`/assign-policy/${policyId}`)
            .set('Cookie', [`token=${token}`])
            .send({
                email: userEmail
            });

        expect(response.status).toBe(200);
    });

});
