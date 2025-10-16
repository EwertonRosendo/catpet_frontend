// assets/js/pets.js

const Pets = {
  selectedCategory: null,
  editingPet: null,

  // Pet species data
  speciesData: {
    gato: {
      emoji: "🐱",
      breeds: [
        "Persa",
        "Siamês",
        "Maine Coon",
        "British Shorthair",
        "Ragdoll",
        "Sphynx",
      ],
      colors: ["#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
    },
    cachorro: {
      emoji: "🐕",
      breeds: [
        "Labrador",
        "Golden Retriever",
        "Bulldog",
        "Poodle",
        "Pastor Alemão",
        "Beagle",
      ],
      colors: ["#d97706", "#92400e", "#374151", "#1f2937"],
    },
    ave: {
      emoji: "🐦",
      breeds: ["Canário", "Calopsita", "Periquito", "Papagaio", "Agapornis"],
      colors: ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"],
    },
    outro: {
      emoji: "🐾",
      breeds: ["Coelho", "Hamster", "Peixe", "Tartaruga", "Iguana"],
      colors: ["#6b7280", "#8b5cf6", "#06b6d4", "#10b981"],
    },
  },
};

// Enhanced pet rendering
function renderPetsList() {
  const petsContainer = document.querySelector(".pets-list");
  if (!petsContainer) return;

  const pets = App.pets || [];

  if (pets.length === 0) {
    petsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🐾</div>
                <h3>Nenhum pet cadastrado</h3>
                <p>Adicione seu primeiro pet para começar!</p>
                <button class="btn-primary" onclick="openAddPetModal()">
                    <i class="fas fa-plus"></i>
                    Adicionar Pet
                </button>
            </div>
        `;
    return;
  }

  petsContainer.innerHTML = pets.map((pet) => createPetCard(pet)).join("");

  // Add animation to cards
  setTimeout(() => {
    document.querySelectorAll(".pet-card").forEach((card, index) => {
      card.style.animation = "slideIn 0.5s ease-out";
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }, 100);
}

function createPetCard(pet) {
  const statusClass =
    pet.status === "healthy"
      ? "status-healthy"
      : pet.status === "attention"
      ? "status-attention"
      : "status-urgent";

  const statusText =
    pet.status === "healthy"
      ? "Saudável"
      : pet.status === "attention"
      ? "Atenção"
      : "Urgente";

  const appointmentText = pet.nextAppointment
    ? `Próxima consulta: ${pet.nextAppointment}`
    : pet.medication || "Sem agendamentos";

  const warningIcon =
    pet.status !== "healthy"
      ? '<i class="fas fa-exclamation-triangle"></i>'
      : '<i class="fas fa-calendar"></i>';

  return `
        <div class="pet-card" onclick="openPetProfile('${pet.name.toLowerCase()}')">
            <div class="pet-avatar" style="background: ${getRandomColor()}">${
    pet.emoji
  }</div>
            <div class="pet-info">
                <h3>${pet.name}</h3>
                <p>${pet.breed} • ${pet.age} anos</p>
                <div class="pet-status">
                    <span class="${statusClass}">${statusText}</span>
                    <span class="next-appointment">${appointmentText}</span>
                </div>
            </div>
            <div class="pet-actions">
                <button class="action-small" onclick="event.stopPropagation(); showPetOptions('${
                  pet.id
                }')">
                    ${warningIcon}
                </button>
            </div>
        </div>
    `;
}

function getRandomColor() {
  const colors = [
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#d97706",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Enhanced add pet modal
function openAddPetModal() {
  openModal("add-pet-modal");
  setupAddPetForm();
}

function setupAddPetForm() {
  const speciesSelect = document.querySelector("#add-pet-modal select");
  const breedInput = document.querySelector(
    '#add-pet-modal input[placeholder*="Raça"]'
  );

  if (speciesSelect) {
    speciesSelect.addEventListener("change", function () {
      updateBreedSuggestions(this.value, breedInput);
    });
  }

  // Add preview avatar
  const nameInput = document.querySelector(
    '#add-pet-modal input[placeholder*="Luna"]'
  );
  if (nameInput) {
    nameInput.addEventListener("input", function () {
      updatePetPreview();
    });
  }
}

function updateBreedSuggestions(species, breedInput) {
  if (!species || !breedInput) return;

  const breeds = Pets.speciesData[species]?.breeds || [];

  // Create datalist for breed suggestions
  let datalist = document.getElementById("breed-suggestions");
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = "breed-suggestions";
    document.body.appendChild(datalist);
  }

  datalist.innerHTML = breeds
    .map((breed) => `<option value="${breed}">`)
    .join("");
  breedInput.setAttribute("list", "breed-suggestions");
}

function updatePetPreview() {
  const form = document.getElementById("add-pet-form");
  const formData = new FormData(form);

  const name = formData.get("name") || "Novo Pet";
  const species = formData.get("species") || "outro";
  const emoji = Pets.speciesData[species]?.emoji || "🐾";

  // Add or update preview
  let preview = document.querySelector(".pet-preview");
  if (!preview) {
    preview = document.createElement("div");
    preview.className = "pet-preview";
    form.insertBefore(preview, form.firstChild);
  }

  preview.innerHTML = `
        <div class="preview-avatar">${emoji}</div>
        <div class="preview-name">${name}</div>
    `;
}

// Enhanced pet form handler
function handleAddPet(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const species = formData.get("species");

  const petData = {
    id: generateId(),
    name: formData.get("name"),
    species: species,
    breed: formData.get("breed") || "Sem Raça Definida",
    age: parseInt(formData.get("age")) || 0,
    gender: formData.get("gender") || "não informado",
    emoji: Pets.speciesData[species]?.emoji || "🐾",
    status: "healthy",
    createdAt: new Date().toISOString(),
    vaccinated: false,
    spayed: false,
  };

  // Validate required fields
  if (!petData.name || !petData.species) {
    showSuccessModal("Erro", "Nome e espécie são obrigatórios!");
    return;
  }

  // Add to pets array
  App.pets.push(petData);

  // Update stats
  App.userStats.totalPets = App.pets.length;

  // Close modal and show success
  closeModal("add-pet-modal");
  showSuccessModal(
    "Pet Adicionado! 🎉",
    `${petData.name} foi adicionado com sucesso!`
  );

  // Refresh pets list
  renderPetsList();
  updateStats();

  // Reset form
  e.target.reset();

  // Remove preview
  const preview = document.querySelector(".pet-preview");
  if (preview) preview.remove();

  // Save to localStorage
  savePetsData();
}

// Pet profile management
function openPetProfile(petName) {
  const pet = App.pets.find((p) => p.name.toLowerCase() === petName);
  if (!pet) return;

  // Create and show pet profile modal
  createPetProfileModal(pet);
  openModal("pet-profile-modal");
}

function createPetProfileModal(pet) {
  // Remove existing modal if any
  const existingModal = document.getElementById("pet-profile-modal");
  if (existingModal) {
    existingModal.remove();
  }

  const modalHTML = `
        <div class="modal" id="pet-profile-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Perfil de ${pet.name}</h3>
                    <button class="close-btn" onclick="closeModal('pet-profile-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="pet-profile-header">
                        <div class="profile-avatar">${pet.emoji}</div>
                        <div class="profile-info">
                            <h2>${pet.name}</h2>
                            <p>${pet.breed} • ${pet.age} anos</p>
                            <span class="pet-status ${
                              pet.status === "healthy"
                                ? "status-healthy"
                                : "status-attention"
                            }">
                                ${
                                  pet.status === "healthy"
                                    ? "Saudável"
                                    : "Atenção"
                                }
                            </span>
                        </div>
                    </div>
                    
                    <div class="pet-details">
                        <div class="detail-row">
                            <span>Espécie:</span>
                            <span>${
                              pet.species.charAt(0).toUpperCase() +
                              pet.species.slice(1)
                            }</span>
                        </div>
                        <div class="detail-row">
                            <span>Gênero:</span>
                            <span>${pet.gender}</span>
                        </div>
                        <div class="detail-row">
                            <span>Castrado:</span>
                            <span>${pet.spayed ? "Sim" : "Não"}</span>
                        </div>
                        <div class="detail-row">
                            <span>Vacinado:</span>
                            <span>${pet.vaccinated ? "Sim" : "Não"}</span>
                        </div>
                    </div>
                    
                    <div class="pet-actions-grid">
                        <button class="action-btn" onclick="scheduleVaccine('${
                          pet.id
                        }')">
                            <i class="fas fa-syringe"></i>
                            <span>Vacinar</span>
                        </button>
                        <button class="action-btn" onclick="addMedication('${
                          pet.id
                        }')">
                            <i class="fas fa-pills"></i>
                            <span>Medicação</span>
                        </button>
                        <button class="action-btn" onclick="logFeeding('${
                          pet.id
                        }')">
                            <i class="fas fa-utensils"></i>
                            <span>Alimentar</span>
                        </button>
                        <button class="action-btn" onclick="editPet('${
                          pet.id
                        }')">
                            <i class="fas fa-edit"></i>
                            <span>Editar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Pet categories filtering
function filterPets(category) {
  Pets.selectedCategory = Pets.selectedCategory === category ? null : category;

  // Update category buttons
  document.querySelectorAll(".category-item").forEach((item) => {
    item.classList.remove("active");
  });

  if (Pets.selectedCategory) {
    document
      .querySelector(`[onclick="filterPets('${category}')"]`)
      .classList.add("active");
  }

  // Filter and re-render pets
  renderFilteredPets();

  showSuccessModal(
    "Filtro Aplicado",
    Pets.selectedCategory
      ? `Mostrando pets por: ${category}`
      : "Mostrando todos os pets"
  );
}

function renderFilteredPets() {
  let filteredPets = App.pets;

  if (Pets.selectedCategory) {
    // This would filter based on category logic
    // For now, just show all pets
  }

  renderPetsList();
}

// Pet actions
function showPetOptions(petId) {
  const pet = App.pets.find((p) => p.id == petId);
  if (!pet) return;

  const options = [
    {
      text: "Ver Perfil",
      action: () => openPetProfile(pet.name.toLowerCase()),
    },
    { text: "Agendar Consulta", action: () => scheduleConsultation(petId) },
    { text: "Adicionar Medicação", action: () => addMedication(petId) },
    { text: "Editar", action: () => editPet(petId) },
    { text: "Remover", action: () => removePet(petId), danger: true },
  ];

  showContextMenu(options);
}

function showContextMenu(options) {
  // Create context menu
  const menu = document.createElement("div");
  menu.className = "context-menu";
  menu.innerHTML = options
    .map(
      (option) => `
        <button class="context-option ${
          option.danger ? "danger" : ""
        }" onclick="this.parentNode.remove(); (${option.action})()">
            ${option.text}
        </button>
    `
    )
    .join("");

  // Position and show menu
  document.body.appendChild(menu);

  // Remove menu after 5 seconds
  setTimeout(() => {
    if (menu.parentNode) {
      menu.remove();
    }
  }, 5000);
}

function scheduleConsultation(petId) {
  navigateTo("connect");
  showSuccessModal("Agendamento", "Redirecionando para área de consultas...");
}

function addMedication(petId) {
  const pet = App.pets.find((p) => p.id == petId);
  showSuccessModal("Medicação", `Adicionando medicação para ${pet?.name}`);
}

function logFeeding(petId) {
  const pet = App.pets.find((p) => p.id == petId);
  showSuccessModal("Alimentação", `Registrando alimentação de ${pet?.name}`);
}

function scheduleVaccine(petId) {
  const pet = App.pets.find((p) => p.id == petId);
  showSuccessModal("Vacinação", `Agendando vacina para ${pet?.name}`);
}

function editPet(petId) {
  const pet = App.pets.find((p) => p.id == petId);
  if (!pet) return;

  Pets.editingPet = pet;

  // Fill form with pet data
  const form = document.getElementById("add-pet-form");
  if (form) {
    form.querySelector('input[placeholder*="Luna"]').value = pet.name;
    form.querySelector("select").value = pet.species;
    form.querySelector('input[placeholder*="Raça"]').value = pet.breed;
    form.querySelector('input[type="number"]').value = pet.age;
  }

  // Change modal title
  document.querySelector(
    "#add-pet-modal h3"
  ).textContent = `Editar ${pet.name}`;
  document.querySelector("#add-pet-modal .btn-primary").innerHTML =
    '<i class="fas fa-save"></i> Salvar Alterações';

  openModal("add-pet-modal");
}

function removePet(petId) {
  const pet = App.pets.find((p) => p.id == petId);
  if (!pet) return;

  if (confirm(`Tem certeza que deseja remover ${pet.name}?`)) {
    App.pets = App.pets.filter((p) => p.id != petId);
    App.userStats.totalPets = App.pets.length;

    renderPetsList();
    updateStats();
    savePetsData();

    showSuccessModal("Pet Removido", `${pet.name} foi removido com sucesso.`);
  }
}

// Data persistence
function savePetsData() {
  localStorage.setItem("catpet_pets", JSON.stringify(App.pets));
  localStorage.setItem("catpet_stats", JSON.stringify(App.userStats));
}

function loadPetsData() {
  const savedPets = localStorage.getItem("catpet_pets");
  const savedStats = localStorage.getItem("catpet_stats");

  if (savedPets) {
    App.pets = JSON.parse(savedPets);
  }

  if (savedStats) {
    App.userStats = { ...App.userStats, ...JSON.parse(savedStats) };
  }

  renderPetsList();
}

// Initialize pets section
document.addEventListener("DOMContentLoaded", function () {
  loadPetsData();
});

// Add CSS for pet components
const petCSS = `
.empty-state {
    text-align: center;
    padding: 60px 30px;
    color: rgba(226, 232, 240, 0.8);
}

.empty-icon {
    font-size: 4em;
    margin-bottom: 20px;
    opacity: 0.5;
}

.empty-state h3 {
    font-size: 1.3em;
    margin-bottom: 10px;
    color: #e2e8f0;
}

.empty-state p {
    margin-bottom: 30px;
    line-height: 1.5;
}

.pet-preview {
    text-align: center;
    padding: 20px;
    margin-bottom: 20px;
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.2);
    border-radius: 15px;
}

.preview-avatar {
    font-size: 3em;
    margin-bottom: 10px;
}

.preview-name {
    color: #e2e8f0;
    font-weight: 600;
    font-size: 1.1em;
}

.pet-profile-header {
    text-align: center;
    padding: 20px;
    background: rgba(99, 102, 241, 0.1);
    border-radius: 15px;
    margin-bottom: 25px;
}

.profile-avatar {
    font-size: 4em;
    margin-bottom: 15px;
}

.profile-info h2 {
    color: #e2e8f0;
    font-size: 1.5em;
    margin-bottom: 5px;
}

.profile-info p {
    color: rgba(148, 163, 184, 0.8);
    margin-bottom: 10px;
}

.pet-details {
    margin-bottom: 25px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid rgba(100, 116, 139, 0.2);
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-row span:first-child {
    color: rgba(148, 163, 184, 0.8);
    font-weight: 500;
}

.detail-row span:last-child {
    color: #e2e8f0;
    font-weight: 600;
}

.pet-actions-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.pet-actions-grid .action-btn {
    padding: 15px;
    background: rgba(30, 41, 59, 0.6);
    border: 1px solid rgba(100, 116, 139, 0.2);
    border-radius: 12px;
    color: #e2e8f0;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}

.pet-actions-grid .action-btn:hover {
    background: rgba(30, 41, 59, 0.8);
    border-color: rgba(100, 116, 139, 0.3);
    transform: translateY(-2px);
}

.pet-actions-grid .action-btn i {
    font-size: 1.5em;
    color: #6366f1;
}

.pet-actions-grid .action-btn span {
    font-size: 0.9em;
    font-weight: 500;
}

.context-menu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(30, 41, 59, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 15px;
    padding: 10px;
    z-index: 1000;
    min-width: 200px;
    animation: contextMenuSlide 0.2s ease-out;
}

@keyframes contextMenuSlide {
    from { opacity: 0; transform: translate(-50%, -60%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
}

.context-option {
    width: 100%;
    padding: 12px 16px;
    background: transparent;
    color: #e2e8f0;
    border: none;
    border-radius: 8px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9em;
}

.context-option:hover {
    background: rgba(100, 116, 139, 0.2);
}

.context-option.danger {
    color: #ef4444;
}

.context-option.danger:hover {
    background: rgba(239, 68, 68, 0.2);
}

.category-item.active {
    background: rgba(139, 92, 246, 0.3);
    border-color: rgba(139, 92, 246, 0.5);
    transform: translateY(-2px);
}

.category-item.active i {
    color: #a78bfa;
}

@media (max-width: 480px) {
    .pet-actions-grid {
        grid-template-columns: 1fr;
    }
    
    .context-menu {
        min-width: 180px;
        left: 20px;
        right: 20px;
        transform: translateY(-50%);
        width: auto;
    }
}
`;

// Inject pet CSS
if (!document.querySelector("#pet-css")) {
  const style = document.createElement("style");
  style.id = "pet-css";
  style.textContent = petCSS;
  document.head.appendChild(style);
}

// Export Pets object
window.CatPetPets = Pets;
