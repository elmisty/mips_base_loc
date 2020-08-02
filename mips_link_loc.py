class FET_Node:
    def __init__(self, head, gap, table_size):
        self.head = head
        self.gap = gap
        self.table_size = table_size
        self.next = None

class FET:
    def __init__(self):
        Node = FET_Node(head = None, gap = None, table_size = None)
        self.head = Node
        self.tail = Node

        self.current = None
        self.before = None

        self.num_of_nodes = 0

    def append(self, head = None, gap = None, table_size = None):
        new_FET_Node = FET_Node(head, gap, table_size)
        self.tail.next = new_FET_Node
        self.tail = new_FET_Node

        self.num_of_nodes += 1

    def delete(self):
        if self.current is self.tail:
            self.tail = self.before
        self.before.next = self.current.next
        self.current = self.before

        self.num_of_nodes -= 1

    def first(self):
        if self.num_of_nodes == 0:
            return None
        self.before = self.head
        self.current = self.head.next

        ret_dic = {'head':self.current.head, 'gap':self.current.gap, 'table_size':self.current.table_size}

        return ret_dic

    def next(self):
        if self.current.next == None:
            return None
        self.before = self.current
        self.current = self.current.next

        ret_dic = {'head':self.current.head, 'gap':self.current.gap, 'table_size':self.current.table_size }

        return ret_dic

    def get_node_size(self):
        return self.num_of_nodes
