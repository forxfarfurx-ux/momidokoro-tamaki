const state = {
  timeWindow: "",
  course: "300たま・足つぼじっくり 20分",
};

const labels = {
  timeWindow: {
    "空いた時": "空いた時",
    "今夜": "今夜",
    "寝る前": "寝る前",
  },
  course: {
    "100たま・たまきのおためし 10分": "100たま・10分",
    "300たま・足つぼじっくり 20分": "300たま・20分",
    "500たま・ふくらはぎ集中 30分": "500たま・30分",
    "500たま・極上リラックス 30分": "500たま・30分",
  },
};

function updateSummary() {
  const summary = document.getElementById("selectionSummary");
  if (!state.timeWindow) {
    summary.textContent = "時間を選んでください";
    return;
  }
  summary.textContent = `${labels.timeWindow[state.timeWindow]} ／ ${labels.course[state.course]}`;
}

function selectButton(group, button) {
  const value = button.dataset.value;
  state[group] = value;

  document.querySelectorAll(`[data-name="${group}"] button`).forEach((item) => {
    const isSelected = item === button;
    item.classList.toggle("selected", isSelected);
    item.setAttribute("aria-pressed", String(isSelected));
  });

  updateSummary();
  document.getElementById("message").textContent = "";
}

document.querySelectorAll("[data-name] button").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.closest("[data-name]").dataset.name;
    selectButton(group, button);
  });
});

document.getElementById("bookingForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = document.getElementById("message");
  const submitButton = document.getElementById("submitButton");
  const note = document.getElementById("note").value.trim();

  message.className = "message";

  if (!state.timeWindow) {
    message.textContent = "ご希望の時間を選んでください。";
    message.classList.add("error");
    document.querySelector('[data-name="timeWindow"]').scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  submitButton.disabled = true;
  message.textContent = "たまき店長へ取り次いでいます…";

  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...state, note }),
    });

    if (!response.ok) {
      throw new Error(`予約通知に失敗しました (${response.status})`);
    }

    message.textContent = "ご予約を承りました。店主かぷーが手を温めて向かいます。";
    message.classList.add("success");
  } catch (error) {
    console.error(error);
    message.textContent = "通知に失敗しました。店主へ直接お声がけください。";
    message.classList.add("error");
  } finally {
    submitButton.disabled = false;
  }
});

updateSummary();
