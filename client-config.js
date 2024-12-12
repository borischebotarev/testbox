const projectConfigMap = new Map([
  [
    'getschooled',
    {
      serverURL: 'https://transcriptionservice.relativ.ai',
      logoImagePath: 'img/getschooled.png', // inside path: "/[clientName]/"
      instructionsFilePath: 'docs/instructions.pdf', // inside path: "/[clientName]/"
      pageTitle: 'Get Schooled', // Title for browser tab
      signupRedirectUrl: 'https://getschooled.com/sign-up/?redirect_from=resumecoach',
      loginRedirectUrl: 'https://getschooled.com/log-in/?redirect_from=resumecoach',
      callbackActions: {
        before: []
      },
      // list of script files that will be added to a specific client
      additionalScripts: [
        // inside path: "/[clientName]/js/"
        'interactionmgr.js',
        'unifiedresponseanalyzer.js',
        'questions.js',
      ]
    }
  ]
])

// Apply configuration
const urlParams = new URLSearchParams(window.location.search);
clientName = urlParams.get('client') || 'getschooled';
const clientConfig = projectConfigMap.get(clientName);
if (!clientConfig) {
  alert(`Client was not found!`);
} else {
  document.title = clientConfig.pageTitle;
  serverUrl = clientConfig.serverURL;
  document.querySelectorAll('.signupBtn').forEach(el => el.href = clientConfig.signupRedirectUrl);
  document.querySelectorAll('.loginBtn').forEach(el => el.href = clientConfig.loginRedirectUrl);
  document.getElementById('client-logo-id').src = `${clientName}/${clientConfig.logoImagePath}`;
  (clientConfig.additionalScripts || []).forEach(script => {
    const scriptTag = document.createElement('script');
    scriptTag.type = "text/javascript";
    scriptTag.src = `${clientName}/js/${script}`;
    document.body.appendChild(scriptTag);
  })
}