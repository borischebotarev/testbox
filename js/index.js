document.addEventListener('DOMContentLoaded', onPageLoad);
let selectedJob;

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
      console.log(data);
      // Enable elements on the target URL if authorized
      if (data.body.email == user_email && user_email != null) {
        step1.style.display = 'none';
        step2.style.display = 'block';
        stepWelcome.style.display = 'block';
        document.querySelectorAll('.header__auth').forEach(el => el.style.display = 'none');
        step2List.addEventListener('click', (event) => {
          selectedJob = event.target.closest("li")?.getAttribute('data-job');
          selectedLanguage = document.querySelector('.language__input:checked').value;
          let title;
          let avatarSrc;
          let iconSrc;
          switch (selectedJob) {
            case 'coffeeShop':
              title = 'Coffee Shop';
              avatarSrc = 'Agent Coffee.png';
              iconSrc = 'Icon_CoffeeShop%20(1).svg';
              break;
            case 'restaurant':
              title = 'Restaurant';
              avatarSrc = 'Agent Restaurant.png';
              iconSrc = 'Icon_Food%20(1).svg';
              break;
            case 'retail':
              title = 'Retail';
              avatarSrc = 'Agent Retail.png';
              iconSrc = 'Icon_Shopping%20(1).svg';
              break;
            default:
              return;
          }
          document.getElementById('jobTitle').innerText = title + ' Interview';
          document.getElementById('jobAvatar').src = 'img/Coaches/' + avatarSrc;
          document.getElementById('jobIcon').src = 'img/Categories%20Circle/' + iconSrc;
          document.getElementById('interviewWave').classList.add(selectedJob);
          stepWelcome.style.display = 'none';
          stepInterview.style.display = 'block';

          chosenAI.projectId = Wave.projectId;
          chosenAI.projectToken = Wave.projectToken;
          chosenAI.aiUserId = Wave.aiUserId;
          chosenAI.lobbyZoneId = Wave.lobbyZoneId;
          chosenAI.display = Wave.display;
          startLoadingAnimation();
          loadContent(selectedJob);
        })
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