// ===============================
// CIVICFIX
// ===============================


// ===============================
// STORE REPORTS
// ===============================

let reports =
    JSON.parse(localStorage.getItem("reports")) || [];


// ===============================
// CUSTOMER CARE AGENT NUMBER
// ===============================

const CUSTOMER_CARE_NUMBER = "1800-123-4567";


// Leaflet map variable
let map = null;


// ===============================
// LOGIN
// ===============================

function loginUser() {

    const email =
        document.getElementById("loginEmail").value.trim();

    const password =
        document.getElementById("loginPassword").value.trim();

    const error =
        document.getElementById("loginError");


    if (
        email === "citizen@civicfix.com" &&
        password === "123456"
    ) {

        localStorage.setItem(
            "civicfixLoggedIn",
            "true"
        );

        document
            .getElementById("loginPage")
            .classList.add("hidden");

        document
            .getElementById("appPage")
            .classList.remove("hidden");

        error.textContent = "";

        showHome();

    } else {

        error.textContent = t("invalidLogin");
    }
}


// ===============================
// PASSWORD SHOW / HIDE
// ===============================

function togglePassword() {

    const password =
        document.getElementById("loginPassword");

    const button =
        document.getElementById("togglePassword");


    if (password.type === "password") {

        password.type = "text";

        if (button) {
            button.textContent = "Hide";
        }

    } else {

        password.type = "password";

        if (button) {
            button.textContent = "Show";
        }
    }
}


// ===============================
// LOGOUT
// ===============================

function logoutUser() {

    localStorage.removeItem(
        "civicfixLoggedIn"
    );


    if (map !== null) {

        map.remove();

        map = null;
    }


    document
        .getElementById("appPage")
        .classList.add("hidden");

    document
        .getElementById("loginPage")
        .classList.remove("hidden");
}


// ===============================
// PAGE NAVIGATION
// ===============================

function hideAllPages() {

    const home =
        document.getElementById("homePage");

    const report =
        document.getElementById("reportPage");

    const admin =
        document.getElementById("adminPage");


    if (home) {
        home.classList.add("hidden");
    }

    if (report) {
        report.classList.add("hidden");
    }

    if (admin) {
        admin.classList.add("hidden");
    }
}


// ===============================
// SHOW HOME
// ===============================

function showHome() {

    hideAllPages();


    const home =
        document.getElementById("homePage");


    if (home) {
        home.classList.remove("hidden");
    }


    updateHome();


    setTimeout(function () {

        initializeMap();


        if (map !== null) {

            setTimeout(function () {

                map.invalidateSize();

            }, 300);
        }

    }, 300);
}


// ===============================
// SHOW REPORT PAGE
// ===============================

function showReport() {

    hideAllPages();


    const report =
        document.getElementById("reportPage");


    if (report) {
        report.classList.remove("hidden");
    }
}


// ===============================
// SHOW ADMIN PAGE
// ===============================

function showAdmin() {

    hideAllPages();


    const admin =
        document.getElementById("adminPage");


    if (admin) {
        admin.classList.remove("hidden");
    }


    updateAdmin();
}


// ===============================
// MAP INITIALIZATION
// ===============================

function initializeMap() {

    const mapElement =
        document.getElementById("map");


    if (!mapElement) {

        console.error(
            "CivicFix: Map element not found."
        );

        return;
    }


    if (typeof L === "undefined") {

        console.error(
            "CivicFix: Leaflet did not load."
        );

        return;
    }


    if (map !== null) {

        setTimeout(function () {

            map.invalidateSize();

            displayMapReports();

        }, 100);

        return;
    }


    try {

        map = L.map("map", {

            center: [
                17.3850,
                78.4867
            ],

            zoom: 13

        });


        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    "&copy; OpenStreetMap contributors",

                maxZoom: 19
            }
        ).addTo(map);


        setTimeout(function () {

            if (map !== null) {

                map.invalidateSize();

                displayMapReports();
            }

        }, 500);


    } catch (error) {

        console.error(
            "CivicFix map error:",
            error
        );
    }
}


// ===============================
// DISPLAY REPORTS ON MAP
// ===============================

function displayMapReports() {

    if (map === null) {
        return;
    }


    reports.forEach(function (report) {

        if (
            report.latitude &&
            report.longitude
        ) {

            const marker =
                L.marker([
                    report.latitude,
                    report.longitude
                ]).addTo(map);


            marker.bindPopup(
                "<b>" +
                escapeHTML(report.type) +
                "</b><br>" +

                escapeHTML(report.description) +

                "<br><br><strong>" +
                t("status") +
                ":</strong> " +

                escapeHTML(report.status)
            );
        }

    });
}


// ===============================
// UPDATE HOME DASHBOARD
// ===============================

function updateHome() {

    const total =
        reports.length;


    const open =
        reports.filter(function (report) {

            return report.status === "Open";

        }).length;


    const progress =
        reports.filter(function (report) {

            return report.status === "In Progress";

        }).length;


    const resolved =
        reports.filter(function (report) {

            return report.status === "Resolved";

        }).length;


    const totalElement =
        document.getElementById("totalReports");

    const openElement =
        document.getElementById("openReports");

    const progressElement =
        document.getElementById("progressReports");

    const resolvedElement =
        document.getElementById("resolvedReports");


    if (totalElement) {
        totalElement.textContent = total;
    }

    if (openElement) {
        openElement.textContent = open;
    }

    if (progressElement) {
        progressElement.textContent = progress;
    }

    if (resolvedElement) {
        resolvedElement.textContent = resolved;
    }


    displayRecentReports();
}


// ===============================
// RECENT REPORTS
// ===============================

function displayRecentReports() {

    const container =
        document.getElementById("recentReports");


    if (!container) {
        return;
    }


    if (reports.length === 0) {

        container.innerHTML =
            "<p class=\"empty\">" +
            t("noReports") +
            "</p>";

        return;
    }


    const recent =
        reports.slice(-5).reverse();


    container.innerHTML =
        recent.map(function (report) {

            return `
                <div class="report-card">

                    <h3>
                        ${escapeHTML(report.type)}
                    </h3>

                    <p>
                        ${escapeHTML(report.description)}
                    </p>

                    <p>
                        <strong>${t("status")}:</strong>
                        ${escapeHTML(report.status)}
                    </p>

                    <p>
                        <strong>${t("location")}:</strong>
                        ${escapeHTML(
                            report.location ||
                            t("notProvided")
                        )}
                    </p>

                </div>
            `;

        }).join("");
}


// ===============================
// GET USER LOCATION
// ===============================

function getLocation() {

    const locationInput =
        document.getElementById("location");


    if (!navigator.geolocation) {

        alert(
            t("geoUnsupported")
        );

        return;
    }


    locationInput.value =
        t("gettingLocation");


    navigator.geolocation.getCurrentPosition(

        function (position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            locationInput.value =
                latitude.toFixed(6) +
                ", " +
                longitude.toFixed(6);


            locationInput.dataset.latitude =
                latitude;

            locationInput.dataset.longitude =
                longitude;

        },

        function () {

            locationInput.value =
                t("unableLocation");

            alert(
                t("allowLocation")
            );

        }

    );
}


// ===============================
// SUBMIT REPORT
// ===============================

function submitReport() {

    const type =
        document.getElementById("issueType").value;

    const description =
        document
            .getElementById("description")
            .value
            .trim();

    const photoInput =
        document.getElementById("photo");

    const locationInput =
        document.getElementById("location");


    if (!type) {

        alert(
            t("selectIssue")
        );

        return;
    }


    if (!description) {

        alert(
            t("enterDescription")
        );

        return;
    }


    if (!locationInput.value) {

        alert(
            t("getLocationFirst")
        );

        return;
    }


    const latitude =
        parseFloat(
            locationInput.dataset.latitude
        );


    const longitude =
        parseFloat(
            locationInput.dataset.longitude
        );


    let photo = "";


    if (
        photoInput &&
        photoInput.files &&
        photoInput.files.length > 0
    ) {

        const file =
            photoInput.files[0];


        const reader =
            new FileReader();


        reader.onload = function (event) {

            photo =
                event.target.result;


            saveReport(
                type,
                description,
                locationInput.value,
                latitude,
                longitude,
                photo
            );

        };


        reader.readAsDataURL(file);

        return;
    }


    saveReport(
        type,
        description,
        locationInput.value,
        latitude,
        longitude,
        photo
    );
}


// ===============================
// SAVE REPORT
// ===============================

function saveReport(
    type,
    description,
    location,
    latitude,
    longitude,
    photo
) {

    const newReport = {

        id:
            Date.now(),

        type:
            type,

        description:
            description,

        location:
            location,

        latitude:
            latitude,

        longitude:
            longitude,

        photo:
            photo,

        status:
            "Open",

        date:
            new Date().toLocaleString()

    };


    reports.push(newReport);


    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );


    alert(
        t("reportSuccess")
    );


    const issueType =
        document.getElementById("issueType");

    const descriptionInput =
        document.getElementById("description");

    const photoInput =
        document.getElementById("photo");

    const locationInput =
        document.getElementById("location");


    if (issueType) {
        issueType.value = "";
    }

    if (descriptionInput) {
        descriptionInput.value = "";
    }

    if (photoInput) {
        photoInput.value = "";
    }

    if (locationInput) {

        locationInput.value = "";

        delete locationInput.dataset.latitude;

        delete locationInput.dataset.longitude;
    }


    updateHome();

    showHome();
}


// ===============================
// ADMIN DASHBOARD
// ===============================

function updateAdmin() {

    const container =
        document.getElementById("adminReports");


    if (!container) {
        return;
    }


    if (reports.length === 0) {

        container.innerHTML =
            "<p>" +
            t("noReportsAdmin") +
            "</p>";

        return;
    }


    container.innerHTML =
        reports
            .slice()
            .reverse()
            .map(function (report) {

                return `

                    <div class="report-card">

                        <h3>
                            ${escapeHTML(report.type)}
                        </h3>

                        <p>
                            ${escapeHTML(report.description)}
                        </p>

                        <p>
                            <strong>${t("location")}:</strong>
                            ${escapeHTML(
                                report.location ||
                                t("notProvided")
                            )}
                        </p>

                        <p>
                            <strong>${t("date")}:</strong>
                            ${escapeHTML(report.date)}
                        </p>

                        <p>
                            <strong>${t("status")}:</strong>
                            ${escapeHTML(report.status)}
                        </p>


                        ${
                            report.photo
                            ?
                            `
                            <img
                                src="${report.photo}"
                                alt="Report photo"
                                style="
                                    width:180px;
                                    max-width:100%;
                                    border-radius:10px;
                                    margin-top:10px;
                                "
                            >
                            `
                            :
                            ""
                        }


                        <div style="margin-top:15px;">

                            <button
                                onclick="changeStatus(${report.id}, 'Open')"
                            >
                                ${t("open")}
                            </button>

                            <button
                                onclick="changeStatus(${report.id}, 'In Progress')"
                            >
                                ${t("inProgress")}
                            </button>

                            <button
                                onclick="changeStatus(${report.id}, 'Resolved')"
                            >
                                ${t("resolved")}
                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");
}


// ===============================
// CHANGE REPORT STATUS
// ===============================

function changeStatus(
    id,
    newStatus
) {

    const report =
        reports.find(function (item) {

            return item.id === id;

        });


    if (!report) {
        return;
    }


    report.status =
        newStatus;


    localStorage.setItem(
        "reports",
        JSON.stringify(reports)
    );


    updateAdmin();

    updateHome();


    if (map !== null) {

        displayMapReports();
    }
}


// ===============================
// CUSTOMER CARE
// ===============================

function updateCustomerCareNumber() {

    const numberElement =
        document.getElementById(
            "customerCareNumber"
        );


    if (!numberElement) {
        return;
    }


    numberElement.href =
        "tel:" +
        CUSTOMER_CARE_NUMBER.replace(
            /[^0-9+]/g,
            ""
        );


    numberElement.innerHTML =
        '<span data-i18n="customerCareAgent">' +
        escapeHTML(
            t("customerCareAgent")
        ) +
        '</span> ' +
        escapeHTML(
            CUSTOMER_CARE_NUMBER
        );
}


// ===============================
// ESCAPE HTML
// ===============================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ===============================
// SMARTCIVIC LANGUAGE SUPPORT
// ===============================

const translations = {

    en: {

        brand:
            "SmartCivic",

        loginSubtitle:
            "Make your city better, one report at a time.",

        email:
            "Email",

        password:
            "Password",

        login:
            "Login",

        demoLogin:
            "Demo Login",

        emailPlaceholder:
            "Enter your email",

        passwordPlaceholder:
            "Enter your password",

        home:
            "Home",

        reportIssue:
            "Report Issue",

        admin:
            "Admin",

        logout:
            "Logout",

        smartCity:
            "SMART CITY • COMMUNITY POWERED",

        fixCity:
            "Fix your city,",

        oneReport:
            "one report at a time.",

        heroDescription:
            "Report broken streetlights, garbage overflow and water leakages directly to municipal authorities with photo proof and location.",

        reportProblem:
            "+ Report a Problem",

        totalReports:
            "Total Reports",

        open:
            "Open",

        inProgress:
            "In Progress",

        resolved:
            "Resolved",

        working:
            "Working",

        fixed:
            "Fixed",

        problemsAroundCity:
            "Problems Around the City",

        recentReports:
            "Recent Reports",

        reportProblemTitle:
            "Report a Problem",

        reportHelp:
            "Help your community by reporting a civic issue.",

        issueType:
            "Issue Type",

        streetlight:
            "💡 Broken Streetlight",

        garbage:
            "🗑️ Garbage Overflow",

        water:
            "💧 Water Leakage",

        description:
            "Description",

        photoProof:
            "Photo Proof",

        location:
            "Location",

        getLocation:
            "📍 Get Location",

        submitReport:
            "Submit Report",

        municipalDashboard:
            "Municipal Dashboard",

        manageComplaints:
            "Manage and resolve citizen complaints.",

        descriptionPlaceholder:
            "Describe the problem...",

        locationPlaceholder:
            "Enter location or use GPS",

        status:
            "Status",

        date:
            "Date",

        notProvided:
            "Not provided",

        noReports:
            "No reports yet. Be the first to report a problem!",

        noReportsAdmin:
            "No reports available.",

        invalidLogin:
            "Invalid email or password.",

        geoUnsupported:
            "Geolocation is not supported by your browser.",

        gettingLocation:
            "Getting location...",

        unableLocation:
            "Unable to get location.",

        allowLocation:
            "Please allow location access in your browser.",

        selectIssue:
            "Please select an issue type.",

        enterDescription:
            "Please enter a description.",

        getLocationFirst:
            "Please get your location first.",

        reportSuccess:
            "Report submitted successfully.",

        customerCareAgent:
            "Customer Care Agent"
    },


    hi: {

        brand:
            "SmartCivic",

        loginSubtitle:
            "हर रिपोर्ट के साथ अपने शहर को बेहतर बनाएं।",

        email:
            "ईमेल",

        password:
            "पासवर्ड",

        login:
            "लॉगिन",

        demoLogin:
            "डेमो लॉगिन",

        emailPlaceholder:
            "अपना ईमेल दर्ज करें",

        passwordPlaceholder:
            "अपना पासवर्ड दर्ज करें",

        home:
            "होम",

        reportIssue:
            "समस्या रिपोर्ट करें",

        admin:
            "एडमिन",

        logout:
            "लॉगआउट",

        smartCity:
            "स्मार्ट सिटी • समुदाय की शक्ति",

        fixCity:
            "अपने शहर को बेहतर बनाएं,",

        oneReport:
            "एक बार में एक रिपोर्ट।",

        heroDescription:
            "टूटी स्ट्रीट लाइट, कचरे का ओवरफ्लो और पानी के रिसाव की रिपोर्ट फोटो और स्थान के साथ सीधे नगर निगम को भेजें।",

        reportProblem:
            "+ समस्या रिपोर्ट करें",

        totalReports:
            "कुल रिपोर्ट",

        open:
            "खुली",

        inProgress:
            "प्रगति में",

        resolved:
            "समाधान हो गया",

        working:
            "काम जारी",

        fixed:
            "ठीक हो गया",

        problemsAroundCity:
            "शहर के आसपास की समस्याएं",

        recentReports:
            "हाल की रिपोर्ट",

        reportProblemTitle:
            "समस्या रिपोर्ट करें",

        reportHelp:
            "सिविक समस्या की रिपोर्ट करके अपने समुदाय की मदद करें।",

        issueType:
            "समस्या का प्रकार",

        streetlight:
            "💡 टूटी स्ट्रीट लाइट",

        garbage:
            "🗑️ कचरे का ओवरफ्लो",

        water:
            "💧 पानी का रिसाव",

        description:
            "विवरण",

        photoProof:
            "फोटो प्रमाण",

        location:
            "स्थान",

        getLocation:
            "📍 स्थान प्राप्त करें",

        submitReport:
            "रिपोर्ट भेजें",

        municipalDashboard:
            "नगर निगम डैशबोर्ड",

        manageComplaints:
            "नागरिक शिकायतों को प्रबंधित और हल करें।",

        descriptionPlaceholder:
            "समस्या का वर्णन करें...",

        locationPlaceholder:
            "स्थान दर्ज करें या GPS का उपयोग करें",

        status:
            "स्थिति",

        date:
            "तारीख",

        notProvided:
            "उपलब्ध नहीं",

        noReports:
            "अभी कोई रिपोर्ट नहीं है। समस्या रिपोर्ट करने वाले पहले व्यक्ति बनें!",

        noReportsAdmin:
            "अभी कोई रिपोर्ट उपलब्ध नहीं है।",

        invalidLogin:
            "ईमेल या पासवर्ड गलत है।",

        geoUnsupported:
            "आपका ब्राउज़र जियोलोकेशन का समर्थन नहीं करता।",

        gettingLocation:
            "स्थान प्राप्त किया जा रहा है...",

        unableLocation:
            "स्थान प्राप्त नहीं हो सका।",

        allowLocation:
            "कृपया अपने ब्राउज़र में स्थान की अनुमति दें।",

        selectIssue:
            "कृपया समस्या का प्रकार चुनें।",

        enterDescription:
            "कृपया विवरण दर्ज करें।",

        getLocationFirst:
            "कृपया पहले अपना स्थान प्राप्त करें।",

        reportSuccess:
            "रिपोर्ट सफलतापूर्वक भेजी गई।",

        customerCareAgent:
            "ग्राहक सेवा एजेंट"
    },


    te: {

        brand:
            "SmartCivic",

        loginSubtitle:
            "ప్రతి నివేదికతో మీ నగరాన్ని మెరుగుపరచండి.",

        email:
            "ఈమెయిల్",

        password:
            "పాస్‌వర్డ్",

        login:
            "లాగిన్",

        demoLogin:
            "డెమో లాగిన్",

        emailPlaceholder:
            "మీ ఈమెయిల్ నమోదు చేయండి",

        passwordPlaceholder:
            "మీ పాస్‌వర్డ్ నమోదు చేయండి",

        home:
            "హోమ్",

        reportIssue:
            "సమస్యను నివేదించండి",

        admin:
            "అడ్మిన్",

        logout:
            "లాగ్‌అవుట్",

        smartCity:
            "స్మార్ట్ సిటీ • సమాజ శక్తి",

        fixCity:
            "మీ నగరాన్ని మెరుగుపరచండి,",

        oneReport:
            "ఒక్కోసారి ఒక నివేదిక.",

        heroDescription:
            "పాడైన వీధి దీపాలు, చెత్త పొంగిపోవడం మరియు నీటి లీకేజీలను ఫోటో ఆధారం మరియు ప్రదేశంతో నేరుగా మున్సిపల్ అధికారులకు నివేదించండి.",

        reportProblem:
            "+ సమస్యను నివేదించండి",

        totalReports:
            "మొత్తం నివేదికలు",

        open:
            "తెరిచి ఉంది",

        inProgress:
            "పురోగతిలో ఉంది",

        resolved:
            "పరిష్కరించబడింది",

        working:
            "పని జరుగుతోంది",

        fixed:
            "సరిచేయబడింది",

        problemsAroundCity:
            "నగరం చుట్టూ ఉన్న సమస్యలు",

        recentReports:
            "ఇటీవలి నివేదికలు",

        reportProblemTitle:
            "సమస్యను నివేదించండి",

        reportHelp:
            "సివిక్ సమస్యను నివేదించడం ద్వారా మీ సమాజానికి సహాయం చేయండి.",

        issueType:
            "సమస్య రకం",

        streetlight:
            "💡 పాడైన వీధి దీపం",

        garbage:
            "🗑️ చెత్త పొంగిపోవడం",

        water:
            "💧 నీటి లీకేజీ",

        description:
            "వివరణ",

        photoProof:
            "ఫోటో ఆధారం",

        location:
            "ప్రదేశం",

        getLocation:
            "📍 ప్రదేశాన్ని పొందండి",

        submitReport:
            "నివేదికను పంపండి",

        municipalDashboard:
            "మున్సిపల్ డ్యాష్‌బోర్డ్",

        manageComplaints:
            "పౌరుల ఫిర్యాదులను నిర్వహించి పరిష్కరించండి.",

        descriptionPlaceholder:
            "సమస్యను వివరించండి...",

        locationPlaceholder:
            "ప్రదేశాన్ని నమోదు చేయండి లేదా GPS ఉపయోగించండి",

        status:
            "స్థితి",

        date:
            "తేదీ",

        notProvided:
            "అందుబాటులో లేదు",

        noReports:
            "ఇంకా నివేదికలు లేవు. సమస్యను నివేదించిన మొదటి వ్యక్తి అవ్వండి!",

        noReportsAdmin:
            "ఇంకా నివేదికలు అందుబాటులో లేవు.",

        invalidLogin:
            "ఈమెయిల్ లేదా పాస్‌వర్డ్ తప్పుగా ఉంది.",

        geoUnsupported:
            "మీ బ్రౌజర్ జియోలొకేషన్‌కు మద్దతు ఇవ్వదు.",

        gettingLocation:
            "ప్రదేశాన్ని పొందుతోంది...",

        unableLocation:
            "ప్రదేశాన్ని పొందలేకపోయాము.",

        allowLocation:
            "దయచేసి మీ బ్రౌజర్‌లో ప్రదేశ అనుమతిని ఇవ్వండి.",

        selectIssue:
            "దయచేసి సమస్య రకాన్ని ఎంచుకోండి.",

        enterDescription:
            "దయచేసి వివరణను నమోదు చేయండి.",

        getLocationFirst:
            "దయచేసి ముందుగా మీ ప్రదేశాన్ని పొందండి.",

        reportSuccess:
            "నివేదిక విజయవంతంగా పంపబడింది.",

        customerCareAgent:
            "కస్టమర్ కేర్ ఏజెంట్"
    }
};


// ===============================
// CURRENT LANGUAGE
// ===============================

let currentLanguage =
    localStorage.getItem(
        "smartcivicLanguage"
    ) || "en";


// ===============================
// TRANSLATION FUNCTION
// ===============================

function t(key) {

    return (
        (
            translations[currentLanguage] &&
            translations[currentLanguage][key]
        )
        ||
        translations.en[key]
        ||
        key
    );
}


// ===============================
// CHANGE LANGUAGE
// ===============================

function changeLanguage(language) {

    if (!translations[language]) {

        language = "en";
    }


    currentLanguage =
        language;


    localStorage.setItem(
        "smartcivicLanguage",
        language
    );


    document.documentElement.lang =
        language;


    document
        .querySelectorAll("[data-i18n]")
        .forEach(function (element) {

            const key =
                element.getAttribute(
                    "data-i18n"
                );


            if (
                translations[language][key]
            ) {

                element.textContent =
                    translations[language][key];
            }

        });


    document
        .querySelectorAll(
            "[data-i18n-placeholder]"
        )
        .forEach(function (element) {

            const key =
                element.getAttribute(
                    "data-i18n-placeholder"
                );


            if (
                translations[language][key]
            ) {

                element.placeholder =
                    translations[language][key];
            }

        });


    document
        .querySelectorAll(
            "#languageSelect, #loginLanguageSelect"
        )
        .forEach(function (select) {

            select.value =
                language;

        });


    updateHome();

    updateAdmin();

    updateCustomerCareNumber();
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        changeLanguage(
            currentLanguage
        );


        const loggedIn =
            localStorage.getItem(
                "civicfixLoggedIn"
            );


        if (loggedIn === "true") {

            document
                .getElementById("loginPage")
                .classList.add("hidden");

            document
                .getElementById("appPage")
                .classList.remove("hidden");


            showHome();

        } else {

            document
                .getElementById("loginPage")
                .classList.remove("hidden");

            document
                .getElementById("appPage")
                .classList.add("hidden");
        }

    }
);