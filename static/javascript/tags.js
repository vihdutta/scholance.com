let suggestions = []
fetch("../static/json/suggestions_list.json")
.then(response => {
   return response.json();
})
.then(data => suggestions = data);

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

const projectButton = document.getElementById("pbt")
const projectTags = document.getElementsByClassName("tag-label")

projectButton.addEventListener("click", () => {
    var tags = []; // Array to store the text values

    // Loop through the object collection and retrieve the text content of each object
    for (var i = 0; i < projectTags.length; i++) {
        tags.push(projectTags[i].textContent); // Add the text content to the array
    }
    
    var tags = tags.join(', '); // Join the array elements with commas
    tagInput.textContent = tags;    
    console.log("done");
})

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
