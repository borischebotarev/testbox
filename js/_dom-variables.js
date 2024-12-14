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
const stepBanner = document.getElementById('step-banner');
const stepWelcome = document.getElementById('step-welcome');
const stepLogin = document.getElementById('step-login');
const loginCloseBtn = document.getElementById('login-close');
const stepInterview = document.getElementById('step-interview');
const step1 = document.getElementById('step-start');
const step2 = document.getElementById('step-resume-template');
const step2List = document.getElementById('select-resume-template');
const step3 = document.getElementById('step-contact-info');
const step3Form = document.getElementById('contact-info-form');
const step3FormBtn = document.getElementById('contact-info-form-btn');
const step4 = document.getElementById('step-job-info');
const step4Form = document.getElementById('job-info-form');
const step5 = document.getElementById('step-coach');
const step5List = document.getElementById('select-coach');
const step6 = document.getElementById('step-language');
const step6Form = document.getElementById('language-form');
const step6LanguageSelect = document.getElementById('language-select');
const step6FormBtn = document.getElementById('language-form-btn');

let selectedResumeTemplate;
let contactInfo;
let jobInfo;
let selectedCoach;
let selectedLanguage; // will be set in index.js, just use this value in right place (value=en/es in <input/>)

const wave = document.getElementById('wave');
const searchModule = document.querySelector('rapport-scene');
const searchModuleRoot = searchModule && searchModule.shadowRoot;
const footer = searchModuleRoot && searchModuleRoot.getElementById('footer');