function addHabit() {
  const habitContainer = document.querySelector(".habit-container");
  const newHabitTitle = prompt("Enter the habit title:");
  const newHabitTime = prompt("Enter the time for this habit:");

  if (newHabitTitle && newHabitTime) {
    const habitHTML = `
        <div class="habit">
          <div class="habit-icon">📝</div>
          <div class="habit-info">
            <p class="habit-title">${newHabitTitle}</p>
            <p class="habit-subtext">- to do</p>
          </div>
          <div class="habit-divider"></div>
          <div class="habit-time">
            <div class="habit-time-icon"> <img src="img/clock-1.png" alt=""></div>
            <p>${newHabitTime}</p>
          </div>
        </div>
      `;
    habitContainer.insertAdjacentHTML("beforeend", habitHTML);
  } else {
    alert("Please provide both title and time.");
  }
}
