document.addEventListener("DOMContentLoaded", function() {

    // Selecting DOM elements for various sections
    var homeDiv = document.querySelector('.Home');
    var notificationDiv = document.querySelector('.Notification');
    var ProfileDiv = document.querySelector('.Profile');
    var LoginDiv = document.querySelector('.Login');
    var RegisterDiv = document.querySelector('.Register');
    var navbarDiv = document.querySelector('.navbar-container');
    var logoutDiv = document.querySelector(".Logout");
    var PostForm = document.querySelector(".Post-form");
    var commentForm = document.querySelector(".comment-form-container");
    var userProfile = document.querySelector(".userProfilePlaceholder");

    // Selecting textarea and character count span
    var textarea = document.getElementById('text');
    var charCountSpan = document.getElementById('charCount');

    notificationDiv.style.display = 'none';
    ProfileDiv.style.display = 'none';
    LoginDiv.style.display = 'none';
    RegisterDiv.style.display = 'none';
    logoutDiv.style.display = '';
    PostForm.style.display = 'none';
    commentForm.style.display = 'none';
    userProfile.style.display = 'none';

    // Function to toggle display of a specific div
    function toggleDisplay(div) {
        homeDiv.style.display = 'none';
        notificationDiv.style.display = 'none';
        ProfileDiv.style.display = 'none';
        LoginDiv.style.display = 'none';
        RegisterDiv.style.display = 'none';
        userProfile.style.display = 'none';
        div.style.display = 'block';
    }

    // Event listeners for navigation links
    document.getElementById('home-link').addEventListener('click', function() {
        toggleDisplay(homeDiv);
    });

    document.getElementById('notification-link').addEventListener('click', function() {
        toggleDisplay(notificationDiv);
    });

    document.getElementById('profile-link').addEventListener('click', function() {
        toggleDisplay(ProfileDiv);
    });

    document.getElementById('login-link').addEventListener('click', function() {
        toggleDisplay(LoginDiv);
        navbarDiv.style.display = 'none';
    });

    document.getElementById('register-link').addEventListener('click', function() {
        toggleDisplay(RegisterDiv);
        navbarDiv.style.display = 'none';
    });

    document.getElementById('back-link').addEventListener('click', function() {
        toggleDisplay(homeDiv);
        navbarDiv.style.display = 'block';
    });

    document.getElementById('back-link2').addEventListener('click', function() {
        toggleDisplay(homeDiv);
        navbarDiv.style.display = 'block';
    });

    document.getElementById('Signup').addEventListener("click", function() {
        toggleDisplay(RegisterDiv);
    });

    document.getElementById('Comments').addEventListener("click", function() {
        commentForm.style.display = 'block';
    });

    document.getElementById('comment-close').addEventListener("click", function() {
        commentForm.style.display = 'none';
    });

    // Event listener for logout link
    document.getElementById('logout-link').addEventListener('click', function() {
        Logout();
    });

    // Event listener for 'Post' button
    document.getElementById('Post').addEventListener('click', function() {
        navbarDiv.style.display = 'block';
        if (PostForm.style.display === 'block') {
            PostForm.style.display = 'none';
        } else {
            PostForm.style.display = 'block';
        }
    });
   // function to logout  by destrying session via a get request 
    async function Logout() {
        try {
            const response = await fetch('/M00860241/Logout', {
                method: 'GET',
            });
            const responseData = await response.json();
            if (responseData.logout) {
                // Show custom alert
                document.getElementById("customAlert").classList.add("show");
                // Hide custom alert after 3 seconds
                setTimeout(() => {
                    document.getElementById("customAlert").classList.remove("show");
                    toggleDisplay(LoginDiv);
                    navbarDiv.style.display = 'none';
                    // Reload the page after the alert is hidden
                }, 1000);
            } else {
                console.error("Logout failed.");
                // Handle logout failure, display error message or take appropriate action
            }
        } catch (err) {
            console.error("Error logging out user: " + err);
            // Handle error, display error message or take appropriate action
        }
    }

    // Event listener for textarea to display character count
    textarea.addEventListener('input', () => {
        var remaining = textarea.maxLength - textarea.value.length;
        charCountSpan.textContent = remaining;
    });

    // event input listener for Searching for users
    searchInput.addEventListener('input', async () => {
        // storing the query results in the varaible query
        const query = searchInput.value.trim();
        // if the query . elgnth is equal to 0 then clear the search  result and return from the function
        if (query.length === 0) {
            searchResults.innerHTML = ''; // Clear search results if query is empty
            return;
        }
        //searching for users from server side via a get request 
        try {
            const response = await fetch(`/M00860241/searchUsers?username=${query}`);
            const users = await response.json();

            // Clear previous search results
            searchResults.innerHTML = '';

            // Create and append search result elements
            users.forEach(user => {
                const resultElement = document.createElement('div');
                resultElement.classList.add('search-result');
                resultElement.textContent = user.username; 
                // Adding click event listener to each result
                resultElement.addEventListener('click', () => {
                    // display the userPorifle section on click
                    toggleDisplay(userProfile);
                   // display the user profile of the user  that was clicked on
                    displayUserProfile(user); 
                });
                // append the search results to the resulElement 
                searchResults.appendChild(resultElement);
            });
        } catch (error) {
            console.error("Error searching for users", error);
        }
    });
});
// function to handle the displaying of the userProfile passing the users element  as an argument
function displayUserProfile(users) {
    
    // Get the container element where the profile section will be displayed
    const profileContainer = document.querySelector('.userProfilePlaceholder');
    

    // Construct the HTML  for the profile section
    let userProfileHTML = `
        <div class="Profile" style="display: block;">
            <!-- Horizontal line -->
            <hr class="Profile-line">
            <!-- User avatar -->
            <img src="./IMAGES/user-defualt.png" class="user-defualt0">
            <!-- Username -->
            <h5 id="User_name">${users.username}</h5>
            <!-- Buttons for posting and editing profile -->
            <button id="Follow" class="Follow">Follow</button>
            <button id="Unfollow" class="unfollow">Unfollow</button>
            <!-- Statistics about posts, followers, and following -->
            <h1 class="profile-post">${users.posts.length} posts</h1>
            <h2 class="Followers">${users.following.length} Followers</h2>
            <h3 class="Following">${users.followers.length} Following</h3>
            <!-- About section -->
            <h4 class="about">about section empty...</h4>
            <!-- Container for user's posts -->
            <div id="userPostsContainer"></div>
        </div>
    `;

    // Iterate through each post in users.posts and append to userProfileHTML
    users.posts.forEach(post => {
        var PostId = post._id; // Get the objectID of the post
        
        userProfileHTML += `
        <div class="post-container1" id="${PostId}" style="position: relative; top: 500px;">
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

            <!-- Comments section -->
            <div class="comment-form-container" style="display: none; max-height: 700px; overflow-y: auto; overflow-x: hidden;" id="comment-container-2-${PostId}">
                <h1 class="post-user" id="post-user">${post.username}</h1>
                <!-- User avatar -->
                <img src="./IMAGES/user-defualt.png" class="user-defualt14">
                <i class="ri-chat-off-line" id="no-comment"></i>
                <i class="ri-chat-smile-3-fill"></i><textarea placeholder="Write a comment..." name="comment" id="comment-text"></textarea>
                <p class="msg4"></p>
                <button type="submit" class="btn" onclick="addComment(this)">Post</button>
                <!-- Like count -->
                <div class="like-count">0 Likes</div>
                <!-- Comment count -->
                <div class="comment-count"> 0 Comments</div>
                <hr class="comment-line1">
                <hr class="comment-line2">
                <button class="comment-close" id="comment-close">Close</button>
            </div>
        </div>
        `;
    });

    // Set the HTML content of the container to the userProfileHTML
    profileContainer.innerHTML = userProfileHTML;

    

    // Event listener for comment icons to toggle comment section visibility
    var commentIcons = document.querySelectorAll(".commentIcon");
    commentIcons.forEach(function(icon) {
        icon.addEventListener('click', async function() {
            // Find the parent post container of the clicked icon
            var postContainer = this.closest('.post-container1');
            var postId = postContainer.getAttribute('id'); // Retrieve the postId from the post container's ID
            var commentForm = postContainer.querySelector('.comment-form-container');
            commentForm.style.display = 'block';

            // Fetch and display comments when the comment section is opened
            try {
                const response = await fetch(`/M00860241/getComments/${postId}`); // Pass the postId to the fetch 
                if (response.ok) {
                    const authorComments = await response.json();
                    displayComments(authorComments, postId); // Pass postId to displayComments function
                    console.log("Fetched author comments:", authorComments);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error fetching author comments:', error);
            }
        });
    });
    // fucntiont to dispaly the comments fetched passing the authro comments that are fetched and the postId for the post container of the fetched comments 
    function displayComments(authorComments, postId) {

        const noCommentSection = document.getElementById(`comment-container-2-${postId}`);

      
    
        // Check if the comment container already exists if not then it will create the comment container dynamically using javascript where the comments will be displayed 
        let commentContainer = noCommentSection.querySelector('.comment-container');
        if (!commentContainer) {

            
            // If it doesn't exist, create it
            commentContainer = document.createElement('div');
            commentContainer.classList.add('comment-container');
            commentContainer.style.maxHeight = '700px';
            commentContainer.style.height = '420px';
            commentContainer.style.overflowY = 'auto';
            commentContainer.style.overflowX = 'hidden';
            commentContainer.style.scrollMarginTop = '10px';
            commentContainer.style.position = 'relative';
            commentContainer.style.top = '90px';
            noCommentSection.appendChild(commentContainer);
            
        }
    
        // Clear existing comments before appending new ones prevent duplication everytime we fetch 
        commentContainer.innerHTML = '';
    
        // Remove the <i class="ri-chat-off-line"></i> element if comments exit 
        const noCommentIcon = noCommentSection.querySelector('.ri-chat-off-line');
        if (noCommentIcon) {
            noCommentIcon.remove();
        }
    
        // Constructing  HTML for user comments
        var userCommentsHtml = '';
      // if the comments fewtched length is greater than 1 
        if (authorComments.length > 0) {
            //append for each comment  in authorComments array to userCommentsHtml
            authorComments.forEach(function(comment) {
                var commentHtml = `
                    <div class="comment-section" style="position: relative; top: 10px; margin-bottom: 100px; max-height: 100px;">
                        <img src="./IMAGES/user-defualt.png" class="user-defualt15">
                        <h1 class="comment-1">${comment.username}</h1>
                        <p class="comment-text" style="position: relative; top: 30px">${comment.text}</p>
                    </div>
                `;
                // appending userCommentHtml to the commentHtml  and then to userCommentsHtml
                userCommentsHtml += commentHtml;
            });
        } else {
            // If user has no comments, add the <i class="ri-chat-off-line"></i> element
            userCommentsHtml = '<i class="ri-chat-off-line"></i>';
        }
        
    
        // Insert user's comments HTML into the comment section
        commentContainer.insertAdjacentHTML('beforeend', userCommentsHtml);
    }


    // Get the Follow and Unfollow buttons
    const followButton = document.getElementById('Follow');
    const unfollowButton = document.getElementById('Unfollow');
    // Add event listener for the Follow button
    followButton.addEventListener('click', async () => {
        try {
            // Get the username from the profile
            const username = document.getElementById('User_name').innerText;

            // Send follow request to the server via post 
            const response = await fetch(`/M00860241/follow/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Get the response from the server
            const result = await response.json();

            // Check if the response indicates that the user is already following the  user
            if (response.status === 400 && result.error === "You already follow this user") {
                alert(result.error);
            } else {
                // Display success message
                alert(result.message);
            }
        } catch (error) {
            console.error("Error following user", error);
            alert("Error following user"); // Display error message
        }
    });

    // dd event listener for the Unfollow button
    unfollowButton.addEventListener('click', async () => {
        try {
            // get the username from the profile
            const username = document.getElementById('User_name').innerText;

            // send unfollow request to the server via post 
            const response = await fetch(`/M00860241/unfollow/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Get the response from the server
            const result = await response.json();

            // Display success message
            alert(result.message);
        } catch (error) {
            console.error("Error unfollowing user", error);
            alert("Error unfollowing user"); // Display error message
        }
    });
    // Add event listener for the close button
    var closeButton = document.querySelectorAll('.comment-close');
    closeButton.forEach(function(button) {
        button.addEventListener('click', function() {
            // Find the parent post container of the clicked close button
            var postContainer = this.closest('.post-container1');
            var commentForm = postContainer.querySelector('.comment-form-container');
            commentForm.style.display = 'none';
        });
    });


    // Heart and Dislike Icons
    var heartIcons = document.querySelectorAll('.heartIcon'); // Get all heart icon elements
    var dislikeIcons = document.querySelectorAll('.dislikeIcon'); // Get all dislike icon elements

    // Add event listeners to all heart and dislike icons
    heartIcons.forEach(function(heartIcon) {
        heartIcon.addEventListener('click', async function(){
            // Find the parent post container of the clicked icon
            var postContainer = this.closest('.post-container1');
            var postId = postContainer.getAttribute('id'); // Retrieve the postId from the post container's ID
            
            
             // send like reuqest to server via post 
            try{
                const response  = await fetch(`/M00860241/Post/${postId}/like`, {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Action: 'like' }) // send action as like

                
                });
                if(response.ok){ 
                    toggleIcon.call(this);
                    return response.json();
                    
                    
                }
                else if(response.status == 400){
                    alert("already liked post ");
                    toggleIcon.call(this);


                }
                else if(response.status == 401){
                    alert("user must log in to like post");
                    
                }
                
            }catch(error){
                console.error(error);

            }
        
        });
    });

    dislikeIcons.forEach(function(dislikeIcon) {
        dislikeIcon.addEventListener('click', toggleIcon);
    });

    // Function to toggle 'clicked' class for heart and dislike icons
    function toggleIcon() {
        if (this.classList.contains('clicked')) {
            this.classList.remove('clicked');
        } else {
            this.classList.add('clicked');
            // Remove 'clicked' class from the other icon
            var otherIcon = this.classList.contains('heartIcon') ? 
             // getting the HTML element that comes immediately after the current element if its dislike then heart
                this.nextElementSibling :
                this.previousElementSibling; 
            otherIcon.classList.remove('clicked');
        }
    }
    
}



       

        