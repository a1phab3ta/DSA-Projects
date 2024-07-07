import java.util.*;

/**
 * Handles compression and decompression of data
 */
public class Compressor {
  private final char END_OF_FILE = (char) 3;

  /**
   * Compresses a string to bytes
   * Uses standard Huffman Compression
   * 
   * @param str the string to compress
   * @return the compress data
   */
  public byte[] compress(String str) {
    return compress(str, false);
  }

  /**
   * Compresses a string to bytes
   * Uses standard Huffman Compression
   * 
   * @param str         the string to compress
   * @param stopAtTable whether to stop compression after table generation
   * @return the compress data
   */
  public byte[] compress(String str, boolean stopAtTable) {
    StringBuilder sb = new StringBuilder();
    HashMap<Character, Integer> freqTable = createFreqTable(str);
    stopAtTable = false;
    // Stopping at the table shouldn't include the EOF
    if (!stopAtTable) {
      freqTable.put(END_OF_FILE, 1);
      str += END_OF_FILE;
    }
    HuffNode root = createHuffmanTree(freqTable);
    HashMap<Character, String> table = createHuffmanTable(root);
    // Creates a string of all the characters with their encoding
    for (Character c : table.keySet()) {
      String symbol = "" + c;
      if (c == ' ') {
        symbol = "(space)";
      } else if (c == '\t') {
        symbol = "(tab)";
      } else if (c == '\n') {
        symbol = "(enter)";
      } else if (c == END_OF_FILE) {
        symbol = "(EOF)";
      }
      sb.append(symbol + ":" + table.get(c) + "\n");
    }
    // Stop compression at table generation
    if (stopAtTable) {
      return sb.toString().getBytes();
    }
    BitSet encodedTree = new BitSet();
    int tsize = encodeTree(root, encodedTree, 0);
    BitSet encodedMessage = new BitSet();
    int msize = encodeMessage(str, table, encodedMessage);
    // Combine the BitSets into encodedTree
    for (int i = 0; i < msize; i++) {
      encodedTree.set(tsize + i, encodedMessage.get(i));
    }
    return encodedTree.toByteArray();
  }

private int encodeTree(HuffNode node, BitSet bits, int idx) {
if (node.left == null && node.right == null) {
// Encode the ASCII value
bits.set(idx);
int value = (int) node.symbol;
idx++;
for (int i = 0; i < 8; i++) {
if ((value & (1 << i)) != 0) {
bits.set(idx + i);
}
}
idx += 8;
return idx;
}
// Reached an internal node, so clear the bit and continue encoding recursively
bits.clear(idx);
idx++;
idx = encodeTree(node.left, bits, idx);
idx = encodeTree(node.right, bits, idx);
return idx;
}

  private int encodeMessage(String s, Map<Character, String> table, BitSet encoded) {
    // Encode the message using the Huffman encoding table
    int idx = 0;
    for (char c : s.toCharArray()) {
      String code = table.get(c);
      for (char bits : code.toCharArray()) {
        if (bits == '1') {
          encoded.set(idx);
        }
        idx++;
      }
    }
    return idx;
  }

  /**
   * Converts compressed bytes to a String
   * Uses standard Huffman Compression
   * 
   * @param bytes the bytes to decompress
   * @return the string representation
   */
  public String decompress(byte[] bytes) {
    BitSet encoded = BitSet.valueOf(bytes);
    HuffNode root = new HuffNode();
    int idx = decodeTree(encoded, 0, root);
    String message = decodeMessage(encoded, idx + 1, root);
    return message;
  }

  private int decodeTree(BitSet encoded, int idx, HuffNode node) {
    // Decodes the Huffman tree structure from the encoded BitSet
    if (encoded.get(idx)) {
      idx++;
      // Decode the bits into ASCII Value
      int ascii = 0;
      for (int i = 0; i < 8; i++, idx++) {
        if (encoded.get(idx)) {
          ascii |= 1 << (i);
        }
      }
      node.symbol = (char) ascii;
    } else {
      idx++;
      node.left = new HuffNode();
      idx = decodeTree(encoded, idx, node.left);
      node.right = new HuffNode();
      idx = decodeTree(encoded, idx, node.right);
    }
    return idx;
  }

private String decodeMessage(BitSet encoded, int idx, HuffNode root){
//Finds the correct symbols for all the bits in the bitset and adds them to a StringBuilder
StringBuilder sb = new StringBuilder();
HuffNode curr = root;
int s = encoded.size();
for (int i = idx; i < s; i++){
if (encoded.get(i)){
curr = curr.right;
} else {
curr = curr.left;
}
idx++;
if (curr.left == null && curr.right == null){
if (curr.symbol == END_OF_FILE){
return sb.toString();
}
sb.append(curr.symbol);
curr = root;
}
}
return sb.toString();
}

  private HashMap<Character, Integer> createFreqTable(String str) {
    // Adds unique characters with their frequencies to a HashMap
    HashMap<Character, Integer> table = new HashMap<>();
    for (char c : str.toCharArray()) {
      table.put(c, table.getOrDefault(c, 0) + 1);
    }
    return table;
  }

  private HuffNode createHuffmanTree(HashMap<Character, Integer> table) {
    // Sort the list of characters in the heap
    Heap<HuffNode> heap = new Heap<>();
    Heap<Character> sort = new Heap<>();
    for (Character c : table.keySet()) {
      sort.add(c);
    }
    List<Character> sorted = new ArrayList<>();
    while (!sort.isEmpty()) {
      sorted.add(sort.remove());
    }
    for (Character c : sorted) {
      HuffNode node = new HuffNode();
      node.symbol = c;
      node.frequency = table.get(c);
      heap.add(node);
    }
    // Build the Huffman tree
    HuffNode root = null;
    while (!heap.isEmpty()) {
      root = heap.remove();
      if (!heap.isEmpty()) {
        HuffNode right = heap.remove();
        HuffNode parent = new HuffNode();
        parent.frequency = root.frequency + right.frequency;
        parent.left = root;
        parent.right = right;
        heap.add(parent);
      }
    }
    return root;
  }

  private HashMap<Character, String> createHuffmanTable(HuffNode root) {
    HashMap<Character, String> huffTable = new HashMap<>();
    createHuffmanTableHelp(root, "", huffTable);
    return huffTable;
  }

  private static void createHuffmanTableHelp(HuffNode node, String str,
      HashMap<Character, String> table) {
    // Recursively iterates through the tree to create the code for each of the characters
    if (node.symbol != null) {
      table.put(node.symbol, str);
      return;
    }
    createHuffmanTableHelp(node.left, str + "0", table);
    createHuffmanTableHelp(node.right, str + "1", table);
  }

  private class HuffNode implements Comparable<HuffNode> {
    public Character symbol;
    public int frequency;
    public HuffNode left, right;

    public int compareTo(HuffNode other) {
      return this.frequency - other.frequency;
    }
  }
}
