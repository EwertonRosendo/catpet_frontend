// assets/js/quest.js

const Quest = {
  currentTab: "ativas",
  completedToday: 0,

  // Quest templates
  questTemplates: [
    {
      id: "daily-exercise",
      title: "Exercício Diário",
      description: "Faça 30min de atividade com seu pet",
      icon: "fas fa-running",
      reward: { xp: 15, badge: "Ativo" },
      type: "daily",
      duration: 7, // 7 days
      category: "exercise",
    },
    {
      id: "feeding-routine",
      title: "Alimentação no Horário",
      description: "Alimente seu pet nos horários corretos",
      icon: "fas fa-utensils",
      reward: { xp: 10, badge: "Disciplinado" },
      type: "daily",
      duration: 1,
      category: "feeding",
    },
    {
      id: "love-time",
      title: "Momento Carinho",
      description: "Dedique 15min de carinho ao seu pet",
      icon: "fas fa-heart",
      reward: { xp: 10, badge: "Amor" },
      type: "daily",
      duration: 1,
      category: "bonding",
    },
    {
      id: "training-session",
      title: "Sessão de Treinamento",
      description: "Ensine um novo comando ou truque",
      icon: "fas fa-graduation-cap",
      reward: { xp: 25, badge: "Treinador" },
      type: "weekly",
      duration: 3,
      category: "training",
    },
    {
      id: "health-check",
      title: "Check-up de Saúde",
      description: "Verifique peso, dentes e pelos",
      icon: "fas fa-stethoscope",
      reward: { xp: 20, badge: "Cuidadoso" },
      type: "weekly",
      duration: 1,
      category: "health",
    },
  ],

  // Community challenges
  communityQuests: [
    {
      id: "video-trick",
      title: "Vídeo: Trick Training",
      description: "Grave um vídeo do seu pet fazendo um truque",
      icon: "fas fa-camera",
      reward: { xp: 30, ranking: true },
      type: "community",
      participants: 1247,
    },
    {
      id: "photo-contest",
      title: "Concurso de Fotos",
      description: "Compartilhe a foto mais fofa do seu pet",
      icon: "fas fa-camera-retro",
      reward: { xp: 20, prize: "Desconto Pet Shop" },
      type: "community",
      participants: 892,
    },
  ],
};

// Initialize quest system
function initializeQuests() {
  generateDailyQuests();
  loadQuestProgress();
  renderQuestSection();
}

function generateDailyQuests() {
  const today = new Date().toDateString();
  const savedDate = localStorage.getItem("catpet_quest_date");

  // Generate new daily quests if it's a new day
  if (savedDate !== today) {
    const dailyQuests = Quest.questTemplates
      .filter((template) => template.type === "daily")
      .map((template) => createQuestFromTemplate(template));

    App.quests = [
      ...dailyQuests,
      ...getWeeklyQuests(),
      ...getCommunityQuests(),
    ];
    localStorage.setItem("catpet_quest_date", today);
    saveQuestData();
  }
}

function createQuestFromTemplate(template) {
  return {
    id: template.id + "_" + Date.now(),
    templateId: template.id,
    title: template.title,
    description: template.description,
    icon: template.icon,
    reward: template.reward,
    type: template.type,
    category: template.category,
    progress: {
      current: 0,
      total: template.duration,
    },
    status: "active",
    createdAt: new Date().toISOString(),
    completedAt: null,
  };
}

function getWeeklyQuests() {
  return Quest.questTemplates
    .filter((template) => template.type === "weekly")
    .map((template) => createQuestFromTemplate(template));
}

function getCommunityQuests() {
  return Quest.communityQuests.map((quest) => ({
    ...quest,
    id: quest.id + "_community",
    progress: { current: 0, total: 1 },
    status: "active",
    createdAt: new Date().toISOString(),
  }));
}

// Enhanced quest rendering
function renderQuestSection() {
  renderActiveQuests();
  renderCompletedQuests();
  renderCommunityQuests();
  updateQuestProgress();
}

function renderActiveQuests() {
  const container = document.getElementById("ativas-content");
  if (!container) return;

  const activeQuests = App.quests.filter((quest) => quest.status === "active");

  if (activeQuests.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏆</div>
                <h3>Nenhuma missão ativa</h3>
                <p>Novas missões serão geradas em breve!</p>
            </div>
        `;
    return;
  }

  const questList =
    container.querySelector(".quest-list") || createQuestList(container);
  questList.innerHTML = activeQuests
    .map((quest) => createQuestItem(quest))
    .join("");

  // Add animations
  setTimeout(() => {
    questList.querySelectorAll(".quest-item").forEach((item, index) => {
      item.style.animation = "slideIn 0.5s ease-out";
      item.style.animationDelay = `${index * 0.1}s`;
    });
  }, 100);
}

function renderCompletedQuests() {
  const container = document.getElementById("completas-content");
  if (!container) return;

  const completedQuests = App.quests.filter(
    (quest) => quest.status === "completed"
  );

  if (completedQuests.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✅</div>
                <h3>Nenhuma missão completa</h3>
                <p>Complete algumas missões para vê-las aqui!</p>
            </div>
        `;
    return;
  }

  const questList =
    container.querySelector(".quest-list") || createQuestList(container);
  questList.innerHTML = completedQuests
    .map((quest) => createCompletedQuestItem(quest))
    .join("");
}

function renderCommunityQuests() {
  const container = document.getElementById("comunidade-content");
  if (!container) return;

  const communityQuests = App.quests.filter(
    (quest) => quest.type === "community"
  );

  const questList =
    container.querySelector(".quest-list") || createQuestList(container);
  questList.innerHTML = communityQuests
    .map((quest) => createCommunityQuestItem(quest))
    .join("");
}

function createQuestList(container) {
  const questList = document.createElement("div");
  questList.className = "quest-list";
  container.appendChild(questList);
  return questList;
}

function createQuestItem(quest) {
  const progressText =
    quest.progress.total > 1
      ? `${quest.progress.current}/${quest.progress.total}`
      : quest.progress.current === quest.progress.total
      ? "✓"
      : "○";

  const isCompleted = quest.progress.current >= quest.progress.total;
  const completedClass = isCompleted ? "completed" : "";

  return `
        <div class="quest-item ${completedClass}" onclick="handleQuestClick('${
    quest.id
  }')">
            <div class="quest-icon">
                <i class="${quest.icon}"></i>
            </div>
            <div class="quest-info">
                <h4>${quest.title}</h4>
                <p>${quest.description}</p>
                <div class="quest-reward">+${quest.reward.xp} XP • Badge ${
    quest.reward.badge
  }</div>
                ${
                  quest.type === "daily"
                    ? '<div class="quest-timer">⏰ Expira hoje</div>'
                    : ""
                }
            </div>
            <div class="quest-progress ${isCompleted ? "completed" : ""}">
                <span>${progressText}</span>
            </div>
        </div>
    `;
}

function createCompletedQuestItem(quest) {
  const completedDate = new Date(quest.completedAt).toLocaleDateString("pt-BR");

  return `
        <div class="quest-item completed">
            <div class="quest-icon completed">
                <i class="fas fa-check"></i>
            </div>
            <div class="quest-info">
                <h4>${quest.title}</h4>
                <p>Completa em ${completedDate}</p>
                <div class="quest-reward earned">+${quest.reward.xp} XP • Badge ${quest.reward.badge}</div>
            </div>
            <div class="quest-progress completed">
                <i class="fas fa-trophy"></i>
            </div>
        </div>
    `;
}

function createCommunityQuestItem(quest) {
  return `
        <div class="quest-item community" onclick="handleCommunityQuest('${
          quest.id
        }')">
            <div class="quest-icon community">
                <i class="${quest.icon}"></i>
            </div>
            <div class="quest-info">
                <h4>${quest.title}</h4>
                <p>${quest.description}</p>
                <div class="quest-reward">+${quest.reward.xp} XP • ${
    quest.reward.ranking ? "Ranking Global" : quest.reward.prize
  }</div>
                <div class="quest-participants">${
                  quest.participants
                } participantes</div>
            </div>
            <div class="quest-progress">
                <i class="fas fa-users"></i>
            </div>
        </div>
    `;
}

// Quest interaction
function handleQuestClick(questId) {
  const quest = App.quests.find((q) => q.id === questId);
  if (!quest || quest.status === "completed") return;

  if (quest.progress.current < quest.progress.total) {
    completeQuestStep(quest);
  }
}

function completeQuestStep(quest) {
  quest.progress.current++;

  // Check if quest is complete
  if (quest.progress.current >= quest.progress.total) {
    completeQuest(quest);
  } else {
    // Update progress
    updateQuestItemProgress(quest);
    saveQuestData();
  }
}

function completeQuest(quest) {
  quest.status = "completed";
  quest.completedAt = new Date().toISOString();

  // Award XP
  App.userStats.xp += quest.reward.xp;
  App.userStats.completedQuests++;
  Quest.completedToday++;

  // Update UI
  updateStats();
  renderQuestSection();

  // Show completion animation and reward
  showQuestCompletionReward(quest);

  // Save progress
  saveQuestData();

  // Check for achievements
  checkQuestAchievements();
}

function updateQuestItemProgress(quest) {
  const questElement = document.querySelector(
    `[onclick="handleQuestClick('${quest.id}')"]`
  );
  if (!questElement) return;

  const progressElement = questElement.querySelector(".quest-progress span");
  if (progressElement) {
    const progressText =
      quest.progress.total > 1
        ? `${quest.progress.current}/${quest.progress.total}`
        : "○";
    progressElement.textContent = progressText;

    // Add progress animation
    questElement.classList.add("progress-updated");
    setTimeout(() => {
      questElement.classList.remove("progress-updated");
    }, 1000);
  }
}

function showQuestCompletionReward(quest) {
  const questElement = document.querySelector(
    `[onclick="handleQuestClick('${quest.id}')"]`
  );
  if (questElement) {
    questElement.classList.add("quest-completing");

    // Add completion particle effect
    createCompletionParticles(questElement);

    setTimeout(() => {
      questElement.classList.remove("quest-completing");
      questElement.classList.add("quest-completed");
    }, 800);
  }

  // Show reward modal
  setTimeout(() => {
    showQuestRewardModal(quest);
  }, 1000);
}

function createCompletionParticles(element) {
  const rect = element.getBoundingClientRect();

  for (let i = 0; i < 12; i++) {
    const particle = document.createElement("div");
    particle.className = "completion-particle";
    particle.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            width: 8px;
            height: 8px;
            background: #10b981;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particleExplode 1s ease-out forwards;
            animation-delay: ${i * 0.05}s;
        `;

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1000);
  }
}

function showQuestRewardModal(quest) {
  const modalHTML = `
        <div class="modal active" id="quest-reward-modal">
            <div class="modal-content quest-reward">
                <div class="reward-animation">
                    <div class="reward-icon">🏆</div>
                    <h2>Missão Completa!</h2>
                    <h3>${quest.title}</h3>
                </div>
                <div class="reward-details">
                    <div class="reward-item">
                        <i class="fas fa-trophy"></i>
                        <span>+${quest.reward.xp} XP</span>
                    </div>
                    <div class="reward-item">
                        <i class="fas fa-medal"></i>
                        <span>Badge "${quest.reward.badge}"</span>
                    </div>
                </div>
                <button class="btn-primary" onclick="closeQuestRewardModal()">
                    <i class="fas fa-check"></i>
                    Continuar
                </button>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Auto close after 4 seconds
  setTimeout(closeQuestRewardModal, 4000);
}

function closeQuestRewardModal() {
  const modal = document.getElementById("quest-reward-modal");
  if (modal) {
    modal.remove();
  }
}

// Community quests
function handleCommunityQuest(questId) {
  const quest = App.quests.find((q) => q.id === questId);
  if (!quest) return;

  if (quest.templateId === "video-trick") {
    startVideoQuest(quest);
  } else if (quest.templateId === "photo-contest") {
    startPhotoQuest(quest);
  }
}

function startVideoQuest(quest) {
  showSuccessModal(
    "📹 Gravação de Vídeo",
    "Para completar esta missão, grave um vídeo do seu pet fazendo um truque e compartilhe nas suas redes sociais com #CatPetChallenge!"
  );

  // Simulate quest completion for demo
  setTimeout(() => {
    completeQuest(quest);
  }, 2000);
}

function startPhotoQuest(quest) {
  showSuccessModal(
    "📸 Concurso de Fotos",
    "Tire a foto mais fofa do seu pet e compartilhe com #CatPetContest para participar!"
  );
}

// Progress and achievements
function updateQuestProgress() {
  const progressBar = document.querySelector(".progress-fill");
  if (progressBar) {
    const levelProgress = ((App.userStats.xp % 100) / 100) * 100;
    progressBar.style.width = `${levelProgress}%`;
  }

  const xpCounter = document.getElementById("xp-total");
  if (xpCounter) {
    xpCounter.textContent = `${App.userStats.xp} XP`;
  }
}

function checkQuestAchievements() {
  const achievements = [];

  if (Quest.completedToday >= 3) {
    achievements.push({
      name: "Super Dedicado",
      description: "3 missões em um dia!",
    });
  }

  if (App.userStats.completedQuests >= 10) {
    achievements.push({
      name: "Mestre das Missões",
      description: "10 missões completas!",
    });
  }

  if (App.userStats.completedQuests >= 50) {
    achievements.push({
      name: "Lenda dos Pets",
      description: "50 missões completas!",
    });
  }

  achievements.forEach((achievement) => {
    showAchievementUnlocked(achievement);
  });
}

function showAchievementUnlocked(achievement) {
  const achievementHTML = `
        <div class="achievement-notification">
            <div class="achievement-icon">🏅</div>
            <div class="achievement-info">
                <h4>Conquista Desbloqueada!</h4>
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
            </div>
        </div>
    `;

  const notification = document.createElement("div");
  notification.innerHTML = achievementHTML;
  notification.className = "achievement-toast";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Data persistence
function saveQuestData() {
  localStorage.setItem("catpet_quests", JSON.stringify(App.quests));
  localStorage.setItem("catpet_stats", JSON.stringify(App.userStats));
}

function loadQuestProgress() {
  const savedQuests = localStorage.getItem("catpet_quests");
  const savedStats = localStorage.getItem("catpet_stats");

  if (savedQuests) {
    App.quests = JSON.parse(savedQuests);
  }

  if (savedStats) {
    App.userStats = { ...App.userStats, ...JSON.parse(savedStats) };
  }
}

// Tab switching for quests
function switchQuestTab(tabName) {
  Quest.currentTab = tabName;

  // Update tab buttons
  document.querySelectorAll(".quest-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document
    .querySelector(`.quest-tab[data-tab="${tabName}"]`)
    .classList.add("active");

  // Update content
  document.querySelectorAll(".quest-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${tabName}-content`).classList.add("active");

  // Load tab-specific data
  if (tabName === "ativas") renderActiveQuests();
  else if (tabName === "completas") renderCompletedQuests();
  else if (tabName === "comunidade") renderCommunityQuests();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeQuests();
});
