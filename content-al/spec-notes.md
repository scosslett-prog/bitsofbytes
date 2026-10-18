# Pearson Edexcel IAL Computer Science (XCP01 IAS / YCP01 IAL) — spec structure notes
First teaching Sept 2026, first exam June 2027. Python 3. Units equally weighted, 80 marks each.
Unit 1 Principles of CS (1h30, written/onscreen, no calculator) — Topics 1–6
Unit 2 Practical Programming & Problem-solving (3h onscreen practical, Python) — Topics 7–10
Unit 3 Advanced Principles of CS (1h30) — Topics 11–16 (assembly instruction set provided, Appendix 3)
Unit 4 Advanced Practical Programming (3h practical) — Topics 17–21
Command words in Appendix 5; symbols Appendix 2 (CPU symbols, register transfer notation, logic).

## Unit 1
### Topic 1 Computer systems
1.1 Computer architecture
 1.1.1 Stored-program concept (def, function, characteristics, operation, benefits, drawbacks)
 1.1.2 von Neumann architecture
 1.1.3 Internal components: CPU; memory RAM/ROM/cache; I/O; buses address/data/control. Diagram of components; expression for amount of addressable memory (2^address-bus-width)
 1.1.4 CPU components: CU, ALU, general-purpose registers, special-purpose registers PC, MAR, MBR (memory buffer register!), CIR, ACC, SP (stack pointer), SR (status register); clock. Diagram with Appendix 2 symbols
 1.1.5 FDE cycle: stages, role of components, read/write control signals; register transfer notation (Appendix 2); diagram of data transfer
 1.1.6 Memory hierarchy: CPU registers, cache L1/L2/L3, main memory, secondary storage; diagram
 1.1.7 Data transmission serial/parallel; diagram
1.2 The operating system
 1.2.1 Role of OS: user interface, user management, peripheral mgmt, process mgmt, memory mgmt
 1.2.2 Multitasking: time sharing, context switching, interrupt handling in multitasking; diagram of interrupt handling
 1.2.3 Process management: process, process states, scheduling, algorithms RR, FCFS, SJF, multi-level queue; diagrams of process states and scheduling
 1.2.4 Memory management: operations (tracking allocation status, determining storage requirements, controlling usage); allocation: paging, segmentation, virtual memory; stack frame; diagram memory usage and call stack
### Topic 2 Data representation
2.1 Numbers
 2.1.1 Bases binary/denary/hex; convert unsigned integers
 2.1.2 Units: bit(b), nibble, byte(B); IEC kibi/mebi/gibi/tebi; SI kilo/mega/giga/tera. Binary units for capacity/file size, decimal for transmission speeds; rank; convert; expressions; max states for n bits
 2.1.3 Two's complement; convert both ways; negation
 2.1.4 Fixed-point signed fractional numbers; convert; halves quarters eighths
2.2 Binary arithmetic
 2.2.1 Addition and subtraction signed/unsigned
 2.2.2 Bitwise: logical shift, arithmetic shift, bit masks AND/OR/XOR; use mask to check status of bits
 2.2.3 Overflow and underflow
2.3 Text
 2.3.1 ASCII/extended ASCII, UTF-8/Unicode (benefits/drawbacks)
### Topic 3 Networks and encryption
3.1 Network fundamentals
 3.1.1 Components: NIC, switch, home router, modem, WAP, transmission media copper/wireless/fibre, firewall hardware/software; network diagram
 3.1.2 Bandwidth, speed/transfer rate, latency, range; expressions file size/transfer rate/time
 3.1.3 Addressing: IP (IPv4, IPv6), MAC; expressions involving network addresses
3.2 Encryption
 3.2.1 Encryption fundamentals
 3.2.2 Symmetric (known shared key, key exchange), asymmetric (public/private key pair); diagram of enc/dec process
 3.2.3 Monoalphabetic substitution cipher: encrypt/decrypt
 3.2.4 Vernam cipher: encrypt/decrypt (XOR with one-time pad)
### Topic 4 Structuring data
4.1 Relational databases
 4.1.1 ERM: entity, attribute, keys primary/foreign/composite, cardinality 1:1 1:M M:M; ERD + parenthetical notation; interpret/complete/find & correct errors (ERD symbols App 2). SQLite in Unit 2
 4.1.2 Logical schema: table/relation, column/attribute, row/tuple, data types, integrity constraints entity/referential/domain
4.2 Data structures
 4.2.1 array, list, dictionary, record, tuple, set; hand trace ops on 1D/2D; contents after ops; common set ops
4.3 ADTs
 4.3.1 Stack: structure; insert/delete/search; hand trace; (Unit 2: fixed-length list implementation)
 4.3.2 Queue: same
### Topic 5 Problem solving
5.1 Tools and techniques
 5.1.1 Algorithms: words/diagrams/flowcharts/code; efficiency; find & correct logic errors (flowchart symbols App 2)
 5.1.2 Trace table
 5.1.3 Recursion: hand trace
5.2 Searching and sorting
 5.2.1 Linear search unsorted/sorted
 5.2.2 Binary search iterative/recursive
 5.2.3 Bubble sort
 5.2.4 Insertion sort
5.3 Boolean logic
 5.3.1 Boolean expressions AND OR XOR NOT NAND NOR, order of precedence (Boolean algebraic notation App 2)
 5.3.2 Truth tables
5.4 Programming paradigms
 5.4.1 Procedural
 5.4.2 Declarative
### Topic 6 Enabling technologies
6.1 Data science
 6.1.1 Big data: five Vs (volume, velocity, variety, veracity, value); infrastructure collection, storage, processing, modelling & analysis, networking, security; diagram
 6.1.2 Tools/techniques: collection, storage, web scraping, cleaning, analysis, visualisation
6.2 AI
 6.2.1 Categories narrow/general/super
 6.2.2 ML supervised/unsupervised; diagram
 6.2.3 LLM: context & query accuracy, knowledge limitations, bias/subjectivity; diagram
6.3 Tools
 6.3.1 IDE: text editor, autocomplete, syntax checker, debugger (breakpoints, stepping), memory inspection
 6.3.2 Version control system (no practical experience expected)
 6.3.3 Open-source technologies
 6.3.4 API (used with SQLite in Unit 2)

## Unit 2 Practical Programming (3h onscreen, five compulsory questions, 80 marks, Python 3, PLS document)
### Topic 7 Programming
7.1 Constructs
 7.1.1 Flow control: sequence, selection, count-controlled iteration, condition-controlled iteration, exception handling for built-in exceptions
 7.1.2 Variables and constants: creation, assignment, access
 7.1.3 Operators: arithmetic, relational, Boolean, bitwise
 7.1.4 Subprograms: parameter, argument, function, procedure
### Topic 8 Organising and handling data
8.1 Data types and structures
 8.1.1 Integer, real, character, Boolean, string; convert between types
 8.1.2 array, list, dictionary, record, tuple, set; 1D/2D; 2D lists as arrays; convert between structures
8.2 Data handling methods
 8.2.1 Numeric: rounding, truncation, randomisation, type conversions
 8.2.2 String: length, indexing, formatting, examining, manipulating
 8.2.3 Text files: open, read, write, append, close
 8.2.4 Data structures: create, insert, update, retrieve, delete, traverse
 8.2.5 Stack as fixed-length list: create, push, pop, IsEmpty, IsFull, Size
 8.2.6 Queue as fixed-length list: create, enqueue, dequeue, IsEmpty, IsFull, Size
 8.2.7 Set: membership, union, intersection, difference
8.3 Relational databases (SQLite)
 8.3.1 administer; 8.3.2 manipulate; 8.3.3 retrieve; 8.3.4 filter and refine
### Topic 9 Best practice (Good Programming Practice Guide GPPG)
9.1 Program design
 9.1.1 Correct outcomes: decomposition, clear logic, appropriate variables/constants/types/structures, appropriate constructs
 9.1.2 Good practice: modularity, separation of concerns, minimising side effects, scope isolation, fitness for purpose of I/O, efficiency (time & memory)
 9.1.3 Modularity in source: blocked code, user-defined subprograms, built-in subprograms, libraries, files, procedures, functions
9.2 Clean code
 9.2.1 Consistency: white space, line breaks layout, naming conventions, fixed line length
 9.2.2 Readability: meaningful identifiers, informative comments, named constants, subprograms
 9.2.3 Control behaviour: boundary value analysis, exception handling, minimising nested conditionals, minimising loops, guard clauses, managed conversion of data types
9.3 Functionality
 9.3.1 Testing and debugging; reviewing and refining (identify/correct errors, accurate outcomes, refine to meet requirements)
### Topic 10 Computational thinking and algorithms
10.1 Computational thinking: 10.1.1 abstraction (subprograms hide implementation), 10.1.2 decomposition (comment-first coding), 10.1.3 pattern recognition (reuse solution / data structure), 10.1.4 generalisation (change input parameters)
10.2 Implementing algorithms: 10.2.1 from words, diagrams, flowcharts → code
10.3 Search and sort: 10.3.1 linear search (worst case unsorted, early exit when found unsorted, early exit found sorted, early exit when not in list sorted); 10.3.2 binary search iterative/recursive; 10.3.3 bubble sort (worst case, exit with no swaps, reduce upper bound each pass); 10.3.4 in-place insertion sort
10.4 Recursion: 10.4.1 recursive algorithms

## Unit 3 Advanced Principles (1h30, 80 marks, first assessed 2028; assembly instruction set App 3 provided)
### Topic 11 Computer systems and data representation
11.1 Computer architecture
 11.1.1 Harvard architecture: memory structure; difference from von Neumann; diagram
 11.1.2 CISC and RISC: architecture; differences
 11.1.3 Five-stage pipelining IF, ID, EX, MEM, WB; branch hazards; diagram
 11.1.4 Parallel processing: multicore MIMD; GPU SIMD; diagram
 11.1.5 Embedded systems: hardware (microprocessor, MCU, memory, I/O interfaces & ports, sensors accelerometer/vibration/sound/temperature, actuators, ADC/DAC sampling/quantisation/encoding, power supply); software (firmware, OS, application software, languages for embedded); design + ADC/DAC diagram
11.2 The operating system
 11.2.1 I/O device management: device drivers, BIOS, buffering, caching, interrupt handling in device mgmt; diagram
 11.2.2 Virtualisation: containerisation, virtual machines; diagrams
11.3 Data representation
 11.3.1 Floating point IEEE-754 half precision 16-bit: 1 sign, 5-bit biased exponent (bias 15), 10-bit significand; convert both ways
### Topic 12 Networks and cybersecurity
12.1 Networking
 12.1.1 OSI model layers; encapsulation/decapsulation; diagram
 12.1.2 Protocol stacks TCP/IP, SSL/TLS; diagrams incl TLS handshake
 12.1.3 Packet switching: packet components, internet router, protocols (no circuit switching)
 12.1.4 DNS; diagram
12.2 IoT: 12.2.1 IoT stack: device hardware, device software (OS, apps), connectivity (networks, protocols), cloud platform (data collection, analytics, APIs), cloud applications; diagram
12.3 Cybersecurity
 12.3.1 CIA triad
 12.3.2 RSA: prime numbers, key exchange, vulnerabilities; diagram
 12.3.3 Error detection: parity bit, 2D parity block, checksum; calculate
12.4 Computing paradigms: 12.4.1 cloud computing infrastructure/services; 12.4.2 edge computing infrastructure/services
### Topic 13 Programming languages
13.1.1 OOP: abstraction, class, instantiation, methods & attributes (public/private/protected), encapsulation, composition, inheritance, polymorphism; UML class diagrams (App 2); identify OOP features in code
13.1.2 Functional: pure functions, first-class functions, higher-order functions, recursion, immutable variables, avoid side-effects
13.1.3 Assembly: mnemonics; opcode/operand; addressing immediate/direct; operations arithmetic, bitwise, branch, data movement, halt; comments; read/write/trace (App 3 instruction set)
### Topic 14 Structuring data
14.1.1 Linked list: structure; represent with classes/references; insert, delete, search, traverse
14.1.2 Hash table: structure; classes/references; insert, delete, search, traverse, calculate hash values, handle collisions, load factor and rehashing
14.1.3 Graph: adjacency matrix/list; undirected/directed/weighted; insert/delete/search/traverse breadth & depth
14.1.4 Tree: binary tree, BST; insert, delete, search, traverse pre/in/post-order
14.1.5 Circular queue: insert/delete/search (Unit 4: fixed-length list)
### Topic 15 Problem solving
15.1.1 Techniques: brute force/exhaustive, divide and conquer, greedy, heuristics, backtracking, recursion, tracing algorithms (trace table)
15.2.1 Merge sort (hand trace); 15.2.2 Quick sort; 15.2.3 Shortest path: Dijkstra (hand trace), A*
15.3.1 Big O time complexity: constant, logarithmic, linear, linearithmic, polynomial, exponential; best/worst for common algorithms; for given code
15.4.1 Boolean algebra: commutative, associative, absorption, distributive, De Morgan's, double negation; prove equivalence
15.4.2 Karnaugh maps to simplify
### Topic 16 Emerging technologies and professional practice
16.1.1 Encryption: digital signatures & certificates; hash digest and use of public/private keys
16.1.2 Blockchain; diagram
16.1.3 Quantum computing: qubits; superposition, entanglement, decoherence, interference; threat; cryptography
16.1.4 Deep learning: neural networks layers, forward propagation, back propagation, weights, bias, activation function
16.2.1 Responsible practice: ethical issues, legal frameworks, codes of conduct

## Unit 4 Advanced Practical Programming (3h, 5 questions, 80 marks)
### Topic 17 Programming
17.1.1 operators & flow control; 17.1.2 data types, variables, constants; 17.1.3 1D/2D data structures
17.2.1 computational thinking techniques; 17.2.2 IDEs and tools; 17.2.3 libraries, files, modules, subprograms
### Topic 18 Representing and handling data
18.1.1 Floating-point: decimal module, rounding, Decimal class, conversions, exception handling, compare
18.1.2 Regular expressions (re): finding, validating
18.1.3 NumPy: array, arithmetic, rounding, shape, load/save text files
18.1.4 Pandas: load CSV, central tendency, info about data, clean data, load/save text files
18.2.1 Circular queue as fixed-length list: create, enqueue, dequeue, IsEmpty, IsFull
18.2.2 Linked list: classes/references; insert, remove, update, find, traverse
18.2.3 Hash table: classes/references; hash value, insert, remove, find, traverse
18.2.4 Hash algorithm
18.2.5 Collisions: separate chaining, linear probing, rehashing
18.2.6 Graph: adjacency matrix, adjacency list
18.2.7 BST: classes/references; insert, find, traverse
18.2.8 Recursive traversals pre/in/post-order
### Topic 19 Best practice (as Topic 9 but complex problems): 19.1.1–19.1.3, 19.2.1–19.2.3, 19.3.1
### Topic 20 Additional paradigms
20.1.1 OOP in Python: classes, attributes, methods, objects, encapsulation, getters, setters, aggregation, composition, inheritance, polymorphism; UML → code
20.1.2 Functional: pure, first-class, higher-order, immutable, avoid side effects, lazy evaluation, lambda, recursion, map, filter, reduce, list comprehension, dict comprehension, zip
### Topic 21 Algorithms
21.1.1 recursive merge sort; 21.1.2 recursive quick sort; 21.2.1 Dijkstra; 21.2.2 RLE compression

## Appendix 2 symbols
CPU: register = rectangle; ALU = V-shaped trapezoid with inputs A, B (integer operands), opcode/status in, status out, results down; clock signal square wave.
ERD: entity rectangle; 1:1 plain line; 1:M crow's foot at many end; M:M crow's feet both ends.
Register transfer notation: MAR <- [PC] (contents of PC loaded into MAR); [CIR] contents decoded and executed.
Boolean notation: AND A.B, OR A+B, NOT overbar A, NAND overbar(A.B), NOR overbar(A+B), XOR A ⊕ B.
UML (Units 3/4): class box name/attributes/methods; visibility private -, protected #, public +; association line, directed association open arrow, inheritance hollow triangle, composition filled diamond, aggregation hollow diamond.
Flowchart: I/O parallelogram, process rectangle, subprocess rectangle with double sides, decision diamond, terminator rounded, labels Yes/No, flow arrow.
## Appendix 3 ARMlite subset (13 GP registers R0–R12; first operand a register; second #x immediate or Rn; immediates decimal/hex/binary with #; comments ;  labels "name:")
ADD Rd, Rn, <op>; SUB Rd, Rn, <op>; AND Rd, Rn, <op>; ORR Rd, Rn, <op>; EOR Rd, Rn, <op>; MVN Rd, <op> (NOT); LSL Rd, Rn, <op>; LSR Rd, Rn, <op>
CMP Rn, <op>; B <label>; B<cond> <label> with EQ NE GT LT
MOV Rd, <op>; LDR Rd, <address>; STR Rd, <address>; HALT
## Command words U1/3: complete, calculate, construct, convert, define, outline, describe, explain, give/state, identify, simplify, which. U2/4: amend, write (+ more)
## PLS Unit 2 notes (Python): if/elif/else; match-case (case other/_); for in structure; for range(start,stop,step); while; try/except <type>/except; exceptions ArithmeticError AttributeError EOFError Exception FileNotFoundError IndexError KeyError NameError TypeError UnboundLocalError ValueError ZeroDivisionError; constants UPPERCASE; operators / * ** + - // %; == != > >= < <=; not and or; bitwise & | ^ ~ << (logical left) >> (ARITHMETIC right); def proc/func return(value); types int float str bool; conversions bool() float() int() str() type(); structures: array (list homogeneous), dict, list, record (list of mixed), set, str, tuple; [i][j]; no ragged; list(): append, del, insert, pop; dict: dict(), {}, [k]=v, clear, del, get, items, keys, values; tuple (x,), tuple(); set {..}, set((..)), add, clear, difference, discard, in, set.intersection(a,b), remove, symmetric_difference, union; operators - & ^ |; chr int range round(x,n); string capitalize find format index isalnum isalpha isdigit islower isnumeric isspace isupper len lower ... f-strings, date/time; text files; sqlite3 (communication, tables, constraints, types, manipulating, retrieving, filtering, presentation, aggregation, joins, errors); global keyword; random, math, copy; datetime, time; turtle graphics.
