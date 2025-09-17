// time section 
        function updateDateTime() {
            const now = new Date();

            // Time string
            const timeString = now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            });

            // Arrays for months and weekdays
            const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
            const weekdays = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];

            // Build custom date string: "Sep 10 Monday"
            const dateString = `${months[now.getMonth()]} ${now.getDate()} ${weekdays[now.getDay()]}`;

            document.getElementById("display-date").textContent = dateString;
            document.getElementById("display-time").textContent = timeString;
        }

        updateDateTime();
        setInterval(updateDateTime, 1000);
        // time section end 

 let task_contaner = document.querySelector(".task_contaner");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const taskModal = document.getElementById("taskModal");

function createTaskCard(category, status, text) {
  // main card
  const card = document.createElement("div");
  card.className =
    "rounded-2xl m-2 bg-gradient-to-b from-[#EEF2F3] to-[#adc1d1] shadow-[0px_0px_30px_5px_#cbd5e0]";

  // top section
  const top = document.createElement("div");
  top.className = "flex justify-between px-4 py-2";

  const cat = document.createElement("p");
  cat.className =
    "py-1 px-3 rounded-2xl bg-gradient-to-bl from-red-800 to-red-400 text-white capitalize";
  cat.textContent = category;

  const stat = document.createElement("span");
  stat.className = "py-1 px-2 rounded-2xl bg-[#28c78d] text-white";
  stat.textContent = status;

  top.appendChild(cat);
  top.appendChild(stat);

  // bottom section
  const bottom = document.createElement("div");
  bottom.className = "p-2 flex justify-between gap-3 items-center";

  const desc = document.createElement("p");
  desc.className = "max-w-[250px] min-w-[249px] break-words px-3 py-2 rounded-2xl bg-[#F9F9F9] first-letter:uppercase";
  desc.textContent = text;

  const btnGroup = document.createElement("div");
  btnGroup.className = "flex gap-2";

  const editBtn = document.createElement("button");
  editBtn.className =
    "border rounded-full px-3.5 py-2 border-green-800 text-green-700";
  editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';

  const deleteBtn = document.createElement("button");
  deleteBtn.className =
    "border border-red-700 text-red-700 rounded-full px-3.5 py-2";
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(deleteBtn);

  bottom.appendChild(desc);
  bottom.appendChild(btnGroup);

  // assemble card
  card.appendChild(top);
  card.appendChild(bottom);
  task_contaner.appendChild(card);
  return card;
}


// Open modal
openModalBtn.addEventListener("click", () => {
  taskModal.classList.remove("hidden");
});

// Close modal (button)
closeModalBtn.addEventListener("click", () => {
  taskModal.classList.add("hidden");
});

// Close modal when clicking outside the modal box
taskModal.addEventListener("click", (e) => {
  if (e.target === taskModal) {
    taskModal.classList.add("hidden");
  }
});

//  get value from form 
let form = document.querySelector("form");
let data = JSON.parse(localStorage.getItem("list")) || [];
// show localstorage data at screen on first load
 function display_data() 
  {
    task_contaner.innerHTML ="";
    data.forEach(e => {
  createTaskCard(e.tage, "Pending", e.task);
});}
display_data();

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let task = document.querySelector("input").value;
  let tage = document.querySelector("select").value;

  if (task !== "" && tage !== "") {
    data.push({ task, tage });
    console.log("After push:", data);

    // Save back to localStorage (make sure key has no spaces!)
    localStorage.setItem("list", JSON.stringify(data));

    // Clear form
    document.querySelector("input").value = "";
    document.querySelector("select").value = "";
  display_data();
  }
});

