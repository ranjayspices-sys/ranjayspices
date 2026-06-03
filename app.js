let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  cart.push({ name, price });
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(name + " added");
}

function renderCart() {
  let container = document.getElementById("cartItems");
  let total = 0;
  container.innerHTML = "";

  cart.forEach(item => {
    total += item.price;
    let div = document.createElement("div");
    div.innerHTML = item.name + " - ₹" + item.price;
    container.appendChild(div);
  });

  document.getElementById("total").innerText = "Total: ₹" + total;
  return total;
}

function payNow() {
  let total = renderCart();

  var options = {
    "key": "YOUR_RAZORPAY_KEY_ID",
    "amount": total * 100,
    "currency": "INR",
    "name": "Ranjay Spices",
    "description": "Spice Order Payment",
    "handler": function (response) {
      alert("Payment Successful: " + response.razorpay_payment_id);
      sendOrderToSheet(response.razorpay_payment_id);
      sendWhatsAppConfirmation();
    },
    "prefill": {
      "name": "",
      "email": "",
      "contact": ""
    },
    "theme": {
      "color": "#8B0000"
    }
  };

  var rzp = new Razorpay(options);
  rzp.open();
}

function sendWhatsAppConfirmation() {
  let msg = "Order Confirmed from Ranjay Spices:%0A";
  cart.forEach(i => msg += i.name + "%0A");

  window.open("https://wa.me/919102239127?text=" + msg, "_blank");
}

function sendOrderToSheet(paymentId) {
  fetch("YOUR_GOOGLE_SCRIPT_URL", {
    method: "POST",
    body: JSON.stringify({
      items: JSON.stringify(cart),
      total: renderCart(),
      paymentId: paymentId
    })
  });
}
