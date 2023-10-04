const fetchGetText = async (url) => {
  const result = await fetch(url);
  return await result.text();
};

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
  const response = await fetch("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Handle the server's response here
  const responseText = await response.text(); // Get the text content of the response

  if (responseText.includes("Success")) {
    const loginContainer = document.querySelector("#loginContainer");
    loginContainer.style.display = "none"; // Hide the login container

    const otherItemsContainer = document.getElementsByClassName(
      "otherItemsContainer"
    );
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
};


//get status variable value
window.addEventListener('load', function() {
  sendVar("status");
});
const sendVar = (command) => {
  fetch(`/variable?status=${encodeURIComponent(command)}`)
    .then(response => response.text())
    .then(variableValue => {
      const variableValueElement = document.querySelector("#variable_value");
      variableValueElement.innerText = variableValue;
    })
    .catch(error => {
      console.error("Error fetching variable value:", error);
    });
};



//Get write text
const writeTextElement = document.querySelector("#text");
writeTextElement.onkeydown = (e) => {
  if (e.keyCode != 13) return;
  sendWrite(writeTextElement.value);
};
writeTextElement.onkeyup = (e) => {
  if (e.keyCode != 13) return;
  writeTextElement.value = "";
};

//get say write text
const sayTextElement = document.querySelector("#saytext");
sayTextElement.onkeydown = (e) => {
  if (e.keyCode != 13) return;
  sendWriteToSay(sayTextElement.value);
};
sayTextElement.onkeyup = (e) => {
  if (e.keyCode != 13) return;
  sayTextElement.value = "";
};

//get clip write text
const ClipTextElement = document.querySelector("#ClipText");
ClipTextElement.onkeydown = (e) => {
  if (e.keyCode != 13) return;
  sendClipText(ClipTextElement.value);
};
ClipTextElement.onkeyup = (e) => {
  if (e.keyCode != 13) return;
  ClipTextElement.value = "";
};

//get run autovoice command
const runTextElement = document.querySelector("#runtext");
runTextElement.onkeydown = (e) => {
  if (e.keyCode != 13) return;
  sendRun(runTextElement.value);
};
runTextElement.onkeyup = (e) => {
  if (e.keyCode != 13) return;
  runTextElement.value = "";
};

// send all command to tasker

const sendWrite = (command) =>
  fetch(`/command?write=${encodeURIComponent(command)}`);

const sendClipText = (command) =>
  fetch(`/command?clip=${encodeURIComponent(command)}`);

const sendRun = (command) =>
  fetch(`/command?run=${encodeURIComponent(command)}`);

const sendWriteToSay = (command) =>
  fetch(`/command?saytext=${encodeURIComponent(command)}`);

const sayHello = () => sendSay("Hello everyone!");
const sendSay = (command) =>
  fetch(`/command?say=${encodeURIComponent(command)}`);

const shutUp = () => sendShutUp("ShutUp");
const sendShutUp = (command) =>
  fetch(`/command?shut=${encodeURIComponent(command)}`);

const killApp = () => sendKillApp("KillApp");
const sendKillApp = (command) =>
  fetch(`/command?killapp=${encodeURIComponent(command)}`);

const lock = () => sendLock("lock");
const sendLock = (command) =>
  fetch(`/command?lock=${encodeURIComponent(command)}`);

const unlock = () => sendUnlock("unlock");
const sendUnlock = (command) =>
  fetch(`/command?unlock=${encodeURIComponent(command)}`);

const screenLock = () => sendScreenLock("ScreenLock");
const sendScreenLock = (command) =>
  fetch(`/command?screen_lock=${encodeURIComponent(command)}`);

const reboot = () => sendReboot("Reboot");
const sendReboot = (command) =>
  fetch(`/command?reboot=${encodeURIComponent(command)}`);

const siren = () => sendSiren("Siren");
const sendSiren = (command) =>
  fetch(`/command?siren=${encodeURIComponent(command)}`);



//get Tasks task Options from server
window.addEventListener('load', function() {
  getTasks("tasks");
});

const getTasks = (command) => {
  fetch(`/tasks?task=${encodeURIComponent(command)}`)
    .then(response => response.text())
    .then(taskList => {
      const selectElement = document.getElementById("tasks");
      const tasksArray = taskList.split(",");
      tasksArray.forEach(task => {
        const option = document.createElement("option");
        option.value = task;
        option.textContent = task;
        selectElement.appendChild(option);
      });
    })
    .catch(error => {
      console.error("Error fetching tasks:", error);
    });
};
//send task option to server
const sendSelectedTask = () => {
  const selectElement = document.getElementById("tasks");
  const selectedTask = selectElement.value;
  const setResStatusDiv = document.getElementById("setResStatus");

  if (selectedTask) {
      fetch(`/tasks?set_task=${encodeURIComponent(selectedTask)}`)
          .then(response => {
              // Handle the server's response here if needed
          })
          .catch(error => {
              console.error("Error sending selected task:", error);
          });
  }
};


//get selected file number
function updateFileLabel() {
  const input = document.getElementById("file_open");
  const fileCount = input.files.length;
  const uploadStatus = document.getElementById("uploadStatus");
  uploadStatus.textContent = fileCount + " item(s) selected";
}
//send file to phone
async function uploadFiles() {
  const fileInput = document.getElementById("file_open");
  const uploadStatus = document.getElementById("uploadStatus");
  if (fileInput.files.length === 0) {
    uploadStatus.innerHTML = "Please select one or more files.";
    return;
  }
  let uploadedCount = 0;
  for (const file of fileInput.files) {
    const formData = new FormData();
    formData.append("file", file);
    uploadStatus.innerHTML = `(${uploadedCount + 1}-${
      fileInput.files.length
    }) Uploading "${file.name}"...<br>`;
    try {
      const response = await fetch("/files", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        uploadedCount++;
      }
    } catch (error) {
      console.error(
        `An error occurred while uploading file "${file.name}":`,
        error
      );
    }
  }
  // Display the final upload status
  uploadStatus.innerHTML = `(${uploadedCount}-${fileInput.files.length}) All files uploaded successfully.<br>`;
}

//receive file req
// Receive file req
// Receive file req
const sendReceiveReq = (command) =>
  fetch(`/filereq?filereq=${encodeURIComponent(command)}`);

const receiveFile = () => {
  // Display the status message
  const statusMessage = document.getElementById("statusMessage");
  statusMessage.style.display = "block";
  statusMessage.textContent = "Request sent. Please wait";

  const downloadLink = document.getElementById("downloadLink");

  // Define a recursive function to handle downloading multiple files
  const downloadNextFile = () => {
    sendReceiveReq("sendFile")
      .then((response) => {
        if (response.status === 201 || response.status === 200) {
          // Extract the filename from the Content-Disposition header
          const contentDisposition = response.headers.get("Content-Disposition");
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);

          if (filenameMatch && filenameMatch[1]) {
            const filename = filenameMatch[1];
            // File found, process and display download link with the actual filename
            return response.blob().then((blob) => {
              // Create a blob URL for the received file
              const blobUrl = window.URL.createObjectURL(blob);
              // Set the download link's href and display it with the actual filename
              downloadLink.href = blobUrl;
              downloadLink.style.display = "block";
              downloadLink.setAttribute("download", filename); // Set the download attribute
              downloadLink.click(); // Trigger the click event to initiate download

              if (response.status === 200) {
                // All files have been downloaded, display a completion message
                statusMessage.textContent = "All files downloaded successfully";
              } else {
                // Continue to download the next file
                downloadNextFile();
              }
            });
          } else {
            // If the filename couldn't be extracted, display an error message
            statusMessage.textContent = "Filename not found in the response";
            throw new Error("Filename not found in the response");
          }
        } else {
          // If the status code is neither 201 nor 200, display an error message
          statusMessage.textContent = "Unexpected response status: " + response.status;
          throw new Error("Unexpected response status: " + response.status);
        }
      })
      .catch((error) => {
        console.error("Error receiving file:", error);
      });
  };

  // Start downloading files
  downloadNextFile();
};




//media control
const mediaVolumeElement = document.querySelector("#media_volume");
document.querySelectorAll(".media_button").forEach((button) => {
  const command = button.getAttribute("command");
  button.onclick = async () => {
    mediaVolumeElement.innerText = await fetchGetText(
      `/mediacontrol?command=${command}`
    );
  };
});

//Updating clipboard from phone to webpage
//Updating clipboard from phone to webpage
const updateClipboard = async () => {
  try {
    const clip = await fetchGetText("/clipboard");
    document.querySelector("#ClipText").value = clip;
  } finally {
    updateClipboard();
  }
};
updateClipboard();




//updating currently opened app on phone
const updateOpenedApp = async () => {
  try {
    const CurrentApp = await fetchGetText("/currentapp");
    document.querySelector("#current_app").innerText = CurrentApp;
  } finally {
    updateOpenedApp();
  }
};
updateOpenedApp();

//updating current playing song
const updatePlayingSong = async () => {
  try {
    const song = await fetchGetText("/currentsong");
    document.querySelector("#current_song").innerText = song;
  } finally {
    updatePlayingSong();
  }
};
updatePlayingSong();

//get Phone Notifications
const getNotify = async (name) =>
  await fetchGetText(`/notification?noti=${name}`);
const NotifyValueElement = document.querySelector("#phnNotify");
const Notify = "notify";
const fetchNotifyValue = async () => {
  NotifyValueElement.innerHTML = "Loading...";
  const text = await getNotify(Notify);
  NotifyValueElement.innerHTML = text;
};
window.addEventListener("load", fetchNotifyValue);
