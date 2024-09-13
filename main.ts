interface PersonalInfo {
    name: string;
    email: string;
    phone?: string;
}

interface Education {
    degree: string;
    institution: string;
    graduationYear: number;
}

interface WorkExperience {
    jobTitle?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
}

interface ResumeData {
    personalInfo: PersonalInfo;
    education: Education;
    workExperience?: WorkExperience;
    skills: string[];
    profilePicture?: string;
}

const form = document.getElementById("resumeForm") as HTMLFormElement;
const resumePreview = document.getElementById("resume-preview") as HTMLDivElement;
const profilePicInput = document.getElementById("profile-picture-input") as HTMLInputElement;
const profilePicPreview = document.getElementById("profile-picture-preview") as HTMLImageElement;
const resumeProfilePicture = document.getElementById("resume-profile-picture") as HTMLImageElement;
const shareableLinkContainer = document.getElementById("shareable-link-container") as HTMLDivElement;
const shareableLinkElement = document.getElementById("shareable-link") as HTMLAnchorElement;

function generateResume(data: ResumeData): void {
    if (resumePreview) {

        console.log("Genrating resume with data:",data);
        
        resumePreview.style.display = "block";
        (document.getElementById("resume-name") as HTMLHeadingElement).innerText = `Name: ${data.personalInfo.name}`;
        (document.getElementById("resume-email") as HTMLParagraphElement).innerText = `Email: ${data.personalInfo.email}`;
        (document.getElementById("resume-phone") as HTMLParagraphElement).innerText = `Phone: ${data.personalInfo.phone || "N/A"}`;
        (document.getElementById("resume-degree") as HTMLParagraphElement).innerText = `Degree: ${data.education.degree}`;
        (document.getElementById("resume-institution") as HTMLParagraphElement).innerText = `Institution: ${data.education.institution}`;
        (document.getElementById("resume-graduationYear") as HTMLParagraphElement).innerText = `Year of Graduation: ${data.education.graduationYear}`;

        if (data.workExperience) {
            (document.getElementById("resume-jobTitle") as HTMLParagraphElement).innerText = `Job Title: ${data.workExperience.jobTitle || "N/A"}`;
            (document.getElementById("resume-company") as HTMLParagraphElement).innerText = `Company: ${data.workExperience.company || "N/A"}`;
            (document.getElementById("resume-startDate") as HTMLParagraphElement).innerText = `Start Date: ${data.workExperience.startDate || "N/A"}`;
            (document.getElementById("resume-endDate") as HTMLParagraphElement).innerText = `End Date: ${data.workExperience.endDate || "N/A"}`;
        }
        (document.getElementById("resume-skills") as HTMLParagraphElement).innerText = `Skills: ${data.skills.join(", ")}`;
        if (data.profilePicture) {
            resumeProfilePicture.src = data.profilePicture;
            resumeProfilePicture.style.display = 'block';
        } else {
            resumeProfilePicture.style.display = 'none';
        }
    }
}

if (profilePicInput && profilePicPreview) {
    profilePicInput.addEventListener('change', () => {
        const file = profilePicInput.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                profilePicPreview.src = e.target?.result as string;
                profilePicPreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        } else {
            profilePicPreview.style.display = "none";
        }
    });
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

const personalInfo: PersonalInfo = {
    name: (document.getElementById('name') as HTMLInputElement).value,
    email: (document.getElementById('email') as HTMLInputElement).value,
    phone: (document.getElementById('phone') as HTMLInputElement).value || undefined
};

const education: Education = {
    degree: (document.getElementById('degree') as HTMLInputElement).value,
    institution: (document.getElementById('institution') as HTMLInputElement).value,
    graduationYear: Number((document.getElementById('graduationYear') as HTMLInputElement).value),
};

const workExperience: WorkExperience = {
    jobTitle: (document.getElementById('jobTitle') as HTMLInputElement).value || undefined,
    company: (document.getElementById('company') as HTMLInputElement).value || undefined,
    startDate: (document.getElementById('startDate') as HTMLInputElement).value || undefined,
    endDate: (document.getElementById('endDate') as HTMLInputElement).value || undefined
};

const skills = (document.getElementById('skills') as HTMLTextAreaElement).value.split(",").map(skill => skill.trim());

const resumeData: ResumeData = {
    personalInfo,
    education,
    workExperience,
    skills,
    profilePicture: profilePicPreview.src || undefined
};

console.log("Form submitted with resumeData", resumeData);

const resumeDataElement = document.getElementById("resume-preview");
if (resumeDataElement) {
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "buttonContainer";
    resumeDataElement.appendChild(buttonContainer);

    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download as PDF";
    downloadButton.addEventListener("click", () => {
        window.print();
    });
    buttonContainer.appendChild(downloadButton);
}

const username = (document.getElementById("username") as HTMLInputElement).value;
localStorage.setItem(username,JSON.stringify(resumeData));

generateResume(resumeData);

const shareableURL = `${window.location.origin}?username=${encodeURIComponent(username)}`;

shareableLinkContainer.style.display ="block";

shareableLinkElement.href = shareableURL;

shareableLinkElement.textContent = shareableURL;

});

window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (username) {
        const savedResumeData = localStorage.getItem(username);

        if (savedResumeData) {
            const resumeData: ResumeData = JSON.parse(savedResumeData);

            // Populate the form fields if you want to show the form with data pre-filled
            (document.getElementById('name') as HTMLInputElement).value = resumeData.personalInfo.name;
            (document.getElementById('email') as HTMLInputElement).value = resumeData.personalInfo.email;
            (document.getElementById('phone') as HTMLInputElement).value = resumeData.personalInfo.phone || '';
            (document.getElementById('degree') as HTMLInputElement).value = resumeData.education.degree;
            (document.getElementById('institution') as HTMLInputElement).value = resumeData.education.institution;
            (document.getElementById('graduationYear') as HTMLInputElement).value = String(resumeData.education.graduationYear);
            (document.getElementById('jobTitle') as HTMLInputElement).value = resumeData.workExperience?.jobTitle || '';
            (document.getElementById('company') as HTMLInputElement).value = resumeData.workExperience?.company || '';
            (document.getElementById('startDate') as HTMLInputElement).value = resumeData.workExperience?.startDate || '';
            (document.getElementById('endDate') as HTMLInputElement).value = resumeData.workExperience?.endDate || '';
            (document.getElementById('skills') as HTMLTextAreaElement).value = resumeData.skills.join(", ");

            // Show the resume preview immediately
            generateResume(resumeData);

            // Hide the form if you want to show only the resume on URL visit
            form.style.display = 'none';
        } else {
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
