const request = require('supertest');
const app = require('../server'); 

describe('Claim Routes', () => {
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

    it('should create a claim with valid token', async () => {
        const policyId = '65e5b15d60c2d4ef3bbabe09';

        const claimData = {
            claimDate: new Date('2023-01-01'),
            claimAmount: Math.floor(Math.random() * 10000) + 1000,
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
        };

        const response = await request(app)
            .post(`/claims/${policyId}`)
            .set('Cookie', [`token=${token}`])
            .send(claimData);
        console.log(response);
        expect(response.status).toBe(200);
    });

    it('should retrieve all claims of logged-in user with valid token', async () => {
        const response = await request(app)
            .get('/claims')
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should retrieve a specific claim of logged-in user with valid token', async () => {
        const claimId = '65e5b15d60c2d4ef3bbabe09';

        const response = await request(app)
            .get(`/claims/${claimId}`)
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should update a specific claim of logged-in user with valid token', async () => {
        const claimId = '65e5b15d60c2d4ef3bbabe09';

        const updatedClaimData = {
            claimDate: new Date('2023-01-01'),
            claimAmount: Math.floor(Math.random() * 10000) + 1000,
            description: 'Updated claim description.'
        };

        const response = await request(app)
            .put(`/claims/${claimId}`)
            .set('Cookie', [`token=${token}`])
            .send(updatedClaimData);

        expect(response.status).toBe(200);
    });

    it('should delete a specific claim of logged-in user with valid token', async () => {
        const claimId = '65e5b15d60c2d4ef3bbabe09';

        const response = await request(app)
            .delete(`/claims/${claimId}`)
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should retrieve all claims with TPA role with valid token', async () => {
        const response = await request(app)
            .get('/TPA/claims')
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should retrieve a specific claim with TPA role with valid token', async () => {
        const claimId = '65e5b15d60c2d4ef3bbabe09';

        const response = await request(app)
            .get(`/TPA/claims/${claimId}`)
            .set('Cookie', [`token=${token}`]);

        expect(response.status).toBe(200);
    });

    it('should update the status of a specific claim with TPA role with valid token', async () => {
        const claimId = '65e5b15d60c2d4ef3bbabe09';

        const updatedStatusData = {
            status: 'Approved'
        };

        const response = await request(app)
            .put(`/TPA/claims/${claimId}`)
            .set('Cookie', [`token=${token}`])
            .send(updatedStatusData);

        expect(response.status).toBe(200);
    });
});
