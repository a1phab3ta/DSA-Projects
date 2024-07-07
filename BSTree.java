import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public class BSTree<T extends Comparable<T>> {
  private BSTNode<T> root;
  private Comparator<? super T> comparator;

  private class BSTNode<T extends Comparable<T>> {
    private BSTNode<T> left;
    private BSTNode<T> right;
    public T data;

    public BSTNode(T data) {
      this.left = null;
      this.right = null;
      this.data = data;
    }
  }

  // Creates new empty binary search tree
  public BSTree() {
    this(null);
  }

  public BSTree(Comparator<? super T> comp) {
    if (comp == null) {
      this.comparator = new NaturalOrdering<>();
    } else {
      this.comparator = comp;
    }
  }

  /**
   * Adds data to the tree
   * 
   * @param data - the data to add to the tree
   */
  public void add(T data) {
    root = addHelper(root, data);
  }

  private BSTNode<T> addHelper(BSTNode<T> node, T data) {
    if (node == null) {
      return new BSTNode<>(data);
    }
    int comparison = data.compareTo(node.data);
    // Adds to the correct part in the tree
    if (comparison < 0) {
      node.left = addHelper(node.left, data);
    } else if (comparison > 0) {
      node.right = addHelper(node.right, data);
    }
    return node;
  }

  /**
   * Clears the tree
   */
  public void clear() {
    root = null;
  }

  /**
   * Removes all instances of data from the tree
   * 
   * @param data - the data to be removed
   */
  public void removeAll(T data) {
    // Checks how many times data is present
    List<T> traversal = this.preOrder();
    int c = 0;
    for (T i : traversal) {
      if (i.equals(data)) {
        c++;
      }
    }
    for (int i = 0; i < c; i++) {
      remove(data);
    }
  }

  /**
   * Removes one instance of data from the tree
   * 
   * @param data the data to remove
   * @return boolean - whether the removal was successful
   */
  public boolean remove(T data) {
    if (root == null) {
      return false;
    }
    BSTNode<T> parent = null;
    BSTNode<T> me = root;
    // Find the correct node and its parent
    while (me != null) {
      int comp = comparator.compare(me.data, data);
      if (comp != 0) {
        parent = me;
        if (comp < 0) {
          me = me.right;
        } else {
          me = me.left;
        }
      } else {
        removeNode(parent, me);
        return true;
      }
    }
    return false;
  }

  private boolean removeNode(BSTNode<T> parent, BSTNode<T> child) {
    // Replaces the node with the correct one
    if (child.left == null || child.right == null) {
      BSTNode<T> here = child.left;
      if (here == null) {
        here = child.right;
      }
      if (parent == null) {
        root = here;
      } else {
        if (parent.left == child) {
          parent.left = here;
        } else {
          parent.right = here;
        }
      }
    } else {
      BSTNode<T> rp = child;
      BSTNode<T> rc = child.left;
      while (rc.right != null) {
        rp = rc;
        rc = rc.right;
      }
      child.data = rc.data;
      removeNode(rp, rc);
    }
    return true;
  }

  /**
   * Returns a pre-order traversal of the tree
   * 
   * @return List<T> a preorder traversal of the tree
   */
  public List<T> preOrder() {
    ArrayList<T> nodes = new ArrayList<>();
    preOrderHelper(root, nodes);
    return nodes;
  }

  private void preOrderHelper(BSTNode<T> curr, List<T> list) {
    // Recursively appends correct node to the list
    if (!(curr == null)) {
      list.add(curr.data);
      preOrderHelper(curr.left, list);
      preOrderHelper(curr.right, list);
    }
  }

  /**
   * Returns an in-order traversal of the tree
   * 
   * @return List<T> an in-order traversal of the tree
   */
  public List<T> inOrder() {
    ArrayList<T> nodes = new ArrayList<>();
    inOrderHelper(root, nodes);
    return nodes;
  }

  private void inOrderHelper(BSTNode<T> curr, List<T> list) {
    if (curr != null) {
      // Recursively appends correct node to the list
      inOrderHelper(curr.left, list);
      list.add(curr.data);
      inOrderHelper(curr.right, list);
    }
  }

  /**
   * Returns a post-order traversal of the tree
   * 
   * @return List<T> a post-order traversal of the tree
   */
  public List<T> postOrder() {
    ArrayList<T> nodes = new ArrayList<>();
    postOrderHelper(root, nodes);
    return nodes;
  }

  private void postOrderHelper(BSTNode<T> curr, List<T> list) {
    if (curr != null) {
      // Recursively appends correct node to the list
      postOrderHelper(curr.left, list);
      postOrderHelper(curr.right, list);
      list.add(curr.data);
    }
  }

  private class NaturalOrdering<T extends Comparable<T>> implements
      Comparator<T> {
    @Override
    public int compare(T left, T right) {
      return left.compareTo(right);
    }
  }
}
// import static org.junit.jupiter.api.Assertions.assertEquals;

// import org.junit.jupiter.api.Test;

public class Main {
  public static void main(String[] args) {
    System.out.println("Hello world!");
  }

  // @Test
  // void addition() {
  // assertEquals(2, 1 + 1);
  // }
}
