document.addEventListener('DOMContentLoaded', onPageLoad);

// Authorize the User on Page Load
function onPageLoad() {
  // Get the email from the URL
  const urlParams = new URLSearchParams(window.location.search);
  user_email = urlParams.get('email');

  // Your server-side endpoint URL
  const serverEndpoint = serverUrl + '/v2/authservice/checkuser';

  const data = {
    email: user_email
  };

  // Make a POST request to the server-side endpoint
  fetch(serverEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      stopLoadingAnimation();
      // Enable elements on the target URL if authorized
      if (true) { //(data.body.email == user_email && user_email != null) {
        step1.style.display = 'none';
        step2.style.display = 'block';
        stepWelcome.style.display = 'block';
        stepBanner.classList.add('hide__for__mobile');
        document.querySelectorAll('.header__auth').forEach(el => el.style.display = 'none');
        step2List.addEventListener('click', (event) => {
          selectedResumeTemplate = event.target.closest("li")?.getAttribute('resume-template');
          console.log(selectedResumeTemplate);
          step2.style.display = 'none';
          step3Form.addEventListener('submit', (event) => {
            event.preventDefault();
            contactInfo = new FormData(event.target);
            console.log(contactInfo);
            step3.style.display = 'none';
            step4Form.addEventListener('submit', (event) => {
              event.preventDefault();
              jobInfo = new FormData(event.target);
              console.log(jobInfo);
              step4.style.display = 'none';
              step5List.addEventListener('click', (event) => {
                selectedCoach = event.target.closest("li")?.getAttribute('coach');
                console.log(selectedCoach);
                document.getElementById('coachAvatar').src = `img\\Coaches\\Coach${selectedCoach}.png`;
                step5.style.display = 'none';
                step6Form.addEventListener('submit', (event) => {
                  event.preventDefault();
                  const data = new FormData(event.target);
                  selectedLanguage = data.get('language');
                  console.log(selectedLanguage);
                  step6.style.display = 'none';
                  stepWelcome.style.display = 'none';
                  stepInterview.style.display = 'block';

                  chosenAI.projectId = Wave.projectId;
                  chosenAI.projectToken = Wave.projectToken;
                  chosenAI.aiUserId = Wave.aiUserId;
                  chosenAI.lobbyZoneId = Wave.lobbyZoneId;
                  chosenAI.display = Wave.display;
                  startLoadingAnimation();
                  loadContent(selectedResumeTemplate);
                });
                step6LanguageSelect.addEventListener('change', () => {
                  step6FormBtn.disabled = false;
                });
                step6.style.display = 'block';
              })
              step5.style.display = 'block';
            });
            step4.style.display = 'block';
          });
          firstName.addEventListener('input', (event) => {
            validateInput(firstName, firstNameError, setFirstNameInvalid);
          });
          lastName.addEventListener('input', (event) => {
            validateInput(lastName, lastNameError, setLastNameInvalid);
          });
          email.addEventListener('input', (event) => {
            validateInput(email, emailError, setEmailInvalid, 'Invalid Email');
          });
          phone.addEventListener('input', (event) => {
            validateInput(phone, phoneError, setPhoneInvalid, 'Invalid Phone');
          });
          gradYear.addEventListener('input', (event) => {
            validateInput(gradYear, gradYearError, setGradYearInvalid, 'Invalid Grad Year');
          });
          city.addEventListener('input', (event) => {
            validateInput(city, cityError, setCityInvalid);
          });
          state.addEventListener('input', (event) => {
            validateInput(state, stateError, setStateInvalid);
          });
          step3.style.display = 'block';
        });
      } else {
        stopLoadingAnimation();
        stepWelcome.style.display = 'block';
        console.log('Not authorized');
        startButton.addEventListener('click', () => {
          stepLogin.style.display = 'flex';
        })
        loginCloseBtn.addEventListener('click', () => {
          stepLogin.style.display = 'none';
        })
        // Handle not authorized case
        // startTimerAndDisplayMessage("Unauthorized User");
      }
    })
    .catch(error => {
      stopLoadingAnimation();
      console.error('Error:', error);
      // Handle error case
      startTimerAndDisplayMessage("Connection To Server Failed!");
    });

  //generate_analytics = true;
}

document.getElementById('mobileMenu').addEventListener('click', () => {
  document.querySelector('.mobile-menu').classList.toggle('show');
})

// Increment Session Count on End Interaction
function incrementSessionCount() {
  const url = serverUrl + '/v2/authservice/sessioncount';
  const data = {
    email: user_email
  };

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(responseData => {
      console.log('Response:', responseData);
      // Handle the response data here
    })
    .catch(error => {
      console.error('Error:', error);
      // Handle the error here
    });
}

function getDataByPath(path, objectSearch) {
  const pathLevels = path.split('.');
  let result = objectSearch;
  for (let i = 0; i < pathLevels.length; i++) {
    const key = pathLevels[i];
    result = result[key];
  }
  return result;
}

function getClientId(client) {
  let clientId = client;
  /*switch (client) {
    case 'nationaluniversity':
      clientId = 'relativ'; // send to relativ analytics (otherwise, update analytics backend to be national university)
  }*/
  return clientId;
}

function onClickSpacebar() {
  if (inCodeTest) {
    return
  }

  if (!isAriaListening)
    return;
  // one tap for first question
  if (!q_count) {
    customPttKeyDownHandler()
    customPttKeyUpHandler();
    return;
  }
  if (pttDown == true)
    customPttKeyUpHandler();
  else
    customPttKeyDownHandler();
}

function showWave() {
  wave.classList.add('active');
}

function hideWave() {
  wave.classList.remove('active')
}

function validateInput(input, error, setIsInvalid, typeMismatchMessage) {
  input.classList.add('dirty');
  if (input.validity.valid) {
    error.textContent = '';
    error.className = 'error';
  } else if (input.validity.valueMissing) {
    error.textContent = 'Required';
  } else if (input.validity.tooShort) {
    error.textContent = `Min length: ${input.minLength}`;
  } else if (input.validity.tooLong) {
    error.textContent = `${input.value.length}/${input.maxLength}`;
  } else if (input.validity.typeMismatch) {
    error.textContent = typeMismatchMessage;
  } else if (input.validity.rangeUnderflow || input.validity.rangeOverflow) {
    error.textContent = typeMismatchMessage;
  } else if (input.validity.patternMismatch) {
    error.textContent = typeMismatchMessage;
  }
  error.className = 'error active';
  setIsInvalid(!input.validity.valid);
  updateStep3FormSubmit();
}

function updateStep3FormSubmit() {
  step3FormBtn.disabled =
    isFirstNameInvalid
    || isLastNameInvalid
    || isEmailInvalid
    || isPhoneInvalid
    || isGradYearInvalid
    || isCityInvalid
    || isStateInvalid;
}