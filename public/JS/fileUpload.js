

// async function to upload file to database
async function uploadFile() {
    const text = document.getElementById("text").value;
    const username = document.getElementById("usernameInput").value;
    // creating form data object and storing the extracted text and username and file into the new FormData
    const formData = new FormData();
    formData.append('text', text);
    formData.append('username', username);

    const myFile = document.getElementById("myFile").files[0];
    if (myFile) {
        formData.append('myFile', myFile);
    }
     // uplaodig file via post request 
    try {
        const response = await fetch('/M00860241/upload', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            // storing json response from server side in the varaible data
            const data = await response.json();
            if (data.upload) {
                document.getElementById("msg3").innerText = "Congrats, Upload Success! Your post has been sent";
                setTimeout(() => {
                    // Clear input fields
                    document.getElementById("text").value = "";
                    document.getElementById("myFile").value = "";
                    document.getElementById("msg3").innerText = "";
                }, 2000);
                
            }   // Check if the error is due to user not logged in 
            else if(response.status === 405) {
                document.getElementById("msg3").innerText = "You Must Login Before Making a Post!";
                // reload the page after 2 seconds 
                setTimeout(() => {
                    // Clear input fields
                    document.getElementById("text").value = "";
                    document.getElementById("myFile").value = "";
                    document.getElementById("msg3").innerText = "";
                }, 2000);
        
            } 
            
            else {
                document.getElementById("msg3").innerText = "Error Posting!";
            }
          
        }
    } catch (err) {
        console.error("Error Posting!: " + err);
        document.getElementById("msg3").innerText = "Error Making Post! Please try again later.";
        // reload the page after 2 seconds 
        setTimeout(() => {
            // Clear input fields
            document.getElementById("text").value = "";
            document.getElementById("myFile").value = "";
            document.getElementById("msg3").innerText = "";
        }, 2000);
    }
}

