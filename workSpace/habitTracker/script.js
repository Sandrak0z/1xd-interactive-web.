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
      .toLocaleDateString("en-US", { weekday: "short" })
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
function fillMonthDropdown() {
  const monthSelect = document.getElementById("monthSelect");
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  monthNames.forEach((month, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = month;
    if (index === currentDate.getMonth()) option.selected = true;
    monthSelect.appendChild(option);
  });
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
function updateSelectedDay() {
  const dayEls = document.querySelectorAll(".day");
  dayEls.forEach((el) => el.classList.remove("selected"));

  const day = currentDate.getDate();
  const calendar = document.getElementById("calendar");
  const spans = calendar.querySelectorAll("span");
  spans.forEach((span) => {
    if (parseInt(span.textContent) === day) {
      span.parentElement.classList.add("selected");
    }
  });
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
  const dateKey = currentDate.toISOString().split("T")[0];

  if (!habits[dateKey]) {
    habits[dateKey] = [];
  }

  habits[dateKey].push({ name: habitName, time: habitTime, icon: icon });
  localStorage.setItem("habits", JSON.stringify(habits));
  showDayData(currentDate);
  cancelHabit();
}
document.getElementById("prevDay").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  renderCalendar();
  updateSelectedDay();
  showDayData(currentDate);
});

document.getElementById("nextDay").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  renderCalendar();
  updateSelectedDay();
  showDayData(currentDate);
});

function cancelHabit() {
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
  document.getElementById("habit-name").value = "";
  document.getElementById("habit-time").value = "";
  document.getElementById("habit-activity").value = "";
}

function deleteHabit(day, index) {
  habits[day].splice(index, 1);
  localStorage.setItem("habits", JSON.stringify(habits));
  showDayData(day);
}

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

const calendar = document.querySelector(".calendar");
let isDown = false;
let startX;
let scrollLeft;

calendar.addEventListener("mousedown", (e) => {
  isDown = true;
  calendar.classList.add("dragging");
  startX = e.pageX - calendar.offsetLeft;
  scrollLeft = calendar.scrollLeft;
});

calendar.addEventListener("mouseleave", () => {
  isDown = false;
  calendar.classList.remove("dragging");
});

calendar.addEventListener("mouseup", () => {
  isDown = false;
  calendar.classList.remove("dragging");
});

calendar.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - calendar.offsetLeft;
  const walk = (x - startX) * 1.5; 
  calendar.scrollLeft = scrollLeft - walk;
});

window.onload = () => {
  fillMonthDropdown();
  renderCalendar();
  updateSelectedDay();
  showDayData(currentDate);
};

document.querySelector(".add-habit").addEventListener("click", addHabit);
document.getElementById("monthSelect").addEventListener("change", setMonth);

showDayData(currentDate);
