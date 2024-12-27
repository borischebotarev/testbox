const stateSelectOptions = {
    0: 'Alabama',
    1: 'Alaska',
    2: 'Arizona',
    3: 'Arkansas',
    4: 'California',
    5: 'Colorado',
    6: 'Connecticut',
    7: 'Delaware',
    8: 'Florida',
    9: 'Georgia',
    10: 'Hawaii',
    11: 'Idaho',
    12: 'Illinois',
    13: 'Indiana',
    14: 'Iowa',
    15: 'Kansas',
    16: 'Kentucky',
    17: 'Louisiana',
    18: 'Maine',
    19: 'Maryland',
    20: 'Massachusetts',
    21: 'Michigan',
    22: 'Minnesota',
    23: 'Mississippi',
    24: 'Missouri',
    25: 'Montana',
    26: 'Nebraska',
    27: 'Nevada',
    28: 'New Hampshire',
    29: 'New Jersey',
    30: 'New Mexico',
    31: 'New York',
    32: 'North Carolina',
    33: 'North Dakota',
    34: 'Ohio',
    35: 'Oklahoma',
    36: 'Oregon',
    37: 'Pennsylvania',
    38: 'Rhode Island',
    39: 'South Carolina',
    40: 'South Dakota',
    41: 'Tennessee',
    42: 'Texas',
    43: 'Utah',
    44: 'Vermont',
    45: 'Virginia',
    46: 'Washington',
    47: 'West Virginia',
    48: 'Wisconsin',
    49: 'Wyoming'
}

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
const firstName = document.getElementById('first-name');
const firstNameError = document.querySelector('#first-name ~ span.error');
const lastName = document.getElementById('last-name');
const lastNameError = document.querySelector('#last-name ~ span.error');
const email = document.getElementById('email');
const emailError = document.querySelector('#email ~ span.error');
const phone = document.getElementById('phone');
const phoneError = document.querySelector('#phone ~ span.error');
const gradYear = document.getElementById('grad-year');
const curYear = (new Date()).getFullYear();
gradYear.min = curYear - 100;
gradYear.max = curYear;
const gradYearError = document.querySelector('#grad-year ~ span.error');
const city = document.getElementById('city');
const cityError = document.querySelector('#city ~ span.error');
const state = document.getElementById('state');
for (key in stateSelectOptions) {
    state.options[state.options.length] = new Option(stateSelectOptions[key], key);
}
const stateError = document.querySelector('#state ~ span.error');
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
let isFirstNameInvalid = true;
const setFirstNameInvalid = (isInvalid) => isFirstNameInvalid = isInvalid
let isLastNameInvalid = true;
const setLastNameInvalid = (isInvalid) => isLastNameInvalid = isInvalid
let isEmailInvalid = true;
const setEmailInvalid = (isInvalid) => isEmailInvalid = isInvalid
let isPhoneInvalid = true;
const setPhoneInvalid = (isInvalid) => isPhoneInvalid = isInvalid
let isGradYearInvalid = false;
const setGradYearInvalid = (isInvalid) => isGradYearInvalid = isInvalid
let isCityInvalid = true;
const setCityInvalid = (isInvalid) => isCityInvalid = isInvalid
let isStateInvalid = true;
const setStateInvalid = (isInvalid) => isStateInvalid = isInvalid
let contactInfo;
let jobInfo;
let selectedCoach;
let selectedLanguage;

const wave = document.getElementById('wave');
const searchModule = document.querySelector('rapport-scene');
const searchModuleRoot = searchModule && searchModule.shadowRoot;
const footer = searchModuleRoot && searchModuleRoot.getElementById('footer');