/* Unit 1: extra activities, so every lesson has at least three.
   A(lessonId, [acts]) appends to the lesson; O() defines a put-in-order task; S() a sort-into-groups task. */
/* ---------------- 1.1 Computer architecture ---------------- */
O("o-run",["The program is stored on secondary storage","The OS loader copies the program into RAM","The PC is set to the address of the first instruction","The CPU fetches the instruction the PC points to","The control unit decodes the instruction","The instruction is executed, and the cycle repeats"]);
S("s-vn",{"Benefit":["Any program can be loaded without rewiring","One memory and one set of buses keep the design simple","Memory is shared flexibly between code and data","Programs such as compilers can create other programs"],
  "Drawback":["Instructions and data compete for the same bus","An instruction and its data can't be fetched at the same time","Data can accidentally overwrite instructions","The CPU often waits for memory"]});
A("a1-1-stored",[ord("o-run","From storage to running","Put the steps for running a stored program in order."),srt("s-vn","Benefit or drawback?","Decide whether each statement is a benefit or a drawback of the stored-program concept and von Neumann architecture.")]);

S("s-bus",{"Address bus":["Carries the location to read or write","Only goes from the CPU outwards","Its width sets how much memory can be reached","Connected to the MAR"],
  "Data bus":["Carries instructions fetched from memory","Carries values being written to memory","Goes in both directions","Connected to the MBR"],
  "Control bus":["Carries the memory read signal","Carries the memory write signal","Carries clock pulses","Carries interrupt requests"]});
A("a1-1-components",[srt("s-bus","Which bus?","Drag each description to the bus it belongs to.")]);

S("s-cpu",{"Control unit":["Decodes instructions","Sends control signals","Coordinates the other components","Uses the instruction set"],
  "ALU":["Adds and subtracts","Compares two values","Carries out AND, OR and XOR","Shifts bits left or right"],
  "Registers":["Hold the address of the next instruction","Hold the result of a calculation","Hold the instruction being decoded","Fastest storage in the computer"],
  "Clock":["Sends regular pulses","Keeps components in step","Speed measured in GHz","Each pulse moves the CPU on one step"]});
B("al-flags",[
 {t:"mc",q:"An ALU result is 0000 0000. Which flag is set?",a:"Zero (Z)",w:["Negative (N)","Carry (C)","Overflow (V)"]},
 {t:"mc",q:"An ALU result is 1001 0110. Which flag is set because of its top bit?",a:"Negative (N)",w:["Zero (Z)","Carry (C)","None"]},
 {t:"mc",q:"200 + 100 is calculated in an 8-bit register. Which flag is set?",a:"Carry (C)",w:["Zero (Z)","Negative (N) only","None"]},
 {t:"mc",q:"Signed: 100 + 50 = 150 in 8 bits. Which flag shows the result is wrong?",a:"Overflow (V)",w:["Zero (Z)","Carry (C)","None"]},
 {t:"mc",q:"A CMP instruction compares 9 with 9. What happens?",a:"The values are subtracted, the result is thrown away and Z is set",w:["The ACC becomes 18","Nothing changes","The PC is set to 9"]},
 {t:"mc",q:"Why do conditional jumps need the status register?",a:"They test its flags to decide whether to jump",w:["It holds the jump address","It stores the program","It counts the instructions"]},
 {t:"mc",q:"Which register always holds an address?",a:"Program counter",w:["Accumulator","Current instruction register","Status register"]},
 {t:"mc",q:"Which two registers connect the CPU to the buses?",a:"MAR and MBR",w:["PC and ACC","CIR and SR","SP and PC"]},
 {t:"mc",q:"Where does the result of ADD go?",a:"Accumulator",w:["Program counter","MAR","CIR"]},
 {t:"mc",q:"What is the stack pointer for?",a:"Holding the address of the top of the stack",w:["Holding the next instruction","Holding the clock speed","Holding the ALU result"]},
 {t:"blank",q:"The flag that is set when a result is zero is the ___ flag.",a:["zero","z"]},
 {t:"blank",q:"The list of every operation a CPU can carry out is its instruction ___.",a:["set"]}]);
A("a1-1-cpu",[srt("s-cpu","Parts of the CPU","Drag each job to the part of the CPU that does it."),bnk("al-flags","Flags and registers","Questions on the status flags, the ALU and the special-purpose registers.")]);

O("o-fetch",["MAR ← [PC]","Memory read signal sent on the control bus","MBR ← [Memory] addressed by the MAR","PC ← [PC] + 1","CIR ← [MBR]","The control unit decodes the instruction"],[[0,1,2,3,4,5],[0,1,3,2,4,5],[0,3,1,2,4,5],[0,1,2,4,3,5]]);
S("s-fde",{"Fetch":["MAR ← [PC]","Memory read signal sent","Instruction copied into the MBR","PC incremented","CIR ← [MBR]"],
  "Decode":["Opcode and operand separated","The control unit works out what the instruction means","The control unit prepares the control signals"],
  "Execute":["The ALU adds two values","ACC ← [MBR]","A memory write signal is sent","The PC is loaded with a jump address"]});
A("a1-1-fde",[ord("o-fetch","The fetch stage","The steps of fetching and decoding an instruction have been jumbled. The PC can be incremented at any point after its address has been copied to the MAR, before decoding."),srt("s-fde","Fetch, decode or execute?","Drag each action to the stage of the cycle where it happens.")]);

O("o-speed",["CPU registers","L1 cache","L2 cache","L3 cache","Main memory (RAM)","Solid-state drive","Hard disk drive"]);
S("s-hier",{"Cache":["Holds copies of recently used data","Built into the CPU","Split into levels L1 to L3","Checked first for a hit"],
  "Main memory":["Holds the programs that are running","Volatile","Measured in gibibytes","Loaded from secondary storage"],
  "Secondary storage":["Keeps data when the power is off","Holds virtual memory","Measured in terabytes","Slowest of the three"]});
A("a1-1-hierarchy",[ord("o-speed","Fastest to slowest","Put the levels of the memory hierarchy in order, fastest first."),srt("s-hier","Which level?","Drag each description to the right level of the memory hierarchy.")]);

S("s-serpar",{"Serial":["One bit at a time","A single data channel","Suits long distances","Used by USB","No skew between bits","Cheaper cables"],
  "Parallel":["Several bits at once","One wire per bit","Only suits short distances","Used for buses inside the CPU","Bits can arrive out of step","Crosstalk between wires"]});
B("al-trans",[
 {t:"mc",q:"A printer is 10 m from a computer. Which transmission method suits the cable?",a:"Serial",w:["Parallel","Either: distance doesn't matter","Neither"]},
 {t:"mc",q:"Data moves between the ALU and registers inside the CPU. Which method is used?",a:"Parallel",w:["Serial","Wireless","Fibre-optic"]},
 {t:"mc",q:"What is skew?",a:"Bits sent together arriving at slightly different times",w:["Interference from a nearby wire","A broken cable","Data sent in the wrong order on purpose"]},
 {t:"mc",q:"What is crosstalk?",a:"A signal in one wire interfering with a neighbouring wire",w:["Two devices sending at once","Bits arriving late","A slow clock"]},
 {t:"mc",q:"Why can serial links now be faster than parallel ones?",a:"They can be clocked much faster without skew",w:["They send more bits at once","They use more wires","They don't need a clock"]},
 {t:"mc",q:"How many clock ticks does serial transmission need to send one byte, one bit per tick?",a:"8",w:["1","4","16"]},
 {t:"mc",q:"Which is a benefit of parallel transmission over a short distance?",a:"More bits are sent per clock tick",w:["It needs fewer wires","It has no crosstalk","It works over any distance"]},
 {t:"mc",q:"PCI Express uses several serial lanes side by side. Why?",a:"To get a high transfer rate without parallel skew",w:["Because serial can't carry data","To reduce the number of devices","To avoid using a clock"]},
 {t:"mc",q:"Why does parallel transmission get less reliable as the cable gets longer?",a:"Skew and crosstalk get worse",w:["The bits get heavier","The cable gets hotter","The voltage doubles"]},
 {t:"mc",q:"Which statement is true?",a:"Serial needs fewer wires than parallel",w:["Parallel needs fewer wires than serial","Both always need 8 wires","Serial needs a wire per bit"]},
 {t:"blank",q:"Sending bits one after another along one channel is ___ transmission.",a:["serial"]},
 {t:"blank",q:"Bits arriving out of step on a parallel link is called ___.",a:["skew"]}]);
A("a1-1-transmission",[srt("s-serpar","Serial or parallel?","Drag each feature to serial or parallel."),bnk("al-trans","Choosing a method","Scenario questions on serial and parallel transmission, skew and crosstalk.")]);

/* ---------------- 1.2 The operating system ---------------- */
S("s-osrole",{"User interface":["Shows windows, icons and menus","Accepts typed commands","Turns a click into a request"],
  "User management":["Checks a login","Sets access rights to files","Keeps each user's files separate"],
  "Peripheral management":["Uses device drivers","Spools pages for a printer","Talks to the graphics card"],
  "Process and memory management":["Shares CPU time between programs","Allocates RAM to a program","Moves pages to virtual memory"]});
O("o-open",["You double-click the program's icon","The OS checks you're allowed to run it","The OS allocates memory and loads the program into RAM","The OS creates a process and adds it to the ready queue","The scheduler gives the process time on the CPU","The program asks the OS to draw its window"]);
A("a1-2-role",[srt("s-osrole","Which OS role?","Drag each job to the part of the operating system responsible for it."),ord("o-open","Opening a program","Put the steps of opening a program in order.")]);

O("o-irq",["A device sets a bit in the interrupt register","The current fetch-decode-execute cycle finishes","The CPU checks the interrupt register","The registers, including the PC, are pushed onto the stack","The PC is loaded with the address of the ISR","The ISR runs","The saved registers are popped off the stack","The interrupted program carries on"]);
S("s-irqtype",{"Hardware":["A key is pressed","The printer runs out of paper","A disk transfer finishes","The power is failing"],
  "Software":["A program divides by zero","A program asks the OS to open a file","A program tries to use memory it doesn't own"],
  "Timer":["A time slice ends","The scheduler must pick the next process","A regular clock tick for the OS"]});
A("a1-2-multitasking",[ord("o-irq","Handling an interrupt","Put the steps for handling an interrupt in order."),srt("s-irqtype","Kinds of interrupt","Drag each event to the kind of interrupt it causes.")]);

S("s-sched",{"Round robin":["Equal time slices in turn","Unfinished processes go to the back of the queue","Fair for interactive users","Many context switches"],
  "First-come, first-served":["Runs processes in arrival order","Each runs to completion","Short jobs can wait behind a long one","Simplest to implement"],
  "Shortest job first":["Needs burst times to be estimated","Lowest average waiting time","Long jobs can starve","Picks the quickest job next"],
  "Multi-level queue":["Separate queues for different types","Higher queues always go first","Each queue can use its own algorithm","Batch jobs may starve"]});
A("a1-2-processes",[srt("s-sched","Which algorithm?","Drag each property to the scheduling algorithm it describes.")]);

S("s-pageseg",{"Paging":["Fixed-size blocks","Divides memory physically","Pages fit into any free frames","The last page may be part empty","Uses a page table"],
  "Segmentation":["Variable-size blocks","Matches the program's logical parts","A segment for code, another for data","Gaps can form between blocks","Each block can have its own protection"]});
O("o-fault",["The program uses an address in a page that isn't in RAM","A page fault occurs and the OS pauses the process","The OS picks a page that hasn't been used recently","That page is swapped out to virtual memory","The needed page is swapped into the free frame","The page table is updated","The process carries on"]);
A("a1-2-memory",[srt("s-pageseg","Paging or segmentation?","Drag each feature to paging or segmentation."),ord("o-fault","A page fault","Put the steps for dealing with a page fault in order.")]);

/* ---------------- 2 Data representation ---------------- */
B("al-hexuse",[
 {t:"mc",q:"Why do programmers write binary as hexadecimal?",a:"It's shorter and less error-prone to read and write",w:["The computer stores it in hex","It uses less memory","It can only store negative numbers"]},
 {t:"mc",q:"How many bits does one hex digit represent?",a:"4",w:["2","8","16"]},
 {t:"mc",q:"The colour #FF0000 has two hex digits for each of red, green and blue. How much red is there, in denary?",a:"255",w:["16","100","15"]},
 {t:"mc",q:"What is the largest value two hex digits can show?",a:"FF (255)",w:["99","FFF","16"]},
 {t:"mc",q:"Which number is the same as 0010 1111?",a:"2F",w:["2E","F2","47 in hex"]},
 {t:"mc",q:"What is A3 in denary?",a:"163",w:["103","113","1003"]},
 {t:"mc",q:"What is 77 in hexadecimal?",a:"4D",w:["77","4C","D4"]},
 {t:"mc",q:"Which of these is NOT a valid hexadecimal number?",a:"1G",w:["FF","10","A0"]},
 {t:"mc",q:"What is 1000 0000 in denary?",a:"128",w:["256","64","100"]},
 {t:"mc",q:"Where is hexadecimal used?",a:"MAC addresses and colour codes",w:["Only in spreadsheets","Only for negative numbers","For storing text in ASCII only"]},
 {t:"blank",q:"Hexadecimal is base ___.",a:["16","sixteen"]},
 {t:"blank",q:"In hexadecimal, the digit for 12 is ___.",a:["c"]}]);
A("a2-1-bases",[bnk("al-hexuse","Using hexadecimal","Questions on converting and using hexadecimal."),{type:"py",desc:"Conversions · 2 tasks",explain:"Write your own conversions instead of using Python's built-in ones. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Binary to denary",brief:"Write <span class='mono'>to_denary(bits)</span>, which takes a string of 0s and 1s and returns its denary value. Don't use <span class='mono'>int(bits, 2)</span>.",
   starter:"def to_denary(bits):\n    value = 0\n    # your loop here\n    return value\n\nprint(to_denary(\"10110101\"))",
   tests:[{name:"10110101 is 181",py:"assert to_denary('10110101') == 181"},{name:"0 and 1",py:"assert to_denary('0') == 0 and to_denary('1') == 1"},{name:"11111111 is 255",py:"assert to_denary('11111111') == 255"},{name:"doesn't use int(…, 2)",py:"assert ', 2)' not in __code__ and ',2)' not in __code__"}],
   hint:"For each bit from the left: value = value * 2 + int(bit).",solution:"def to_denary(bits):\n    value = 0\n    for b in bits:\n        value = value * 2 + int(b)\n    return value\n\nprint(to_denary(\"10110101\"))"},
  {title:"Denary to binary",brief:"Write <span class='mono'>to_binary(n)</span>, which returns an 8-bit binary string for 0 ≤ n ≤ 255. Don't use <span class='mono'>bin()</span> or <span class='mono'>format()</span>.",
   starter:"def to_binary(n):\n    bits = \"\"\n    # your loop here\n    return bits\n\nprint(to_binary(200))",
   tests:[{name:"200 is 11001000",py:"assert to_binary(200) == '11001000', to_binary(200)"},{name:"5 is 00000101",py:"assert to_binary(5) == '00000101'"},{name:"0 is 00000000",py:"assert to_binary(0) == '00000000'"},{name:"no bin() or format()",py:"assert 'bin(' not in __code__ and 'format(' not in __code__"}],
   hint:"Repeat 8 times: add str(n % 2) to the front of bits, then n = n // 2.",solution:"def to_binary(n):\n    bits = \"\"\n    for i in range(8):\n        bits = str(n % 2) + bits\n        n = n // 2\n    return bits\n\nprint(to_binary(200))"}]}]);

O("o-sizes",["1 byte","1 kilobyte (kB)","1 kibibyte (KiB)","1 megabyte (MB)","1 mebibyte (MiB)","1 gigabyte (GB)","1 gibibyte (GiB)"]);
B("al-units2",[
 {t:"mc",q:"How many bits are needed to give 100 different values a unique code?",a:"7",w:["6","8","100"]},
 {t:"mc",q:"How many bits are needed for 26 capital letters?",a:"5",w:["4","6","26"]},
 {t:"mc",q:"Which unit is normally used for a broadband speed?",a:"Mbps",w:["MiB","KiB per hour","GiB"]},
 {t:"mc",q:"Which unit is normally used for the size of RAM?",a:"GiB",w:["Gbps","GHz","Mbps"]},
 {t:"mc",q:"A '500 GB' drive is shown as about 465 GiB. Why?",a:"GB uses powers of 10 and GiB uses powers of 2",w:["Some of the drive is broken","The OS uses 35 GB","GiB is smaller than GB"]},
 {t:"mc",q:"How many bytes are in 2 MiB?",a:"2,097,152",w:["2,000,000","2,048","16,777,216"]},
 {t:"mc",q:"How many bits are in a nibble?",a:"4",w:["2","8","16"]},
 {t:"mc",q:"Doubling the number of bits from 8 to 16 multiplies the number of states by…",a:"256",w:["2","8","16"]},
 {t:"mc",q:"How many KiB are in 1 GiB?",a:"1,048,576",w:["1,000,000","1,024","1,000"]},
 {t:"mc",q:"Which is largest?",a:"1 TiB",w:["1 TB","1,000 GiB","1,000 GB"]},
 {t:"blank",q:"n bits can represent 2 to the power ___ different values.",a:["n"]},
 {t:"blank",q:"1 kibibyte is ___ bytes.",a:["1024","1,024"]}]);
A("a2-1-units",[ord("o-sizes","Smallest to largest","Put these units in order, smallest first."),bnk("al-units2","Units in context","Questions on choosing and converting units, and on the number of states.")]);

B("al-twos2",[
 {t:"mc",q:"What is the range of 4-bit two's complement?",a:"−8 to +7",w:["−7 to +7","0 to 15","−16 to +15"]},
 {t:"mc",q:"What is the smallest number in 16-bit two's complement?",a:"−32,768",w:["−32,767","−65,535","0"]},
 {t:"mc",q:"What is 1000 0000 in 8-bit two's complement?",a:"−128",w:["−0","128","−127"]},
 {t:"mc",q:"Which is the same number in 8-bit two's complement and unsigned binary?",a:"0101 0101",w:["1000 0001","1111 0000","1010 1010"]},
 {t:"mc",q:"What is the quick way to tell whether a two's complement number is negative?",a:"Its most significant bit is 1",w:["Its last bit is 1","It has more 1s than 0s","It's an odd number"]},
 {t:"mc",q:"What is −1 in 8-bit two's complement?",a:"1111 1111",w:["1000 0001","0000 0001","1111 1110"]},
 {t:"mc",q:"Negating 0000 0000 gives…",a:"0000 0000",w:["1111 1111","1000 0000","0000 0001"]},
 {t:"mc",q:"What is −100 in 8-bit two's complement?",a:"1001 1100",w:["1110 0100","1001 1011","0110 0100"]},
 {t:"mc",q:"Why does two's complement only have one zero?",a:"Negating 0 gives 0 again",w:["Zero can't be stored","The MSB is ignored","Zero is stored as −128"]},
 {t:"mc",q:"Which method negates a two's complement number?",a:"Flip every bit and add 1",w:["Flip the MSB only","Subtract 128","Reverse the order of the bits"]},
 {t:"blank",q:"In 8-bit two's complement, the place value of the MSB is ___.",a:["-128","−128"]},
 {t:"blank",q:"The largest positive 8-bit two's complement number is ___.",a:["127","+127"]}]);
A("a2-1-twos",[bnk("al-twos2","Two's complement facts","Questions on ranges, the sign bit and negation."),{type:"py",desc:"Two's complement · 1 task",explain:"Write a function that converts to 8-bit two's complement. Press Run to try your code, then Check to test it.",
 tasks:[{title:"To two's complement",brief:"Write <span class='mono'>twos(n)</span> that returns the 8-bit two's complement string for −128 ≤ n ≤ 127. For a negative number, convert its positive value, flip the bits and add 1 — or add 256 first.",
   starter:"def twos(n):\n    pass\n\nprint(twos(-5))",
   tests:[{name:"-5 is 11111011",py:"assert twos(-5) == '11111011', twos(-5)"},{name:"5 is 00000101",py:"assert twos(5) == '00000101'"},{name:"-128 is 10000000",py:"assert twos(-128) == '10000000'"},{name:"127 is 01111111",py:"assert twos(127) == '01111111'"}],
   hint:"If n is negative, n + 256 gives the unsigned value with the same bits. Then format(n, '08b').",solution:"def twos(n):\n    if n < 0:\n        n = n + 256\n    return format(n, '08b')\n\nprint(twos(-5))"}]}]);

B("al-fixed2",[
 {t:"mc",q:"In 4.4 signed fixed point, what is the smallest gap between two values?",a:"1/16",w:["1/8","1/4","1"]},
 {t:"mc",q:"In 4.4 signed fixed point, what is the largest value?",a:"7.9375",w:["8","15.9375","7.5"]},
 {t:"mc",q:"In 4.4 signed fixed point, what is the smallest value?",a:"−8",w:["−7.9375","−16","0"]},
 {t:"mc",q:"Which value can be stored exactly in binary fixed point?",a:"0.625",w:["0.1","0.3","0.2"]},
 {t:"mc",q:"Changing from 4.4 to 6.2 fixed point (same 8 bits)…",a:"increases the range but reduces the precision",w:["increases both","reduces both","changes nothing"]},
 {t:"mc",q:"What is 0011.1100 in denary?",a:"3.75",w:["3.25","3.5","60"]},
 {t:"mc",q:"What is 1111.0000 (4.4 signed) in denary?",a:"−1",w:["15","−15","−0.5"]},
 {t:"mc",q:"Why might 0.1 + 0.2 not give exactly 0.3 in a computer?",a:"0.1 and 0.2 can't be represented exactly in binary",w:["The CPU makes mistakes","Python rounds every number","Binary has no fractions"]},
 {t:"mc",q:"What is the place value of the third bit after the binary point?",a:"⅛",w:["⅓","¼","1/16"]},
 {t:"mc",q:"Where is the binary point stored in fixed point?",a:"It isn't stored: its position is agreed in advance",w:["In the first bit","In the last bit","In a separate byte"]},
 {t:"blank",q:"The place value of the first bit after the binary point is one ___.",a:["half","1/2","½"]},
 {t:"blank",q:"How finely values can be stored is called the ___.",a:["precision"]}]);
A("a2-1-fixed",[bnk("al-fixed2","Range and precision","Questions on fixed-point values, range and precision."),{type:"py",desc:"Fixed point · 1 task",explain:"Write a function that reads a fixed-point binary string. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Fixed point to denary",brief:"Write <span class='mono'>fixed(bits)</span> for an 8-bit signed fixed-point string with 4 bits before and 4 after the point, written like <span class='mono'>\"0101.1000\"</span>. The MSB is worth −8.",
   starter:"def fixed(bits):\n    bits = bits.replace(\".\", \"\")\n    values = [-8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625]\n    # add up the place values of the 1s\n\nprint(fixed(\"0101.1000\"))",
   tests:[{name:"0101.1000 is 5.5",py:"assert fixed('0101.1000') == 5.5, fixed('0101.1000')"},{name:"1110.0100 is -1.75",py:"assert fixed('1110.0100') == -1.75"},{name:"0000.0001 is 0.0625",py:"assert fixed('0000.0001') == 0.0625"}],
   hint:"Loop with i over range(8); if bits[i] == '1', add values[i] to a total. Return the total.",solution:"def fixed(bits):\n    bits = bits.replace(\".\", \"\")\n    values = [-8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625]\n    total = 0\n    for i in range(8):\n        if bits[i] == \"1\":\n            total = total + values[i]\n    return total\n\nprint(fixed(\"0101.1000\"))"}]}]);

S("s-ovf",{"Overflow":["100 + 50","90 + 90","−100 − 50","127 + 1","−128 − 1"],"No overflow":["100 − 50","−100 + 50","60 + 60","−64 − 64","127 − 128"]},4);
A("a2-2-addsub",[srt("s-ovf","Overflow or not?","8-bit two's complement can store −128 to +127. Drag each calculation to show whether its answer fits.")]);

A("a2-2-shifts",[{type:"py",desc:"Masks in Python · 2 tasks",explain:"Use the bitwise operators &, | and ^ to test and change bits. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Is the bit set?",brief:"Write <span class='mono'>is_set(value, bit)</span> that returns <span class='mono'>True</span> if the given bit (0 = the rightmost) is 1. Use <span class='mono'>&amp;</span> and a mask made with <span class='mono'>1 &lt;&lt; bit</span>.",
   starter:"def is_set(value, bit):\n    pass\n\nprint(is_set(0b00101000, 3))",
   tests:[{name:"bit 3 of 00101000 is set",py:"assert is_set(0b00101000, 3) is True"},{name:"bit 0 of 00101000 is clear",py:"assert is_set(0b00101000, 0) is False"},{name:"bit 7 of 10000000 is set",py:"assert is_set(128, 7) is True"},{name:"uses &",py:"assert '&' in __code__"}],
   hint:"value & (1 << bit) is non-zero exactly when the bit is set. Compare it with 0.",solution:"def is_set(value, bit):\n    return value & (1 << bit) != 0\n\nprint(is_set(0b00101000, 3))"},
  {title:"Set and clear",brief:"Write <span class='mono'>set_bit(value, bit)</span>, which returns value with that bit set to 1, and <span class='mono'>clear_bit(value, bit)</span>, which returns it with that bit set to 0 (8-bit values).",
   starter:"def set_bit(value, bit):\n    pass\n\ndef clear_bit(value, bit):\n    pass\n\nprint(set_bit(0, 2), clear_bit(255, 0))",
   tests:[{name:"set bit 2 of 0 gives 4",py:"assert set_bit(0, 2) == 4"},{name:"setting a set bit changes nothing",py:"assert set_bit(5, 0) == 5"},{name:"clear bit 0 of 255 gives 254",py:"assert clear_bit(255, 0) == 254"},{name:"clearing a clear bit changes nothing",py:"assert clear_bit(4, 1) == 4"}],
   hint:"Set with OR: value | (1 << bit). Clear with AND and an inverted mask: value & (255 - (1 << bit)).",solution:"def set_bit(value, bit):\n    return value | (1 << bit)\n\ndef clear_bit(value, bit):\n    return value & (255 - (1 << bit))\n\nprint(set_bit(0, 2), clear_bit(255, 0))"}]}]);

S("s-enc",{"ASCII":["7 bits per character","128 characters","English letters, digits and punctuation","Control codes such as line feed"],
  "Extended ASCII":["8 bits per character","256 characters","The upper half depends on the code page","Can show text wrongly on another computer"],
  "Unicode (UTF-8)":["Every writing system","Code points written as U+ and hex","1 to 4 bytes per character","Includes emoji"]});
A("a2-3-encoding",[srt("s-enc","Which character set?","Drag each feature to the character set it describes."),{type:"py",desc:"Character codes · 1 task",explain:"Use ord() and chr() to work with character codes. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Shout it",brief:"Write <span class='mono'>shout(text)</span> that changes every small letter a–z to a capital, leaving other characters alone. Use <span class='mono'>ord()</span> and <span class='mono'>chr()</span>: capitals are 32 less than small letters. Don't use <span class='mono'>.upper()</span>.",
   starter:"def shout(text):\n    result = \"\"\n    for ch in text:\n        # change small letters here\n        result = result + ch\n    return result\n\nprint(shout(\"Hello, world!\"))",
   tests:[{name:"Hello, world! becomes HELLO, WORLD!",py:"assert shout('Hello, world!') == 'HELLO, WORLD!', shout('Hello, world!')"},{name:"digits stay the same",py:"assert shout('abc123') == 'ABC123'"},{name:"no .upper()",py:"assert '.upper(' not in __code__"}],
   hint:"if 'a' <= ch <= 'z': ch = chr(ord(ch) - 32)",solution:"def shout(text):\n    result = \"\"\n    for ch in text:\n        if \"a\" <= ch <= \"z\":\n            ch = chr(ord(ch) - 32)\n        result = result + ch\n    return result\n\nprint(shout(\"Hello, world!\"))"}]}]);

/* ---------------- 3 Networks and encryption ---------------- */
S("s-netdev",{"Switch":["Sends frames only to the right device","Learns which MAC address is on each port","Connects devices on a LAN"],
  "Router":["Forwards packets between networks","Reads IP addresses","Connects the home network to the ISP"],
  "Modem":["Converts signals for the line to the ISP","Modulates and demodulates","Sits on the line to the ISP"],
  "Wireless access point":["Lets wireless devices join the network","Uses radio waves","Extends a wired network to laptops and phones"]},3);
S("s-media",{"Copper cable":["Electrical signals","Cheap and easy to fit","Range up to about 100 m","Affected by electrical interference"],
  "Fibre-optic cable":["Pulses of light","Very high bandwidth","Range of many kilometres","Very hard to tap"],
  "Wireless":["Radio waves","Devices can move around","Weakened by walls","Signal can be picked up by anyone in range"]});
A("a3-1-components",[srt("s-netdev","Network devices","Drag each job to the device that does it."),srt("s-media","Transmission media","Drag each feature to the transmission medium it describes.")]);

B("al-perf",[
 {t:"mc",q:"A video call keeps freezing even though downloads are fast. What is the most likely problem?",a:"High latency",w:["Low bandwidth","A large hard disk","Too much RAM"]},
 {t:"mc",q:"Which connection has the lowest latency?",a:"Fibre broadband",w:["Satellite","Dial-up modem","Postal service"]},
 {t:"mc",q:"Ten people in a house all stream video at once. What happens to each person's transfer rate?",a:"It drops, because they share the bandwidth",w:["It rises","It stays the same","It doubles"]},
 {t:"mc",q:"Bandwidth is like…",a:"the number of lanes on a road",w:["the length of the road","the speed limit","the number of cars"]},
 {t:"mc",q:"A 40 MB file is sent at 80 Mbps. How long does it take?",a:"4 seconds",w:["0.5 seconds","2 seconds","3,200 seconds"]},
 {t:"mc",q:"How many bits are in 5 MB (1 MB = 1,000,000 bytes)?",a:"40,000,000",w:["5,000,000","625,000","41,943,040"]},
 {t:"mc",q:"What does range mean for a wireless network?",a:"How far the signal reaches before it's too weak",w:["How many devices can connect","The number of channels","How fast it is"]},
 {t:"mc",q:"Which unit is used for latency?",a:"Milliseconds",w:["Megabits per second","Megabytes","Metres per second"]},
 {t:"mc",q:"Why is the transfer rate lower than the bandwidth?",a:"Congestion, interference and extra header data",w:["Bandwidth is measured in bytes","Files get bigger when sent","Routers store half the data"]},
 {t:"mc",q:"Which matters most for downloading a large game?",a:"Bandwidth",w:["Latency","Range","Number of hops"]},
 {t:"blank",q:"The delay before data starts arriving is called ___.",a:["latency"]},
 {t:"blank",q:"Time = file size in bits ÷ transfer ___.",a:["rate"]}]);
A("a3-1-performance",[bnk("al-perf","Bandwidth and latency","Scenario questions on bandwidth, latency, range and transfer times."),{type:"py",desc:"Transfer time · 1 task",explain:"Write a function to calculate transfer times. Press Run to try your code, then Check to test it.",
 tasks:[{title:"How long?",brief:"Write <span class='mono'>transfer_time(size_mb, rate_mbps)</span> that returns the time in seconds to send a file of <span class='mono'>size_mb</span> megabytes at <span class='mono'>rate_mbps</span> megabits per second. Use 1 MB = 1,000,000 bytes and 1 Mbps = 1,000,000 bits per second.",
   starter:"def transfer_time(size_mb, rate_mbps):\n    pass\n\nprint(transfer_time(25, 40))",
   tests:[{name:"25 MB at 40 Mbps is 5 s",py:"assert abs(transfer_time(25, 40) - 5) < 1e-9, transfer_time(25, 40)"},{name:"1 MB at 8 Mbps is 1 s",py:"assert abs(transfer_time(1, 8) - 1) < 1e-9"},{name:"150 MB at 40 Mbps is 30 s",py:"assert abs(transfer_time(150, 40) - 30) < 1e-9"}],
   hint:"Convert megabytes to megabits (× 8), then divide by the rate.",solution:"def transfer_time(size_mb, rate_mbps):\n    return size_mb * 8 / rate_mbps\n\nprint(transfer_time(25, 40))"}]}]);

S("s-addr",{"IPv4":["32 bits","Four numbers from 0 to 255","About 4.3 billion addresses","For example 192.168.1.20"],
  "IPv6":["128 bits","Eight groups of hex digits","Introduced because addresses were running out","Zero groups can be shortened with ::"],
  "MAC address":["48 bits","Six pairs of hex digits","Set by the manufacturer","Used to deliver frames on a LAN"]});
A("a3-1-addressing",[srt("s-addr","IPv4, IPv6 or MAC?","Drag each feature to the type of address it describes."),{type:"py",desc:"Network addresses · 1 task",explain:"Use AND to find the network address. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Network address",brief:"Write <span class='mono'>network(ip, mask)</span> that takes two dotted IPv4 strings and returns the network address as a dotted string, by ANDing each part.",
   starter:"def network(ip, mask):\n    ip_parts = ip.split(\".\")\n    mask_parts = mask.split(\".\")\n    # AND each pair of parts\n\nprint(network(\"192.168.1.20\", \"255.255.255.0\"))",
   tests:[{name:"192.168.1.20 / 255.255.255.0",py:"assert network('192.168.1.20', '255.255.255.0') == '192.168.1.0', network('192.168.1.20', '255.255.255.0')"},{name:"10.1.4.77 / 255.255.0.0",py:"assert network('10.1.4.77', '255.255.0.0') == '10.1.0.0'"},{name:"172.16.45.200 / 255.255.255.128",py:"assert network('172.16.45.200', '255.255.255.128') == '172.16.45.128'"}],
   hint:"Build a list: str(int(ip_parts[i]) & int(mask_parts[i])) for each i, then join with '.'.",solution:"def network(ip, mask):\n    ip_parts = ip.split(\".\")\n    mask_parts = mask.split(\".\")\n    out = []\n    for i in range(4):\n        out.append(str(int(ip_parts[i]) & int(mask_parts[i])))\n    return \".\".join(out)\n\nprint(network(\"192.168.1.20\", \"255.255.255.0\"))"}]}]);

O("o-asym",["Ben creates a public key and a private key","Ben shares his public key","Ana encrypts her message with Ben's public key","The ciphertext is sent across the internet","Ben decrypts it with his private key"]);
S("s-symasym",{"Symmetric":["One shared key","The key must be exchanged safely first","Fast to encrypt and decrypt","Used for most of the data in a secure session"],
  "Asymmetric":["A public and a private key","No secret key has to be sent","Slower","Used to share a symmetric key safely"]});
A("a3-2-keys",[ord("o-asym","Sending with asymmetric encryption","Put the steps for sending a message with asymmetric encryption in order."),srt("s-symasym","Symmetric or asymmetric?","Drag each feature to symmetric or asymmetric encryption.")]);

A("a3-2-ciphers",[{type:"py",desc:"Ciphers in Python · 2 tasks",explain:"Code the two ciphers from this lesson. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Vernam",brief:"Write <span class='mono'>vernam(message, key)</span> where <span class='mono'>key</span> is a list of numbers, one per character. Return a list of the ciphertext numbers, each <span class='mono'>ord(character) ^ key value</span>.",
   starter:"def vernam(message, key):\n    pass\n\nprint(vernam(\"HI\", [214, 104]))",
   tests:[{name:"HI with [214, 104]",py:"assert vernam('HI', [214, 104]) == [158, 33], vernam('HI', [214, 104])"},{name:"XOR twice gives the message back",py:"c = vernam('CACHE', [9, 200, 33, 77, 1]); assert ''.join(chr(x ^ k) for x, k in zip(c, [9, 200, 33, 77, 1])) == 'CACHE'"},{name:"uses ^",py:"assert '^' in __code__"}],
   hint:"Loop with i over range(len(message)) and append ord(message[i]) ^ key[i].",solution:"def vernam(message, key):\n    out = []\n    for i in range(len(message)):\n        out.append(ord(message[i]) ^ key[i])\n    return out\n\nprint(vernam(\"HI\", [214, 104]))"},
  {title:"Substitution",brief:"Write <span class='mono'>encrypt(text, key)</span> where <span class='mono'>key</span> is a 26-letter string: A becomes key[0], B becomes key[1] and so on. Leave spaces alone. Text is in capitals.",
   starter:"ALPHABET = \"ABCDEFGHIJKLMNOPQRSTUVWXYZ\"\n\ndef encrypt(text, key):\n    pass\n\nprint(encrypt(\"CACHE\", \"QWERTYUIOPASDFGHJKLZXCVBNM\"))",
   tests:[{name:"CACHE becomes EQEIT",py:"assert encrypt('CACHE', 'QWERTYUIOPASDFGHJKLZXCVBNM') == 'EQEIT', encrypt('CACHE', 'QWERTYUIOPASDFGHJKLZXCVBNM')"},{name:"spaces are kept",py:"assert encrypt('A B', 'QWERTYUIOPASDFGHJKLZXCVBNM') == 'Q W'"}],
   hint:"For each character, find its position with ALPHABET.find(ch). If it's -1 keep the character, otherwise use key[position].",solution:"ALPHABET = \"ABCDEFGHIJKLMNOPQRSTUVWXYZ\"\n\ndef encrypt(text, key):\n    out = \"\"\n    for ch in text:\n        i = ALPHABET.find(ch)\n        out = out + (ch if i == -1 else key[i])\n    return out\n\nprint(encrypt(\"CACHE\", \"QWERTYUIOPASDFGHJKLZXCVBNM\"))"}]}]);

/* ---------------- 4 Structuring data ---------------- */
S("s-card",{"One-to-one":["A country and its capital city","A person and their passport","A school and its headteacher"],
  "One-to-many":["A customer and their orders","A form group and its students","An author and their books (one author each)"],
  "Many-to-many":["Students and courses","Actors and films","Doctors and patients"]});
B("al-erm2",[
 {t:"mc",q:"Book(<u>ISBN</u>, Title, AuthorID*). What is AuthorID?",a:"A foreign key",w:["The primary key","A composite key","A data type"]},
 {t:"mc",q:"Booking(<u>RoomID*</u>, <u>Date</u>, GuestID*). What is the primary key?",a:"RoomID and Date together",w:["RoomID","GuestID","Date"]},
 {t:"mc",q:"Which entity would hold the foreign key in a Team–Player (1:M) relationship?",a:"Player",w:["Team","Both","Neither"]},
 {t:"mc",q:"Why would Name be a poor primary key for a Customer table?",a:"Two customers can share a name",w:["Names are too short","Names can't be text","Names are never entered"]},
 {t:"mc",q:"How is a many-to-many relationship drawn on an ERD?",a:"With crow's feet at both ends",w:["With a plain line","With one crow's foot","With an arrow"]},
 {t:"mc",q:"What does an entity become in a relational database?",a:"A table",w:["A field","A record","A key"]},
 {t:"mc",q:"What does an attribute become?",a:"A column (field)",w:["A table","A database","A relationship"]},
 {t:"mc",q:"Which is the best primary key for a Car table?",a:"Registration number",w:["Colour","Make","Number of doors"]},
 {t:"mc",q:"A link table between Film and Actor is called Role. How many foreign keys does it need?",a:"Two",w:["One","None","Three"]},
 {t:"mc",q:"Enrolment(<u>StudentID*</u>, <u>CourseID*</u>). Can a student enrol on the same course twice?",a:"No: the composite key would be repeated",w:["Yes, always","Only on Mondays","Only if the course is full"]},
 {t:"blank",q:"A key from another table, used to link the two, is a ___ key.",a:["foreign"]},
 {t:"blank",q:"In parenthetical notation, the primary key is ___.",a:["underlined"]}]);
A("a4-1-erm",[srt("s-card","Which relationship?","Drag each pair of entities to the relationship between them."),bnk("al-erm2","Reading notation","Questions on keys, ERDs and parenthetical notation.")]);

S("s-integ",{"Entity integrity":["Two records have the same primary key","A record has no primary key value","A new student is given an ID already in use"],
  "Referential integrity":["An order refers to a customer who doesn't exist","A course is deleted while students are enrolled on it","A loan refers to book B999, which isn't in the Book table"],
  "Domain integrity":["An age is entered as 250","A date of birth is entered as 'tomorrow'","A grade is entered as Z when only A–E are allowed"]});
B("al-types",[
 {t:"mc",q:"Which data type suits a field for a product's price?",a:"Real",w:["Integer","Boolean","Character"]},
 {t:"mc",q:"Which data type suits a field for the number of items in stock?",a:"Integer",w:["Real","Text","Boolean"]},
 {t:"mc",q:"Which data type suits a field recording whether a library member has paid?",a:"Boolean",w:["Text","Real","Date"]},
 {t:"mc",q:"Which data type suits a postcode?",a:"Text",w:["Integer","Real","Boolean"]},
 {t:"mc",q:"Which data type suits a field for a single grade letter (A–E)?",a:"Character",w:["Real","Integer","Boolean"]},
 {t:"mc",q:"Why store a phone number as text?",a:"It may start with 0 and is never used in calculations",w:["Text is always faster","Numbers can't be more than 5 digits","Phone numbers contain decimals"]},
 {t:"mc",q:"What is a tuple?",a:"One row (record) in a table",w:["One column","A whole table","A key"]},
 {t:"mc",q:"What is a relation?",a:"A table",w:["A row","A key","A relationship line"]},
 {t:"mc",q:"Which rule stops a primary key being left empty?",a:"Entity integrity",w:["Referential integrity","Domain integrity","Data typing"]},
 {t:"mc",q:"Which rule stops a foreign key pointing at a record that doesn't exist?",a:"Referential integrity",w:["Entity integrity","Domain integrity","Normal integrity"]},
 {t:"blank",q:"The structure of a database — its tables, fields, data types and keys — is its logical ___.",a:["schema"]},
 {t:"blank",q:"Values outside the allowed range break ___ integrity.",a:["domain"]}]);
A("a4-1-schema",[srt("s-integ","Which rule is broken?","Drag each problem to the integrity rule it breaks."),bnk("al-types","Tables and data types","Questions on choosing data types and on the parts of a logical schema.")]);

S("s-listops",{"Adds an item":["append(x)","insert(i, x)","lst[len(lst):] = [x]"],"Removes an item":["pop()","del lst[i]","remove(x)"],"Doesn't change the list":["len(lst)","x in lst","lst[i]"]});
A("a4-2-lists",[srt("s-listops","List operations","Drag each list operation to what it does.")]);

S("s-coll",{"List":["Ordered and changeable","Accessed by an index","Can contain duplicates","Written with [ ]"],
  "Tuple":["Ordered but can't be changed","Good for a fixed (x, y) point","Written with ( )","A TypeError if you change an item"],
  "Dictionary":["Key: value pairs","Values looked up by key","Keys must be unique","Written as {key: value}"],
  "Set":["No duplicates","No order","Has union and intersection","Fast membership tests"]},3);
A("a4-2-collections",[srt("s-coll","Which structure?","Drag each feature to the data structure it describes."),{type:"py",desc:"Dictionaries and sets · 2 tasks",explain:"Use a dictionary and sets to solve two problems. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Word count",brief:"Write <span class='mono'>count_words(text)</span> that returns a dictionary of how many times each word appears. Words are separated by spaces.",
   starter:"def count_words(text):\n    counts = {}\n    # your loop here\n    return counts\n\nprint(count_words(\"the cat and the hat\"))",
   tests:[{name:"the cat and the hat",py:"assert count_words('the cat and the hat') == {'the': 2, 'cat': 1, 'and': 1, 'hat': 1}, count_words('the cat and the hat')"},{name:"one word",py:"assert count_words('hi') == {'hi': 1}"}],
   hint:"for w in text.split(): counts[w] = counts.get(w, 0) + 1",solution:"def count_words(text):\n    counts = {}\n    for w in text.split():\n        counts[w] = counts.get(w, 0) + 1\n    return counts\n\nprint(count_words(\"the cat and the hat\"))"},
  {title:"Clubs",brief:"<span class='mono'>chess</span> and <span class='mono'>coding</span> are sets of names. Set <span class='mono'>both</span> to the students in both clubs, <span class='mono'>either</span> to everyone in at least one, and <span class='mono'>only_chess</span> to those in chess but not coding.",
   starter:"chess = {\"Ana\", \"Ben\", \"Cai\", \"Dev\"}\ncoding = {\"Cai\", \"Dev\", \"Eve\"}\nboth = None\neither = None\nonly_chess = None\n",
   tests:[{name:"both",py:"assert both == {'Cai', 'Dev'}, both"},{name:"either",py:"assert either == {'Ana', 'Ben', 'Cai', 'Dev', 'Eve'}"},{name:"only_chess",py:"assert only_chess == {'Ana', 'Ben'}"}],
   hint:"Intersection is &, union is |, difference is -.",solution:"chess = {\"Ana\", \"Ben\", \"Cai\", \"Dev\"}\ncoding = {\"Cai\", \"Dev\", \"Eve\"}\nboth = chess & coding\neither = chess | coding\nonly_chess = chess - coding\n"}]}]);

B("al-stacks",[
 {t:"mc",q:"A stack holds 4, 7, 2 (2 on top). After pop() and push(9), what is on top?",a:"9",w:["2","7","4"]},
 {t:"mc",q:"Which operation returns the top item without removing it?",a:"peek",w:["pop","push","dequeue"]},
 {t:"mc",q:"A stack in a list of size 5 has top = 4. What happens if you push?",a:"Stack overflow",w:["Stack underflow","The bottom item is removed","It wraps round to index 0"]},
 {t:"mc",q:"An empty stack has top = −1. What happens if you pop?",a:"Stack underflow",w:["Stack overflow","It returns 0","It returns the bottom item"]},
 {t:"mc",q:"Which is a use of a stack?",a:"The undo feature in a word processor",w:["A print queue","A keyboard buffer","Round-robin scheduling"]},
 {t:"mc",q:"push(1), push(2), push(3), then pop three times. In what order do the items come out?",a:"3, 2, 1",w:["1, 2, 3","2, 3, 1","3, 1, 2"]},
 {t:"mc",q:"Why is a stack used to store return addresses?",a:"The most recent call must return first",w:["The oldest call returns first","It's faster than RAM","It never fills up"]},
 {t:"mc",q:"How would you search a stack for an item without losing data?",a:"Look at each item from the top down without popping",w:["Pop until it's found","Use a binary search","Sort it first"]},
 {t:"mc",q:"What does isEmpty() check, for a stack with top pointer?",a:"Whether top = −1",w:["Whether top = 0","Whether the list is full","Whether the top item is 0"]},
 {t:"mc",q:"In Python, which method is used as push on a list?",a:"append()",w:["insert(0, x)","add()","push()"]},
 {t:"blank",q:"A stack is last in, ___ out.",a:["first"]},
 {t:"blank",q:"Pushing onto a full stack causes stack ___.",a:["overflow"]}]);
A("a4-3-stacks",[bnk("al-stacks","Stacks quiz","Questions on stack operations, pointers and uses."),{type:"py",desc:"A fixed-length stack · 1 task",explain:"Build a stack in a fixed-length list with a top pointer. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Push and pop",brief:"Complete <span class='mono'>push(item)</span> and <span class='mono'>pop()</span> for a stack of size 5. <span class='mono'>push</span> returns <span class='mono'>False</span> if the stack is full; <span class='mono'>pop</span> returns <span class='mono'>None</span> if it's empty.",
   starter:"SIZE = 5\nstack = [None] * SIZE\ntop = -1\n\ndef push(item):\n    global top\n    pass\n\ndef pop():\n    global top\n    pass\n",
   tests:[{name:"push then pop returns the item",py:"assert push(7) is not False and pop() == 7"},{name:"last in, first out",py:"push(1); push(2); push(3); assert pop() == 3 and pop() == 2 and pop() == 1"},{name:"pop on empty gives None",py:"assert pop() is None"},{name:"push on full gives False",py:"[push(i) for i in range(5)]; assert push(99) is False"}],
   hint:"push: if top == SIZE - 1 return False, else top += 1 and stack[top] = item. pop: if top == -1 return None, else take stack[top] and top -= 1.",
   solution:"SIZE = 5\nstack = [None] * SIZE\ntop = -1\n\ndef push(item):\n    global top\n    if top == SIZE - 1:\n        return False\n    top = top + 1\n    stack[top] = item\n    return True\n\ndef pop():\n    global top\n    if top == -1:\n        return None\n    item = stack[top]\n    top = top - 1\n    return item\n"}]}]);

A("a4-3-queues",[{gen:"alstack",type:"mixed",desc:"Trace stacks and queues · 8 questions",explain:"Trace push, pop, enqueue and dequeue operations. A queue is first in, first out; a stack is last in, first out. New operations every try."},{type:"py",desc:"A circular queue · 1 task",explain:"Build a circular queue in a fixed-length list. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Enqueue and dequeue",brief:"Complete <span class='mono'>enqueue(item)</span> and <span class='mono'>dequeue()</span> for a circular queue of size 4. <span class='mono'>enqueue</span> returns <span class='mono'>False</span> when full; <span class='mono'>dequeue</span> returns <span class='mono'>None</span> when empty. Pointers wrap round with <span class='mono'>% SIZE</span>.",
   starter:"SIZE = 4\nq = [None] * SIZE\nfront = 0\nrear = -1\ncount = 0\n\ndef enqueue(item):\n    global rear, count\n    pass\n\ndef dequeue():\n    global front, count\n    pass\n",
   tests:[{name:"first in, first out",py:"enqueue('a'); enqueue('b'); assert dequeue() == 'a' and dequeue() == 'b'"},{name:"empty gives None",py:"assert dequeue() is None"},{name:"full gives False",py:"[enqueue(i) for i in range(4)]; assert enqueue(9) is False"},{name:"wraps round",py:"assert dequeue() == 0; assert enqueue(4) is not False; assert [dequeue() for _ in range(4)] == [1, 2, 3, 4]"}],
   hint:"enqueue: if count == SIZE return False; rear = (rear + 1) % SIZE; q[rear] = item; count += 1. dequeue: if count == 0 return None; item = q[front]; front = (front + 1) % SIZE; count -= 1.",
   solution:"SIZE = 4\nq = [None] * SIZE\nfront = 0\nrear = -1\ncount = 0\n\ndef enqueue(item):\n    global rear, count\n    if count == SIZE:\n        return False\n    rear = (rear + 1) % SIZE\n    q[rear] = item\n    count = count + 1\n    return True\n\ndef dequeue():\n    global front, count\n    if count == 0:\n        return None\n    item = q[front]\n    front = (front + 1) % SIZE\n    count = count - 1\n    return item\n"}]}]);

/* ---------------- 5 Problem solving ---------------- */
S("s-flow",{"Terminator":["Start","Stop","End of the algorithm"],"Process":["total ← total + x","count ← 0","Calculate the area"],"Decision":["Is x = 0?","Is the list empty?","total > 100?"],"Input or output":["INPUT x","OUTPUT total","Read a name from the user"]});
A("a5-1-algorithms",[srt("s-flow","Flowchart symbols","Drag each step to the flowchart symbol it would go in."),{type:"py",desc:"Fix the logic errors · 2 tasks",explain:"Each program runs but gives the wrong answer. Find and fix the logic error. Press Run to try your code, then Check to test it.",
 tasks:[{title:"The smallest value",brief:"<span class='mono'>smallest(nums)</span> should return the smallest number in a list, but it has two logic errors. Fix them.",
   starter:"def smallest(nums):\n    low = 0\n    for n in nums:\n        if n > low:\n            low = n\n    return low\n\nprint(smallest([12, -3, 8, -7, 4]))",
   tests:[{name:"[12, -3, 8, -7, 4] gives -7",py:"assert smallest([12, -3, 8, -7, 4]) == -7, smallest([12, -3, 8, -7, 4])"},{name:"all positive",py:"assert smallest([5, 9, 3]) == 3, smallest([5, 9, 3])"}],
   hint:"Start low at the first item, and change the comparison so low is replaced by smaller values.",solution:"def smallest(nums):\n    low = nums[0]\n    for n in nums:\n        if n < low:\n            low = n\n    return low\n\nprint(smallest([12, -3, 8, -7, 4]))"},
  {title:"Sum 1 to n",brief:"<span class='mono'>sum_to(n)</span> should return 1 + 2 + … + n, but it's off by one. Fix it.",
   starter:"def sum_to(n):\n    total = 0\n    for i in range(1, n):\n        total = total + i\n    return total\n\nprint(sum_to(10))",
   tests:[{name:"sum_to(10) is 55",py:"assert sum_to(10) == 55, sum_to(10)"},{name:"sum_to(1) is 1",py:"assert sum_to(1) == 1"}],
   hint:"range(1, n) stops before n.",solution:"def sum_to(n):\n    total = 0\n    for i in range(1, n + 1):\n        total = total + i\n    return total\n\nprint(sum_to(10))"}]}]);

B("al-ops",[
 {t:"mc",q:"What is 7 // 2?",a:"3",w:["3.5","4","1"]},
 {t:"mc",q:"What is 7 % 2?",a:"1",w:["3","3.5","0"]},
 {t:"mc",q:"What is 2 ** 5?",a:"32",w:["10","25","7"]},
 {t:"mc",q:"What is 10 / 4 in Python 3?",a:"2.5",w:["2","3","2.0"]},
 {t:"mc",q:"What is 17 % 5 + 17 // 5?",a:"5",w:["3","7","5.4"]},
 {t:"mc",q:"Which expression is True when n is even?",a:"n % 2 == 0",w:["n // 2 == 0","n / 2 == 1","n % 2 == 1"]},
 {t:"mc",q:"What is 3 + 4 * 2?",a:"11",w:["14","10","24"]},
 {t:"mc",q:"What is (3 + 4) * 2?",a:"14",w:["11","10","9"]},
 {t:"mc",q:"Which gives the last digit of a whole number n?",a:"n % 10",w:["n // 10","n / 10","n - 10"]},
 {t:"mc",q:"How many times does the body of for i in range(2, 10, 2) run?",a:"4",w:["5","8","10"]},
 {t:"blank",q:"In Python, 9 % 4 = ___.",a:["1"]},
 {t:"blank",q:"In Python, 9 // 4 = ___.",a:["2"]}]);
A("a5-1-trace",[bnk("al-ops","Operators","Questions on Python's arithmetic operators and loop counts, which you need for tracing.")]);

O("o-unwind",["factorial(3) is called","factorial(3) calls factorial(2)","factorial(2) calls factorial(1)","factorial(1) reaches the base case and returns 1","factorial(2) returns 2 × 1 = 2","factorial(3) returns 3 × 2 = 6"]);
A("a5-1-recursion",[ord("o-unwind","Calls and returns","Put the events of factorial(3) in the order they happen.")]);

B("al-search2",[
 {t:"mc",q:"A binary search of 16 items. What's the maximum number of comparisons?",a:"5",w:["4","8","16"]},
 {t:"mc",q:"A linear search of 50 unsorted items. What's the maximum number of comparisons?",a:"50",w:["6","25","49"]},
 {t:"mc",q:"low = 3, high = 10. What is mid?",a:"6",w:["6.5","7","13"]},
 {t:"mc",q:"In a binary search, the middle value is bigger than the target. What happens next?",a:"high = mid − 1",w:["low = mid + 1","mid = mid + 1","The search stops"]},
 {t:"mc",q:"When does a binary search know the target isn't there?",a:"When low becomes greater than high",w:["When mid is 0","After 10 comparisons","When it reaches the end"]},
 {t:"mc",q:"What is the base case of a recursive binary search when the item is missing?",a:"low > high",w:["mid = 0","The list is sorted","high = 10"]},
 {t:"mc",q:"Which is an advantage of linear search?",a:"It works on unsorted data",w:["It's always faster","It halves the list each time","It needs no loop"]},
 {t:"mc",q:"Doubling the size of a sorted list adds how many comparisons to a binary search, at most?",a:"One",w:["Double the number","None","Ten"]},
 {t:"mc",q:"A sorted list is searched linearly for 25 and reaches 31. What can it do?",a:"Stop: 25 can't be further on",w:["Carry on to the end","Restart","Switch to the start"]},
 {t:"mc",q:"Which data must be sorted for a search to be valid?",a:"Data searched with a binary search",w:["Data searched with a linear search","All data","No data"]},
 {t:"blank",q:"In a binary search, mid = (low + high) ___ 2 in Python.",a:["//"]},
 {t:"blank",q:"A search that checks every item in turn is a ___ search.",a:["linear"]}]);
A("a5-2-searching",[bnk("al-search2","Searching quiz","Questions on linear and binary search.")]);

B("al-bubble",[
 {t:"mc",q:"After the first pass of an ascending bubble sort, which item is certainly in its final place?",a:"The largest",w:["The smallest","The middle one","None"]},
 {t:"mc",q:"6, 2, 9, 4 after one pass of an ascending bubble sort?",a:"2, 6, 4, 9",w:["2, 4, 6, 9","2, 6, 9, 4","6, 2, 4, 9"]},
 {t:"mc",q:"How many comparisons does the first pass make on 6 items?",a:"5",w:["6","15","3"]},
 {t:"mc",q:"Without the early stop, how many passes does a bubble sort of 6 items make?",a:"5",w:["6","1","36"]},
 {t:"mc",q:"What does the swapped flag do?",a:"Stops the sort when a pass makes no swaps",w:["Counts the passes","Holds the largest item","Swaps the first and last items"]},
 {t:"mc",q:"Best case for an improved bubble sort?",a:"An already sorted list",w:["A reversed list","A random list","A list of different lengths"]},
 {t:"mc",q:"Why is bubble sort slow on large lists?",a:"The number of comparisons grows with the square of the list size",w:["It uses too much memory","It needs a second list","It can only sort numbers"]},
 {t:"mc",q:"Which Python line swaps items j and j + 1?",a:"a[j], a[j + 1] = a[j + 1], a[j]",w:["a[j] = a[j + 1]","a[j + 1] = a[j]","swap(a[j])"]},
 {t:"mc",q:"Which change makes a bubble sort sort into descending order?",a:"Swap when a[j] < a[j + 1]",w:["Start from the end","Use range(len(a))","Remove the flag"]},
 {t:"mc",q:"3, 1, 2 — how many swaps does a complete bubble sort make?",a:"2",w:["1","3","0"]},
 {t:"blank",q:"In a bubble sort, one trip through the list comparing neighbours is a ___.",a:["pass"]},
 {t:"blank",q:"Bubble sort swaps ___ items that are in the wrong order.",a:["neighbouring","adjacent"]}]);
A("a5-2-bubble",[bnk("al-bubble","Bubble sort quiz","Questions on bubble sort passes, comparisons and swaps.")]);

A("a5-2-insertion",[{gen:"alsort",type:"mixed",desc:"Sort traces · 8 questions",explain:"Trace passes of insertion sort and bubble sort. Each insertion sort pass inserts the next item into the sorted part. New lists every try."},{type:"py",desc:"Insertion sort · 1 task",explain:"Write an insertion sort. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Insertion sort",brief:"Complete <span class='mono'>insertion(items)</span> so it sorts the list into ascending order in place. Don't use <span class='mono'>sort()</span> or <span class='mono'>sorted()</span>.",
   starter:"def insertion(items):\n    for i in range(1, len(items)):\n        current = items[i]\n        j = i - 1\n        # shift bigger items right, then insert current\n\nnums = [7, 3, 5, 1]\ninsertion(nums)\nprint(nums)",
   tests:[{name:"sorts 7 3 5 1",py:"x = [7, 3, 5, 1]; insertion(x); assert x == [1, 3, 5, 7], x"},{name:"sorts a reversed list",py:"x = list(range(9, 0, -1)); insertion(x); assert x == list(range(1, 10))"},{name:"already sorted",py:"x = [1, 2, 3]; insertion(x); assert x == [1, 2, 3]"},{name:"no built-in sort",py:"assert 'sort' not in __code__.replace('insertion', '')"}],
   hint:"while j >= 0 and items[j] > current: items[j + 1] = items[j]; j -= 1. After the loop, items[j + 1] = current.",
   solution:"def insertion(items):\n    for i in range(1, len(items)):\n        current = items[i]\n        j = i - 1\n        while j >= 0 and items[j] > current:\n            items[j + 1] = items[j]\n            j = j - 1\n        items[j + 1] = current\n\nnums = [7, 3, 5, 1]\ninsertion(nums)\nprint(nums)"}]}]);

S("s-ops",{"AND":["The alarm sounds if the door is open and the system is armed","Both inputs must be 1","A.B"],"OR":["The light comes on if either switch is pressed","At least one input is 1","A+B"],
  "XOR":["The output is 1 when the inputs are different","A two-way landing light switch","A ⊕ B"],"NOT":["Reverses the input","Output 1 when the input is 0","Written with a bar over the letter"]});
A("a5-3-expressions",[{gen:"altruth",type:"mixed",desc:"Truth tables · 8 questions",explain:"Work out output columns for expressions. Rows go 00, 01, 10, 11 (or 000 to 111). New expressions every try."},srt("s-ops","Which operator?","Drag each description to the Boolean operator it matches.")]);

B("al-tt",[
 {t:"mc",q:"How many rows does a truth table with 4 inputs need?",a:"16",w:["8","4","32"]},
 {t:"mc",q:"Which two expressions are equivalent?",a:"NOT (A AND B) and NOT A OR NOT B",w:["A AND B and A OR B","NOT A and A","A XOR B and A AND B"]},
 {t:"mc",q:"What is the output column of NOT A AND B for rows 00, 01, 10, 11?",a:"0100",w:["1000","0110","1101"]},
 {t:"mc",q:"What is the output column of A OR NOT B for rows 00, 01, 10, 11?",a:"1011",w:["0100","1101","1110"]},
 {t:"mc",q:"Which expression has the output column 0110?",a:"A XOR B",w:["A OR B","A AND B","A NOR B"]},
 {t:"mc",q:"Which expression has the output column 1000?",a:"A NOR B",w:["A NAND B","A AND B","NOT A"]},
 {t:"mc",q:"Why add intermediate columns to a truth table?",a:"To work out parts of the expression step by step",w:["To make the table longer","Because every table needs 6 columns","To show the inputs twice"]},
 {t:"mc",q:"(A AND B) OR C. How many rows have the output 1?",a:"5",w:["3","4","6"]},
 {t:"mc",q:"Which order should the input rows of a 2-input truth table follow?",a:"00, 01, 10, 11",w:["11, 10, 01, 00","00, 11, 01, 10","Any order, without repeats being a problem"]},
 {t:"mc",q:"NOT (A OR B) is the same as…",a:"NOT A AND NOT B",w:["NOT A OR NOT B","A AND B","A NAND B"]},
 {t:"blank",q:"A truth table with 3 inputs has ___ rows.",a:["8","eight"]},
 {t:"blank",q:"NOT (A AND B) is called ___.",a:["nand","a nand b"]}]);
A("a5-3-truthtables",[bnk("al-tt","Truth table questions","Questions on building and comparing truth tables."),{type:"py",desc:"Truth tables in Python · 1 task",explain:"Generate a truth table with nested loops. Press Run to try your code, then Check to test it.",
 tasks:[{title:"Print a truth table",brief:"Print the truth table for <b>X = (A AND B) OR NOT C</b>. Print one row per line as four digits separated by spaces, <span class='mono'>A B C X</span>, in the order 000 to 111.",
   starter:"for a in (0, 1):\n    for b in (0, 1):\n        # add a loop for c, work out x and print the row\n        pass\n",
   tests:[{name:"first row 0 0 0 1",stdin:[],expect:"0 0 0 1"},{name:"all eight rows",py:"import io, contextlib\nbuf = io.StringIO()\nwith contextlib.redirect_stdout(buf):\n    exec(__code__, {})\nrows = buf.getvalue().split()\nassert rows == '0 0 0 1 0 0 1 0 0 1 0 1 0 1 1 0 1 0 0 1 1 0 1 0 1 1 0 1 1 1 1 1'.split(), rows"}],
   hint:"x = int((a and b) or not c). Then print(a, b, c, x).",solution:"for a in (0, 1):\n    for b in (0, 1):\n        for c in (0, 1):\n            x = int((a and b) or not c)\n            print(a, b, c, x)\n"}]}]);

S("s-par",{"Procedural":["A for loop that checks each record","A function that calculates an average","The programmer controls every step","Variables change as the program runs"],
  "Declarative":["SELECT Name FROM Student WHERE Age > 16","A Prolog fact: parent(ana, ben).","The system decides how to get the result","Describes the result that is wanted"]});
B("al-par2",[
 {t:"mc",q:"A program reads each line of a file, counts the words and prints the total. Which paradigm?",a:"Procedural",w:["Declarative","Logic","None"]},
 {t:"mc",q:"Which is declarative?",a:"SELECT * FROM Book WHERE Year < 1950;",w:["for b in books: print(b)","total = total + 1","while x > 0: x = x - 1"]},
 {t:"mc",q:"In declarative programming, who decides the steps?",a:"The language or system",w:["The programmer, line by line","The user","The operating system scheduler"]},
 {t:"mc",q:"Which is a benefit of procedural programming?",a:"Precise control over how the problem is solved",w:["The system finds the steps itself","No code needs to be written","It can't have bugs"]},
 {t:"mc",q:"Which is a benefit of declarative programming?",a:"Short code focused on the result",w:["Full control over every step","It's always faster","It doesn't need data"]},
 {t:"mc",q:"Prolog programs are made of…",a:"facts and rules",w:["loops and variables","classes and objects","registers and buses"]},
 {t:"mc",q:"Why are procedures and functions used in procedural code?",a:"To break the problem into reusable parts",w:["Because the language forbids loops","To make the code declarative","To store data in a database"]},
 {t:"mc",q:"A spreadsheet formula =SUM(B2:B20) describes the result, not the steps. It is closest to…",a:"declarative programming",w:["procedural programming","assembly language","machine code"]},
 {t:"mc",q:"Which statement changes the program's state?",a:"count = count + 1",w:["parent(ana, ben).","SELECT Name FROM Student;","A comment"]},
 {t:"mc",q:"Python, used as in this course, is…",a:"procedural",w:["declarative","a query language","a logic language"]},
 {t:"blank",q:"SQL is a ___ language.",a:["declarative"]},
 {t:"blank",q:"Step-by-step instructions grouped into procedures is ___ programming.",a:["procedural"]}]);
A("a5-4-paradigms",[srt("s-par","Procedural or declarative?","Drag each example to the paradigm it belongs to."),bnk("al-par2","Paradigms in practice","Scenario questions on procedural and declarative programming.")]);

/* ---------------- 6 Enabling technologies ---------------- */
S("s-5v",{"Volume":["Petabytes of stored video","Billions of rows of sales records"],"Velocity":["Thousands of card payments a second","Live sensor readings every millisecond"],
  "Variety":["Text, images and video together","Structured tables and unstructured posts"],"Veracity":["Fake reviews mixed with real ones","Sensor readings that may be faulty"],"Value":["Predicting which products will sell out","Spotting fraud before it costs money"]},2);
B("al-bigdata2",[
 {t:"mc",q:"Why can't a traditional single-server database handle big data well?",a:"The data is too large, too fast and too varied for one machine",w:["It can't store numbers","It has no primary keys","It's always offline"]},
 {t:"mc",q:"What is distributed processing?",a:"Splitting a job across many computers working at the same time",w:["Sending data to a printer","Processing data one record at a time","Storing data on one disk"]},
 {t:"mc",q:"Which infrastructure is needed to collect data from millions of phones?",a:"Fast, reliable networks and many servers",w:["A single laptop","A USB drive","A printer"]},
 {t:"mc",q:"Why must big data infrastructure be secure?",a:"It often holds personal data that attackers want",w:["Security makes it faster","It's always public","Laws ban encryption"]},
 {t:"mc",q:"What is unstructured data?",a:"Data that doesn't fit rows and columns, like emails and video",w:["Data with errors","Data with no value","Data stored in a table"]},
 {t:"mc",q:"Which is an example of high velocity?",a:"A stock exchange recording every trade as it happens",w:["A yearly census","A library catalogue","A printed dictionary"]},
 {t:"mc",q:"Which V is about how accurate the data is?",a:"Veracity",w:["Volume","Variety","Velocity"]},
 {t:"mc",q:"Why are copies of big data stored on several servers?",a:"So the data isn't lost if one server fails",w:["To make it smaller","To slow down attackers","Because one copy is illegal"]},
 {t:"mc",q:"Which is a concern about big data?",a:"Personal privacy",w:["It's too small to use","It can't be processed","It has no value"]},
 {t:"mc",q:"Adding more servers to a distributed system usually…",a:"reduces the processing time, but not in exact proportion",w:["increases the processing time","has no effect","halves the data"]},
 {t:"blank",q:"The V that describes the amount of data is ___.",a:["volume"]},
 {t:"blank",q:"Splitting processing across many computers is ___ processing.",a:["distributed"]}]);
A("a6-1-bigdata",[srt("s-5v","The five Vs","Drag each example to the V it describes best."),bnk("al-bigdata2","Big data infrastructure","Questions on the infrastructure big data needs and the issues it raises.")]);

O("o-ds",["Decide on the question to answer","Collect the data","Store the data","Clean the data","Analyse the data","Visualise the results","Draw conclusions"]);
A("a6-1-datascience",[ord("o-ds","The data science process","Put the stages of a data science project in order.")]);

S("s-ml",{"Supervised learning":["Training data is labelled","Predicts a label for new data","Spam filtering from labelled emails","Predicting house prices from past sales"],
  "Unsupervised learning":["Training data has no labels","Finds groups (clusters)","Grouping customers by behaviour","Spotting unusual transactions"]});
S("s-aitype",{"Narrow AI":["A voice assistant","A chess engine","A film recommender","All AI in use today"],"General AI":["Human-level ability across any task","Hypothetical: doesn't exist yet","Could learn any job a person can"],"Super AI":["Smarter than humans in every area","Hypothetical","Raises questions about control"]},3);
A("a6-2-ai",[srt("s-ml","Supervised or unsupervised?","Drag each example to the type of machine learning it describes."),srt("s-aitype","Narrow, general or super?","Drag each description to the category of AI.")]);

S("s-llm",{"Context":["The prompt and earlier conversation","Documents pasted into the chat","The context window limits how much it can use"],"Accuracy":["It can invent a fake reference","Fluent answers can still be wrong","Important facts should be checked"],
  "Knowledge limits":["Training data stops at a cut-off date","Recent events may be unknown","Rare topics may be poorly covered"],"Bias":["Stereotypes in the training text","One-sided answers on opinions","Under-represented groups treated unfairly"]},3);
O("o-llm",["The user types a prompt","The prompt is split into tokens","The model calculates a probability for each possible next token","One token is chosen","The token is added to the text","The process repeats until the reply is finished"]);
A("a6-2-llm",[srt("s-llm","LLM issues","Drag each point to the issue it relates to."),ord("o-llm","How an LLM replies","Put the steps an LLM takes to generate a reply in order.")]);

S("s-ide",{"Writing code":["Syntax highlighting","Autocomplete","Auto-indentation","Line numbers"],"Finding errors":["Breakpoints","Stepping through code","Watching variables","The syntax checker"]});
A("a6-3-ide",[srt("s-ide","IDE features","Drag each IDE feature to what it mainly helps with."),{type:"py",desc:"Debugging · 2 tasks",explain:"Each program has a bug. Use Run, print statements or reasoning to find it, then fix it. Press Check to test your fix.",
 tasks:[{title:"The average",brief:"<span class='mono'>average(nums)</span> should return the mean of a list, but <span class='mono'>average([4, 6, 8])</span> gives 7. Fix it.",
   starter:"def average(nums):\n    total = 0\n    for n in nums:\n        total = total + n\n    result = total / len(nums) + 1\n    return result\n\nprint(average([4, 6, 8]))",
   tests:[{name:"average of 4, 6, 8 is 6",py:"assert average([4, 6, 8]) == 6, average([4, 6, 8])"},{name:"average of 10 is 10",py:"assert average([10]) == 10"}],
   hint:"Look at the line that calculates result.",solution:"def average(nums):\n    total = 0\n    for n in nums:\n        total = total + n\n    result = total / len(nums)\n    return result\n\nprint(average([4, 6, 8]))"},
  {title:"Count the vowels",brief:"<span class='mono'>vowels(text)</span> should count a, e, i, o and u (small or capital). It gives the wrong answer for <span class='mono'>\"Apple\"</span>. Fix it.",
   starter:"def vowels(text):\n    count = 0\n    for ch in text:\n        if ch in \"aeiou\":\n            count = count + 1\n    return count\n\nprint(vowels(\"Apple\"))",
   tests:[{name:"Apple has 2",py:"assert vowels('Apple') == 2, vowels('Apple')"},{name:"rhythm has 0",py:"assert vowels('rhythm') == 0"},{name:"EDUCATION has 5",py:"assert vowels('EDUCATION') == 5"}],
   hint:"Capital letters aren't in \"aeiou\". Check ch.lower() instead.",solution:"def vowels(text):\n    count = 0\n    for ch in text:\n        if ch.lower() in \"aeiou\":\n            count = count + 1\n    return count\n\nprint(vowels(\"Apple\"))"}]}]);

S("s-oss",{"Open source":["Anyone can read the source code","Usually free to use","A community can fix bugs","Python, Linux and Firefox"],"Proprietary":["The source code is kept private","Usually paid for with a licence","Support from the supplier","Users can't change the code"]});
O("o-vcs",["Create a branch for the new feature","Write some code on the branch","Commit the change with a message","Test the feature on the branch","Merge the branch into main","Delete the feature branch"]);
A("a6-3-collab",[srt("s-oss","Open source or proprietary?","Drag each feature to open-source or proprietary software."),ord("o-vcs","Adding a feature with version control","Put the steps for adding a feature using a version control system in order.")]);
