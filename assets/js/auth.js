// assets/js/auth.js

// Authentication functions
const Auth = {
  currentForm: "login",
  isLoading: false,

  // Mock user data for demo
  mockUsers: [
    {
      id: 1,
      name: "Lucas Rodrigues",
      email: "Lucas@email.com",
      password: "123456",
    },
    {
      id: 2,
      name: "Kevin Araujo",
      email: "kevin@email.com",
      password: "abc123",
    },
  ],
};

// Show login form
function showLogin() {
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("register-form").classList.add("hidden");
  Auth.currentForm = "login";
  clearFormErrors();
}

// Show register form
function showRegister() {
  document.getElementById("register-form").classList.remove("hidden");
  document.getElementById("login-form").classList.add("hidden");
  Auth.currentForm = "register";
  clearFormErrors();
}

// Login function
async function login() {
  if (Auth.isLoading) return;

  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  // Validate inputs
  if (!validateLoginInputs(email, password)) {
    return;
  }

  Auth.isLoading = true;
  setLoadingState(true, "login");

  try {
    // Simulate API call delay
    await delay(1500);

    // Mock authentication
    const user = Auth.mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Successful login
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        loginTime: new Date().toISOString(),
        plan: "Premium",
      };

      // Save user data
      App.currentUser = userData;
      localStorage.setItem("catpet_user", JSON.stringify(userData));

      // Show success animation
      showLoginSuccess();

      // Redirect to dashboard after animation
      setTimeout(() => {
        showScreen("dashboard-screen");
        updateUserInterface();
      }, 2000);
    } else {
      // Failed login
      showError("login-email", "Email ou senha incorretos");
      showError("login-password", "");
    }
  } catch (error) {
    handleError(error, "Erro ao fazer login");
  } finally {
    Auth.isLoading = false;
    setLoadingState(false, "login");
  }
}

// Register function
async function register() {
  if (Auth.isLoading) return;

  const name = document.getElementById("register-name").value;
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const confirmPassword = document.getElementById("register-confirm").value;

  // Validate inputs
  if (!validateRegisterInputs(name, email, password, confirmPassword)) {
    return;
  }

  Auth.isLoading = true;
  setLoadingState(true, "register");

  try {
    // Simulate API call delay
    await delay(2000);

    // Check if email already exists
    const existingUser = Auth.mockUsers.find((u) => u.email === email);

    if (existingUser) {
      showError("register-email", "Este email já está cadastrado");
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
    };

    Auth.mockUsers.push(newUser);

    // Auto login after registration
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      loginTime: new Date().toISOString(),
      plan: "Premium",
      isNewUser: true,
    };

    App.currentUser = userData;
    localStorage.setItem("catpet_user", JSON.stringify(userData));

    // Show success animation
    showRegisterSuccess();

    // Redirect to dashboard
    setTimeout(() => {
      showScreen("dashboard-screen");
      updateUserInterface();

      // Show welcome message for new users
      setTimeout(() => {
        showSuccessModal(
          "Bem-vindo ao CatPet! 🎉",
          "Sua conta foi criada com sucesso! Agora você pode começar a cuidar melhor dos seus pets."
        );
      }, 500);
    }, 2000);
  } catch (error) {
    handleError(error, "Erro ao criar conta");
  } finally {
    Auth.isLoading = false;
    setLoadingState(false, "register");
  }
}

// Logout function
function logout() {
  // Clear user data
  App.currentUser = null;
  localStorage.removeItem("catpet_user");

  // Reset forms
  clearAuthForms();

  // Show auth screen
  showScreen("auth-screen");
  showLogin();

  // Show logout message
  showSuccessModal("Até logo!", "Você foi desconectado com sucesso.");
}

// Validation functions
function validateLoginInputs(email, password) {
  clearFormErrors();
  let isValid = true;

  if (!email) {
    showError("login-email", "Email é obrigatório");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("login-email", "Email inválido");
    isValid = false;
  }

  if (!password) {
    showError("login-password", "Senha é obrigatória");
    isValid = false;
  } else if (password.length < 6) {
    showError("login-password", "Senha deve ter pelo menos 6 caracteres");
    isValid = false;
  }

  return isValid;
}

function validateRegisterInputs(name, email, password, confirmPassword) {
  clearFormErrors();
  let isValid = true;

  if (!name || name.trim().length < 2) {
    showError("register-name", "Nome deve ter pelo menos 2 caracteres");
    isValid = false;
  }

  if (!email) {
    showError("register-email", "Email é obrigatório");
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("register-email", "Email inválido");
    isValid = false;
  }

  if (!password) {
    showError("register-password", "Senha é obrigatória");
    isValid = false;
  } else if (password.length < 6) {
    showError("register-password", "Senha deve ter pelo menos 6 caracteres");
    isValid = false;
  }

  if (!confirmPassword) {
    showError("register-confirm", "Confirmação de senha é obrigatória");
    isValid = false;
  } else if (password !== confirmPassword) {
    showError("register-confirm", "Senhas não conferem");
    isValid = false;
  }

  return isValid;
}

// Helper functions
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  if (input) {
    input.classList.add("form-error");

    // Remove existing error message
    const existingError = input.parentNode.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Add error message if provided
    if (message) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "error-message";
      errorDiv.textContent = message;
      input.parentNode.appendChild(errorDiv);
    }

    // Add shake animation
    input.style.animation = "shake 0.5s ease-in-out";
    setTimeout(() => {
      input.style.animation = "";
    }, 500);
  }
}

function showSuccess(inputId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.classList.remove("form-error");
    input.classList.add("form-success");

    // Remove error message
    const errorMessage = input.parentNode.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.remove();
    }
  }
}

function clearFormErrors() {
  document.querySelectorAll(".form-error, .form-success").forEach((input) => {
    input.classList.remove("form-error", "form-success");
  });

  document
    .querySelectorAll(".error-message, .success-message")
    .forEach((msg) => {
      msg.remove();
    });
}

function clearAuthForms() {
  document
    .querySelectorAll("#login-form input, #register-form input")
    .forEach((input) => {
      input.value = "";
    });
  clearFormErrors();
}

function setLoadingState(isLoading, formType) {
  const button = document.querySelector(`#${formType}-form .btn-primary`);
  if (button) {
    if (isLoading) {
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Carregando...';
      button.disabled = true;
      button.classList.add("auth-loading");
    } else {
      const originalText =
        formType === "login"
          ? '<i class="fas fa-sign-in-alt"></i> Entrar'
          : '<i class="fas fa-user-plus"></i> Criar Conta';
      button.innerHTML = originalText;
      button.disabled = false;
      button.classList.remove("auth-loading");
    }
  }
}

function showLoginSuccess() {
  const authCard = document.querySelector(".auth-card");
  authCard.style.transform = "scale(1.05)";
  authCard.style.boxShadow = "0 25px 50px rgba(108, 92, 231, 0.5)";

  // Add success checkmark
  const logo = document.querySelector(".auth-logo");
  logo.innerHTML = "✅";
  logo.style.animation = "successPulse 0.6s ease-out";

  const title = document.querySelector(".auth-title");
  title.textContent = "Login realizado!";
  title.style.color = "#10b981";
}

function showRegisterSuccess() {
  const authCard = document.querySelector(".auth-card");
  authCard.style.transform = "scale(1.05)";
  authCard.style.boxShadow = "0 25px 50px rgba(16, 185, 129, 0.5)";

  // Add success checkmark
  const logo = document.querySelector(".auth-logo");
  logo.innerHTML = "🎉";
  logo.style.animation = "successPulse 0.6s ease-out";

  const title = document.querySelector(".auth-title");
  title.textContent = "Conta criada!";
  title.style.color = "#10b981";
}

// Utility function for delays
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Add CSS for shake animation
const shakeCSS = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}
`;

// Inject shake animation CSS
if (!document.querySelector("#shake-animation-css")) {
  const style = document.createElement("style");
  style.id = "shake-animation-css";
  style.textContent = shakeCSS;
  document.head.appendChild(style);
}

// Social login functions (for future implementation)
function loginWithGoogle() {
  showSuccessModal("Em breve", "Login com Google será implementado em breve!");
}

function loginWithFacebook() {
  showSuccessModal(
    "Em breve",
    "Login com Facebook será implementado em breve!"
  );
}

// Password recovery
function forgotPassword() {
  const email = document.getElementById("login-email").value;

  if (!email) {
    showError("login-email", "Digite seu email para recuperar a senha");
    return;
  }

  if (!isValidEmail(email)) {
    showError("login-email", "Email inválido");
    return;
  }

  showSuccessModal(
    "Email Enviado",
    `Instruções para recuperar sua senha foram enviadas para ${email}`
  );
}

// Auto-fill demo credentials (for development)
function fillDemoCredentials() {
  if (Auth.currentForm === "login") {
    document.getElementById("login-email").value = "maria@email.com";
    document.getElementById("login-password").value = "123456";
  }
}

// Add demo button for development (remove in production)
if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  document.addEventListener("DOMContentLoaded", function () {
    const authCard = document.querySelector(".auth-card");
    if (authCard) {
      const demoBtn = document.createElement("button");
      demoBtn.innerHTML = "🚀 Demo Login";
      demoBtn.className = "btn-secondary";
      demoBtn.style.marginTop = "15px";
      demoBtn.onclick = fillDemoCredentials;

      const loginForm = document.getElementById("login-form");
      loginForm.appendChild(demoBtn);
    }
  });
}

// Export Auth object
window.CatPetAuth = Auth;
