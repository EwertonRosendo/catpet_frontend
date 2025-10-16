// assets/js/connect.js

const Connect = {
  currentTab: "veterinarios",
  activeConsultation: null,
  consultationHistory: [],

  // Extended veterinarian data
  veterinarians: [
    {
      id: 1,
      name: "Dr. Carlos Silva",
      specialty: "Clínica Geral • Nutrição",
      avatar: "👨‍⚕️",
      rating: 4.9,
      reviews: 156,
      status: "online",
      price: 45,
      experience: "8 anos",
      languages: ["Português", "Inglês"],
      nextAvailable: "15 min",
      bio: "Especialista em nutrição felina e canina com foco em alimentação natural.",
    },
    {
      id: 2,
      name: "Dra. Ana Oliveira",
      specialty: "Comportamento Animal",
      avatar: "👩‍⚕️",
      rating: 4.8,
      reviews: 203,
      status: "busy",
      price: 55,
      experience: "12 anos",
      languages: ["Português"],
      nextAvailable: "2h 30min",
      bio: "Especializada em modificação comportamental e adestramento positivo.",
    },
    {
      id: 3,
      name: "Dr. Pedro Santos",
      specialty: "Emergências • Exotic Pets",
      avatar: "👨‍⚕️",
      rating: 4.9,
      reviews: 89,
      status: "online",
      price: 65,
      experience: "15 anos",
      languages: ["Português", "Espanhol"],
      nextAvailable: "Agora",
      bio: "Veterinário de emergência com especialização em animais exóticos.",
    },
    {
      id: 4,
      name: "Dra. Marina Costa",
      specialty: "Dermatologia Veterinária",
      avatar: "👩‍⚕️",
      rating: 4.7,
      reviews: 134,
      status: "offline",
      price: 50,
      experience: "6 anos",
      languages: ["Português"],
      nextAvailable: "Amanhã 09h",
      bio: "Especialista em dermatologia e alergias em cães e gatos.",
    },
  ],

  // Course data
  courses: [
    {
      id: 1,
      title: "Nutrição Felina Avançada",
      instructor: "Dr. Carlos Silva",
      duration: "4h 30min",
      lessons: 12,
      progress: 30,
      price: 89.9,
      rating: 4.8,
      students: 1245,
      image: "📚",
      description: "Aprenda tudo sobre alimentação balanceada para gatos.",
    },
    {
      id: 2,
      title: "Enriquecimento Ambiental",
      instructor: "Dra. Ana Oliveira",
      duration: "3h 15min",
      lessons: 8,
      progress: 0,
      price: 79.9,
      rating: 4.9,
      students: 892,
      image: "🏠",
      description: "Como criar um ambiente estimulante para seu pet.",
    },
    {
      id: 3,
      title: "Primeiros Socorros Pet",
      instructor: "Dr. Pedro Santos",
      duration: "2h 45min",
      lessons: 6,
      progress: 0,
      price: 99.9,
      rating: 4.9,
      students: 567,
      image: "🚑",
      description: "Aprenda a lidar com emergências veterinárias.",
    },
  ],
};

// Enhanced veterinarian rendering
function renderVeterinariansList() {
  const container = document.getElementById("veterinarios-content");
  if (!container) return;

  const vetList =
    container.querySelector(".vet-list") || createVetList(container);
  vetList.innerHTML = Connect.veterinarians
    .map((vet) => createVetCard(vet))
    .join("");

  // Add animations
  setTimeout(() => {
    vetList.querySelectorAll(".vet-card").forEach((card, index) => {
      card.style.animation = "slideIn 0.5s ease-out";
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }, 100);
}

function createVetList(container) {
  const vetList = document.createElement("div");
  vetList.className = "vet-list";
  container.appendChild(vetList);
  return vetList;
}

function createVetCard(vet) {
  const statusClass =
    vet.status === "online"
      ? "online"
      : vet.status === "busy"
      ? "busy"
      : "offline";

  const statusText =
    vet.status === "online"
      ? "Online"
      : vet.status === "busy"
      ? "Ocupado"
      : "Offline";

  const actionButton =
    vet.status === "online"
      ? `<button class="btn-consult" onclick="startConsultation('${vet.name}')">Consultar</button>`
      : `<button class="btn-schedule" onclick="scheduleConsultation(${vet.id})">Agendar</button>`;

  return `
        <div class="vet-card" onclick="showVetDetails(${vet.id})">
            <div class="vet-avatar">
                <span>${vet.avatar}</span>
                <div class="status-indicator ${statusClass}"></div>
            </div>
            <div class="vet-info">
                <h4>${vet.name}</h4>
                <p>${vet.specialty}</p>
                <div class="vet-rating">
                    ${generateStars(vet.rating)} <span>(${vet.rating}) • ${
    vet.reviews
  } avaliações</span>
                </div>
                <div class="vet-availability">
                    <i class="fas fa-clock"></i>
                    <span>Disponível: ${vet.nextAvailable}</span>
                </div>
                <span class="vet-status ${statusClass}">${statusText}</span>
            </div>
            <div class="vet-actions" onclick="event.stopPropagation()">
                ${actionButton}
                <span class="price">R$ ${vet.price}</span>
            </div>
        </div>
    `;
}

function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += "⭐";
  }

  if (hasHalfStar) {
    stars += "⭐";
  }

  return stars;
}

// Veterinarian details modal
function showVetDetails(vetId) {
  const vet = Connect.veterinarians.find((v) => v.id === vetId);
  if (!vet) return;

  const modalHTML = `
        <div class="modal active" id="vet-details-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Perfil do Veterinário</h3>
                    <button class="close-btn" onclick="closeModal('vet-details-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="vet-profile-header">
                        <div class="profile-avatar-large">${vet.avatar}</div>
                        <div class="profile-info">
                            <h2>${vet.name}</h2>
                            <p class="specialty">${vet.specialty}</p>
                            <div class="rating-large">
                                ${generateStars(vet.rating)} ${vet.rating} (${
    vet.reviews
  } avaliações)
                            </div>
                        </div>
                    </div>
                    
                    <div class="vet-details-grid">
                        <div class="detail-item">
                            <i class="fas fa-graduation-cap"></i>
                            <div>
                                <h4>Experiência</h4>
                                <p>${vet.experience}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-language"></i>
                            <div>
                                <h4>Idiomas</h4>
                                <p>${vet.languages.join(", ")}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <h4>Disponibilidade</h4>
                                <p>${vet.nextAvailable}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-dollar-sign"></i>
                            <div>
                                <h4>Preço da Consulta</h4>
                                <p>R$ ${vet.price}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="vet-bio">
                        <h4>Sobre</h4>
                        <p>${vet.bio}</p>
                    </div>
                    
                    <div class="consultation-options">
                        ${
                          vet.status === "online"
                            ? `<button class="btn-primary" onclick="startConsultation('${vet.name}')">
                                <i class="fas fa-video"></i>
                                Iniciar Consulta (R$ ${vet.price})
                            </button>`
                            : `<button class="btn-secondary" onclick="scheduleConsultation(${vet.id})">
                                <i class="fas fa-calendar"></i>
                                Agendar Consulta
                            </button>`
                        }
                        <button class="btn-secondary" onclick="sendMessage(${
                          vet.id
                        })">
                            <i class="fas fa-comment"></i>
                            Enviar Mensagem
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

// Consultation functions
function startConsultation(vetName) {
  if (Connect.activeConsultation) {
    showSuccessModal(
      "Consulta Ativa",
      "Você já tem uma consulta em andamento!"
    );
    return;
  }

  Connect.activeConsultation = {
    vet: vetName,
    startTime: new Date(),
    type: "video",
    status: "connecting",
  };

  // Close any open modals
  document.querySelectorAll(".modal.active").forEach((modal) => {
    modal.classList.remove("active");
  });

  // Show consultation interface
  showConsultationInterface(vetName);
}

function showConsultationInterface(vetName) {
  const consultationHTML = `
        <div class="modal active" id="consultation-modal">
            <div class="modal-content consultation-interface">
                <div class="consultation-header">
                    <div class="vet-info-mini">
                        <div class="avatar-mini">👨‍⚕️</div>
                        <div>
                            <h3>${vetName}</h3>
                            <span class="status-connecting">Conectando...</span>
                        </div>
                    </div>
                    <button class="end-call-btn" onclick="endConsultation()">
                        <i class="fas fa-phone-slash"></i>
                    </button>
                </div>
                
                <div class="video-container">
                    <div class="vet-video">
                        <div class="video-placeholder">
                            <i class="fas fa-user-md"></i>
                            <p>Conectando com ${vetName}...</p>
                        </div>
                    </div>
                    <div class="user-video">
                        <div class="video-placeholder-small">
                            <i class="fas fa-user"></i>
                        </div>
                    </div>
                </div>
                
                <div class="consultation-controls">
                    <button class="control-btn" onclick="toggleMute()">
                        <i class="fas fa-microphone"></i>
                    </button>
                    <button class="control-btn" onclick="toggleVideo()">
                        <i class="fas fa-video"></i>
                    </button>
                    <button class="control-btn" onclick="toggleChat()">
                        <i class="fas fa-comment"></i>
                    </button>
                    <button class="control-btn emergency" onclick="requestEmergencyHelp()">
                        <i class="fas fa-exclamation-triangle"></i>
                    </button>
                </div>
                
                <div class="consultation-timer">
                    <span id="consultation-timer">00:00</span>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);

  // Simulate connection process
  setTimeout(() => {
    document.querySelector(".status-connecting").textContent = "Conectado";
    document.querySelector(".status-connecting").className = "status-connected";
    document.querySelector(
      ".video-placeholder p"
    ).textContent = `Conversando com ${vetName}`;
    startConsultationTimer();
  }, 3000);
}

function startConsultationTimer() {
  let seconds = 0;
  const timer = setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const timerElement = document.getElementById("consultation-timer");

    if (timerElement) {
      timerElement.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    } else {
      clearInterval(timer);
    }
  }, 1000);

  // Store timer reference
  Connect.activeConsultation.timer = timer;
}

function endConsultation() {
  if (!Connect.activeConsultation) return;

  // Clear timer
  if (Connect.activeConsultation.timer) {
    clearInterval(Connect.activeConsultation.timer);
  }

  // Calculate consultation duration
  const duration = Math.floor(
    (new Date() - Connect.activeConsultation.startTime) / 1000
  );

  // Add to history
  Connect.consultationHistory.push({
    ...Connect.activeConsultation,
    endTime: new Date(),
    duration: duration,
    status: "completed",
  });

  // Clear active consultation
  Connect.activeConsultation = null;

  // Close consultation modal
  const modal = document.getElementById("consultation-modal");
  if (modal) {
    modal.remove();
  }

  // Show feedback modal
  showConsultationFeedback();
}

function showConsultationFeedback() {
  const feedbackHTML = `
        <div class="modal active" id="feedback-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Avalie sua consulta</h3>
                </div>
                <div class="modal-body">
                    <div class="feedback-section">
                        <h4>Como foi sua experiência?</h4>
                        <div class="rating-input">
                            ${[1, 2, 3, 4, 5]
                              .map(
                                (star) =>
                                  `<button class="star-btn" onclick="selectRating(${star})">⭐</button>`
                              )
                              .join("")}
                        </div>
                    </div>
                    
                    <div class="feedback-section">
                        <h4>Comentários (opcional)</h4>
                        <textarea class="feedback-textarea" placeholder="Conte-nos sobre sua experiência..."></textarea>
                    </div>
                    
                    <div class="feedback-actions">
                        <button class="btn-secondary" onclick="closeModal('feedback-modal')">Pular</button>
                        <button class="btn-primary" onclick="submitFeedback()">Enviar Avaliação</button>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function selectRating(rating) {
  document.querySelectorAll(".star-btn").forEach((btn, index) => {
    btn.classList.toggle("selected", index < rating);
  });
}

function submitFeedback() {
  const selectedStars = document.querySelectorAll(".star-btn.selected").length;
  const comment = document.querySelector(".feedback-textarea").value;

  // Save feedback (in real app, this would go to backend)
  const feedback = {
    rating: selectedStars,
    comment: comment,
    date: new Date().toISOString(),
  };

  closeModal("feedback-modal");
  showSuccessModal("Obrigado!", "Sua avaliação foi enviada com sucesso!");
}

// Scheduling functions
function scheduleConsultation(vetId) {
  const vet = Connect.veterinarians.find((v) => v.id === vetId);
  if (!vet) return;

  const scheduleHTML = `
        <div class="modal active" id="schedule-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Agendar Consulta</h3>
                    <button class="close-btn" onclick="closeModal('schedule-modal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="vet-info-mini">
                        <span>${vet.avatar}</span>
                        <div>
                            <h4>${vet.name}</h4>
                            <p>${vet.specialty}</p>
                        </div>
                    </div>
                    
                    <div class="schedule-form">
                        <div class="form-group">
                            <label>Selecione o pet</label>
                            <select class="form-select">
                                ${App.pets
                                  .map(
                                    (pet) =>
                                      `<option value="${pet.id}">${pet.name} (${pet.breed})</option>`
                                  )
                                  .join("")}
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Data preferida</label>
                            <input type="date" class="form-input" min="${
                              new Date().toISOString().split("T")[0]
                            }">
                        </div>
                        
                        <div class="form-group">
                            <label>Horário preferido</label>
                            <select class="form-select">
                                <option value="09:00">09:00</option>
                                <option value="10:00">10:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Motivo da consulta</label>
                            <select class="form-select">
                                <option value="checkup">Check-up geral</option>
                                <option value="vaccination">Vacinação</option>
                                <option value="behavior">Problema comportamental</option>
                                <option value="nutrition">Orientação nutricional</option>
                                <option value="emergency">Emergência</option>
                                <option value="other">Outro</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label>Observações</label>
                            <textarea class="form-input" rows="3" placeholder="Descreva os sintomas ou motivo da consulta..."></textarea>
                        </div>
                        
                        <div class="price-info">
                            <div class="price-row">
                                <span>Consulta</span>
                                <span>R$ ${vet.price}</span>
                            </div>
                            <div class="price-row total">
                                <span>Total</span>
                                <span>R$ ${vet.price}</span>
                            </div>
                        </div>
                        
                        <button class="btn-primary" onclick="confirmSchedule(${
                          vet.id
                        })">
                            <i class="fas fa-calendar-check"></i>
                            Confirmar Agendamento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
}

function confirmSchedule(vetId) {
  const modal = document.getElementById("schedule-modal");
  const formData = new FormData();

  // Get form values
  const petSelect = modal.querySelector("select");
  const dateInput = modal.querySelector('input[type="date"]');
  const timeSelect = modal.querySelectorAll("select")[1];
  const reasonSelect = modal.querySelectorAll("select")[2];
  const observations = modal.querySelector("textarea");

  const appointment = {
    id: generateId(),
    vetId: vetId,
    petId: petSelect.value,
    date: dateInput.value,
    time: timeSelect.value,
    reason: reasonSelect.value,
    observations: observations.value,
    status: "scheduled",
    createdAt: new Date().toISOString(),
  };

  // Save appointment (in real app, this would go to backend)
  saveAppointment(appointment);

  closeModal("schedule-modal");
  showSuccessModal(
    "Agendamento Confirmado! 📅",
    `Sua consulta foi agendada para ${formatDate(appointment.date)} às ${
      appointment.time
    }`
  );
}

function saveAppointment(appointment) {
  let appointments = JSON.parse(
    localStorage.getItem("catpet_appointments") || "[]"
  );
  appointments.push(appointment);
  localStorage.setItem("catpet_appointments", JSON.stringify(appointments));
}

// Courses section
function renderCoursesList() {
  const container = document.getElementById("cursos-content");
  if (!container) return;

  const coursesList =
    container.querySelector(".courses-list") || createCoursesList(container);
  coursesList.innerHTML = Connect.courses
    .map((course) => createCourseCard(course))
    .join("");
}

function createCoursesList(container) {
  const coursesList = document.createElement("div");
  coursesList.className = "courses-list";
  container.appendChild(coursesList);
  return coursesList;
}

function createCourseCard(course) {
  const progressWidth = course.progress;

  return `
        <div class="course-card" onclick="openCourse(${course.id})">
            <div class="course-image">${course.image}</div>
            <div class="course-info">
                <h4>${course.title}</h4>
                <p>Por ${course.instructor}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-play-circle"></i> ${
                      course.lessons
                    } aulas</span>
                    <span><i class="fas fa-users"></i> ${course.students}</span>
                </div>
                <div class="course-rating">
                    ${generateStars(course.rating)} ${course.rating} (${
    course.students
  } alunos)
                </div>
                <div class="course-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressWidth}%"></div>
                    </div>
                    <span>${progressWidth}% completo</span>
                </div>
                <div class="course-price">
                    ${course.price === 0 ? "Gratuito" : `R$ ${course.price}`}
                </div>
            </div>
        </div>
    `;
}

function openCourse(courseId) {
  const course = Connect.courses.find((c) => c.id === courseId);
  if (!course) return;

  showSuccessModal(
    "📚 Curso",
    `Abrindo curso: ${course.title}\n\nFuncionalidade completa em desenvolvimento!`
  );
}

// Message functions
function sendMessage(vetId) {
  const vet = Connect.veterinarians.find((v) => v.id === vetId);
  showSuccessModal(
    "💬 Mensagem",
    `Enviando mensagem para ${vet.name}...\n\nChat em desenvolvimento!`
  );
}

// Control functions
function toggleMute() {
  const btn = event.currentTarget;
  const icon = btn.querySelector("i");

  if (icon.classList.contains("fa-microphone")) {
    icon.className = "fas fa-microphone-slash";
    btn.classList.add("muted");
  } else {
    icon.className = "fas fa-microphone";
    btn.classList.remove("muted");
  }
}

function toggleVideo() {
  const btn = event.currentTarget;
  const icon = btn.querySelector("i");

  if (icon.classList.contains("fa-video")) {
    icon.className = "fas fa-video-slash";
    btn.classList.add("disabled");
  } else {
    icon.className = "fas fa-video";
    btn.classList.remove("disabled");
  }
}

function toggleChat() {
  showSuccessModal("💬 Chat", "Chat durante consulta em desenvolvimento!");
}

function requestEmergencyHelp() {
  showSuccessModal(
    "🚨 Emergência",
    "Conectando com veterinário de emergência..."
  );
}

// Tab switching for connect
function switchConnectTab(tabName) {
  Connect.currentTab = tabName;

  // Update tab buttons
  document.querySelectorAll(".connect-tab").forEach((tab) => {
    tab.classList.remove("active");
  });
  document
    .querySelector(`.connect-tab[data-tab="${tabName}"]`)
    .classList.add("active");

  // Update content
  document.querySelectorAll(".connect-content").forEach((content) => {
    content.classList.remove("active");
  });
  document.getElementById(`${tabName}-content`).classList.add("active");

  // Load tab-specific data
  if (tabName === "veterinarios") renderVeterinariansList();
  else if (tabName === "cursos") renderCoursesList();
  else if (tabName === "historico") renderConsultationHistory();
}

function renderConsultationHistory() {
  const container = document.getElementById("historico-content");
  if (!container) return;

  if (Connect.consultationHistory.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>Nenhuma consulta realizada</h3>
                <p>Suas consultas aparecerão aqui após serem realizadas.</p>
            </div>
        `;
    return;
  }

  // Implementation for consultation history would go here
}

// Initialize connect section
function initializeConnect() {
  renderVeterinariansList();
  renderCoursesList();

  // Update vet status periodically
  setInterval(updateVetStatus, 30000); // Update every 30 seconds
}

function updateVetStatus() {
  // Simulate status changes
  Connect.veterinarians.forEach((vet) => {
    if (Math.random() < 0.1) {
      // 10% chance to change status
      const statuses = ["online", "busy", "offline"];
      vet.status = statuses[Math.floor(Math.random() * statuses.length)];
    }
  });

  if (Connect.currentTab === "veterinarios") {
    renderVeterinariansList();
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeConnect();
});

// Utility functions
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("pt-BR");
}

// Export Connect object
window.CatPetConnect = Connect;
