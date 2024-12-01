var user_email = ""
var client = ""
var position = ""
var clientName = ""
var trainAI = false;

var serverUrl;

const loadingContainer = document.getElementById('loadingContainer');
const rapportScene = document.getElementById('rapportScene');
const startButton = document.getElementById('startBtn');
const endButton = document.getElementById('endBtn');
const preparingButton = document.getElementById('preparingBtn');
const stepWelcome = document.getElementById('step-welcome');
const stepLogin = document.getElementById('step-login');
const loginCloseBtn = document.getElementById('login-close');
const stepInterview = document.getElementById('step-interview');
const step1 = document.getElementById('step-start');
const step2 = document.getElementById('step-choose');
const step2List = document.getElementById('choose-job');
let selectedLanguage; // will be set in index.js, just use this value in right place (value=en/es in <input/>)

const wave = document.getElementById('wave');
const searchModule = document.querySelector('rapport-scene');
const searchModuleRoot = searchModule && searchModule.shadowRoot;
const footer = searchModuleRoot && searchModuleRoot.getElementById('footer');