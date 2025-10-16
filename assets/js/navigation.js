// assets/js/navigation.js

const Navigation = {
  history: [],
  currentPath: "/",

  // Navigation routes
  routes: {
    "/": "home",
    "/pets": "pets",
    "/health": "health",
    "/quest": "quest",
    "/connect": "connect",
    "/profile": "profile",
  },
};

// Enhanced navigation function
function navigateTo(section, addToHistory = true) {
  if (App.currentSection === section) return;

  if (addToHistory) {
    Navigation.history.push(App.currentSection);
  }

  updateNavigationState(section);
  showSectionContent(section);
  App.currentSection = section;
  loadSectionData(section);
  updateURL(section);
}

function updateNavigationState(section) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");

    if (item.dataset.screen === section) {
      item.classList.add("active");

      const icon = item.querySelector("i");
      if (icon) {
        icon.style.animation = "navBounce 0.6s ease-out";
        setTimeout(() => {
          icon.style.animation = "";
        }, 600);
      }
    }
  });
}

function showSectionContent(section) {
  document.querySelectorAll(".content").forEach((content) => {
    if (content.classList.contains("active")) {
      content.style.animation = "fadeOut 0.2s ease-out";
      setTimeout(() => {
        content.classList.remove("active");
        content.style.animation = "";
      }, 200);
    }
  });

  setTimeout(() => {
    const targetContent = document.getElementById(`${section}-content`);
    if (targetContent) {
      targetContent.classList.add("active");
      targetContent.style.animation = "fadeIn 0.3s ease-out";
      setTimeout(() => {
        targetContent.style.animation = "";
      }, 300);
    }
  }, 200);
}

function updateURL(section) {
  const path =
    Object.keys(Navigation.routes).find(
      (key) => Navigation.routes[key] === section
    ) || "/";

  Navigation.currentPath = path;
  // history.pushState({ section }, '', path); // se quiser habilitar futuramente
}

function goBack() {
  if (Navigation.history.length > 0) {
    const previousSection = Navigation.history.pop();
    navigateTo(previousSection, false);
  }
}

// Breadcrumb navigation
function createBreadcrumb(sections) {
  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "breadcrumb";
  breadcrumb.innerHTML = sections
    .map((section, index) => {
      const isLast = index === sections.length - 1;
      const arrow = isLast ? "" : '<i class="fas fa-chevron-right"></i>';
      const classes = isLast ? "breadcrumb-current" : "breadcrumb-link";

      return `
            <span class="${classes}" ${
        !isLast ? `onclick="navigateTo('${section.id}')"` : ""
      }>
                ${section.name}
            </span>
            ${arrow}
        `;
    })
    .join("");

  return breadcrumb;
}

// Quick actions navigation
function quickNavigate(action) {
  switch (action) {
    case "add-pet":
      navigateTo("pets");
      setTimeout(() => openAddPetModal(), 300);
      break;
    case "schedule-consultation":
      navigateTo("connect");
      break;
    case "log-health":
      navigateTo("health");
      setTimeout(() => addHealthRecord(), 300);
      break;
    case "view-quests":
      navigateTo("quest");
      break;
    default:
      console.warn("Unknown quick action:", action);
  }
}

// Tab navigation within sections
class TabNavigator {
  constructor(containerSelector, tabSelector, contentSelector) {
    this.container = document.querySelector(containerSelector);
    this.tabSelector = tabSelector;
    this.contentSelector = contentSelector;
    this.currentTab = null;

    if (this.container) this.init();
  }

  init() {
    const tabs = this.container.querySelectorAll(this.tabSelector);
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        this.switchTab(tab.dataset.tab);
      });
    });

    const activeTab = this.container.querySelector(
      `${this.tabSelector}.active`
    );
    if (activeTab) this.currentTab = activeTab.dataset.tab;
  }

  switchTab(tabName) {
    if (this.currentTab === tabName) return;

    this.container.querySelectorAll(this.tabSelector).forEach((tab) => {
      tab.classList.remove("active");
      if (tab.dataset.tab === tabName) {
        tab.classList.add("active");
      }
    });

    this.container.querySelectorAll(this.contentSelector).forEach((content) => {
      content.classList.remove("active");
    });

    const targetContent = this.container.querySelector(
      `${this.contentSelector}[id="${tabName}-content"], ${this.contentSelector}[id*="${tabName}"]`
    );
    if (targetContent) targetContent.classList.add("active");

    this.currentTab = tabName;
    this.onTabChange(tabName);
  }

  onTabChange(tabName) {
    console.log("Tab changed to:", tabName);
  }
}

// Initialize tab navigators
document.addEventListener("DOMContentLoaded", function () {
  new TabNavigator("#health-content", ".health-tab", ".health-content");
  new TabNavigator("#quest-content", ".quest-tab", ".quest-content");
  new TabNavigator("#connect-content", ".connect-tab", ".connect-content");
  new SwipeNavigator();
});

// Section data loading
async function loadSectionData(section) {
  showSectionLoading(section, true);

  try {
    switch (section) {
      case "home":
        await loadHomeData();
        break;
      case "pets":
        await loadPetsData();
        break;
      case "health":
        await loadHealthData();
        break;
      case "quest":
        await loadQuestData();
        break;
      case "connect":
        await loadConnectData();
        break;
      default:
        break;
    }
  } catch (error) {
    handleError(error, `Erro ao carregar dados de ${section}`);
  } finally {
    showSectionLoading(section, false);
  }
}

function showSectionLoading(section, isLoading) {
  const content = document.getElementById(`${section}-content`);
  if (!content) return;

  if (isLoading) {
    content.classList.add("loading");
    if (!content.querySelector(".loading-overlay")) {
      const overlay = document.createElement("div");
      overlay.className = "loading-overlay";
      overlay.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-paw fa-spin"></i>
                    <p>Carregando...</p>
                </div>
            `;
      content.appendChild(overlay);
    }
  } else {
    content.classList.remove("loading");
    const overlay = content.querySelector(".loading-overlay");
    if (overlay) overlay.remove();
  }
}

// Data loading mocks
async function loadHomeData() {
  await delay(50);
  updateUserInterface();
}
async function loadPetsData() {
  await delay(50);
  if (typeof renderPetsList === "function") renderPetsList();
}
async function loadHealthData() {
  await delay(50);
  console.log("Loading health data...");
}
async function loadQuestData() {
  await delay(50);
  if (typeof renderQuestSection === "function") renderQuestSection();
  if (typeof updateQuestProgress === "function") updateQuestProgress();
}
async function loadConnectData() {
  await delay(50);
  if (typeof renderVeterinariansList === "function") renderVeterinariansList();
}

// Swipe navigation for mobile
class SwipeNavigator {
  constructor() {
    this.startX = 0;
    this.startY = 0;
    this.threshold = 50;
    this.init();
  }

  init() {
    const container = document.querySelector(".container");
    if (!container) return;

    container.addEventListener("touchstart", this.handleTouchStart.bind(this));
    container.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  handleTouchStart(e) {
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  }

  handleTouchEnd(e) {
    if (!this.startX || !this.startY) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = this.startX - endX;
    const diffY = this.startY - endY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > this.threshold) {
      if (diffX > 0) this.navigateNext();
      else this.navigatePrevious();
    }

    this.startX = 0;
    this.startY = 0;
  }

  navigateNext() {
    const sections = ["home", "pets", "health", "quest", "connect"];
    const currentIndex = sections.indexOf(App.currentSection);
    const nextIndex = (currentIndex + 1) % sections.length;
    navigateTo(sections[nextIndex]);
  }

  navigatePrevious() {
    const sections = ["home", "pets", "health", "quest", "connect"];
    const currentIndex = sections.indexOf(App.currentSection);
    const prevIndex =
      currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
    navigateTo(sections[prevIndex]);
  }
}

// Keyboard navigation
document.addEventListener("keydown", function (e) {
  if (App.currentScreen !== "dashboard-screen") return;

  const sections = ["home", "pets", "health", "quest", "connect"];
  const currentIndex = sections.indexOf(App.currentSection);

  switch (e.key) {
    case "ArrowLeft":
      if (currentIndex > 0) navigateTo(sections[currentIndex - 1]);
      break;
    case "ArrowRight":
      if (currentIndex < sections.length - 1)
        navigateTo(sections[currentIndex + 1]);
      break;
    case "Escape":
      const activeModal = document.querySelector(".modal.active");
      if (activeModal) closeModal(activeModal.id);
      break;
  }
});

// Inject navigation animation CSS
const navAnimationCSS = `
@keyframes navBounce { 0%{transform:scale(1);} 50%{transform:scale(1.2);} 100%{transform:scale(1);} }
@keyframes fadeOut { from{opacity:1;transform:translateY(0);} to{opacity:0;transform:translateY(10px);} }
@keyframes fadeIn { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
.loading-overlay { position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(26,26,46,0.8);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;z-index:50;}
.loading-spinner { text-align:center;color:#e2e8f0;}
.loading-spinner i { font-size:2em;color:#6366f1;margin-bottom:15px;animation:spin 1s linear infinite;}
.loading-spinner p { font-size:0.9em;color:rgba(226,232,240,0.8);}
@keyframes spin { from{transform:rotate(0deg);} to{transform:rotate(360deg);} }
.breadcrumb { display:flex;align-items:center;gap:8px;padding:10px 0;font-size:0.9em;}
.breadcrumb-link { color:#6366f1;cursor:pointer;transition:color 0.2s;}
.breadcrumb-link:hover { color:#8b5cf6;}
.breadcrumb-current { color:#e2e8f0;font-weight:500;}
.breadcrumb i { color:rgba(148,163,184,0.6);font-size:0.8em;}
`;

if (!document.querySelector("#nav-animation-css")) {
  const style = document.createElement("style");
  style.id = "nav-animation-css";
  style.textContent = navAnimationCSS;
  document.head.appendChild(style);
}

// Export Navigation object
window.CatPetNavigation = Navigation;
