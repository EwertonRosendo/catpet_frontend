// assets/js/app.js

// Global app state
const App = {
  currentUser: null,
  currentScreen: "auth-screen",
  currentSection: "home",
  pets: [
    {
      id: 1,
      name: "Luna",
      species: "cat",
      breed: "Persa",
      age: 3,
      gender: "female",
      emoji: "🐱",
      status: "healthy",
      nextAppointment: "15/10",
    },
    {
      id: 2,
      name: "Rex",
      species: "dog",
      breed: "Labrador",
      age: 5,
      gender: "male",
      emoji: "🐕",
      status: "attention",
      medication: "Medicação pendente",
    },
  ],
  quests: [
    {
      id: 1,
      title: "Exercício Diário",
      description: "Faça 30min de atividade com seu pet",
      icon: "fas fa-running",
      reward: "+15 XP • Badge Ativo",
      progress: { current: 3, total: 7 },
      status: "active",
    },
    {
      id: 2,
      title: "Momento Carinho",
      description: "Dedique 15min de carinho ao seu pet",
      icon: "fas fa-heart",
      reward: "+10 XP • Badge Amor",
      progress: { current: 1, total: 1 },
      status: "completed",
    },
  ],
  veterinarians: [
    {
      id: 1,
      name: "Dr. Carlos Silva",
      specialty: "Clínica Geral • Nutrição",
      rating: 4.9,
      status: "online",
      price: 45,
    },
    {
      id: 2,
      name: "Dra. Ana Oliveira",
      specialty: "Comportamento Animal",
      rating: 4.8,
      status: "busy",
      price: 55,
    },
    {
      id: 3,
      name: "Dr. Pedro Santos",
      specialty: "Emergências • Exotic Pets",
      rating: 4.9,
      status: "online",
      price: 65,
    },
  ],
  userStats: {
    xp: 127,
    level: 3,
    completedQuests: 8,
    totalPets: 2,
    consultations: 3,
  },
};

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  console.log("🐱 CatPet App Initialized");
  initializeApp();
  setupEventListeners();
  loadUserData();
});

function initializeApp() {
  // Check if user is logged in
  const savedUser = localStorage.getItem("catpet_user");
  if (savedUser) {
    App.currentUser = JSON.parse(savedUser);
    showScreen("dashboard-screen");
    updateUserInterface();
  } else {
    showScreen("auth-screen");
  }
}

function setupEventListeners() {
  // Navigation listeners
  setupNavigationListeners();

  // Modal listeners
  setupModalListeners();

  // Form listeners
  setupFormListeners();

  // Tab listeners
  setupTabListeners();
}

function setupNavigationListeners() {
  // Bottom navigation
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      const screen = this.dataset.screen;
      navigateTo(screen);
    });
  });
}

function setupModalListeners() {
  // Close modal listeners
  document.querySelectorAll(".close-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const modal = this.closest(".modal");
      closeModal(modal.id);
    });
  });

  // Modal background click to close
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });
}

function setupFormListeners() {
  // Add pet form
  const addPetForm = document.getElementById("add-pet-form");
  if (addPetForm) {
    addPetForm.addEventListener("submit", handleAddPet);
  }
}

function setupTabListeners() {
  // Health tabs
  document.querySelectorAll(".health-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.dataset.tab;
      switchHealthTab(tabName);
    });
  });

  // Quest tabs
  document.querySelectorAll(".quest-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.dataset.tab;
      switchQuestTab(tabName);
    });
  });

  // Connect tabs
  document.querySelectorAll(".connect-tab").forEach((tab) => {
    tab.addEventListener("click", function () {
      const tabName = this.dataset.tab;
      switchConnectTab(tabName);
    });
  });
}

// Screen and navigation functions
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add("active");
    App.currentScreen = screenId;
  }
}

function navigateTo(section) {
  // Update navigation active state
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  document.querySelector(`[data-screen="${section}"]`).classList.add("active");

  // Show corresponding content
  document.querySelectorAll(".content").forEach((content) => {
    content.classList.remove("active");
  });

  const targetContent = document.getElementById(`${section}-content`);
  if (targetContent) {
    targetContent.classList.add("active");
    App.currentSection = section;

    // Load section-specific data
    loadSectionData(section);
  }
}

function loadSectionData(section) {
  switch (section) {
    case "pets":
      loadPetsData();
      break;
    case "health":
      loadHealthData();
      break;
    case "quest":
      loadQuestData();
      break;
    case "connect":
      loadConnectData();
      break;
    default:
      break;
  }
}

// Tab switching functions
function switchHealthTab(tabName) {
  document.querySelectorAll(".health-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  document.querySelectorAll(".health-content").forEach((content) => {
    content.classList.remove("active");
  });

  const targetContent = document.getElementById(`${tabName}-content`);
  if (targetContent) {
    targetContent.classList.add("active");
  }
}

function switchQuestTab(tabName) {
  document.querySelectorAll(".quest-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  document
    .querySelector(`.quest-tab[data-tab="${tabName}"]`)
    .classList.add("active");

  document.querySelectorAll(".quest-content").forEach((content) => {
    content.classList.remove("active");
  });

  const targetContent = document.getElementById(`${tabName}-content`);
  if (targetContent) {
    targetContent.classList.add("active");
  }
}

function switchConnectTab(tabName) {
  document.querySelectorAll(".connect-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  document
    .querySelector(`.connect-tab[data-tab="${tabName}"]`)
    .classList.add("active");

  document.querySelectorAll(".connect-content").forEach((content) => {
    content.classList.remove("active");
  });

  const targetContent = document.getElementById(`${tabName}-content`);
  if (targetContent) {
    targetContent.classList.add("active");
  }
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function showSuccessModal(title, message) {
  document.getElementById("success-title").textContent = title;
  document.getElementById("success-message").textContent = message;
  openModal("success-modal");

  // Auto close after 3 seconds
  setTimeout(() => {
    closeModal("success-modal");
  }, 3000);
}

// Data loading functions
function loadUserData() {
  if (App.currentUser) {
    document.getElementById("user-name").textContent =
      App.currentUser.name || "Usuário";
    updateStats();
  }
}

function updateStats() {
  const stats = App.userStats;

  // Update XP counter
  const xpTotal = document.getElementById("xp-total");
  if (xpTotal) {
    xpTotal.textContent = `${stats.xp} XP`;
  }

  // Update progress bar
  const progressFill = document.querySelector(".progress-fill");
  if (progressFill) {
    const levelProgress = ((stats.xp % 100) / 100) * 100;
    progressFill.style.width = `${levelProgress}%`;
  }

  // Update level
  const level = document.querySelector(".level");
  if (level) {
    level.textContent = `Nível ${stats.level}`;
  }
}

function loadPetsData() {
  console.log("Loading pets data...");
  // This would typically load from an API
  renderPetsList();
}

function loadHealthData() {
  console.log("Loading health data...");
  // Load feeding schedule, records, appointments
  renderFeedingSchedule();
  renderHealthRecords();
  renderAppointments();
}

function loadQuestData() {
  console.log("Loading quest data...");
  renderQuestList();
}

function loadConnectData() {
  console.log("Loading connect data...");
  renderVeterinariansList();
  renderCoursesList();
}

// Render functions
function renderPetsList() {
  // This would typically render the pets list dynamically
  console.log("Rendering pets list with", App.pets.length, "pets");
}

function renderFeedingSchedule() {
  console.log("Rendering feeding schedule");
}

function renderHealthRecords() {
  console.log("Rendering health records");
}

function renderAppointments() {
  console.log("Rendering appointments");
}

function renderQuestList() {
  console.log("Rendering quest list");
}

function renderVeterinariansList() {
  console.log("Rendering veterinarians list");
}

function renderCoursesList() {
  console.log("Rendering courses list");
}

// Form handlers
function handleAddPet(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const petData = {
    id: Date.now(),
    name: formData.get("name"),
    species: formData.get("species"),
    breed: formData.get("breed"),
    age: parseInt(formData.get("age")),
    status: "healthy",
  };

  App.pets.push(petData);
  closeModal("add-pet-modal");
  showSuccessModal(
    "Pet Adicionado!",
    `${petData.name} foi adicionado com sucesso!`
  );

  // Refresh pets list
  loadPetsData();

  // Reset form
  e.target.reset();
}

// Pet management functions
function openAddPetModal() {
  openModal("add-pet-modal");
}

function openPetProfile(petId) {
  console.log("Opening pet profile for:", petId);
  showSuccessModal("Pet Profile", `Abrindo perfil de ${petId}`);
}

function filterPets(category) {
  console.log("Filtering pets by category:", category);
  showSuccessModal("Filtro", `Filtrando pets por: ${category}`);
}

// Health management functions
function addHealthRecord() {
  showSuccessModal(
    "Novo Registro",
    "Funcionalidade de adicionar registro em desenvolvimento"
  );
}

function markFeedingComplete(feedingId) {
  console.log("Marking feeding complete:", feedingId);
  showSuccessModal("Alimentação", "Alimentação marcada como completa!");
}

// Quest functions will be in quest.js
// Connect functions will be in connect.js

// Utility functions
function updateUserInterface() {
  loadUserData();
  updateStats();
  updateDashboardStats();
  updateRecentActivity();
}

function updateDashboardStats() {
  const stats = App.userStats;

  // Update stat cards with animation
  const statCards = document.querySelectorAll(".stat-card h3");
  if (statCards.length > 0) {
    statCards[0].textContent = stats.xp;
    if (statCards[1]) statCards[1].textContent = stats.completedQuests;
    if (statCards[2]) statCards[2].textContent = stats.totalPets;
    if (statCards[3]) statCards[3].textContent = stats.consultations;
  }

  // Add animation to cards
  document.querySelectorAll(".stat-card").forEach((card, index) => {
    card.style.animation = "slideIn 0.5s ease-out";
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

function updateRecentActivity() {
  const activities = [
    {
      icon: "🏆",
      title: "Missão Completa!",
      description: "Exercício diário com Luna - +15 XP",
      time: "2h atrás",
    },
    {
      icon: "💊",
      title: "Medicação Administrada",
      description: "Vermífugo para Rex",
      time: "1 dia atrás",
    },
    {
      icon: "👨‍⚕️",
      title: "Teleconsulta",
      description: "Dr. Carlos Silva - Nutrição",
      time: "3 dias atrás",
    },
  ];

  const activityList = document.querySelector(".activity-list");
  if (activityList) {
    activityList.innerHTML = activities
      .map(
        (activity, index) => `
            <div class="activity-item" style="animation: slideIn 0.5s ease-out; animation-delay: ${
              index * 0.1
            }s">
                <div class="activity-icon">${activity.icon}</div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${activity.time}</span>
                </div>
            </div>
        `
      )
      .join("");
  }
}

function saveUserData() {
  if (App.currentUser) {
    localStorage.setItem("catpet_user", JSON.stringify(App.currentUser));
  }
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

function formatTime(time) {
  return new Date(time).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Animation helpers
function addSuccessAnimation(element) {
  element.classList.add("success-animation");
  setTimeout(() => {
    element.classList.remove("success-animation");
  }, 600);
}

function addPulseAnimation(element) {
  element.classList.add("pulse");
  setTimeout(() => {
    element.classList.remove("pulse");
  }, 2000);
}

// Error handling
function handleError(error, userMessage = "Ocorreu um erro inesperado") {
  console.error("CatPet Error:", error);
  showSuccessModal("Erro", userMessage);
}

// Network functions (for future API integration)
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    handleError(error, "Erro de conexão com o servidor");
    throw error;
  }
}

// Export App object for other modules
window.CatPetApp = App;
