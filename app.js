const state = {
  condition: "",
  course: "",
  strength: "",
  part: "",
};

const recommendations = {
  "軽く疲れた": "たまき店長のおすすめ：肉球おためしコース。軽めに整えて、明日に疲れを残しません。",
  "足が重い": "たまき店長のおすすめ：月あかり足揉みコース。足裏からふくらはぎまで、ゆっくりほぐします。",
  "ふくらはぎパンパン": "たまき店長のおすすめ：みーちゃん極楽コース。ふくらはぎ重点で、しっかり整えます。",
  "たまき助けて": "たまき店長のおすすめ：店主おまかせコース。今日は店主を召喚してよい日です。",
};

const autoCourse = {
  "軽く疲れた": "肉球おためしコース 10分 / 100たま",
  "足が重い": "月あかり足揉みコース 20分 / 300たま",
  "ふくらはぎパンパン": "みーちゃん極楽コース 30分 / 500たま",
  "たまき助けて": "店主おまかせコース 応相談 / 800たま",
};

function selectButton(group, value) {
  state[group] = value;
  document.querySelectorAll(`[data-name="${group}"] button`).forEach((button) => {
    button.classList.toggle("selected", button.dataset.value === value);
  });
}

function setCourseByValue(value) {
  selectButton("course", value);
}

document.querySelectorAll("[data-name] button").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.parentElement.dataset.name;
    const value = button.dataset.value;
    selectButton(group, value);

    if (group === "condition") {
      document.getElementById("recommendation").textContent = recommendations[value] || "";
      if (autoCourse[value]) setCourseByValue(autoCourse[value]);
    }
  });
});

document.getElementById("bookingForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = document.getElementById("message");
  const submitButton = document.getElementById("submitButton");
  const note = document.getElementById("note").value.trim();

  const missing = [];
  if (!state.condition) missing.push("本日の足の状態");
  if (!state.course) missing.push("コース");
  if (!state.strength) missing.push("強さ");
  if (!state.part) missing.push("重点部位");

  if (missing.length) {
    message.textContent = `未選択があります：${missing.join("、")}`;
    return;
  }

  submitButton.disabled = true;
  message.textContent = "たまき店長へ確認中です…";

  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...state, note }),
    });

    if (!response.ok) throw new Error("通知に失敗しました");

    message.textContent = "ご予約を承りました。店主かぷーが手を温めて向かいます。監修者たまきは、夢の中で最終確認中です。";
  } catch (error) {
    console.error(error);
    message.textContent = "予約通知に失敗しました。店主に直接お声がけください。";
  } finally {
    submitButton.disabled = false;
  }
});
