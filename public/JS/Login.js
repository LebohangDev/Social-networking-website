 
 // Selecting navigation items
 var LoginItem = document.getElementById("Login-item");
 var RegisterItem = document.getElementById("Register-item");
 var logoutItem = document.getElementById("Logout-item"); 
 
 logoutItem.style.display = 'none';
            // finction to check if the user is registerd and perform a login  
            async function isRegistered() {


                // get the entered username and password from input field 
                let username = document.getElementById("usernameInput").value;
                let password = document.getElementById("passwordInput").value;

                

               // sending  post request with the username and password as data
                try{
                    // convert to JSON
                    const userLogin = JSON.stringify({username, password});
                    const response = await fetch('/M00860241/login', {
                        method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: userLogin

                    });

                    // check if Login was successful
                    if(response.ok){
                        // clear the previous message
                        document.getElementById("msg2").innerText = "";

                        //parse the response JSON
                        const result = await response.json();
                        // calling functions to display the userposts and usernotifications when user is logged in passing the username of the logged in user as a parameter 
                        fetchAndDisplayUserPosts(username);
                        fetchAndDisplayUserNotifications(username);

                        // Display success message
                        document.getElementById("msg2").innerText = "Welcome back  " + username +"!";

                        LogoutNav();
                        
                        
                        
                        const profilename = document.getElementById('Profile_name');
                        // Update the text content of the h5 element with the username of the logged-in user
                        profilename.textContent = username;
                        // Display followers count, following count, and post count
                        const followers = document.querySelector(".Followers");
                        const following = document.querySelector(".Following");
                        const postCount = document.querySelector('.profile-post');

                        followers.textContent = result.followersCount  + " Followers ";
                        following.textContent = result.followingCount  + " Following ";
                        postCount.textContent = result.postCount  + " Posts";
                        // Display post count however you want
                        

                    

                        
                       // reload the page after 2 seconds 
                        setTimeout(() => {
                            // Clear input fields
                            document.getElementById("usernameInput").value = "";
                            document.getElementById("passwordInput").value = "";
                            document.getElementById("msg2").innerText = "";
                        }, 2000);
                    } else{
                        // check if the error is due to username not found or wrong password
                        if (response.status === 401){
                            document.getElementById("msg2").innerText = "Invalid Username or Password!";
                            
                        }
                    }
                } catch (err){
                    // Display error message
                    console.log("Error logging in user: " + err);

                }
            }

             
        // Function to check user login status
        async function checkLogin() {
            // checking logging via a get request to server 
            try {
                const response = await fetch('/M00860241/checkLogin');
                const data = await response.json();
                return data.login; // Return true if user is logged in, false otherwise
            } catch (error) {
                console.error('Error, Failed to check if user logged in:', error);
                return false; // Assume user is not logged in if there's an error
            }
            
        }
           // Check if user is logged in and adjust navigation items accordingly
           async function LogoutNav() {
            
            const loggedIn = await checkLogin();
          

            
        
            if (loggedIn) {
                // User is logged in
                LoginItem.style.display = 'none';
                RegisterItem.style.display = 'none';
                logoutItem.style.display = 'block';
            } else {
                // User is not logged in
                logoutItem.style.display = 'none';
            }
        }

// Function to fetch and display the logged-in user's posts in the profile div
async function fetchAndDisplayUserPosts(username) {
    // get the entered username and password from input field 
    
    try {
        // Make fetch request to fetch user's posts
        const response = await fetch(`/M00860241/userPost/${username}`); 
        if (response.ok) {
            const userPosts = await response.json();
            // Display the fetched user posts
            displayUserPosts(userPosts);
            console.log(userPosts);
            
        }
        else if(response.status == 500){
            ('Network response was not ok');

        }
        
    } catch (error) {
        // Handle error
        console.error('Error fetching user posts:', error);
    }
}

// Function to display the user's posts in the profile div
function displayUserPosts(userPosts) {
    const userPost = document.getElementById('no-posts'); 
    userPost.innerHTML = ''; // Clear previous content

    
    

    // Construct HTML for user's posts
    var userPostsHtml = '';
    // append each user post with postHtml1
    if(userPosts.length > 0){
        userPosts.forEach(function(post) {
            var postHtml1 = `
            <div class="post-container1" style="position: relative; top: 500px;">
            <img src="../IMAGES/user-defualt.png" class="user-defualt13">
                <div class="post-media-container">
                    <img src="../uploads/${post.filename}" class="myFile" alt="Post Media">        
                </div>
                <h3>${post.username}</h3>
                <p1 class="container_text">${post.text}</p1>
                <i class="ri-heart-fill heartIcon"></i>
                <i class="ri-dislike-fill dislikeIcon"></i>
                <i class="ri-chat-3-fill commentIcon"></i>
                <hr class="top-line">
                <hr class="bottom-line">
                
            </div>
        `;
            userPostsHtml += postHtml1;
        });

    }else {
        // If user has no posts
        userPost.innerHTML = '<h5 class="no-posts">No Posts</h5><i class="ri-camera-off-fill"></i>';
    }

    

    // Insert user's posts HTML into the profile div
    userPost.insertAdjacentHTML('beforeend', userPostsHtml);
    
}



// Function to fetch and display the logged-in user's posts in the profile div
async function fetchAndDisplayUserNotifications(username) {
    
    
    try {
        // fetch request to fetch user's notifications from srver via a get reuqest 
        const response = await fetch(`/M00860241/notification/${username}`); 
        if (response.ok) {
            const userNotis = await response.json();
            // Display the fetched notifications
            displayUsersNotifications(userNotis)
            console.log(userNotis);
            
        }
        else{
            response.status(500).json({error: "Failed to fetch notifications"});

        

        }
        
    } catch (error) {
        // Handle error
        console.error('Error fetching user notifications:', error);
    }
}

// Function to display the user's notifications at the notifications div
function displayUsersNotifications(userNotis) {
    const userNoti = document.getElementById('noti-container'); 
    userNoti.innerHTML = ''; // Clear previous content

    // Construct HTML for user's notifications
    var userNotisHtml = '';

    if(userNotis.length > 0){
        userNotis.forEach(function(noti, index) {
            // start notification start point at 300 px and multiply for each nitfication by 130 px add space between each noti
            var notiHtml1 = `
                <!-- Individual notifications -->
                
                <div class="Noti1" id="Noti" style="top: ${300 + index  * 130}px;">
                    <div class="notification-container1">
                        <!-- User avatar -->
                        <img src="./IMAGES/user-defualt.png" class="user-defualt8" alt="">
                        <!-- Notification message -->
                        <span> ${noti.message}!</span>
                    </div>
                </div>
            `;
            userNotisHtml += notiHtml1;
        });

    } else {
        // If user has no posts
        userNoti.innerHTML = '<i class="ri-notification-off-fill"></i>';
    }

    // Insert user's notifications HTML into the notification container
    userNoti.insertAdjacentHTML('beforeend', userNotisHtml);
}











