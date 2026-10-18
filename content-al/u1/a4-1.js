/* 4.1 Relational databases, 4.2 Data structures, 4.3 Abstract data types */
L("a4-1",[
{slug:"erm",title:"The entity-relationship model",covers:[1],
 v:[["Entity","A thing about which data is stored, such as Student or Course. Becomes a table."],
  ["Attribute","A property of an entity, such as StudentID or Surname. Becomes a column."],
  ["Primary key","An attribute (or attributes) that uniquely identifies each record in a table."],
  ["Foreign key","An attribute in one table that is the primary key of another table, used to link them."],
  ["Composite key","A primary key made from two or more attributes together."],
  ["Relationship","A link between two entities: one-to-one (1:1), one-to-many (1:M) or many-to-many (M:M)."],
  ["Entity-relationship diagram (ERD)","A diagram showing entities as rectangles and relationships as lines, with crow's feet at the 'many' ends."],
  ["Parenthetical notation","Writing an entity as Name(Attribute1, Attribute2, …) with the primary key underlined and foreign keys marked."]],
 q:[["What does a primary key do?","Uniquely identifies each record","Links to another table","Stores the date a record was made","Sorts the table"],
  ["A student takes many courses and a course has many students. What is the relationship?","Many-to-many","One-to-one","One-to-many","None"],
  ["What is a foreign key?","A primary key from another table, used to link the tables","A key made of two attributes","A key that is always a number","An encryption key"],
  ["How is a many-to-many relationship put into a relational database?","With a link table that has two one-to-many relationships","With one big table","With two primary keys in each table","It can't be"]],
 acts:[{id:"act1",title:"Activity 1",desc:"ERDs and keys · 8 questions",gen:"bank",bank:"al-erm",explain:"Questions on entities, keys and relationships, and on reading ERDs and parenthetical notation. Every try picks a different set."}]},
{slug:"schema",title:"Logical schema and integrity",covers:[2],
 v:[["Logical schema","A description of a database's structure: its tables, the attributes of each, their data types, keys and constraints."],
  ["Table (relation)","A set of records about one entity, arranged in rows and columns."],
  ["Row (tuple)","One record in a table."],
  ["Column (attribute)","One field in a table, holding the same kind of data for every record."],
  ["Entity integrity","Every table has a primary key, and each primary key value is unique and not empty (null)."],
  ["Referential integrity","Every foreign key value matches an existing primary key value in the linked table."],
  ["Domain integrity","Every value in a column is of the right data type and within the allowed range or set of values."]],
 q:[["Another word for a row in a table is…","tuple","attribute","domain","relation"],
  ["An order refers to CustomerID 99, but there is no customer 99. Which integrity rule is broken?","Referential integrity","Entity integrity","Domain integrity","None"],
  ["Two students have the same StudentID. Which integrity rule is broken?","Entity integrity","Referential integrity","Domain integrity","None"],
  ["A Mark column holds −5, but marks must be 0 to 100. Which integrity rule is broken?","Domain integrity","Entity integrity","Referential integrity","None"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Schema and integrity · 8 questions",gen:"bank",bank:"al-schema",explain:"Questions on tables, tuples, data types and the three integrity rules. Every try picks a different set."}]}]);

L("a4-2",[
{slug:"lists",title:"Arrays, lists and records",covers:[1],
 v:[["Data structure","A way of organising related data so it can be stored and used efficiently."],
  ["Array","An ordered collection of items of the same data type, accessed by index. In Python, a list of one type is used."],
  ["List","An ordered, changeable collection of items, accessed by index starting at 0."],
  ["Index","The position of an item in an array or list; the first item is at index 0."],
  ["Two-dimensional array","An array of arrays, accessed with two indexes such as grid[row][col]."],
  ["Record","A collection of related fields that can be different data types; in Python, a list of mixed values."],
  ["Traverse","Visit every item in a data structure in turn, usually with a loop."]],
 q:[["names = ['Ali', 'Bo', 'Cy']. What is names[1]?","'Bo'","'Ali'","'Cy'","An error"],
  ["grid = [[1, 2], [3, 4]]. What is grid[1][0]?","3","2","1","4"],
  ["What is the index of the last item in a list of 10 items?","9","10","1","−10"],
  ["Which is best described as a record?","['Ana', 16, True]","[3, 7, 9, 12]","{'a', 'b'}","'hello'"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Lists and arrays · 8 questions",gen:"bank",bank:"al-lists",explain:"Read Python that uses lists and 2D arrays and work out what it prints. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Lists · 3 tasks",type:"py",explain:"Write short Python programs that traverse lists and 2D lists. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Total and largest",brief:"The list <span class='mono'>scores</span> holds test scores. Print the <b>total</b> of the scores on one line and the <b>largest</b> score on the next. Use a loop rather than <span class='mono'>sum()</span> or <span class='mono'>max()</span>.",
     starter:"scores = [12, 45, 7, 33, 28]\ntotal = 0\nlargest = scores[0]\n# your loop here\n\nprint(total)\nprint(largest)",
     tests:[{name:"prints 125 then 45",stdin:[],expect:"125\n45"},{name:"uses a loop",py:"assert 'for ' in __code__ or 'while ' in __code__"}],
     hint:"Inside a for loop, add each score to total, and if it is bigger than largest, store it in largest.",
     solution:"scores = [12, 45, 7, 33, 28]\ntotal = 0\nlargest = scores[0]\nfor s in scores:\n    total = total + s\n    if s > largest:\n        largest = s\nprint(total)\nprint(largest)"},
    {title:"Row totals",brief:"<span class='mono'>grid</span> is a 2D list. Print the total of each <b>row</b>, one per line.",
     starter:"grid = [[3, 1, 4],\n        [1, 5, 9],\n        [2, 6, 5]]\n",
     tests:[{name:"prints 8, 15 and 13",stdin:[],expect:"8\n15\n13"}],
     hint:"Loop over grid with for row in grid, then add up the items in row.",
     solution:"grid = [[3, 1, 4],\n        [1, 5, 9],\n        [2, 6, 5]]\nfor row in grid:\n    t = 0\n    for x in row:\n        t = t + x\n    print(t)"},
    {title:"Find a student",brief:"Each record in <span class='mono'>students</span> is [name, age]. Ask for a name with <span class='mono'>input()</span> and print that student's age, or <span class='mono'>Not found</span>.",
     starter:"students = [[\"Ana\", 17], [\"Ben\", 16], [\"Cai\", 18]]\nname = input(\"Name: \")\n",
     tests:[{name:"Ben gives 16",stdin:["Ben"],expect:"16"},{name:"Cai gives 18",stdin:["Cai"],expect:"18"},{name:"Dee gives Not found",stdin:["Dee"],expect:"Not found"}],
     hint:"Use a flag variable found = False, loop through the records and compare record[0] with name.",
     solution:"students = [[\"Ana\", 17], [\"Ben\", 16], [\"Cai\", 18]]\nname = input(\"Name: \")\nfound = False\nfor record in students:\n    if record[0] == name:\n        print(record[1])\n        found = True\nif not found:\n    print(\"Not found\")"}]}]},
{slug:"collections",title:"Dictionaries, tuples and sets",covers:[1],
 v:[["Dictionary","An unordered collection of key: value pairs; each value is looked up by its unique key."],
  ["Key (dictionary)","The unique identifier used to look up a value in a dictionary."],
  ["Tuple","An ordered collection that is immutable: its items can't be changed after it is made."],
  ["Immutable","Cannot be changed once created."],
  ["Set","An unordered collection with no duplicate items, supporting union, intersection and difference."],
  ["Union","All the items that are in either set (or both)."],
  ["Intersection","Only the items that are in both sets."],
  ["Difference","The items in the first set that are not in the second."]],
 q:[["ages = {'Ana': 17, 'Ben': 16}. What is ages['Ben']?","16","17","'Ben'","An error"],
  ["What is special about a tuple?","It can't be changed after it's created","It has no order","It can't hold numbers","It removes duplicates"],
  ["What is len({3, 1, 3, 2, 1})?","3","5","2","An error"],
  ["{1, 2, 3} & {2, 3, 4} gives…","{2, 3}","{1, 2, 3, 4}","{1, 4}","{1}"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Collections · 8 questions",gen:"bank",bank:"al-collections",explain:"Read Python that uses dictionaries, tuples and sets and work out what it prints. Every try picks a different set."}]}]);

L("a4-3",[
{slug:"stacks",title:"Stacks",covers:[1],
 v:[["Abstract data type (ADT)","A data type described by what it does (its operations), not how it's built."],
  ["Stack","A last in, first out (LIFO) structure: items are added and removed at the top only."],
  ["Push","Add an item to the top of a stack."],
  ["Pop","Remove and return the item at the top of a stack."],
  ["Peek","Look at the top item without removing it."],
  ["Top pointer","Shows the position of the top item of the stack."],
  ["Stack overflow","Trying to push onto a full stack."],
  ["Stack underflow","Trying to pop from an empty stack."]],
 q:[["A stack is…","last in, first out","first in, first out","sorted","random access"],
  ["push(3), push(8), pop(), push(5). What is on top?","5","8","3","Nothing"],
  ["What is stack underflow?","Popping from an empty stack","Pushing onto a full stack","A stack with one item","A sorted stack"],
  ["Which is a use of a stack?","Storing return addresses for subroutine calls","Printer queues","Buffering keyboard input in order","Scheduling with round robin"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Stacks and queues · 8 questions",gen:"alstack",type:"mixed",explain:"Trace push, pop, enqueue and dequeue operations. A stack is last in, first out; a queue is first in, first out. New operations every try."}]},
{slug:"queues",title:"Queues",covers:[2],
 v:[["Queue","A first in, first out (FIFO) structure: items join at the rear and leave from the front."],
  ["Enqueue","Add an item to the rear of a queue."],
  ["Dequeue","Remove and return the item at the front of a queue."],
  ["Front pointer","Shows the position of the item that will be removed next."],
  ["Rear pointer","Shows the position of the last item added."],
  ["Linear queue","A queue in a fixed-length array where the front moves along, so freed spaces at the start aren't reused."],
  ["Circular queue","A queue in a fixed-length array where the pointers wrap round to the start, so freed spaces are reused."]],
 q:[["A queue is…","first in, first out","last in, first out","sorted","random access"],
  ["enqueue(4), enqueue(9), dequeue(), enqueue(2). Which item is at the front?","9","4","2","Nothing"],
  ["Which is a use of a queue?","Print jobs waiting for a printer","Undo in a word processor","Return addresses for subroutines","Reversing a string"],
  ["What problem does a circular queue solve?","Spaces freed at the front of a linear queue can't be reused","Queues can't hold numbers","Stacks can't be searched","Items leave in the wrong order"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Queues quiz · 8 questions",gen:"bank",bank:"al-queues",explain:"Questions on queues and stacks, including tracing pointers and reading Python. Every try picks a different set."}]}]);

B("al-erm",[
 {t:"mc",q:"Which would make the best primary key for a Student table?",a:"StudentID",w:["Surname","DateOfBirth","Form"]},
 {t:"mc",q:"Why is Surname a poor primary key?",a:"Two students can share a surname",w:["Surnames are too long","Surnames can't be stored as text","Surnames change every year"]},
 {t:"mc",q:"A customer can place many orders; each order is for one customer. What is the relationship?",a:"One-to-many",w:["One-to-one","Many-to-many","Many-to-one from customer to order"]},
 {t:"mc",q:"Each country has exactly one capital city, and each capital belongs to one country. What is the relationship?",a:"One-to-one",w:["One-to-many","Many-to-many","There isn't one"]},
 {t:"mc",q:"In an ERD, where is the crow's foot drawn in a 1:M relationship?",a:"At the 'many' end",w:["At the 'one' end","At both ends","Nowhere"]},
 {t:"mc",q:"In a 1:M relationship between Customer and Order, which table holds the foreign key?",a:"Order",w:["Customer","Both","Neither"]},
 {t:"mc",q:"Enrolment(StudentID, CourseID, DateJoined) has the key (StudentID, CourseID). What kind of key is it?",a:"A composite key",w:["A foreign key only","A secondary key","An index"]},
 {t:"mc",q:"Student and Course have a many-to-many relationship. What is the usual fix?",a:"Add a link entity, e.g. Enrolment, with 1:M from each",w:["Merge them into one table","Give each table two primary keys","Store a list of courses in one field"]},
 {t:"mc",q:"In parenthetical notation, how is the primary key shown?",a:"Underlined",w:["In capitals","In brackets","With a star"]},
 {t:"mc",q:"Order(OrderID, OrderDate, CustomerID*). What does the * mark?",a:"A foreign key",w:["The primary key","A composite key","A required field"]},
 {t:"blank",q:"A key made from two or more attributes is a ___ key.",a:["composite"]},
 {t:"blank",q:"A thing about which data is stored, such as Student, is called an ___.",a:["entity"]}]);

B("al-schema",[
 {t:"mc",q:"Which data type suits a Price column?",a:"Real (decimal)",w:["Integer","Boolean","Character"]},
 {t:"mc",q:"Which data type suits a PhoneNumber column?",a:"Text (string), to keep leading zeros and spaces",w:["Integer","Real","Boolean"]},
 {t:"mc",q:"Which data type suits a column showing whether a book is on loan?",a:"Boolean",w:["Integer","Text","Date"]},
 {t:"mc",q:"What does a logical schema describe?",a:"The tables, attributes, data types, keys and constraints",w:["Where the database files are on disk","The colours of the user interface","How fast the server is"]},
 {t:"mc",q:"Which of these enforces entity integrity?",a:"Primary key values must be unique and not null",w:["Foreign keys must match a primary key","Ages must be between 11 and 19","Every column needs a default"]},
 {t:"mc",q:"A customer with orders is deleted, leaving orders linked to no one. Which rule was broken?",a:"Referential integrity",w:["Entity integrity","Domain integrity","Data type integrity"]},
 {t:"mc",q:"A Grade column may only contain A, B, C, D, E or U. Which rule does this enforce?",a:"Domain integrity",w:["Entity integrity","Referential integrity","None"]},
 {t:"mc",q:"Why keep data in several linked tables rather than one big table?",a:"Less repeated data, so fewer inconsistencies",w:["It's always faster to type","One table can't hold text","Linked tables can't be searched"]},
 {t:"mc",q:"How many tuples does a table with 5 columns and 30 records have?",a:"30",w:["5","150","35"]},
 {t:"mc",q:"Which is another name for a table?",a:"Relation",w:["Tuple","Domain","Key"]},
 {t:"blank",q:"The rule that every foreign key value must match an existing primary key is ___ integrity.",a:["referential"]},
 {t:"blank",q:"A column in a table is also called an ___.",a:["attribute","field"]}]);

B("al-lists",[
 {t:"mc",html:`<pre class="pc py">nums = [5, 8, 2, 9]
print(nums[-1] + nums[0])</pre>`,q:"What is printed?",a:"14",w:["7","13","An error"]},
 {t:"mc",html:`<pre class="pc py">nums = [5, 8, 2]
nums.append(4)
nums.insert(0, 1)
print(nums)</pre>`,q:"What is printed?",a:"[1, 5, 8, 2, 4]",w:["[5, 8, 2, 4, 1]","[1, 8, 2, 4]","[5, 1, 8, 2, 4]"]},
 {t:"mc",html:`<pre class="pc py">nums = [5, 8, 2, 9]
x = nums.pop()
print(x, len(nums))</pre>`,q:"What is printed?",a:"9 3",w:["5 3","9 4","2 3"]},
 {t:"mc",html:`<pre class="pc py">nums = [4, 7, 1]
del nums[1]
print(nums)</pre>`,q:"What is printed?",a:"[4, 1]",w:["[7, 1]","[4, 7]","[1]"]},
 {t:"mc",html:`<pre class="pc py">grid = [[1, 2, 3],
        [4, 5, 6]]
print(grid[1][2])</pre>`,q:"What is printed?",a:"6",w:["2","5","4"]},
 {t:"mc",html:`<pre class="pc py">grid = [[1, 2, 3],
        [4, 5, 6]]
print(len(grid), len(grid[0]))</pre>`,q:"What is printed?",a:"2 3",w:["3 2","6 6","2 6"]},
 {t:"mc",html:`<pre class="pc py">total = 0
for row in [[1, 2], [3, 4], [5, 6]]:
    total = total + row[1]
print(total)</pre>`,q:"What is printed?",a:"12",w:["9","21","6"]},
 {t:"mc",html:`<pre class="pc py">nums = [3, 6, 9]
for i in range(len(nums)):
    nums[i] = nums[i] * 2
print(nums)</pre>`,q:"What is printed?",a:"[6, 12, 18]",w:["[3, 6, 9]","[3, 6, 9, 3, 6, 9]","An error"]},
 {t:"mc",html:`<pre class="pc py">pupil = ["Ana", 17, True]
print(type(pupil[1]))</pre>`,q:"What is printed?",a:"&lt;class 'int'&gt;",w:["&lt;class 'str'&gt;","&lt;class 'list'&gt;","&lt;class 'bool'&gt;"]},
 {t:"mc",q:"Why should an array hold items of only one data type?",a:"So every item can be processed the same way",w:["Python won't allow mixed types","It uses less memory than a record","It can then be sorted alphabetically"]},
 {t:"mc",html:`<pre class="pc py">seats = [[0] * 3 for _ in range(2)]
seats[1][0] = 1
print(seats)</pre>`,q:"What is printed?",a:"[[0, 0, 0], [1, 0, 0]]",w:["[[1, 0, 0], [0, 0, 0]]","[[0, 1, 0], [0, 0, 0]]","[[0, 0, 0], [0, 1, 0]]"]},
 {t:"blank",q:"In Python, the first item of a list is at index ___.",a:["0","zero"]}]);

B("al-collections",[
 {t:"mc",html:`<pre class="pc py">stock = {"pen": 12, "ruler": 5}
stock["pen"] = stock["pen"] - 2
stock["rubber"] = 8
print(len(stock), stock["pen"])</pre>`,q:"What is printed?",a:"3 10",w:["2 10","3 12","2 12"]},
 {t:"mc",html:`<pre class="pc py">ages = {"Ana": 17, "Ben": 16}
print(ages.get("Cai", 0))</pre>`,q:"What is printed?",a:"0",w:["None","An error","17"]},
 {t:"mc",html:`<pre class="pc py">ages = {"Ana": 17, "Ben": 16}
print(ages["Cai"])</pre>`,q:"What happens?",a:"A KeyError",w:["0 is printed","None is printed","An IndexError"]},
 {t:"mc",html:`<pre class="pc py">ages = {"Ana": 17, "Ben": 16, "Cai": 18}
for name, age in ages.items():
    if age &gt; 16:
        print(name)</pre>`,q:"What is printed?",a:"Ana and Cai, on separate lines",w:["Ben","17 and 18","Ana, Ben and Cai"]},
 {t:"mc",html:`<pre class="pc py">point = (3, 4)
point[0] = 5</pre>`,q:"What happens?",a:"A TypeError, because tuples are immutable",w:["point becomes (5, 4)","point becomes (5, 3, 4)","Nothing"]},
 {t:"mc",html:`<pre class="pc py">a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a | b)</pre>`,q:"What is printed?",a:"{1, 2, 3, 4, 5}",w:["{3, 4}","{1, 2}","{5}"]},
 {t:"mc",html:`<pre class="pc py">a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a - b)</pre>`,q:"What is printed?",a:"{1, 2}",w:["{5}","{3, 4}","{1, 2, 5}"]},
 {t:"mc",html:`<pre class="pc py">a = {1, 2, 3, 4}
b = {3, 4, 5}
print(a ^ b)</pre>`,q:"What is printed?",a:"{1, 2, 5}",w:["{3, 4}","{1, 2, 3, 4, 5}","{1, 2}"]},
 {t:"mc",html:`<pre class="pc py">tags = set()
for t in ["red", "blue", "red", "green", "blue"]:
    tags.add(t)
print(len(tags))</pre>`,q:"What is printed?",a:"3",w:["5","2","1"]},
 {t:"mc",q:"Which structure should store a fixed (x, y) coordinate that must not change?",a:"Tuple",w:["Set","Dictionary","List"]},
 {t:"mc",q:"Which structure gives the fastest way to look up a student's mark by their name?",a:"Dictionary",w:["List of names","Tuple","Set"]},
 {t:"mc",q:"Which structure is best for checking whether an email address has already signed up?",a:"Set",w:["Tuple","Two-dimensional list","Record"]}]);

B("al-queues",[
 {t:"mc",q:"A queue holds 4, 9, 2 (front first). Which is removed by dequeue()?",a:"4",w:["2","9","All of them"]},
 {t:"mc",q:"A stack holds 4, 9, 2 (bottom first). Which is removed by pop()?",a:"2",w:["4","9","All of them"]},
 {t:"mc",q:"Which pointer changes when an item is enqueued?",a:"Rear",w:["Front","Top","None"]},
 {t:"mc",q:"Which pointer changes when an item is dequeued?",a:"Front",w:["Rear","Top","None"]},
 {t:"mc",q:"A linear queue in an array of 5 has had 5 items added and 2 removed. Can another item be added?",a:"No: the rear has reached the end, even though there are free spaces",w:["Yes: there are 2 free spaces","Yes: it overwrites the front","No: it's full of 5 items"]},
 {t:"mc",q:"In a circular queue of size 5, the rear is at index 4. Where does the next item go (if there's space)?",a:"Index 0",w:["Index 5","Index 3","It can't be added"]},
 {t:"mc",q:"How do you search a queue for an item without changing it?",a:"Check each item from front to rear in turn",w:["Dequeue items until it's found","Use a binary search","Pop items off the top"]},
 {t:"mc",q:"A keyboard buffer stores key presses until a program reads them. Which structure should it use?",a:"Queue, so keys are read in the order pressed",w:["Stack","Set","Dictionary"]},
 {t:"mc",q:"Which structure would reverse the letters of a word?",a:"Stack: push each letter, then pop them all",w:["Queue","Set","Tuple"]},
 {t:"mc",html:`<pre class="pc py">from collections import deque
q = deque()
q.append("A"); q.append("B"); q.append("C")
q.popleft()
q.append("D")
print(list(q))</pre>`,q:"What is printed?",a:"['B', 'C', 'D']",w:["['A', 'B', 'C']","['D', 'C', 'B']","['A', 'B', 'D']"]},
 {t:"mc",html:`<pre class="pc py">stack = []
for ch in "CAB":
    stack.append(ch)
out = ""
while stack:
    out = out + stack.pop()
print(out)</pre>`,q:"What is printed?",a:"BAC",w:["CAB","ABC","CBA"]},
 {t:"blank",q:"A queue is first in, first ___.",a:["out"]}]);

P("a4-1-erm",`Entity | Becomes a table
Attribute | Becomes a column
Primary key | Unique for each record
Foreign key | Links to another table
Composite key | Two or more attributes
1:1 | One-to-one
1:M | One-to-many
M:M | Many-to-many
Crow's foot | The many end
Fix for M:M | A link entity
Entity on an ERD | Rectangle
Line with no crow's feet | 1:1 on an ERD
Crow's feet at both ends | M:M on an ERD
Link table key | Often composite
Foreign key goes on | The many side
Primary key in notation | Underlined
Parenthetical notation | Name(attributes)
Good primary key | StudentID`);

P("a4-1-schema",`Logical schema | Structure of the database
Table | Relation
Row | Tuple
Column | Attribute
Entity integrity | Unique, non-null key
Referential integrity | Foreign keys must match
Domain integrity | Values in allowed range
Duplicate StudentID | Breaks entity integrity
Order for no customer | Breaks referential integrity
Mark of −5 | Breaks domain integrity
Price | Real
Quantity | Integer
OnLoan | Boolean
PhoneNumber | Text
Null | No value
Linked tables | Less repeated data
Data redundancy | Same data stored twice
Inconsistency | Copies that disagree`);

P("a4-2-lists",`Array | Same type, indexed
List | Ordered and changeable
First index | 0
Last index of 10 items | 9
nums[-1] | Last item
append(x) | Adds to the end
insert(0, x) | Adds at the front
pop() | Removes the last item
del nums[i] | Deletes item i
len(nums) | Number of items
grid[r][c] | Row r, column c
2D array | An array of arrays
Record | Mixed-type fields
['Ana', 17, True] | A record
Traverse | Visit every item
for x in nums | Loop over items
range(len(nums)) | Loop over indexes
Ragged list | Rows of different lengths`);

P("a4-2-collections",`Dictionary | Key: value pairs
Look up by | Key
d.get(k, 0) | Default if missing
d["missing"] | KeyError
d.items() | Key, value pairs
Tuple | Immutable sequence
Immutable | Can't be changed
Changing a tuple | TypeError
Set | No duplicates
a.union(b) | All items in either
a & b | Intersection
a - b | Difference
a ^ b | Symmetric difference
{1, 2} & {2, 3} | {2}
s.add(x) | Puts x in the set
x in s | Membership test
Best for fast look-up | Use a dictionary
Fixed coordinates | Use a tuple`);

P("a4-3-stacks",`Stack | One open end, the top
LIFO | Last in, first out
Push | Add to the top
Pop | Remove from the top
Peek | Look without removing
Top pointer | Points to the top item
Stack overflow | Push onto a full stack
Stack underflow | Pop from an empty stack
Empty stack top | −1 (or 0)
Undo button | Uses a stack
Return addresses | Stored on a stack
Reverse a string | Push then pop
Abstract data type | Defined by operations
push 3, push 8, pop | Returns 8
Python push | list.append(x)
Python pop | list.pop()
IsEmpty | No items left
IsFull | No space left`);

P("a4-3-queues",`Queue | Join rear, leave front
FIFO | First in, first out
Enqueue | Add at the rear
Dequeue | Remove from the front
Front pointer | Next item to leave
Rear pointer | Last item added
Linear queue | Spaces not reused
Circular queue | Pointers wrap round
Wrap round with | Modulo (%)
Print jobs | Wait in a queue
Keyboard buffer | A queue
Enqueue 4, 9, dequeue | Returns 4
Python queue | collections.deque
deque.popleft() | Removes the front item
Queue overflow | Enqueue when full
Queue underflow | Dequeue when empty
Search a queue | Front to rear
Size of queue | Number of items`);
