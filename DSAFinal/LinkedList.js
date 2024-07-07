/**
 * Class representing a linked list data structure.
 * @class
 */
class LinkedList {
    /**
     * Creates a new LinkedList instance with an empty list.
     * @constructor
     */
    constructor() {
      this.head = null;
      this.tail = null;
      this.sizeVal = 0;
    }
  
    /**
     * Gets the size of the linked list.
     * @returns {number} - The size of the linked list.
     */
    size() {
      return this.sizeVal;
    }
  
    /**
     * Adds a new node with the provided data to the end of the linked list.
     * @param {*} data - The data to be added to the linked list.
     */
    add(data) {
      const node = new LNode(data);
  
      if (this.head === null) {
        // If the list is empty, set both head and tail to the new node
        this.head = node;
        this.tail = node;
      } else {
        // If the list is not empty, append the new node to the tail
        this.tail.next = node;
        this.tail = node;
      }
  
      this.sizeVal++;
    }
  
    /**
     * Removes the node at the specified index from the linked list.
     * @param {number} index - The index of the node to be removed.
     * @returns {*} - The data of the removed node.
     */
    remove(index) {
      if (index < 0 || index >= this.sizeVal) {
        return null;
      }
  
      let prev = null;
      let toRemove = this.head;
      for (let i = 0; i < index; i++) {
        prev = toRemove;
        toRemove = toRemove.next;
      }
  
      if (prev === null) {
        this.head = toRemove.next;
      } else {
        prev.next = toRemove.next;
      }
  
      if (toRemove === this.tail) {
        this.tail = prev;
      }
  
      toRemove.next = null;
      this.sizeVal--;
      return toRemove.data;
    }
  
    /**
     * Gets the data of the node at the specified index in the linked list.
     * @param {number} index - The index of the node to get the data from.
     * @returns {*} - The data of the node at the specified index.
     */
    get(index) {
      if (index < 0 || index >= this.sizeVal) {
        return null;
      }
      let curr = this.head; 
      for (let i = 0; i < index; i++) {
        curr = curr.next;
      }
      return curr.data;
    }
  
    /**
     * Inserts a new node with the provided data at the specified index in the linked list.
     * @param {*} data - The data to be inserted into the linked list.
     * @param {number} index - The index at which to insert the new node.
     */
    insert(data, index) {
      if (index < 0 || index > this.sizeVal) {
        return null;
      }
      const node = new LNode(data);
      if (index === this.sizeVal) {
        this.add(data);
        return;
      }
      let curr = this.head;
  
      // Check if the list is empty or if the index is 0
      if (index === 0 || curr === null) {
        node.next = curr;
        this.head = node;
        this.sizeVal++;
        return;
      }
  
      for (let i = 0; i < index - 1; i++) {
        if (curr === null) {
          return null;
        }
        curr = curr.next;
      }
  
      // Check if curr is not null before accessing its next property
      if (curr !== null) {
        node.next = curr.next;
        curr.next = node;
        this.sizeVal++;
      }
    }
  }
  
  /**
   * Class representing a node in a linked list.
   * @class
   */
  class LNode {
    /**
     * Creates a new LNode instance with the provided data.
     * @constructor
     * @param {*} data - The data to be stored in the node.
     */
    constructor(data) {
      this.data = data;
      this.next = null;
    }
  }
  
  /**
   * Class representing an iterator for a linked list.
   * @class
   */
  class LIterator {
    /**
     * Creates a new LIterator instance for the provided linked list.
     * @constructor
     * @param {LinkedList} linkedList - The linked list to iterate over.
     */
    constructor(linkedList) {
      this.curr = linkedList.head;
    }
  
    /**
     * Checks if there is a next node in the iteration.
     * @returns {boolean} - True if there is a next node, false otherwise.
     */
    hasNext() {
      return this.curr !== null;
    }
  
    /**
     * Gets the data of the next node in the iteration.
     * @returns {*} - The data of the next node.
     */
    next() {
      const data = this.curr.data;
      this.curr = this.curr.next;
      return data;
    }
  
    /**
     * Resets the iterator to the beginning of the linked list.
     * @param {LinkedList} linkedList - The linked list to reset the iterator for.
     */
    reset(linkedList) {
      this.curr = linkedList.head;
    }
  }
  
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { LinkedList, LNode, LIterator };
  }
  