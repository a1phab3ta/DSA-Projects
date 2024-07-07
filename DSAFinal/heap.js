/**
 * Class representing the Min/Max Heap Data Structure.
 *
 * @class
 */
class Heap {
    /**
     * Create a new Heap instance.
     *
     * @param {boolean} [minHeap=true] - A boolean flag indicating whether the heap should be a min heap (default) or a max heap.
     * @param {function} [compare] - A custom comparison function used for heapifying elements. If not provided, the default comparison is used.
     * @constructor
     */
    constructor(minHeap = true, compare) {
      
      this.heap = [];
      this.minHeap = minHeap;
      this.compare = compare;
    }
  
    /**
     * Inserts a new element into the heap.
     *
     * @param {*} value - The value to be inserted into the heap.
     */
    insert(value) {
      this.heap.push(value);
      this.heapifyUp();
    }
  
    /**
     * Removes and returns the root element of the heap.
     *
     * @returns {*} - The root element, or `null` if the heap is empty.
     */
    pop() {
      if (this.heap.length === 0) {
        return null; 
      }
  
      const root = this.heap[0];
      const lastElement = this.heap.pop();
  
      if (this.heap.length > 0) {
        this.heap[0] = lastElement;
        this.heapifyDown();
      }
  
      return root;
    }
  
    /**
     * Returns the root element without removing it from the heap.
     *
     * @returns {*} - The root element, or `null` if the heap is empty.
     */
    peek() {
      return this.heap.length > 0 ? this.heap[0] : null;
    }
  
    /**
     * Restores the heap property by moving a node up the heap.
     *
     * @private
     */
    heapifyUp() {
       
      let currentIndex = this.heap.length - 1;
        
      while (currentIndex > 0) {
        const parentIndex = Math.floor((currentIndex - 1) / 2);
        const shouldSwap = this.compare
          ? this.compare(this.heap[currentIndex], this.heap[parentIndex])
          : this.defaultCompare(this.heap[currentIndex], this.heap[parentIndex]);
  
        if (shouldSwap) {
          this.swap(currentIndex, parentIndex);
          currentIndex = parentIndex;
        } else {
          break;
        }
      }
    }
  
    /**
     * Restores the heap property by moving a node down the heap.
     *
     * @private
     */
    heapifyDown() {
      let currentIndex = 0;
  
      while (true) {
        //Decide if there is a child that can be swapped
        const leftChildIndex = 2 * currentIndex + 1;
        const rightChildIndex = 2 * currentIndex + 2;
        let swapIndex = null;
  
        if (leftChildIndex < this.heap.length) {
          if (this.compare
            ? this.compare(this.heap[leftChildIndex], this.heap[currentIndex])
            : this.defaultCompare(this.heap[leftChildIndex], this.heap[currentIndex])
          ) {
            swapIndex = leftChildIndex;
          }
        }
  
        if (rightChildIndex < this.heap.length) {
          if (
            (swapIndex === null && this.compare
              ? this.compare(this.heap[rightChildIndex], this.heap[currentIndex])
              : this.defaultCompare(this.heap[rightChildIndex], this.heap[currentIndex])
            ) ||
            (swapIndex !== null && this.compare
              ? this.compare(this.heap[rightChildIndex], this.heap[leftChildIndex])
              : this.defaultCompare(this.heap[rightChildIndex], this.heap[leftChildIndex])
            )
          ) {
            swapIndex = rightChildIndex;
          }
        }
  
        if (swapIndex === null) {
          break;
        }
  
        this.swap(currentIndex, swapIndex);
        currentIndex = swapIndex;
      }
    }
  
    /**
     * Swaps two elements at indices 'i' and 'j' in the heap array.
     *
     * @private
     */
    swap(i, j) {
      [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }
  
    /**
     * Default comparison function for heapifying elements in ascending order.
     *
     * @private
     */
    defaultCompare(a, b) {
      return a < b;
    }
  }
  
  // Export the class for Node.js environments
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Heap;
  }
  