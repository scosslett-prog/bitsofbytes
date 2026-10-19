/* 7.1 Constructs */
L("a7-1",[
{slug:"selection",title:"Sequence and selection",covers:[1],
 v:[["Sequence","Instructions carried out one after another, in the order they're written."],
  ["Selection","Choosing which code to run depending on a condition, using if, elif, else or match-case."],
  ["Condition","An expression that is either True or False, such as score >= 50."],
  ["if / elif / else","Tests conditions in order; only the first block whose condition is True runs; else runs if none are."],
  ["match-case","Compares one value against several patterns and runs the first case that matches; case _ catches anything else."],
  ["Nested selection","An if statement inside another if statement."],
  ["Indentation","The spaces at the start of a line, which show Python which lines belong to a block."]],
 q:[["score = 72. Which branch runs in: if score >= 80 … elif score >= 60 … else …?","The elif branch","The if branch","The else branch","Both the if and elif branches"],
  ["What does case _: do in a match statement?","Matches any value not matched by an earlier case","Matches only the underscore character","Causes an error","Ends the program"],
  ["How does Python know which lines are inside an if block?","They're indented","They end with a semicolon","They're in curly brackets","They follow a THEN keyword"],
  ["Which operator tests whether two values are equal?","==","=","!=","=>"]],
 acts:[{id:"act1",title:"Activity 1",desc:"What does it print? · 8 questions",gen:"bank",bank:"al-sel",explain:"Read each Python program and work out what it prints. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Selection · 3 tasks",type:"py",explain:"Write programs that make decisions. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Grade boundaries",brief:"Ask for a mark out of 100 and print the grade: <b>A</b> for 70 or more, <b>B</b> for 60–69, <b>C</b> for 50–59, otherwise <b>U</b>.",
     starter:"mark = int(input(\"Mark: \"))\n",
     tests:[{name:"70 gives A",stdin:["70"],expect:"A"},{name:"69 gives B",stdin:["69"],expect:"B"},{name:"50 gives C",stdin:["50"],expect:"C"},{name:"49 gives U",stdin:["49"],expect:"U"}],
     hint:"Test the highest boundary first: if mark >= 70 … elif mark >= 60 … elif mark >= 50 … else …",
     solution:"mark = int(input(\"Mark: \"))\nif mark >= 70:\n    print(\"A\")\nelif mark >= 60:\n    print(\"B\")\nelif mark >= 50:\n    print(\"C\")\nelse:\n    print(\"U\")"},
    {title:"Day name",brief:"Ask for a day number (1–7) and use <span class='mono'>match</span>-<span class='mono'>case</span> to print <b>Monday</b> … <b>Sunday</b>. Any other number prints <b>Invalid</b>.",
     stdin:["1"],starter:"day = int(input(\"Day number: \"))\nmatch day:\n    case 1:\n        print(\"Monday\")\n",
     tests:[{name:"1 gives Monday",stdin:["1"],expect:"Monday"},{name:"5 gives Friday",stdin:["5"],expect:"Friday"},{name:"7 gives Sunday",stdin:["7"],expect:"Sunday"},{name:"9 gives Invalid",stdin:["9"],expect:"Invalid"},{name:"uses match",py:"assert 'match ' in __code__ and 'case _' in __code__, 'Use match with case _ for anything else'"}],
     hint:"Add a case for each number 2 to 7, then case _: print(\"Invalid\").",
     solution:"day = int(input(\"Day number: \"))\nmatch day:\n    case 1:\n        print(\"Monday\")\n    case 2:\n        print(\"Tuesday\")\n    case 3:\n        print(\"Wednesday\")\n    case 4:\n        print(\"Thursday\")\n    case 5:\n        print(\"Friday\")\n    case 6:\n        print(\"Saturday\")\n    case 7:\n        print(\"Sunday\")\n    case _:\n        print(\"Invalid\")"},
    {title:"Leap year",brief:"Ask for a year and print <b>Leap year</b> or <b>Not a leap year</b>. A year is a leap year if it divides by 4, except years that divide by 100, unless they also divide by 400.",
     starter:"year = int(input(\"Year: \"))\n",
     tests:[{name:"2024 is a leap year",stdin:["2024"],expect:"Leap year"},{name:"1900 is not",stdin:["1900"],expect:"Not a leap year"},{name:"2000 is",stdin:["2000"],expect:"Leap year"},{name:"2023 is not",stdin:["2023"],expect:"Not a leap year"}],
     hint:"year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)",
     solution:"year = int(input(\"Year: \"))\nif year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):\n    print(\"Leap year\")\nelse:\n    print(\"Not a leap year\")"}]}]},
{slug:"iteration",title:"Count-controlled and condition-controlled loops",covers:[1],
 v:[["Iteration","Repeating a block of code."],
  ["Count-controlled loop","A loop that runs a set number of times; in Python, for with range()."],
  ["Condition-controlled loop","A loop that repeats while a condition is True; in Python, while."],
  ["range(start, stop, step)","Generates numbers from start up to, but not including, stop, going up in steps."],
  ["Infinite loop","A loop whose condition never becomes False, so it never ends."],
  ["Nested loop","A loop inside another loop: the inner loop runs completely for every pass of the outer loop."],
  ["Loop variable","The variable that takes each value in turn in a for loop."]],
 q:[["How many times does for i in range(3, 10, 2) run?","4","3","7","10"],
  ["Which loop suits 'keep asking until the password is correct'?","while","for with range","match-case","if"],
  ["What does range(5) produce?","0, 1, 2, 3, 4","1, 2, 3, 4, 5","0, 1, 2, 3, 4, 5","5"],
  ["A loop prints 'Hi' inside two nested loops of 3 and 4 passes. How many times?","12","7","3","4"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Loop outputs · 8 questions",gen:"bank",bank:"al-loops",explain:"Work out what each loop prints, or how many times it runs. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Loops · 3 tasks",type:"py",explain:"Write count-controlled and condition-controlled loops. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Times table",brief:"Ask for a number and print its times table from 1 to 12, one line each, in the form <span class='mono'>3 x 4 = 12</span>.",
     stdin:["7"],starter:"n = int(input(\"Number: \"))\n",
     tests:[{name:"7 x 1 = 7 to 7 x 12 = 84",stdin:["7"],expect:["7 x 1 = 7","7 x 6 = 42","7 x 12 = 84"]},{name:"uses for",py:"assert 'for ' in __code__"}],
     hint:"for i in range(1, 13): print(n, \"x\", i, \"=\", n * i)",
     solution:"n = int(input(\"Number: \"))\nfor i in range(1, 13):\n    print(n, \"x\", i, \"=\", n * i)"},
    {title:"Running total",brief:"Keep asking for whole numbers until <b>0</b> is entered, then print the total of the numbers.",
     stdin:["0"],starter:"total = 0\nn = int(input(\"Number: \"))\n",
     tests:[{name:"5, 3, 8, 0 gives 16",stdin:["5","3","8","0"],expect:"16"},{name:"just 0 gives 0",stdin:["0"],expect:"0"},{name:"uses while",py:"assert 'while ' in __code__"}],
     hint:"while n != 0: add n to total, then ask for the next n. Print total after the loop.",
     solution:"total = 0\nn = int(input(\"Number: \"))\nwhile n != 0:\n    total = total + n\n    n = int(input(\"Number: \"))\nprint(total)"},
    {title:"Triangle",brief:"Ask for a height and print a right-angled triangle of <span class='mono'>*</span> with that many rows: 1 star on the first row, 2 on the second, and so on.",
     starter:"h = int(input(\"Height: \"))\n",
     tests:[{name:"height 3",stdin:["3"],expect:["*\n**\n***"]},{name:"height 1",stdin:["1"],expect:"*"}],
     hint:"for row in range(1, h + 1): print(\"*\" * row)",
     solution:"h = int(input(\"Height: \"))\nfor row in range(1, h + 1):\n    print(\"*\" * row)"}]}]},
{slug:"exceptions",title:"Handling exceptions",covers:[1],
 v:[["Exception","An error that happens while a program is running, such as dividing by zero."],
  ["try / except","Runs the code in try; if a named exception happens, runs the except block instead of crashing."],
  ["ValueError","Raised when a value has the right type but an unsuitable value, e.g. int(\"abc\")."],
  ["ZeroDivisionError","Raised when dividing by zero."],
  ["IndexError","Raised when a list index is out of range."],
  ["KeyError","Raised when a dictionary key doesn't exist."],
  ["TypeError","Raised when an operation is used on the wrong type, e.g. \"5\" + 3."],
  ["FileNotFoundError","Raised when opening a file that doesn't exist for reading."]],
 q:[["What does int(\"twelve\") raise?","ValueError","TypeError","NameError","KeyError"],
  ["Which exception does nums[10] raise when nums has 3 items?","IndexError","KeyError","ValueError","ZeroDivisionError"],
  ["Why use try / except around input that should be a number?","So the program doesn't crash if the user types text","To make the program faster","To convert the text automatically","Because input() always raises an error"],
  ["What does \"5\" + 3 raise?","TypeError","ValueError","SyntaxError","No error: it gives 8"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Which exception? · 8 questions",gen:"bank",bank:"al-exc",explain:"Work out which exception each line of code raises, or what a try / except block prints. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Exceptions · 2 tasks",type:"py",explain:"Make programs that don't crash on bad input. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Ask until it's a number",brief:"Keep asking for an age until a whole number is entered, then print <span class='mono'>Age: 16</span>. When the input isn't a whole number, print <b>Please enter a whole number</b> and ask again.",
     stdin:["16"],starter:"while True:\n    text = input(\"Age: \")\n    # try to convert text to an int here\n",
     tests:[{name:"abc then 16",stdin:["abc","16"],expect:["Please enter a whole number","Age: 16"]},{name:"straight away",stdin:["12"],expect:"Age: 12"},{name:"uses try / except ValueError",py:"assert 'except ValueError' in __code__"}],
     hint:"try: age = int(text); break — except ValueError: print the message. After the loop, print the age.",
     solution:"while True:\n    text = input(\"Age: \")\n    try:\n        age = int(text)\n        break\n    except ValueError:\n        print(\"Please enter a whole number\")\nprint(\"Age:\", age)"},
    {title:"Safe division",brief:"Write <span class='mono'>safe_divide(a, b)</span> that returns <span class='mono'>a / b</span>, or <span class='mono'>None</span> if b is zero. Use try / except, not an if.",
     starter:"def safe_divide(a, b):\n    pass\n\nprint(safe_divide(10, 4), safe_divide(1, 0))",
     tests:[{name:"10 / 4 is 2.5",py:"assert safe_divide(10, 4) == 2.5"},{name:"1 / 0 gives None",py:"assert safe_divide(1, 0) is None"},{name:"uses except ZeroDivisionError",py:"assert 'except ZeroDivisionError' in __code__"}],
     hint:"try: return a / b — except ZeroDivisionError: return None",
     solution:"def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None\n\nprint(safe_divide(10, 4), safe_divide(1, 0))"}]}]},
{slug:"variables",title:"Variables, constants and operators",covers:[2,3],
 v:[["Variable","A named location in memory whose value can change while the program runs."],
  ["Constant","A named value that shouldn't change; in Python written in capitals by convention, e.g. VAT_RATE."],
  ["Assignment","Giving a variable a value with =, e.g. total = 0."],
  ["Arithmetic operators","+ − * / // % **"],
  ["Relational operators","== != > >= < <=, which compare values and give True or False."],
  ["Boolean operators","and, or, not, which combine True/False values."],
  ["Bitwise operators","& | ^ ~ << >>, which work on the individual bits of integers."]],
 q:[["Why write VAT_RATE = 0.2 in capitals?","To show it's a constant that shouldn't change","Python requires capitals for decimals","It makes the program run faster","Capitals are needed for global variables"],
  ["What is 2 ** 3 + 10 // 4?","10","8","10.5","11"],
  ["What is not (5 > 3 and 2 > 4)?","True","False","None","An error"],
  ["What is 6 & 3?","2","9","7","1"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Evaluate it · 8 questions",gen:"bank",bank:"al-opseval",explain:"Work out the value of expressions using arithmetic, relational, Boolean and bitwise operators. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Variables and operators · 2 tasks",type:"py",explain:"Use variables, constants and operators. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Price with VAT",brief:"Use a constant <span class='mono'>VAT_RATE = 0.2</span>. Ask for a price and print the price with VAT added, rounded to 2 decimal places.",
     stdin:["10"],starter:"VAT_RATE = 0.2\nprice = float(input(\"Price: \"))\n",
     tests:[{name:"10 gives 12.0",stdin:["10"],expect:"12.0"},{name:"19.99 gives 23.99",stdin:["19.99"],expect:"23.99"},{name:"uses the constant",py:"assert 'VAT_RATE' in __code__.split('\\n', 1)[1], 'Use VAT_RATE in the calculation'"}],
     hint:"print(round(price * (1 + VAT_RATE), 2))",
     solution:"VAT_RATE = 0.2\nprice = float(input(\"Price: \"))\nprint(round(price * (1 + VAT_RATE), 2))"},
    {title:"Minutes and seconds",brief:"Ask for a number of seconds and print it as minutes and seconds, e.g. <span class='mono'>200</span> gives <span class='mono'>3 minutes 20 seconds</span>. Use <span class='mono'>//</span> and <span class='mono'>%</span>.",
     stdin:["200"],starter:"secs = int(input(\"Seconds: \"))\n",
     tests:[{name:"200",stdin:["200"],expect:"3 minutes 20 seconds"},{name:"59",stdin:["59"],expect:"0 minutes 59 seconds"},{name:"uses // and %",py:"assert '//' in __code__ and '%' in __code__"}],
     hint:"minutes = secs // 60; left = secs % 60",
     solution:"secs = int(input(\"Seconds: \"))\nprint(secs // 60, \"minutes\", secs % 60, \"seconds\")"}]}]},
{slug:"subprograms",title:"Procedures and functions",covers:[4],
 v:[["Subprogram","A named block of code that can be called from elsewhere in a program."],
  ["Procedure","A subprogram that carries out a task but doesn't return a value."],
  ["Function","A subprogram that returns a value to the code that called it."],
  ["Parameter","A variable listed in a subprogram's definition, which receives a value when it's called."],
  ["Argument","The actual value passed to a subprogram when it is called."],
  ["Return value","The value a function sends back with return."],
  ["Local variable","A variable created inside a subprogram, which only exists while the subprogram runs."],
  ["Global variable","A variable created outside all subprograms; a subprogram must declare it global to change it."]],
 q:[["In def area(w, h):, what are w and h?","Parameters","Arguments","Return values","Global variables"],
  ["In area(3, 4), what are 3 and 4?","Arguments","Parameters","Local variables","Constants"],
  ["What is the difference between a function and a procedure?","A function returns a value","A procedure returns a value","Functions can't have parameters","Procedures must be global"],
  ["What does a function return if it has no return statement?","None","0","An empty string","An error"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Calling subprograms · 8 questions",gen:"bank",bank:"al-subs",explain:"Read programs that define and call procedures and functions, and work out what they do. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Subprograms · 3 tasks",type:"py",explain:"Write your own procedures and functions. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Largest of three",brief:"Write a function <span class='mono'>largest(a, b, c)</span> that returns the biggest of three numbers, without using <span class='mono'>max()</span>.",
     starter:"def largest(a, b, c):\n    pass\n\nprint(largest(4, 9, 2))",
     tests:[{name:"4, 9, 2 gives 9",py:"assert largest(4, 9, 2) == 9"},{name:"first is biggest",py:"assert largest(10, 3, 7) == 10"},{name:"last is biggest",py:"assert largest(1, 2, 3) == 3"},{name:"equal values",py:"assert largest(5, 5, 5) == 5"},{name:"no max()",py:"assert 'max(' not in __code__"}],
     hint:"Start with big = a, then compare with b and c.",
     solution:"def largest(a, b, c):\n    big = a\n    if b > big:\n        big = b\n    if c > big:\n        big = c\n    return big\n\nprint(largest(4, 9, 2))"},
    {title:"Banner",brief:"Write a <b>procedure</b> <span class='mono'>banner(text)</span> that prints the text with a line of <span class='mono'>=</span> above and below, the same length as the text. Then call it with <span class='mono'>\"Bits of Bytes\"</span>.",
     starter:"def banner(text):\n    pass\n\n",
     tests:[{name:"Bits of Bytes banner",stdin:[],expect:["=============\nBits of Bytes\n============="]},{name:"banner('Hi')",py:"import io, contextlib\nb = io.StringIO()\nwith contextlib.redirect_stdout(b):\n    r = banner('Hi')\nassert b.getvalue().split() == ['==', 'Hi', '=='] and r is None"}],
     hint:"line = \"=\" * len(text). Print line, text, line. Then call banner(\"Bits of Bytes\") at the bottom.",
     solution:"def banner(text):\n    line = \"=\" * len(text)\n    print(line)\n    print(text)\n    print(line)\n\nbanner(\"Bits of Bytes\")"},
    {title:"Count the calls",brief:"<span class='mono'>score</span> is a global variable. Complete <span class='mono'>add_points(n)</span> so it adds n to the global score. Don't change the last two lines.",
     starter:"score = 0\n\ndef add_points(n):\n    score = score + n\n\nadd_points(5)\nadd_points(3)\n",
     tests:[{name:"score is 8",py:"assert score == 8, score"},{name:"uses global",py:"assert 'global score' in __code__"}],
     hint:"A subprogram must say global score before it can change the global variable.",
     solution:"score = 0\n\ndef add_points(n):\n    global score\n    score = score + n\n\nadd_points(5)\nadd_points(3)\n"}]}]}]);

B("al-sel",[
 {t:"mc",html:`<pre class="pc py">x = 7
if x &gt; 5:
    print("big")
elif x &gt; 2:
    print("medium")
else:
    print("small")</pre>`,q:"What is printed?",a:"big",w:["medium","big then medium","small"]},
 {t:"mc",html:`<pre class="pc py">x = 7
if x &gt; 5:
    print("A")
if x &gt; 2:
    print("B")</pre>`,q:"What is printed?",a:"A and B, on separate lines",w:["A only","B only","Nothing"]},
 {t:"mc",html:`<pre class="pc py">temp = 18
if temp &lt; 10:
    print("cold")
elif temp &lt; 20:
    print("mild")
elif temp &lt; 30:
    print("warm")</pre>`,q:"What is printed?",a:"mild",w:["cold","warm","mild then warm"]},
 {t:"mc",html:`<pre class="pc py">a, b = 4, 9
if a &gt; b:
    print(a)
else:
    print(b)</pre>`,q:"What is printed?",a:"9",w:["4","4 then 9","Nothing"]},
 {t:"mc",html:`<pre class="pc py">age = 15
member = True
if age &gt;= 16 or member:
    print("in")
else:
    print("out")</pre>`,q:"What is printed?",a:"in",w:["out","in then out","An error"]},
 {t:"mc",html:`<pre class="pc py">cmd = "q"
match cmd:
    case "n":
        print("new")
    case "q":
        print("quit")
    case _:
        print("unknown")</pre>`,q:"What is printed?",a:"quit",w:["unknown","new","quit then unknown"]},
 {t:"mc",html:`<pre class="pc py">n = 0
match n:
    case 1:
        print("one")
    case _:
        print("other")</pre>`,q:"What is printed?",a:"other",w:["one","Nothing","0"]},
 {t:"mc",html:`<pre class="pc py">x = 12
if x % 2 == 0:
    if x % 3 == 0:
        print("six")
    else:
        print("even")</pre>`,q:"What is printed?",a:"six",w:["even","six then even","Nothing"]},
 {t:"mc",html:`<pre class="pc py">name = "Ana"
if name == "ana":
    print("match")
else:
    print("different")</pre>`,q:"What is printed?",a:"different",w:["match","An error","Nothing"]},
 {t:"mc",q:"Which condition is True when x is between 1 and 10 inclusive?",a:"1 &lt;= x &lt;= 10",w:["1 &lt; x &lt; 10","x &gt;= 1 or x &lt;= 10","x == 1 and x == 10"]},
 {t:"mc",q:"Why use elif rather than a second if?",a:"Only one branch of the chain runs, and later conditions aren't checked once one is True",w:["elif is faster to type","if can only be used once per program","elif doesn't need a condition"]},
 {t:"blank",q:"In match-case, the pattern that matches anything is case ___.",a:["_"]}]);

B("al-loops",[
 {t:"mc",html:`<pre class="pc py">for i in range(2, 8, 2):
    print(i, end=" ")</pre>`,q:"What is printed?",a:"2 4 6",w:["2 4 6 8","2 3 4 5 6 7","4 6 8"]},
 {t:"mc",html:`<pre class="pc py">for i in range(5, 0, -1):
    print(i, end=" ")</pre>`,q:"What is printed?",a:"5 4 3 2 1",w:["5 4 3 2 1 0","4 3 2 1 0","1 2 3 4 5"]},
 {t:"mc",html:`<pre class="pc py">n = 1
while n &lt; 50:
    n = n * 3
print(n)</pre>`,q:"What is printed?",a:"81",w:["27","50","243"]},
 {t:"mc",html:`<pre class="pc py">count = 0
for a in range(3):
    for b in range(4):
        count = count + 1
print(count)</pre>`,q:"What is printed?",a:"12",w:["7","3","4"]},
 {t:"mc",html:`<pre class="pc py">x = 10
while x &gt; 0:
    x = x - 3
print(x)</pre>`,q:"What is printed?",a:"-2",w:["0","1","-3"]},
 {t:"mc",html:`<pre class="pc py">total = 0
for ch in "banana":
    if ch == "a":
        total = total + 1
print(total)</pre>`,q:"What is printed?",a:"3",w:["2","6","1"]},
 {t:"mc",html:`<pre class="pc py">for i in range(1, 10):
    if i % 4 == 0:
        break
    print(i, end=" ")</pre>`,q:"What is printed?",a:"1 2 3",w:["1 2 3 4","4 8","1 2 3 5 6 7 9"]},
 {t:"mc",html:`<pre class="pc py">i = 0
while i != 5:
    i = i + 2</pre>`,q:"What happens?",a:"It never ends: i goes 2, 4, 6… and is never 5",w:["It stops when i is 5","It stops when i is 6","It runs twice"]},
 {t:"mc",q:"How many times does the body of for i in range(10, 20) run?",a:"10",w:["11","20","9"]},
 {t:"mc",q:"A program must ask for numbers until the user types 0. Which loop is best?",a:"A while loop",w:["A for loop with range(10)","A match statement","Nested for loops"]},
 {t:"mc",q:"A program must print the 12 months. Which loop is best?",a:"A for loop",w:["A while True loop with no break","An if statement","A match statement"]},
 {t:"blank",q:"range(1, 6) produces the numbers 1 to ___.",a:["5","five"]}]);

B("al-exc",[
 {t:"mc",q:"What does 10 / 0 raise?",a:"ZeroDivisionError",w:["ValueError","ArithmeticWarning","IndexError"]},
 {t:"mc",q:"ages = {\"Ana\": 17}. What does ages[\"Ben\"] raise?",a:"KeyError",w:["IndexError","NameError","ValueError"]},
 {t:"mc",q:"What does open(\"missing.txt\") raise if the file doesn't exist?",a:"FileNotFoundError",w:["IOError only in Python 2","KeyError","ValueError"]},
 {t:"mc",q:"What does print(totl) raise if no variable called totl exists?",a:"NameError",w:["ValueError","TypeError","KeyError"]},
 {t:"mc",q:"What does float(\"3.5\") do?",a:"Returns 3.5",w:["Raises ValueError","Raises TypeError","Returns 3"]},
 {t:"mc",q:"What does int(\"3.5\") do?",a:"Raises ValueError",w:["Returns 3","Returns 4","Returns 3.5"]},
 {t:"mc",html:`<pre class="pc py">try:
    x = int("7")
    print(x * 2)
except ValueError:
    print("bad")</pre>`,q:"What is printed?",a:"14",w:["bad","77","14 then bad"]},
 {t:"mc",html:`<pre class="pc py">nums = [4, 8]
try:
    print(nums[2])
except IndexError:
    print("no such item")</pre>`,q:"What is printed?",a:"no such item",w:["8","None","An error message and the program stops"]},
 {t:"mc",html:`<pre class="pc py">try:
    print(10 / 0)
except ValueError:
    print("value")
except ZeroDivisionError:
    print("zero")</pre>`,q:"What is printed?",a:"zero",w:["value","value then zero","0"]},
 {t:"mc",html:`<pre class="pc py">try:
    n = int("abc")
except ValueError:
    n = 0
print(n + 1)</pre>`,q:"What is printed?",a:"1",w:["abc1","An error","0"]},
 {t:"mc",q:"Why name the exception in except ValueError: rather than a bare except:?",a:"So only the expected error is caught, and other bugs still show up",w:["A bare except: is not allowed in Python","It makes the program faster","It converts the value automatically"]},
 {t:"blank",q:"The keyword that starts the block of code that might cause an error is ___.",a:["try"]}]);

B("al-opseval",[
 {t:"mc",q:"What is 17 // 5 * 2?",a:"6",w:["1","1.7","3.4"]},
 {t:"mc",q:"What is 2 + 3 * 4 ** 2?",a:"50",w:["400","98","146"]},
 {t:"mc",q:"What is -7 // 2?",a:"-4",w:["-3","-3.5","3"]},
 {t:"mc",q:"What is 10 != 10.0?",a:"False",w:["True","An error","None"]},
 {t:"mc",q:"What is \"apple\" &lt; \"banana\"?",a:"True",w:["False","An error","None"]},
 {t:"mc",q:"What is True and not False?",a:"True",w:["False","None","An error"]},
 {t:"mc",q:"What is 5 | 2?",a:"7",w:["3","10","1"]},
 {t:"mc",q:"What is 12 ^ 10?",a:"6",w:["22","2","14"]},
 {t:"mc",q:"What is 1 &lt;&lt; 4?",a:"16",w:["4","5","8"]},
 {t:"mc",q:"What is ~5 in Python?",a:"-6",w:["-5","250","5"]},
 {t:"mc",html:`<pre class="pc py">a = 3
b = a
a = 5
print(b)</pre>`,q:"What is printed?",a:"3",w:["5","8","An error"]},
 {t:"mc",html:`<pre class="pc py">x, y = 2, 9
x, y = y, x
print(x, y)</pre>`,q:"What is printed?",a:"9 2",w:["2 9","9 9","2 2"]}]);

B("al-subs",[
 {t:"mc",html:`<pre class="pc py">def double(n):
    return n * 2

print(double(4) + double(1))</pre>`,q:"What is printed?",a:"10",w:["8","16","5"]},
 {t:"mc",html:`<pre class="pc py">def greet(name):
    print("Hi", name)

x = greet("Ana")
print(x)</pre>`,q:"What is printed?",a:"Hi Ana then None",w:["Hi Ana then Hi Ana","Hi Ana only","None only"]},
 {t:"mc",html:`<pre class="pc py">def f(a, b):
    return a - b

print(f(b=2, a=10))</pre>`,q:"What is printed?",a:"8",w:["-8","12","An error"]},
 {t:"mc",html:`<pre class="pc py">def check(n):
    if n &gt; 0:
        return "positive"
    return "not positive"

print(check(0))</pre>`,q:"What is printed?",a:"not positive",w:["positive","None","positive then not positive"]},
 {t:"mc",html:`<pre class="pc py">count = 0
def add():
    count = 5

add()
print(count)</pre>`,q:"What is printed?",a:"0",w:["5","An error","None"]},
 {t:"mc",html:`<pre class="pc py">def total(items):
    t = 0
    for x in items:
        t = t + x
    return t

print(total([2, 3, 4]))
print(t)</pre>`,q:"What happens?",a:"9 is printed, then a NameError because t is local",w:["9 then 9","0 then 9","9 then 0"]},
 {t:"mc",html:`<pre class="pc py">def area(w, h=2):
    return w * h

print(area(5))</pre>`,q:"What is printed?",a:"10",w:["5","An error: h is missing","7"]},
 {t:"mc",html:`<pre class="pc py">def stats(nums):
    return min(nums), max(nums)

lo, hi = stats([7, 2, 9])
print(hi - lo)</pre>`,q:"What is printed?",a:"7",w:["9","2","(2, 9)"]},
 {t:"mc",q:"Which is an advantage of using subprograms?",a:"Code can be reused and tested in small parts",w:["Programs always run faster","Variables don't need names","They remove the need for loops"]},
 {t:"mc",q:"What is a local variable?",a:"A variable that only exists inside the subprogram that created it",w:["A variable shared by every subprogram","A constant","A variable stored on the local disk"]},
 {t:"mc",q:"A subprogram prints a report but doesn't return anything. What is it?",a:"A procedure",w:["A function","A parameter","A library"]},
 {t:"blank",q:"The keyword that sends a value back from a function is ___.",a:["return"]}]);

P("a7-1-selection",`Sequence | One instruction after another
Selection | Choosing which code runs
Condition | True or False expression
if | Runs a block if true
elif | Checked only if earlier failed
else | Runs if nothing else did
match | Compares one value to cases
case _ | Matches anything else
== | Is equal to
!= | Is not equal to
>= | Greater than or equal to
Indentation | Shows which lines are a block
Nested if | An if inside an if
Only the first true branch | Runs in an if-elif chain
1 <= x <= 10 | x between 1 and 10
"Ana" == "ana" | False
x % 2 == 0 | x is even
: at the end of if | Starts the block`);

P("a7-1-iteration",`Iteration | Repeating code
for loop | Count-controlled
while loop | Condition-controlled
range(5) | 0, 1, 2, 3, 4
range(1, 6) | 1 to 5
range(2, 10, 2) | 2, 4, 6, 8
range(5, 0, -1) | 5 down to 1
Infinite loop | Condition never false
Nested 3 by 4 loops | 12 passes
break | Leaves the loop early
Ask until correct | Use a while loop
Print 12 months | Use a for loop
Loop variable | Takes each value in turn
for ch in "abc" | Each character in turn
while n != 0 | Repeat until 0 entered
Body of the loop | The indented lines
Stop value | Not included in range
"*" * 3 | ***`);

P("a7-1-exceptions",`Exception | Error while running
try | Code that might fail
except | Runs if that error happens
int("abc") | ValueError
10 / 0 | ZeroDivisionError
nums[99] | IndexError
d["missing"] | KeyError
"5" + 3 | TypeError
Undefined name | NameError
Opening a missing file | FileNotFoundError
float("3.5") | Returns 3.5
int("3.5") | Also ValueError
Validate input | Loop with try and except
Bare except: | Hides other bugs
Program without try | Crashes on bad input
except ValueError: | Catches one error type
break after success | Leaves the input loop
Runtime error | Happens while running`);

P("a7-1-variables",`Variable | Value can change
Constant | Shouldn't change
VAT_RATE | A constant by convention
total = 0 | Assignment
// | Integer division
% | Remainder
** | Power
17 // 5 | 3
17 % 5 | 2
2 ** 5 | 32
== and != | Relational operators
and, or, not | Boolean operators
&, ^ and ~ | Bitwise operators
12 & 10 | 8
Bitwise OR of 5 and 2 | 7
1 << 4 | 16
x, y = y, x | Swaps two values
not (True and False) | True`);

P("a7-1-subprograms",`Subprogram | Named reusable block
Procedure | Doesn't return a value
Function | Returns a value
Parameter | Named in the definition
Argument | Value passed in a call
return | Sends a value back
No return statement | Returns None
def | Defines a subprogram
Local variable | Exists only inside
Global variable | Defined outside
global score | Lets a function change it
Default parameter | h=2 in the definition
Keyword argument | f(b=2, a=10)
Two return values | Returned as a tuple
Calling a function | Its name and brackets
Reuse | Benefit of subprograms
Testing in small parts | Another benefit
Scope | Where a variable exists`);

/* third activities */
S("s-tf",{"True when x = 7":["x > 5","x == 7.0","x % 2 == 1","not x < 5","x >= 7 and x <= 10","x == 7 or x == 8"],"False when x = 7":["x != 7","x < 7","x % 7 != 0","x > 5 and x > 9","not x == 7","x // 2 == 4"]},5);
A("a7-1-selection",[srt("s-tf","True or false?","x = 7. Drag each condition to show whether it is True or False.")]);
S("s-loopkind",{"Count-controlled (for)":["Print the 12 months","Add up 30 test scores in a list","Draw a 5 by 5 grid","Repeat a message 10 times"],"Condition-controlled (while)":["Ask for a password until it's right","Keep reading numbers until 0 is entered","Run a game until the player has no lives","Halve a number until it's below 1"]});
A("a7-1-iteration",[srt("s-loopkind","for or while?","Drag each task to the kind of loop that suits it best.")]);
S("s-excwhich",{"ValueError":["int(\"seven\")","float(\"1,5\")","int(\"3.5\")"],"ZeroDivisionError":["10 / 0","5 % 0","total / len([])"],"IndexError":["[1, 2, 3][3]","\"abc\"[5]","[].pop()"],"KeyError":["{\"a\": 1}[\"b\"]","ages[\"Zoe\"] when Zoe isn't a key","del d[\"x\"] when x isn't a key"]},3);
A("a7-1-exceptions",[srt("s-excwhich","Which exception?","Drag each line of code to the exception it raises.")]);
S("s-optype",{"Arithmetic":["//","%","**"],"Relational":["!=",">=","=="],"Boolean":["and","or","not"],"Bitwise":["&","^","<<"]},3);
A("a7-1-variables",[srt("s-optype","Kinds of operator","Drag each operator to the kind of operator it is.")]);
S("s-paramarg",{"Parameter":["w in def area(w, h):","name in def greet(name):","items in def total(items):"],"Argument":["5 in area(5, 2)","\"Ana\" in greet(\"Ana\")","[2, 3, 4] in total([2, 3, 4])"],"Local variable":["t = 0 inside total()","result = w * h inside area()","line = \"=\" * 10 inside a procedure"]},3);
A("a7-1-subprograms",[srt("s-paramarg","Parameters, arguments and locals","Drag each highlighted name or value to what it is.")]);
