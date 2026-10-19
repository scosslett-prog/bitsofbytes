/* 10 Computational thinking and algorithms */
L("a10-1",[
{slug:"abstraction",title:"Abstraction and decomposition",covers:[1,2],
 v:[["Abstraction","Hiding detail that isn't needed so you can focus on what matters; a subprogram hides how it works behind its name."],
  ["Interface","What a subprogram needs (parameters) and what it gives back (return value); all a caller needs to know."],
  ["Implementation","The code inside a subprogram that does the work; it can change without affecting callers."],
  ["Decomposition","Breaking a problem into smaller parts that can each be solved separately."],
  ["Comment-first coding","Writing the steps of an algorithm as comments, then filling in the code under each one."],
  ["Top-down design","Starting with the whole problem and breaking it down level by level."],
  ["Black box","Something you can use by knowing its inputs and outputs, without knowing how it works inside."]],
 q:[["You call len(name) without knowing how it counts. This is an example of…","abstraction","decomposition","iteration","validation"],
  ["What is comment-first coding?","Writing the algorithm's steps as comments, then the code","Commenting out code that doesn't work","Adding comments once the program is finished","Writing a comment on every line"],
  ["What does a caller need to know to use a function?","Its name, parameters and what it returns","How every line works","The names of its local variables","When it was written"],
  ["Why can a function's implementation change without breaking the program?","Callers only rely on its interface","Python copies it automatically","Functions can't be changed","Local variables are global"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Abstraction and decomposition · 8 questions",gen:"bank",bank:"al-abstr",explain:"Questions on hiding detail behind subprograms, interfaces and decomposing problems. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Hide the detail · 3 tasks",type:"py",explain:"Build subprograms that hide their detail, then use them without looking inside. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Leap years",brief:"Write <span class='mono'>is_leap(year)</span>. A year is a leap year if it divides by 4, except years that divide by 100, which are leap years only if they also divide by 400.",
     starter:"def is_leap(year):\n    pass\n\nprint(is_leap(2024), is_leap(1900), is_leap(2000))",
     tests:[{name:"2024",py:"assert is_leap(2024) is True"},{name:"2023",py:"assert is_leap(2023) is False"},{name:"1900",py:"assert is_leap(1900) is False"},{name:"2000",py:"assert is_leap(2000) is True"}],
     hint:"return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)",
     solution:"def is_leap(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n\nprint(is_leap(2024), is_leap(1900), is_leap(2000))"},
    {title:"Use the abstraction",brief:"Write <span class='mono'>days_in_month(month, year)</span> (month 1 to 12). Use <span class='mono'>is_leap</span> for February rather than repeating its rules.",
     starter:"def is_leap(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n\ndef days_in_month(month, year):\n    pass\n\nprint(days_in_month(2, 2024))",
     tests:[{name:"January",py:"assert days_in_month(1, 2023) == 31"},{name:"April",py:"assert days_in_month(4, 2023) == 30"},{name:"February 2024",py:"assert days_in_month(2, 2024) == 29"},{name:"February 1900",py:"assert days_in_month(2, 1900) == 28"},{name:"reuses is_leap",py:"assert __code__.count('is_leap(') >= 2 and __code__.count('% 400') == 1"}],
     hint:"Keep a list DAYS = [31, 28, 31, 30, ...]. For February, return 29 if is_leap(year) else 28.",
     solution:"def is_leap(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n\nDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]\n\ndef days_in_month(month, year):\n    if month == 2 and is_leap(year):\n        return 29\n    return DAYS[month - 1]\n\nprint(days_in_month(2, 2024))"},
    {title:"Comment-first",brief:"The steps of <span class='mono'>day_of_year(day, month, year)</span> are written as comments. Write the code under each comment. 1 March 2024 is day 61.",
     starter:"def is_leap(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n\nDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]\n\ndef days_in_month(month, year):\n    if month == 2 and is_leap(year):\n        return 29\n    return DAYS[month - 1]\n\ndef day_of_year(day, month, year):\n    # start a running total at 0\n    # for each month before this one, add its number of days\n    # add the day of this month\n    # return the total\n    pass\n\nprint(day_of_year(1, 3, 2024))",
     tests:[{name:"1 March 2024",py:"assert day_of_year(1, 3, 2024) == 61"},{name:"1 March 2023",py:"assert day_of_year(1, 3, 2023) == 60"},{name:"1 January",py:"assert day_of_year(1, 1, 2023) == 1"},{name:"31 December 2024",py:"assert day_of_year(31, 12, 2024) == 366"},{name:"uses days_in_month",py:"assert __code__.count('days_in_month(') >= 2"}],
     hint:"total = 0; for m in range(1, month): total = total + days_in_month(m, year); then add day.",
     solution:"def is_leap(year):\n    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)\n\nDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]\n\ndef days_in_month(month, year):\n    if month == 2 and is_leap(year):\n        return 29\n    return DAYS[month - 1]\n\ndef day_of_year(day, month, year):\n    # start a running total at 0\n    total = 0\n    # for each month before this one, add its number of days\n    for m in range(1, month):\n        total = total + days_in_month(m, year)\n    # add the day of this month\n    total = total + day\n    # return the total\n    return total\n\nprint(day_of_year(1, 3, 2024))"}]}]},
{slug:"patterns",title:"Patterns and generalisation",covers:[3,4],
 v:[["Pattern recognition","Spotting that a problem is similar to one already solved, so its solution can be reused."],
  ["Generalisation","Turning a specific solution into one that solves a whole family of problems, usually by adding parameters."],
  ["Parameter","A variable in a subprogram's definition that receives a value when it is called."],
  ["Default parameter","A parameter with a value that is used if the caller doesn't give one, e.g. def stars(n, ch=\"*\")."],
  ["Standard algorithm","A well-known pattern such as a running total, a count, finding the maximum, or a linear search."],
  ["Running total","A variable set to 0 before a loop and added to on each pass."],
  ["Reuse","Using an existing solution or data structure again rather than writing new code."]],
 q:[["Three functions print a 3-, 5- and 10-character line of stars. What's the generalisation?","One function with the length as a parameter","Three loops in one function","A global variable for each length","A dictionary of lines"],
  ["Counting pupils over 16 and counting scores over 50 share which pattern?","Counting the items that meet a condition","Binary search","A running total of every item","Sorting"],
  ["What does def greet(name, greeting=\"Hello\") let you do?","Call greet(\"Ana\") and get the default greeting","Only call it with two arguments","Change the function name","Return two values"],
  ["What is the benefit of reusing a tested solution?","Less new code to write and test","The program always runs faster","It removes the need for parameters","Python requires reuse"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Spot the pattern · 8 questions",gen:"bank",bank:"al-pattern",explain:"Recognise standard patterns in code and generalise solutions with parameters. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Generalise · 3 tasks",type:"py",explain:"Replace specific code with general subprograms. Press Run to try your code, then Check to test it.",
   tasks:[{title:"One function, not three",brief:"Replace the three near-identical functions with one, <span class='mono'>convert(amount, rate)</span>, rounded to 2 decimal places. Then <span class='mono'>to_euros(10)</span> is the same as <span class='mono'>convert(10, 1.17)</span>.",
     starter:"def to_euros(pounds):\n    return round(pounds * 1.17, 2)\n\ndef to_dollars(pounds):\n    return round(pounds * 1.27, 2)\n\ndef to_yen(pounds):\n    return round(pounds * 190.5, 2)\n",
     tests:[{name:"euros",py:"assert convert(10, 1.17) == 11.7"},{name:"yen",py:"assert convert(2, 190.5) == 381.0"},{name:"rounds",py:"assert convert(3.333, 1) == 3.33"},{name:"just one function",py:"assert __code__.count('def ') == 1"}],
     hint:"def convert(amount, rate): return round(amount * rate, 2)",
     solution:"def convert(amount, rate):\n    return round(amount * rate, 2)\n"},
    {title:"Count in a range",brief:"Write <span class='mono'>count_between(values, low, high)</span> that counts the values from low to high inclusive. It generalises 'count the teenagers' (13 to 19) and 'count the passes' (40 to 100).",
     starter:"def count_between(values, low, high):\n    pass\n\nages = [12, 13, 17, 19, 20, 15]\nprint(count_between(ages, 13, 19))",
     tests:[{name:"teenagers",py:"assert count_between([12, 13, 17, 19, 20, 15], 13, 19) == 4"},{name:"passes",py:"assert count_between([39, 40, 100, 72, 101], 40, 100) == 3"},{name:"none",py:"assert count_between([], 1, 5) == 0"}],
     hint:"The counting pattern: count = 0, loop, if low <= v <= high: count += 1, return count.",
     solution:"def count_between(values, low, high):\n    count = 0\n    for v in values:\n        if low <= v <= high:\n            count = count + 1\n    return count\n\nages = [12, 13, 17, 19, 20, 15]\nprint(count_between(ages, 13, 19))"},
    {title:"A default parameter",brief:"Write <span class='mono'>box(width, height, ch=\"#\")</span> that <b>returns</b> a string of <span class='mono'>height</span> lines, each <span class='mono'>width</span> copies of <span class='mono'>ch</span>, joined with \"\\n\".",
     starter:"def box(width, height, ch=\"#\"):\n    pass\n\nprint(box(4, 2))\nprint(box(3, 3, \"*\"))",
     tests:[{name:"default character",py:"assert box(4, 2) == '####\\n####', repr(box(4, 2))"},{name:"own character",py:"assert box(3, 1, '*') == '***'"},{name:"one by three",py:"assert box(1, 3, 'x') == 'x\\nx\\nx'"}],
     hint:"line = ch * width; return \"\\n\".join([line] * height)",
     solution:"def box(width, height, ch=\"#\"):\n    line = ch * width\n    return \"\\n\".join([line] * height)\n\nprint(box(4, 2))\nprint(box(3, 3, \"*\"))"}]}]}]);

L("a10-2",[
{slug:"flowcode",title:"From algorithm to code",covers:[1],
 v:[["Algorithm","A precise sequence of steps that solves a problem."],
  ["Flowchart","A diagram of an algorithm using standard shapes joined by arrows."],
  ["Terminator","Rounded flowchart shape for Start and Stop."],
  ["Process","Rectangle for a calculation or assignment, e.g. total ← total + x."],
  ["Decision","Diamond with a Yes/No question; becomes an if or the condition of a loop."],
  ["Input/output","Parallelogram for INPUT and OUTPUT; becomes input() or print()."],
  ["Structured English","An algorithm written as numbered steps in plain, precise English."]],
 q:[["A decision whose 'No' arrow loops back up the flowchart becomes…","a while loop","an else","a function call","a print"],
  ["Which flowchart shape becomes x = int(input())?","Parallelogram","Diamond","Rectangle","Rounded rectangle"],
  ["How is ← written in Python?","=","==","<-",":="],
  ["A decision with two paths that join again below it becomes…","an if–else","a while loop","a for loop","a return"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Flowcharts and code · 8 questions",gen:"bank",bank:"al-flowc",explain:"Match flowchart shapes and descriptions to Python, and trace algorithms. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Algorithms to code · 3 tasks",type:"py",explain:"Turn each algorithm into a Python program. Press Run to try your code, then Check to test it.",
   tasks:[{title:"From a flowchart",brief:`Write the program shown by this flowchart.<figure class="dgwrap"><svg class="dg" viewBox="0 0 300 330" style="max-width:300px" role="img" aria-label="Flowchart: count down"><rect x="95" y="5" width="110" height="34" rx="17" class="b3"/><text x="150" y="27" class="s c">Start</text><line x1="150" y1="39" x2="150" y2="55" class="l"/><path d="M88 55 L224 55 L212 89 L76 89 Z" class="bw"/><text x="150" y="77" class="s c">INPUT n</text><line x1="150" y1="89" x2="150" y2="107" class="l"/><path d="M150 107 L214 135 L150 163 L86 135 Z" class="bi"/><text x="150" y="140" class="s c">n &gt; 0?</text><line x1="150" y1="163" x2="150" y2="181" class="l"/><text x="158" y="177" class="s">Yes</text><path d="M88 181 L224 181 L212 215 L76 215 Z" class="bw"/><text x="150" y="203" class="s c">OUTPUT n</text><line x1="150" y1="215" x2="150" y2="233" class="l"/><rect x="76" y="233" width="148" height="34" class="b"/><text x="150" y="255" class="s c">n ← n − 1</text><path d="M76 250 H30 V135 H86" class="l"/><path d="M214 135 H262 V300 H205" class="l"/><text x="222" y="128" class="s">No</text><path d="M88 283 L224 283 L212 317 L76 317 Z" class="bw" transform="translate(0 0)"/><text x="150" y="305" class="s c">OUTPUT "Lift off"</text></svg></figure>`,
     stdin:["3"],starter:"n = int(input(\"n: \"))\n",
     tests:[{name:"from 3",stdin:["3"],expect:["3","2","1","Lift off"]},{name:"from 0",stdin:["0"],expect:"Lift off"}],
     hint:"while n > 0: print(n), then n = n - 1. After the loop, print(\"Lift off\").",
     solution:"n = int(input(\"n: \"))\nwhile n > 0:\n    print(n)\n    n = n - 1\nprint(\"Lift off\")"},
    {title:"From structured English",brief:"Write this algorithm:<ol><li>Set <i>highest</i> to −1 and <i>count</i> to 0.</li><li>Input a score.</li><li>While the score is not −1: if it's above <i>highest</i>, set <i>highest</i> to it; add 1 to <i>count</i>; input the next score.</li><li>If <i>count</i> is 0, output \"No scores\"; otherwise output \"Highest: \" and <i>highest</i>, and \"Count: \" and <i>count</i>.</li></ol>",
     stdin:["12","30","7","-1"],starter:"",
     tests:[{name:"12, 30, 7",stdin:["12","30","7","-1"],expect:["Highest: 30","Count: 3"]},{name:"no scores",stdin:["-1"],expect:"No scores"},{name:"one score",stdin:["5","-1"],expect:["Highest: 5","Count: 1"]}],
     hint:"Read a score before the while loop, and again at the end of the loop body.",
     solution:"highest = -1\ncount = 0\nscore = int(input(\"Score: \"))\nwhile score != -1:\n    if score > highest:\n        highest = score\n    count = count + 1\n    score = int(input(\"Score: \"))\nif count == 0:\n    print(\"No scores\")\nelse:\n    print(\"Highest:\", highest)\n    print(\"Count:\", count)"},
    {title:"From a description",brief:"A shop's loyalty scheme: input the amount spent. Every whole £10 earns 1 point; spending £100 or more earns double points. Output the points as <span class='mono'>Points: 22</span>. If the amount is negative, output <span class='mono'>Invalid</span> instead.",
     stdin:["115.50"],starter:"",
     tests:[{name:"£115.50",stdin:["115.50"],expect:"Points: 22"},{name:"£99.99",stdin:["99.99"],expect:"Points: 9"},{name:"£100",stdin:["100"],expect:"Points: 20"},{name:"negative",stdin:["-5"],expect:"Invalid"}],
     hint:"points = int(amount // 10); if amount >= 100, double it. Check for a negative amount first.",
     solution:"amount = float(input(\"Spent: \"))\nif amount < 0:\n    print(\"Invalid\")\nelse:\n    points = int(amount // 10)\n    if amount >= 100:\n        points = points * 2\n    print(\"Points:\", points)"}]}]}]);

L("a10-3",[
{slug:"linear",title:"Linear search",covers:[1],
 v:[["Linear search","Checking each item in turn, from the start, until the target is found or the list ends."],
  ["Target","The value being searched for."],
  ["Early exit","Stopping a loop as soon as the answer is known, with return or break."],
  ["Sentinel value","A value such as −1 returned to mean 'not found'."],
  ["Early exit on a sorted list","Stopping as soon as an item is bigger than the target, since the target can't come later."],
  ["Best case","The target is the first item: one comparison."],
  ["Worst case","The target is last or missing: every item is compared (n comparisons)."]],
 q:[["What does a linear search return in this course if the target isn't found?","-1","0","None of the items","The last index"],
  ["A list of 200 unsorted items doesn't contain the target. How many comparisons does linear search make?","200","100","8","1"],
  ["Searching the sorted list [3, 8, 12, 20, 31] for 10 with early exit: when does it stop?","When it reaches 12","When it reaches 3","After 31","It doesn't stop early"],
  ["Does linear search need a sorted list?","No","Yes, always","Only for numbers","Only for strings"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Linear search code · 8 questions",gen:"bank",bank:"al-linear",explain:"Read and trace linear search code, including early exit. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Linear search · 3 tasks",type:"py",explain:"Implement linear search. Don't use in, index() or find() to do the searching for you. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Find it",brief:"Write <span class='mono'>linear_search(items, target)</span> that returns the index of the first match, or −1 if it isn't there. It must stop as soon as it finds the target.",
     starter:"def linear_search(items, target):\n    pass\n\nprint(linear_search([7, 3, 9, 3], 3))",
     tests:[{name:"first match",py:"assert linear_search([7, 3, 9, 3], 3) == 1"},{name:"not found",py:"assert linear_search([7, 3, 9], 5) == -1"},{name:"empty list",py:"assert linear_search([], 5) == -1"},{name:"stops early",py:"class L(list):\n    n = 0\n    def __getitem__(s, i):\n        L.n += 1\n        return list.__getitem__(s, i)\n    def __iter__(s):\n        for i in range(len(s)):\n            yield s[i]\nx = L([5, 1, 2, 3, 4]); r = linear_search(x, 5); assert r == 0 and L.n <= 2, L.n"},{name:"doesn't use index()",py:"assert '.index(' not in __code__ and ' in items' not in __code__.replace('for ', '#')"}],
     hint:"for i in range(len(items)): if items[i] == target: return i. After the loop, return -1.",
     solution:"def linear_search(items, target):\n    for i in range(len(items)):\n        if items[i] == target:\n            return i\n    return -1\n\nprint(linear_search([7, 3, 9, 3], 3))"},
    {title:"Sorted early exit",brief:"<span class='mono'>items</span> is sorted in ascending order. Write <span class='mono'>sorted_search(items, target)</span> that returns the index or −1, and also gives up as soon as it reaches an item <b>bigger</b> than the target.",
     starter:"def sorted_search(items, target):\n    pass\n\nprint(sorted_search([3, 8, 12, 20, 31], 10))",
     tests:[{name:"found",py:"assert sorted_search([3, 8, 12, 20, 31], 20) == 3"},{name:"not found",py:"assert sorted_search([3, 8, 12, 20, 31], 10) == -1"},{name:"bigger than all",py:"assert sorted_search([3, 8], 50) == -1"},{name:"gives up early",py:"class L(list):\n    n = 0\n    def __getitem__(s, i):\n        L.n += 1\n        return list.__getitem__(s, i)\n    def __iter__(s):\n        for i in range(len(s)):\n            yield s[i]\nx = L([3, 8, 12, 20, 31, 40, 55, 60]); assert sorted_search(x, 10) == -1 and L.n <= 6, L.n"}],
     hint:"Inside the loop: if items[i] == target: return i; elif items[i] > target: return -1.",
     solution:"def sorted_search(items, target):\n    for i in range(len(items)):\n        if items[i] == target:\n            return i\n        if items[i] > target:\n            return -1\n    return -1\n\nprint(sorted_search([3, 8, 12, 20, 31], 10))"},
    {title:"Search records",brief:"<span class='mono'>pupils</span> is a list of [name, form] records. Write <span class='mono'>find_form(pupils, name)</span> that linear-searches by name and returns the form, or <span class='mono'>\"Not found\"</span>. The search should ignore capitals.",
     starter:"pupils = [[\"Ana\", \"10B\"], [\"Ben\", \"11A\"], [\"Cai\", \"10C\"]]\n\ndef find_form(pupils, name):\n    pass\n\nprint(find_form(pupils, \"ben\"))",
     tests:[{name:"ben",py:"assert find_form(pupils, 'ben') == '11A'"},{name:"Cai",py:"assert find_form(pupils, 'Cai') == '10C'"},{name:"missing",py:"assert find_form(pupils, 'Zed') == 'Not found'"}],
     hint:"for record in pupils: if record[0].lower() == name.lower(): return record[1]",
     solution:"pupils = [[\"Ana\", \"10B\"], [\"Ben\", \"11A\"], [\"Cai\", \"10C\"]]\n\ndef find_form(pupils, name):\n    for record in pupils:\n        if record[0].lower() == name.lower():\n            return record[1]\n    return \"Not found\"\n\nprint(find_form(pupils, \"ben\"))"}]}]},
{slug:"binary",title:"Binary search",covers:[2],
 v:[["Binary search","Repeatedly checking the middle of a sorted list and discarding the half that can't contain the target."],
  ["low and high","Indexes marking the part of the list still being searched."],
  ["mid","The middle index: (low + high) // 2."],
  ["Iterative","Using a loop: while low <= high."],
  ["Recursive","A function that calls itself on the half that's left."],
  ["Base case","For recursive binary search: the target is at mid (found), or low > high (not found)."],
  ["Precondition","Binary search only works if the list is sorted."]],
 q:[["What must be true before a binary search?","The list is sorted","The list has an even number of items","The target is in the list","The list contains numbers only"],
  ["low = 0, high = 9. What is mid?","4","5","4.5","9"],
  ["The target is bigger than items[mid]. What happens next?","low = mid + 1","high = mid - 1","mid = mid + 1","The search stops"],
  ["When does an iterative binary search decide the target isn't there?","When low becomes greater than high","When mid is 0","After 10 comparisons","When high is 0"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Binary search code · 8 questions",gen:"bank",bank:"al-binary",explain:"Trace iterative and recursive binary search code. Every try picks a different set."},
  {id:"act2",title:"Activity 2",desc:"Search traces · 8 questions",gen:"alsearch",type:"mixed",explain:"Trace binary searches (list the values checked) and count the comparisons a linear search makes. mid = (low + high) // 2. New lists every try."},
  {id:"py1",title:"Code it",desc:"Binary search · 2 tasks",type:"py",explain:"Implement binary search both ways. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Iterative",brief:"Write <span class='mono'>binary_search(items, target)</span> using a <b>while</b> loop. Return the index of the target in the sorted list, or −1.",
     starter:"def binary_search(items, target):\n    low = 0\n    high = len(items) - 1\n    pass\n\nprint(binary_search([3, 8, 12, 15, 21, 27, 34], 21))",
     tests:[{name:"found",py:"assert binary_search([3, 8, 12, 15, 21, 27, 34], 21) == 4"},{name:"first and last",py:"a = [3, 8, 12, 15, 21, 27, 34]; assert binary_search(a, 3) == 0 and binary_search(a, 34) == 6"},{name:"missing",py:"assert binary_search([3, 8, 12, 15], 10) == -1 and binary_search([], 1) == -1"},{name:"every item of a big list",py:"a = list(range(0, 300, 3)); assert all(binary_search(a, v) == i for i, v in enumerate(a))"},{name:"few comparisons",py:"class L(list):\n    n = 0\n    def __getitem__(s, i):\n        L.n += 1\n        return list.__getitem__(s, i)\nx = L(range(1000)); binary_search(x, 777); assert L.n <= 25, L.n"}],
     hint:"while low <= high: mid = (low + high) // 2. If items[mid] == target return mid; if smaller, low = mid + 1; otherwise high = mid - 1.",
     solution:"def binary_search(items, target):\n    low = 0\n    high = len(items) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if items[mid] == target:\n            return mid\n        elif items[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nprint(binary_search([3, 8, 12, 15, 21, 27, 34], 21))"},
    {title:"Recursive",brief:"Write <span class='mono'>binary_search_r(items, target, low, high)</span> that calls itself on the half that's left, with no loops. Return the index or −1.",
     starter:"def binary_search_r(items, target, low, high):\n    pass\n\na = [3, 8, 12, 15, 21, 27, 34]\nprint(binary_search_r(a, 27, 0, len(a) - 1))",
     tests:[{name:"found",py:"a = [3, 8, 12, 15, 21, 27, 34]; assert binary_search_r(a, 27, 0, 6) == 5"},{name:"missing",py:"a = [3, 8, 12, 15, 21, 27, 34]; assert binary_search_r(a, 13, 0, 6) == -1"},{name:"every item",py:"a = list(range(5, 200, 5)); assert all(binary_search_r(a, v, 0, len(a) - 1) == i for i, v in enumerate(a))"},{name:"no loops",py:"assert 'while' not in __code__ and 'for ' not in __code__.split('print')[0]"}],
     hint:"Base case: if low > high: return -1. Work out mid; if found return mid; else return binary_search_r(items, target, mid + 1, high) or (…, low, mid - 1).",
     solution:"def binary_search_r(items, target, low, high):\n    if low > high:\n        return -1\n    mid = (low + high) // 2\n    if items[mid] == target:\n        return mid\n    if items[mid] < target:\n        return binary_search_r(items, target, mid + 1, high)\n    return binary_search_r(items, target, low, mid - 1)\n\na = [3, 8, 12, 15, 21, 27, 34]\nprint(binary_search_r(a, 27, 0, len(a) - 1))"}]}]},
{slug:"bubble",title:"Bubble sort",covers:[3],
 v:[["Bubble sort","Repeatedly passing through a list, comparing neighbouring items and swapping them if they're in the wrong order."],
  ["Pass","One run through the list comparing neighbouring pairs."],
  ["Swap","Exchanging two items: a[j], a[j + 1] = a[j + 1], a[j]."],
  ["Early exit","Stopping when a pass makes no swaps, because the list must be sorted."],
  ["Shrinking upper bound","After each pass the largest unsorted item is in place, so the next pass can stop one item sooner."],
  ["In place","Sorting by rearranging the items inside the original list, without making a new one."],
  ["Swapped flag","A Boolean set to False at the start of a pass and True when a swap happens."]],
 q:[["After the first pass of a bubble sort (ascending), which item is certainly in its final place?","The largest","The smallest","The middle one","None"],
  ["Why can each pass stop one item sooner than the last?","The end of the list holds items already in their final place","The list gets shorter","Python skips the last item","To save memory"],
  ["When does bubble sort with early exit stop?","After a pass with no swaps","After exactly n passes","When the first item is smallest","After one pass"],
  ["How many passes does bubble sort with early exit make on a list that's already sorted?","1","0","n","n − 1"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Bubble sort code · 8 questions",gen:"bank",bank:"al-bubble2",explain:"Read and trace bubble sort code, including early exit and the shrinking bound. Every try picks a different set."},
  {id:"act2",title:"Activity 2",desc:"Sort traces · 8 questions",gen:"alsort",type:"mixed",explain:"Trace the first pass of a bubble sort and the first passes of an insertion sort. New lists every try."},
  {id:"py1",title:"Code it",desc:"Bubble sort · 2 tasks",type:"py",explain:"Implement bubble sort without using sort() or sorted(). Press Run to try your code, then Check to test it.",
   tasks:[{title:"Bubble sort",brief:"Write <span class='mono'>bubble_sort(items)</span> that sorts the list <b>in place</b> into ascending order, with early exit and a shrinking upper bound. Return the number of <b>passes</b> it made.",
     starter:"def bubble_sort(items):\n    passes = 0\n    pass\n    return passes\n\nnums = [31, 12, 47, 8, 25]\nprint(bubble_sort(nums), nums)",
     tests:[{name:"sorts in place",py:"a = [31, 12, 47, 8, 25, 19]; bubble_sort(a); assert a == [8, 12, 19, 25, 31, 47], a"},{name:"sorted list: 1 pass",py:"a = [1, 2, 3, 4, 5]; assert bubble_sort(a) == 1, bubble_sort([1, 2, 3, 4, 5])"},{name:"one swap: 2 passes",py:"assert bubble_sort([2, 1, 3, 4, 5]) == 2"},{name:"random lists",py:"import random\nfor _ in range(30):\n    a = [random.randint(0, 50) for _ in range(random.randint(0, 12))]; b = sorted(a); bubble_sort(a); assert a == b, a"},{name:"no sort() or sorted()",py:"assert 'sort(' not in __code__.split('def bubble_sort')[1].split('nums =')[0] and 'sorted(' not in __code__"}],
     hint:"n = len(items); swapped = True; while swapped: swapped = False; passes += 1; for j in range(n - 1): compare and swap, setting swapped = True; then n -= 1.",
     solution:"def bubble_sort(items):\n    passes = 0\n    n = len(items)\n    swapped = True\n    while swapped and n > 1:\n        swapped = False\n        passes = passes + 1\n        for j in range(n - 1):\n            if items[j] > items[j + 1]:\n                items[j], items[j + 1] = items[j + 1], items[j]\n                swapped = True\n        n = n - 1\n    return passes\n\nnums = [31, 12, 47, 8, 25]\nprint(bubble_sort(nums), nums)"},
    {title:"Sort records",brief:"Adapt bubble sort as <span class='mono'>sort_by_score(results)</span>: <span class='mono'>results</span> is a list of [name, score] records. Sort it in place so the <b>highest</b> score comes first.",
     starter:"def sort_by_score(results):\n    pass\n\nresults = [[\"Ana\", 72], [\"Ben\", 88], [\"Cai\", 65], [\"Dev\", 81]]\nsort_by_score(results)\nprint(results)",
     tests:[{name:"highest first",py:"r = [['Ana', 72], ['Ben', 88], ['Cai', 65], ['Dev', 81]]; sort_by_score(r); assert [x[0] for x in r] == ['Ben', 'Dev', 'Ana', 'Cai'], r"},{name:"no sort() or sorted()",py:"assert 'sort(' not in __code__.replace('sort_by_score(', '') and 'sorted(' not in __code__"}],
     hint:"Compare results[j][1] < results[j + 1][1]: swap when the left score is smaller.",
     solution:"def sort_by_score(results):\n    n = len(results)\n    swapped = True\n    while swapped:\n        swapped = False\n        for j in range(n - 1):\n            if results[j][1] < results[j + 1][1]:\n                results[j], results[j + 1] = results[j + 1], results[j]\n                swapped = True\n        n = n - 1\n\nresults = [[\"Ana\", 72], [\"Ben\", 88], [\"Cai\", 65], [\"Dev\", 81]]\nsort_by_score(results)\nprint(results)"}]}]},
{slug:"insertion",title:"Insertion sort",covers:[4],
 v:[["Insertion sort","Building a sorted part at the start of the list by taking each next item and inserting it into its correct place."],
  ["Sorted part","The items to the left of the current one, which are always in order."],
  ["Current item","The item being inserted, saved in a variable before the others shift."],
  ["Shift","Moving an item one place right to make room: items[j + 1] = items[j]."],
  ["In-place insertion sort","Insertion sort that rearranges the original list rather than building a new one."],
  ["Nearly sorted data","Insertion sort is quick here, because few items need shifting."],
  ["Outer loop","for i in range(1, len(items)): takes each item after the first in turn."]],
 q:[["Why does the outer loop of insertion sort start at index 1?","One item on its own is already sorted","Index 0 is skipped by Python","The first item is the largest","To save memory"],
  ["Why is the current item stored in a variable first?","Shifting items right would overwrite it","It needs converting","Python requires it","To count the passes"],
  ["When does the inner loop stop shifting?","When it finds an item not bigger than the current one, or reaches the start","After one shift","When the list ends","When the current item is 0"],
  ["On which data is insertion sort fastest?","Nearly sorted","Reversed","Random","It's the same for all"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Insertion sort code · 8 questions",gen:"bank",bank:"al-insert",explain:"Read and trace in-place insertion sort code. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Insertion sort · 2 tasks",type:"py",explain:"Implement an in-place insertion sort without using sort() or sorted(). Press Run to try your code, then Check to test it.",
   tasks:[{title:"Insertion sort",brief:"Write <span class='mono'>insertion_sort(items)</span> that sorts the list <b>in place</b> into ascending order by shifting items, not swapping.",
     starter:"def insertion_sort(items):\n    pass\n\nnums = [31, 12, 47, 8, 25]\ninsertion_sort(nums)\nprint(nums)",
     tests:[{name:"sorts in place",py:"a = [31, 12, 47, 8, 25, 19]; insertion_sort(a); assert a == [8, 12, 19, 25, 31, 47], a"},{name:"random lists",py:"import random\nfor _ in range(30):\n    a = [random.randint(0, 50) for _ in range(random.randint(0, 12))]; b = sorted(a); insertion_sort(a); assert a == b, a"},{name:"strings",py:"a = ['pear', 'apple', 'fig']; insertion_sort(a); assert a == ['apple', 'fig', 'pear']"},{name:"no sort() or sorted()",py:"assert '.sort(' not in __code__ and 'sorted(' not in __code__"}],
     hint:"for i in range(1, len(items)): current = items[i]; j = i - 1; while j >= 0 and items[j] > current: items[j + 1] = items[j]; j -= 1. Then items[j + 1] = current.",
     solution:"def insertion_sort(items):\n    for i in range(1, len(items)):\n        current = items[i]\n        j = i - 1\n        while j >= 0 and items[j] > current:\n            items[j + 1] = items[j]\n            j = j - 1\n        items[j + 1] = current\n\nnums = [31, 12, 47, 8, 25]\ninsertion_sort(nums)\nprint(nums)"},
    {title:"Descending, by length",brief:"Write <span class='mono'>sort_longest_first(words)</span>: an in-place insertion sort that puts the <b>longest</b> words first. Words of the same length keep their original order.",
     starter:"def sort_longest_first(words):\n    pass\n\nw = [\"to\", \"python\", \"code\", \"loop\", \"a\"]\nsort_longest_first(w)\nprint(w)",
     tests:[{name:"longest first",py:"w = ['to', 'python', 'code', 'loop', 'a']; sort_longest_first(w); assert w == ['python', 'code', 'loop', 'to', 'a'], w"},{name:"no sort() or sorted()",py:"assert '.sort(' not in __code__ and 'sorted(' not in __code__"}],
     hint:"Same as insertion sort, but shift while len(words[j]) < len(current). Using < (not <=) keeps equal lengths in order.",
     solution:"def sort_longest_first(words):\n    for i in range(1, len(words)):\n        current = words[i]\n        j = i - 1\n        while j >= 0 and len(words[j]) < len(current):\n            words[j + 1] = words[j]\n            j = j - 1\n        words[j + 1] = current\n\nw = [\"to\", \"python\", \"code\", \"loop\", \"a\"]\nsort_longest_first(w)\nprint(w)"}]}]}]);

L("a10-4",[
{slug:"recursion2",title:"Recursive algorithms in Python",covers:[1],
 v:[["Recursion","A function that calls itself to solve a smaller version of the same problem."],
  ["Base case","The condition where the function returns without calling itself, stopping the recursion."],
  ["Recursive case","Where the function calls itself with a smaller or simpler argument."],
  ["Call stack","The stack of frames for functions that have been called but haven't returned yet."],
  ["Stack frame","The memory for one call: its parameters, local variables and where to return to."],
  ["RecursionError","Python's error when recursion goes too deep, usually because a base case is missing or never reached."],
  ["Unwinding","Returning back down the call stack, each call using the result of the one above it."]],
 q:[["What happens if a recursive function has no base case?","It recurses until Python raises a RecursionError","It returns 0","It runs once","It becomes a loop"],
  ["def f(n): return 1 if n == 0 else n * f(n - 1). What is f(4)?","24","10","4","16"],
  ["What does each recursive call add to the call stack?","A new stack frame","Nothing","A global variable","A copy of the whole program"],
  ["Which must each recursive call do?","Move closer to the base case","Print something","Use a loop","Change a global variable"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Trace recursion · 8 questions",gen:"bank",bank:"al-recur2",explain:"Trace recursive Python functions and work out what they return. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Recursion · 4 tasks",type:"py",explain:"Write each function recursively: no for or while loops. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Sum to n",brief:"Write <span class='mono'>sum_to(n)</span> that returns 1 + 2 + … + n recursively. <span class='mono'>sum_to(0)</span> is 0.",
     starter:"def sum_to(n):\n    pass\n\nprint(sum_to(5))",
     tests:[{name:"sum_to(5)",py:"assert sum_to(5) == 15"},{name:"sum_to(0)",py:"assert sum_to(0) == 0"},{name:"sum_to(100)",py:"assert sum_to(100) == 5050"},{name:"recursive, no loops",py:"assert 'for ' not in __code__ and 'while' not in __code__ and __code__.count('sum_to(') >= 3"}],
     hint:"Base case: if n == 0: return 0. Recursive case: return n + sum_to(n - 1).",
     solution:"def sum_to(n):\n    if n == 0:\n        return 0\n    return n + sum_to(n - 1)\n\nprint(sum_to(5))"},
    {title:"Power",brief:"Write <span class='mono'>power(base, exp)</span> that returns base to the power exp (exp is a whole number, 0 or more) recursively, without using <span class='mono'>**</span> or <span class='mono'>pow</span>.",
     starter:"def power(base, exp):\n    pass\n\nprint(power(2, 10))",
     tests:[{name:"2 to the 10",py:"assert power(2, 10) == 1024"},{name:"anything to the 0",py:"assert power(7, 0) == 1"},{name:"3 cubed",py:"assert power(3, 3) == 27"},{name:"recursive, no ** or loops",py:"assert '**' not in __code__ and 'pow(' not in __code__ and 'for ' not in __code__ and 'while' not in __code__"}],
     hint:"Base case: exp == 0 returns 1. Recursive case: base * power(base, exp - 1).",
     solution:"def power(base, exp):\n    if exp == 0:\n        return 1\n    return base * power(base, exp - 1)\n\nprint(power(2, 10))"},
    {title:"Reverse a string",brief:"Write <span class='mono'>reverse(s)</span> that returns the string backwards, recursively, without slicing with <span class='mono'>[::-1]</span> or using loops.",
     starter:"def reverse(s):\n    pass\n\nprint(reverse(\"python\"))",
     tests:[{name:"python",py:"assert reverse('python') == 'nohtyp'"},{name:"empty",py:"assert reverse('') == ''"},{name:"one letter",py:"assert reverse('a') == 'a'"},{name:"recursive",py:"assert '[::-1]' not in __code__ and 'for ' not in __code__ and 'while' not in __code__ and 'reversed' not in __code__"}],
     hint:"Base case: an empty string returns \"\". Recursive case: reverse(s[1:]) + s[0].",
     solution:"def reverse(s):\n    if s == \"\":\n        return \"\"\n    return reverse(s[1:]) + s[0]\n\nprint(reverse(\"python\"))"},
    {title:"Count digits",brief:"Write <span class='mono'>digit_sum(n)</span> that returns the sum of the digits of a whole number n (0 or more), recursively, without converting it to a string. <span class='mono'>digit_sum(472)</span> is 13.",
     starter:"def digit_sum(n):\n    pass\n\nprint(digit_sum(472))",
     tests:[{name:"472",py:"assert digit_sum(472) == 13"},{name:"0",py:"assert digit_sum(0) == 0"},{name:"9999",py:"assert digit_sum(9999) == 36"},{name:"recursive, numbers only",py:"assert 'str(' not in __code__ and 'for ' not in __code__ and 'while' not in __code__"}],
     hint:"n % 10 is the last digit and n // 10 is the rest. Base case: n < 10 returns n.",
     solution:"def digit_sum(n):\n    if n < 10:\n        return n\n    return n % 10 + digit_sum(n // 10)\n\nprint(digit_sum(472))"}]}]}]);

/* ---------- banks ---------- */
const pc = (s) => `<pre class="pc py">${s}</pre>`;
B("al-abstr",[
 {t:"mc",q:"You use random.randint(1, 6) without knowing how it generates numbers. This is…",a:"abstraction",w:["decomposition","generalisation","pattern recognition"]},
 {t:"mc",q:"Which is the interface of def area(width, height): …?",a:"Its name, its two parameters and the value it returns",w:["The code inside it","The local variables it uses","The comments above it"]},
 {t:"mc",q:"A function's implementation is changed to make it faster, but its parameters and return value stay the same. What happens to the code that calls it?",a:"Nothing needs to change",w:["Every call must be rewritten","It stops working","It must import the function again"]},
 {t:"mc",q:"Which is decomposition?",a:"Splitting a quiz program into load_questions(), ask() and show_score()",w:["Using len() without knowing how it works","Renaming a variable","Adding a default parameter"]},
 {t:"mc",q:"In comment-first coding, what do you write first?",a:"The steps of the algorithm as comments",w:["The test plan","The variable names","The error handling"]},
 {t:"mc",q:"A map of the London Underground leaves out the real distances between stations. This is an example of…",a:"abstraction",w:["decomposition","validation","iteration"]},
 {t:"mc",q:"Why does abstraction make large programs easier to write?",a:"You can use parts without thinking about how they work",w:["It removes all bugs","It makes the code run faster","It avoids the need for functions"]},
 {t:"mc",q:"Top-down design means…",a:"starting with the whole problem and breaking it into smaller parts",w:["writing the last line first","testing the bottom of the program first","using only global variables"]},
 {t:"mc",html:pc(`def is_valid_email(text):
    return "@" in text and "." in text.split("@")[-1]

if is_valid_email(entry):
    save(entry)`),q:"What does the main program need to know about is_valid_email?",a:"Only that it takes a string and returns True or False",w:["How it splits the string","Every line of its code","What its local variables are called"]},
 {t:"mc",q:"Which decomposition of 'run a library' is clearest?",a:"Members, books, loans, each broken into smaller tasks",w:["Part A, part B, part C","Everything in one subprogram","One subprogram per line of code"]},
 {t:"mc",q:"What is a black box?",a:"Something used by its inputs and outputs without knowing how it works",w:["A function with no parameters","A program that crashes","A hidden global variable"]},
 {t:"mc",q:"After writing comments first, why keep them in the finished code?",a:"They explain the steps of the algorithm to readers",w:["Python needs them to run","They make the code faster","They count as tests"]}]);

B("al-pattern",[
 {t:"mc",html:pc(`total = 0
for p in prices:
    total = total + p`),q:"Which standard pattern is this?",a:"Running total",w:["Counting","Finding the maximum","Linear search"]},
 {t:"mc",html:pc(`best = scores[0]
for s in scores:
    if s &gt; best:
        best = s`),q:"Which standard pattern is this?",a:"Finding the maximum",w:["Running total","Counting","Bubble sort"]},
 {t:"mc",html:pc(`n = 0
for w in words:
    if len(w) &gt; 6:
        n = n + 1`),q:"Which standard pattern is this?",a:"Counting items that meet a condition",w:["Running total","Finding the minimum","Swapping"]},
 {t:"mc",html:pc(`def stars(n, ch="*"):
    return ch * n
print(stars(3), stars(2, "#"))`),q:"What is printed?",a:"*** ##",w:["*** **","### ##","An error"]},
 {t:"mc",html:pc(`def scale(values, factor=2):
    return [v * factor for v in values]
print(scale([1, 2]), scale([1, 2], 10))`),q:"What is printed?",a:"[2, 4] [10, 20]",w:["[1, 2] [10, 20]","[2, 4] [2, 4]","An error"]},
 {t:"mc",q:"area_of_square(s) and area_of_rectangle(w, h) can be generalised to…",a:"area(w, h), called with w = h for a square",w:["area() with no parameters","Three separate functions","A global variable called area"]},
 {t:"mc",q:"A program finds the cheapest flight. You've already written code to find the lowest temperature. This is…",a:"pattern recognition",w:["abstraction","debugging","validation"]},
 {t:"mc",q:"What makes a solution general?",a:"Parameters replace values that were fixed",w:["It uses more global variables","It has more comments","It only works for one case"]},
 {t:"mc",q:"Which data structure pattern suits counting how often each word appears?",a:"A dictionary of word: count",w:["A tuple","A single integer","A set"]},
 {t:"mc",html:pc(`def count_if(values, low, high):
    return len([v for v in values if low &lt;= v &lt;= high])
print(count_if([5, 12, 18, 25], 10, 20))`),q:"What is printed?",a:"2",w:["3","1","4"]},
 {t:"mc",q:"Why is a generalised function easier to test than many specific copies?",a:"There's only one piece of code to test",w:["It has no parameters","It can't have bugs","It runs once"]},
 {t:"mc",q:"Which function call uses a default parameter?",a:"round(3.7)",w:["round(3.75, 1)","max(3, 7)","print(3, 7)"]}]);

B("al-flowc",[
 {t:"mc",q:"Which Python line matches the flowchart box \"total ← total + x\"?",a:"total = total + x",w:["total == total + x","print(total + x)","if total + x:"]},
 {t:"mc",q:"Which flowchart shape becomes print(total)?",a:"Parallelogram (input/output)",w:["Diamond","Rectangle","Rounded rectangle"]},
 {t:"mc",q:"Which flowchart shape becomes an if?",a:"Diamond (decision)",w:["Parallelogram","Rectangle","Rounded rectangle"]},
 {t:"mc",q:"A flowchart inputs x, then a decision 'x = 0?' leads (No) to adding x to total and back to the input. Which Python structure matches?",a:"A while loop that repeats until x is 0",w:["An if with no loop","A for loop over range(10)","A function call"]},
 {t:"mc",q:"In the loop from the previous question, where must the second input() go in Python?",a:"At the end of the loop body",w:["Before total = 0","After the loop","Nowhere; one input is enough"]},
 {t:"mc",html:pc(`n = 4
while n &gt; 0:
    print(n)
    n = n - 2`),q:"What is printed?",a:"4 then 2",w:["4, 3, 2, 1","4, 2, 0","Nothing"]},
 {t:"mc",q:"Structured English says \"Repeat 10 times: input a mark and add it to the total\". Which loop fits best?",a:"for i in range(10):",w:["while True:","while mark != 0:","if i &lt; 10:"]},
 {t:"mc",q:"A flowchart decision has a Yes path and a No path that join again before Stop. Which Python structure matches?",a:"if–else",w:["while","for","def"]},
 {t:"mc",q:"Which is the Python for the flowchart output \"OUTPUT 'Total: ', total\"?",a:"print(\"Total:\", total)",w:["input(\"Total:\", total)","total = \"Total:\"","return total"]},
 {t:"mc",q:"How is the flowchart test 'x ≠ 0?' written in Python?",a:"x != 0",w:["x =! 0","x &lt;&gt; 0","not x = 0"]},
 {t:"mc",html:pc(`count = 0
x = int(input())
while x &gt;= 0:
    count = count + 1
    x = int(input())
print(count)`),q:"The inputs are 5, 0, 3, −1. What is printed?",a:"3",w:["2","4","9"]},
 {t:"mc",q:"Why should you trace a flowchart with test data before coding it?",a:"To understand exactly what it does and know what output to expect",w:["Python needs a trace table","It makes the program run faster","To choose variable names"]}]);

B("al-linear",[
 {t:"mc",html:pc(`def find(items, t):
    for i in range(len(items)):
        if items[i] == t:
            return i
    return -1
print(find([4, 9, 2, 9], 9))`),q:"What is printed?",a:"1",w:["3","9","-1"]},
 {t:"mc",html:pc(`def find(items, t):
    for i in range(len(items)):
        if items[i] == t:
            return i
    return -1
print(find([4, 9, 2], 7))`),q:"What is printed?",a:"-1",w:["0","2","None"]},
 {t:"mc",html:pc(`def find(items, t):
    for i in range(len(items)):
        if items[i] == t:
            return i
        else:
            return -1`),q:"What's wrong with this linear search?",a:"It returns -1 after checking only the first item",w:["Nothing; it works","It never returns","It returns the last index"]},
 {t:"mc",html:pc(`def count(items, t):
    c = 0
    for x in items:
        if x == t:
            c = c + 1
    return c
print(count([3, 1, 3, 3], 3))`),q:"What is printed?",a:"3",w:["1","0","4"]},
 {t:"mc",html:pc(`def find(items, t):
    for i in range(len(items)):
        if items[i] == t:
            return i
        if items[i] &gt; t:
            return -1
    return -1
print(find([2, 5, 9, 14, 20], 10))`),q:"How many items are compared before it returns?",a:"4 (2, 5, 9, 14)",w:["5","3","1"]},
 {t:"mc",q:"Why does early exit on 'bigger than the target' only work on a sorted list?",a:"In an unsorted list, the target could still appear after a bigger item",w:["Unsorted lists can't be searched","Python sorts lists first","It works on any list"]},
 {t:"mc",q:"A linear search of 1,000 items finds the target at index 0. How many comparisons?",a:"1",w:["1,000","500","10"]},
 {t:"mc",q:"Which statement makes a for loop stop as soon as the target is found, without returning?",a:"break",w:["continue","pass","stop"]},
 {t:"mc",html:pc(`found = False
i = 0
while i &lt; len(items) and not found:
    if items[i] == t:
        found = True
    else:
        i = i + 1`),q:"If the target is found, what does i hold afterwards?",a:"The index of the target",w:["The length of the list","0","The target"]},
 {t:"mc",q:"Which is an advantage of linear search over binary search?",a:"It works on unsorted data",w:["It's always faster","It needs fewer comparisons","It halves the list"]},
 {t:"mc",q:"What is the worst case for a linear search of n items?",a:"n comparisons",w:["1 comparison","n / 2 comparisons","log₂ n comparisons"]},
 {t:"mc",html:pc(`names = ["Ana", "Ben", "Cai"]
for i in range(len(names)):
    if names[i] == "Ben":
        print(i)
        break
print("done")`),q:"What is printed?",a:"1 then done",w:["done","Ben then done","1"]}]);

B("al-binary",[
 {t:"mc",html:pc(`items = [2, 5, 8, 12, 16, 23, 38]
low, high = 0, 6
mid = (low + high) // 2
print(items[mid])`),q:"What is printed?",a:"12",w:["8","16","3"]},
 {t:"mc",html:pc(`items = [2, 5, 8, 12, 16, 23, 38]
low, high = 0, 6
mid = (low + high) // 2   # items[mid] is 12
# searching for 23`),q:"What are low and high after the first comparison?",a:"low = 4, high = 6",w:["low = 0, high = 2","low = 3, high = 6","low = 4, high = 5"]},
 {t:"mc",q:"Searching [2, 5, 8, 12, 16, 23, 38] for 23 with binary search, which items are compared, in order?",a:"12, 23",w:["2, 5, 8, 12, 16, 23","12, 16, 23","16, 23"]},
 {t:"mc",q:"Searching [2, 5, 8, 12, 16, 23, 38] for 5 with binary search, which items are compared, in order?",a:"12, 5",w:["2, 5","12, 8, 5","8, 5"]},
 {t:"mc",q:"Searching [2, 5, 8, 12, 16, 23, 38] for 10, which items are compared before it gives up?",a:"12, 5, 8",w:["12, 8","12, 5, 8, 10","2, 5, 8, 12"]},
 {t:"mc",html:pc(`while low &lt; high:
    mid = (low + high) // 2
    ...`),q:"What's wrong with this loop condition?",a:"It should be low &lt;= high, or a one-item range is never checked",w:["Nothing","It should be low == high","mid should use /"]},
 {t:"mc",q:"Why is mid worked out with // rather than /?",a:"An index must be a whole number",w:["// is faster","/ rounds up","// sorts the list"]},
 {t:"mc",html:pc(`def bs(a, t, low, high):
    if low &gt; high:
        return -1
    mid = (low + high) // 2
    if a[mid] == t:
        return mid
    if a[mid] &lt; t:
        return bs(a, t, mid + 1, high)
    return bs(a, t, low, mid - 1)`),q:"Which lines are the base cases?",a:"if low &gt; high and if a[mid] == t",w:["Only if low &gt; high","The two return bs(...) lines","mid = (low + high) // 2"]},
 {t:"mc",q:"What is the maximum number of comparisons a binary search needs for 1,000 sorted items?",a:"10",w:["1,000","500","100"]},
 {t:"mc",q:"If the high = mid - 1 line were changed to high = mid, what could happen?",a:"An infinite loop when the target is missing",w:["It would find items faster","Nothing","It would sort the list"]},
 {t:"mc",q:"Doubling the number of sorted items adds how many comparisons to a binary search, at most?",a:"1",w:["Double the comparisons","10","None"]},
 {t:"mc",q:"Binary search is used on [8, 3, 12, 5]. What is the problem?",a:"The list isn't sorted, so it may wrongly report not found",w:["The list is too short","It has an even number of items","There is no problem"]}]);

B("al-bubble2",[
 {t:"mc",q:"What does [5, 1, 4, 2, 8] look like after the first pass of an ascending bubble sort?",a:"[1, 4, 2, 5, 8]",w:["[1, 2, 4, 5, 8]","[1, 5, 4, 2, 8]","[5, 1, 4, 2, 8]"]},
 {t:"mc",q:"What does [3, 1, 2] look like after the first pass of an ascending bubble sort?",a:"[1, 2, 3]",w:["[1, 3, 2]","[3, 1, 2]","[2, 1, 3]"]},
 {t:"mc",q:"How many comparisons are made in the first pass of a bubble sort of 6 items?",a:"5",w:["6","3","15"]},
 {t:"mc",q:"With a shrinking upper bound, how many comparisons are in the second pass of a bubble sort of 6 items?",a:"4",w:["5","6","3"]},
 {t:"mc",html:pc(`a = [4, 7]
a[0], a[1] = a[1], a[0]
print(a)`),q:"What is printed?",a:"[7, 4]",w:["[4, 7]","[7, 7]","[4, 4]"]},
 {t:"mc",html:pc(`a = [4, 7]
a[0] = a[1]
a[1] = a[0]
print(a)`),q:"Why is this not a swap?",a:"The first line overwrites 4, so both become 7",w:["It is a swap","Lists can't be changed","It raises an error"]},
 {t:"mc",html:pc(`for j in range(len(a)):
    if a[j] &gt; a[j + 1]:
        a[j], a[j + 1] = a[j + 1], a[j]`),q:"What error does this cause?",a:"IndexError: j + 1 goes past the end",w:["None","TypeError","It sorts descending"]},
 {t:"mc",q:"Where should swapped = False go in a bubble sort with early exit?",a:"At the start of each pass",w:["Once, before the outer loop","Inside the if","After the sort"]},
 {t:"mc",q:"Which comparison makes a bubble sort put the largest first?",a:"if a[j] &lt; a[j + 1]: swap",w:["if a[j] &gt; a[j + 1]: swap","if a[j] == a[j + 1]: swap","if j &gt; j + 1: swap"]},
 {t:"mc",q:"A bubble sort with early exit sorts [1, 2, 3, 5, 4]. How many passes?",a:"2",w:["1","4","5"]},
 {t:"mc",q:"What does 'in place' mean for a sort?",a:"It rearranges the original list instead of making a new one",w:["It sorts only part of the list","It uses sorted()","It sorts while the list is printed"]},
 {t:"mc",q:"Why is bubble sort slow on large lists?",a:"It makes many passes, each comparing many pairs",w:["It can only sort numbers","It needs the list sorted first","It uses recursion"]}]);

B("al-insert",[
 {t:"mc",q:"Insertion sort (ascending) on [5, 2, 4, 1]. What is the list after the first pass (inserting 2)?",a:"[2, 5, 4, 1]",w:["[2, 4, 5, 1]","[1, 2, 4, 5]","[5, 2, 4, 1]"]},
 {t:"mc",q:"Insertion sort (ascending) on [5, 2, 4, 1]. What is the list after the second pass?",a:"[2, 4, 5, 1]",w:["[2, 5, 4, 1]","[1, 2, 4, 5]","[2, 4, 1, 5]"]},
 {t:"mc",q:"Insertion sort on [5, 2, 4, 1]. How many shifts happen when inserting the 1?",a:"3",w:["1","0","4"]},
 {t:"mc",html:pc(`for i in range(1, len(a)):
    current = a[i]
    j = i - 1
    while j &gt;= 0 and a[j] &gt; current:
        a[j + 1] = a[j]
        j = j - 1
    a[j + 1] = current`),q:"Why is the condition j &gt;= 0 needed?",a:"To stop at the start of the list",w:["To skip negative numbers","To sort descending","It isn't needed"]},
 {t:"mc",html:pc(`for i in range(1, len(a)):
    current = a[i]
    j = i - 1
    while j &gt;= 0 and a[j] &gt; current:
        a[j + 1] = a[j]
        j = j - 1
    a[j + 1] = current`),q:"Why is the last line a[j + 1] and not a[j]?",a:"j has moved one place left of the gap",w:["It's a mistake","To leave a space","a[j] is the current item"]},
 {t:"mc",q:"How many shifts does insertion sort make on [1, 2, 3, 4, 5]?",a:"0",w:["4","5","10"]},
 {t:"mc",q:"Which change makes an insertion sort put the largest first?",a:"Shift while a[j] &lt; current",w:["Start the outer loop at 0","Use j &lt;= 0","Shift while a[j] == current"]},
 {t:"mc",q:"After pass i of an insertion sort, what is true?",a:"The first i + 1 items are in order",w:["The last i items are in final place","The list is sorted","The smallest item is last"]},
 {t:"mc",q:"Which is an advantage of insertion sort over bubble sort?",a:"It does far less work on nearly sorted data",w:["It never compares items","It doesn't need a loop","It only works on numbers"]},
 {t:"mc",q:"Why does insertion sort shift rather than swap?",a:"Shifting moves each item once, then the current item drops into the gap",w:["Python can't swap","Swapping is illegal in sorts","Shifting sorts descending"]},
 {t:"mc",q:"In insertion sort, what is 'current'?",a:"The item being inserted into the sorted part",w:["The smallest item","The last item","The number of passes"]},
 {t:"mc",q:"What happens to items equal to current when the condition is a[j] &gt; current?",a:"They stay before it, so equal items keep their order",w:["They move after it","They are deleted","They cause an error"]}]);

B("al-recur2",[
 {t:"mc",html:pc(`def f(n):
    if n == 0:
        return 0
    return n + f(n - 1)
print(f(4))`),q:"What is printed?",a:"10",w:["24","4","0"]},
 {t:"mc",html:pc(`def f(n):
    if n == 1:
        return 1
    return n * f(n - 1)
print(f(5))`),q:"What is printed?",a:"120",w:["15","5","25"]},
 {t:"mc",html:pc(`def f(n):
    if n &lt;= 1:
        return n
    return f(n - 1) + f(n - 2)
print(f(6))`),q:"What is printed?",a:"8",w:["6","13","5"]},
 {t:"mc",html:pc(`def f(s):
    if s == "":
        return 0
    return 1 + f(s[1:])
print(f("code"))`),q:"What does f return?",a:"4, the length of the string",w:["\"edoc\"","0","1"]},
 {t:"mc",html:pc(`def f(n):
    if n == 0:
        return
    print(n)
    f(n - 1)
f(3)`),q:"What is printed?",a:"3, 2, 1",w:["1, 2, 3","3, 2, 1, 0","3"]},
 {t:"mc",html:pc(`def f(n):
    if n == 0:
        return
    f(n - 1)
    print(n)
f(3)`),q:"What is printed?",a:"1, 2, 3",w:["3, 2, 1","0, 1, 2, 3","3"]},
 {t:"mc",html:pc(`def f(n):
    return n + f(n - 1)
print(f(3))`),q:"What happens?",a:"RecursionError: there's no base case",w:["6 is printed","3 is printed","0 is printed"]},
 {t:"mc",html:pc(`def f(n):
    if n == 0:
        return 1
    return 2 * f(n - 1)
print(f(5))`),q:"What is printed?",a:"32",w:["10","25","16"]},
 {t:"mc",html:pc(`def f(n):
    if n == 0:
        return 0
    return n + f(n - 2)
print(f(5))`),q:"What happens?",a:"RecursionError: n skips past 0",w:["9 is printed","15 is printed","5 is printed"]},
 {t:"mc",q:"How many stack frames for f are on the call stack at the deepest point of f(4), where f(0) is the base case?",a:"5",w:["4","1","8"]},
 {t:"mc",q:"Which is a disadvantage of recursion compared with a loop?",a:"Each call uses stack memory, so deep recursion can fail",w:["It can't return values","It's never shorter","It can't use parameters"]},
 {t:"mc",html:pc(`def f(a):
    if len(a) == 0:
        return 0
    return a[0] + f(a[1:])
print(f([4, 1, 5]))`),q:"What is printed?",a:"10",w:["4","5","[4, 1, 5]"]}]);

/* ---------- third activities ---------- */
O("o-commentfirst",["Read the specification","Write each step of the algorithm as a comment","Check the steps solve the problem for a test case","Write the code under each comment","Run and test the subprogram","Keep the comments to explain the steps"]);
A("a10-1-abstraction",[ord("o-commentfirst","Comment-first coding","Put the stages of comment-first coding in order.")]);
S("s-pattern",{"Running total":["Adding up the bill","Total rainfall this month","Sum of the scores"],"Counting":["How many passed","Number of empty seats","How many words are long"],"Finding the maximum or minimum":["Highest score","Cheapest flight","Coldest day"],"Linear search":["Is this username taken?","Where is Ben in the list?","Find the first negative value"]},3);
A("a10-1-patterns",[srt("s-pattern","Which pattern?","Drag each problem to the standard algorithm pattern that solves it.")]);
S("s-shape",{"Terminator (rounded)":["Start","Stop"],"Input/output (parallelogram)":["x = int(input())","print(total)"],"Process (rectangle)":["total = total + x","count = 0"],"Decision (diamond)":["if x == 0:","while x &gt; 0:"]},2);
A("a10-2-flowcode",[srt("s-shape","Which flowchart shape?","Drag each piece of Python to the flowchart shape it comes from.")]);
O("o-linear",["def linear_search(items, target):","    for i in range(len(items)):","        if items[i] == target:","            return i","    return -1"]);
A("a10-3-linear",[ord("o-linear","Build a linear search","Put the lines of the linear search function in order.")]);
O("o-binary",["low = 0 and high = len(items) - 1","While low &lt;= high","mid = (low + high) // 2","If items[mid] is the target, return mid","If items[mid] is smaller than the target, low = mid + 1","Otherwise high = mid - 1","After the loop, return -1"]);
A("a10-3-binary",[ord("o-binary","Steps of binary search","Put the steps of an iterative binary search in order.")]);
O("o-bubble",["n = len(items) and swapped = True","While swapped is True","Set swapped to False","For each j from 0 to n - 2","If items[j] &gt; items[j + 1], swap them and set swapped to True","After the pass, n = n - 1"]);
A("a10-3-bubble",[ord("o-bubble","Steps of bubble sort","Put the steps of a bubble sort with early exit and a shrinking bound in order.")]);
O("o-insert",["for i in range(1, len(items)):","    current = items[i]","    j = i - 1","    while j &gt;= 0 and items[j] &gt; current:","        items[j + 1] = items[j]","        j = j - 1","    items[j + 1] = current"]);
A("a10-3-insertion",[ord("o-insert","Build an insertion sort","Put the lines of an in-place insertion sort in order.")]);
O("o-recur",["def factorial(n):","    if n == 1:","        return 1","    return n * factorial(n - 1)","print(factorial(5))"]);
A("a10-4-recursion2",[ord("o-recur","Build a recursive function","Put the lines of a recursive factorial program in order.")]);

P("a10-1-abstraction",`Abstraction | Hide unneeded detail
Decomposition | Break into parts
Interface | Parameters and return value
Implementation | Code inside a subprogram
Black box | Known inputs and outputs
Comment-first coding | Steps written as comments
Top-down design | Whole problem, then parts
len(name) | Used without knowing how
Change implementation | Callers unaffected
Tube map | Leaves out real distances
is_leap(year) | Hides the leap year rules
days_in_month(m, y) | Reuses is_leap
Subprogram name | Says what, not how
# add each month's days | A comment-first step
Smaller sub-problems | Easier to test
Function call | Uses the abstraction
Docstring | Describes the interface
Module | A file of subprograms`);

P("a10-1-patterns",`Pattern recognition | Spot a similar problem
Generalisation | Solve a whole family
Parameter | Replaces a fixed value
Default parameter | Used if none given
ch="*" | A default value
Running total | total = total + x
Counting | count = count + 1
Finding the maximum | if x > best
Linear search | Check each in turn
convert(amount, rate) | One function, many currencies
count_between(v, lo, hi) | Teens or passes
Reuse | Don't write it twice
Word frequencies | Dictionary of counts
round(3.7) | Default number of places
One general function | Only one thing to test
Cheapest flight | Same as coldest day
Specific copies | Harder to maintain
box(4, 2) | Uses the default "#"`);

P("a10-2-flowcode",`Terminator | Start or Stop
Parallelogram | Input or output
Rectangle | Process
Diamond | Decision
← in a flowchart | = in Python
= in a flowchart test | == in Python
≠ | !=
Decision looping back | while loop
Paths that rejoin | if–else
OUTPUT | print()
INPUT x | x = int(input())
Repeat 10 times | for i in range(10)
Repeat until x is 0 | while x != 0
Input inside the loop | At the end of the body
Structured English | Numbered plain steps
Trace first | Know the expected output
Arrow | Order of steps
Algorithm | Precise steps`);

P("a10-3-linear",`Linear search | Check each item in turn
Target | Value searched for
return i | Found: give the index
return -1 | Not found
Early exit | Stop once known
break | Leaves a for loop
Sorted early exit | Stop at a bigger item
Best case | 1 comparison
Worst case | n comparisons
Unsorted data | Linear search still works
return -1 inside else | Bug: stops after one
for i in range(len(items)) | Visit every index
items[i] == target | The comparison
Search records | Compare one field
.lower() on both | Ignore capitals
found flag | Boolean set to True
Count matches | No early exit
1,000 items, target first | Found on the first check`);

P("a10-3-binary",`Binary search | Halve the list each time
Precondition | List must be sorted
mid | (low + high) // 2
Target bigger | low = mid + 1
Target smaller | high = mid - 1
low > high | Not found
while low <= high | Iterative loop
Recursive version | Calls itself on a half
Base cases | Found, or low > high
1,000 items | At most 10 comparisons
Double the items | One more comparison
// | Whole-number index
low < high | Misses one-item ranges
high = mid | Can loop forever
Unsorted list | Wrong answers
low = 0 | Start of the list
high = len(items) - 1 | End of the list
Returns mid | Index of the target`);

P("a10-3-bubble",`Bubble sort | Compare neighbours, swap
Pass | One run through the list
Swap | a[j], a[j+1] = a[j+1], a[j]
After pass 1 | Largest is last
Shrinking bound | n = n - 1 each pass
Early exit | Stop if no swaps
swapped = False | At the start of a pass
Already sorted | 1 pass
6 items, pass 1 | 5 comparisons
range(len(a)) with a[j+1] | IndexError
In place | Changes the original list
a[j] < a[j+1]: swap | Largest first
Two assignments | Not a swap
Slow on big lists | Many passes
[3, 1, 2] after pass 1 | [1, 2, 3]
Swapped flag | Boolean
Sort records | Compare one field
Passes returned | Count of passes`);

P("a10-3-insertion",`Insertion sort | Insert into sorted part
Outer loop starts at 1 | One item is sorted
current = items[i] | Save before shifting
Shift | items[j+1] = items[j]
j >= 0 | Stop at the start
items[j] > current | Keep shifting
items[j + 1] = current | Drop into the gap
Nearly sorted data | Very fast
Already sorted | No shifts
After pass i | First i + 1 in order
items[j] < current | Largest first
Equal items | Keep their order
In-place sort | No new list
[5, 2, 4, 1] pass 1 | [2, 5, 4, 1]
Inserting 1 into [2, 4, 5] | 3 shifts
j = i - 1 | Start of the inner loop
Sort by length | Compare len()
Reversed data | Most shifts`);

P("a10-4-recursion2",`Recursion | A function calls itself
Base case | Stops the recursion
Recursive case | Smaller problem
No base case | RecursionError
Stack frame | One call's memory
Call stack | Calls not yet returned
Unwinding | Results passed back down
f(4) with n + f(n - 1) | 10
factorial(5) | 120
power(2, 10) | 1024
reverse(s[1:]) + s[0] | Reverses a string
n % 10 | Last digit
n // 10 | All but the last digit
Print before the call | Counts down
Print after the call | Counts up
n - 2 from 5 | Skips the base case
Deep recursion | Uses lots of memory
Each call | Closer to the base case`);
