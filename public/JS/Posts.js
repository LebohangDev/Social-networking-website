





// Async function to fetch and display posts
async function fetchAndDisplayPosts() {
    try {
        // Make fetch request to fetch posts via get request to server
        const response = await fetch('/M00860241/Post');
        if (response.ok) {
            const posts = await response.json();
            // Display the fetched posts
            displayPosts(posts);
           
           
        }
        else{
            response.status(500).json({error: "Failed to fetch and display posts"});

        }
        
    } catch (error) {
        // Handle error
        console.error('Error fetching posts:', error);
    }
}


// Function to display posts in the home div
function displayPosts(posts) {
    const postContainers = document.getElementById('Post-containers');
    postContainers.innerHTML = ''; // Clear previous content



    // Iterate through the posts and append them to postContainers div
    posts.forEach(function(post) {
        
        var PostId = post._id; // Get the objectID of the post
        // Set for each post container the id as the postId of the posts document to uniqely identify each post  
        var postHtml = `
    
            <div class="post-container1" id="${PostId}">
                <img src="../IMAGES/user-defualt.png" class="user-defualt13">
                <h3 class="h3">${post.username}</h3>
                <p1 class="container_text">${post.text}</p1>
                <div class="post-media-container">
                    <img src="../uploads/${post.filename}" class="myFile" alt="Post Media">        
                </div>
                <i class="ri-heart-fill heartIcon"></i>
                <i class="ri-dislike-fill dislikeIcon"></i>
                <i class="ri-chat-3-fill commentIcon"></i>
                <hr class="top-line">
                <hr class="bottom-line">

                <!-- Comments section -->
                <div class="comment-form-container" style="display: none; max-height: 700px; overflow-y: auto; overflow-x: hidden;" id="comment-container-${PostId}">
                    <h1 class="post-user" id="post-user">${post.username}</h1>
                    <!-- User avatar -->
                    <img src="./IMAGES/user-defualt.png" class="user-defualt14">
                    <i class="ri-chat-off-line" id="no-comment"></i>
                    <i class="ri-chat-smile-3-fill"></i><textarea placeholder="Write a comment..." name="comment" id="comment-text"></textarea>
                    <p class="msg4"></p>
                    <button type="submit" class="btn" onclick="addComment(this)">Post</button>
                    <!-- Like count -->
                    <div class="like-count">${post.likes} Likes</div>
                    <!-- Comment count -->
                    
                    <hr class="comment-line1">
                    <hr class="comment-line2">
                    <button class="comment-close" id="comment-close">Close</button>
                </div>
            </div>

            
        `;
       
    
        postContainers.insertAdjacentHTML('beforeend', postHtml);
    });





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
            const response = await fetch(`/M00860241/getComments/${postId}`); // Pass the postId o the post container 
            if (response.ok) {
                const authorComments = await response.json();
                // Pass postId to displayComments function and authorcomments fetched 
                displayComments(authorComments, postId); 
               
            } else {
                response.status(500).json({ error: 'Failed to fetch posts' });
            }
        } catch (error) {
            console.error('Error fetching author comments:', error);
        }
    });
});


// function to displayComments passing the authrocomments and post container postId 
function displayComments(authorComments, postId) {
    const noCommentSection = document.getElementById(`comment-container-${postId}`);

    // Check if the comment container already exists
    let commentContainer = noCommentSection.querySelector('.comment-container');
    if (!commentContainer) {
        // If it doesnt exist create it
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

    // Clear existing comments before appending new ones
    commentContainer.innerHTML = '';

    // Remove the <i class="ri-chat-off-line"></i> element if present
    const noCommentIcon = noCommentSection.querySelector('.ri-chat-off-line');
    if (noCommentIcon) {
        noCommentIcon.remove();
    }

    // Construct HTML for user comments
    var userCommentsHtml = '';
   // if authorcomments lenght greater than 0 then append for each comment with the commentHtml 
    if (authorComments.length > 0) {
        authorComments.forEach(function(comment) {
            var commentHtml = `
                <div class="comment-section" style="position: relative; top: 10px; margin-bottom: 100px; max-height: 100px;">
                    <img src="./IMAGES/user-defualt.png" class="user-defualt15">
                    <h1 class="comment-1">${comment.username}</h1>
                    <p class="comment-text" style="position: relative; top: 30px">${comment.text}</p>
                    <div class="comment-count"> ${authorComments.length} Comments</div>

                </div>
            `;
            userCommentsHtml += commentHtml;
        });
    } else {
        // If user has no comments, add the <i class="ri-chat-off-line"></i> element
        userCommentsHtml = '<i class="ri-chat-off-line"></i>';
    }
    

    // Insert user's comments HTML into the comment section
    commentContainer.insertAdjacentHTML('beforeend', userCommentsHtml);
}


    // get all close button and attach the event listener
    var closeButton = document.querySelectorAll('.comment-close');
    closeButton.forEach(function(button){

        button.addEventListener('click', function(){
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
            
            
            // like request sent to server via post
            try{
                const response  = await fetch(`/M00860241/Post/${postId}/like`, {
                    method: "POST",
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ Action: 'like' }) // send action as like

                
                });
                if(response.ok){
                    toggleIcon.call(this); // passing this for liking the specific post container. 
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
                this.nextElementSibling : // If this is a heart icon, get the next as dislike icon
                this.previousElementSibling; // If this is a dislike icon get the previous as heart icon
            otherIcon.classList.remove('clicked');
        }
    }
    
}

// Call the async function to fetch and display posts
fetchAndDisplayPosts();









