/* 1.1 Computer architecture */
L("a1-1",[
{slug:"stored",title:"The stored-program concept and von Neumann",covers:[1,2],
 v:[["Stored-program concept","The idea that a program's instructions are held in main memory, as binary, alongside the data, and fetched and executed one at a time by the CPU."],
  ["von Neumann architecture","A computer design in which instructions and data share one memory and one set of buses, processed by a single CPU."],
  ["Instruction","A single command in machine code, made of an opcode and usually an operand."],
  ["Main memory","The memory (RAM) the CPU can access directly, where running programs and their data are stored."],
  ["von Neumann bottleneck","The limit on speed caused by instructions and data having to share the same bus, so they can't be fetched at the same time."],
  ["General-purpose computer","A computer that can run any program loaded into memory, rather than doing one fixed job."],
  ["Hard-wired","A computer whose program is fixed in its circuits, so changing the task means rewiring it."]],
 q:[["What does the stored-program concept say?","Instructions are stored in memory alongside data","Instructions are wired into the CPU","Data is stored only on secondary storage","Each program needs its own CPU"],
  ["In von Neumann architecture, instructions and data…","share the same memory and buses","use separate memories","use separate buses","are stored in the CPU's registers"],
  ["What is the von Neumann bottleneck?","Instructions and data compete for the same bus","The CPU runs out of registers","The clock speed is too slow","Secondary storage is full"],
  ["Which is a benefit of the stored-program concept?","A computer can run different programs without being rewired","Programs can never be changed","Instructions and data can be fetched at the same time","It needs no memory"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Stored programs · 8 questions",gen:"bank",bank:"al-stored",explain:"Questions on the stored-program concept, von Neumann architecture and its bottleneck. Every try picks a different set."}]},
{slug:"components",title:"Internal components and buses",covers:[3],
 v:[["CPU","The central processing unit: fetches, decodes and executes the instructions of a program."],
  ["RAM","Random access memory: volatile main memory that holds the programs and data in use. It can be read and written."],
  ["ROM","Read-only memory: non-volatile memory holding the start-up instructions (the bootstrap / BIOS)."],
  ["Cache","Very fast memory inside the CPU holding copies of frequently used instructions and data."],
  ["Input/output (I/O) controller","Hardware that connects the CPU and buses to devices such as keyboards, screens and drives."],
  ["Address bus","Carries memory addresses from the CPU to memory and I/O. One-way (unidirectional)."],
  ["Data bus","Carries data and instructions between the CPU, memory and I/O. Two-way (bidirectional)."],
  ["Control bus","Carries control and timing signals such as memory read, memory write, clock and interrupt. Two-way."],
  ["Addressable memory","The number of memory locations the CPU can reach: 2ⁿ for an n-bit address bus."]],
 q:[["Which bus is unidirectional?","Address bus","Data bus","Control bus","All three"],
  ["A computer has a 20-bit address bus. How many memory locations can it address?","2²⁰ (1,048,576)","20","20²","2 × 20"],
  ["Which memory is volatile?","RAM","ROM","A hard disk","Flash memory"],
  ["Which signal travels on the control bus?","Memory write","A memory address","An instruction","A data value"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Buses and memory · 8 questions",gen:"addrmem",type:"mixed",explain:"Work out how much memory an address bus can reach, and decide which bus carries what. Remember: an n-bit address bus can address 2ⁿ locations. New numbers every try."},
  {id:"act2",title:"Activity 2",desc:"Components quiz · 8 questions",gen:"bank",bank:"al-components",explain:"Questions on the CPU, RAM, ROM, cache, I/O and the three buses. Every try picks a different set."}]},
{slug:"cpu",title:"Inside the CPU",covers:[4],
 v:[["Control unit (CU)","Decodes instructions and sends control signals to coordinate the other components."],
  ["Arithmetic logic unit (ALU)","Carries out arithmetic (such as add and subtract) and logic operations (such as AND, OR and comparisons)."],
  ["General-purpose register","A register used to hold data being worked on, e.g. R0 to R12."],
  ["Program counter (PC)","Holds the address of the next instruction to be fetched."],
  ["Memory address register (MAR)","Holds the address of the memory location about to be read from or written to."],
  ["Memory buffer register (MBR)","Holds the data or instruction just read from memory, or about to be written to memory."],
  ["Current instruction register (CIR)","Holds the instruction currently being decoded and executed."],
  ["Accumulator (ACC)","Holds the result of calculations done by the ALU."],
  ["Stack pointer (SP)","Holds the address of the top of the stack in memory."],
  ["Status register (SR)","Holds flags describing the last result, such as zero, negative, carry and overflow."],
  ["Clock","Sends out regular pulses that keep the CPU's components in step; its speed is measured in hertz."]],
 q:[["Which register holds the address of the next instruction?","Program counter (PC)","Memory address register (MAR)","Current instruction register (CIR)","Accumulator (ACC)"],
  ["Which register holds data that has just been read from memory?","Memory buffer register (MBR)","Memory address register (MAR)","Stack pointer (SP)","Program counter (PC)"],
  ["Which register records whether the last result was zero or overflowed?","Status register (SR)","Accumulator (ACC)","Stack pointer (SP)","Current instruction register (CIR)"],
  ["What does the control unit do?","Decodes instructions and sends control signals","Performs calculations","Stores the program","Holds the results of calculations"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Registers · 8 questions",gen:"bank",bank:"al-cpu",explain:"Match each register and component to its job. Every try picks a different set."}]},
{slug:"fde",title:"The fetch-decode-execute cycle",covers:[5],
 v:[["Fetch-decode-execute (FDE) cycle","The cycle the CPU repeats for every instruction: fetch it from memory, decode it, then execute it."],
  ["Fetch","Copy the next instruction from memory into the CPU and increment the program counter."],
  ["Decode","The control unit works out what the instruction means: its opcode and operand."],
  ["Execute","Carry out the instruction, e.g. an ALU calculation, a memory read or write, or a jump."],
  ["Register transfer notation","A way to show data moving between registers, e.g. MAR ← [PC] means the contents of the PC are copied into the MAR."],
  ["Memory read signal","A control-bus signal telling memory to place the contents of the addressed location on the data bus."],
  ["Memory write signal","A control-bus signal telling memory to store the value on the data bus at the addressed location."]],
 q:[["What does MAR ← [PC] mean?","The contents of the PC are copied into the MAR","The MAR is copied into the PC","The PC is cleared","Memory location PC is read"],
  ["When is the program counter incremented?","During the fetch stage","During the decode stage","Only after a jump","At the end of the program"],
  ["Which component decodes the instruction?","Control unit","ALU","MBR","Clock"],
  ["Which control signal is sent to fetch an instruction?","Memory read","Memory write","Interrupt","Bus request"]],
 acts:[{id:"act1",title:"Activity 1",desc:"FDE in order · 8 questions",gen:"bank",bank:"al-fde",explain:"Questions on the steps of the cycle, register transfer notation and the read/write signals. Every try picks a different set."}]},
{slug:"hierarchy",title:"The memory hierarchy",covers:[6],
 v:[["Memory hierarchy","Storage arranged by speed, size and cost: registers, cache, main memory, then secondary storage."],
  ["Register","The fastest, smallest storage, inside the CPU, holding the values being worked on right now."],
  ["L1 cache","The fastest and smallest cache, built into each core."],
  ["L2 cache","Larger and slower than L1; usually one per core."],
  ["L3 cache","The largest, slowest cache, shared between all the cores."],
  ["Secondary storage","Non-volatile storage such as SSDs and hard disks: very large and cheap per byte, but far slower."],
  ["Locality of reference","Programs tend to reuse recent data and nearby addresses, which is why caching works."],
  ["Cache hit","The data the CPU needs is already in the cache."],
  ["Cache miss","The data isn't in the cache, so it must be fetched from a slower level."]],
 q:[["Which is the fastest storage?","CPU registers","L3 cache","Main memory","An SSD"],
  ["Going down the memory hierarchy, storage gets…","bigger, slower and cheaper per byte","smaller, faster and dearer","faster and bigger","volatile"],
  ["Which cache is shared between all the cores?","L3","L1","L2","None of them"],
  ["Why does caching work?","Programs tend to reuse recent and nearby data","Cache is non-volatile","Cache is bigger than RAM","The CPU only needs data once"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Hierarchy quiz · 8 questions",gen:"bank",bank:"al-hierarchy",explain:"Questions on the levels of the memory hierarchy, their benefits and drawbacks, and hits and misses. Every try picks a different set."}]},
{slug:"transmission",title:"Serial and parallel transmission",covers:[7],
 v:[["Serial transmission","Bits are sent one after another along a single channel."],
  ["Parallel transmission","Several bits are sent at the same moment, each along its own wire."],
  ["Skew","When bits sent in parallel arrive at slightly different times, so they get out of step."],
  ["Crosstalk","Interference between wires that run close together, which can corrupt data."],
  ["Bus","A set of parallel wires connecting components inside a computer."],
  ["Bit rate","The number of bits transmitted per second (bps)."]],
 q:[["How is data sent in serial transmission?","One bit at a time down one channel","Several bits at once on several wires","Only one way","Using light only"],
  ["Which problem affects parallel transmission over long distances?","Skew","Packet loss","Encryption","Latency of zero"],
  ["Where is parallel transmission still used?","Short, fast links such as internal buses","Undersea cables","Long-distance internet links","Wi-Fi"],
  ["Why is serial now used for most external connections, such as USB?","It avoids skew and crosstalk, so it can run fast over longer cables","It sends more bits at once","It needs more wires","It can't be interrupted"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Serial or parallel? · 8 questions",gen:"bank",bank:"al-transmission",explain:"Questions on how serial and parallel transmission work, their benefits and drawbacks, and where each is used. Every try picks a different set."}]}
]);

B("al-stored",[
 {t:"mc",q:"Which statement describes the stored-program concept?",a:"Program instructions and data are both held in main memory",w:["Programs are stored on the hard disk only","Instructions are built into the CPU's circuits","Each instruction is typed in by the user as it runs"]},
 {t:"mc",q:"Before stored programs, how was a computer such as ENIAC given a new task?",a:"It was rewired by hand",w:["A new program was loaded into RAM","It was sent instructions over a network","A new CPU was fitted"]},
 {t:"mc",q:"In von Neumann architecture, how many memories hold instructions and data?",a:"One shared memory",w:["Two separate memories","A memory for each core","None: they're stored in the CPU"]},
 {t:"mc",q:"Which is a drawback of von Neumann architecture?",a:"Instructions and data can't be fetched at the same time",w:["Programs can't be changed","It needs two sets of buses","It can only run one program ever"]},
 {t:"mc",q:"Which is a benefit of von Neumann architecture?",a:"It's simpler and cheaper, because one memory and one set of buses serve both",w:["It fetches instructions and data in parallel","It has no bottleneck","Data can't overwrite instructions"]},
 {t:"mc",q:"In what form are instructions stored in memory?",a:"Binary machine code",w:["English sentences","Python source code","Flowcharts"]},
 {t:"mc",q:"A program accidentally writes data over its own instructions. Why is this possible in von Neumann machines?",a:"Instructions and data share the same memory",w:["The PC is too small","The clock is too fast","Cache is volatile"]},
 {t:"mc",q:"What makes a computer 'general purpose'?",a:"It can run any program loaded into memory",w:["It has a fixed task","It has no operating system","It uses Harvard architecture"]},
 {t:"mc",q:"Which part fetches and executes the stored instructions one at a time?",a:"The CPU",w:["The hard disk","The keyboard","ROM"]},
 {t:"blank",q:"The limit on speed caused by instructions and data sharing one bus is called the von Neumann ___.",a:["bottleneck"]},
 {t:"blank",q:"In the stored-program concept, instructions are held in main ___ alongside the data.",a:["memory","ram"]},
 {t:"blank",q:"Each instruction is made of an opcode and usually an ___.",a:["operand"]}]);

B("al-components",[
 {t:"mc",q:"Which component executes program instructions?",a:"CPU",w:["RAM","ROM","I/O controller"]},
 {t:"mc",q:"Which memory holds the bootstrap program that starts the computer?",a:"ROM",w:["RAM","Cache","Registers"]},
 {t:"mc",q:"Which bus is bidirectional and carries the instructions themselves?",a:"Data bus",w:["Address bus","Control bus","None of them"]},
 {t:"mc",q:"Why is the address bus one-way?",a:"Only the CPU sends out addresses",w:["Memory sends addresses to the CPU","It carries the clock signal","It's too narrow for two-way traffic"]},
 {t:"mc",q:"Widening the data bus from 32 to 64 bits means…",a:"more bits can be moved in each transfer",w:["more memory can be addressed","the clock speed doubles","RAM becomes non-volatile"]},
 {t:"mc",q:"Widening the address bus means…",a:"more memory locations can be addressed",w:["more data per transfer","fewer control signals","less cache is needed"]},
 {t:"mc",q:"What does an I/O controller do?",a:"Connects devices to the buses and handles their communication",w:["Stores the operating system","Executes instructions","Holds the next instruction's address"]},
 {t:"mc",q:"Why is cache needed if RAM already holds the program?",a:"Cache is much faster, so the CPU waits less",w:["Cache is bigger than RAM","RAM can't hold instructions","Cache is non-volatile"]},
 {t:"mc",q:"An address bus is 16 bits wide. How many locations can it address?",a:"65,536",w:["16","256","32,768"]},
 {t:"mc",q:"Which signal would travel on the control bus?",a:"Interrupt request",w:["The address 0x3F0A","The value 42","An instruction's opcode"]},
 {t:"blank",q:"An n-bit address bus can address 2 to the power ___ locations.",a:["n"]},
 {t:"blank",q:"The bus that carries memory read and memory write signals is the ___ bus.",a:["control"]}]);

B("al-cpu",[
 {t:"mc",q:"Which register holds the instruction being decoded?",a:"Current instruction register (CIR)",w:["Memory buffer register (MBR)","Program counter (PC)","Status register (SR)"]},
 {t:"mc",q:"Which register sends an address to the address bus?",a:"Memory address register (MAR)",w:["Memory buffer register (MBR)","Accumulator (ACC)","Current instruction register (CIR)"]},
 {t:"mc",q:"Which register is connected to the data bus?",a:"Memory buffer register (MBR)",w:["Memory address register (MAR)","Program counter (PC)","Stack pointer (SP)"]},
 {t:"mc",q:"Which register holds the result of an ALU calculation?",a:"Accumulator (ACC)",w:["Program counter (PC)","Memory address register (MAR)","Stack pointer (SP)"]},
 {t:"mc",q:"Which register points to the top of the stack?",a:"Stack pointer (SP)",w:["Program counter (PC)","Status register (SR)","Memory buffer register (MBR)"]},
 {t:"mc",q:"A subtraction gives 0. Where is this recorded?",a:"In the zero flag of the status register",w:["In the program counter","In the MAR","In the clock"]},
 {t:"mc",q:"Which component compares two values to see which is bigger?",a:"ALU",w:["Control unit","Clock","MAR"]},
 {t:"mc",q:"What does the clock do?",a:"Sends regular pulses that keep components in step",w:["Stores the time of day for files","Counts instructions","Decodes instructions"]},
 {t:"mc",q:"What is a general-purpose register used for?",a:"Holding data the program is working on",w:["Holding only the next address","Holding the clock speed","Storing the BIOS"]},
 {t:"mc",q:"Which two registers are needed to read a value from memory?",a:"MAR and MBR",w:["PC and SP","CIR and SR","ACC and PC"]},
 {t:"blank",q:"The register that holds flags such as carry, zero, negative and overflow is the ___ register.",a:["status","sr"]},
 {t:"blank",q:"MBR stands for memory ___ register.",a:["buffer"]}]);

B("al-fde",[
 {t:"mc",q:"What is the first step of the fetch stage?",a:"MAR ← [PC]",w:["CIR ← [MBR]","PC ← [PC] + 1","Decode the opcode"]},
 {t:"mc",q:"After MAR ← [PC], what happens next in the fetch stage?",a:"A memory read signal is sent and the instruction is copied into the MBR",w:["The instruction is executed","The PC is set to 0","The ACC is cleared"]},
 {t:"mc",q:"What does CIR ← [MBR] mean?",a:"The instruction in the MBR is copied into the CIR",w:["The CIR is copied into memory","The MBR is cleared","The CIR is incremented"]},
 {t:"mc",q:"Why is the PC incremented during fetch?",a:"So it points to the next instruction",w:["To count how many programs have run","To clear the cache","To decode the instruction"]},
 {t:"mc",q:"An instruction is a jump (branch). What happens during execute?",a:"The PC is loaded with the jump's address",w:["The PC is incremented twice","The MAR is cleared","Nothing: jumps happen in decode"]},
 {t:"mc",q:"What does [CIR] mean in register transfer notation?",a:"The contents of the CIR (decoded and executed)",w:["The address of the CIR","Clear the CIR","Copy the CIR to the PC"]},
 {t:"mc",q:"An instruction stores the ACC in memory. Which control signal is used?",a:"Memory write",w:["Memory read","Bus request","Clock"]},
 {t:"mc",q:"In which order do the stages run?",a:"Fetch, decode, execute",w:["Decode, fetch, execute","Execute, fetch, decode","Fetch, execute, decode"]},
 {t:"mc",q:"Which component works out what the instruction means?",a:"Control unit",w:["ALU","Program counter","MBR"]},
 {t:"mc",q:"Where is the instruction held while it's being decoded?",a:"CIR",w:["MAR","PC","SP"]},
 {t:"blank",q:"In register transfer notation, PC ← [PC] + 1 means the program counter is ___.",a:["incremented","increased by 1","increased by one"]},
 {t:"blank",q:"To fetch an instruction, the control unit sends a memory ___ signal.",a:["read"]}]);

B("al-hierarchy",[
 {t:"mc",q:"Put these in order, fastest first.",a:"Registers, cache, RAM, SSD",w:["Cache, registers, RAM, SSD","RAM, cache, registers, SSD","SSD, RAM, cache, registers"]},
 {t:"mc",q:"Which is the largest store in a typical computer?",a:"Secondary storage",w:["L1 cache","Registers","L3 cache"]},
 {t:"mc",q:"Why isn't all memory made from the fastest type?",a:"Fast memory is far more expensive per byte",w:["Fast memory is non-volatile","Fast memory can't hold instructions","Fast memory uses more cables"]},
 {t:"mc",q:"On a cache miss, what happens?",a:"The data is fetched from a slower level and copied into the cache",w:["The program stops","The data is deleted","The CPU uses the hard disk directly"]},
 {t:"mc",q:"Which cache does each core usually have its own copy of?",a:"L1 (and usually L2)",w:["L3 only","None","Only shared cache"]},
 {t:"mc",q:"Which level keeps its contents when the power is off?",a:"Secondary storage",w:["Registers","Cache","RAM"]},
 {t:"mc",q:"A loop uses the same few variables thousands of times. Which idea explains why caching speeds it up?",a:"Locality of reference",w:["Virtual memory","Paging","Serial transmission"]},
 {t:"mc",q:"What's a drawback of a larger cache?",a:"It costs more and can be slightly slower to search",w:["It loses data more often","It makes RAM smaller","It slows the clock to zero"]},
 {t:"mc",q:"Which statement is true going up the hierarchy (towards the CPU)?",a:"Each level is faster but smaller",w:["Each level is slower but bigger","Each level is non-volatile","Each level is cheaper per byte"]},
 {t:"blank",q:"When the data the CPU needs is already in the cache, it's called a cache ___.",a:["hit"]},
 {t:"blank",q:"The cache level shared between all the cores is level ___.",a:["3","three","l3"]}]);

B("al-transmission",[
 {t:"mc",q:"Which needs more wires?",a:"Parallel transmission",w:["Serial transmission","They need the same","Neither uses wires"]},
 {t:"mc",q:"What is skew?",a:"Bits sent together arriving at different times",w:["Data travelling in one direction only","A bit flipped by interference","Data sent one bit at a time"]},
 {t:"mc",q:"What is crosstalk?",a:"Interference between wires close together",w:["Two devices talking at once","Delay before data arrives","Using the wrong protocol"]},
 {t:"mc",q:"Which is a benefit of serial transmission?",a:"Cheaper cabling with no skew, so it works over long distances",w:["It sends 8 bits at the same moment","It needs no clock or timing","It can't ever have errors"]},
 {t:"mc",q:"Which is a benefit of parallel transmission over a very short distance?",a:"Several bits arrive at once, so it can be very fast",w:["It's immune to crosstalk","It uses one wire","It works best over long distances"]},
 {t:"mc",q:"Which uses serial transmission?",a:"USB",w:["The internal data bus","A 64-bit memory bus","None of them"]},
 {t:"mc",q:"Why are modern high-speed links often serial?",a:"Very high clock rates are easier on one line than on many lines kept in step",w:["Parallel cables are illegal","Serial sends more bits per tick","Serial needs no error checking"]},
 {t:"mc",q:"Inside the CPU and motherboard, buses are…",a:"parallel",w:["serial","wireless","optical"]},
 {t:"mc",q:"A printer is 10 m from the computer. Which transmission method suits it best?",a:"Serial",w:["Parallel","Neither","Simplex parallel"]},
 {t:"blank",q:"Sending bits one after another down a single channel is called ___ transmission.",a:["serial"]},
 {t:"blank",q:"Bits in parallel arriving out of step is called ___.",a:["skew"]}]);

P("a1-1-stored",`Stored-program concept | Instructions held in memory
von Neumann architecture | One memory, one set of buses
von Neumann bottleneck | Shared bus slows fetching
Instructions and data | Share main memory
Before stored programs | Rewire to change the task
ENIAC | Programmed by rewiring
Instruction format | Opcode + operand
Machine code | Binary instructions
Benefit of stored programs | Load any program
General-purpose computer | Runs any loaded program
Drawback of von Neumann | Shared bus bottleneck
Instructions are stored as | Binary in RAM
Data can overwrite | Instructions by mistake
Fetch, decode, execute | Repeated for each instruction
Same format in memory | Code and data look alike
Who executes instructions | The CPU
One instruction at a time | Sequential execution
Simple, cheap design | von Neumann benefit`);

P("a1-1-components",`CPU | Executes instructions
RAM | Volatile main memory
ROM | Holds the bootstrap
Cache | Fast copies of data
I/O controller | Links devices to buses
Address bus | One-way: CPU to memory
Data bus | Two-way: data and code
Control bus | Read, write, clock signals
8-bit address bus | 256 locations
16-bit address bus | 65,536 locations
n-bit address bus | 2ⁿ locations
Wider data bus | More bits per transfer
Wider address bus | More memory reachable
Memory write | A control signal
Interrupt request | Also on the control bus
Bootstrap | Start-up program
Volatile | Lost without power
Non-volatile | Kept without power`);

P("a1-1-cpu",`Control unit | Decodes, sends signals
ALU | Arithmetic and logic
PC | Next instruction's address
MAR | Address to read or write
MBR | Data just read
CIR | Instruction being decoded
ACC | ALU results
SP | Top of the stack
SR | Flags: zero, carry…
Clock | Keeps parts in step
General-purpose register | Holds working data
Zero flag | Last result was 0
Overflow flag | Result too big
Register | Tiny fast CPU store
Comparisons | Done by the ALU
MAR connects to | Address bus
MBR connects to | Data bus
Clock speed unit | Hertz (Hz)`);

P("a1-1-fde",`MAR ← [PC] | Copy PC into MAR
PC ← [PC] + 1 | Point to next instruction
MBR ← [Memory] | Read the addressed word
CIR ← [MBR] | Instruction to CIR
[CIR] | Decoded and executed
Fetch | Get the next instruction
Decode | CU interprets it
Execute | Carry it out
Memory read | Signal to fetch
Memory write | Signal to store
Jump instruction | Loads a new PC
Decoded by | The control unit
MAR holds | An address
Order of stages | Fetch, decode, execute
Arrow ← | Copy into
Square brackets | Contents of
Store ACC in memory | Uses memory write
Repeats until | The program halts`);

P("a1-1-hierarchy",`Registers | Fastest, smallest
L1 cache | Per core, smallest cache
L2 cache | Bigger, slower than L1
L3 cache | Shared by all cores
Main memory | RAM
Secondary storage | Largest, slowest, non-volatile
Cache hit | Data found in cache
Cache miss | Fetch from slower level
Locality of reference | Reuse of nearby data
Going down the hierarchy | Bigger, slower, cheaper
Going up the hierarchy | Faster, smaller, dearer
Why not all fast memory? | Cost per byte
SSD | Flash, no moving parts
Volatile levels | Registers, cache, RAM
Benefit of cache | CPU waits less
Drawback of more cache | Higher cost
Copied into cache | On a miss
Kept when power is off | Non-volatile`);

P("a1-1-transmission",`Serial | One bit at a time
Parallel | Many bits at once
Skew | Bits arrive out of step
Crosstalk | Interference between wires
Serial benefit | Long distances, cheap
Parallel benefit | Fast over short links
Parallel drawback | Skew over distance
Serial drawback | One bit per tick
USB, SATA, PCIe | Serial links
Internal bus | Short, wide, parallel
Wires in serial | One channel
Wires in parallel | One per bit
Bit rate | Bits per second
Long cable | Use serial
Inside the CPU | Registers and buses
Modern fast links | Mostly serial
Kept in step by | A clock signal
Fewer wires means | Less crosstalk`);
