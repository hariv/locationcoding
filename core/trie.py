class TrieNode(object):
    
    def __init__(self, char):
        self.char = char
        self.children = []
        self.word_finished = False
        self.counter = 1
    

def add(root, word):
    node = root
    for char in word:
        found_in_child = False
        for child in node.children:
            if child.char == char:
                child.counter += 1
                node = child
                found_in_child = True
                break
        if not found_in_child:
            new_node = TrieNode(char)
            node.children.append(new_node)
            node = new_node
    node.word_finished = True


def find_prefix(root, prefix):
    node = root
    if not root.children:
        return False, 0
    for char in prefix:
        char_not_found = True
        for child in node.children:
            if child.char == char:
                char_not_found = False
                node = child
                break
        if char_not_found:
            return False, 0
    return True, node.counter

if __name__ == "__main__":
    root = TrieNode('*')
    add(root, "BEGIN OF COUNTY")
    add(root, "GUALALA")
    add(root, "NORTH LIMITS GUALALA")
    add(root, "POINT ARENA SCL")
    add(root, "POINT ARENA NCL")
    add(root, "MANCHESTER")
    add(root, "NORTH LIMITS ELK")
    add(root, "ALBION")
    add(root, "NORTH LIMITS CASPAR")
    add(root, "VIA MAIN ST")

    print(find_prefix(root, "NORTH LIMITS"))
#add(root, "hackathon")
