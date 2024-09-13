var form = document.getElementById("resumeForm");
var resumePreview = document.getElementById("resume-preview");
var profilePicInput = document.getElementById("profile-picture-input");
var profilePicPreview = document.getElementById("profile-picture-preview");
var resumeProfilePicture = document.getElementById("resume-profile-picture");
var shareableLinkContainer = document.getElementById("shareable-link-container");
var shareableLinkElement = document.getElementById("shareable-link");
function generateResume(data) {
    if (resumePreview) {
        console.log("Genrating resume with data:", data);
        resumePreview.style.display = "block";
        document.getElementById("resume-name").innerText = "Name: ".concat(data.personalInfo.name);
        document.getElementById("resume-email").innerText = "Email: ".concat(data.personalInfo.email);
        document.getElementById("resume-phone").innerText = "Phone: ".concat(data.personalInfo.phone || "N/A");
        document.getElementById("resume-degree").innerText = "Degree: ".concat(data.education.degree);
        document.getElementById("resume-institution").innerText = "Institution: ".concat(data.education.institution);
        document.getElementById("resume-graduationYear").innerText = "Year of Graduation: ".concat(data.education.graduationYear);
        if (data.workExperience) {
            document.getElementById("resume-jobTitle").innerText = "Job Title: ".concat(data.workExperience.jobTitle || "N/A");
            document.getElementById("resume-company").innerText = "Company: ".concat(data.workExperience.company || "N/A");
            document.getElementById("resume-startDate").innerText = "Start Date: ".concat(data.workExperience.startDate || "N/A");
            document.getElementById("resume-endDate").innerText = "End Date: ".concat(data.workExperience.endDate || "N/A");
        }
        document.getElementById("resume-skills").innerText = "Skills: ".concat(data.skills.join(", "));
        if (data.profilePicture) {
            resumeProfilePicture.src = data.profilePicture;
            resumeProfilePicture.style.display = 'block';
        }
        else {
            resumeProfilePicture.style.display = 'none';
        }
    }
}
if (profilePicInput && profilePicPreview) {
    profilePicInput.addEventListener('change', function () {
        var _a;
        var file = (_a = profilePicInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                profilePicPreview.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                profilePicPreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
        else {
            profilePicPreview.style.display = "none";
        }
    });
}
form.addEventListener('submit', function (event) {
    event.preventDefault();
    var personalInfo = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || undefined
    };
    var education = {
        degree: document.getElementById('degree').value,
        institution: document.getElementById('institution').value,
        graduationYear: Number(document.getElementById('graduationYear').value),
    };
    var workExperience = {
        jobTitle: document.getElementById('jobTitle').value || undefined,
        company: document.getElementById('company').value || undefined,
        startDate: document.getElementById('startDate').value || undefined,
        endDate: document.getElementById('endDate').value || undefined
    };
    var skills = document.getElementById('skills').value.split(",").map(function (skill) { return skill.trim(); });
    var resumeData = {
        personalInfo: personalInfo,
        education: education,
        workExperience: workExperience,
        skills: skills,
        profilePicture: profilePicPreview.src || undefined
    };
    console.log("Form submitted with resumeData", resumeData);
    var resumeDataElement = document.getElementById("resume-preview");
    if (resumeDataElement) {
        var buttonContainer = document.createElement("div");
        buttonContainer.id = "buttonContainer";
        resumeDataElement.appendChild(buttonContainer);
        var downloadButton = document.createElement("button");
        downloadButton.textContent = "Download as PDF";
        downloadButton.addEventListener("click", function () {
            window.print();
        });
        buttonContainer.appendChild(downloadButton);
    }
    var username = document.getElementById("username").value;
    localStorage.setItem(username, JSON.stringify(resumeData));
    generateResume(resumeData);
    var shareableURL = "".concat(window.location.origin, "?username=").concat(encodeURIComponent(username));
    shareableLinkContainer.style.display = "block";
    shareableLinkElement.href = shareableURL;
    shareableLinkElement.textContent = shareableURL;
});
window.addEventListener('DOMContentLoaded', function () {
    var _a, _b, _c, _d;
    var urlParams = new URLSearchParams(window.location.search);
    var username = urlParams.get('username');
    if (username) {
        var savedResumeData = localStorage.getItem(username);
        if (savedResumeData) {
            var resumeData = JSON.parse(savedResumeData);
            // Populate the form fields if you want to show the form with data pre-filled
            document.getElementById('name').value = resumeData.personalInfo.name;
            document.getElementById('email').value = resumeData.personalInfo.email;
            document.getElementById('phone').value = resumeData.personalInfo.phone || '';
            document.getElementById('degree').value = resumeData.education.degree;
            document.getElementById('institution').value = resumeData.education.institution;
            document.getElementById('graduationYear').value = String(resumeData.education.graduationYear);
            document.getElementById('jobTitle').value = ((_a = resumeData.workExperience) === null || _a === void 0 ? void 0 : _a.jobTitle) || '';
            document.getElementById('company').value = ((_b = resumeData.workExperience) === null || _b === void 0 ? void 0 : _b.company) || '';
            document.getElementById('startDate').value = ((_c = resumeData.workExperience) === null || _c === void 0 ? void 0 : _c.startDate) || '';
            document.getElementById('endDate').value = ((_d = resumeData.workExperience) === null || _d === void 0 ? void 0 : _d.endDate) || '';
            document.getElementById('skills').value = resumeData.skills.join(", ");
            // Show the resume preview immediately
            generateResume(resumeData);
            // Hide the form if you want to show only the resume on URL visit
            form.style.display = 'none';
        }
        else {
            console.error('No resume data found for the given username.');
        }
    }
});
// window.addEventListener('DOMContentLoaded', () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const username = urlParams.get('username');
//     if (username) {
//     const savedResumeData = localStorage.getItem(username);
//     if (savedResumeData) {
//     const resumeData = JSON.parse(savedResumeData);
//     (document.getElementById('username') as HTMLInputElement).value =
//     username;
//     (document.getElementById('name') as HTMLInputElement).value =
//     resumeData.name;
//     (document.getElementById('email') as HTMLInputElement).value =
//     resumeData.email;
//     (document.getElementById('phone') as HTMLInputElement).value =
//     resumeData.phone;
//     (document.getElementById('education') as HTMLTextAreaElement).value =
//     resumeData.education;
//     (document.getElementById('experience') as HTMLTextAreaElement).value
//     = resumeData.experience;
//     (document.getElementById('skills') as HTMLTextAreaElement).value =
//     resumeData.skills;
//     }
//     }
//     });
