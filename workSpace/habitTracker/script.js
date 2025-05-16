const habits = JSON.parse(localStorage.getItem("habits")) || {};

let currentDate = new Date();
function renderCalendar() {
  const calendarEl = document.getElementById("calendar");
  calendarEl.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = currentDate.getDate();

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const weekday = dateObj
      .toLocaleDateString("en-BE", { weekday: "short" })
      .toUpperCase();
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    if (day === today) dayEl.classList.add("selected");
    dayEl.innerHTML = `${weekday}<br /><span>${day}</span>`;
    dayEl.onclick = () => {
      currentDate.setDate(day);
      updateSelectedDay();
      showDayData(currentDate);
    };
    calendarEl.appendChild(dayEl);
  }
}

function setMonth() {
  const selectedMonth = parseInt(document.getElementById("monthSelect").value);
  currentDate.setMonth(selectedMonth);
  currentDate.setDate(1);

  renderCalendar();
  updateSelectedDay();
  showDayData(currentDate);
}

function showDayData(date) {
  const dayKey = date.toISOString().split("T")[0];
  const habitContainer = document.getElementById("habit-container");
  habitContainer.innerHTML = "";

  const dateElement = document.getElementById("date");
  dateElement.textContent = `Selected: ${dayKey}`;

  if (habits[dayKey]) {
    habits[dayKey].forEach((habit, index) => {
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
          <button class="delete-habit" onclick="deleteHabit('${dayKey}', ${index})">Delete</button>
        </div>
      `;
      habitContainer.insertAdjacentHTML("beforeend", habitHTML);
    });
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
