/**
 * Class representing an inventory management system.
 * @class
 */
class Inventory {
  /**
   * Creates a new Inventory instance with an empty linked list.
   * @constructor
   */
  constructor() {
    this.list = new LinkedList();
  }

  /**
   * Populates the HTML table with inventory data.
   * @param {LinkedList} l - The linked list containing inventory items.
   */
  populate(l) {
    const table = document.getElementById('inventoryTable');

    // Clear existing rows
    while (table.rows.length > 1) {
      table.deleteRow(1);
    }

    // Iterate through the linked list and populate the table
    const iter = new LIterator(l);
    while (iter.hasNext()) {
      const item = iter.next();
      const row = table.insertRow(-1);

      // Add cells for each property
      const cellId = row.insertCell(0);
      const cellName = row.insertCell(1);
      const cellQuantity = row.insertCell(2);
      const cellPrice = row.insertCell(3);
      const cellSupplier = row.insertCell(4);

      // Populate cell content with item properties
      cellId.innerHTML = item.id;
      cellName.innerHTML = item.name;
      cellQuantity.innerHTML = item.quantity;
      cellPrice.innerHTML = item.price;
      cellSupplier.innerHTML = item.supplier;
    }
  }

  /**
   * Adds a new item to the inventory.
   * @param {string} name - The name of the item.
   * @param {number} price - The price of the item.
   * @param {number} quantity - The quantity of the item.
   * @param {string} supplier - The supplier of the item.
   */
  add(name, price, quantity, supplier) {
    const slot = new InventorySlot(id = this.list.size() + 1, name = name, price = price, quantity = quantity, supplier = supplier);
    this.list.add(slot);
  }

  /**
   * Removes an item from the inventory based on its ID.
   * @param {number} id - The ID of the item to be removed.
   */
  remove(id) {
    this.list.remove(id);
    this.populate(this.list);
  }

  /**
   * Searches for items in the inventory based on a search prompt.
   * @param {string} prompt - The search prompt.
   */
  search(prompt) {
    const iter = new LIterator(this.list);
    const newList = new LinkedList();

    while (iter.hasNext()) {
      const node = iter.next();
      if (node.getMatch(prompt)) {
        newList.add(node);
      }
    }

    this.populate(newList)
  }

  /**
   * Sorts the inventory based on a specified field and order.
   * @param {number} field - The field to sort by (1: ID, 2: Name, 3: Price, 4: Quantity, 5: Supplier).
   * @param {boolean} isAscending - The sorting order (true for ascending, false for descending).
   */
  sort(field, isAscending = true) {
    const heap = new Heap(isAscending, (a, b) => {
      if (field === 2) {
        return isAscending ? a.name.localeCompare(b.name) < 0 : a.name.localeCompare(b.name) > 0;
      }
      else if (field === 1) {
        return isAscending ? a.id < b.id : a.id > b.id;
      }
      else if (field === 3) {
        return isAscending ? a.price < b.price : a.price > b.price;
      }
      else if (field === 4) {
        return isAscending ? a.quantity < b.quantity : a.quantity > b.quantity;
      }
      else if (field === 5) {
        return isAscending ? a.supplier < b.supplier : a.supplier > b.supplier;
      }
    });

    const iter = new LIterator(this.list);
    while (iter.hasNext()) {
      const node = iter.next();
      heap.insert(node);
    }

    const sortedList = new LinkedList();
    while (heap.peek() !== null) {
      sortedList.add(heap.pop());
    }

    this.list = sortedList;
    this.populate(this.list)
  }

  /**
   * Calculates the total valuation of the entire inventory.
   * @returns {number} - The total valuation of the inventory.
   */
  getTotalInventoryValuation() {
    let totalValuation = 0;

    // Iterate through the linked list using a for loop
    for (let i = 0; i < this.list.size(); i++) {
      const item = this.list.get(i);
      totalValuation += item.getValue();
    }

    return totalValuation;
  }
}

/**
 * Class representing a slot in the inventory.
 * @class
 */
class InventorySlot {
  /**
   * Creates a new InventorySlot instance with specified properties.
   * @constructor
   * @param {number} id - The ID of the item.
   * @param {string} name - The name of the item.
   * @param {number} price - The price of the item.
   * @param {number} quantity - The quantity of the item.
   * @param {string} supplier - The supplier of the item.
   */
  constructor(id, name, price, quantity, supplier) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.supplier = supplier;
  }

  /**
   * Calculates the valuation of the item.
   * @returns {number} - The valuation of the item (price * quantity).
   */
  getValue() {
    return this.quantity * this.price;
  }

  /**
   * Checks if the item matches a search prompt.
   * @param {string} prompt - The search prompt.
   * @returns {boolean} - True if the item matches the prompt, false otherwise.
   */
  getMatch(prompt) {
    try {
      if (this.id == Number(prompt) || this.price == Number(prompt) || this.quantity == Number(prompt)) {
        return true;
      }
    } catch { }

    if (this.name.toLowerCase().includes(prompt.toLowerCase()) || this.supplier.toLowerCase().includes(prompt.toLowerCase())) {
      return true;
    }

    return false;
  }

  /**
   * Compares the item with another item based on a specified field.
   * @param {InventorySlot} other - The other item to compare.
   * @param {number} field - The field to compare by (1: ID, 2: Name, 3: Price, 4: Quantity, 5: Supplier).
   * @returns {boolean} - True if the current item is greater, false otherwise.
   */
  compare(other, field) {
    switch (field) {
      case 1:
        return other.id < this.id;

      case 2:
        return other.name < this.name;
      case 3:
        return other.price < this.price;
      case 4:
        return other.quantity < this.quantity;
      case 5:
        return other.supplier < this.supplier;
    }
  }
}

/**
 * Redirects to the new item page.
 */
function redirectToNewItemPage() {
  window.location.href = 'addItemPage.html';
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { Inventory, InventorySlot };
}
