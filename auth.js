document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Element Selection ---
    const signinBtn = document.getElementById("signinBtn");
    const signupBtn = document.getElementById("signupBtn");
    const modal = document.getElementById("authModal");
    const closeModal = document.getElementById("closeModal");
    const title = document.getElementById("modalTitle");
    const nameGroup = document.getElementById("nameGroup");
    const form = document.getElementById("authForm");
    const password = document.getElementById("password");
    const email = document.getElementById("email");
    // This line correctly references the 'fullname' ID (now fixed in HTML)
    const nameField = document.getElementById("fullname"); 
    const attemptInfo = document.getElementById("attemptInfo");
    const greeting = document.getElementById("greeting");
    const switchLink = document.getElementById("switchLink");
    const switchText = document.getElementById("switchText");

    // --- 2. State Variables and Local Storage Setup ---
    let isSignIn = true;
    let attempts = 3;

    // Retrieve users or initialize an empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];
    
    // Pre-seed a test user if one doesn't exist
    const preSeedUser = { name: "Test Admin", email: "test@example.com", password: "admin" };

    if (!users.some(u => u.email === preSeedUser.email)) {
        users.push(preSeedUser);
        localStorage.setItem("users", JSON.stringify(users));
    }

    // --- 3. Initial Setup: Time-based greeting ---
    const hour = new Date().getHours();
    if (hour < 12) greeting.textContent = "🌞 Good Morning, Explorer!";
    else if (hour < 18) greeting.textContent = "🏛️ Good Afternoon, Explorer!";
    else greeting.textContent = "🌙 Good Evening, Explorer!";

    // --- 4. Modal Open/Close Logic ---
    signinBtn.onclick = () => openModal(true);
    signupBtn.onclick = () => openModal(false);
    closeModal.onclick = () => (modal.style.display = "none");
    window.onclick = (e) => { 
        if (e.target === modal) modal.style.display = "none"; 
    };

    function openModal(signin) {
        isSignIn = signin;
        modal.style.display = "flex";
        title.textContent = signin ? "🔑 Sign In" : "📝 Sign Up";
        nameGroup.style.display = signin ? "none" : "block";
        switchText.textContent = signin ? "Don’t have an account? 🤔" : "Already have an account? 🙂";
        switchLink.textContent = signin ? "Sign Up" : "Sign In";
        attemptInfo.textContent = "";
        password.value = "";
        email.value = "";
        if (!signin) nameField.value = "";
        password.disabled = false;
    }

    switchLink.onclick = (e) => {
        e.preventDefault();
        openModal(!isSignIn);
    };

    // --- 5. Validation Helpers ---
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword(pass) {
        // At least 6 chars, 1 letter, 1 number
        return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pass);
    }

    // --- 6. Form Submission Handling ---
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailVal = email.value.trim();
        const passVal = password.value.trim();

        if (!validateEmail(emailVal)) {
            attemptInfo.textContent = "⚠️ Please enter a valid email address.";
            return;
        }

        if (isSignIn) {
            // SIGN IN LOGIC
            const user = users.find((u) => u.email === emailVal);
            
            if (!user) {
                attemptInfo.textContent = "❌ No account found with that email.";
                return;
            }

            if (passVal === user.password) {
                if (confirm(`You are signing in with:\n📧 Email: ${emailVal}\n\nContinue?`)) {
                    // LOGIN SUCCESS HANDLER
                    alert('Logic Successful');
                    alert(`✅ Welcome back, ${user.name || "Explorer"}! 🏛️`);
                    modal.style.display = "none";
                    attempts = 3;
                }
            } else {
                // FAILED ATTEMPT LOGIC
                attempts--;
                attemptInfo.textContent =
                    attempts > 0
                        ? `❌ Incorrect password. ${attempts} attempt(s) left. ⚠️`
                        : "🚫 Too many failed attempts. Try again later.";
                if (attempts <= 0) password.disabled = true;
            }
        } else {
            // SIGN UP LOGIC
            const nameVal = nameField.value.trim();

            if (nameVal.length < 2) {
                attemptInfo.textContent = "⚠️ Name must be at least 2 characters.";
                return;
            }

            // Password check for 'admin' or complex validation
            if (passVal.toLowerCase() !== "admin" && !validatePassword(passVal)) {
                attemptInfo.textContent = "🔐 Password must be 'admin' or at least 6 characters with 1 letter and 1 number.";
                return;
            }

            if (users.some((u) => u.email === emailVal)) {
                attemptInfo.textContent = "⚠️ Account already exists. Please sign in.";
                return;
            }

            if (confirm(`You are signing up with:\n👤 Name: ${nameVal}\n📧 Email: ${emailVal}\n🔑 Password: ${passVal}\n\nProceed?`)) {
                // Save new user
                users.push({ name: nameVal, email: emailVal, password: passVal });
                localStorage.setItem("users", JSON.stringify(users));
                
                // SIGN UP SUCCESS HANDLER
                alert('Logic Successful');
                alert("🎉 Sign-up successful! You can now sign in. ✅");
                openModal(true); // Switch to Sign In view
            }
        }
    });

    // --- 7. Hover Text Animation ---
    const heroText = document.querySelector(".hover-box h1");
    heroText.addEventListener("mouseenter", () => {
        heroText.textContent = "🏛️ Explore the Monuments!";
    });
    heroText.addEventListener("mouseleave", () => {
        const hour = new Date().getHours();
        if (hour < 12) heroText.textContent = "🌞 Good Morning, Explorer!";
        else if (hour < 18) heroText.textContent = "🏛️ Good Afternoon, Explorer!";
        else heroText.textContent = "🌙 Good Evening, Explorer!";
    });
});
