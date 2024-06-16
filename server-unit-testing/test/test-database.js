import { connectToDatabase, addUser, getAllposts} from '../database.js';

//Set up Chai library 
import chai from 'chai';
let should = chai.should();
let assert = chai.assert;
let expect = chai.expect;

//Wrapper for all database tests
describe('Database', () => {

    //Test getAllUsers method in database
    describe('#getAllPosts', () => {
        it('should return all of the posts in the database', async () => {
            
            const results = await getAllposts();

            //Array should be returned
            results.should.be.a('array');

            //Check that appropriate user properties are returned
            if(results.length > 1){
                results[0].should.have.property('type');
                results[0].should.have.property('username');
            }
        });
    });
    //Test addUser method in database
    describe('#addUser', () => {

        it('should add a user to the database', async () => {
    
            //Create random user details
    
            const userName = Math.random().toString(36).substring(2, 15);
            const phoneNumber = "0552934769";
            //Call function to add user to database
            const db = await connectToDatabase();
            let result = await addUser({ username: userName, phoneNumber: phoneNumber });
            expect(result).to.equal(1);
            //Use MongoDB Client to check user is in database
            const users = db.collection("Users"); // Access the Users collection
            result = await users.find({ username: userName }).toArray();
            expect(result.length).to.equal(1);
            //Clean up database
            result = await users.deleteOne({ username: userName });
            expect(result.deletedCount).to.equal(1);
        });
    });

});