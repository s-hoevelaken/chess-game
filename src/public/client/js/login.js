document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
      event.preventDefault();
      
      const form = event.target;
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      console.log("data variable: " + data)
      try {
        console.log("before fetch")
        const response = await fetch("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        console.log("after fetch")

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        window.location.href = "/";
      } else {
        alert("Login failed");
        console.log(response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
