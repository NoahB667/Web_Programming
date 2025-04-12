function calculateTotal() {
    let quantities = document.querySelectorAll(".quantity");
    let totalCost = 0;
    let orderSummary = "";

    for (let i = 0; i < quantities.length; i++) {
        let qty = quantities[i].value.trim();
        let price = parseFloat(quantities[i].dataset.price);

        if (!/^\d+$/.test(qty)) {
            alert("Please enter a valid integer quantity for all books.");
            return;
        }

        qty = parseInt(qty);
        let itemTotal = qty * price;

        if (qty > 0) {
            orderSummary += `<b>${quantities[i].closest("tr").children[0].textContent} (Quantity = ${qty}):</b> $${itemTotal}<br>`;
        }

        totalCost += itemTotal;
    }

    document.getElementById("orderSummary").innerHTML = orderSummary;
    document.getElementById("finalTotal").innerHTML = `<b>Final Total:</b> $${totalCost.toFixed(2)}`;
}
