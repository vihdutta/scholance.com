let suggestions = [
    "Content Writer",
    "Customer Service Representative",
    "Data Entry Clerk",
    "Graphic Designer",
    "Internet Marketing Specialist",
    "Online Tutor",
    "Proofreader",
    "Research Assistant",
    "Social Media Manager",
    "Web Developer",
    "Virtual Assistant",
    "Chat Operator",
    "Customer Support Representative",
    "Data Entry Specialist",
    "Freelance Writer",
    "Internet Research Specialist",
    "Medical Transcriptionist",
    "Online Proofreader",
    "Software Tester",
    "Survey Taker",
    "Website Tester",
    "Writing Assistant",
    "App Tester",
    "Chat Moderator",
    "Content Moderator",
    "Data Collector",
    "Email Marketing Specialist",
    "Freelance Editor",
    "Freelance Graphic Designer",
    "Freelance Photographer",
    "Medical Coder",
    "Online Survey Taker",
    "Proofreader and Editor",
    "Research Analyst",
    "3D Artist",
    "3D Modeler",
    "Artificial Intelligence Engineer",
    "Assistant",
    "Audio Engineer",
    "Back-End Developer",
    "Blockchain Developer",
    "Content Creator",
    "Copy Editor",
    "E-Commerce Manager",
    "Electrical Engineer",
    "Embedded Systems Engineer",
    "Entrepreneur",
    "ESL Teacher",
    "Financial Analyst",
    "Hardware Engineer",
    "Human Resources Manager",
    "Industrial Engineer",
    "Insurance Agent",
    "Interior Designer",
    "IT Manager",
    "Java Developer",
    "Lawyer",
    "Mechanical Engineer",
    "Mobile Developer",
    "Network Engineer",
    "Nurse",
    "Operations Manager",
    "Personal Assistant",
    "Physical Therapist",
    "Physician Assistant",
    "Public Relations Specialist",
    "Quality Assurance Engineer",
    "Receptionist",
    "Researcher",
    "Startup Founder",
    "Technical Support Specialist",
    "Test Engineer",
    "Translator",
    "Social Media Consultant",
    "Software Developer",
    "Transcriptionist",
    "User Experience Designer",
    "Website Administrator",
    "Writing Coach",
    "Academic Writer",
    "Administrative Assistant",
    "App Developer",
    "Artist",
    "Audiobook Narrator",
    "Bookkeeper",
    "Business Analyst",
    "Chatbot Developer",
    "Content Manager",
    "Copywriter",
    "Data Analyst",
    "Data Scientist",
    "Digital Marketing Specialist",
    "E-Commerce Specialist",
    "Influencer",
    "IT Support Specialist",
    "Interpreter",
    "Journalist",
    "Lab Technician",
    "Legal Assistant",
    "Marketing Manager",
    "Medical Assistant",
    "Musician",
    "Network Administrator",
    "Photographer",
    "Programmer",
    "Product Manager",
    "Project Manager",
    "Sales Representative",
    "Software Engineer",
    "Speech-Language Pathologist",
    "Teacher",
    "Technical Writer",
    "Writer"
  ];

const searchWrapper = document.querySelector("#search-input");
const inputBox = searchWrapper.querySelector("input");
const suggestionBox = searchWrapper.querySelector("#autocom-box");

inputBox.onkeyup = (e) => {
    let userInput = e.target.value;
    let emptyArray = [];

    if (userInput) {
        emptyArray = suggestions.filter((data)=> {
            return data.toLocaleLowerCase().startsWith(userInput.toLocaleLowerCase());
        }).slice(0, 5);
        emptyArray = emptyArray.map((data) => {
            return data = "<li>" + data + "</li>";
        });
        console.log(emptyArray);
        searchWrapper.classList.add("active");
        showSuggestions(emptyArray);

        let allList = suggestionBox.querySelectorAll("li");
        for (let i = 0; i < allList.length; i++) {
            allList[i].setAttribute("onclick", "select(this)");
        }
    } else {
        searchWrapper.classList.remove("active");
    }
}

function select(element) {
    let selectUserInput = element.textContent;
    inputBox.value = selectUserInput;

    // Trigger an "Enter" key press event
    var event = new Event('keydown');
    event.keyCode = 13; // Enter key code
    event.which = 13; // Enter key code
    event.key = 'Enter'; // Enter key label
    event.code = 'Enter'; // Enter key label
    inputBox.dispatchEvent(event);
}


function showSuggestions(list) {
    let listData;
    if (!list.length) {
        userValue = inputBox.value;
        listData = "<li>" + userValue + "</li>";
    } else {
        listData = list.join("");
    }
    suggestionBox.innerHTML = listData;
}


const tagInput = document.getElementById('tag-input');
const tagsContainer = document.getElementById('tags-container');

tagInput.addEventListener('keydown', (event) => {
  if (event.key === ',' || event.key === 'Enter') {
    event.preventDefault();
    const tagText = tagInput.value.trim();
    if (tagText) {
      createTag(tagText);
      tagInput.value = '';
    }
  }
});

function createTag(tagText) {
    if (tagsContainer.childElementCount < 10) {

  const tag = document.createElement('div');
  tag.classList.add('tag');

  const tagLabel = document.createElement('div');
  tagLabel.classList.add('tag-label');
  tagLabel.textContent = tagText;
  tag.appendChild(tagLabel);

  const tagRemove = document.createElement('div');
  tagRemove.classList.add('tag-remove');
  tagRemove.textContent = 'x';
  tagRemove.addEventListener('click', () => {
    tag.remove();
  });
  tag.appendChild(tagRemove);
  tagsContainer.appendChild(tag);
}
}
