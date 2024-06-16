import { MongoClient, ServerApiVersion } from 'mongodb';

const password = "Lesotho1726";
const userName = "lk669";
const server =  "cluster0.jocm7ve.mongodb.net";

const encodedUsername = encodeURIComponent(userName);
const encodedPassword = encodeURIComponent(password);

const connectionURL = `mongodb+srv://${encodedUsername}:${encodedPassword}@${server}/?retryWrites=true&w=majority`;
const client = new MongoClient(connectionURL, { 
    serverApi: {
        version: ServerApiVersion.v1,
        strict: false,
        deprecationErrors: true,
    }
});
// fucntion to connect to database 
export async function connectToDatabase() {
    try {
        await client.connect();
        return client.db("DayDreamDB");
    } catch (error) {
        console.error("Error connecting to database:", error);
        throw error;
    }
}

const db = await connectToDatabase();

export const postsCollection = db.collection("Posts");
export const usersCollection = db.collection( "Users" );

//Returns all users in database
export async function getAllposts(){
    const results =  await postsCollection.find({}).toArray();
    return results;
}

//Adds new user to database
export async function addUser(newUser){
    const result =  await usersCollection.insertOne(newUser);
    if(result.acknowledged)
        return 1;
    throw "Failed to add customer";
}

