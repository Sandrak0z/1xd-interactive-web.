const habits = JSON.parse(localStorage.getItem("habits")) || {};

function showDayData(day) {
  const habitContainer = document.getElementById("habit-container");
  habitContainer.innerHTML = "";
  const dateElement = document.getElementById("date");
  dateElement.textContent = `Today is day ${day}`;
  if (habits[day]) {
    habits[day].forEach((habit, index) => {
      const habitHTML = `
        <div class="habit" id="habit-${index}">
          <div class="habit-icon">${habit.icon}</div>
          <div class="habit-info">
            <p class="habit-title">${habit.name}</p>
            <p class="habit-subtext">${habit.time} minutes</p>
          </div>
          <div class="habit-divider"></div>
          <div class="habit-time">
            <div class="habit-time-icon"> <img src="img/clock-1.png" alt=""></div>
            <p>${habit.time} min</p>
          </div>
          <button class="delete-habit" onclick="deleteHabit(${day}, ${index})">Delete</button>
        </div>
      `;
      habitContainer.insertAdjacentHTML("beforeend", habitHTML);
    });
  }
  const days = document.querySelectorAll(".day span");
  let currentDayElement;
  days.forEach((span) => {
    if (span.textContent.trim() === day) {
      currentDayElement = span.parentElement;
    }
  });
  if (currentDayElement) {
    currentDayElement.classList.add("selected");
  }
}
function addHabit() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
}

function saveHabit() {
  const habitName = document.getElementById("habit-name").value;
  const habitTime = document.getElementById("habit-time").value;
  const habitActivity = document.getElementById("habit-activity").value;
  const icon = getIcon(habitActivity);
  const day = document.querySelector(".day.selected span").textContent.trim();

  if (!habits[day]) {
    habits[day] = [];
  }
  habits[day].push({ name: habitName, time: habitTime, icon: icon });
  localStorage.setItem("habits", JSON.stringify(habits));
  showDayData(day);
  cancelHabit();
}

// function to cancel adding new habit
function cancelHabit() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  document.getElementById("habit-name").value = "";
  document.getElementById("habit-time").value = "";
  document.getElementById("habit-activity").value = "";
}

// function to delete habit
function deleteHabit(day, index) {
  habits[day].splice(index, 1);
  localStorage.setItem("habits", JSON.stringify(habits));
  showDayData(day);
}

// function to get icon based on activity
function getIcon(activity) {
  switch (activity) {
    case "walking":
      return "🚶‍♂️";
    case "reading":
      return "📖";
    case "sleeping":
      return "🛏";
    default:
      return "";
  }
}

// add event listener to add habit button
document.querySelector(".add-habit").addEventListener("click", addHabit);

// show day data for the selected day
showDayData(17);
