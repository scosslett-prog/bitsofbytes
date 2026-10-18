/* 6.1 Data science, 6.2 Artificial intelligence, 6.3 Tools */
L("a6-1",[
{slug:"bigdata",title:"Big data",covers:[1],
 v:[["Big data","Data sets so large, fast-arriving or varied that ordinary software and hardware can't store or process them in a reasonable time."],
  ["Volume","The sheer amount of data, measured in terabytes and beyond."],
  ["Velocity","The speed at which new data arrives and must be processed, often in real time."],
  ["Variety","The range of data types and formats, including unstructured data such as text, images and video."],
  ["Veracity","How accurate and trustworthy the data is."],
  ["Value","The useful insight that can be gained from the data."],
  ["Distributed processing","Splitting processing across many networked computers that work on parts of the data at the same time."],
  ["Unstructured data","Data that doesn't fit neatly into the rows and columns of a table, such as emails, photos or social media posts."]],
 q:[["Which 'V' describes how fast data arrives?","Velocity","Volume","Variety","Value"],
  ["Sensor readings, tweets, photos and video all in one data set show high…","variety","veracity","value","volume only"],
  ["Why is big data usually stored across many servers?","It's too large and fast for one machine to store and process","It must be encrypted","It's only used once","Single servers can't run databases"],
  ["Which 'V' is about whether the data can be trusted?","Veracity","Velocity","Value","Variety"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Big data · 8 questions",gen:"bank",bank:"al-bigdata",explain:"Questions on the five Vs and the infrastructure that big data needs. Every try picks a different set."}]},
{slug:"datascience",title:"Data science tools and techniques",covers:[2],
 v:[["Data science","Using programming, statistics and subject knowledge to get useful information from data."],
  ["Data collection","Gathering data, e.g. from sensors, forms, transactions, APIs or web scraping."],
  ["Web scraping","Using a program to download web pages and extract data from them automatically."],
  ["Data cleaning","Finding and fixing problems in data: missing values, duplicates, errors and inconsistent formats."],
  ["Data analysis","Processing data to find patterns, trends and relationships, e.g. averages, correlations and groupings."],
  ["Data visualisation","Presenting data as charts, graphs and maps so patterns are easy to see."],
  ["Outlier","A value very different from the rest, which may be an error or something important."]],
 q:[["Which comes first in a data science project?","Collecting the data","Visualising the results","Cleaning the data","Drawing conclusions"],
  ["Some ages in a data set are recorded as 250. What should happen in data cleaning?","They should be checked and corrected or removed","Nothing: they're real data","The whole data set should be deleted","They should be made into averages"],
  ["What is web scraping?","Extracting data from web pages with a program","Deleting old web pages","Encrypting a website","Designing web pages"],
  ["Why visualise data?","Patterns and trends are easier to see","It makes the data more accurate","It removes outliers","It reduces the file size"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Data science · 8 questions",gen:"bank",bank:"al-datasci",explain:"Questions on collecting, cleaning, analysing and visualising data, with Python to read. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Cleaning data · 2 tasks",type:"py",explain:"Clean and analyse a small data set in Python. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Remove bad readings",brief:"<span class='mono'>temps</span> holds temperature readings, but a faulty sensor recorded some as <span class='mono'>-999</span>. Make a list <span class='mono'>clean</span> without them, then print the mean of <span class='mono'>clean</span> rounded to 1 decimal place.",
     starter:"temps = [14.2, 15.1, -999, 16.4, 15.8, -999, 13.9]\nclean = []\n",
     tests:[{name:"clean has 5 readings",py:"assert len(clean) == 5, 'clean should have 5 readings'"},{name:"no -999 in clean",py:"assert -999 not in clean"},{name:"prints the mean 15.1",stdin:[],expect:"15.1"}],
     hint:"Loop through temps and append each value that isn't -999. The mean is sum(clean) / len(clean); round(x, 1) rounds it.",
     solution:"temps = [14.2, 15.1, -999, 16.4, 15.8, -999, 13.9]\nclean = []\nfor t in temps:\n    if t != -999:\n        clean.append(t)\nprint(round(sum(clean) / len(clean), 1))"},
    {title:"Count by category",brief:"<span class='mono'>votes</span> lists each person's favourite language. Build a dictionary <span class='mono'>counts</span> of how many votes each got, then print the winner.",
     starter:"votes = [\"Python\", \"C\", \"Python\", \"Java\", \"Python\", \"C\"]\ncounts = {}\n",
     tests:[{name:"counts are right",py:"assert counts == {'Python': 3, 'C': 2, 'Java': 1}, counts"},{name:"prints Python",stdin:[],expect:"Python"}],
     hint:"For each vote, counts[v] = counts.get(v, 0) + 1. Then find the key with the biggest value.",
     solution:"votes = [\"Python\", \"C\", \"Python\", \"Java\", \"Python\", \"C\"]\ncounts = {}\nfor v in votes:\n    counts[v] = counts.get(v, 0) + 1\nbest = \"\"\nfor k in counts:\n    if best == \"\" or counts[k] > counts[best]:\n        best = k\nprint(best)"}]}]}]);

L("a6-2",[
{slug:"ai",title:"Types of AI and machine learning",covers:[1,2],
 v:[["Artificial intelligence (AI)","Computer systems that carry out tasks that normally need human intelligence, such as recognising speech or making decisions."],
  ["Narrow AI","AI that performs one specific task (or a narrow range) well, e.g. recommending films. All AI in use today is narrow."],
  ["General AI","Hypothetical AI with human-level ability to understand, learn and apply knowledge across any task."],
  ["Super AI","Hypothetical AI that would exceed human intelligence in every area."],
  ["Machine learning (ML)","A type of AI in which a system learns patterns from data, rather than being given explicit rules."],
  ["Supervised learning","Learning from labelled training data (inputs with the correct outputs), then predicting labels for new data."],
  ["Unsupervised learning","Finding patterns or groups (clusters) in unlabelled data."],
  ["Training data","The data a machine learning model learns from."]],
 q:[["A spam filter is trained on thousands of emails labelled spam or not spam. Which kind of learning is this?","Supervised","Unsupervised","General AI","Super AI"],
  ["A shop groups customers by buying habits without any labels. Which kind of learning is this?","Unsupervised","Supervised","Narrow labelling","General AI"],
  ["A chess program that can only play chess is an example of…","narrow AI","general AI","super AI","unsupervised AI"],
  ["Does general AI exist today?","No, it's hypothetical","Yes, in all smartphones","Yes, in chess programs","Yes, in spam filters"]],
 acts:[{id:"act1",title:"Activity 1",desc:"AI and ML · 8 questions",gen:"bank",bank:"al-ai",explain:"Questions on narrow, general and super AI, and on supervised and unsupervised learning. Every try picks a different set."}]},
{slug:"llm",title:"Large language models",covers:[3],
 v:[["Large language model (LLM)","An AI model trained on huge amounts of text that generates language by repeatedly predicting likely next words (tokens)."],
  ["Prompt","The text (query and instructions) given to an LLM."],
  ["Context","The information available to the model when it answers: the prompt, earlier conversation and any documents supplied."],
  ["Token","A small chunk of text, such as a word or part of a word, that an LLM processes."],
  ["Knowledge cut-off","The date after which the model's training data stops, so it may not know about later events."],
  ["Hallucination","When an LLM produces fluent but false or made-up information."],
  ["Bias","Unfair or one-sided output that reflects patterns in the training data."]],
 q:[["How does an LLM produce text?","By repeatedly predicting likely next tokens","By looking up answers in a fixed table","By copying one web page","By running a search engine only"],
  ["An LLM confidently gives a book reference that doesn't exist. What is this called?","A hallucination","A bias","A context window","A knowledge cut-off"],
  ["Why might an LLM not know about a recent event?","Its training data stops at a knowledge cut-off","It is switched off at night","LLMs can't store dates","The prompt was too short"],
  ["How can a user improve the accuracy of an LLM's answer?","Give clear, specific context and check the output","Use fewer words","Ask the same question many times without changes","Turn off the internet"]],
 acts:[{id:"act1",title:"Activity 1",desc:"LLMs · 8 questions",gen:"bank",bank:"al-llm",explain:"Questions on how large language models work, and on context, accuracy, knowledge limits and bias. Every try picks a different set."}]}]);

L("a6-3",[
{slug:"ide",title:"IDEs and debugging",covers:[1],
 v:[["IDE","Integrated development environment: one program with the tools needed to write, run, test and debug code."],
  ["Text editor","The part of an IDE for writing code, usually with syntax highlighting, line numbers and auto-indent."],
  ["Autocomplete","Suggests variable names, functions and keywords as you type."],
  ["Syntax checker","Highlights code that breaks the language's rules before or as it runs."],
  ["Debugger","A tool for finding errors by running code in a controlled way."],
  ["Breakpoint","A marked line where the program pauses during debugging so values can be inspected."],
  ["Stepping","Running a program one line at a time in the debugger."],
  ["Memory inspection","Viewing the current values of variables (and memory) while a program is paused."]],
 q:[["What is a breakpoint?","A line where the program pauses during debugging","A syntax error","The end of a program","A crash"],
  ["Which IDE feature helps most with spotting a missing bracket?","Syntax checker / highlighting","Memory inspection","Version control","Autocomplete"],
  ["Which feature lets you watch variables change as each line runs?","Stepping with memory inspection","Autocomplete","Syntax highlighting","Pretty printing"],
  ["What does autocomplete help with?","Typing names correctly and quickly","Finding logic errors","Running tests","Encrypting code"]],
 acts:[{id:"act1",title:"Activity 1",desc:"IDE features · 8 questions",gen:"bank",bank:"al-ide",explain:"Questions on IDE features and using a debugger to find errors. Every try picks a different set."}]},
{slug:"collab",title:"Version control, open source and APIs",covers:[2,3,4],
 v:[["Version control system (VCS)","Software that records every change to a project's files, so earlier versions can be restored and people can work together."],
  ["Commit","A saved snapshot of changes, with a message describing them."],
  ["Branch","A separate line of development, so new features can be worked on without affecting the main code."],
  ["Merge","Combining the changes from one branch into another."],
  ["Open source","Software whose source code is published so anyone can view, change and share it, under a licence."],
  ["Proprietary software","Software whose source code is kept private by its owner; users get a licence to use it."],
  ["API","Application programming interface: a defined set of functions and rules that lets one program use the features or data of another."]],
 q:[["Which is a benefit of version control?","Earlier versions can be restored if something breaks","Code runs faster","It finds syntax errors","It encrypts the code"],
  ["What is a branch in version control?","A separate line of development","A deleted file","A type of loop","A server"],
  ["What does an API do?","Lets one program use another program's features or data","Compiles code","Stores passwords","Draws user interfaces"],
  ["Which is true of open-source software?","Anyone can see and change the source code, under its licence","It must cost money","It can't be used by companies","Its code is secret"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Working together · 8 questions",gen:"bank",bank:"al-collab",explain:"Questions on version control, open-source software and APIs. Every try picks a different set."}]}]);

B("al-bigdata",[
 {t:"mc",q:"A supermarket records every card payment at every till in real time. Which two Vs are highest?",a:"Volume and velocity",w:["Veracity and value","Variety and veracity","Value only"]},
 {t:"mc",q:"Which is an example of unstructured data?",a:"Customer reviews written as free text",w:["A table of product prices","A list of order numbers","A spreadsheet of exam marks"]},
 {t:"mc",q:"Why is veracity a challenge for social media data?",a:"Posts can be false, biased, duplicated or written by bots",w:["Posts are always too short","It's never stored","It arrives too slowly"]},
 {t:"mc",q:"What does 'value' mean in the five Vs?",a:"The useful insight gained from the data",w:["The price of the storage","The number of records","The speed of the network"]},
 {t:"mc",q:"Why is distributed processing used for big data?",a:"Many machines work on parts of the data at the same time, so it's processed much faster",w:["It needs fewer computers","It makes data more accurate","It removes the need for networks"]},
 {t:"mc",q:"Why are traditional relational databases often unsuitable for big data?",a:"Big data is too large, fast and unstructured to fit fixed tables on one server",w:["They can't store numbers","They have no keys","They're always encrypted"]},
 {t:"mc",q:"Which infrastructure is needed to collect big data from thousands of sensors?",a:"Fast, reliable networks to carry the readings",w:["A single desktop computer","A printer","Optical discs"]},
 {t:"mc",q:"Why must big data be secured?",a:"It often contains personal data and is a valuable target for attackers",w:["It's always public","Security makes it process faster","It's required to be deleted"]},
 {t:"mc",q:"Which is an example of high-velocity data?",a:"Live readings from a car's sensors many times a second",w:["A census taken every ten years","A school's list of form groups","An archive of old newspapers"]},
 {t:"mc",q:"Which is a benefit of analysing big data?",a:"Finding patterns that help predict demand or spot fraud",w:["It always gives certain answers","It needs no storage","It removes the need for privacy laws"]},
 {t:"blank",q:"Data such as photos and emails, which doesn't fit into tables, is called ___ data.",a:["unstructured"]},
 {t:"blank",q:"The V that describes the range of data types and formats is ___.",a:["variety"]}]);

B("al-datasci",[
 {t:"mc",q:"Put these data science stages in order.",a:"Collect, clean, analyse, visualise",w:["Analyse, collect, clean, visualise","Clean, collect, visualise, analyse","Visualise, analyse, clean, collect"]},
 {t:"mc",q:"Which is a data cleaning task?",a:"Removing duplicate records",w:["Drawing a bar chart","Writing a conclusion","Buying more storage"]},
 {t:"mc",q:"Dates are stored as 03/04/2026 in one file and 2026-04-03 in another. What is needed?",a:"Converting them to one consistent format",w:["Deleting one file","Visualising them","Encrypting them"]},
 {t:"mc",q:"Which is a responsible approach to web scraping?",a:"Checking the site's terms and not overloading it with requests",w:["Copying whole sites to republish","Scraping private accounts","Ignoring copyright"]},
 {t:"mc",q:"Which chart best shows how a value changes over time?",a:"Line graph",w:["Pie chart","Venn diagram","Table of raw values"]},
 {t:"mc",q:"Which chart best shows the relationship between two numeric variables?",a:"Scatter graph",w:["Pie chart","Line graph of one variable","Bar chart of categories"]},
 {t:"mc",q:"What should be done with an outlier?",a:"Investigate it: it might be an error or something important",w:["Always delete it","Always keep it without checking","Double it"]},
 {t:"mc",html:`<pre class="pc py">data = [12, 15, None, 11, 15, None]
clean = [x for x in data if x is not None]
print(len(clean), sum(clean) / len(clean))</pre>`,q:"What is printed?",a:"4 13.25",w:["6 13.25","4 53","6 8.83"]},
 {t:"mc",html:`<pre class="pc py">names = ["ana", "Ana ", "BEN", "ben"]
tidy = set(n.strip().lower() for n in names)
print(len(tidy))</pre>`,q:"What is printed?",a:"2",w:["4","3","1"]},
 {t:"mc",html:`<pre class="pc py">marks = [55, 72, 64, 90, 48]
print(max(marks) - min(marks))</pre>`,q:"What is printed?",a:"42",w:["90","48","35"]},
 {t:"blank",q:"Fixing missing values, duplicates and errors is called data ___.",a:["cleaning"]},
 {t:"blank",q:"Extracting data from web pages automatically is called web ___.",a:["scraping"]}]);

B("al-ai",[
 {t:"mc",q:"Which is an example of narrow AI?",a:"A voice assistant recognising spoken commands",w:["A machine that can do any intellectual task a human can","A machine smarter than all humans at everything","A pocket calculator"]},
 {t:"mc",q:"What would general AI be able to do?",a:"Learn and apply knowledge across any task, like a human",w:["Only play one game","Only sort lists","Only recognise faces"]},
 {t:"mc",q:"What is super AI?",a:"Hypothetical AI more intelligent than humans in every area",w:["AI used in supercomputers","Any AI that is very fast","AI that uses supervised learning"]},
 {t:"mc",q:"What do supervised learning training data include?",a:"Inputs together with their correct labels",w:["Only inputs, no labels","Only the final answers","Random numbers"]},
 {t:"mc",q:"Which task suits unsupervised learning?",a:"Grouping news articles into topics nobody has defined",w:["Predicting house prices from labelled sales","Classifying X-rays as healthy or not using labelled scans","Recognising handwritten digits from labelled examples"]},
 {t:"mc",q:"Why is a model tested on data it wasn't trained on?",a:"To check it can make accurate predictions on new data",w:["To make training faster","To remove all bias","To reduce the file size"]},
 {t:"mc",q:"A face recognition system is trained mostly on photos of one group of people. What's the risk?",a:"It's less accurate for other groups (bias)",w:["It becomes general AI","It stops working entirely","It needs no more data"]},
 {t:"mc",q:"How does machine learning differ from a traditional program?",a:"It learns rules from data instead of being given them",w:["It has no data","It can't make predictions","It always uses recursion"]},
 {t:"mc",q:"Which is an example of supervised learning?",a:"Predicting whether a loan will be repaid from past labelled loans",w:["Finding clusters of similar shoppers","Grouping stars by brightness with no labels","Compressing a file"]},
 {t:"mc",q:"What is 'clustering'?",a:"An unsupervised method that groups similar items together",w:["A supervised method for labels","A type of narrow AI chip","A way of storing data"]},
 {t:"blank",q:"Learning from data with correct answers attached is called ___ learning.",a:["supervised"]},
 {t:"blank",q:"AI that is good at one specific task is called ___ AI.",a:["narrow","weak"]}]);

B("al-llm",[
 {t:"mc",q:"What are LLMs trained on?",a:"Huge amounts of text",w:["Only dictionaries","Only programming code","A single encyclopaedia"]},
 {t:"mc",q:"What is a token?",a:"A small chunk of text, such as a word or part of a word",w:["A password","A type of loop","A whole document"]},
 {t:"mc",q:"Why does more context in a prompt usually help?",a:"The model has more relevant information to base its answer on",w:["It makes the model learn permanently","It removes all errors","It shortens the answer"]},
 {t:"mc",q:"Why should facts from an LLM be checked?",a:"It can hallucinate plausible but false information",w:["It never knows anything","It always copies Wikipedia","It can't write sentences"]},
 {t:"mc",q:"An LLM writes job adverts that use mostly male pronouns for engineers. What's the cause?",a:"Bias in the training data",w:["A knowledge cut-off","A syntax error","Too much context"]},
 {t:"mc",q:"Which question is an LLM most likely to get wrong without extra information?",a:"Today's exchange rate",w:["What a CPU does","How to write a for loop","What photosynthesis is"]},
 {t:"mc",q:"Which is a sensible use of an LLM for revision?",a:"Asking for explanations, then checking them against reliable sources",w:["Copying its answers into coursework","Trusting every reference it gives","Using it instead of all textbooks"]},
 {t:"mc",q:"What is the context window?",a:"The amount of text the model can take into account at once",w:["The screen the chat appears in","The training data","The date of training"]},
 {t:"mc",q:"Why might an LLM's answer be subjective?",a:"It reflects opinions and patterns in the text it was trained on",w:["It runs on a subjective CPU","It only uses facts","It never uses training data"]},
 {t:"mc",q:"How can an LLM be given knowledge it wasn't trained on?",a:"Include the relevant documents or facts in the prompt",w:["Ask it to try harder","Use capital letters","Ask the same question twice"]},
 {t:"blank",q:"When an LLM makes up false information that sounds believable, it is called a ___.",a:["hallucination"]},
 {t:"blank",q:"LLM stands for large ___ model.",a:["language"]}]);

B("al-ide",[
 {t:"mc",q:"Why do programmers use an IDE rather than a plain text editor?",a:"It brings writing, running and debugging tools together in one place",w:["It makes programs run faster for users","It's needed to save files","It writes the program for them"]},
 {t:"mc",q:"What does syntax highlighting do?",a:"Shows keywords, strings and comments in different colours",w:["Finds logic errors","Runs the code","Counts lines"]},
 {t:"mc",q:"A loop gives the wrong total. Which debugger feature helps most?",a:"A breakpoint inside the loop, then stepping and watching the variables",w:["Autocomplete","Syntax highlighting","Changing the font"]},
 {t:"mc",q:"What does 'step over' do in a debugger?",a:"Runs the next line, including any function it calls, as one step",w:["Skips the rest of the program","Deletes the line","Goes into the function line by line"]},
 {t:"mc",q:"What does 'step into' do?",a:"Goes inside a called function to run it line by line",w:["Runs to the end of the program","Adds a breakpoint","Restarts the program"]},
 {t:"mc",q:"Why is memory (variable) inspection useful?",a:"You can see the actual values of variables at that point",w:["It frees up RAM","It finds syntax errors","It speeds up the program"]},
 {t:"mc",q:"Which kind of error does a syntax checker find?",a:"Code that breaks the language's rules, like a missing colon",w:["A wrong formula","An infinite loop that is valid code","A wrong comparison operator"]},
 {t:"mc",q:"Which is a benefit of autocomplete?",a:"Fewer typing mistakes in variable and function names",w:["It fixes logic errors","It writes tests","It finds slow code"]},
 {t:"mc",q:"Which IDE feature shows the exact line where a runtime error happened?",a:"The error message / traceback in the console",w:["Autocomplete","The colour scheme","Code folding"]},
 {t:"mc",q:"Which is NOT a usual IDE feature?",a:"Designing the computer's CPU",w:["Breakpoints","Autocomplete","Syntax checking"]},
 {t:"blank",q:"A line where a program pauses during debugging is a ___.",a:["breakpoint"]},
 {t:"blank",q:"IDE stands for integrated development ___.",a:["environment"]}]);

B("al-collab",[
 {t:"mc",q:"Two programmers edit the same file at once. How does version control help?",a:"It tracks each person's changes and helps merge them",w:["It stops anyone else opening the file","It deletes one person's changes","It makes the file read-only"]},
 {t:"mc",q:"What is a commit message for?",a:"Describing what changed and why",w:["Encrypting the code","Running the tests","Naming the programmer's computer"]},
 {t:"mc",q:"Why create a branch for a new feature?",a:"So the main code keeps working while the feature is developed",w:["To delete old code","To make the program faster","Because only branches can be compiled"]},
 {t:"mc",q:"A new version has a bug. How does version control help?",a:"You can see what changed and roll back to a working version",w:["It fixes the bug automatically","It stops bugs being written","It reports the bug to users"]},
 {t:"mc",q:"Which is a benefit of open-source software?",a:"Anyone can inspect, fix and improve the code",w:["It always has a support helpline","It can never contain bugs","Its code is secret"]},
 {t:"mc",q:"Which is a drawback of open-source software?",a:"There may be no guaranteed support",w:["You can't see the source","It's always expensive","It can't be changed"]},
 {t:"mc",q:"Why might a company choose proprietary software?",a:"It comes with support and guarantees from the supplier",w:["The source code is free to change","It's always free","Anyone can sell it"]},
 {t:"mc",q:"A weather app shows forecasts from a national weather service. How does it most likely get them?",a:"Through the weather service's API",w:["By scraping printed newspapers","By guessing","By reading the phone's memory"]},
 {t:"mc",q:"Python's sqlite3 module lets a program run SQL on a database. What is it an example of?",a:"An API",w:["A version control system","An IDE","A paradigm"]},
 {t:"mc",q:"Which is a benefit of using APIs?",a:"Programmers can use existing services without knowing how they work inside",w:["APIs make programs run offline","They remove the need for testing","They store passwords in plain text"]},
 {t:"blank",q:"Combining the changes from one branch into another is called a ___.",a:["merge"]},
 {t:"blank",q:"Software whose source code anyone can view and change is called open ___.",a:["source"]}]);

P("a6-1-bigdata",`Big data | Too big for normal tools
Volume | The amount of data
Velocity | How fast it arrives
Variety | Many types and formats
Veracity | How trustworthy it is
Value | Insight gained
Unstructured data | Text, images, video
Structured data | Fits rows and columns
Distributed processing | Many computers at once
Collect | Sensors, forms, APIs
Store | Many networked servers
Process and analyse | Find patterns
Network | Moves data quickly
Secure | Protect personal data
Card payments in real time | High velocity
Social media posts | Low veracity
Fraud detection | A use of big data
Petabyte | 1000 terabytes`);

P("a6-1-datascience",`Data science | Insight from data
Collection | Gathering the data
Web scraping | Extracting from web pages
Cleaning | Fixing errors and gaps
Analysis | Finding patterns
Visualisation | Charts and graphs
Duplicates | Removed in cleaning
Missing values | Filled or removed
Inconsistent formats | Made the same
Outlier | Very different value
Line graph | Change over time
Scatter graph | Two variables
Pie chart | Parts of a whole
Bar chart | Comparing categories
Mean | Total ÷ count
Range | Max − min
Scraping responsibly | Respect site terms
Order of stages | Collect, clean, analyse`);

P("a6-2-ai",`Artificial intelligence | Tasks needing intelligence
Narrow AI | One specific task
General AI | Any task, like a human
Super AI | Beyond human intelligence
All AI today | Narrow
Machine learning | Learns from data
Supervised learning | Labelled training data
Unsupervised learning | Unlabelled data
Clustering | Grouping similar items
Classification | Predicting a label
Training data | Data a model learns from
Test data | Unseen data for checking
Spam filter | Trained on labelled emails
Customer groups | Found without labels
Bias | Unfair skewed results
Label | The correct answer
Model | What training produces
Traditional program | Rules given by people`);

P("a6-2-llm",`LLM | Large language model
Trained on | Huge amounts of text
Generates text by | Predicting next tokens
Token | Chunk of text
Prompt | What the user gives
Context | Information it can use
Context window | How much it can consider
Knowledge cut-off | Training data ends
Hallucination | Plausible but false
Bias | From the training data
Improve accuracy | Clear, specific context
Recent events | May be unknown
Check its output | Use reliable sources
Subjective output | Reflects opinions in text
Fake reference | A hallucination
New facts for a model | Put them in the prompt
LLM strength | Fluent explanations
LLM weakness | Can be confidently wrong`);

P("a6-3-ide",`IDE | Write, run and debug in one
Text editor | Where code is written
Syntax highlighting | Colours for code parts
Autocomplete | Suggests names as you type
Syntax checker | Finds rule-breaking code
Debugger | Runs code in a controlled way
Breakpoint | Pauses the program
Step over | Next line as one step
Step into | Go inside a function
Memory inspection | See variable values
Watch | Tracks one variable
Traceback | Shows where an error happened
Missing colon | Syntax error
Wrong total | Logic error
Divide by zero | Runtime error
Line numbers | Find errors quickly
Auto-indent | Keeps blocks tidy
Run button | Executes the code`);

P("a6-3-collab",`Version control | Tracks every change
Commit | A saved snapshot
Commit message | Says what changed
Branch | Separate line of work
Merge | Combine branches
Roll back | Return to an older version
Conflict | Two edits to the same line
Repository | Where a project is stored
Open source | Code anyone can see
Proprietary | Code kept private
Licence | Rules for using software
Open-source benefit | Community can improve it
Open-source drawback | No guaranteed support
API | Lets programs talk
sqlite3 module | A database API
Weather app data | From an API
API benefit | Reuse existing services
Linux | Open-source OS`);
