// ---------------- Time section ----------------
function updateDateTime() {
  const now = new Date();

  const timeString = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const weekdays = ["Sun","Mon","Tues","Wed","Thurs","Fri","Sat"];

  const dateString = `${months[now.getMonth()]} ${now.getDate()} ${weekdays[now.getDay()]}`;

  document.getElementById("display-date").textContent = dateString;
  document.getElementById("display-time").textContent = timeString;
}

updateDateTime();
setInterval(updateDateTime, 1000);
// ---------------- Time section end ----------------


// ---------------- Global vars ----------------
let task_contaner = document.querySelector(".task_contaner");
const openModalBtn = document.getElementById("openModal");
const closeModalBtn = document.getElementById("closeModal");
const taskModal = document.getElementById("taskModal");
let form = document.querySelector("form");

// localStorage tasks
let data = JSON.parse(localStorage.getItem("list")) || [];

// for edit mode
let editIndex = null;


// ---------------- Create Task Card ----------------
function createTaskCard(category, status, text) {
  const card = document.createElement("div");
  card.className =
    "rounded-2xl m-2 bg-gradient-to-b from-[#EEF2F3] to-[#adc1d1] shadow-[0px_0px_30px_5px_#cbd5e0]";

  // top section
  const top = document.createElement("div");
  top.className = "flex justify-between px-4 py-2";

  const cat = document.createElement("p");
  if (category === "school") {
    cat.className =
      "py-1 px-3 rounded-2xl bg-gradient-to-bl from-red-800 to-red-400 text-white capitalize";
  } else if (category === "work") {
    cat.className =
      "py-1 px-3 rounded-2xl bg-gradient-to-bl from-cyan-500 to-cyan-900 text-white capitalize";
  } else if (category === "health") {
    cat.className =
      "py-1 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-900 text-white capitalize";
  } else if (category === "grocery") {
    cat.className =
      "py-1 px-3 rounded-2xl bg-gradient-to-tr from-fuchsia-900 to-fuchsia-500 text-white capitalize";
  }
  cat.textContent = category;

  const stat = document.createElement("span");
  stat.className = "py-1 px-2 rounded-2xl bg-[#28c78d] text-white cursor-pointer";
  stat.textContent = status;
    // ---------------- Toggle Status ----------------
stat.addEventListener("click", () => {
  // find the task in data
  const idx = data.findIndex(
    (item) =>
      item.task === text && item.tage === category && item.status === status
  );

  if (idx > -1) {
    // toggle status
    if (data[idx].status === "Pending") {
      data[idx].status = "Completed";
    } else {
      data[idx].status = "Pending";
    }

    // save & refresh
    localStorage.setItem("list", JSON.stringify(data));
    display_data(data);
  }
});

  top.appendChild(cat);
  top.appendChild(stat);

  // bottom section
  const bottom = document.createElement("div");
  bottom.className = "p-2 flex justify-between gap-3 items-center";

  const desc = document.createElement("p");
  desc.className =
    "max-w-[250px] min-w-[249px] break-words px-3 py-2 rounded-2xl bg-[#F9F9F9] first-letter:uppercase";
       if (status === "Completed") {
  desc.classList.add("line-through", "text-gray-500");
}
  desc.textContent = text;

  const btnGroup = document.createElement("div");
  btnGroup.className = "flex gap-2";

  const editBtn = document.createElement("button");
  editBtn.className =
    "border rounded-full px-3.5 py-2 border-green-800 text-green-700 cursor-pointer";
  editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';

  const deleteBtn = document.createElement("button");
  deleteBtn.className =
    "border border-red-700 text-red-700 rounded-full px-3.5 py-2 cursor-pointer";
  deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(deleteBtn);

  bottom.appendChild(desc);
  bottom.appendChild(btnGroup);

  // assemble card
  card.appendChild(top);
  card.appendChild(bottom);
  task_contaner.prepend(card);

  // ---------------- Delete Button ----------------
  deleteBtn.addEventListener("click", () => {
    const idx = data.findIndex(
      (item) =>
        item.task === text && item.tage === category && item.status === status
    );

    if (idx > -1) {
      data.splice(idx, 1);
      localStorage.setItem("list", JSON.stringify(data));
    }

    card.remove();
  });

  // ---------------- Edit Button ----------------
  editBtn.addEventListener("click", () => {
    taskModal.classList.remove("hidden");

    const taskInput = document.querySelector("form input");
    const categorySelect = document.querySelector("form select");
    const submitBtn = document.querySelector("form button[type='submit']");

    // pre-fill fields
    taskInput.value = text;
    categorySelect.value = category;

    // switch to edit mode
    editIndex = data.findIndex(
      (item) =>
        item.task === text && item.tage === category && item.status === status
    );

    // change button text
    submitBtn.textContent = "Update";
  });

  return card;
}


// ---------------- Display tasks ----------------
function display_data(content) {
  task_contaner.innerHTML = "";
  content.forEach((e) => {
    createTaskCard(e.tage, e.status, e.task);
  });
}
display_data(data);


// ---------------- Modal open/close ----------------
openModalBtn.addEventListener("click", () => {
  taskModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
  taskModal.classList.add("hidden");
  resetForm();
});

taskModal.addEventListener("click", (e) => {
  if (e.target === taskModal) {
    taskModal.classList.add("hidden");
    resetForm();
  }
});


// ---------------- Form submit (Add/Edit) ----------------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  let task = document.querySelector("input").value;
  let tage = document.querySelector("select").value;

  if (task !== "" && tage !== "") {
    if (editIndex === null) {
      // ADD
      let status = "Pending";
      data.push({ task, tage, status });
    } else {
      // EDIT
      data[editIndex].task = task;
      data[editIndex].tage = tage;
      editIndex = null;
    }

    localStorage.setItem("list", JSON.stringify(data));

    resetForm();
    taskModal.classList.add("hidden");
    display_data(data);
  }
});

function resetForm() {
  document.querySelector("input").value = "";
  document.querySelector("select").value = "";
  document.querySelector("form button[type='submit']").textContent = "Add";
  editIndex = null;
}


// ---------------- Filter buttons ----------------
let filter_btn = document.querySelector(".filter");
filter_btn.addEventListener("click", (e) => {
  let btn = e.target.closest("button");
  if (!btn) return;

  if (btn.value) {
    let data2 = data.filter((item) => item.tage === btn.value);
    display_data(data2);
  }
});




// //  uncomment if you want to add fome demo task 
// // ---------------- Demo tasks ----------------
// if (data.length === 0) {
//   data = [
//     { task: "Math homework", tage: "school", status: "Pending" },
//     { task: "Science project", tage: "school", status: "Completed" },

//     { task: "Finish client report", tage: "work", status: "Pending" },
//     { task: "Team meeting", tage: "work", status: "Completed" },

//     { task: "Buy milk", tage: "grocery", status: "Pending" },
//     { task: "Get vegetables", tage: "grocery", status: "Completed" },

//     { task: "Morning workout", tage: "health", status: "Pending" },
//     { task: "Doctor appointment", tage: "health", status: "Completed" },
//   ];

//   localStorage.setItem("list", JSON.stringify(data));
// }

// // show them in UI
// display_data(data);
