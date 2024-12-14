let mediaRecorder;
const chunks = [];

function startRecording() {
  const rapportSceneAudio = document.getElementsByTagName('rapport-scene')[0].audio;
  // Use existing audio context
  const audioContext = rapportSceneAudio.context;
  // get stream for all browsers and for Safari
  const audioStream = rapportSceneAudio.mediaStreamDestination || audioContext.createMediaStreamDestination();
  const audioStream_aria = audioStream.stream;
  const audioStream_user = rapportSceneAudio.localStream;

  // Create two MediaStreamAudioSourceNodes from your audio streams
  const stream1Source = audioContext.createMediaStreamSource(audioStream_aria);
  const stream2Source = audioContext.createMediaStreamSource(audioStream_user);

  // Create a ChannelMergerNode to mix the streams
  const mergerNode = audioContext.createChannelMerger(2); // Stereo output (2 channels)

  // Connect the audio streams to the merger node
  stream1Source.connect(mergerNode, 0, 0); // Connect stream1 to the left channel (input 0)
  stream2Source.connect(mergerNode, 0, 1); // Connect stream2 to the right channel (input 1)

  // Create a DestinationNode to connect the mixed audio
  const destinationNode = audioContext.createMediaStreamDestination();

  // Connect the merger node to the destination node
  mergerNode.connect(destinationNode);

  // Start recording the combined audio stream
  mediaRecorder = new MediaRecorder(destinationNode.stream);
  chunks.length = 0; // Clear the previous recording chunks

  mediaRecorder.addEventListener('dataavailable', function (event) {
    chunks.push(event.data);
  });

  mediaRecorder.start();
}

// Function to stop the recording
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();

    mediaRecorder.addEventListener('stop', function () {
      const combinedAudioBlob = new Blob(chunks, {type: 'audio/mp3'});

      // Create audio element for playback
      const audioElement = document.createElement('audio');
      audioElement.controls = true;

      // Create object URL for the audio blob
      const audioURL = URL.createObjectURL(combinedAudioBlob);

      // Set the audio URL as the source for the audio element
      audioElement.src = audioURL;

      // // ----- For Audio Saving: ---------------
      // Append the audio element to the document body
      //document.body.appendChild(audioElement);
      saveRecordingToServer(combinedAudioBlob);

      //saveRecording(combinedAudioBlob, 'microphone_recording.mp3');
    });
  }
}

// Function to play back the recorded audio
function playBack() {
  const audioElement = document.querySelector('audio');

  if (audioElement) {
    audioElement.play();
  }
}

//}

// Local Save of Audio File
function saveRecording(blob, filename) {
  // Create a temporary anchor element
  var anchor = document.createElement('a');
  anchor.style.display = 'none';

  // Set the download attribute and href of the anchor
  anchor.download = filename;
  anchor.href = URL.createObjectURL(blob);

  // Append the anchor to the document body
  document.body.appendChild(anchor);

  // Programmatically click the anchor to trigger the download
  anchor.click();

  // Clean up the temporary anchor element
  document.body.removeChild(anchor);
}

// Save Audio File to Server
function saveRecordingToServer(blob) {
  // Create a FormData object and append the audio Blob
  var formData = new FormData();
  var audio_fname = "audio.mp3";
  var audio_file = new File([blob], audio_fname);

  console.log(audio_fname);

  var json_fname = "transcription.json";
  const json_string = JSON.stringify(json_log_data);
  const json_blob = new Blob([json_string], {type: 'application/json'});
  const json_file = new File([json_blob], json_fname, {type: 'application/json'});

  console.log(json_file.name);

  formData.append("audio", audio_file);
  formData.append("transcription", json_file);

  if(typeof selectedResumeTemplate === 'undefined')
    fetchUrl = serverUrl + "/v2/storageservice?company=" + clientName + "/production/";
  else
    fetchUrl = serverUrl + "/v2/storageservice?company=" + clientName + "/production/" + selectedResumeTemplate;

  fetch(fetchUrl, {
    method: "POST",
    body: formData, // formdata object containing the audio and transcription files
  })
    .then(async (response) => {
      if (response.ok) {
        const res_json = await response.json();
        return res_json;
      }
      throw new Error("Failed to save audio and transcription data");
    })
    .then((response) => {
      const target_uuid = response.body.UUID;
      console.log(target_uuid);

      if (generate_analytics == true) {
        // --------------------------------
        // -- CHAINED TO GENERATE REPORT ---
        // --------------------------------
        url_local = "http://localhost:8000/";
        url_prod = serverUrl + "/reportservice";

        fetch(url_prod, {
          method: "POST",
          body: JSON.stringify({
            data: json_log_data,
            UUID: response.body.UUID,
            clientId: getClientId(clientName),
            email: user_email,
          }),
        })
          .then(async (response) => {
            if (response.ok) {
              return await response.blob();
            }
            throw new Error("Failed to create report");
          })
          .then((blob) => {
            cancelTimer();
            // Assuming 'blob' is your Blob object
            const reader = new FileReader();

            reader.onload = function (event) {
              const htmlContent = event.target.result;

              // Create a temporary element to hold the HTML content
              const tempElement = document.createElement('div');
              tempElement.innerHTML = htmlContent;

              // Find the <p> element with id 'subheader'
              const subheaderElement = tempElement.querySelector('.info');
              console.log('subheaderElement', subheaderElement);
              if (subheaderElement) {
                // Update the content of the <p> element
                curr_txt = subheaderElement.textContent;
                //subheaderElement.textContent = user_email + ", " + curr_txt;
                subheaderElement.textContent = curr_txt;
              }
              setReport(tempElement.innerHTML, target_uuid);
            };
            reader.readAsText(blob, "UTF-8");
          });
        // --------------------------------
      }
    })
    .catch((error) => {
      console.error('API request failed:', error);
      stopLoadingAnimation();
    });
}

function startLoadingAnimation() {
  loadingContainer.style.display = 'flex';
}

function stopLoadingAnimation() {
  loadingContainer.style.display = 'none';
}

function saveToS3Bucket(html_content, UUID) {
  // Create a Blob object from the HTML content
  const blob = new Blob([html_content], {type: "text/html"});

  // Create a FormData object
  const formData = new FormData();
  formData.append("template", blob, "report.html");

  // Create a POST request to send the FormData

  const url = serverUrl + `/v2/storageservice/template?UUID=${UUID}`; // Replace with your actual POST endpoint
  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then(response => response.text())
    .then(data => {
      console.log("Response from server:", data);
    })
    .catch(error => {
      console.error("Error:", error);
    });
}
var reportFromBE;
function setReport(htmlContent, target_uuid) {
  reportFromBE = htmlContent;
  endButton.style.display = 'block';
  preparingButton.style.display = 'none';
  // Send the report to S3 for saving:
  saveToS3Bucket(htmlContent, target_uuid);
  console.log("Report saved to S3");
  stopLoadingAnimation();
}