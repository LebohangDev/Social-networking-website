//Import database code that we are testing
import { app }  from '../DayDream-service.js';

//Set up Chai library 
import chai from 'chai';
let should = chai.should();
let assert = chai.assert;
let expect = chai.expect;

//Set up Chai for testing web service
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

//Wrapper for all web service tests
describe('Web Service', () => {

    //Test of GET request sent to /users
    describe('/GET Post', () => {
        it('should GET all the posts', (done) => {
            chai.request(app)
                .get('/M00860241/Post')
                .end((err, response) => {
                    //Check there are no errors
                    expect(err).to.equal(null);

                    //Check the status code
                    response.should.have.status(200);

                    //Convert returned JSON to JavaScript object
                    let responseObject = JSON.parse(response.text);

                    //Check that an array of customers is returned
                    responseObject.should.be.a('array');

                    //Check that appropriate properties are returned
                    if(responseObject.length > 1){
                        responseObject[0].should.have.property('type');
                        responseObject[0].should.have.property('username');
                    }

                    //End test
                    done();
                });
        });
    });
});