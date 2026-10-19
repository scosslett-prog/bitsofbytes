/* 8.1 Data types and structures, 8.2 Data handling methods */
L("a8-1",[
{slug:"types",title:"Data types and conversion",covers:[1],
 v:[["Integer (int)","A whole number, positive, negative or zero, e.g. 42."],
  ["Real (float)","A number with a fractional part, e.g. 3.75."],
  ["Character","A single letter, digit or symbol. Python stores it as a string of length 1."],
  ["String (str)","A sequence of characters, e.g. \"Hello\"."],
  ["Boolean (bool)","A value that is either True or False."],
  ["Type conversion (casting)","Changing a value from one type to another with int(), float(), str() or bool()."],
  ["type()","A function that tells you the data type of a value."]],
 q:[["What type is the value returned by input()?","str","int","float","It depends on what is typed"],
  ["What is int(\"42\") + 1?","43","\"421\"","An error","42.0"],
  ["What is str(7) + \"7\"?","\"77\"","14","An error","\"14\""],
  ["What is bool(0)?","False","True","0","None"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Types and conversions · 8 questions",gen:"bank",bank:"al-types2",explain:"Work out the type and value of expressions, and what conversions do. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Converting types · 2 tasks",type:"py",explain:"Convert between data types. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Average of three",brief:"Ask for three whole numbers and print their average as a real number, e.g. inputs 4, 5 and 7 print <span class='mono'>5.333333333333333</span>.",
     stdin:["4","5","7"],starter:"a = input(\"First: \")\nb = input(\"Second: \")\nc = input(\"Third: \")\n",
     tests:[{name:"4, 5, 7",stdin:["4","5","7"],expect:"5.333333333333333"},{name:"2, 4, 6",stdin:["2","4","6"],expect:"4.0"}],
     hint:"Convert each input with int() before adding: (int(a) + int(b) + int(c)) / 3",
     solution:"a = input(\"First: \")\nb = input(\"Second: \")\nc = input(\"Third: \")\nprint((int(a) + int(b) + int(c)) / 3)"},
    {title:"Yes or no",brief:"Write <span class='mono'>to_bool(text)</span> that returns <span class='mono'>True</span> for \"yes\", \"y\" or \"true\" (any capitals) and <span class='mono'>False</span> for anything else. (Note that <span class='mono'>bool(\"no\")</span> is True, so bool() can't be used.)",
     starter:"def to_bool(text):\n    pass\n\nprint(to_bool(\"Yes\"), to_bool(\"no\"))",
     tests:[{name:"Yes is True",py:"assert to_bool('Yes') is True"},{name:"Y is True",py:"assert to_bool('Y') is True"},{name:"TRUE is True",py:"assert to_bool('TRUE') is True"},{name:"no is False",py:"assert to_bool('no') is False"},{name:"empty is False",py:"assert to_bool('') is False"}],
     hint:"return text.lower() in (\"yes\", \"y\", \"true\")",
     solution:"def to_bool(text):\n    return text.lower() in (\"yes\", \"y\", \"true\")\n\nprint(to_bool(\"Yes\"), to_bool(\"no\"))"}]}]},
{slug:"structures",title:"Data structures in Python",covers:[2],
 v:[["Array","A fixed collection of items of the same type; in Python, a list of one type is used."],
  ["Record","A group of related fields of different types; in Python, a list (or tuple) of mixed values."],
  ["2D list","A list of lists, used as a two-dimensional array: grid[row][col]."],
  ["Tuple","An ordered, immutable sequence, written in round brackets."],
  ["Dictionary","Key: value pairs, looked up by key."],
  ["Set","An unordered collection with no duplicates."],
  ["Converting structures","Changing one structure into another, e.g. list(), tuple(), set(), dict()."]],
 q:[["grid = [[1, 2, 3], [4, 5, 6]]. What is grid[1][2]?","6","5","2","3"],
  ["What does set([3, 1, 3, 2]) contain?","{1, 2, 3}","[3, 1, 3, 2]","{3, 1, 3, 2}","3"],
  ["Which converts a tuple t into a list?","list(t)","t.list()","[t]","tuple(t)"],
  ["What does list(\"abc\") give?","['a', 'b', 'c']","['abc']","'abc'","An error"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Structures in code · 8 questions",gen:"bank",bank:"al-struct",explain:"Read Python that builds and converts data structures, and work out the results. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"2D lists and records · 3 tasks",type:"py",explain:"Work with 2D lists, records and conversions. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Column totals",brief:"<span class='mono'>scores</span> is a 2D list: each row is a student and each column a test. Make a list <span class='mono'>totals</span> with the total of each <b>column</b>.",
     starter:"scores = [[7, 5, 9],\n          [6, 8, 4],\n          [9, 9, 7]]\ntotals = []\n",
     tests:[{name:"totals is [22, 22, 20]",py:"assert totals == [22, 22, 20], totals"}],
     hint:"for col in range(3): add up scores[row][col] for every row, then append it.",
     solution:"scores = [[7, 5, 9],\n          [6, 8, 4],\n          [9, 9, 7]]\ntotals = []\nfor col in range(len(scores[0])):\n    t = 0\n    for row in scores:\n        t = t + row[col]\n    totals.append(t)\n"},
    {title:"Unique tags",brief:"<span class='mono'>tags</span> contains repeats. Make <span class='mono'>unique</span>, a list of the tags with no repeats, sorted alphabetically.",
     starter:"tags = [\"python\", \"sql\", \"python\", \"loops\", \"sql\", \"files\"]\nunique = []\n",
     tests:[{name:"unique",py:"assert unique == ['files', 'loops', 'python', 'sql'], unique"}],
     hint:"sorted(set(tags)) — a set removes duplicates, sorted() turns it back into a list in order.",
     solution:"tags = [\"python\", \"sql\", \"python\", \"loops\", \"sql\", \"files\"]\nunique = sorted(set(tags))\n"},
    {title:"Records to a dictionary",brief:"<span class='mono'>pupils</span> is a list of records [name, form, age]. Build a dictionary <span class='mono'>form_of</span> mapping each name to its form.",
     starter:"pupils = [[\"Ana\", \"10B\", 15], [\"Ben\", \"11A\", 16], [\"Cai\", \"10B\", 15]]\nform_of = {}\n",
     tests:[{name:"form_of",py:"assert form_of == {'Ana': '10B', 'Ben': '11A', 'Cai': '10B'}, form_of"}],
     hint:"for p in pupils: form_of[p[0]] = p[1]",
     solution:"pupils = [[\"Ana\", \"10B\", 15], [\"Ben\", \"11A\", 16], [\"Cai\", \"10B\", 15]]\nform_of = {}\nfor p in pupils:\n    form_of[p[0]] = p[1]\n"}]}]}]);

L("a8-2",[
{slug:"numbers",title:"Working with numbers",covers:[1],
 v:[["Rounding","Changing a number to the nearest value with fewer decimal places: round(x, n)."],
  ["Truncation","Cutting off the fractional part without rounding: int(3.9) is 3."],
  ["Randomisation","Generating unpredictable values with the random library, e.g. random.randint(1, 6)."],
  ["random.randint(a, b)","A random whole number from a to b inclusive."],
  ["random.random()","A random real number from 0 up to (but not including) 1."],
  ["random.choice(list)","A random item from a list."],
  ["math library","Mathematical functions such as math.sqrt(), math.floor(), math.ceil() and math.pi."]],
 q:[["What is round(2.675, 2) likely to give in Python?","2.67","2.68","2.7","3"],
  ["What is int(-3.7)?","-3","-4","-3.7","An error"],
  ["Which can random.randint(1, 6) return?","1 to 6, including both","1 to 5","0 to 6","0 to 5"],
  ["What is math.ceil(4.1)?","5","4","4.1","4.0"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Numeric functions · 8 questions",gen:"bank",bank:"al-nums",explain:"Questions on rounding, truncation, randomisation and conversion. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Numbers · 3 tasks",type:"py",explain:"Use rounding, truncation and the random library. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Split the bill",brief:"Ask for a bill total and the number of people, and print each share rounded to 2 decimal places, e.g. 50 between 3 prints <span class='mono'>16.67</span>.",
     starter:"bill = float(input(\"Bill: \"))\npeople = int(input(\"People: \"))\n",
     tests:[{name:"50 between 3",stdin:["50","3"],expect:"16.67"},{name:"20 between 4",stdin:["20","4"],expect:"5.0"}],
     hint:"print(round(bill / people, 2))",solution:"bill = float(input(\"Bill: \"))\npeople = int(input(\"People: \"))\nprint(round(bill / people, 2))"},
    {title:"Dice",brief:"Write <span class='mono'>roll(n)</span> that returns a list of n random dice rolls (1 to 6) using <span class='mono'>random.randint</span>.",
     starter:"import random\n\ndef roll(n):\n    pass\n\nprint(roll(5))",
     tests:[{name:"returns n rolls",py:"assert len(roll(10)) == 10"},{name:"every roll is 1 to 6",py:"r = roll(500); assert all(1 <= x <= 6 for x in r) and set(r) == {1, 2, 3, 4, 5, 6}"},{name:"uses randint",py:"assert 'randint' in __code__"}],
     hint:"Build a list with a loop: rolls.append(random.randint(1, 6)).",
     solution:"import random\n\ndef roll(n):\n    rolls = []\n    for i in range(n):\n        rolls.append(random.randint(1, 6))\n    return rolls\n\nprint(roll(5))"},
    {title:"Whole boxes",brief:"Eggs are packed 6 to a box. Ask for a number of eggs and print how many <b>full</b> boxes can be filled and how many <b>boxes are needed</b> in total, e.g. 20 eggs print <span class='mono'>3 full, 4 needed</span>.",
     starter:"import math\neggs = int(input(\"Eggs: \"))\n",
     tests:[{name:"20 eggs",stdin:["20"],expect:"3 full, 4 needed"},{name:"18 eggs",stdin:["18"],expect:"3 full, 3 needed"}],
     hint:"Full boxes truncate: eggs // 6. Boxes needed round up: math.ceil(eggs / 6).",
     solution:"import math\neggs = int(input(\"Eggs: \"))\nprint(f\"{eggs // 6} full, {math.ceil(eggs / 6)} needed\")"}]}]},
{slug:"strings",title:"String handling",covers:[2],
 v:[["len()","Returns the number of characters in a string."],
  ["Indexing","Getting one character by position: s[0] is the first, s[-1] the last."],
  ["Slicing","Getting part of a string: s[start:stop], where stop isn't included."],
  ["Immutable","Strings can't be changed in place; methods return a new string."],
  ["f-string","A string starting with f that inserts values in {braces}, e.g. f\"{name} is {age}\"."],
  ["Concatenation","Joining strings with +."],
  ["String method","A function belonging to a string, e.g. .upper(), .find(), .isdigit()."]],
 q:[["s = \"Python\". What is s[1:4]?","\"yth\"","\"Pyt\"","\"ytho\"","\"yth\" and \"o\""],
  ["What is \"abc\".upper()?","\"ABC\"","\"Abc\"","\"abc\"","An error"],
  ["What is len(\"Hi there\")?","8","7","2","9"],
  ["What does \"banana\".find(\"n\") return?","2","1","3","-1"]],
 acts:[{id:"act1",title:"Activity 1",desc:"String expressions · 8 questions",gen:"bank",bank:"al-strs",explain:"Work out the results of string indexing, slicing, methods and formatting. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Strings · 3 tasks",type:"py",explain:"Examine and manipulate strings. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Initials",brief:"Write <span class='mono'>initials(name)</span> that returns the capitalised first letter of each word, e.g. <span class='mono'>\"ada lovelace\"</span> gives <span class='mono'>\"AL\"</span>.",
     starter:"def initials(name):\n    pass\n\nprint(initials(\"ada lovelace\"))",
     tests:[{name:"ada lovelace",py:"assert initials('ada lovelace') == 'AL', initials('ada lovelace')"},{name:"three words",py:"assert initials('Grace Brewster Hopper') == 'GBH'"}],
     hint:"Loop over name.split() and add word[0].upper() to a result string.",
     solution:"def initials(name):\n    out = \"\"\n    for word in name.split():\n        out = out + word[0].upper()\n    return out\n\nprint(initials(\"ada lovelace\"))"},
    {title:"Valid code",brief:"A product code is valid if it is exactly 6 characters: 2 letters followed by 4 digits, e.g. <span class='mono'>AB1234</span>. Write <span class='mono'>valid(code)</span> returning True or False.",
     starter:"def valid(code):\n    pass\n\nprint(valid(\"AB1234\"), valid(\"A12345\"))",
     tests:[{name:"AB1234 is valid",py:"assert valid('AB1234') is True"},{name:"A12345 isn't",py:"assert valid('A12345') is False"},{name:"too short",py:"assert valid('AB123') is False"},{name:"letters at the end",py:"assert valid('AB12CD') is False"}],
     hint:"len(code) == 6 and code[:2].isalpha() and code[2:].isdigit()",
     solution:"def valid(code):\n    return len(code) == 6 and code[:2].isalpha() and code[2:].isdigit()\n\nprint(valid(\"AB1234\"), valid(\"A12345\"))"},
    {title:"Receipt line",brief:"Write <span class='mono'>line(item, price)</span> that returns an f-string with the item and the price to 2 decimal places, e.g. <span class='mono'>line(\"Pen\", 1.5)</span> gives <span class='mono'>\"Pen: £1.50\"</span>.",
     starter:"def line(item, price):\n    pass\n\nprint(line(\"Pen\", 1.5))",
     tests:[{name:"Pen 1.5",py:"assert line('Pen', 1.5) == 'Pen: £1.50', line('Pen', 1.5)"},{name:"Ruler 0.799",py:"assert line('Ruler', 0.799) == 'Ruler: £0.80'"},{name:"uses an f-string",py:"assert 'f\"' in __code__ or \"f'\" in __code__"}],
     hint:"return f\"{item}: £{price:.2f}\"",solution:"def line(item, price):\n    return f\"{item}: £{price:.2f}\"\n\nprint(line(\"Pen\", 1.5))"}]}]},
{slug:"files",title:"Text files",covers:[3],
 v:[["Text file","A file of characters, often one record per line, that stays when the program ends."],
  ["open(name, mode)","Opens a file: \"r\" to read, \"w\" to write (replacing the contents), \"a\" to append."],
  ["with","Opens a file and closes it automatically at the end of the block."],
  ["read() / readline() / readlines()","Read the whole file, one line, or a list of all lines."],
  ["write()","Writes a string to a file; it doesn't add a new line, so add \"\\n\" yourself."],
  ["close()","Finishes using a file so the data is saved and the file is released."],
  ["strip()","Removes spaces and the newline character from the ends of a string read from a file."]],
 q:[["Which mode adds to the end of a file without deleting it?","\"a\"","\"w\"","\"r\"","\"x\""],
  ["What happens when you open an existing file with \"w\"?","Its contents are replaced","Text is added to the end","It's opened read-only","An error"],
  ["Why use with open(…) as f:?","The file is closed automatically","It reads faster","It creates a backup","It's required for reading"],
  ["Each line read from a file ends with…","a newline character","a comma","nothing","a space"]],
 acts:[{id:"act1",title:"Activity 1",desc:"File operations · 8 questions",gen:"bank",bank:"al-files",explain:"Questions on opening, reading, writing, appending and closing text files. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Text files · 3 tasks",type:"py",explain:"Read from and write to text files. A file called scores.txt is provided. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Count the lines",brief:"<span class='mono'>scores.txt</span> holds one score per line. Read it and print how many scores there are and their total, as <span class='mono'>5 scores, total 312</span>.",
     files:{"scores.txt":"64\n71\n55\n80\n42\n"},starter:"with open(\"scores.txt\", \"r\") as f:\n    lines = f.readlines()\n",
     tests:[{name:"5 scores, total 312",stdin:[],expect:"5 scores, total 312"}],
     hint:"Convert each line with int(line.strip()) and add it up; len(lines) gives the count.",
     solution:"with open(\"scores.txt\", \"r\") as f:\n    lines = f.readlines()\ntotal = 0\nfor line in lines:\n    total = total + int(line.strip())\nprint(f\"{len(lines)} scores, total {total}\")"},
    {title:"Write a file",brief:"Write the names in <span class='mono'>names</span> to a new file <span class='mono'>names.txt</span>, one per line.",
     starter:"names = [\"Ana\", \"Ben\", \"Cai\"]\n",
     tests:[{name:"names.txt has three lines",py:"assert open('names.txt').read().split() == ['Ana', 'Ben', 'Cai'], open('names.txt').read()"},{name:"one name per line",py:"assert open('names.txt').read().strip().split('\\n') == ['Ana', 'Ben', 'Cai']"}],
     hint:"with open(\"names.txt\", \"w\") as f: then f.write(name + \"\\n\") in a loop.",
     solution:"names = [\"Ana\", \"Ben\", \"Cai\"]\nwith open(\"names.txt\", \"w\") as f:\n    for name in names:\n        f.write(name + \"\\n\")\n"},
    {title:"Add a score",brief:"Ask for a new score and <b>append</b> it to <span class='mono'>scores.txt</span> on its own line, without losing the existing scores.",
     files:{"scores.txt":"64\n71\n55\n80\n42\n"},stdin:["90"],starter:"new = input(\"New score: \")\n",
     tests:[{name:"90 is added to the end",py:"assert open('scores.txt').read().split() == ['64', '71', '55', '80', '42', '90'], open('scores.txt').read()"},{name:"uses append mode",py:"assert '\"a\"' in __code__ or \"'a'\" in __code__"}],
     hint:"with open(\"scores.txt\", \"a\") as f: f.write(new + \"\\n\")",
     solution:"new = input(\"New score: \")\nwith open(\"scores.txt\", \"a\") as f:\n    f.write(new + \"\\n\")\n"}]}]},
{slug:"structops",title:"Processing data structures",covers:[4,7],
 v:[["Create","Make a new, empty or filled structure, e.g. scores = [] or ages = {}."],
  ["Insert","Add an item: append() or insert() for lists, d[key] = value for dictionaries, add() for sets."],
  ["Update","Change an existing item: lst[i] = x or d[key] = x."],
  ["Retrieve","Get an item: lst[i], d[key] or d.get(key)."],
  ["Delete","Remove an item: del, pop(), remove(), or discard() for sets."],
  ["Traverse","Visit every item, usually with a for loop."],
  ["Membership","Testing whether an item is in a structure with in."]],
 q:[["Which adds a key to a dictionary d?","d[\"x\"] = 5","d.append(\"x\", 5)","d.add(\"x\")","d.insert(\"x\", 5)"],
  ["Which removes an item from a set without an error if it's missing?","discard()","remove()","del","pop(item)"],
  ["Which loops over the keys and values of d?","for k, v in d.items():","for k, v in d:","for k in d.values():","for d in k, v:"],
  ["a = {1, 2, 3}; b = {2, 3, 4}. What is a.difference(b)?","{1}","{4}","{2, 3}","{1, 4}"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Structure operations · 8 questions",gen:"bank",bank:"al-ops2",explain:"Work out what list, dictionary and set operations do. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Data structures · 3 tasks",type:"py",explain:"Create, update, retrieve, delete and traverse. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Stock control",brief:"<span class='mono'>stock</span> is a dictionary of item: quantity. Write <span class='mono'>sell(item, n)</span> that reduces the quantity, removes the item when it reaches 0, and returns <span class='mono'>False</span> (changing nothing) if there isn't enough stock or the item doesn't exist.",
     starter:"stock = {\"pen\": 10, \"ruler\": 2}\n\ndef sell(item, n):\n    pass\n",
     tests:[{name:"sell 3 pens",py:"assert sell('pen', 3) is not False and stock['pen'] == 7"},{name:"not enough",py:"assert sell('ruler', 5) is False and stock['ruler'] == 2"},{name:"sells out",py:"sell('ruler', 2); assert 'ruler' not in stock"},{name:"unknown item",py:"assert sell('glue', 1) is False"}],
     hint:"Check item in stock and stock[item] >= n first. Then subtract; if it's 0, del stock[item].",
     solution:"stock = {\"pen\": 10, \"ruler\": 2}\n\ndef sell(item, n):\n    if item not in stock or stock[item] < n:\n        return False\n    stock[item] = stock[item] - n\n    if stock[item] == 0:\n        del stock[item]\n    return True\n"},
    {title:"Highest scorer",brief:"<span class='mono'>scores</span> is a dictionary of name: score. Traverse it to find the name with the highest score, without using <span class='mono'>max()</span>. Store it in <span class='mono'>best</span>.",
     starter:"scores = {\"Ana\": 72, \"Ben\": 88, \"Cai\": 65, \"Dev\": 81}\nbest = \"\"\n",
     tests:[{name:"best is Ben",py:"assert best == 'Ben', best"},{name:"no max()",py:"assert 'max(' not in __code__"}],
     hint:"Loop with for name, s in scores.items(): and keep track of the best score so far.",
     solution:"scores = {\"Ana\": 72, \"Ben\": 88, \"Cai\": 65, \"Dev\": 81}\nbest = \"\"\ntop = -1\nfor name, s in scores.items():\n    if s > top:\n        top = s\n        best = name\n"},
    {title:"Common friends",brief:"Write <span class='mono'>compare(a, b)</span> where a and b are lists of friends. Return a tuple: (friends in common, friends of a only, everyone), each as a sorted list.",
     starter:"def compare(a, b):\n    pass\n\nprint(compare([\"Ana\", \"Ben\", \"Cai\"], [\"Ben\", \"Dev\"]))",
     tests:[{name:"example",py:"assert compare(['Ana', 'Ben', 'Cai'], ['Ben', 'Dev']) == (['Ben'], ['Ana', 'Cai'], ['Ana', 'Ben', 'Cai', 'Dev']), compare(['Ana', 'Ben', 'Cai'], ['Ben', 'Dev'])"},{name:"nothing in common",py:"assert compare(['X'], ['Y'])[0] == []"}],
     hint:"Turn both into sets. Use & for in common, - for a only and | for everyone. sorted() turns each back into a list.",
     solution:"def compare(a, b):\n    sa, sb = set(a), set(b)\n    return sorted(sa & sb), sorted(sa - sb), sorted(sa | sb)\n\nprint(compare([\"Ana\", \"Ben\", \"Cai\"], [\"Ben\", \"Dev\"]))"}]}]},
{slug:"stackqueue",title:"Stacks and queues in fixed-length lists",covers:[5,6],
 v:[["Fixed-length list","A list created at its full size, e.g. [None] * 5, that never grows or shrinks."],
  ["Top pointer","An integer holding the index of the top item of a stack; −1 when empty."],
  ["IsEmpty","Returns True when the structure holds no items."],
  ["IsFull","Returns True when every space is used."],
  ["Size","Returns the number of items currently stored."],
  ["Front and rear pointers","Indexes of the next item to dequeue and the last item enqueued."],
  ["Wrap-around","Moving a pointer back to index 0 after the end of the list, using % length."]],
 q:[["A stack of size 5 has top = 4. What does IsFull() return?","True","False","4","5"],
  ["A stack has top = 2. What does Size() return?","3","2","1","5"],
  ["In a circular queue of size 6, rear = 5. Where does the next enqueue go?","Index 0","Index 6","Index 5","Nowhere"],
  ["Why use [None] * 5 rather than an empty list?","To create a fixed-length structure, like an array","Python can't make empty lists","It's faster to append","None values are required by pop()"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Trace stacks and queues · 8 questions",gen:"alstack",type:"mixed",explain:"Trace push, pop, enqueue and dequeue. A stack is last in, first out; a queue is first in, first out. New operations every try."},
  {id:"py1",title:"Code it",desc:"Stack and queue · 2 tasks",type:"py",explain:"Implement a stack and a queue in fixed-length lists, exactly as the specification describes. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Stack",brief:"Complete <span class='mono'>is_empty()</span>, <span class='mono'>is_full()</span>, <span class='mono'>size()</span>, <span class='mono'>push(item)</span> (return False if full) and <span class='mono'>pop()</span> (return None if empty) for a stack of size 4.",
     starter:"SIZE = 4\nstack = [None] * SIZE\ntop = -1\n\ndef is_empty():\n    pass\n\ndef is_full():\n    pass\n\ndef size():\n    pass\n\ndef push(item):\n    global top\n    pass\n\ndef pop():\n    global top\n    pass\n",
     tests:[{name:"starts empty",py:"assert is_empty() is True and size() == 0"},{name:"push and size",py:"push('a'); push('b'); assert size() == 2 and not is_empty()"},{name:"last in, first out",py:"assert pop() == 'b' and pop() == 'a' and pop() is None"},{name:"full",py:"[push(i) for i in range(4)]; assert is_full() is True and push(9) is False and size() == 4"}],
     hint:"is_empty: top == -1. is_full: top == SIZE - 1. size: top + 1.",
     solution:"SIZE = 4\nstack = [None] * SIZE\ntop = -1\n\ndef is_empty():\n    return top == -1\n\ndef is_full():\n    return top == SIZE - 1\n\ndef size():\n    return top + 1\n\ndef push(item):\n    global top\n    if is_full():\n        return False\n    top = top + 1\n    stack[top] = item\n    return True\n\ndef pop():\n    global top\n    if is_empty():\n        return None\n    item = stack[top]\n    stack[top] = None\n    top = top - 1\n    return item\n"},
    {title:"Queue",brief:"Complete a <b>circular</b> queue of size 4 with <span class='mono'>is_empty()</span>, <span class='mono'>is_full()</span>, <span class='mono'>size()</span>, <span class='mono'>enqueue(item)</span> (False if full) and <span class='mono'>dequeue()</span> (None if empty).",
     starter:"SIZE = 4\nqueue = [None] * SIZE\nfront = 0\nrear = -1\ncount = 0\n\ndef is_empty():\n    pass\n\ndef is_full():\n    pass\n\ndef size():\n    pass\n\ndef enqueue(item):\n    global rear, count\n    pass\n\ndef dequeue():\n    global front, count\n    pass\n",
     tests:[{name:"starts empty",py:"assert is_empty() and size() == 0"},{name:"first in, first out",py:"enqueue(1); enqueue(2); assert dequeue() == 1 and size() == 1"},{name:"full",py:"enqueue(3); enqueue(4); enqueue(5); assert is_full() and enqueue(6) is False"},{name:"wraps round",py:"assert [dequeue() for _ in range(4)] == [2, 3, 4, 5] and dequeue() is None"}],
     hint:"Use count for is_empty, is_full and size. Move pointers with (pointer + 1) % SIZE.",
     solution:"SIZE = 4\nqueue = [None] * SIZE\nfront = 0\nrear = -1\ncount = 0\n\ndef is_empty():\n    return count == 0\n\ndef is_full():\n    return count == SIZE\n\ndef size():\n    return count\n\ndef enqueue(item):\n    global rear, count\n    if is_full():\n        return False\n    rear = (rear + 1) % SIZE\n    queue[rear] = item\n    count = count + 1\n    return True\n\ndef dequeue():\n    global front, count\n    if is_empty():\n        return None\n    item = queue[front]\n    front = (front + 1) % SIZE\n    count = count - 1\n    return item\n"}]}]}]);

/* ---------- banks ---------- */
B("al-types2",[
 {t:"mc",q:"What is type(3.0)?",a:"&lt;class 'float'&gt;",w:["&lt;class 'int'&gt;","&lt;class 'str'&gt;","&lt;class 'real'&gt;"]},
 {t:"mc",q:"What is type(\"3\")?",a:"&lt;class 'str'&gt;",w:["&lt;class 'int'&gt;","&lt;class 'char'&gt;","&lt;class 'float'&gt;"]},
 {t:"mc",q:"What is int(7.9)?",a:"7",w:["8","7.9","An error"]},
 {t:"mc",q:"What is float(\"2\") * 2?",a:"4.0",w:["4","\"22\"","An error"]},
 {t:"mc",q:"What is \"3\" * 3?",a:"\"333\"",w:["9","An error","\"9\""]},
 {t:"mc",q:"What is bool(\"False\")?",a:"True",w:["False","An error","None"]},
 {t:"mc",q:"What is bool(\"\")?",a:"False",w:["True","An error","None"]},
 {t:"mc",q:"What is str(3.50)?",a:"\"3.5\"",w:["\"3.50\"","3.5","An error"]},
 {t:"mc",q:"Which data type is best for a student's name?",a:"String",w:["Integer","Boolean","Real"]},
 {t:"mc",q:"Which data type is best for whether a library book is on loan?",a:"Boolean",w:["String","Integer","Character"]},
 {t:"mc",q:"Which data type is best for a temperature like 21.5?",a:"Real",w:["Integer","Boolean","Character"]},
 {t:"mc",q:"What is int(\"07\")?",a:"7",w:["\"07\"","An error","0"]}]);

B("al-struct",[
 {t:"mc",html:`<pre class="pc py">grid = [[0] * 3 for _ in range(2)]
grid[0][2] = 5
print(grid)</pre>`,q:"What is printed?",a:"[[0, 0, 5], [0, 0, 0]]",w:["[[0, 0, 0], [0, 0, 5]]","[[5, 0, 0], [0, 0, 0]]","[[0, 0, 5], [0, 0, 5]]"]},
 {t:"mc",html:`<pre class="pc py">t = (4, 5, 6)
lst = list(t)
lst.append(7)
print(len(t), len(lst))</pre>`,q:"What is printed?",a:"3 4",w:["4 4","3 3","An error"]},
 {t:"mc",html:`<pre class="pc py">pairs = [("a", 1), ("b", 2)]
d = dict(pairs)
print(d["b"])</pre>`,q:"What is printed?",a:"2",w:["b","(\"b\", 2)","An error"]},
 {t:"mc",html:`<pre class="pc py">d = {"x": 1, "y": 2}
print(list(d.keys()), list(d.values()))</pre>`,q:"What is printed?",a:"['x', 'y'] [1, 2]",w:["[1, 2] ['x', 'y']","['x', 1] ['y', 2]","An error"]},
 {t:"mc",html:`<pre class="pc py">s = set("hello")
print(len(s))</pre>`,q:"What is printed?",a:"4",w:["5","1","2"]},
 {t:"mc",html:`<pre class="pc py">rec = ["Ana", 16, True]
name, age, boarder = rec
print(age + 1)</pre>`,q:"What is printed?",a:"17",w:["161","An error","Ana"]},
 {t:"mc",html:`<pre class="pc py">grid = [[1, 2], [3, 4], [5, 6]]
print(len(grid), len(grid[0]))</pre>`,q:"What is printed?",a:"3 2",w:["2 3","6 6","3 3"]},
 {t:"mc",html:`<pre class="pc py">grid = [[1, 2], [3, 4], [5, 6]]
print([row[1] for row in grid])</pre>`,q:"What is printed?",a:"[2, 4, 6]",w:["[3, 4]","[1, 3, 5]","[1, 2]"]},
 {t:"mc",q:"Which structure can't be changed after it's created?",a:"Tuple",w:["List","Dictionary","Set"]},
 {t:"mc",q:"Which structure would you use for a 3 × 3 noughts and crosses board?",a:"A 2D list",w:["A set","A tuple of strings","A single integer"]},
 {t:"mc",q:"Why can't a list be a key in a dictionary?",a:"Keys must be immutable, and lists can change",w:["Lists are too long","Only numbers can be keys","Dictionaries can't hold lists"]},
 {t:"mc",q:"Which gives a sorted list of the unique values in nums?",a:"sorted(set(nums))",w:["set(sorted(nums))","nums.unique()","list(nums).set()"]}]);

B("al-nums",[
 {t:"mc",q:"What is round(3.14159, 2)?",a:"3.14",w:["3.15","3.1","3"]},
 {t:"mc",q:"What is round(7.5)?",a:"8",w:["7","7.5","8.0"]},
 {t:"mc",q:"What is round(6.5)?",a:"6",w:["7","6.5","6.0"]},
 {t:"mc",q:"What is int(9.99)?",a:"9",w:["10","9.99","An error"]},
 {t:"mc",q:"What is math.floor(-2.5)?",a:"-3",w:["-2","-2.5","2"]},
 {t:"mc",q:"What is math.sqrt(49)?",a:"7.0",w:["7","24.5","49"]},
 {t:"mc",q:"Which gives a random whole number from 0 to 9?",a:"random.randint(0, 9)",w:["random.randint(0, 10)","random.random(9)","random.choice(9)"]},
 {t:"mc",q:"Which picks a random name from a list called names?",a:"random.choice(names)",w:["random.randint(names)","names.random()","random(names)"]},
 {t:"mc",q:"What is the difference between rounding and truncating 4.7?",a:"Rounding gives 5; truncating gives 4",w:["Both give 5","Both give 4","Rounding gives 4; truncating gives 5"]},
 {t:"mc",q:"What is 7 / 2 then converted with int()?",a:"3",w:["4","3.5","2"]},
 {t:"mc",q:"Why might 0.1 + 0.2 == 0.3 be False?",a:"Floats are stored as binary approximations",w:["Python adds wrongly","0.3 is an integer","== doesn't work on floats"]},
 {t:"mc",q:"What must you write before using random.randint?",a:"import random",w:["include random","using random","random.start()"]}]);

B("al-strs",[
 {t:"mc",q:"s = \"Computer\". What is s[-1]?",a:"\"r\"",w:["\"C\"","\"e\"","An error"]},
 {t:"mc",q:"s = \"Computer\". What is s[3:]?",a:"\"puter\"",w:["\"mputer\"","\"Com\"","\"pute\""]},
 {t:"mc",q:"s = \"Computer\". What is s[:3]?",a:"\"Com\"",w:["\"Comp\"","\"put\"","\"omp\""]},
 {t:"mc",q:"What is \"a,b,c\".split(\",\")?",a:"['a', 'b', 'c']",w:["'abc'","['a,b,c']","('a', 'b', 'c')"]},
 {t:"mc",q:"What is \"-\".join([\"2026\", \"10\", \"19\"])?",a:"\"2026-10-19\"",w:["\"-2026-10-19-\"","['2026-10-19']","\"20261019\""]},
 {t:"mc",q:"What is \"  hi  \".strip()?",a:"\"hi\"",w:["\"  hi\"","\"hi  \"","\" hi \""]},
 {t:"mc",q:"What is \"hello\".replace(\"l\", \"L\")?",a:"\"heLLo\"",w:["\"heLlo\"","\"hello\"","\"HELLO\""]},
 {t:"mc",q:"What is \"42\".isdigit()?",a:"True",w:["False","42","An error"]},
 {t:"mc",q:"What is \"Abc\".islower()?",a:"False",w:["True","\"abc\"","An error"]},
 {t:"mc",q:"What is f\"{7 / 3:.2f}\"?",a:"\"2.33\"",w:["\"2.3\"","\"2.333\"","2.33"]},
 {t:"mc",q:"s = \"cat\". What does s[0] = \"b\" do?",a:"Raises TypeError: strings are immutable",w:["Changes s to \"bat\"","Raises IndexError","Adds b to the start"]},
 {t:"mc",q:"What is \"banana\".count(\"a\")?",a:"3",w:["2","1","6"]}]);

B("al-files",[
 {t:"mc",q:"Which mode opens a file for reading?",a:"\"r\"",w:["\"w\"","\"a\"","\"read\""]},
 {t:"mc",q:"A program opens results.txt with \"w\" and writes one line. What happens to the old contents?",a:"They're deleted",w:["They're kept above the new line","They're kept below the new line","An error stops the program"]},
 {t:"mc",q:"What does f.readlines() return?",a:"A list of strings, one per line",w:["One string of the whole file","The first line only","The number of lines"]},
 {t:"mc",q:"What does f.read() return?",a:"The whole file as one string",w:["A list of lines","The first character","Nothing"]},
 {t:"mc",q:"Why add \"\\n\" when writing lines?",a:"write() doesn't start a new line by itself",w:["To close the file","To make it a list","Python requires it at the end of every file"]},
 {t:"mc",q:"Why use strip() on a line read from a file?",a:"To remove the newline (and spaces) from the ends",w:["To split it into words","To convert it to a number","To close the file"]},
 {t:"mc",q:"What happens if you forget to close a file you've written to?",a:"Some data may not be saved",w:["The file is deleted","Nothing ever","The computer restarts"]},
 {t:"mc",q:"Which exception might you handle when opening a file to read?",a:"FileNotFoundError",w:["ZeroDivisionError","KeyError","IndexError"]},
 {t:"mc",q:"Which reads a file line by line without loading it all at once?",a:"for line in f:",w:["f.read()","f.readlines()","f.write()"]},
 {t:"mc",q:"A line in a CSV file is \"Ana,16,10B\". Which gets the age as a number?",a:"int(line.split(\",\")[1])",w:["line[1]","int(line[4])","line.split()[1]"]},
 {t:"mc",q:"Which mode creates a file if it doesn't exist and adds to the end if it does?",a:"\"a\"",w:["\"r\"","\"x\"","\"r+\""]},
 {t:"blank",q:"The keyword that opens a file and closes it automatically at the end of the block is ___.",a:["with"]}]);

B("al-ops2",[
 {t:"mc",html:`<pre class="pc py">lst = [3, 8, 1]
lst.insert(1, 5)
print(lst)</pre>`,q:"What is printed?",a:"[3, 5, 8, 1]",w:["[5, 3, 8, 1]","[3, 8, 5, 1]","[3, 1, 5, 8]"]},
 {t:"mc",html:`<pre class="pc py">lst = [3, 8, 1, 8]
lst.remove(8)
print(lst)</pre>`,q:"What is printed?",a:"[3, 1, 8]",w:["[3, 1]","[3, 8, 1]","An error"]},
 {t:"mc",html:`<pre class="pc py">d = {"a": 1}
d["a"] = d["a"] + 4
d["b"] = 2
print(d)</pre>`,q:"What is printed?",a:"{'a': 5, 'b': 2}",w:["{'a': 1, 'b': 2}","{'a': 5}","An error"]},
 {t:"mc",html:`<pre class="pc py">d = {"a": 1, "b": 2}
del d["a"]
print(len(d), "a" in d)</pre>`,q:"What is printed?",a:"1 False",w:["2 True","1 True","An error"]},
 {t:"mc",html:`<pre class="pc py">s = {1, 2}
s.add(2)
s.add(3)
print(s)</pre>`,q:"What is printed?",a:"{1, 2, 3}",w:["{1, 2, 2, 3}","{1, 2}","An error"]},
 {t:"mc",html:`<pre class="pc py">s = {1, 2, 3}
s.discard(9)
print(s)</pre>`,q:"What is printed?",a:"{1, 2, 3}",w:["A KeyError","{1, 2, 3, 9}","set()"]},
 {t:"mc",html:`<pre class="pc py">a = {1, 2, 3}
b = {3, 4}
print(a.union(b), a.intersection(b))</pre>`,q:"What is printed?",a:"{1, 2, 3, 4} {3}",w:["{3} {1, 2, 3, 4}","{1, 2, 4} {3}","{1, 2} {4}"]},
 {t:"mc",html:`<pre class="pc py">ages = {"Ana": 17, "Ben": 15, "Cai": 16}
total = 0
for name in ages:
    total = total + ages[name]
print(total)</pre>`,q:"What is printed?",a:"48",w:["AnaBenCai","3","An error"]},
 {t:"mc",html:`<pre class="pc py">nums = [5, 2, 9]
nums[1] = nums[0] + nums[2]
print(nums)</pre>`,q:"What is printed?",a:"[5, 14, 9]",w:["[14, 2, 9]","[5, 2, 9, 14]","[5, 7, 9]"]},
 {t:"mc",q:"Which retrieves a value from dictionary d without an error if the key is missing?",a:"d.get(key)",w:["d[key]","d.find(key)","d.key"]},
 {t:"mc",q:"Which clears every item from a dictionary d?",a:"d.clear()",w:["del d[]","d = None","d.remove()"]},
 {t:"mc",q:"What does symmetric_difference give for {1, 2, 3} and {3, 4}?",a:"{1, 2, 4}",w:["{3}","{1, 2, 3, 4}","{4}"]}]);

/* ---------- third activities and puzzles ---------- */
S("s-types",{"Integer":["The number of pupils in a class","A year such as 2026","A score out of 100"],"Real":["A price in pounds","A height in metres","An average"],"String":["A postcode","A phone number","A name"],"Boolean":["Whether an account is locked","Whether a box is ticked","Whether a book is on loan"]},3);
A("a8-1-types",[srt("s-types","Choose the type","Drag each item of data to the most suitable data type.")]);
S("s-structs",{"List":["The order of runners in a race","A shopping list you add to","Scores to sort"],"Tuple":["A fixed (x, y) point","An RGB colour","Days of the week that never change"],"Dictionary":["Usernames and their passwords","Words and their meanings","Items and their prices"],"Set":["Students who have handed in work","Unique words in a book","Tags with no repeats"]},3);
A("a8-1-structures",[srt("s-structs","Which structure?","Drag each use to the data structure that suits it best.")]);
S("s-numfn",{"Rounds to nearest":["round(2.6)","round(3.14159, 2)","round(17.5)"],"Rounds down / truncates":["int(2.9)","math.floor(2.9)","7 // 2"],"Rounds up":["math.ceil(2.1)","math.ceil(7 / 2)","-(-7 // 2)"]},3);
A("a8-2-numbers",[srt("s-numfn","Round, truncate or round up?","Drag each expression to what it does to the number.")]);
S("s-strfn",{"Examines (returns True/False)":["isdigit()","isalpha()","isupper()","startswith(\"A\")"],"Finds or counts":["find(\"x\")","index(\"x\")","count(\"x\")","len(s)"],"Returns a changed copy":["upper()","replace(\"a\", \"b\")","strip()","capitalize()"]},3);
A("a8-2-strings",[srt("s-strfn","String methods","Drag each string method or function to what it does.")]);
O("o-file",["Open the file in read mode","Loop through each line","Strip the newline from the line","Split the line into fields","Convert the fields to the right types","Store the record in a list","Close the file"]);
A("a8-2-files",[ord("o-file","Reading a CSV file","Put the steps for reading records from a text file in order.")]);
S("s-crud",{"Insert":["lst.append(x)","d[\"new\"] = 1","s.add(x)","lst.insert(0, x)"],"Update":["lst[2] = 9","d[\"a\"] = d[\"a\"] + 1","grid[1][1] = \"X\""],"Retrieve":["lst[-1]","d.get(\"a\")","x in s"],"Delete":["del lst[0]","d.pop(\"a\")","s.discard(x)","lst.remove(x)"]},3);
A("a8-2-structops",[srt("s-crud","Insert, update, retrieve or delete?","Drag each operation to what it does to the data structure.")]);
O("o-push",["Check whether the stack is full","If it's full, report an error and stop","Add 1 to the top pointer","Store the item at the top position"]);
A("a8-2-stackqueue",[ord("o-push","Pushing onto a stack","Put the steps for pushing an item onto a fixed-length stack in order.")]);

P("a8-1-types",`Integer | Whole number
Real | Has a fractional part
String | Sequence of characters
Character | One letter, digit or symbol
Boolean | True or False
input() returns | A string
int("42") | 42
float("2") | 2.0
str(7) + "7" | "77"
"3" * 3 | "333"
int(7.9) | 7
bool(0) | False
bool("") | Also False
bool("no") | True
type(3.0) | float
Casting | Converting a type
Best type for a price | A real number
Postcode type | Text, not a number`);

P("a8-1-structures",`Array | Same type, fixed size
Record | Mixed fields
2D list | List of lists
grid[r][c] | Row r, column c
Tuple | Immutable sequence
Dictionary | Key: value pairs
Set | No duplicates
list(t) | Tuple to list
tuple(lst) | List to tuple
set(lst) | Removes duplicates
dict(pairs) | Pairs to dictionary
sorted(set(x)) | Unique and sorted
list("abc") | ['a', 'b', 'c']
len(grid) | Number of rows
len(grid[0]) | Number of columns
Dictionary key | Must be immutable
Unpacking | name, age = rec
[[0] * 3 for _ in range(2)] | A 2 by 3 grid`);

P("a8-2-numbers",`round(3.14159, 2) | 3.14
round(7.5) | 8
int(9.99) | 9 (truncated)
math.floor(-2.5) | -3
math.ceil(4.1) | 5
math.sqrt(49) | 7.0
random.randint(1, 6) | 1 to 6 inclusive
random.random() | 0 up to 1
random.choice(list) | A random item
Truncation | Chop off decimals
Rounding | To the nearest value
import random | Before using random
7 // 2 | 3
0.1 + 0.2 | Not exactly 0.3
f"{x:.2f}" | Two decimal places
float("3.5") | 3.5
int("07") | 7
abs(-4) | 4`);

P("a8-2-strings",`len("Hi there") | 8
s[0] | First character
s[-1] | Last character
s[1:4] | Characters 1 to 3
s[:3] | First three characters
s[3:] | From index 3 to the end
upper() | Capital letters
lower() | Small letters
strip() | Removes outer spaces
split(",") | String to a list
"-".join(list) | List to a string
replace("a", "b") | Swaps every a for b
find("n") | Index of first n
isdigit() | All digits?
f-string | f"{name} is {age}"
Concatenation | Joining with +
Immutable | Can't change in place
count("a") | How many a's`);

P("a8-2-files",`open(name, "r") | Read mode
open(name, "w") | Write: replaces contents
open(name, "a") | Append to the end
with open(...) | Closes automatically
read() | Whole file as a string
readline() | One line
readlines() | List of lines
write(text) | Adds no newline
"\\n" | Newline character
close() | Saves and releases
strip() on each line | Removes the newline
split(",") on a line | Separates fields
Missing file | FileNotFoundError
Text file | Data that persists
for line in f | Reads line by line
CSV | Comma-separated values
Forgetting to close | Data may be lost
int(line.strip()) | Line to a number`);

P("a8-2-structops",`Create | scores = []
Insert into a list | append(x)
Insert at a position | insert(i, x)
Insert into a dictionary | d[key] = value
Insert into a set | add(x)
Update | lst[i] = x
Retrieve | d.get(key)
Delete by position | del lst[i]
Delete by value | remove(x)
Delete safely from a set | discard(x)
Traverse | Visit every item
for k, v in d.items() | Keys and values
Membership | x in s
Union | a.union(b)
Intersection | a.intersection(b)
Difference | a.difference(b)
d.clear() | Empties the dictionary
pop() | Removes and returns`);

P("a8-2-stackqueue",`[None] * 5 | Fixed-length list
Stack | Last in, first out
Queue | First in, first out
top = -1 | Empty stack
IsEmpty for a stack | top == -1
IsFull for a stack | top == SIZE - 1
Size of a stack | top + 1
push | Add at the top
pop | Remove from the top
enqueue | Add at the rear
dequeue | Remove from the front
Wrap-around | (pointer + 1) % SIZE
count | Number in the queue
Full queue | count == SIZE
Empty queue | count == 0
Push on a full stack | Overflow
Pop from an empty stack | Underflow
global top | Lets push change it`);
