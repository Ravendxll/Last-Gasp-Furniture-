// Constants for item prices
const ITEM_PRICES = {
  'Chair': 25.50,
  'Recliner': 37.75,
  'Table': 49.95,
  'Umbrella': 24.89
};

// Constants for shipping costs
const SHIPPING_COSTS = {
  1: 0,
  2: 20.00,
  3: 30.00,
  4: 35.00,
  5: 45.00
};

// State to shipping zone mapping
const STATE_ZONES = {
  'WA': 5, 'OR': 5, 'CA': 5, 'ID': 5, 'MT': 5, 'WY': 5, 'NV': 5, 'UT': 5, 'AZ': 5,
  'ND': 4, 'SD': 4, 'NE': 4, 'OK': 4, 'AR': 4, 'LA': 4, 'MS': 4,
  'MN': 3, 'IL': 3, 'KS': 3, 'MI': 3, 'MO': 3, 'TN': 3, 'AL': 3, 'GA': 3, 'FL': 3, 'TX': 3, 'IA': 3, 'WI': 3,
  'IN': 2, 'OH': 2, 'WV': 2, 'VA': 2, 'KY': 2, 'NC': 2, 'SC': 2, 'DE': 2, 'MD': 2, 'PA': 2,
  'NY': 1, 'NJ': 1, 'CT': 1, 'MA': 1, 'NH': 1, 'RI': 1, 'ME': 1
};

// Function to validate state abbreviation and get shipping zone
function getShippingZone(state) {
  const upperState = state.toUpperCase();
  return STATE_ZONES[upperState] || 1; // Default to zone 1 if state not found
}

// Function to validate state abbreviation
function validateState(state) {
  return Object.keys(STATE_ZONES).includes(state.toUpperCase());
}

// Function to handle the purchase
function makePurchase() {
  let continueShopping = true;
  const itemsPurchased = [];
  const quantities = [];

  while (continueShopping) {
    // Declare variables
    let item, quantity;

    // Prompt user for item
    item = prompt("What item would you like to add to your cart? Chair, Recliner, Table, or Umbrella?");
    item = item ? item.trim().toLowerCase() : '';

    // Validate item
    const formattedItem = item.charAt(0).toUpperCase() + item.slice(1);
    if (!ITEM_PRICES[formattedItem]) {
      alert("Invalid item. Please try again.");
      continue;
    }

    // Prompt user for quantity
    quantity = parseInt(prompt(`Enter the quantity for ${formattedItem}:`), 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Invalid quantity. Please try again.");
      continue;
    }

    // Add item and quantity to lists
    itemsPurchased.push(formattedItem);
    quantities.push(quantity);

    // Ask if the user wants to add more items
    const response = prompt("Would you like to add another item? (y/n)").toLowerCase();
    if (!['y', 'yes'].includes(response)) {
      continueShopping = false;
    }
  }

  // Get state abbreviation
  let state = prompt("Enter the two-letter state abbreviation for shipping:");
  if (!validateState(state)) {
    alert("Invalid state abbreviation. Please refresh the page and try again.");
    return;
  }

  // Determine shipping zone based on state
  const shippingZone = getShippingZone(state);

  // Calculate totals
  let subtotal = 0;
  let totalItemsHtml = "";

  itemsPurchased.forEach((item, index) => {
    const itemPrice = ITEM_PRICES[item];
    const itemQuantity = quantities[index];
    const itemSubtotal = itemPrice * itemQuantity;
    subtotal += itemSubtotal;
    totalItemsHtml += `
      <tr>
        <td>${item}</td>
        <td>${itemQuantity}</td>
        <td>$${itemPrice.toFixed(2)}</td>
        <td>$${itemSubtotal.toFixed(2)}</td>
      </tr>
    `;
  });

  // Determine shipping cost
  let shippingCost = SHIPPING_COSTS[shippingZone];
  if (subtotal > 100) {
    shippingCost = 0;
  }

  // Calculate tax and total
  const taxRate = 0.15;
  const tax = subtotal * taxRate;
  const total = subtotal + tax + shippingCost;

  // Prepare invoice HTML
  const invoiceHtml = `
    <div id="invoice-details">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Item Total</th>
          </tr>
        </thead>
        <tbody>
          ${totalItemsHtml}
        </tbody>
      </table>
    </div>
    <hr class="invoice-separator">
    <div id="invoice-transaction">
      <p>Shipping to: ${state.toUpperCase()}<br>
      Subtotal: $${subtotal.toFixed(2)}<br>
      Tax (15%): $${tax.toFixed(2)}<br>
      Shipping: $${shippingCost.toFixed(2)}<br>
      Invoice Total: $${total.toFixed(2)}</p>
    </div>
  `;

  // Show the invoice and hide the form
  document.getElementById('invoice-details').innerHTML = invoiceHtml;
  document.getElementById('results').classList.remove('hidden');
  document.getElementById('order-form').classList.add('hidden');

  // Event listener for shop again button
  document.getElementById('shop-again').addEventListener('click', () => {
    document.getElementById('results').classList.add('hidden');
    document.getElementById('order-form').classList.remove('hidden');
  });
}

// Event listener for the purchase button
document.getElementById('make-purchase').addEventListener('click', makePurchase);