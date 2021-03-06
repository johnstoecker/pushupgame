/**
 * Copyright 2012, Raxa
 *
 * This class provides util methods and constants that are shared by the core, apps and modules
 */

// TODO: https://raxaemr.atlassian.net/browse/RAXAJSS-382
// Move everything inside of Util so not in global scope. Then update
// references from other parts of application. E.g. page enums is a low hanging
// fruit to start with 

/* Phone Number Validation */
//Ext.apply(Ext.form.VTypes, {
//    phone: function (value, field) {
//        return value.replace(/[ \-\(\)]/g, '').length == 10;
//    },
//    phoneText: 'Invalid, number must be 10 digits',
//    phoneMask: /[ \d\-\(\)]/
//});

var HOST;
var DEFAULT_HOST = 'https://api.raxa.io';
if (localStorage.getItem("host") === null) {
    HOST = DEFAULT_HOST; 
} else { 
    HOST = localStorage.getItem("host"); 
}
var CONCEPT_HOST = 'http://search.raxa.io:4000';

var username;
var password;
var timeoutLimit = 150000;
var hospitalName = 'JSS Hospital';

// This is the name of the friend Identifier Type that is being Auto-Generated by the IDGen Module.
// Put the Identifier Type Name in between the /.* and the .*/
var idPattern = /.*RaxaEMR Identification Number.*/;

var DEFAULT_PRESCRIPTION_QUANTITY = 15;

//Open Mrs age limits
 


//BMI WHO Constants
var WHO_BMI_VSUNDERWEIGHT = 15;
var WHO_BMI_SUNDERWEIGHT = 16;
var WHO_BMI_UNDERWEIGHT = 18.5;
var WHO_BMI_NORMAL = 25;
var WHO_BMI_OVERWEIGHT = 30;
var WHO_BMI_OBESE = 35;
var WHO_BMI_SOBESE = 40;

// BMI Custom Constants
var BMI_MAX = 60;
var BMI_HEIGHT_MAX = 300;
var BMI_HEIGHT_MIN = 0;
var BMI_WEIGHT_MAX = 800;
var BMI_WEIGHT_MIN = 0;

// Enum for Key Maps
var KEY = {
    DELETE: 8,
    ENTER: 13,
    ESCAPE: 27
};
var keyMap = {
};

// Enum for Registration Module Page Numbers
var REG_PAGES = {
    HOME: {
        value: 0,
        name: "home"
    },
    REG_1: {
        value: 1,
        name: "registrationpart1"
    },
    REG_CONFIRM: {
        value: 2,
        name: "registrationconfirm"
    },
    ILLNESS_DETAILS: {
        value: 3,
        name: "illnessdetails"
    },
    REG_BMI: {
        value: 4,
        name: "registrationbmi"
    },
    SEARCH_1: {
        value: 5,
        name: "searchpart1"
    },
    SEARCH_2: {
        value: 6,
        name: "searchpart2"
    },
    SEARCH_CONFIRM: {
        value: 7,
        name: "searchconfirm"
    }
};

var UITIME = 120000;
var ONEDAYMS = 86400000;
var MONTHSINAYEAR = 12;
var diffinUTC_GMT = 5.5;    // TODO: Fix this hack, which only works in timzeones <= IST :) instead should get time from OpenMRS server, ideally

//number of hours for everything to be before now
//OpenMRS checks whether encounters are ahead of current time --
//if a system clock is ahead of OpenMRS clock, some things can't be posted
//therefore, we need to fudge our time a few mins behind
var TIME_BEFORE_NOW = 0.1;

// The Util class provids several methods that are shared by the core, apps and modules
var Util = {
    conceptVersion : "0.3.01",
    // Enum to capture pages in each app. E.g. Util.PAGES.SCREENER.PAGE_NAME
    PAGES: {},
    
    //string to know whether a friend is able to be screened to
    DOCTOR_ATTRIBUTE: 'isOutfriendDoctor - true',

    //all the provider attributes used in friend record print
    REQUIRED_PROVIDER_ATTRIBUTES: [ "Specialty", "Degree", "Registration Number", "Degree", "Timings Line 1", "Primary Contact" , "Email"],

    ALL_PROVIDER_ATTRIBUTES: [ "Specialty", "Degree", "Registration Number", "Degree", "Timings Line 1", "TimingsLine2", "Primary Contact" , "Email", "Secondary Contact", "isOutfriendDoctor"],

    DEFAULT_LOCATION: "GAN",
    OPEN_MRS_MIN_AGE : 0,
    OPEN_MRS_MAX_AGE : 120,
    Taken_Morning : "morning ** true.",
    Taken_Day : "day ** true.",
    Taken_Even : "evening ** true.",
    Taken_Night : "night ** true.",

    SEARCH_WAIT_TIME : 700,

    //how many letters required before searching (drug, friend, investigation, etc)
    LETTERS_REQUIRED_TO_SEARCH : 3,

    /*
     * Listener to workaround maxLength bug in HTML5 numberfield with Sencha
     * Number field fails to enforce maxLength, so must add JavaScript listener
     * http://stackoverflow.com/questions/9613743/maxlength-attribute-of-numberfield-in-sencha-touch
     */
    maxLengthListener: function(maxLength) {
        return {
            keyup: function(textfield, e, eOpts) {
                var value = textfield.getValue() + '';
                var length = value.length;

                var MAX_LENGTH = maxLength;
                if (length > MAX_LENGTH) {
                    textfield.setValue(value.substring(0, MAX_LENGTH));
                    return false;
                }
            }
        };
    },

    /**
     *Returns the value of time difference in UTC and GMT
     *@return diffinUTC_GMT
     */
    getUTCGMTdiff: function() {
        //return diffinUTC_GMT;
        return 0;
    },
    
    /**
     *Returns the value of time for updating the friends waiting title and automatic refresh
     *@return UITIME 
     */
    getUiTime: function () {
        return UITIME;
    },
    
    /**
     *Returns how many days are left from now to date passed in
     */
    daysFromNow: function(futureDate) {
        var future = new Date(futureDate);
        var now = new Date();
        return Math.ceil((future.getTime()-now.getTime())/ONEDAYMS);
    },

    monthsFromNow: function(futureDate) {
        var future = new Date(futureDate);
        var now = new Date();
        return Math.ceil((future.getFullYear()-now.getFullYear())*MONTHSINAYEAR + future.getMonth()-now.getMonth());
    },

    daysBetween: function(pastDate, futureDate) {
        var future = new Date(futureDate);
        var past = new Date(pastDate);
        return Math.abs(Math.ceil((future.getTime()-past.getTime())/ONEDAYMS));
    },

    monthsBetween: function(pastDate, futureDate) {
        var future = new Date(futureDate);
        var past = new Date(pastDate);
        return Math.abs((future.getFullYear()-past.getFullYear())*MONTHSINAYEAR + future.getMonth()-past.getMonth())
    },

    /**
     *Gets the current time
     */
    getCurrentTime: function(){
        return this.Datetime(new Date(), this.getUTCGMTdiff());
    },

    /**
     * Returns the time so the server can understand
     * Shifts time to correct server time
     **/
    Datetime: function (d, hours) {
        if (typeof hours == 'undefined') {  
            hours = 0;
        }
        var MS_PER_MINUTE = 60000;
        var k = new Date(d - (60 * hours) * MS_PER_MINUTE - localStorage.getItem('serverTimeDiff'));

        function pad(n) {
            return n < 10 ? '0' + n : n;
        }
        return k.getFullYear() + '-' + pad(k.getMonth() + 1) + '-' + pad(k.getDate()) + 'T' + pad(k.getHours()) + ':' + pad(k.getMinutes()) + ':' + pad(k.getSeconds()) + 'Z';
    },

    /**
     *Returns the value of TimeoutLimit for login timeout 
     *@return timeoutLimit for timeout in login 
     */
    getTimeoutLimit: function () {
        return timeoutLimit;
    },

    getHospitalName: function () {
        return hospitalName;
    },

    /**
     * Returns all the headers required for Basic Authenticated REST calls
     * @return headers object that includes Authorization, Accept and Content-Type
     */
    getBasicAuthHeaders: function () {
        var headers = {
            "Authorization": localStorage.getItem("basicAuthHeader"),
            "Accept": "application/json",
            "Content-Type": "application/json"
        };
        return headers;
    },

    /**
     * Logout the current user. Ends the current session
     */
    logoutUser: function () {      
        Ext.Ajax.request({
            url: HOST + '/ws/rest/v1/session',
            withCredentials: true,
            useDefaultXhrHeader: false,
            method: 'DELETE'
        });
        localStorage.removeItem('basicAuthHeader');
        localStorage.removeItem('privileges');
        localStorage.removeItem('Username');
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('loggedInProvider');
        localStorage.removeItem('session');
        for(var i=0; i<Util.ALL_PROVIDER_ATTRIBUTES.length; i++){
            var attributeName = "provider" + Util.ALL_PROVIDER_ATTRIBUTES[i].replace(/\s+/g, '');
            localStorage.removeItem(attributeName);
        }
    },
        
    /**
     * Saves the Basic Authentication header to Localstorage
     * Verifies if username + password is valid on server and saves as Base4 encoded string of user:pass
     */
    //Currently no longer needed for login. Commenting.
    saveBasicAuthHeader: function (username, password) {
        Util.logoutUser(); //Delete existing logged in sessions
        localStorage.setItem("basicAuthHeader", "Basic " + window.btoa(username + ":" + password));
    },

    /**
     * Returns all the modules in Raxa
     * @return [ 'login', 'screener', ....]
     */
    getModules: function () {
        //always keep login at first position as its app path is different
        return ['login', 'screener', 'registrationextjs4', 'pharmacy', 'chw', 'outfriend', 'laboratory', 'friendfacing', 'admin', 'billing'];
        //return ['login', 'screener', 'registrationextjs4', 'pharmacy', 'outfriend', 'admin'];        
    },

    generateUUID: function () {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[x]/g, function(c) {
            var r = (d + Math.random()*16)%16 | 0;
            d = Math.floor(d/16);
            return (c=='x' ? r : (r&0x7|0x8)).toString(16);
        });
        return uuid;
    }, 

    /**
       *Return selected module in Raxa and by changing the module text font .
       *@return [ 'LOGIN', 'SCREENER', ....]
       */
    getSelectModules: function () {
        var module=[];
        for (var i = 0; i < Util.getModules().length ; i++) {
            var text = Util.getModules()[i];
            var changedText = "";
            switch(text) {
                case 'login' :
                    changedText = 'Dashboard';
                    break;
                case 'screener' :
                    changedText = 'Screener';
                    break;
                case 'registration' :
                    changedText = 'Registration Mobile';
                    break;
                case 'registrationextjs4':
                    changedText = 'Registration';
                    break;
                case 'pharmacy' :
                    changedText = 'Pharmacy';
                    break;
                case 'chw' :
                    changedText = 'Chw';
                    break;
                case 'outfriend' :
                    changedText = 'Opd';
                    break;
                case 'laboratory' :
                    changedText = 'Laboratory';
                    break;
                case  'friendfacing':
                    changedText = 'friend Facing';
                    break;
                case  'admin':
                    changedText = 'Admin';
                    break;
                case  'billing':
                    changedText = 'Billing';
                    break;
                default :
                    changedText = 'You dont have permission to access any Module';
                    break;
            }
            var dropDownObj = {
                text : changedText , 
                value:Util.getModules()[i]
            };
            module.push(dropDownObj);
        } 
        return module;
    },
    

    getApps: function () {
        //always keep login at first position as its app path is different
        return ['gotStatins', 'problemList'];
    },
    /**
     *Generate six digit randomly generated Device Id  
     *Checks if any key with name "deviceId" is previously stored in localStorage, returns it if availaible
     *@return deviceId
     *
     */
    getDeviceId: function () {
        var deviceId;
        //Checks if localStorage already has deviceId stored in it        
        if (localStorage.getItem("deviceId") === null) {
            var randomNumber = [];
            for (var i = 0; i < 6; i++) {
                //generates random digit from 0 to 10
                randomNumber[i] = (Math.floor(Math.random() * 10));
            }
            deviceId = randomNumber.join('');
            localStorage.setItem("deviceId", deviceId);
            console.log('6-digit randomly generated Device Id: ' + deviceId + ' & is stored in localStorage');

        } else {
            // gets the value of deviceId if available in localStorage 
            deviceId = localStorage.getItem("deviceId");
            console.log('6-digit randomly generated Device Id that was stored in localStorage:' + deviceId);
        }
        return deviceId;
    },

    /**
     * gets the friend Identifier generated by the IDGen Module
     * Note: The Identifier type must be the 3rd in the list (ie at position 2) for this to work properly.
     */
    getfriendIdentifier: function () {
        var locationString = arguments[0];
        if(arguments[0] === undefined){
            locationString = this.DEFAULT_LOCATION;
        }
        var generatedId = locationString +(Math.floor(Math.random()*1000000)).toString();
        url = HOST + '/ws/rest/v1/friend?q='+generatedId,
        xmlHttp = new XMLHttpRequest(); 
        xmlHttp.open( "GET", url , false );
        xmlHttp.setRequestHeader("Accept", "application/json");
        xmlHttp.setRequestHeader("Authorization", localStorage.getItem("basicAuthHeader"));
        xmlHttp.send();
        var jsonData = JSON.parse(xmlHttp.responseText);
        if (xmlHttp.status == "200") {
            if(jsonData.results.length > 0) {
                return(Util.getfriendIdentifier());
            } else {
                return generatedId;
            }
        }
    },
    
    //  getX: function(){return 5},

    //Function to help share Models between ExtJS and Sencha Touch 2
    platformizeModelConfig: function (extJsModelConfig) {
        if (Ext.versions.extjs) {
            return extJsModelConfig; // nothing to change, we are on ext
        } else if (Ext.versions.touch) {
            // transform to Sencha Touch 2 data model
            var config = {
                extend: extJsModelConfig.extend,
                config: extJsModelConfig
            };
            delete config.config.extend;
            return config;
        } else {
            Ext.Error.raise('Could not recognize Library');
        }
    },
    
    // Returns session, a JSON. so far this includes:
    // - person uuid
    // - person preferredName display
    getSession: function() {
        return JSON.parse(localStorage.session);
    },

    getPersonUuidFromProviderUuid: function (uuid) {
        Ext.Ajax.request({
            url: HOST + '/ws/rest/v1/provider/' + uuid,
            method: 'GET',
            disableCaching: false,
            headers: Util.getBasicAuthHeaders(),
            failure: function (response) {
                console.log('GET failed with response status: ' + response.status);
            },
            success: function (response) {
                if (console.log(JSON.parse(response.responseText).person.uuid) != null) {
                    return JSON.parse(response.responseText).person.uuid;
                } else {
                    // TODO: should throw an exception, not return the wrong string
                    // Ext.Error.raise('<Error Text>');
                    return "provider with given uuid does not exist";
                }
            }
        });
    },

    KeyMapButton: function(ComponentName,keyName)
    {
        if(keyMap.keyName!=null)
        {
            this.DestroyKeyMapButton(keyName);
        }
        keyMap.keyName = Ext.create('Ext.util.KeyMap',Ext.getBody(), [
        {
            key: keyName,
            shift: false,
            ctrl: false,
            fn:function(){
                var element = Ext.getCmp(ComponentName);
                element.fireEvent('click',element);

            }
        }
        ]);

    },

    DestroyKeyMapButton: function(keyName)
    {
        keyMap.keyName.destroy(true);
        keyMap.keyName=null;
    },

    getProviderUuidFromPersonUuid: function (uuid) {
        Ext.Ajax.request({
            url: HOST + '/ws/rest/v1/provider?v=full',
            method: 'GET',
            disableCaching: false,
            headers: Util.getBasicAuthHeaders(),
            failure: function (response) {
                console.log('GET failed with response status: ' + response.status);
            },
            success: function (response) {
                var allProviders = JSON.parse(response.responseText).results;
                for(i=0; i<allProviders.length; i++){
                    if(allProviders[i].person.uuid === uuid){
                        console.log("success");
                        localStorage.setItem("loggedInProvider", allProviders[i].uuid);
                        return allProviders[i].uuid;
                    }
                }
                return "provider with given uuid not found";
            }
        });
    },
    
    /**
     * Returns the uuid of the logged in provider
     */
    getLoggedInProviderUuid: function(){
        if(localStorage.getItem("loggedInProvider")){
            return localStorage.getItem("loggedInProvider");
        }
        else{
            // Ext.Error.raise('Provider is not logged in');
            return null;
        }
    },
    
    /**
     * Runs before each module. Checks whether user has the privilege to view a specific module
     * If not, redirects to login page.
     * If so, returns true.
     */
    checkModulePrivilege: function(module){
        var privileges = localStorage.getItem("privileges");
        if(privileges!== null && (privileges.indexOf('RaxaEmrView '+module)!==-1 || privileges.indexOf('all privileges')!==-1)){
            return true;
        }
        else{
            window.location = "../";
        }
    },

    /**
     * Sends an alert according to given parameters
     */
    sendAlert: function(alertParams){
        var alertParam = Ext.encode(alertParams);
        Ext.Ajax.request({
            url: HOST + '/ws/rest/v1/raxacore/raxaalert',
            method: 'POST',
            disableCaching: false,
            headers: Util.getBasicAuthHeaders(),
            params: alertParam,
            failure: function (response) {
                console.log('POST alert failed with response status: ' + response.status);
            }
        });
    },
    
    /**
     * The message to send when a resource fails to load from the server
     */
    getMessageLoadError: function() {
        return "Internet connection error";
    },
    
    /**
     * Message to send when a resource fails to write to a server
     */
    getMessageSyncError: function() {
        return "Internet connection error";
    },

    /**
     * Creates a new drug in OpenMRS based on given parameters
     * newDrugParam contains:
     * drugName
     * manufacturer
     * supplier
     * cost
     * price
     * dosageForm
     * minimumDailyDose
     * maximumDailyDose
     * units
     */
    submitNewDrug: function(newDrugParam, callback) {
        console.log(newDrugParam);
        //getting drug concept from OpenMRS
        //First, we check if the new drug concept exists in RxNorm/Openmrs -- if not, we will have to create
        //a new concept
        Ext.Ajax.request({
            url: HOST + '/ws/rest/v1/concept?q='+newDrugParam.genericName+"&v=full",
            method: 'GET',
            disableCaching: false,
            headers: Util.getBasicAuthHeaders(),
            success: function (response) {
                var jsonResponse = Ext.decode(response.responseText);
                var j=0;
                var foundDrugConcept = false;
                while(j<jsonResponse.results.length && !foundDrugConcept){
                    if (jsonResponse.results[j].conceptClass.description === "Drug"){
                        foundDrugConcept = true;
                        newDrugParam.conceptUuid = jsonResponse.results[j].uuid;
                        this._postNewDrug(newDrugParam, callback);
                    }
                    j++;
                }
                if(!foundDrugConcept){
                    //we need to make the concept as we didn't find it
                    this.postConceptForNewDrug(newDrugParam, callback);
                }
            },
            failure: function() {
                Ext.Msg.alert("Error", Util.getMessageSyncError());
                callback();
            },
            scope: this
        });
    },

    // Helper to assist in REST call, which creates new drugs in OpenMRS db
    _postNewDrug: function(newDrugParam, callback) {
        var newDrugInfo = {
            name: newDrugParam.manufacturer,
            description: newDrugParam.supplier,
            cost: newDrugParam.cost,
            price: newDrugParam.price
        };
        var newDrug = {
            concept: newDrugParam.conceptUuid,
            name: newDrugParam.drugName,
            dosageForm: newDrugParam.dosageForm,
            strength: newDrugParam.strength,
            units: newDrugParam.units,
            drugInfo: newDrugInfo
        };
        var drugParam = Ext.encode(newDrug);
        Ext.Ajax.request({
            url: HOST + '/ws/rest/v1/raxacore/drug',
            method: 'POST',
            params: drugParam,
            disableCaching: false,
            headers: Util.getBasicAuthHeaders(),
            success: function (response) {
                var jsonResponse = Ext.decode(response.responseText);
                Ext.Msg.alert('Drug created successfully');
                newDrug.dosageForm = jsonResponse.dosageForm;
                newDrug.uuid = jsonResponse.uuid;
                callback(newDrug);
            },
            failure: function (response) {
                Ext.Msg.alert('Error: unable to write to server. Enter all fields.');
                callback();
            },
            scope: this
        });
    },

    /**
     * Creates a new concept in OpenMrs, in case drug is not part of RxNorm/OpenMrs
     */
    postConceptForNewDrug: function(newDrugParam, callback){
        var newConcept = {
            names: [{
                name: newDrugParam.genericName, 
                locale: "en", 
                conceptNameType: "FULLY_SPECIFIED"
            }],
            datatype: localStorage.drugConceptDataTypeUuid,
            conceptClass: localStorage.drugConceptClassUuid
        };
        var newConceptParam = Ext.encode(newConcept);
        Ext.Ajax.request({
            url: HOST + '/ws/rest/v1/concept',
            method: 'POST',
            params: newConceptParam,
            disableCaching: false,
            headers: Util.getBasicAuthHeaders(),
            success: function (response) {
                var jsonResponse = Ext.decode(response.responseText);
                newDrugParam.conceptUuid = jsonResponse.uuid;
                this._postNewDrug(newDrugParam, callback);
            },
            failure: function() {
                Ext.Msg.alert("Error", Util.getMessageSyncError());
                callback();
            },
            scope: this
        });
    },
    
    calculateMedicationQuantity: function(prescription){
        var duration = prescription.duration;
        var frequency = prescription.frequency;
        console.log(prescription);
        switch(frequency) {
            case 'q.h.' :
                return duration * 24;
            case 'qqh' :
                return duration * 6;
            case 'q.d.s.' :
                return duration * 4;
            case 't.d.s.' :
                return duration * 3;
            case 'b.d' :
                return duration * 2;
            case 'q.d., q1d' || 'q.a.m.' || 'q.p.m.' || 'q4PM' || 'q.h.s.':
                return duration;
            case 'q.a.d.':
                return Math.ceil(duration/2);
            case 't.i.w.':
                return Math.round(duration*3/7);
            case 'QWK' :
                return Math.ceil(duration/7);
            case 'p.r.n':
                return DEFAULT_PRESCRIPTION_QUANTITY;
            case 'q.s.':
                return DEFAULT_PRESCRIPTION_QUANTITY;
            case 'ad lib':
                return DEFAULT_PRESCRIPTION_QUANTITY;
            default :
                return DEFAULT_PRESCRIPTION_QUANTITY;
        }
    },
    
    getDirectionsFromPharmacyAbbreviation: function(abbrev){
        switch(abbrev) {
            case 'q.h.' :
                return "every hour";
            case 'qqh' :
                return "every 4 hours";
            case 'q.d.s.' :
                return "4x per day";
            case 't.d.s.' :
                return "3x per day";
            case 'b.d' :
                return "2x per day";
            case 'q.d., q1d' :
                return "every day";
            case 'q.a.m.' :
                return "every day before noon";
            case 'q.p.m.':
                return "every day after noon";
            case 'q4PM':
                return "every day at 4 PM";
            case 'q.h.s.':
                return "every night at bedtime";
            case 'q.a.d.':
                return "every other day";
            case 't.i.w.':
                return "3x per week";
            case 'QWK' :
                return "once per week";
            case 'p.r.n':
                return "as needed";
            case 'q.s.':
                return "sufficient quantity";
            case 'ad lib':
                return "as needed";
            default :
                return "N/A";
        }
    },

    //adds the server time difference to account for time zones differences with server
    getTimeAsServerTime: function(time) {
        var newTime = new Date();
        newTime.setTime(time.getTime() + parseInt(localStorage.serverTimeDiff));
        return newTime;
    },
    
    /**
     * Checks local storage and returns whether current provider has filled in all attributes needed for printing
     */
    hasAllAttributesForPrint: function() {
        for(var i=0; i<Util.REQUIRED_PROVIDER_ATTRIBUTES.length; i++){
            var attributeName = "provider" + Util.REQUIRED_PROVIDER_ATTRIBUTES[i].replace(/\s+/g, '');
            if(!localStorage.getItem(attributeName) || localStorage.getItem(attributeName)===""){
                return false;
            }
        }
        return true;
    },

    isMobileSafari: function() {
        return navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)
    },

    /**
     * Detecting vertical squash in loaded image.
     * Fixes a bug which squash image vertically while drawing into canvas for some images.
     * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
     */
    detectVerticalSquash: function (img) {
        var iw = img.naturalWidth, ih = img.naturalHeight;
        var canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = ih;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var data = ctx.getImageData(0, 0, 1, ih).data;
        // search image edge pixel position in case it is squashed vertically.
        var sy = 0;
        var ey = ih;
        var py = ih;
        while (py > sy) {
            var alpha = data[(py - 1) * 4 + 3];
            if (alpha === 0) {
                ey = py;
            } else {
                sy = py;
            }
            py = (ey + sy) >> 1;
        }
        var ratio = (py / ih);
        return (ratio===0)?1:ratio;
    }

}
