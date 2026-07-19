const healthText = document.getElementById("healthText");
const statusDot = document.getElementById("statusDot");
const ordersBody = document.getElementById("ordersBody");
const orderForm = document.getElementById("orderForm");
const refreshBtn = document.getElementById("refreshBtn");
const message = document.getElementById("message");
const versionBadge = document.getElementById("versionBadge");

async function loadBackendInfo() {
  try {
    const response = await fetch("/backend-info");
    const info = await response.json();
    versionBadge.textContent = info.version || "v1";
  } catch {
    versionBadge.textContent = "offline";
  }
}

async function checkHealth() {
  try {
    const response = await fetch("/health");
    const health = await response.json();
    healthText.textContent = health.status || "healthy";
    statusDot.className = "status-dot ok";
  } catch {
    healthText.textContent = "Unavailable";
    statusDot.className = "status-dot fail";
  }
}

async function loadOrders() {
  ordersBody.innerHTML = "<tr><td colspan=\"4\">Loading orders...</td></tr>";

  try {
    const response = await fetch("/api/orders");
    const orders = await response.json();

    ordersBody.innerHTML = orders
      .map(
        (order) => `
          <tr>
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>${order.status}</td>
          </tr>
        `
      )
      .join("");
  } catch {
    ordersBody.innerHTML = "<tr><td colspan=\"4\">Unable to load orders.</td></tr>";
  }
}

orderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "Creating order...";

  const formData = new FormData(orderForm);
  const payload = {
    customer: formData.get("customer"),
    product: formData.get("product"),
  };

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Create failed");
    }

    orderForm.reset();
    message.textContent = "Order created successfully.";
    await loadOrders();
  } catch {
    message.textContent = "Order create failed. Check backend logs.";
  }
});

refreshBtn.addEventListener("click", loadOrders);

loadBackendInfo();
checkHealth();
loadOrders();
