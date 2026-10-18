/* Pearson Edexcel International Advanced Level Computer Science (XCP01 / YCP01): units, topics and
   specification sections. Learning points (obj) follow the specification's numbering, so obj[0] is x.y.1.
   Built into content/al/content.js by scripts/build-al.mjs. */
const COURSE={id:"al",name:"Pearson Edexcel International A Level Computer Science",short:"IAL Computer Science",code:"IAL",unit:"Unit",
  qLabel:"practice exam questions",
  exMonths:[["x","Practice papers"]],exNoun:"practice question",
  exLead:"Practise original exam-style questions written for the IAL specification, sorted by topic.",
  coverText:"Every section of the Pearson Edexcel International Advanced Subsidiary and Advanced Level Computer Science specification, Units 1 to 4, with lessons, key vocabulary, Python practice and original exam-style questions mapped to the lessons they test.",
  hero:`<div class="eyebrow">Pearson Edexcel International A Level · Computer Science</div>
    <h1 style="margin-top:10px">A-Level Computer Science, one byte at a time.</h1>
    <p class="hcover"><span class="hcbadge" aria-hidden="true">✓</span><span><b>Built for the Pearson Edexcel IAL Computer Science specification</b> (first teaching September 2026): theory for Units 1 and 3, and hands-on Python for Units 2 and 4.</span></p>
    <p class="lead">Short lessons, key vocabulary, quick checks, Python you can run in the browser and exam-style practice, with a dashboard for students and teachers.</p>`};
const PAPERS={
 1:{code:"Unit 1",title:"Principles of Computer Science",blurb:"How computers work, how data is represented, how networks and encryption keep data moving safely, structuring data, problem solving and the technologies behind modern computing.",facts:["1 h 30 min","80 marks","50% of IAS · 25% of IAL","Written or onscreen","No calculator"]},
 2:{code:"Unit 2",title:"Practical Programming and Problem-solving",blurb:"Designing, writing, testing and refining Python 3 programs: constructs, data types and structures, files, SQLite databases, best practice and classic algorithms.",facts:["3 h practical","80 marks","50% of IAS · 25% of IAL","Python 3 in an IDE","Five questions"]},
 3:{code:"Unit 3",title:"Advanced Principles of Computer Science",blurb:"Advanced architecture, floating point, networking models and cybersecurity, programming paradigms and assembly language, advanced data structures and algorithms, and emerging technologies.",facts:["1 h 30 min","80 marks","50% of IA2 · 25% of IAL","Assembly instruction set provided","No calculator"]},
 4:{code:"Unit 4",title:"Advanced Practical Programming and Problem-solving",blurb:"Robust Python solutions to complex problems: floating-point data, regular expressions, NumPy and Pandas, linked lists, hash tables, graphs and trees, object-oriented and functional programming, and advanced algorithms.",facts:["3 h practical","80 marks","50% of IA2 · 25% of IAL","Python 3 in an IDE","Five questions"]}
};
const CH=[
{n:1,paper:1,title:"Computer systems",topics:[
 {id:"a1-1",code:"1.1",title:"Computer architecture",obj:[
  "Explain the stored-program concept: what it is, how it works, its benefits and drawbacks",
  "Explain the von Neumann architecture: its characteristics, operation, benefits and drawbacks",
  "Describe the internal components of a computer system (CPU, RAM, ROM, cache, input/output and the address, data and control buses), and work out the amount of addressable memory",
  "Describe the components of the CPU: control unit, ALU, general-purpose registers, the special-purpose registers (PC, MAR, MBR, CIR, ACC, SP, SR) and the clock",
  "Describe the stages of the fetch-decode-execute cycle, the role of each component and the read/write control signals, using register transfer notation",
  "Explain the memory hierarchy: CPU registers, level 1, 2 and 3 cache, main memory and secondary storage",
  "Compare serial and parallel data transmission"]},
 {id:"a1-2",code:"1.2",title:"The operating system",obj:[
  "Describe the role of the operating system: user interface, user management, peripheral management, process management and memory management",
  "Explain multitasking: time sharing, context switching and how interrupts are handled",
  "Explain process management: processes, process states, scheduling and the round robin, first-come first-served, shortest job first and multi-level queue algorithms",
  "Explain memory management: tracking and controlling memory, paging, segmentation, virtual memory and stack frames"]}]},
{n:2,paper:1,title:"Data representation",topics:[
 {id:"a2-1",code:"2.1",title:"Numbers",obj:[
  "Convert unsigned integers between binary, denary and hexadecimal",
  "Use bits, nibbles, bytes, IEC binary prefixes (kibi to tebi) and SI decimal prefixes (kilo to tera), and calculate the number of states n bits can represent",
  "Represent signed integers in two's complement and use negation to change the sign",
  "Represent signed fractional numbers in fixed-point binary, working with halves, quarters and eighths"]},
 {id:"a2-2",code:"2.2",title:"Binary arithmetic",obj:[
  "Add and subtract signed and unsigned binary numbers",
  "Perform logical and arithmetic shifts, and use AND, OR and XOR bit masks to check and change bits",
  "Explain overflow and underflow"]},
 {id:"a2-3",code:"2.3",title:"Text",obj:[
  "Compare ASCII, extended ASCII, UTF-8 and Unicode character encoding"]}]},
{n:3,paper:1,title:"Networks and encryption",topics:[
 {id:"a3-1",code:"3.1",title:"Network fundamentals",obj:[
  "Describe network components: NIC, switch, home router, modem, wireless access point, copper, wireless and fibre media, and hardware and software firewalls",
  "Explain bandwidth, transfer rate, latency and range, and calculate with file size, transfer rate and time",
  "Explain IPv4, IPv6 and MAC addressing, and work with network addresses"]},
 {id:"a3-2",code:"3.2",title:"Encryption",obj:[
  "Explain why data is encrypted, with the benefits and drawbacks of encryption",
  "Compare symmetric encryption (shared key and key exchange) with asymmetric encryption (public and private key pairs)",
  "Encrypt and decrypt with a monoalphabetic substitution cipher",
  "Encrypt and decrypt with the Vernam cipher"]}]},
{n:4,paper:1,title:"Structuring data",topics:[
 {id:"a4-1",code:"4.1",title:"Relational databases",obj:[
  "Use the entity-relationship model: entities, attributes, primary, foreign and composite keys, 1:1, 1:M and M:M relationships, ERDs and parenthetical notation",
  "Describe a logical schema: tables, attributes, tuples, data types and entity, referential and domain integrity"]},
 {id:"a4-2",code:"4.2",title:"Data structures",obj:[
  "Use arrays, lists, dictionaries, records, tuples and sets, tracing operations on one- and two-dimensional structures"]},
 {id:"a4-3",code:"4.3",title:"Abstract data types",obj:[
  "Explain how a stack works and trace insert, delete and search operations on it",
  "Explain how a queue works and trace insert, delete and search operations on it"]}]},
{n:5,paper:1,title:"Problem solving",topics:[
 {id:"a5-1",code:"5.1",title:"Tools and techniques",obj:[
  "Interpret, complete and correct algorithms in words, diagrams, flowcharts and code, and judge their efficiency",
  "Complete a trace table for an algorithm",
  "Explain recursion and trace a recursive algorithm"]},
 {id:"a5-2",code:"5.2",title:"Searching and sorting",obj:[
  "Trace a linear search on unsorted and sorted arrays",
  "Trace an iterative and a recursive binary search",
  "Trace a bubble sort",
  "Trace an insertion sort"]},
 {id:"a5-3",code:"5.3",title:"Boolean logic",obj:[
  "Write and interpret Boolean expressions with AND, OR, XOR, NOT, NAND and NOR, using the order of precedence",
  "Complete truth tables for logical expressions"]},
 {id:"a5-4",code:"5.4",title:"Programming paradigms",obj:[
  "Explain the procedural programming paradigm",
  "Explain the declarative programming paradigm"]}]},
{n:6,paper:1,title:"Enabling technologies",topics:[
 {id:"a6-1",code:"6.1",title:"Data science",obj:[
  "Explain big data: the five Vs and the infrastructure for collecting, storing, processing, analysing, networking and securing it",
  "Describe the tools and techniques of data science: collection, storage, web scraping, cleaning, analysis and visualisation"]},
 {id:"a6-2",code:"6.2",title:"Artificial intelligence",obj:[
  "Compare narrow, general and super AI",
  "Explain supervised and unsupervised machine learning",
  "Explain large language models: context, accuracy, knowledge limitations and bias"]},
 {id:"a6-3",code:"6.3",title:"Tools",obj:[
  "Describe the features of an IDE: editor, autocomplete, syntax checker, debugger with breakpoints and stepping, and memory inspection",
  "Explain version control systems",
  "Explain open-source technologies",
  "Explain application programming interfaces (APIs)"]}]},
{n:7,paper:2,title:"Programming",topics:[
 {id:"a7-1",code:"7.1",title:"Constructs",obj:[
  "Use sequence, selection, count-controlled and condition-controlled iteration, and handle built-in exceptions",
  "Create, assign and access variables and constants",
  "Use arithmetic, relational, Boolean and bitwise operators",
  "Write procedures and functions with parameters, and call them with arguments"]}]},
{n:8,paper:2,title:"Organising and handling data",topics:[
 {id:"a8-1",code:"8.1",title:"Data types and structures",obj:[
  "Use integer, real, character, Boolean and string data types, and convert between them",
  "Use arrays, lists, dictionaries, records, tuples and sets in one and two dimensions, and convert between them"]},
 {id:"a8-2",code:"8.2",title:"Data handling methods",obj:[
  "Round, truncate, randomise and convert numeric data",
  "Find the length of, index, format, examine and manipulate strings",
  "Open, read from, write to, append to and close text files",
  "Create, insert, update, retrieve, delete and traverse data structures",
  "Implement a stack as a fixed-length list: create, push, pop, IsEmpty, IsFull and Size",
  "Implement a queue as a fixed-length list: create, enqueue, dequeue, IsEmpty, IsFull and Size",
  "Use set membership, union, intersection and difference"]},
 {id:"a8-3",code:"8.3",title:"Relational databases",obj:[
  "Administer an SQLite database",
  "Manipulate data in an SQLite database",
  "Retrieve data from an SQLite database",
  "Filter and refine data retrieved from an SQLite database"]}]},
{n:9,paper:2,title:"Best practice",topics:[
 {id:"a9-1",code:"9.1",title:"Program design",obj:[
  "Produce correct outcomes through decomposition, clear logic and suitable variables, data structures and constructs",
  "Apply modularity, separation of concerns, minimal side effects, scope isolation, fit-for-purpose input and output, and efficiency",
  "Write modular code with blocks, user-defined and built-in subprograms, libraries, files, procedures and functions"]},
 {id:"a9-2",code:"9.2",title:"Clean code",obj:[
  "Keep code consistent: white space, layout, naming conventions and line length",
  "Make code readable: meaningful identifiers, comments, named constants and subprograms",
  "Control behaviour with boundary value analysis, exception handling, guard clauses, fewer nested conditionals and loops, and managed type conversion"]},
 {id:"a9-3",code:"9.3",title:"Functionality",obj:[
  "Test, debug, review and refine code so it is fit for purpose and meets its requirements"]}]},
{n:10,paper:2,title:"Computational thinking and algorithms",topics:[
 {id:"a10-1",code:"10.1",title:"Computational thinking",obj:[
  "Use abstraction: subprograms that hide implementation details",
  "Use decomposition: comment-first coding to describe an algorithm",
  "Use pattern recognition: reuse solutions and data structures",
  "Use generalisation: solve similar problems by changing parameters"]},
 {id:"a10-2",code:"10.2",title:"Implementing algorithms",obj:[
  "Turn algorithms expressed in words, diagrams and flowcharts into code"]},
 {id:"a10-3",code:"10.3",title:"Search and sort algorithms",obj:[
  "Implement linear search, including early exit on sorted and unsorted lists",
  "Implement iterative and recursive binary search",
  "Implement bubble sort, with early exit and a shrinking upper bound",
  "Implement an in-place insertion sort"]},
 {id:"a10-4",code:"10.4",title:"Recursion",obj:[
  "Implement and use recursive algorithms"]}]},
{n:11,paper:3,title:"Computer systems and data representation",topics:[
 {id:"a11-1",code:"11.1",title:"Computer architecture",obj:[
  "Compare the Harvard and von Neumann architectures",
  "Compare CISC and RISC processors",
  "Explain five-stage instruction pipelining and branch hazards",
  "Explain parallel processing: multicore MIMD and GPU SIMD",
  "Describe the hardware and software of embedded systems, including sensors, actuators and ADC/DAC"]},
 {id:"a11-2",code:"11.2",title:"The operating system",obj:[
  "Explain I/O device management: device drivers, BIOS, buffering, caching and interrupts",
  "Explain virtualisation: containers and virtual machines"]},
 {id:"a11-3",code:"11.3",title:"Data representation",obj:[
  "Convert to and from 16-bit IEEE 754 half-precision floating point"]}]},
{n:12,paper:3,title:"Networks and cybersecurity",topics:[
 {id:"a12-1",code:"12.1",title:"Networking",obj:[
  "Explain the OSI model, its layers and encapsulation",
  "Explain the TCP/IP and SSL/TLS protocol stacks, including the TLS handshake",
  "Explain packet switching: packet components, routers and protocols",
  "Explain how the domain name system works"]},
 {id:"a12-2",code:"12.2",title:"The Internet of Things",obj:[
  "Describe the IoT stack: device hardware and software, connectivity, cloud platform and cloud applications"]},
 {id:"a12-3",code:"12.3",title:"Cybersecurity",obj:[
  "Explain the CIA triad",
  "Explain RSA encryption: prime numbers, key exchange and vulnerabilities",
  "Calculate parity bits, two-dimensional parity blocks and checksums"]},
 {id:"a12-4",code:"12.4",title:"Computing paradigms",obj:[
  "Explain cloud computing infrastructure and services",
  "Explain edge computing infrastructure and services"]}]},
{n:13,paper:3,title:"Programming languages",topics:[
 {id:"a13-1",code:"13.1",title:"Types of programming languages",obj:[
  "Explain object-oriented programming and read and complete UML class diagrams",
  "Explain functional programming: pure, first-class and higher-order functions, recursion, immutability and side effects",
  "Read, write and trace simple assembly language programs"]}]},
{n:14,paper:3,title:"Structuring data",topics:[
 {id:"a14-1",code:"14.1",title:"Abstract data types",obj:[
  "Explain linked lists and trace their operations",
  "Explain hash tables: hash values, collisions, load factor and rehashing",
  "Explain graphs: adjacency matrices and lists, types, and breadth- and depth-first traversal",
  "Explain binary trees and binary search trees, and pre-, in- and post-order traversal",
  "Explain circular queues and trace their operations"]}]},
{n:15,paper:3,title:"Problem solving",topics:[
 {id:"a15-1",code:"15.1",title:"Algorithm design",obj:[
  "Compare brute force, divide and conquer, greedy, heuristic, backtracking and recursive techniques, and trace algorithms"]},
 {id:"a15-2",code:"15.2",title:"Algorithms",obj:[
  "Trace a merge sort",
  "Trace a quick sort",
  "Trace Dijkstra's shortest path algorithm and explain A*"]},
 {id:"a15-3",code:"15.3",title:"Algorithmic efficiency",obj:[
  "Use Big O notation for constant, logarithmic, linear, linearithmic, polynomial and exponential time"]},
 {id:"a15-4",code:"15.4",title:"Boolean logic",obj:[
  "Simplify expressions with Boolean algebra: commutative, associative, absorption, distributive, De Morgan's and double negation",
  "Simplify Boolean expressions with Karnaugh maps"]}]},
{n:16,paper:3,title:"Emerging technologies and professional practice",topics:[
 {id:"a16-1",code:"16.1",title:"Emerging technologies",obj:[
  "Explain digital signatures, certificates and hash digests",
  "Explain how a blockchain works",
  "Explain quantum computing: qubits, superposition, entanglement, decoherence, interference and the threat to cryptography",
  "Explain deep learning: neural network layers, forward and back propagation, weights, bias and activation functions"]},
 {id:"a16-2",code:"16.2",title:"Professionalism",obj:[
  "Discuss ethical issues, legal frameworks and codes of conduct"]}]},
{n:17,paper:4,title:"Programming",topics:[
 {id:"a17-1",code:"17.1",title:"Fundamental concepts",obj:[
  "Select and use operators and flow control constructs",
  "Select and use data types, variables and constants",
  "Select and use one- and two-dimensional data structures"]},
 {id:"a17-2",code:"17.2",title:"Creating solutions",obj:[
  "Use computational thinking techniques",
  "Use IDEs and other tools",
  "Use libraries, files, modules and subprograms"]}]},
{n:18,paper:4,title:"Representing and handling data",topics:[
 {id:"a18-1",code:"18.1",title:"Data handling methods",obj:[
  "Handle floating-point data with the decimal module, rounding, conversion, exceptions and comparison",
  "Find and validate text with regular expressions",
  "Use NumPy arrays: arithmetic, rounding, shape, loading and saving",
  "Analyse data with Pandas: load CSVs, averages, information about data and cleaning"]},
 {id:"a18-2",code:"18.2",title:"Abstract data types in code",obj:[
  "Implement a circular queue as a fixed-length list",
  "Implement a linked list with classes and references",
  "Implement a hash table with classes and references",
  "Write a hash algorithm",
  "Handle collisions with separate chaining, linear probing and rehashing",
  "Represent a graph as an adjacency matrix and an adjacency list",
  "Implement a binary search tree",
  "Write recursive pre-, in- and post-order traversals"]}]},
{n:19,paper:4,title:"Best practice",topics:[
 {id:"a19-1",code:"19.1",title:"Program design",obj:[
  "Produce correct outcomes for complex problems",
  "Design effective code: modularity, separation of concerns, side effects, scope, input and output, efficiency",
  "Write modular code"]},
 {id:"a19-2",code:"19.2",title:"Clean code",obj:[
  "Keep code consistent",
  "Make code readable",
  "Control the behaviour of code"]},
 {id:"a19-3",code:"19.3",title:"Functionality",obj:[
  "Test, debug, review and refine complex programs"]}]},
{n:20,paper:4,title:"Additional programming paradigms",topics:[
 {id:"a20-1",code:"20.1",title:"OOP and functional programming",obj:[
  "Write object-oriented Python: classes, attributes, methods, objects, encapsulation, getters and setters, aggregation, composition, inheritance and polymorphism",
  "Write functional Python: pure and higher-order functions, lambda, map, filter, reduce, comprehensions, zip and lazy evaluation"]}]},
{n:21,paper:4,title:"Algorithms",topics:[
 {id:"a21-1",code:"21.1",title:"Sorting algorithms",obj:[
  "Implement a recursive merge sort",
  "Implement a recursive quick sort"]},
 {id:"a21-2",code:"21.2",title:"Shortest path and compression",obj:[
  "Implement Dijkstra's shortest path algorithm",
  "Implement run-length encoding"]}]}
];
