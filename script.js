// シーンごとの持ち物リスト
const templates = {
  travel: {
    title: "旅行の持ち物",
    items: ["財布", "スマートフォン", "充電器", "着替え", "パジャマ", "化粧品", "歯ブラシ", "チケット"]
  },
  school: {
    title: "学校の持ち物",
    items: ["学生証", "筆記用具", "ノート", "教科書", "パソコン", "充電器", "財布", "水筒"]
  },
  event: {
    title: "イベントの持ち物",
    items: ["チケット", "スマートフォン", "財布", "身分証明書", "モバイルバッテリー", "ペンライト", "タオル", "飲み物"]
  },
  sleepover: {
    title: "お泊まりの持ち物",
    items: ["着替え", "パジャマ", "歯ブラシ", "スキンケア用品", "充電器", "財布", "タオル", "ヘアブラシ"]
  },
  outing: {
    title: "お出かけの持ち物",
    items: ["財布", "スマートフォン", "ハンカチ", "ティッシュ", "鍵", "飲み物", "モバイルバッテリー"]
  }
};

// HTMLの要素を取得
const sceneCards = document.querySelectorAll(".scene-card");
const listTitle = document.getElementById("list-title");
const itemList = document.getElementById("item-list");
const itemInput = document.getElementById("item-input");
const addForm = document.getElementById("add-form");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const listCount = document.getElementById("list-count");
const completeMessage = document.getElementById("complete-message");

// 保存されたデータを読み込む
let savedData = JSON.parse(localStorage.getItem("packMateData")) || {};

let currentScene = "travel";
let currentItems = [];

// データを保存する関数
function saveData() {
  savedData[currentScene] = currentItems;
  localStorage.setItem("packMateData", JSON.stringify(savedData));
}

// シーンを切り替える関数
function changeScene(scene) {
  currentScene = scene;

  // 選択中のボタンを変更
  sceneCards.forEach(card => {
    card.classList.toggle("active", card.dataset.scene === scene);
  });

  listTitle.textContent = templates[scene].title;

  // 保存済みのリストがあれば読み込む
  if (savedData[scene]) {
    currentItems = savedData[scene];
  } else {
    currentItems = templates[scene].items.map(name => ({
      name: name,
      checked: false
    }));
  }

  saveData();
  renderItems();
}

// 持ち物を画面に表示する関数
function renderItems() {
  itemList.innerHTML = "";

  currentItems.forEach((item, index) => {
    const itemElement = document.createElement("div");
    itemElement.className = "item";

    if (item.checked) {
      itemElement.classList.add("checked");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.checked;

    checkbox.addEventListener("change", () => {
      currentItems[index].checked = checkbox.checked;
      saveData();
      renderItems();
    });

    const name = document.createElement("span");
    name.className = "item-name";
    name.textContent = item.name;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", item.name + "を削除");

    deleteButton.addEventListener("click", () => {
      currentItems.splice(index, 1);
      saveData();
      renderItems();
    });

    itemElement.append(checkbox, name, deleteButton);
    itemList.appendChild(itemElement);
  });

  updateProgress();
}

// 進捗率を更新する関数
function updateProgress() {
  const total = currentItems.length;
  const checked = currentItems.filter(item => item.checked).length;

  const percentage = total === 0
    ? 0
    : Math.round((checked / total) * 100);

  progressText.textContent = percentage + "%";
  progressFill.style.width = percentage + "%";
  listCount.textContent = `${checked} / ${total}`;

  if (total > 0 && checked === total) {
    completeMessage.textContent = "準備完了！気をつけていってらっしゃい";
  } else {
    completeMessage.textContent = "あと少し！準備を進めよう";
  }
}

// 持ち物を追加する
addForm.addEventListener("submit", event => {
  event.preventDefault();

  const newItem = itemInput.value.trim();

  if (newItem === "") {
    return;
  }

  currentItems.push({
    name: newItem,
    checked: false
  });

  itemInput.value = "";

  saveData();
  renderItems();
});

// シーン選択ボタンの動き
sceneCards.forEach(card => {
  card.addEventListener("click", () => {
    changeScene(card.dataset.scene);
  });
});

// 最初の画面を表示
changeScene(currentScene);