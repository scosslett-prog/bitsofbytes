/* 5.1 Tools and techniques, 5.2 Searching and sorting, 5.3 Boolean logic, 5.4 Programming paradigms */
L("a5-1",[
{slug:"algorithms",title:"Algorithms and flowcharts",covers:[1],
 v:[["Algorithm","A precise sequence of steps that solves a problem, which can be written in words, as a flowchart or as code."],
  ["Flowchart","A diagram of an algorithm using standard symbols joined by flow arrows."],
  ["Terminator","Rounded box that starts or ends a flowchart."],
  ["Decision","Diamond with one question and two exits, labelled Yes and No."],
  ["Subprocess","Rectangle with double sides: a step defined in its own separate flowchart or subroutine."],
  ["Logic error","A mistake that lets the program run but gives the wrong result."],
  ["Efficiency","How much time (number of steps) and memory an algorithm uses as the input grows."]],
 q:[["Which flowchart symbol is used for a decision?","Diamond","Parallelogram","Rectangle","Rounded rectangle"],
  ["Which symbol is used for input or output?","Parallelogram","Diamond","Rectangle with double sides","Circle"],
  ["A program runs but always gives an average that's too high. What kind of error is this?","Logic error","Syntax error","Runtime error","Hardware error"],
  ["Algorithm A takes 20 steps for 10 items and 40 for 20. Algorithm B takes 100 and 400. Which is more efficient as data grows?","A","B","They're the same","It can't be told"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Algorithms · 8 questions",gen:"bank",bank:"al-algorithms",explain:"Questions on flowchart symbols, reading algorithms, finding logic errors and comparing efficiency. Every try picks a different set."}]},
{slug:"trace",title:"Trace tables",covers:[2],
 v:[["Trace table","A table with a column for each variable (and output), filled in line by line to follow an algorithm by hand."],
  ["Dry run","Working through an algorithm on paper, without a computer, to see what it does."],
  ["Iteration","One pass through the body of a loop."],
  ["Count-controlled loop","A loop that repeats a set number of times (for … in range)."],
  ["Condition-controlled loop","A loop that repeats while a condition is true (while)."],
  ["Integer division","// gives the whole-number part of a division; % gives the remainder."]],
 q:[["What is a trace table used for?","Following the values of variables as an algorithm runs","Finding syntax errors automatically","Drawing flowcharts","Timing a program"],
  ["What is 17 // 5?","3","3.4","2","5"],
  ["What is 17 % 5?","2","3","3.4","12"],
  ["In a trace table, when do you write a new value for a variable?","Each time it's assigned a new value","Only at the end","Every line, even if it doesn't change","Only when it's output"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Trace it · 8 questions",gen:"bank",bank:"al-trace",explain:"Trace short Python programs by hand and work out their final values and output. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Loops · 2 tasks",type:"py",explain:"Write the loops you've been tracing. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Digit sum",brief:"Ask for a whole number with <span class='mono'>input()</span> and print the sum of its digits, using <span class='mono'>%</span> and <span class='mono'>//</span> in a <span class='mono'>while</span> loop (don't turn it into a string).",
     stdin:["4721"],starter:"n = int(input(\"Number: \"))\ntotal = 0\n# your while loop here\n\nprint(total)",
     tests:[{name:"4721 gives 14",stdin:["4721"],expect:"14"},{name:"9 gives 9",stdin:["9"],expect:"9"},{name:"uses % and //",py:"assert '%' in __code__ and '//' in __code__, 'Use % and // to split off the digits'"}],
     hint:"n % 10 is the last digit; n // 10 removes it. Keep going while n > 0.",
     solution:"n = int(input(\"Number: \"))\ntotal = 0\nwhile n > 0:\n    total = total + n % 10\n    n = n // 10\nprint(total)"},
    {title:"Count up to a limit",brief:"Ask for a limit. Starting at 1, keep doubling a number while it is <b>less than</b> the limit, printing each value.",
     starter:"limit = int(input(\"Limit: \"))\nx = 1\n",
     tests:[{name:"limit 20 prints 1 2 4 8 16",stdin:["20"],expect:"1\n2\n4\n8\n16"},{name:"limit 3 prints 1 and 2",stdin:["3"],expect:"1\n2"}],
     hint:"while x < limit: print(x), then x = x * 2.",
     solution:"limit = int(input(\"Limit: \"))\nx = 1\nwhile x < limit:\n    print(x)\n    x = x * 2"}]}]},
{slug:"recursion",title:"Recursion",covers:[3],
 v:[["Recursion","When a subroutine calls itself to solve a smaller version of the same problem."],
  ["Base case","The condition in which a recursive subroutine stops calling itself and returns a value directly."],
  ["General (recursive) case","The part of a recursive subroutine that calls itself with a smaller input."],
  ["Unwinding","Returning from each recursive call in turn, once the base case has been reached."],
  ["Call stack","The stack of frames for the subroutine calls that have started but not yet finished."],
  ["Stack overflow (recursion)","Running out of stack space because there are too many recursive calls, e.g. with no base case."]],
 q:[["What must every recursive subroutine have?","A base case","A loop","A global variable","Two parameters"],
  ["What happens if a recursive function never reaches its base case?","Stack overflow","It returns 0","It loops forever without using memory","Syntax error"],
  ["def f(n): return 1 if n == 0 else n * f(n - 1). What is f(4)?","24","10","4","16"],
  ["Which is a drawback of recursion compared with iteration?","It uses more memory for stack frames","It's always slower to write","It can't solve every problem","It can't return values"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Recursion · 8 questions",gen:"bank",bank:"al-recursion",explain:"Trace recursive Python functions and answer questions about base cases and the call stack. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Recursion · 2 tasks",type:"py",explain:"Write recursive functions. Each must call itself, with a base case. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Sum to n",brief:"Write a <b>recursive</b> function <span class='mono'>total(n)</span> that returns 1 + 2 + … + n. <span class='mono'>total(0)</span> is 0.",
     starter:"def total(n):\n    pass\n\nprint(total(5))",
     tests:[{name:"total(5) is 15",py:"assert total(5) == 15, 'total(5) should be 15'"},{name:"total(0) is 0",py:"assert total(0) == 0"},{name:"total(100) is 5050",py:"assert total(100) == 5050"},{name:"is recursive",py:"import re\nassert len(re.findall(r'total\\(', __code__)) >= 3, 'total should call itself'"}],
     hint:"Base case: if n == 0, return 0. Otherwise return n + total(n - 1).",
     solution:"def total(n):\n    if n == 0:\n        return 0\n    return n + total(n - 1)\n\nprint(total(5))"},
    {title:"Power",brief:"Write a <b>recursive</b> function <span class='mono'>power(b, e)</span> that returns b to the power e (e ≥ 0) without using <span class='mono'>**</span>.",
     starter:"def power(b, e):\n    pass\n\nprint(power(2, 10))",
     tests:[{name:"power(2, 10) is 1024",py:"assert power(2, 10) == 1024"},{name:"power(5, 0) is 1",py:"assert power(5, 0) == 1"},{name:"power(3, 4) is 81",py:"assert power(3, 4) == 81"},{name:"doesn't use **",py:"assert '**' not in __code__, 'Do it without **'"}],
     hint:"b⁰ = 1 is the base case, and bᵉ = b × bᵉ⁻¹.",
     solution:"def power(b, e):\n    if e == 0:\n        return 1\n    return b * power(b, e - 1)\n\nprint(power(2, 10))"}]}]}]);

L("a5-2",[
{slug:"searching",title:"Linear and binary search",covers:[1,2],
 v:[["Linear search","Checks each item in turn from the start until the item is found or the end is reached."],
  ["Binary search","Repeatedly checks the middle item of a sorted list and discards the half that can't contain the target."],
  ["Midpoint","In a binary search, the index (low + high) // 2."],
  ["Sorted","In order, e.g. ascending; binary search only works on sorted data."],
  ["Iterative","Using a loop to repeat steps."],
  ["Recursive binary search","A binary search that calls itself on the remaining half until the item is found or the range is empty."]],
 q:[["Which search needs the data to be sorted?","Binary search","Linear search","Both","Neither"],
  ["A list has 64 items. What's the most comparisons a binary search needs?","7","6","32","64"],
  ["In a binary search with low = 0 and high = 9, which index is checked first?","4","5","0","9"],
  ["When is a linear search better than a binary search?","When the list is unsorted or very small","When the list is very large and sorted","Never","When the item is in the middle"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Search traces · 8 questions",gen:"alsearch",type:"mixed",explain:"Trace binary searches (list the values checked) and count the comparisons a linear search makes. mid = (low + high) // 2. New lists every try."},
  {id:"py1",title:"Code it",desc:"Searches · 2 tasks",type:"py",explain:"Write a linear search and an iterative binary search. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Linear search",brief:"Write <span class='mono'>linear(items, target)</span> that returns the <b>index</b> of target, or <span class='mono'>-1</span> if it isn't there. Don't use <span class='mono'>.index()</span> or <span class='mono'>in</span> on the list.",
     starter:"def linear(items, target):\n    pass\n\nprint(linear([7, 3, 9, 1], 9))",
     tests:[{name:"finds 9 at index 2",py:"assert linear([7, 3, 9, 1], 9) == 2"},{name:"returns -1 when missing",py:"assert linear([7, 3, 9, 1], 5) == -1"},{name:"finds the first item",py:"assert linear([4], 4) == 0"},{name:"no .index()",py:"assert '.index(' not in __code__"}],
     hint:"for i in range(len(items)): if items[i] == target: return i. After the loop, return -1.",
     solution:"def linear(items, target):\n    for i in range(len(items)):\n        if items[i] == target:\n            return i\n    return -1\n\nprint(linear([7, 3, 9, 1], 9))"},
    {title:"Binary search",brief:"Write an <b>iterative</b> <span class='mono'>binary(items, target)</span> for a sorted list that returns the index of target, or <span class='mono'>-1</span>.",
     starter:"def binary(items, target):\n    low = 0\n    high = len(items) - 1\n    # your loop here\n\nprint(binary([2, 5, 8, 12, 16, 23, 38], 23))",
     tests:[{name:"finds 23 at index 5",py:"assert binary([2, 5, 8, 12, 16, 23, 38], 23) == 5"},{name:"finds the first and last",py:"assert binary([2, 5, 8, 12, 16, 23, 38], 2) == 0 and binary([2, 5, 8, 12, 16, 23, 38], 38) == 6"},{name:"returns -1 when missing",py:"assert binary([2, 5, 8, 12, 16, 23, 38], 9) == -1"},{name:"empty list",py:"assert binary([], 4) == -1"}],
     hint:"while low <= high: mid = (low + high) // 2; compare items[mid] with target and move low or high past mid.",
     solution:"def binary(items, target):\n    low = 0\n    high = len(items) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(binary([2, 5, 8, 12, 16, 23, 38], 23))"}]}]},
{slug:"bubble",title:"Bubble sort",covers:[3],
 v:[["Bubble sort","Repeatedly passes through a list comparing neighbouring items and swapping them if they're in the wrong order."],
  ["Pass","One trip through the list, comparing each neighbouring pair."],
  ["Swap","Exchanging the positions of two items."],
  ["Flag (swapped)","A Boolean that records whether a pass made any swaps; if not, the list is sorted and the sort can stop."],
  ["Ascending","Smallest to largest."],
  ["Descending","Largest to smallest."]],
 q:[["After the first pass of an ascending bubble sort, where is the largest item?","At the end","At the start","In the middle","Anywhere"],
  ["5, 1, 4, 2 after one pass of an ascending bubble sort?","1, 4, 2, 5","1, 2, 4, 5","1, 5, 4, 2","5, 4, 2, 1"],
  ["How does an improved bubble sort know it can stop?","A pass makes no swaps","It reaches the middle","The first item is the smallest","After exactly n passes"],
  ["Which is a benefit of bubble sort?","It's simple to understand and code","It's the fastest sort for large lists","It never swaps items","It doesn't compare items"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Sort traces · 8 questions",gen:"alsort",type:"mixed",explain:"Trace the first pass of a bubble sort and the first passes of an insertion sort. New lists every try."},
  {id:"py1",title:"Code it",desc:"Bubble sort · 1 task",type:"py",explain:"Write a bubble sort that stops early. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Bubble sort",brief:"Complete <span class='mono'>bubble(items)</span> so it sorts the list into <b>ascending</b> order in place, stopping when a pass makes no swaps. Don't use <span class='mono'>sort()</span> or <span class='mono'>sorted()</span>.",
     starter:"def bubble(items):\n    swapped = True\n    while swapped:\n        swapped = False\n        # compare each neighbouring pair here\n\nnums = [5, 1, 4, 2, 8]\nbubble(nums)\nprint(nums)",
     tests:[{name:"sorts 5 1 4 2 8",py:"x = [5, 1, 4, 2, 8]; bubble(x); assert x == [1, 2, 4, 5, 8], x"},{name:"sorts a reversed list",py:"x = list(range(10, 0, -1)); bubble(x); assert x == list(range(1, 11))"},{name:"copes with an empty list",py:"x = []; bubble(x); assert x == []"},{name:"no built-in sort",py:"assert 'sort' not in __code__.replace('bubble', ''), 'Write the sort yourself'"}],
     hint:"for i in range(len(items) - 1): if items[i] > items[i + 1], swap them and set swapped = True.",
     solution:"def bubble(items):\n    swapped = True\n    while swapped:\n        swapped = False\n        for i in range(len(items) - 1):\n            if items[i] > items[i + 1]:\n                items[i], items[i + 1] = items[i + 1], items[i]\n                swapped = True\n\nnums = [5, 1, 4, 2, 8]\nbubble(nums)\nprint(nums)"}]}]},
{slug:"insertion",title:"Insertion sort",covers:[4],
 v:[["Insertion sort","Builds a sorted part at the start of the list, taking each next item and inserting it into the right place in the sorted part."],
  ["Sorted part","The items at the start of the list that are already in order."],
  ["Current item","The item being inserted into the sorted part on this pass."],
  ["Shift","Moving an item one place to the right to make room for the current item."],
  ["Nearly sorted","A list with only a few items out of place: insertion sort handles this quickly."]],
 q:[["At the start of an insertion sort, which part is treated as sorted?","The first item","The last item","The middle item","None of it"],
  ["7, 3, 5, 1. What is the list after the first pass of an insertion sort?","3, 7, 5, 1","3, 5, 7, 1","1, 3, 5, 7","7, 5, 3, 1"],
  ["How many passes does an insertion sort of 6 items need?","5","6","3","36"],
  ["Insertion sort is especially quick when the list is…","nearly sorted","in reverse order","very large","all different"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Sorting quiz · 8 questions",gen:"bank",bank:"al-sorting",explain:"Questions comparing bubble and insertion sort, with Python sorts to read. Every try picks a different set."}]}]);

L("a5-3",[
{slug:"expressions",title:"Boolean expressions",covers:[1],
 v:[["Boolean expression","An expression that evaluates to true (1) or false (0)."],
  ["AND (A.B)","True only when both inputs are true."],
  ["OR (A+B)","True when at least one input is true."],
  ["NOT (Ā)","Reverses the input."],
  ["XOR (A ⊕ B)","True when exactly one input is true."],
  ["NAND","NOT AND: false only when both inputs are true."],
  ["NOR","NOT OR: true only when both inputs are false."],
  ["Order of precedence","The order operators are applied: brackets, then NOT, then AND, then OR."]],
 q:[["A = 1, B = 0. What is A AND B?","0","1","2","A"],
  ["A = 1, B = 1. What is A XOR B?","0","1","2","Undefined"],
  ["Which is evaluated first in NOT A OR B?","NOT A","A OR B","They're done together","B"],
  ["Which is the same as NOT (A AND B)?","NAND","NOR","XOR","OR"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Boolean expressions · 8 questions",gen:"bank",bank:"al-boolean",explain:"Evaluate Boolean expressions in words, symbols and Python. Remember the order: brackets, NOT, AND, OR. Every try picks a different set."}]},
{slug:"truthtables",title:"Truth tables",covers:[2],
 v:[["Truth table","A table showing the output of a logical expression for every possible combination of inputs."],
  ["Rows needed","2ⁿ rows for n inputs: 4 for two inputs, 8 for three."],
  ["Intermediate column","A column for part of an expression, such as A AND B, worked out before the final output."],
  ["Equivalent expressions","Two expressions that give the same output column for every row."],
  ["De Morgan's law","NOT (A AND B) = NOT A OR NOT B, and NOT (A OR B) = NOT A AND NOT B."]],
 q:[["How many rows does a truth table with 3 inputs need?","8","3","6","9"],
  ["What is the output column of A OR B for rows 00, 01, 10, 11?","0111","0001","0110","1110"],
  ["What is the output column of A NAND B for rows 00, 01, 10, 11?","1110","0001","1000","0111"],
  ["Which is equivalent to NOT (A OR B)?","NOT A AND NOT B","NOT A OR NOT B","A AND B","A XOR B"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Truth tables · 8 questions",gen:"altruth",type:"mixed",explain:"Fill in the output column of a truth table, top to bottom. With two inputs the rows are 00, 01, 10, 11. Work out any brackets first. New expressions every try."}]}]);

L("a5-4",[
{slug:"paradigms",title:"Procedural and declarative programming",covers:[1,2],
 v:[["Programming paradigm","A style or approach to writing programs."],
  ["Procedural programming","Programs are written as a sequence of instructions, grouped into procedures and functions, that say exactly how to solve a problem step by step."],
  ["Imperative","Telling the computer how to do something, as a series of commands that change the program's state."],
  ["Declarative programming","Programs describe what result is wanted, and the language works out how to get it."],
  ["SQL","A declarative language for querying databases: you state which data you want, not how to find it."],
  ["Logic programming","A declarative paradigm (e.g. Prolog) in which facts and rules are stated and queries are answered from them."],
  ["Subroutine","A named block of code (procedure or function) that can be called from elsewhere in a program."]],
 q:[["Which language is declarative?","SQL","Python used procedurally","Assembly","C"],
  ["What does a procedural program describe?","How to solve the problem, step by step","Only the result wanted","Only the data","Only the user interface"],
  ["SELECT Name FROM Student WHERE Age > 16 is an example of…","declarative programming","procedural programming","assembly language","machine code"],
  ["Which is a feature of procedural programming?","Programs are broken into procedures and functions","There are no variables","Facts and rules are stated","The language decides the steps"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Paradigms · 8 questions",gen:"bank",bank:"al-paradigms",explain:"Questions on procedural and declarative programming, with code to classify. Every try picks a different set."}]}]);

B("al-algorithms",[
 {t:"mc",q:"Which flowchart symbol starts and ends an algorithm?",a:"Terminator (rounded rectangle)",w:["Diamond","Parallelogram","Rectangle"]},
 {t:"mc",q:"Which flowchart symbol is used for a calculation such as total ← total + x?",a:"Process (rectangle)",w:["Decision (diamond)","Input/output (parallelogram)","Terminator"]},
 {t:"mc",q:"What does a rectangle with double sides show in a flowchart?",a:"A subprocess (a separate subroutine)",w:["A loop","An error","A database"]},
 {t:"mc",q:"How many exits does a decision symbol have?",a:"Two, labelled Yes and No",w:["One","Three","As many as needed"]},
 {t:"mc",q:"Which is NOT a way of writing an algorithm?",a:"A truth table",w:["A flowchart","Written steps in English","Program code"]},
 {t:"mc",html:`<pre class="pc py">nums = [4, 9, 2]
biggest = 0
for n in nums:
    if n &lt; biggest:
        biggest = n
print(biggest)</pre>`,q:"This should print the largest number, but prints 0. What's the logic error?",a:"The comparison should be n &gt; biggest",w:["biggest should start at 9","The loop should use range","print should be inside the loop"]},
 {t:"mc",html:`<pre class="pc py">total = 0
for i in range(1, 10):
    total = total + i
print(total)        # should add 1 to 10</pre>`,q:"What's the logic error?",a:"range(1, 10) stops at 9, so it should be range(1, 11)",w:["total should start at 1","The loop should start at 0","There isn't one"]},
 {t:"mc",html:`<pre class="pc py">count = 0
while count &lt; 5:
    print(count)</pre>`,q:"What's wrong with this loop?",a:"count never changes, so the loop never ends",w:["It prints nothing","It should be a for loop","count should start at 1"]},
 {t:"mc",q:"Algorithm X checks every pair of items in a list. If the list doubles in size, the work roughly…",a:"quadruples",w:["doubles","stays the same","halves"]},
 {t:"mc",q:"Two algorithms give the same correct result. Why might one be chosen over the other?",a:"It uses fewer steps or less memory",w:["It has more lines of code","It uses more variables","It's written in a flowchart"]},
 {t:"mc",q:"Why is breaking an algorithm into subprocesses useful?",a:"Each part can be designed, tested and reused separately",w:["It always makes the program faster","It removes the need for decisions","Flowcharts need it"]},
 {t:"blank",q:"In a flowchart, input and output use a ___ symbol.",a:["parallelogram"]}]);

B("al-trace",[
 {t:"mc",html:`<pre class="pc py">x = 3
y = 5
x = x + y
y = x - y
x = x - y
print(x, y)</pre>`,q:"What is printed?",a:"5 3",w:["3 5","8 3","5 8"]},
 {t:"mc",html:`<pre class="pc py">n = 1
for i in range(4):
    n = n * 2
print(n)</pre>`,q:"What is printed?",a:"16",w:["8","32","4"]},
 {t:"mc",html:`<pre class="pc py">total = 0
for i in range(2, 9, 3):
    total = total + i
print(total)</pre>`,q:"What is printed?",a:"15",w:["20","9","24"]},
 {t:"mc",html:`<pre class="pc py">n = 50
steps = 0
while n &gt; 1:
    n = n // 2
    steps = steps + 1
print(steps)</pre>`,q:"What is printed?",a:"5",w:["6","25","4"]},
 {t:"mc",html:`<pre class="pc py">a = 0
b = 1
for i in range(5):
    a, b = b, a + b
print(a)</pre>`,q:"What is printed?",a:"5",w:["8","3","13"]},
 {t:"mc",html:`<pre class="pc py">word = "level"
rev = ""
for ch in word:
    rev = ch + rev
print(rev == word)</pre>`,q:"What is printed?",a:"True",w:["False","level","An error"]},
 {t:"mc",html:`<pre class="pc py">count = 0
for x in [3, 8, 12, 5, 20]:
    if x % 4 == 0:
        count = count + 1
print(count)</pre>`,q:"What is printed?",a:"3",w:["2","5","1"]},
 {t:"mc",html:`<pre class="pc py">n = 36
d = 2
while n % d != 0 or d * d &lt; n:
    d = d + 1
print(d)</pre>`,q:"What is printed?",a:"6",w:["2","4","36"]},
 {t:"mc",html:`<pre class="pc py">s = 0
for i in range(3):
    for j in range(2):
        s = s + 1
print(s)</pre>`,q:"What is printed?",a:"6",w:["5","3","9"]},
 {t:"mc",q:"What is 23 // 4 and 23 % 4?",a:"5 and 3",w:["5.75 and 3","6 and 1","5 and 0.75"]},
 {t:"blank",q:"Working through an algorithm by hand to check it is called a ___ run.",a:["dry"]},
 {t:"blank",q:"In Python, // gives the whole-number part of a division and ___ gives the remainder.",a:["%"]}]);

B("al-recursion",[
 {t:"mc",html:`<pre class="pc py">def f(n):
    if n == 0:
        return 0
    return n + f(n - 1)
print(f(4))</pre>`,q:"What is printed?",a:"10",w:["4","24","0"]},
 {t:"mc",html:`<pre class="pc py">def f(n):
    if n &lt;= 1:
        return 1
    return n * f(n - 1)
print(f(5))</pre>`,q:"What is printed?",a:"120",w:["15","25","5"]},
 {t:"mc",html:`<pre class="pc py">def g(s):
    if s == "":
        return ""
    return g(s[1:]) + s[0]
print(g("abc"))</pre>`,q:"What is printed?",a:"cba",w:["abc","a","bca"]},
 {t:"mc",html:`<pre class="pc py">def h(n):
    if n &lt; 10:
        return n
    return h(n // 10) + n % 10
print(h(472))</pre>`,q:"What is printed?",a:"13",w:["472","7","2"]},
 {t:"mc",html:`<pre class="pc py">def show(n):
    if n &gt; 0:
        show(n - 1)
        print(n)
show(3)</pre>`,q:"What is printed?",a:"1, 2, 3 on separate lines",w:["3, 2, 1 on separate lines","3 only","Nothing"]},
 {t:"mc",html:`<pre class="pc py">def fib(n):
    if n &lt; 2:
        return n
    return fib(n - 1) + fib(n - 2)
print(fib(6))</pre>`,q:"What is printed?",a:"8",w:["6","13","5"]},
 {t:"mc",html:`<pre class="pc py">def f(n):
    return n * f(n - 1)</pre>`,q:"What's wrong with this function?",a:"It has no base case, so it never stops (stack overflow)",w:["It has no parameters","It should use a loop","Nothing"]},
 {t:"mc",q:"What is stored in each stack frame of a recursive call?",a:"The return address, parameters and local variables",w:["The whole program","The result of the base case only","Nothing: recursion doesn't use the stack"]},
 {t:"mc",q:"f(4) calls f(3), which calls f(2), which reaches the base case. How many frames are on the stack at that moment (for f)?",a:"3",w:["1","2","4"]},
 {t:"mc",q:"Which is an advantage of recursion?",a:"Some problems, like tree traversal, can be written more simply and clearly",w:["It always uses less memory","It's always faster","It never causes errors"]},
 {t:"blank",q:"The condition that stops a recursive function calling itself is the ___ case.",a:["base"]},
 {t:"blank",q:"Too many recursive calls cause a stack ___.",a:["overflow"]}]);

B("al-sorting",[
 {t:"mc",q:"Which statement about bubble and insertion sort is true?",a:"Both sort the list in place without needing a second list",w:["Insertion sort needs the list to be sorted first","Bubble sort only works on numbers","Both need recursion"]},
 {t:"mc",q:"An insertion sort has sorted part 2, 6, 9 and the next item is 5. What is the sorted part after this pass?",a:"2, 5, 6, 9",w:["2, 6, 9, 5","5, 2, 6, 9","2, 6, 5, 9"]},
 {t:"mc",q:"Which sort works well when items arrive one at a time and must be kept in order?",a:"Insertion sort",w:["Bubble sort","Binary search","Linear search"]},
 {t:"mc",q:"A list is already sorted. What does an improved bubble sort do?",a:"One pass with no swaps, then stops",w:["n passes","No passes at all","Reverses the list"]},
 {t:"mc",q:"How many comparisons does one full pass of a bubble sort make on 8 items?",a:"7",w:["8","28","4"]},
 {t:"mc",q:"Which is a drawback of both bubble and insertion sort on large unsorted lists?",a:"They are slow: the work grows with the square of the list size",w:["They use lots of extra memory","They can't sort strings","They lose data"]},
 {t:"mc",html:`<pre class="pc py">a = [4, 1, 3]
a[0], a[1] = a[1], a[0]
print(a)</pre>`,q:"What is printed?",a:"[1, 4, 3]",w:["[4, 1, 3]","[1, 1, 3]","[3, 1, 4]"]},
 {t:"mc",html:`<pre class="pc py">items = [6, 2, 9, 4]
for i in range(len(items) - 1):
    if items[i] &gt; items[i + 1]:
        items[i], items[i + 1] = items[i + 1], items[i]
print(items)</pre>`,q:"What is printed?",a:"[2, 6, 4, 9]",w:["[2, 4, 6, 9]","[6, 2, 9, 4]","[2, 6, 9, 4]"]},
 {t:"mc",html:`<pre class="pc py">items = [5, 8, 3, 1]
for i in range(1, 3):
    cur = items[i]
    j = i - 1
    while j &gt;= 0 and items[j] &gt; cur:
        items[j + 1] = items[j]
        j = j - 1
    items[j + 1] = cur
print(items)</pre>`,q:"What is printed after these two passes of an insertion sort?",a:"[3, 5, 8, 1]",w:["[1, 3, 5, 8]","[5, 8, 3, 1]","[5, 3, 8, 1]"]},
 {t:"mc",q:"In the insertion sort code, what does the while loop do?",a:"Shifts larger items in the sorted part one place right",w:["Swaps neighbouring pairs across the whole list","Finds the middle item","Counts the passes"]},
 {t:"mc",q:"Which change would make a bubble sort put items in descending order?",a:"Swap when items[i] &lt; items[i + 1]",w:["Start the loop at the end","Use range(len(items))","Remove the swapped flag"]},
 {t:"blank",q:"In a bubble sort, one trip through the list is called a ___.",a:["pass"]}]);

B("al-boolean",[
 {t:"mc",q:"A = 0, B = 1. What is NOT A AND B?",a:"1",w:["0","2","Undefined"]},
 {t:"mc",q:"A = 1, B = 1, C = 0. What is A OR B AND C?",a:"1",w:["0","2","It depends on the order"]},
 {t:"mc",q:"A = 1, B = 0. What is A NOR B?",a:"0",w:["1","2","10"]},
 {t:"mc",q:"Which notation means A AND B?",a:"A.B",w:["A+B","A ⊕ B","Ā"]},
 {t:"mc",q:"Which notation means A XOR B?",a:"A ⊕ B",w:["A.B","A+B","A̅B̅"]},
 {t:"mc",q:"A heating system turns on (H) when it's cold (C) and someone is home (P), or when frost (F) is detected. Which expression fits?",a:"H = (C AND P) OR F",w:["H = C AND (P OR F)","H = C OR P OR F","H = C AND P AND F"]},
 {t:"mc",q:"An alarm sounds if exactly one of two sensors is triggered. Which operator?",a:"XOR",w:["AND","OR","NAND"]},
 {t:"mc",html:`<pre class="pc py">a, b = True, False
print(not a or b)</pre>`,q:"What is printed?",a:"False",w:["True","None","An error"]},
 {t:"mc",html:`<pre class="pc py">a, b, c = True, False, True
print(a and not (b or c))</pre>`,q:"What is printed?",a:"False",w:["True","None","An error"]},
 {t:"mc",html:`<pre class="pc py">age, member = 17, True
print(age &gt;= 18 or member)</pre>`,q:"What is printed?",a:"True",w:["False","17","An error"]},
 {t:"mc",html:`<pre class="pc py">x = 7
print(x &gt; 0 and x % 2 == 0)</pre>`,q:"What is printed?",a:"False",w:["True","7","1"]},
 {t:"mc",q:"Which gives the same result as NOT (A OR B)?",a:"NOT A AND NOT B",w:["NOT A OR NOT B","A AND B","NOT A OR B"]}]);

B("al-paradigms",[
 {t:"mc",q:"Which describes declarative programming?",a:"You state what you want, and the system works out how",w:["You list every step the computer must take","You write only in binary","You use only loops"]},
 {t:"mc",q:"Which describes procedural programming?",a:"A sequence of instructions, organised into procedures and functions",w:["Facts and rules with queries","Only describing the result","Objects sending messages"]},
 {t:"mc",q:"A Python program reads marks into a list, loops through them and prints the average. Which paradigm is it?",a:"Procedural",w:["Declarative","Logic","None"]},
 {t:"mc",q:"Which of these is a declarative language?",a:"Prolog",w:["Python used procedurally","Assembly language","BASIC"]},
 {t:"mc",q:"An SQL query asks for all students older than 16. Who decides how the data is found?",a:"The database management system",w:["The programmer, step by step","The operating system scheduler","The user, by hand"]},
 {t:"mc",q:"Which is a benefit of declarative programming?",a:"Short, readable code that focuses on the result",w:["Full control over every step","It's always faster to run","It has no syntax"]},
 {t:"mc",q:"Which is a benefit of procedural programming?",a:"The programmer has precise control over how the problem is solved",w:["The language chooses the algorithm","Programs never contain loops","It needs no variables"]},
 {t:"mc",q:"Which is an example of a declarative statement?",a:"parent(ana, ben).",w:["for i in range(10):","x = x + 1","print(total)"]},
 {t:"mc",q:"In Prolog, what are 'facts' and 'rules'?",a:"The knowledge from which queries are answered",w:["Loops and variables","Procedures and functions","Registers and buses"]},
 {t:"mc",q:"Why do procedural programs use subroutines?",a:"To break the problem into smaller, reusable parts",w:["Because the language requires one per line","To avoid using variables","To make it declarative"]},
 {t:"blank",q:"SQL is an example of a ___ language.",a:["declarative"]},
 {t:"blank",q:"A style or approach to programming is called a programming ___.",a:["paradigm"]}]);

P("a5-1-algorithms",`Algorithm | Steps that solve a problem
Terminator | Start or end
Diamond | Decision
Parallelogram | Input or output
Rectangle | Process
Double-sided rectangle | Subprocess
Decision exits | Yes and No
Flow line | Shows the order
Logic error | Runs, wrong result
Syntax error | Breaks language rules
Efficiency | Time and memory used
Doubling data, double work | Linear growth
Doubling data, four times work | Quadratic growth
Ways to write algorithms | Words, flowcharts, code
Decomposition | Splitting into parts
Abstraction | Hiding unneeded detail
range(1, 10) | Stops at 9
Infinite loop | Condition never false`);

P("a5-1-trace",`Trace table | Variables, line by line
Dry run | Checking by hand
Iteration | One pass of a loop
for loop | Count-controlled
while loop | Condition-controlled
17 // 5 | 3
17 % 5 | 2
23 // 4 | 5
29 % 4 | 1
range(4) | 0, 1, 2, 3
range(2, 9, 3) | 2, 5, 8
n % 10 | Last digit of n
n // 10 | Removes the last digit
x % 2 == 0 | x is even
Swap with a temp | t = a; a = b; b = t
Nested loops 3 × 2 | 6 iterations
Output column | What's printed
New value written | When assigned`);

P("a5-1-recursion",`Recursion | A function calls itself
Base case | Stops the recursion
General case | Calls itself, smaller
No base case | Stack overflow
Unwinding | Returning from each call
Call stack | Frames not yet finished
Stack frame | One call's data
f(4) = 4 × f(3) | Factorial
fact(5) | 120
sum to 4 recursively | 10
fib(6) | 8
Reverse "abc" | cba
Recursion benefit | Clear for some problems
Recursion drawback | Uses more memory
Iteration | Uses a loop instead
Each call's n | Its own local copy
Recursive binary search | Calls on one half
Tree traversal | Suits recursion`);

P("a5-2-searching",`Linear search | Checks each item in turn
Binary search | Halves the list each time
Binary search needs | Sorted data
Midpoint | (low + high) // 2
Target bigger than mid | low = mid + 1
Target smaller than mid | high = mid - 1
Not found when | low > high
1000 items, binary | About 10 checks
1000 items, linear | Up to 1000 checks
64 items, binary at most | 7 comparisons
low 0, high 9 | Check index 4
Linear on unsorted data | Must check to the end
Linear on sorted data | Can stop early
Small or unsorted list | Use linear search
Iterative binary search | Uses a while loop
Recursive binary search | Calls itself on a half
Linear returns if missing | −1
Item found | Return its index`);

P("a5-2-bubble",`Bubble sort | Swaps neighbours
Pass | One trip through the list
Swap | Exchange two items
After pass 1 | Largest at the end
swapped flag | Stops when no swaps
Best case | Already sorted
Worst case | Reverse order
5, 1, 4, 2 after pass 1 | 1, 4, 2, 5
Comparisons per pass, 8 items | 7
Ascending | Smallest first
Descending | Largest first
Python swap | a, b = b, a
Bubble benefit | Simple to code
Bubble drawback | Slow on big lists
In place | No second list
Compare items[i] with | items[i + 1]
Descending bubble sort | Swap if smaller
Maximum passes, n items | n − 1`);

P("a5-2-insertion",`Insertion sort | Inserts into sorted part
Sorted part at start | The first item
Current item | Being inserted
Shift | Move one place right
7, 3, 5, 1 after pass 1 | 3, 7, 5, 1
2, 6, 9 then insert 5 | 2, 5, 6, 9
Passes for 6 items | 5
Fast on | Nearly sorted lists
Slow on | Reverse-ordered lists
Inner while loop | Shifts larger items
Stops shifting when | Item is not bigger
Insertion benefit | Good for small lists
Insertion drawback | Slow on large lists
Items arriving one by one | Keep them in order
Both bubble and insertion | Sort in place
Work grows with | Square of the size
After pass p | First p + 1 sorted
j = i − 1 | Start of the sorted part`);

P("a5-3-expressions",`AND | Both true
OR | At least one true
NOT | Reverses the input
XOR | Exactly one true
NAND | Not both true
NOR | Neither true
A.B | A AND B
A+B | A OR B
A ⊕ B | A XOR B
First in precedence | Brackets
NOT A AND B | NOT applied first
A OR B AND C | AND applied first
Lowest precedence | The OR operator
1 AND 0 | 0
1 XOR 1 | 0 (inputs match)
0 NOR 0 | 1
Python and | Boolean AND
Python not | Boolean NOT`);

P("a5-3-truthtables",`Truth table | Every input combination
2 inputs | 4 rows
3 inputs | 8 rows
n inputs | 2 to the n rows
A AND B column | 0001
A OR B column | 0111
A XOR B column | 0110
A NAND B column | 1110
A NOR B column | 1000
NOT A column (A = 0, 1) | 1, 0
Intermediate column | Part of the expression
Equivalent expressions | Same output column
NOT (A AND B) | NOT A OR NOT B
NOT (A OR B) | NOT A AND NOT B
De Morgan | Swap AND/OR, negate
Rows for A B | 00, 01, 10, 11
Work out first | Brackets
Last column | Final output`);

P("a5-4-paradigms",`Paradigm | A style of programming
Procedural | Step-by-step instructions
Declarative | Describe the result
Imperative | Commands that change state
SQL | Declarative query language
Prolog | Logic programming
Python loops | Procedural style
Procedures and functions | Subroutines
Who decides how in SQL | The DBMS
Facts and rules | Logic programs
parent(ana, ben). | A Prolog fact
Procedural benefit | Precise control
Declarative benefit | Short, readable code
SELECT ... WHERE | Says what, not how
x = x + 1 | Changes state
Query in Prolog | Asks about facts
Subroutine benefit | Reusable code
Procedural drawback | More code to write`);
