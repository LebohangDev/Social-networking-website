//Import the modules
import express from 'express';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import fileUpload from 'express-fileupload';

import { connectToDatabase, addUser, getAllposts} from './database.js'; 





//The express module is a function. When it is executed it returns an app object
export const app = express();

//Set up Express to use body-parser with JSON formatted data.
app.use(bodyParser.json());

//Configure express to use express-session
app.use(
    expressSession({
        secret: 'cst2120 secret',
        cookie: { maxAge: 60000000000 },
        resave: false,
        saveUninitialized: true
    })
);

// insert the data to mongoDB database
//Use client to create database and collection

const collectionName_Users = "Users";
const collectionName_Post = "Posts";






// Handle storing registration information to DB 
app.post('/M00860241/Register', async (request, response) => {
    try {
        const userData = request.body; // Get the User data from the request body
        // connect to databse
        const db = await connectToDatabase();
        // set the collection for users  in the database
        const usersCollection = db.collection(collectionName_Users);
        // Check if the username already exists in the database
        const existingUser = await usersCollection.findOne({ username: userData.username });
        if (existingUser) {
            response.status(409).json({ error: "Username already exists." });
        } else {
            // Insert the User data into the database
            await addUser(userData);
            response.status(201).json({ message: "User registered successfully." });
        }
    } catch (error) {
        console.error("Error registering user:", error);
        response.status(500).json({ error: "Internal server error." });
    } 
});
  // login route to handle logging in request 
app.post('/M00860241/Login', async (request, response) => {
    try {
        // request username and bassword  from the request body
        const { username, password } = request.body;

        // Connect to MongoDB
        const db = await connectToDatabase();
        const usersCollection = db.collection(collectionName_Users);
        // connect to follwerscollection 
        const followersCollection = db.collection("Followers");
        // connec to postcollection 
        const postsCollection = db.collection(collectionName_Post);

        // Find the user in the database
        const userData = await usersCollection.findOne({ username, password });

        // If user is found, set the session and send success response
        if (userData) {
            // Retrieve followers count
            const followersCount = await followersCollection.countDocuments({ following: username });
            
            // Retrieve following count
            const followingCount = await followersCollection.countDocuments({ follower: username });

            // Retrieve post count
            const postCount = await postsCollection.countDocuments({ username: username });

            // Store user information in session
            request.session.username = username;
            request.session.followersCount = followersCount;
            request.session.followingCount = followingCount;
            request.session.postCount = postCount;

            // Send success response with user information
            response.json({
                login: true,
                followersCount,
                followingCount,
                postCount
            });
        } else {
            response.status(401).json({ login: false, message: "Username or password incorrect." });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        response.status(500).json({ login: false, message: "Internal server error." });
    } 
});

// route for handling logout request 
app.get('/M00860241/Logout', async (request, response) => {
    try {
        // Destroy session
        request.session.destroy();
        response.json({ logout: true });
    } catch (error) {
        console.error("Error logging out:", error);
        response.status(501).json({ logout: false, message: "Internal server error." });
    }
});


// route for to check if user is logged in or not 
app.get('/M00860241/checklogin', async (request, response) => {
    if(!("username" in request.session))
        response.json( {login: false});
    else{
        response.json({ login: true, username: request.session.username });
    }
});



// Middleware for file uploads
app.use(fileUpload());
// route for handling uploading of image and other user data from client side 
app.post('/M00860241/upload', async (request, response) => {
    try {
        // Check if user is logged in
        if (!("username" in request.session)) {
            return response.status(405).json({ upload: false, error: "User not logged in" });
        }

        const db = await connectToDatabase();
        const postsCollection = db.collection(collectionName_Post);
        const usersCollection = db.collection(collectionName_Users);
        const followersCollection = db.collection("Followers");
        // notifications collection 
        const notiCollection = db.collection('Notifications');




        // The uploaded file
        const myFile = request.files.myFile;

        // Move the uploaded file to the desired directory
        await myFile.mv('../public/uploads/' + myFile.name);

        // Retrieve other data from the request body
        const { text } = request.body;
        const username = request.session.username;

        // Fetch user data from the users collection
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return response.status(402).json({ upload: false, error: "User not found" });
        }

        // Insert the post data into the posts collection
        const result = await postsCollection.insertOne({
            filename: myFile.name,
            type: myFile.mimetype.startsWith('image/') ? 'image' : 'video',
            text: text,
            username: user.username,
            userId: user._id,
            likes: 0,
           
        });

        // create notifcaitons for followers whenever a user make a post 
        const followers = await followersCollection.find({ following: username }).toArray();
       
        // iterate for each follower of the logged in user
        followers.forEach(async (follower) =>{
            
            await notiCollection.insertOne({
                Recipient : follower,
                sender : username,
                message: `new post from ${username}`,
                readStatus: false 
            });
            
        });
       

        // Get the inserted post ID
        const postId = result.insertedId.toString();

        // Update the inserted document to include the postId in the result object 
        await postsCollection.updateOne({ _id: result.insertedId }, { $set: { postId: postId } });

        // Send sucess message of post  created and included postID back to client side 
        response.json({ upload: true, postId: postId, message: "Post uploaded successfully" });
    
    } catch (error) {
        console.error('Error handling file upload:', error);
        response.status(500).json({ upload: false, error: "Internal server error" });
    } 
});

// route to handle retrieving of notifications for a specific user
app.get('/M00860241/notification/:username', async (request, response) =>{

    try{
        const db = await connectToDatabase();
        const notiCollection = db.collection('Notifications');
        const username = request.params.username;

        

        // retrieve the notifcations for the specific user from the database
        const noti = await notiCollection.find({"Recipient.follower":username}).toArray();
        
        response.json(noti);

    } catch(error){
        console.error("error fetching notifications", error);
        response.status(500).json({error: "Failed to fetch notifications"});

    }

});
// route to handling the fetching of the posts 
app.get('/M00860241/Post', async (request, response) => {
    try {
        const posts = await getAllposts();
        response.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        response.status(500).json({ error: 'Failed to fetch posts' });
    } 
});
// route to handle the liking of a post 
app.post('/M00860241/Post/:postId/like', async (request, response) => {
    try {
        const db = await connectToDatabase();
        const postsCollection = db.collection(collectionName_Post);
        
        const postId = request.params.postId;

        const username = request.session.username
        // username not logged in
        if (!username){
            return response.status(401).json({ error:'User must be logged in to like a post'});

        } 

        // Check if the user has already liked the post
        const post = await postsCollection.findOne({ postId: postId, likedBy: username });
        if (post) {
            return response.status(400).json({ error: 'User already liked the post' });
        }
     
        
        // Update the post document to increment likes and add the username of the logged in user that liked the post to to the likes array
        const result = await postsCollection.updateOne( { postId: postId },{ $inc: { likes: 1 }, $addToSet: { likedBy: username }});

        if (result.modifiedCount === 1) {
            response.json({ message: 'Post liked successfully' });
        } else {
            response.status(404).json({ error: 'Post not found' });
        }
    } catch (error) {
        console.error('Error liking post:', error);
        response.status(500).json({ error: 'Failed to like post' });
    }
});

// route to handle fetching the userposts of a specific user 
app.get('/M00860241/userPost/:username', async (request, response) => {
    
    try {
        const db = await connectToDatabase();
        const postsCollection = db.collection(collectionName_Post);
        const usersCollection = db.collection(collectionName_Users);

        // Fetch username from request parameters
        const username = request.params.username;

        // Check if the requested username matches the logged-in user
        const loggedInUser = request.session.username;

        if (loggedInUser === username) {
            // If the requested username matches the logged-in user, fetch posts from posts collection
            const userPosts = await postsCollection.find({ username: username }).toArray();
            response.json(userPosts);
        } else {
            // If the requested username doesn't match the logged-in user, check if the requested username exists
            const userExists = await usersCollection.findOne({ username: username });

            if (userExists) {
                response.status(403).json({ error: 'You are not logged in!.' });
            } else {
                response.status(404).json({ error: 'User not found' });
            }
        }
    } catch (error) {
        console.error('Error fetching user posts:', error);
        response.status(500).json({ error: 'Failed to fetch user posts' });
    } 
});


// route to handle adding comments for specific posts
app.post('/M00860241/addComment/:postId', async (request, response) => {
    try {
        // Check if user is logged in
        if (!("username" in request.session)) {
            return response.status(401).json({ error: "User not logged in" });
        }

        const db = await connectToDatabase();;
        const postsCollection = db.collection(collectionName_Post);
        const commentsCollection = db.collection("Comments");

        // Retrieve comment data from request body
        const { text } = request.body;
        const loggedInUsername = request.session.username;
        
        // Fetch post data from the database based on the postId provided in the URL
        const postId = request.params.postId;
        const authorPost = await postsCollection.findOne({ postId: postId });
        
        if (!authorPost) {
            return response.status(404).json({ error: "Post not found" });
        }
        
        // Insert the comment data into the comments collection
        const comment = {
            postId: postId, 
            authorName: authorPost.username, 
            username: loggedInUsername, 
            text: text,
        };

        await commentsCollection.insertOne(comment);

        // Send success message
        return response.status(201).json({ message: "Comment added successfully" });
    } catch (error) {
        console.error('Error adding comment:', error);
        // Send error message
        return response.status(500).json({ error: "Internal server error" });
    }
});
// route to handle the fetching of comments for a specific post 
app.get('/M00860241/getComments/:postId', async (request, response) => {
    try {
        
        const db = await connectToDatabase();
        const commentsCollection = db.collection("Comments");

        // Retrieve postId from request parameters
        const postId = request.params.postId;
        

        // query to get all coment associated with the postId and store it in the varaible postComments
        const postComments = await commentsCollection.find({ postId }).toArray();
        

        // Return the comments associated with the post
        response.json(postComments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        response.status(500).json({ error: 'Failed to fetch comments' });
    }
});


// route to handle the searchinf of users 
app.get('/M00860241/searchUsers', async (request, response) => {
    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection(collectionName_Users);
        const postsCollection = db.collection(collectionName_Post);
        const followersCollection = db.collection("Followers"); 

        const Username = request.query.username;
        const following = request.params.following;
        

        // Search for users with the provided username
        const users = await usersCollection.find({ username: Username }).toArray();

        // Fetch all posts from the database
        const posts = await postsCollection.find({}).toArray();

        // Fetch followers of the logged-in user
        const Followers = await followersCollection.find({ username: following }).toArray(); 
        const Following = await followersCollection.find({ username: following }).toArray(); 

        // Associate posts, followers, and following with each user, fliter function used to create a new array of the items that match the condition 
        users.forEach(user => {
            user.posts = posts.filter(post => post.username === user.username); 
            user.following = Following.filter(Following => Following.following === user.username); 
            user.followers = Followers.filter(Follower => Follower.follower === user.username); 
        });

        response.json(users);
    } catch (error) {
        console.error("Error retrieving users:", error);
        response.status(500).json({ error: "Error retrieving users from the database" });
    }
});
// route to handle follow requests for a specic user
app.post('/M00860241/follow/:username', async (request, response) => {
    try {
        // Check if user is logged in
        if (!("username" in request.session)) {
            return response.status(401).json({ error: "User not logged in" });
        }

        const db = await connectToDatabase();
        const followersCollection = db.collection("Followers");

        // Get the username of the user to be followed from the request parameters
        const usernameToFollow = request.params.username;
        // Get the username of the follower from the logged-in user session
        const follower = request.session.username;

        // Check if the user to be followed exists
        const userExists = await db.collection(collectionName_Users).findOne({ username: usernameToFollow });
        if (!userExists) {
            return response.status(404).json({ error: "User to follow not found" });
        }

        // Check if the user already follows 
        const existingFollow = await followersCollection.findOne({ follower: follower, following: usernameToFollow });
        if (existingFollow) {
            return response.status(400).json({ error: "You already follow this user" });
        }

        // Insert a new document in the Followers collection
        await followersCollection.insertOne({
            follower: follower,
            following: usernameToFollow
        });

        response.json({ message: "User followed successfully" });
    } catch (error) {
        console.error('Error following user:', error);
        response.status(500).json({ error: "Internal server error" });
    }
});

// route to handling unfollwing requests 

app.post('/M00860241/unfollow/:username', async (request, response) => {
    try {
        // Check if user is logged in
        if (!("username" in request.session)) {
            return response.status(401).json({ error: "User not logged in" });
        }

        const db = await connectToDatabase();
        const followersCollection = db.collection("Followers");

        // Get the username of the user to be unfollowed from the request parameters
        const usernameToUnfollow = request.params.username;
        console.log("following: ", usernameToUnfollow);

        // Get the username of the follower from the logged-in user session
        const follower = request.session.username;
        console.log("follower: ", follower);

        // get folwwers data to be detleted 
        const followingDelete = await followersCollection.findOne( {follower: follower, following: usernameToUnfollow });
        
        if (!followingDelete) {
            return response.status(404).json({ error: "User to unfollow not found" });
        }

        // Delete the document from the Followers collection
        await followersCollection.deleteOne({
            follower: follower,
            following: usernameToUnfollow
        });
    



        response.json({ message: "User unfollowed successfully" });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        response.status(500).json({ error: "Internal server error" });
    }
});







// Set up express to serve static files from the directory called 'public'
app.use(express.static('../public/'));

// Start the app listening on port 8080
app.listen(8080, () => {
    console.log("Listening on 8080.");
});