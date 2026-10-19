/* 9 Best practice: 9.1 Program design, 9.2 Clean code, 9.3 Functionality */
L("a9-1",[
{slug:"design",title:"Designing correct solutions",covers:[1],
 v:[["Requirements","What a program must do, worked out before writing any code."],
  ["Decomposition","Breaking a problem into smaller sub-problems, each simple enough to solve on its own."],
  ["Input, process, output","A way to plan a program: what data goes in, what is done to it, and what comes out."],
  ["Clear logic","Conditions and loops arranged so that every case is handled once, in a sensible order."],
  ["Suitable variable","A variable of the right data type and scope, with a name that says what it holds."],
  ["Suitable data structure","The structure that fits how the data is used, e.g. a dictionary to look up by name."],
  ["Suitable construct","Choosing the right selection or loop, e.g. a while loop when the number of repeats isn't known."]],
 q:[["A program must keep asking for a PIN until it's correct. Which loop suits it best?","while","for","Nested for","No loop"],
  ["Which structure suits looking up a product's price from its code?","A dictionary","A tuple","A set","A string"],
  ["What should you do first when given a programming task?","Work out the requirements: inputs, processing and outputs","Start typing code","Choose variable names","Write the test plan's expected results"],
  ["Why decompose a problem?","Each smaller part is easier to solve, test and reuse","It makes the program longer","Python requires it","It removes the need for testing"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Design choices · 8 questions",gen:"bank",bank:"al-design",explain:"Choose suitable constructs, data structures and data types for problems, and spot faulty logic. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Build from a design · 3 tasks",type:"py",explain:"A program for a cinema has been decomposed into three functions. Write each one to its specification. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Ticket price",brief:"<span class='mono'>ticket_price(age)</span> returns the price: under 12 pay 5.50, 65 and over pay 6.00, everyone else pays 9.00.",
     starter:"def ticket_price(age):\n    pass\n\nprint(ticket_price(30))",
     tests:[{name:"child",py:"assert ticket_price(11) == 5.5"},{name:"12 is an adult",py:"assert ticket_price(12) == 9.0"},{name:"64 is an adult",py:"assert ticket_price(64) == 9.0"},{name:"65 is a senior",py:"assert ticket_price(65) == 6.0"}],
     hint:"Use if, elif, else. Check age < 12 first, then age >= 65.",
     solution:"def ticket_price(age):\n    if age < 12:\n        return 5.50\n    elif age >= 65:\n        return 6.00\n    else:\n        return 9.00\n\nprint(ticket_price(30))"},
    {title:"Booking total",brief:"<span class='mono'>booking_total(ages)</span> takes a list of ages and returns the total price for the group, using <span class='mono'>ticket_price</span>. Groups of 6 or more get 10% off. Round the result to 2 decimal places.",
     starter:"def ticket_price(age):\n    if age < 12:\n        return 5.50\n    elif age >= 65:\n        return 6.00\n    return 9.00\n\ndef booking_total(ages):\n    pass\n\nprint(booking_total([40, 38, 9]))",
     tests:[{name:"family of three",py:"assert booking_total([40, 38, 9]) == 23.5, booking_total([40, 38, 9])"},{name:"group of six gets 10% off",py:"assert booking_total([20] * 6) == 48.6, booking_total([20] * 6)"},{name:"empty booking",py:"assert booking_total([]) == 0"},{name:"reuses ticket_price",py:"assert __code__.count('ticket_price(') >= 2"}],
     hint:"Add up ticket_price(a) for each age. If len(ages) >= 6, multiply by 0.9. Then round(total, 2).",
     solution:"def ticket_price(age):\n    if age < 12:\n        return 5.50\n    elif age >= 65:\n        return 6.00\n    return 9.00\n\ndef booking_total(ages):\n    total = 0\n    for a in ages:\n        total = total + ticket_price(a)\n    if len(ages) >= 6:\n        total = total * 0.9\n    return round(total, 2)\n\nprint(booking_total([40, 38, 9]))"},
    {title:"Seats left",brief:"Seats are stored in a dictionary of screen: seats left. <span class='mono'>book(seats, screen, n)</span> takes n seats from that screen and returns True, or returns False and changes nothing if the screen doesn't exist or there aren't enough seats.",
     starter:"def book(seats, screen, n):\n    pass\n\nseats = {\"Screen 1\": 40, \"Screen 2\": 3}\nprint(book(seats, \"Screen 2\", 2), seats)",
     tests:[{name:"books seats",py:"s = {'A': 10}; assert book(s, 'A', 4) is True and s['A'] == 6"},{name:"not enough",py:"s = {'A': 3}; assert book(s, 'A', 4) is False and s['A'] == 3"},{name:"no such screen",py:"s = {'A': 3}; assert book(s, 'B', 1) is False and s == {'A': 3}"},{name:"exactly enough",py:"s = {'A': 4}; assert book(s, 'A', 4) is True and s['A'] == 0"}],
     hint:"if screen not in seats or seats[screen] < n: return False. Otherwise subtract and return True.",
     solution:"def book(seats, screen, n):\n    if screen not in seats or seats[screen] < n:\n        return False\n    seats[screen] = seats[screen] - n\n    return True\n\nseats = {\"Screen 1\": 40, \"Screen 2\": 3}\nprint(book(seats, \"Screen 2\", 2), seats)"}]}]},
{slug:"modular",title:"Modular code",covers:[2,3],
 v:[["Modularity","Building a program from separate, self-contained subprograms."],
  ["Separation of concerns","Each part of a program does one job, e.g. input, calculation and output are kept apart."],
  ["Side effect","A change a subprogram makes outside itself, such as altering a global variable or a list it was passed."],
  ["Scope isolation","Keeping variables local to the subprogram that uses them."],
  ["Library","A collection of ready-made subprograms you can import, e.g. math, random, statistics."],
  ["Procedure","A subprogram that carries out a task and doesn't return a value."],
  ["Function","A subprogram that returns a value."]],
 q:[["Which is a side effect?","A function changes a global variable","A function returns a value","A function has two parameters","A function uses a local variable"],
  ["Why is a function with no side effects easier to test?","Its result depends only on its parameters","It runs faster","It can't have errors","It doesn't need parameters"],
  ["What is separation of concerns?","Each part of the program has one job","Each line has a comment","Global variables are separated by blank lines","Code is split across many files"],
  ["Which line imports one function from a library?","from statistics import mean","import mean from statistics","include statistics.mean","using statistics(mean)"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Modular design · 8 questions",gen:"bank",bank:"al-modular",explain:"Questions on side effects, scope, separation of concerns and libraries. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Modular code · 3 tasks",type:"py",explain:"Rewrite code so it is modular and free of side effects. Press Run to try your code, then Check to test it.",
   tasks:[{title:"No side effects",brief:"<span class='mono'>add_vat</span> changes the list it is given. Rewrite it so it <b>returns a new list</b> of prices with 20% added (rounded to 2 decimal places) and leaves the original list unchanged.",
     starter:"def add_vat(prices):\n    for i in range(len(prices)):\n        prices[i] = round(prices[i] * 1.2, 2)\n    return prices\n\nnet = [10.0, 2.5, 7.99]\ngross = add_vat(net)\nprint(net, gross)",
     tests:[{name:"returns the new prices",py:"assert add_vat([10.0, 2.5]) == [12.0, 3.0]"},{name:"original unchanged",py:"p = [10.0, 7.99]; q = add_vat(p); assert p == [10.0, 7.99] and q == [12.0, 9.59], (p, q)"}],
     hint:"Make a new empty list, append round(p * 1.2, 2) for each price, and return it.",
     solution:"def add_vat(prices):\n    result = []\n    for p in prices:\n        result.append(round(p * 1.2, 2))\n    return result\n\nnet = [10.0, 2.5, 7.99]\ngross = add_vat(net)\nprint(net, gross)"},
    {title:"Remove the global",brief:"<span class='mono'>count_long</span> relies on a global variable. Rewrite it so it takes the list and the minimum length as <b>parameters</b> and returns the count, with no <span class='mono'>global</span> keyword.",
     starter:"words = [\"to\", \"python\", \"code\", \"loop\", \"variable\"]\ncount = 0\n\ndef count_long():\n    global count\n    for w in words:\n        if len(w) >= 5:\n            count = count + 1\n\ncount_long()\nprint(count)",
     tests:[{name:"count_long(words, 5)",py:"assert count_long(['to', 'python', 'code', 'loop', 'variable'], 5) == 2"},{name:"count_long(words, 4)",py:"assert count_long(['to', 'python', 'code', 'loop', 'variable'], 4) == 4"},{name:"same answer twice",py:"w = ['abcde']; assert count_long(w, 5) == 1 and count_long(w, 5) == 1"},{name:"no global",py:"assert 'global' not in __code__"}],
     hint:"def count_long(words, min_len): with a local count = 0, and return count at the end.",
     solution:"def count_long(words, min_len):\n    count = 0\n    for w in words:\n        if len(w) >= min_len:\n            count = count + 1\n    return count\n\nwords = [\"to\", \"python\", \"code\", \"loop\", \"variable\"]\nprint(count_long(words, 5))"},
    {title:"Use a library",brief:"Write <span class='mono'>summary(data)</span> that returns a tuple (mean, median, standard deviation), each rounded to 2 decimal places, using the <span class='mono'>statistics</span> library rather than writing the calculations yourself.",
     starter:"def summary(data):\n    pass\n\nprint(summary([4, 8, 6, 5, 3, 7]))",
     tests:[{name:"example",py:"assert summary([4, 8, 6, 5, 3, 7]) == (5.5, 5.5, 1.87), summary([4, 8, 6, 5, 3, 7])"},{name:"odd length",py:"assert summary([1, 2, 9]) == (4.0, 2, 4.36), summary([1, 2, 9])"},{name:"uses statistics",py:"assert 'statistics' in __code__"}],
     hint:"import statistics, then statistics.mean(data), statistics.median(data) and statistics.stdev(data).",
     solution:"import statistics\n\ndef summary(data):\n    return (round(statistics.mean(data), 2), round(statistics.median(data), 2), round(statistics.stdev(data), 2))\n\nprint(summary([4, 8, 6, 5, 3, 7]))"}]}]}]);

L("a9-2",[
{slug:"style",title:"Consistent, readable code",covers:[1,2],
 v:[["White space","Blank lines and spaces that separate parts of the code so it is easier to read."],
  ["Naming convention","A consistent style for names; in Python, snake_case for variables and functions and CAPITALS for constants."],
  ["Line length","Keeping lines short (PEP 8 suggests 79 characters) so code can be read without scrolling."],
  ["Meaningful identifier","A name that says what a variable or subprogram holds or does, e.g. total_cost rather than t."],
  ["Named constant","A value that doesn't change, given a name in capitals, e.g. VAT_RATE = 0.2."],
  ["Magic number","An unexplained number written straight into code."],
  ["Comment","A note for human readers, after #, explaining why the code does something."]],
 q:[["Which is the best name for a variable holding the number of lives left?","lives_left","l","LivesLeft","x2"],
  ["What is a magic number?","An unexplained number written straight into the code","A random number","A number stored in a constant","A very large number"],
  ["Which follows Python's convention for a constant?","MAX_SPEED = 70","maxSpeed = 70","max_speed = 70","Max-Speed = 70"],
  ["What should a good comment explain?","Why the code does something","What every single line does","The date it was written","Nothing; comments slow code down"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Readable code · 8 questions",gen:"bank",bank:"al-style",explain:"Spot good and poor naming, layout, constants and comments. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Tidy up code · 2 tasks",type:"py",explain:"Make working code readable without changing what it does. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Rename and constant",brief:"Rewrite this function as <span class='mono'>delivery_cost(weight)</span> with a meaningful parameter name, and replace the magic numbers with constants <span class='mono'>BASE_COST</span> (3.5) and <span class='mono'>COST_PER_KG</span> (1.2). It must give the same results.",
     starter:"def d(w):\n    return round(3.5+w*1.2,2)\n\nprint(d(2))",
     tests:[{name:"delivery_cost(2)",py:"assert delivery_cost(2) == 5.9"},{name:"delivery_cost(0)",py:"assert delivery_cost(0) == 3.5"},{name:"constants used",py:"assert BASE_COST == 3.5 and COST_PER_KG == 1.2 and '3.5+' not in __code__.replace(' ', '') and '*1.2' not in __code__.replace(' ', '')"},{name:"meaningful parameter",py:"import inspect; assert len(list(inspect.signature(delivery_cost).parameters)[0]) > 2"}],
     hint:"BASE_COST = 3.5 and COST_PER_KG = 1.2 at the top; then return round(BASE_COST + weight * COST_PER_KG, 2).",
     solution:"BASE_COST = 3.5\nCOST_PER_KG = 1.2\n\ndef delivery_cost(weight):\n    return round(BASE_COST + weight * COST_PER_KG, 2)\n\nprint(delivery_cost(2))"},
    {title:"Extract a subprogram",brief:"The same calculation appears twice. Write a function <span class='mono'>area(width, height)</span> and use it for both rooms, so <span class='mono'>total</span> is still 31.5.",
     starter:"w1 = 4.5\nh1 = 3\na1 = w1 * h1\nw2 = 6\nh2 = 3\na2 = w2 * h2\ntotal = a1 + a2\nprint(total)",
     tests:[{name:"area works",py:"assert area(2, 5) == 10"},{name:"total is 31.5",py:"assert total == 31.5"},{name:"area is used twice",py:"assert __code__.count('area(') >= 3"}],
     hint:"def area(width, height): return width * height, then total = area(4.5, 3) + area(6, 3).",
     solution:"def area(width, height):\n    return width * height\n\ntotal = area(4.5, 3) + area(6, 3)\nprint(total)"}]}]},
{slug:"robust",title:"Controlling behaviour",covers:[3],
 v:[["Boundary value analysis","Testing at the edges of a valid range, and just outside them, where errors are most likely."],
  ["Exception handling","Catching errors with try and except so the program can recover instead of crashing."],
  ["Guard clause","A check at the start of a subprogram that deals with an invalid case and returns straight away."],
  ["Nesting","Placing one if or loop inside another; deep nesting makes code hard to follow."],
  ["Managed type conversion","Converting data deliberately and checking it can be converted, e.g. before int(text)."],
  ["Validation","Checking that input is sensible before using it: range, type, length, presence, format."],
  ["Off-by-one error","A mistake where a loop or condition is one step out, e.g. < where <= was needed."]],
 q:[["A mark must be from 0 to 100. Which are boundary test values?","-1, 0, 100 and 101","50","0 and 50","-50 and 150"],
  ["Which exception does int(\"abc\") raise?","ValueError","TypeError","ZeroDivisionError","KeyError"],
  ["What does a guard clause do?","Handles an invalid case first and leaves the subprogram","Repeats code until input is valid","Protects a variable from being changed","Catches every possible error"],
  ["Why reduce nesting?","Flatter code is easier to read and test","Nested code doesn't run","Python allows only one level","It uses less memory"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Robust code · 8 questions",gen:"bank",bank:"al-robust",explain:"Questions on boundary values, exceptions, guard clauses and safe type conversion. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Robust code · 3 tasks",type:"py",explain:"Make programs handle bad data safely. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Keep asking",brief:"Ask for a quantity from 1 to 12. Keep asking until the input is a whole number in range, printing <span class='mono'>Invalid</span> after each bad try. Then print <span class='mono'>Ordered 5</span> (or whatever was entered). Don't let a non-number crash it.",
     stdin:["ten","0","5"],starter:"qty = int(input(\"Quantity (1-12): \"))\nprint(\"Ordered\", qty)",
     tests:[{name:"good first time",stdin:["5"],expect:"Ordered 5"},{name:"text, then 0, then 5",stdin:["ten","0","5"],expect:["Invalid","Ordered 5"]},{name:"13 then 12",stdin:["13","12"],expect:["Invalid","Ordered 12"]},{name:"1 is allowed",stdin:["1"],expect:"Ordered 1"}],
     hint:"while True: try int(input(...)); if 1 <= qty <= 12: break. Print Invalid in the except block and when it's out of range.",
     solution:"while True:\n    try:\n        qty = int(input(\"Quantity (1-12): \"))\n        if 1 <= qty <= 12:\n            break\n    except ValueError:\n        pass\n    print(\"Invalid\")\nprint(\"Ordered\", qty)"},
    {title:"Guard clauses",brief:"Rewrite <span class='mono'>grade(mark)</span> with <b>guard clauses</b> so there is no <span class='mono'>else</span> and no nesting. It must return the same results: \"Invalid\" outside 0–100, otherwise \"Pass\" for 40 or more and \"Fail\" below.",
     starter:"def grade(mark):\n    if mark >= 0:\n        if mark <= 100:\n            if mark >= 40:\n                return \"Pass\"\n            else:\n                return \"Fail\"\n        else:\n            return \"Invalid\"\n    else:\n        return \"Invalid\"\n",
     tests:[{name:"boundaries",py:"assert [grade(m) for m in [-1, 0, 39, 40, 100, 101]] == ['Invalid', 'Fail', 'Fail', 'Pass', 'Pass', 'Invalid']"},{name:"no else",py:"assert 'else' not in __code__"},{name:"no nesting",py:"assert not any(l.startswith('        if') for l in __code__.split('\\n')), 'an if is still nested'"}],
     hint:"if mark < 0 or mark > 100: return \"Invalid\". Then if mark >= 40: return \"Pass\". Finally return \"Fail\".",
     solution:"def grade(mark):\n    if mark < 0 or mark > 100:\n        return \"Invalid\"\n    if mark >= 40:\n        return \"Pass\"\n    return \"Fail\"\n"},
    {title:"Safe average",brief:"<span class='mono'>safe_mean(items)</span> gets a list of strings from a file. Return the mean of those that convert to numbers (use <span class='mono'>float</span>), ignoring the rest, rounded to 2 decimal places. Return <span class='mono'>None</span> if none convert.",
     starter:"def safe_mean(items):\n    pass\n\nprint(safe_mean([\"4\", \"x\", \"5.5\", \"\", \"6\"]))",
     tests:[{name:"skips bad values",py:"assert safe_mean(['4', 'x', '5.5', '', '6']) == 5.17, safe_mean(['4', 'x', '5.5', '', '6'])"},{name:"all good",py:"assert safe_mean(['1', '2']) == 1.5"},{name:"nothing valid",py:"assert safe_mean(['a', '']) is None and safe_mean([]) is None"},{name:"uses try",py:"assert 'try' in __code__ and 'except' in __code__"}],
     hint:"Loop over items with try: nums.append(float(s)) except ValueError: pass. Guard against an empty nums before dividing.",
     solution:"def safe_mean(items):\n    nums = []\n    for s in items:\n        try:\n            nums.append(float(s))\n        except ValueError:\n            pass\n    if not nums:\n        return None\n    return round(sum(nums) / len(nums), 2)\n\nprint(safe_mean([\"4\", \"x\", \"5.5\", \"\", \"6\"]))"}]}]}]);

L("a9-3",[
{slug:"testing",title:"Testing, debugging and refining",covers:[1],
 v:[["Syntax error","Code that breaks the rules of the language, so it won't run at all, e.g. a missing colon."],
  ["Runtime error","An error that happens while the program runs and crashes it, e.g. dividing by zero."],
  ["Logic error","The program runs but gives the wrong result, e.g. using < instead of <=."],
  ["Test plan","A table of tests: test data, type (normal, boundary or erroneous), expected result and actual result."],
  ["Debugging","Finding and fixing errors, e.g. with print statements, trace tables or breakpoints."],
  ["Breakpoint","A line where a debugger pauses the program so you can inspect the variables."],
  ["Refining","Improving working code after review: clearer, more efficient or better at meeting the requirements."]],
 q:[["A program prints the wrong total but doesn't crash. What type of error is this?","Logic error","Syntax error","Runtime error","Type conversion"],
  ["Which error stops a program from starting at all?","Syntax error","Logic error","Runtime error","Boundary error"],
  ["What is a breakpoint?","A point where the debugger pauses the program","A line that crashes the program","A boundary value in a test plan","The end of a loop"],
  ["Why record the actual result in a test plan?","To compare it with the expected result","To make the program run","To choose the test data","To fix syntax errors"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Find the bug · 8 questions",gen:"bank",bank:"al-testing",explain:"Classify errors, read test plans and find the bug in short programs. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Debug it · 4 tasks",type:"py",explain:"Each program has a bug. Run it, find what's wrong and fix it. Press Check to test your fix.",
   tasks:[{title:"Syntax errors",brief:"This program has three <b>syntax errors</b>. Fix them so it prints the numbers 1 to 5 and their squares.",
     starter:"for n in range(1, 6)\n    square = n * n\n    print(n, square\nprint(\"Done)",
     tests:[{name:"prints 5 25",stdin:[],expect:["1 1","5 25","Done"]}],
     hint:"Look for a missing colon, a missing bracket and a missing quotation mark.",
     solution:"for n in range(1, 6):\n    square = n * n\n    print(n, square)\nprint(\"Done\")"},
    {title:"Wrong answer",brief:"<span class='mono'>count_passes</span> should count marks of <b>40 or more</b>, but it gives the wrong answer for some lists. Find and fix the <b>logic error</b>.",
     starter:"def count_passes(marks):\n    count = 0\n    for m in marks:\n        if m > 40:\n            count = count + 1\n    return count\n\nprint(count_passes([39, 40, 41]))",
     tests:[{name:"boundary 40",py:"assert count_passes([39, 40, 41]) == 2, count_passes([39, 40, 41])"},{name:"none pass",py:"assert count_passes([10, 39]) == 0"},{name:"all pass",py:"assert count_passes([40, 100]) == 2"}],
     hint:"Test with the boundary value 40. Should 40 count?",
     solution:"def count_passes(marks):\n    count = 0\n    for m in marks:\n        if m >= 40:\n            count = count + 1\n    return count\n\nprint(count_passes([39, 40, 41]))"},
    {title:"It crashes",brief:"<span class='mono'>largest</span> should return the biggest number in a list, but it crashes with an IndexError, and it gives the wrong answer when every number is negative. Fix both <b>bugs</b>.",
     starter:"def largest(nums):\n    biggest = 0\n    for i in range(len(nums) + 1):\n        if nums[i] > biggest:\n            biggest = nums[i]\n    return biggest\n\nprint(largest([4, 9, 2]))",
     tests:[{name:"[4, 9, 2]",py:"assert largest([4, 9, 2]) == 9"},{name:"all negative",py:"assert largest([-5, -2, -8]) == -2, largest([-5, -2, -8])"},{name:"one item",py:"assert largest([7]) == 7"}],
     hint:"range(len(nums)) stops at the last index. Start biggest at nums[0] instead of 0.",
     solution:"def largest(nums):\n    biggest = nums[0]\n    for i in range(len(nums)):\n        if nums[i] > biggest:\n            biggest = nums[i]\n    return biggest\n\nprint(largest([4, 9, 2]))"},
    {title:"Off by one",brief:"<span class='mono'>times_table(n)</span> should return a list of the first 12 multiples of n, from n × 1 to n × 12. Fix it.",
     starter:"def times_table(n):\n    result = []\n    for i in range(12):\n        result.append(n * i)\n    return result\n\nprint(times_table(3))",
     tests:[{name:"3 times table",py:"assert times_table(3) == [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36], times_table(3)"},{name:"12 items",py:"assert len(times_table(7)) == 12"}],
     hint:"range(12) gives 0 to 11. You need 1 to 12.",
     solution:"def times_table(n):\n    result = []\n    for i in range(1, 13):\n        result.append(n * i)\n    return result\n\nprint(times_table(3))"}]}]}]);

/* ---------- banks ---------- */
B("al-design",[
 {t:"mc",q:"A program must process every item in a list exactly once. Which construct suits it best?",a:"A for loop",w:["A while True loop","Nested if statements","A recursive call"]},
 {t:"mc",q:"A game should run until the player chooses to quit. Which construct suits it best?",a:"A while loop",w:["A for loop over range(10)","A single if statement","A dictionary"]},
 {t:"mc",q:"Which structure suits storing the unique email addresses that have signed up?",a:"A set",w:["A list that allows repeats","A tuple","An integer"]},
 {t:"mc",q:"Which structure suits a weekly timetable of 5 days × 6 lessons?",a:"A 2D list",w:["A set","A single string","A Boolean"]},
 {t:"mc",q:"Which data type suits a flag recording whether an order has been paid?",a:"Boolean",w:["String","Real","Integer"]},
 {t:"mc",html:`<pre class="pc py">if mark &gt;= 40:
    grade = "Pass"
elif mark &gt;= 70:
    grade = "Distinction"</pre>`,q:"What's wrong with this logic?",a:"A mark of 70 or more never reaches the Distinction branch",w:["Nothing; it works correctly","elif should be else","mark must be a string"]},
 {t:"mc",html:`<pre class="pc py">if age &lt; 13:
    group = "child"
if age &lt; 18:
    group = "teen"
else:
    group = "adult"</pre>`,q:"What is group when age is 10?",a:"\"teen\"",w:["\"child\"","\"adult\"","An error"]},
 {t:"mc",q:"A program needs the total of all orders. Where should the total variable be set to 0?",a:"Before the loop that adds up the orders",w:["Inside the loop","After the loop","In every function"]},
 {t:"mc",q:"Which is the clearest decomposition of a quiz program?",a:"load_questions(), ask(question), show_score(score)",w:["part1(), part2(), part3()","One function called main_quiz_everything()","do_it()"]},
 {t:"mc",q:"Which describes the 'process' part of input, process, output for a currency converter?",a:"Multiplying the amount by the exchange rate",w:["Asking for the amount","Printing the converted amount","Choosing a variable name"]},
 {t:"mc",q:"Why is it a good idea to work out the expected outputs before writing code?",a:"You can then check whether the code is correct",w:["It makes the code run faster","Python needs them","It avoids syntax errors"]},
 {t:"mc",q:"A price list must never be changed by the program. Which structure suits it?",a:"A tuple",w:["A list","A set","A dictionary"]}]);

B("al-modular",[
 {t:"mc",html:`<pre class="pc py">total = 0
def add(n):
    global total
    total = total + n
add(5)
add(5)
print(total)</pre>`,q:"What is printed, and what's the problem with this design?",a:"10; add has a side effect on a global variable",w:["5; add returns the wrong value","10; there's no problem","An error; total is local"]},
 {t:"mc",html:`<pre class="pc py">def double_all(lst):
    for i in range(len(lst)):
        lst[i] = lst[i] * 2
nums = [1, 2, 3]
double_all(nums)
print(nums)</pre>`,q:"What is printed?",a:"[2, 4, 6]",w:["[1, 2, 3]","None","An error"]},
 {t:"mc",html:`<pre class="pc py">def f():
    x = 5
f()
print(x)</pre>`,q:"What happens?",a:"NameError: x is local to f",w:["5 is printed","None is printed","0 is printed"]},
 {t:"mc",q:"Which function has no side effects?",a:"def area(w, h): return w * h",w:["def log(m): print(m)","def reset(): global score; score = 0","def clear(lst): lst.clear()"]},
 {t:"mc",q:"Why should a calculation function not print its result?",a:"Returning it lets other code reuse the value; printing is an output concern",w:["print is slower","Functions can't print","Printing changes the value"]},
 {t:"mc",q:"Which is an example of separation of concerns?",a:"get_input(), calculate(), display() as separate subprograms",w:["All the code inside one loop","Comments separated by blank lines","Using two global variables"]},
 {t:"mc",q:"What is the main advantage of using a library function such as statistics.mean?",a:"It's already written and tested",w:["It's always faster than any loop","It doesn't need importing","It makes the program shorter to run"]},
 {t:"mc",q:"Which subprogram is a procedure rather than a function?",a:"def show_menu(): print(\"1. Play\")",w:["def square(x): return x * x","def is_even(n): return n % 2 == 0","def total(a, b): return a + b"]},
 {t:"mc",q:"What does fit-for-purpose input mean?",a:"Asking for exactly the data needed, in a sensible form, and checking it",w:["Asking for as much data as possible","Using only input() with no prompt","Reading everything from files"]},
 {t:"mc",q:"Which is the most efficient way to check whether a name is among 100,000 registered names?",a:"Store the names in a set and use in",w:["Loop through a list comparing each name","Sort the list every time","Ask the user to confirm"]},
 {t:"mc",q:"What is scope isolation?",a:"Keeping variables local so other parts of the program can't change them by accident",w:["Putting every variable in a global","Using only one function","Running code in a separate file"]},
 {t:"blank",q:"A change a subprogram makes outside itself, such as to a global variable, is called a side ___.",a:["effect"]}]);

B("al-style",[
 {t:"mc",q:"Which is the most meaningful name for a function that checks a password's strength?",a:"is_strong_password",w:["check","f","pw2"]},
 {t:"mc",q:"Which follows Python's naming convention for a variable?",a:"high_score",w:["HighScore","highscore!","High-Score"]},
 {t:"mc",q:"Which line uses a magic number?",a:"if speed &gt; 70:",w:["if speed &gt; SPEED_LIMIT:","speed = int(input(\"Speed: \"))","SPEED_LIMIT = 70"]},
 {t:"mc",q:"Why use a named constant such as VAT_RATE = 0.2?",a:"It explains the value and means it only needs changing in one place",w:["It makes the program run faster","Python can't use numbers directly","It stops the value being printed"]},
 {t:"mc",q:"How many spaces does Python's style guide recommend for each level of indentation?",a:"4",w:["1","2","8"]},
 {t:"mc",q:"Which comment is most useful?",a:"# Prices are stored in pence to avoid rounding errors",w:["# add 1 to x","# this is a loop","# variable"]},
 {t:"mc",q:"Which line is laid out most consistently with Python style?",a:"total = price * quantity",w:["total=price*quantity","total =price* quantity","Total = Price*Quantity"]},
 {t:"mc",q:"Why keep lines short?",a:"They can be read without scrolling sideways",w:["Long lines cause syntax errors","Python limits lines to 20 characters","Short lines run faster"]},
 {t:"mc",q:"Code is copied and pasted in three places. What is the best improvement?",a:"Put it in a subprogram and call it three times",w:["Add a comment to each copy","Put it on one line","Leave it; copying is efficient"]},
 {t:"mc",q:"What is a docstring?",a:"A string at the start of a function describing what it does",w:["A comment at the end of a line","A string that is printed","A file of documentation"]},
 {t:"mc",q:"Which is the clearest way to write the condition?",a:"if 13 &lt;= age &lt;= 19:",w:["if not (age &lt; 13 or not age &lt;= 19):","if age &gt;= 13 and not age &gt; 19 == True:","if (age &gt; 12) == True and (age &lt; 20) == True:"]},
 {t:"mc",q:"Why does consistent layout matter when several people work on code?",a:"Everyone can read and change each other's code easily",w:["It's required for the code to run","It hides errors","It makes the file smaller"]}]);

B("al-robust",[
 {t:"mc",q:"Valid ages are 11 to 18. Which is erroneous test data?",a:"\"eleven\"",w:["11","18","15"]},
 {t:"mc",q:"Valid ages are 11 to 18. Which two values test the upper boundary?",a:"18 and 19",w:["17 and 18","18 and 20","10 and 11"]},
 {t:"mc",q:"Valid ages are 11 to 18. Which is normal test data?",a:"14",w:["11","19","-3"]},
 {t:"mc",html:`<pre class="pc py">try:
    n = int(input("Number: "))
    print(10 / n)
except ValueError:
    print("Not a number")</pre>`,q:"What happens if the user enters 0?",a:"It crashes with ZeroDivisionError",w:["It prints Not a number","It prints 0","It prints 10"]},
 {t:"mc",html:`<pre class="pc py">try:
    x = int("4.5")
except ValueError:
    x = 0
print(x)</pre>`,q:"What is printed?",a:"0",w:["4","4.5","5"]},
 {t:"mc",q:"Which is a guard clause?",a:"if not items: return 0",w:["while not items:","for i in items:","else: return 0"]},
 {t:"mc",q:"A check uses mark &lt; 100 instead of mark &lt;= 100. Which test reveals it?",a:"100",w:["50","0","-1"]},
 {t:"mc",q:"Which safely converts text to an integer without risking a crash?",a:"if text.isdigit(): n = int(text)",w:["n = int(text)","n = text + 0","n = float(text) // 1"]},
 {t:"mc",q:"Which validation check makes sure a field isn't left blank?",a:"Presence check",w:["Range check","Type check","Format check"]},
 {t:"mc",q:"Which validation check makes sure a postcode follows a pattern of letters and digits?",a:"Format check",w:["Range check","Length check only","Presence check"]},
 {t:"mc",q:"What runs in a try statement's finally block?",a:"Code that runs whether or not an exception happened",w:["Code that runs only if there was an error","Code that runs only if there was no error","Nothing; finally isn't Python"]},
 {t:"mc",q:"Why is except: on its own (catching every error) risky?",a:"It can hide bugs you need to know about",w:["It doesn't catch anything","It's a syntax error","It makes the program run twice"]}]);

B("al-testing",[
 {t:"mc",html:`<pre class="pc py">if score &gt; 10
    print("Win")</pre>`,q:"What type of error is in this code?",a:"Syntax error (missing colon)",w:["Logic error","Runtime error","No error"]},
 {t:"mc",html:`<pre class="pc py">nums = [3, 6, 9]
print(nums[3])</pre>`,q:"What type of error is in this code?",a:"Runtime error (IndexError)",w:["Syntax error","Logic error","No error"]},
 {t:"mc",html:`<pre class="pc py">def average(a, b):
    return a + b / 2
print(average(4, 6))</pre>`,q:"It prints 7.0 instead of 5.0. What is the bug?",a:"Brackets are needed: (a + b) / 2",w:["/ should be //","The function needs a print","a and b must be strings"]},
 {t:"mc",html:`<pre class="pc py">total = 0
for i in range(1, 10):
    total = total + i
print(total)   # should add 1 to 10</pre>`,q:"Why is the answer 45 instead of 55?",a:"range(1, 10) stops at 9",w:["total should start at 1","The print is inside the loop","i should start at 0"]},
 {t:"mc",html:`<pre class="pc py">count = 0
for word in words:
    if word == "the":
        count = count + 1
    print(count)</pre>`,q:"The count should be printed once at the end. What's wrong?",a:"print is indented inside the loop",w:["count should start at 1","== should be =","The if needs an else"]},
 {t:"mc",html:`<pre class="pc py">name = input("Name: ")
if name == "admin" or "root":
    print("Welcome")</pre>`,q:"Why does every name get Welcome?",a:"\"root\" on its own is always True; it should be name == \"root\"",w:["input() always returns admin","or should be and","print is in the wrong place"]},
 {t:"mc",q:"Which is the best way to find where a variable gets the wrong value?",a:"Set a breakpoint or add print statements and step through",w:["Rewrite the whole program","Delete the variable","Run it again and hope"]},
 {t:"mc",q:"What does a test plan's 'expected result' column contain?",a:"What should happen, worked out before running the test",w:["What actually happened","The test data","The error message"]},
 {t:"mc",q:"A test's actual result doesn't match the expected result. What should happen next?",a:"Find and fix the bug, then run the test again",w:["Change the expected result to match","Delete the test","Ignore it if most tests pass"]},
 {t:"mc",q:"Why test again after fixing a bug?",a:"To check the fix works and hasn't broken anything else",w:["The first test was wrong","Python requires it","To make the code faster"]},
 {t:"mc",q:"Which is an example of refining code?",a:"Replacing a long if–elif chain with a dictionary lookup",w:["Adding a syntax error","Removing all the comments","Deleting the test plan"]},
 {t:"mc",q:"A program crashes only when a file is missing. What type of error is it?",a:"Runtime error",w:["Syntax error","Logic error","Boundary error"]}]);

/* ---------- third activities ---------- */
O("o-design",["Read the task and work out the requirements","Identify the inputs, processing and outputs","Decompose the problem into subprograms","Choose suitable data structures and variables","Write and test each subprogram","Test the whole program against the requirements"]);
A("a9-1-design",[ord("o-design","Planning a program","Put the stages of designing and building a program in a sensible order.")]);
S("s-sidefx",{"Has a side effect":["Changes a global variable","Appends to a list it was passed","Writes to a file","Prints a message"],"No side effect":["Returns w * h","Returns a new sorted list","Returns True or False","Uses only local variables"]},3);
A("a9-1-modular",[srt("s-sidefx","Side effect or not?","Drag each description of a subprogram to whether it has a side effect.")]);
S("s-style",{"Good practice":["Four-space indents","snake_case names","Constants in CAPITALS","Comments that explain why","A subprogram for repeated code"],"Poor practice":["Single-letter names like q","Magic numbers","Copied and pasted code","Very long lines","A comment on every line saying what it does"]},4);
A("a9-2-style",[srt("s-style","Good or poor practice?","Drag each habit to whether it makes code more or less readable.")]);
S("s-testdata",{"Normal":["14","12","17"],"Boundary":["11","18","10","19"],"Erroneous":["\"fourteen\"","-5","3.7","50"]},3);
A("a9-2-robust",[srt("s-testdata","Classify the test data","Valid ages are whole numbers from 11 to 18. Drag each test value to its type.")]);
S("s-errtype",{"Syntax error":["Missing colon after if","Unclosed bracket","Misspelt keyword: whlie","Missing quotation mark"],"Runtime error":["Dividing by zero","Index out of range","int(\"abc\")","Opening a missing file"],"Logic error":["&lt; used instead of &lt;=","Total reset inside the loop","Wrong formula for the average","Loop stops one item early"]},3);
A("a9-3-testing",[srt("s-errtype","Which type of error?","Drag each mistake to the type of error it causes.")]);

P("a9-1-design",`Requirements | What the program must do
Decomposition | Break into sub-problems
Input | Data going in
Process | What is done to the data
Output | Results coming out
Unknown number of repeats | while loop
Visit every item once | for loop
Look up by name | Dictionary
No duplicates | Set
Grid of values | 2D list
Fixed values | Tuple
Yes or no flag | Boolean
Set total to 0 | Before the loop
Most restrictive condition | Test it first
Expected outputs | Worked out first
Clear logic | Every case handled once
Subprogram per task | Easier to test
Constructs | Sequence, selection, iteration`);

P("a9-1-modular",`Modularity | Separate subprograms
Separation of concerns | One job per part
Side effect | Changes outside itself
global | Allows a side effect
Local variable | Exists inside a subprogram
Scope isolation | Keep variables local
Procedure | Returns no value
Function | Returns a value
Library | Ready-made subprograms
import statistics | Load a library
from math import sqrt | Import one function
statistics.mean(data) | Library average
Pure function | Same input, same output
Return, don't print | Lets code reuse a value
Return a new list | Leaves the original alone
Efficiency | No wasted work
in on a set | Fast membership test
main() | Summary of the program`);

P("a9-2-style",`White space | Blank lines and spaces
Four spaces | One indent level
snake_case | Variable and function names
CAPITALS | Named constants
79 characters | Suggested line limit
Meaningful identifier | Says what it holds
Magic number | Unexplained value
VAT_RATE = 0.2 | Named constant
Comment | Starts with #
Good comment | Explains why
Docstring | Describes a function
Repeated code | Make a subprogram
total=price*qty | Needs spaces
is_valid | Name for a Boolean function
q, x2, t | Poor names
Consistency | Same style throughout
Readable code | Easier to maintain
13 <= age <= 19 | Clear range test`);

P("a9-2-robust",`Normal data | Typical valid value
Boundary data | At or just past the edge
Erroneous data | Must be rejected
11 to 18: boundaries | 10, 11, 18, 19
try | Code that might fail
except ValueError | Catches a bad conversion
finally | Runs either way
Guard clause | Check first, return early
Deep nesting | Hard to follow
Presence check | Not blank
Range check | Within limits
Format check | Matches a pattern
Type check | Right kind of data
isdigit() | All digits?
int("4.5") | ValueError
< instead of <= | Off-by-one error
Bare except: | Can hide bugs
Validation loop | Ask until valid`);

P("a9-3-testing",`Syntax error | Won't run at all
Runtime error | Crashes while running
Logic error | Runs but gives wrong result
Missing colon | Python refuses to run it
Divide by zero | Crash: ZeroDivisionError
Wrong formula | A logic bug
Test plan | Data, type, expected, actual
Expected result | Worked out beforehand
Actual result | What really happened
Breakpoint | Pauses the program
Watch | Shows a variable's value
Print debugging | Show values as it runs
Trace table | Tracks variables by hand
Retest | After every fix
Refine | Improve working code
a + b / 2 | Missing brackets
range(1, 10) | Stops at 9
IndexError | Index out of range`);
