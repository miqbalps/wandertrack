// auth-button.js
async function createAuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const container = document.createElement("div");

  if (user) {
    container.className = "flex items-center gap-4";
    container.innerHTML = `Hey, ${user.email}!`;

    const logoutButton = document.createElement("button");
    logoutButton.onclick = async () => {
      await supabase.auth.signOut();
      window.location.reload();
    };
    logoutButton.textContent = "Logout";
    container.appendChild(logoutButton);
  } else {
    container.className = "flex gap-2";

    // Sign in button
    const signInLink = document.createElement("a");
    signInLink.href = "/login";
    const signInButton = document.createElement("button");
    signInButton.className = "button-outline button-sm";
    signInButton.textContent = "Sign in";
    signInLink.appendChild(signInButton);

    // Sign up button
    const signUpLink = document.createElement("a");
    signUpLink.href = "/sign-up";
    const signUpButton = document.createElement("button");
    signUpButton.className = "button-default button-sm";
    signUpButton.textContent = "Sign up";
    signUpLink.appendChild(signUpButton);

    container.appendChild(signInLink);
    container.appendChild(signUpLink);
  }

  return container;
}

// Usage:
document.addEventListener("DOMContentLoaded", async () => {
  const authButton = await createAuthButton();
  document.querySelector("#auth-button-container").appendChild(authButton);
});
