
// function to add comment to database and passing the button  element as parameter
async function addComment(button) {
    
    // finding the textarea within the parent post container
    const text = button.parentNode.querySelector('textarea').value;
    


    // Get the parent post container of the clicked "Post" button
    const postContainer = button.closest('.post-container1');
    if (!postContainer) {
        console.error('Post container not found');
        return;
    }

    

    // Retrieve the author name from the h3 element within the post container
    const postAuthorNameElement = postContainer.querySelector('h3').innerText;
    if (!postAuthorNameElement) {
        console.error('Post author name element not found');
        return;
    }

    const postAuthorName = postAuthorNameElement;

    // Retrieve the ID of the post container
    const postId = postContainer.id;

    // Convert comment data to JSON
    const data = { text, username: postAuthorName };
    const jsonData = JSON.stringify(data);

    try {
        // Send a POST request to the server to add the comment
        const response = await fetch(`/M00860241/addComment/${postId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });
        
        

        // Check if the request was successful
        if (response.ok) {

            // clear the previous message
            postContainer.querySelector(".msg4").innerText = "";
           
            // Display success message
            postContainer.querySelector(".msg4").innerText = "Comment added succesfully!";
           


            // reload the page after 2 seconds 
            setTimeout(() => {
                // Clear input fields
                postContainer.querySelector("textarea").value = "";
                postContainer.querySelector(".msg4").innerText = "";
            }, 2000);
            
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to add comment');
        }
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}





