const fetchGetText = async url => {
      	const result = await fetch(url);
      	return await result.text();
      }


//login
function toggleLogin() {
  var loginPop = document.getElementById("loginPop");
  var loginContainer = document.getElementById("loginContainer");

  loginPop.style.display = "none"; // Hide loginPop
  loginContainer.style.display = "block"; // Show loginContainer
}

const submitLogin = async (event) => {
    event.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    // Send the username and password to the /login path
    const response = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Handle the server's response here
    const responseText = await response.text(); // Get the text content of the response

    if (responseText.includes("Success")) {
        const loginContainer = document.querySelector("#loginContainer");
        loginContainer.style.display = "none"; // Hide the login container

        const otherItemsContainer = document.getElementsByClassName("otherItemsContainer");
         // Loop through the elements and do something with each one
         for (let i = 0; i < otherItemsContainer.length; i++) {
          const element = otherItemsContainer[i];
          // Do something with the element, for example:
          element.style.display = "block"; // Show the other items container
      }
      // Clear the username and password fields
      document.querySelector("#username").value = "";
      document.querySelector("#password").value = "";
    } else if (responseText.includes("failed")) {
      // If the response contains "failed," display an error message
      alert("Login failed. Please try again.");
    } else {
      // Handle other responses if needed
      alert("An unexpected error occurred.");
    }
  }



      //Get write text
      const writeTextElement = document.querySelector("#text");
      writeTextElement.onkeydown = e =>{
      	if(e.keyCode != 13) return;
      	sendWrite(writeTextElement.value);
      }
      writeTextElement.onkeyup = e =>{
      	if(e.keyCode != 13) return;
      	writeTextElement.value = "";
      }

      //get say write text
      const sayTextElement = document.querySelector("#saytext");
      sayTextElement.onkeydown = e =>{
      	if(e.keyCode != 13) return;
      	sendWriteToSay(sayTextElement.value);
      }
      sayTextElement.onkeyup = e =>{
      	if(e.keyCode != 13) return;
      	sayTextElement.value = "";
      }

      //get clip write text
      const ClipTextElement = document.querySelector("#ClipText");
      ClipTextElement.onkeydown = e =>{
        if(e.keyCode != 13) return;
        sendClipText(ClipTextElement.value);
       }
       ClipTextElement.onkeyup = e =>{
        if(e.keyCode != 13) return;
        ClipTextElement.value = "";
      }

      //get run autovoice command
      const runTextElement = document.querySelector("#runtext");
      runTextElement.onkeydown = e =>{
      	if(e.keyCode != 13) return;
      	sendRun(runTextElement.value);
      }
      runTextElement.onkeyup = e =>{
      	if(e.keyCode != 13) return;
      	runTextElement.value = "";
      }


      // send all command to tasker

      const sayHello = () => sendSay("Hello everyone!");

      const sendWrite = command => fetch(`/command?write=${encodeURIComponent(command)}`)
      const sendClipText = command => fetch(`/command?clip=${encodeURIComponent(command)}`)
      const sendRun = command => fetch(`/command?run=${encodeURIComponent(command)}`)
      const sendWriteToSay = command => fetch(`/command?saytext=${encodeURIComponent(command)}`)
      const sendSay = command => fetch(`/command?say=${encodeURIComponent(command)}`);
      const sendShutUp = command => fetch(`/command?shut=${encodeURIComponent(command)}`);
      const shutUp = () => sendShutUp("ShutUp");


      //send file to phone
      async function uploadFiles() {
        const fileInput = document.getElementById('file_open');
        const uploadStatus = document.getElementById('uploadStatus');

        // Check if any files were selected
        if (fileInput.files.length === 0) {
          uploadStatus.innerHTML = 'Please select one or more files.';
          return;
        }

        // Initialize progress counter
        let uploadedCount = 0;

        // Iterate through each selected file and send it to the server
        for (const file of fileInput.files) {
          const formData = new FormData();
          formData.append('file', file);

          try {
            const response = await fetch('/files', {
              method: 'POST',
              body: formData,
            });

            if (response.ok) {
              uploadedCount++;
              updateUploadStatus(uploadedCount, fileInput.files.length, file.name);
            } else {
              updateUploadStatus(uploadedCount, fileInput.files.length, file.name, true);
            }
          } catch (error) {
            console.error(`An error occurred while uploading file "${file.name}":`, error);
            updateUploadStatus(uploadedCount, fileInput.files.length, file.name, true);
          }
        }
      }

      function updateUploadStatus(uploadedCount, totalCount, fileName, isError = false) {
        const uploadStatus = document.getElementById('uploadStatus');
        if (isError) {
          uploadStatus.innerHTML += `(Error) Failed to upload file "${fileName}"<br>`;
        } else if (uploadedCount === totalCount) {
          uploadStatus.innerHTML = `(${uploadedCount}-${totalCount}) All files uploaded successfully.<br>`;
        } else {
          uploadStatus.innerHTML = `(${uploadedCount}-${totalCount}) Uploading "${fileName}"<br>`;
        }
      }



      //receive file req
      const sendReceiveReq = command => fetch(`/fileReq?fileReq=${encodeURIComponent(command)}`);
      const receiveFile = () => {
          // Display the status message
          const statusMessage = document.getElementById("statusMessage");
          statusMessage.style.display = "block";
          statusMessage.textContent = "Request sent";

          sendReceiveReq("sendFile")
              .then(response => {
                  if (response.status === 200) {
                      // File found, process and display download link
                      return response.blob();
                  } else if (response.status === 404) {
                      // File not found, display appropriate message
                      statusMessage.textContent = "File not found";
                      throw new Error("File not found");
                  } else {
                      throw new Error("Unexpected response status: " + response.status);
                  }
              })
              .then(blob => {
                  // Create a blob URL for the received file
                  const blobUrl = window.URL.createObjectURL(blob);

                  // Set the download link's href and display it
                  const downloadLink = document.getElementById("downloadLink");
                  downloadLink.href = blobUrl;
                  downloadLink.style.display = "block";
              })
              .catch(error => {
                  console.error("Error receiving file:", error);
              });
      };




const getVariableValue = async (name) => await fetchGetText(`/variable?name=${name}`);
const variableValueElement = document.querySelector("#variable_value");

// Set the static variable name here
const staticVariableName = "%BATT_Profile";

// Fetch and display the variable value
const fetchVariableValue = async () => {
    variableValueElement.innerText = "Loading...";
    var name = staticVariableName;
    if (name.indexOf("%") == 0) {
        name = name.substring(1);
    }
    const text = await getVariableValue(name);
    variableValueElement.innerText = text;
}

// Call the fetchVariableValue function when the page loads
window.addEventListener("load", fetchVariableValue);


      const mediaVolumeElement = document.querySelector("#media_volume");
      document.querySelectorAll(".media_button").forEach(button => {
      	const command = button.getAttribute("command");
      	button.onclick = async () => {
      		mediaVolumeElement.innerText = await fetchGetText(`/mediacontrol?command=${command}`);
      	}
      });



// Updating clipboard from phone to webpage
const updateClipboard = async () => {
  try {
    const clip = await fetchGetText("/clipboard");
    document.querySelector("#ClipText").value = clip;
  } catch (error) {
    // Handle any errors that occur during the fetch request
    console.error("Error fetching clipboard:", error);
  }
};

// Call updateClipboard() once when the page is loaded
window.addEventListener("load", () => {
  updateClipboard();
});


      //updating current playing song
      const updatePlayingSong = async () => {
      	try{
      		const song = await fetchGetText("/currentsong");
      		document.querySelector("#current_song").innerText = song;

      	}finally{
      		updatePlayingSong();
      	}
      }
      updatePlayingSong();
