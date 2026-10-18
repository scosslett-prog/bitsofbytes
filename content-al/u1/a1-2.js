/* 1.2 The operating system */
L("a1-2",[
{slug:"role",title:"The role of the operating system",covers:[1],
 v:[["Operating system (OS)","System software that manages the hardware and resources of a computer and provides a platform for applications to run on."],
  ["User interface","The part of the OS the user interacts with, such as a graphical user interface (GUI) or a command-line interface (CLI)."],
  ["User management","Controlling who can use the computer: user accounts, logins, passwords, access rights and separate user areas."],
  ["Peripheral management","Controlling devices such as printers, keyboards and drives, using device drivers and buffers."],
  ["Device driver","Software that lets the OS communicate with a particular piece of hardware."],
  ["Process management","Creating, scheduling and ending processes, and sharing the CPU between them."],
  ["Memory management","Deciding which programs and data are held in memory, where, and keeping processes from using each other's memory."],
  ["Kernel","The core of the OS that is always in memory and manages the CPU, memory and devices."]],
 q:[["Which is a job of the operating system?","Allocating memory to programs","Writing programs for users","Designing the CPU","Encrypting all files automatically"],
  ["What does a device driver do?","Lets the OS communicate with a piece of hardware","Speeds up the CPU","Stores user passwords","Schedules processes"],
  ["Which OS function stops one user opening another user's files?","User management","Peripheral management","Process management","Paging"],
  ["A command-line interface is an example of…","a user interface","a device driver","a scheduling algorithm","virtual memory"]],
 acts:[{id:"act1",title:"Activity 1",desc:"OS roles · 8 questions",gen:"bank",bank:"al-osrole",explain:"Match situations to the part of the operating system that deals with them. Every try picks a different set."}]},
{slug:"multitasking",title:"Multitasking and interrupts",covers:[2],
 v:[["Multitasking","Running several processes apparently at the same time on one CPU, by switching between them very quickly."],
  ["Time sharing","Giving each process a short slice of CPU time in turn, so they all seem to run at once."],
  ["Time slice","The short period of CPU time a process gets before the OS may switch to another (also called a quantum)."],
  ["Context switch","Saving the state (registers, PC) of the running process and loading the state of the next one."],
  ["Interrupt","A signal to the CPU that something needs attention, such as a key press, a timer or a hardware fault."],
  ["Interrupt service routine (ISR)","The code that deals with a particular interrupt (also called an interrupt handler)."],
  ["Interrupt priority","The level of urgency of an interrupt; a higher-priority interrupt can interrupt a lower-priority ISR."],
  ["Interrupt register","A register in which a bit is set when an interrupt is raised; the CPU checks it at the end of each fetch-decode-execute cycle."]],
 q:[["When does the CPU check for interrupts?","At the end of each fetch-decode-execute cycle","Only when the computer starts","Only when a program ends","In the middle of decoding"],
  ["What is saved during a context switch?","The contents of the registers, including the PC","The whole hard disk","The interrupt service routine","The clock speed"],
  ["Where is the CPU's state stored when an interrupt is serviced?","On the stack","In ROM","In the ALU","On the address bus"],
  ["Which gives the illusion that programs run at the same time on one core?","Time sharing","Paging","Segmentation","Encryption"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Interrupts · 8 questions",gen:"bank",bank:"al-interrupts",explain:"Questions on time sharing, context switching and how the CPU deals with interrupts. Every try picks a different set."}]},
{slug:"processes",title:"Processes and scheduling",covers:[3],
 v:[["Process","A program that is being executed, together with its current state and the resources it uses."],
  ["Process states","The stages a process moves between: new, ready, running, blocked (waiting) and terminated."],
  ["Scheduler","The part of the OS that decides which ready process gets the CPU next."],
  ["Burst time","How much CPU time a process needs to finish its current work."],
  ["Round robin (RR)","Each ready process gets the same time slice in turn; unfinished processes go to the back of the queue."],
  ["First-come, first-served (FCFS)","Processes run to completion in the order they arrive."],
  ["Shortest job first (SJF)","The ready process with the shortest burst time runs next."],
  ["Multi-level queue","Processes are put in separate queues by type or priority, each with its own scheduling algorithm."],
  ["Starvation","When a process never gets CPU time because others are always chosen first."]],
 q:[["A running process asks to read a file from disk. Which state does it move to?","Blocked","Ready","New","Terminated"],
  ["Which algorithm can cause starvation of long processes?","Shortest job first","Round robin","First-come, first-served","Time sharing"],
  ["Which algorithm gives every process a fixed time slice in turn?","Round robin","Shortest job first","First-come, first-served","Multi-level queue"],
  ["Burst times A=6, B=2, C=4 all arrive at 0. In what order does SJF run them?","B, C, A","A, B, C","A, C, B","C, B, A"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Scheduling · 8 questions",gen:"alsched",type:"mixed",explain:"Work out the order processes run and the average waiting time for first-come, first-served and shortest job first. Waiting time is how long a process waits before it starts. New processes every try."},
  {id:"act2",title:"Activity 2",desc:"Process states quiz · 8 questions",gen:"bank",bank:"al-processes",explain:"Questions on process states and scheduling algorithms. Every try picks a different set."}]},
{slug:"memory",title:"Memory management",covers:[4],
 v:[["Paging","Splitting memory into equal-sized blocks (pages); a program's pages don't have to be next to each other in memory."],
  ["Page table","A table that maps each page of a process to the frame of physical memory it is stored in."],
  ["Segmentation","Splitting a program into variable-sized logical blocks (segments), such as code, data and stack."],
  ["Virtual memory","Part of secondary storage used as if it were extra RAM, when main memory is full."],
  ["Swapping","Moving pages between RAM and virtual memory on secondary storage."],
  ["Disk thrashing","When the computer spends more time swapping pages than doing useful work, so it slows right down."],
  ["Stack frame","The block of stack memory used by one subroutine call: return address, parameters and local variables."],
  ["Memory protection","Stopping a process reading or writing memory that belongs to another process or the OS."]],
 q:[["What is the main difference between pages and segments?","Pages are a fixed size; segments vary in size","Segments are a fixed size; pages vary in size","Pages are only used for data","Segments are stored only on disk"],
  ["When is virtual memory used?","When RAM is full","When the CPU overheats","When the cache is empty","When the computer starts up"],
  ["What is disk thrashing?","Spending more time swapping pages than processing","A hard disk being defragmented","The CPU running too fast","Deleting files by mistake"],
  ["What is stored in a stack frame?","The return address, parameters and local variables","The page table","The interrupt register","The whole program"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Memory management · 8 questions",gen:"bank",bank:"al-memmgmt",explain:"Questions on paging, segmentation, virtual memory and stack frames. Every try picks a different set."}]}]);

B("al-osrole",[
 {t:"mc",q:"A new graphics card is fitted. What does the OS need to use it?",a:"A device driver",w:["A page table","A new kernel","A context switch"]},
 {t:"mc",q:"A printer is slow, so the OS stores the pages to be printed until it's ready. What is this store called?",a:"A buffer (print spool)",w:["Cache","A stack frame","A segment"]},
 {t:"mc",q:"Which OS function decides which program gets the CPU next?",a:"Process management",w:["User management","Peripheral management","The user interface"]},
 {t:"mc",q:"Which OS function stops a program writing over another program's memory?",a:"Memory management",w:["User management","Peripheral management","The device driver"]},
 {t:"mc",q:"A school sets up accounts so students can only see their own work. Which OS function is this?",a:"User management",w:["Memory management","Process management","Peripheral management"]},
 {t:"mc",q:"Which is an advantage of a GUI over a command-line interface?",a:"It's easier for beginners to learn",w:["It uses less memory","Commands can be scripted more easily","It is always faster for experts"]},
 {t:"mc",q:"Which is an advantage of a command-line interface?",a:"Tasks can be automated with scripts",w:["No commands need to be remembered","It shows pictures of files","It is easier for beginners"]},
 {t:"mc",q:"What is the kernel?",a:"The core of the OS, always in memory",w:["A type of cache","The user's home folder","An application"]},
 {t:"mc",q:"Why is an OS needed at all?",a:"It hides the hardware's complexity and shares resources between programs",w:["It makes the CPU faster","It writes programs automatically","It stores all files in RAM"]},
 {t:"mc",q:"Which of these is NOT a job of the OS?",a:"Checking the spelling in a document",w:["Allocating memory","Managing user accounts","Handling interrupts"]},
 {t:"blank",q:"Software that lets the OS control a specific piece of hardware is a device ___.",a:["driver"]},
 {t:"blank",q:"The OS gives each user an account protected by a username and ___.",a:["password","a password"]}]);

B("al-interrupts",[
 {t:"mc",q:"What happens first when the CPU accepts an interrupt?",a:"The contents of the registers are saved on the stack",w:["The program is terminated","The interrupt register is cleared of all bits","The PC is set to 0"]},
 {t:"mc",q:"After an interrupt service routine finishes, what happens?",a:"The saved registers are restored and the original program carries on",w:["The computer restarts","The program starts again from the beginning","The next program in the queue starts"]},
 {t:"mc",q:"An ISR is running and a lower-priority interrupt arrives. What happens?",a:"It waits until the current ISR finishes",w:["It interrupts the ISR straight away","It is ignored forever","The computer shuts down"]},
 {t:"mc",q:"Which of these would cause a hardware interrupt?",a:"A key being pressed",w:["A variable being incremented","A loop finishing","An IF statement"]},
 {t:"mc",q:"What kind of interrupt makes time sharing work?",a:"A timer interrupt",w:["A keyboard interrupt","A printer interrupt","A power failure interrupt"]},
 {t:"mc",q:"Why does a context switch take time away from useful work?",a:"Registers must be saved and loaded, which uses CPU cycles",w:["The cache has to be replaced","The hard disk must spin up","The program has to be recompiled"]},
 {t:"mc",q:"How does the OS know which ISR to run?",a:"It looks up the interrupt's type in a table of ISR addresses",w:["It runs every ISR in turn","The user chooses one","It always runs the same ISR"]},
 {t:"mc",q:"Which interrupt usually has the highest priority?",a:"Power failure",w:["Printer out of paper","Key press","Mouse movement"]},
 {t:"mc",q:"On a single-core CPU, how many processes actually run at any instant?",a:"One",w:["As many as are open","Two","It depends on the RAM"]},
 {t:"mc",q:"Why are interrupts checked at the end of a cycle, not in the middle?",a:"So the current instruction finishes and the CPU's state is consistent",w:["Because the clock stops","Because the bus is busy during fetch","They are checked in the middle"]},
 {t:"blank",q:"Saving the state of one process and loading the state of another is called a context ___.",a:["switch"]},
 {t:"blank",q:"The code that deals with an interrupt is the interrupt service ___.",a:["routine"]}]);

B("al-processes",[
 {t:"mc",q:"A new process has been loaded and is waiting for the CPU. Which state is it in?",a:"Ready",w:["Running","Blocked","Terminated"]},
 {t:"mc",q:"The disk read a blocked process was waiting for completes. Where does the process go?",a:"Ready",w:["Running","Terminated","New"]},
 {t:"mc",q:"Which change of state is not possible?",a:"Blocked → running",w:["Ready → running","Running → blocked","Running → ready"]},
 {t:"mc",q:"Which algorithm is fairest when lots of interactive users share a computer?",a:"Round robin",w:["Shortest job first","First-come, first-served","None of them"]},
 {t:"mc",q:"What is a drawback of first-come, first-served?",a:"Short jobs can wait a long time behind a long one",w:["Short jobs always starve","It needs to know every burst time","It switches context too often"]},
 {t:"mc",q:"What does shortest job first need to know in advance?",a:"Each process's burst time",w:["Each process's memory address","The user's priority","The number of interrupts"]},
 {t:"mc",q:"Round robin with a very short time slice. What is the drawback?",a:"Lots of time is lost to context switching",w:["Long processes never start","It behaves like shortest job first","Processes can't be blocked"]},
 {t:"mc",q:"A multi-level queue puts system processes in a high-priority queue. What could happen to low-priority processes?",a:"They could starve",w:["They run first","They are deleted","They get bigger time slices"]},
 {t:"mc",q:"Round robin, time slice 2. A needs 5, B needs 2. Both arrive at 0, A first. When does A finish?",a:"At time 7",w:["At time 5","At time 4","At time 9"]},
 {t:"mc",q:"FCFS: A (4) then B (3), both arrive at 0. What is B's waiting time?",a:"4",w:["0","3","7"]},
 {t:"blank",q:"A process waiting for input or output is in the ___ state.",a:["blocked","waiting"]},
 {t:"blank",q:"A process that never gets CPU time is suffering from ___.",a:["starvation"]}]);

B("al-memmgmt",[
 {t:"mc",q:"Why do programs need memory management at all?",a:"Several programs share RAM and must not overwrite each other",w:["RAM is non-volatile","The CPU can only run one program ever","Programs are stored in ROM"]},
 {t:"mc",q:"What does a page table store?",a:"Which memory frame each page is stored in",w:["The size of each segment","The order of processes","The interrupt priorities"]},
 {t:"mc",q:"Which is an advantage of paging?",a:"A program doesn't need one continuous block of memory",w:["Pages match the program's logical parts","No table is needed","It removes the need for RAM"]},
 {t:"mc",q:"Which is an advantage of segmentation?",a:"Segments match logical parts of a program, such as code and data",w:["All blocks are the same size","It never leaves gaps in memory","It needs no secondary storage"]},
 {t:"mc",q:"Why is virtual memory slower than RAM?",a:"Secondary storage is much slower to access",w:["It is stored in the cache","It uses the data bus twice","It's encrypted"]},
 {t:"mc",q:"Which would most reduce disk thrashing?",a:"Adding more RAM",w:["Adding a bigger hard disk","Using a faster printer","Increasing the time slice"]},
 {t:"mc",q:"Which pages are best to move to virtual memory?",a:"Ones that haven't been used recently",w:["The ones in use right now","The OS kernel","The page table"]},
 {t:"mc",q:"A subroutine is called. What is pushed onto the stack?",a:"A stack frame with the return address, parameters and local variables",w:["The whole program","The page table","The contents of the hard disk"]},
 {t:"mc",q:"A subroutine finishes. What happens to its stack frame?",a:"It is popped, and the return address tells the CPU where to carry on",w:["It's moved to virtual memory","It stays on the stack for ever","It's copied to ROM"]},
 {t:"mc",q:"A recursive function calls itself too many times. What can happen?",a:"Stack overflow",w:["Disk thrashing","Paging","Starvation"]},
 {t:"blank",q:"Fixed-size blocks of memory are called ___.",a:["pages"]},
 {t:"blank",q:"Variable-sized logical blocks of a program are called ___.",a:["segments"]}]);

P("a1-2-role",`Operating system | Manages hardware and resources
Kernel | Core of the OS, always in RAM
Device driver | Lets the OS talk to hardware
GUI | Windows, icons, menus, pointer
CLI | Typed commands
CLI benefit | Easy to script
GUI benefit | Easy for beginners
User management | Accounts and access rights
Login | Username and password
Peripheral management | Controls printers and drives
Buffer | Holds data for a slow device
Print spool | Queue of print jobs
Process management | Shares out the CPU
Memory management | Shares out RAM
Memory protection | No writing to others' memory
Utility software | Maintains the computer
Application software | Does the user's tasks
System software | Runs the computer itself`);

P("a1-2-multitasking",`Multitasking | Many processes, one CPU
Time sharing | Slices of CPU time in turn
Time slice | A quantum of CPU time
Context switch | Save one state, load another
Saved in a switch | Registers and PC
Interrupt | A signal needing attention
ISR | Interrupt service routine
Interrupt checked | End of each FDE cycle
CPU state saved | On the stack
Timer interrupt | Ends a time slice
Hardware interrupt | Key press, disk ready
Software interrupt | Divide by zero
Highest priority | Power failure
Lower priority arrives | Waits for current ISR
Interrupt register | Bit set per interrupt
Vector table | Addresses of each ISR
After the ISR | Restore and carry on
Cost of switching | CPU time lost`);

P("a1-2-processes",`Process | A program being executed
New | Just created
Ready | Waiting for the CPU
Running | Using the CPU now
Blocked | Waiting for I/O
Terminated | Finished
Scheduler | Picks the next process
Burst time | CPU time a process needs
Round robin | Equal slices in turn
FCFS | In order of arrival
SJF | Shortest burst first
Multi-level queue | Queues by priority
Starvation | Never gets the CPU
SJF risk | Long jobs starve
FCFS drawback | Short jobs stuck behind long
RR drawback | Many context switches
Waiting time | Time before starting
Best average wait | Shortest job first`);

P("a1-2-memory",`Paging | Fixed-size blocks
Segmentation | Variable-sized logical blocks
Page table | Maps pages to frames
Frame | A page-sized slot in RAM
Virtual memory | Disk used as extra RAM
Swapping | Moving pages to and from disk
Disk thrashing | Swapping more than working
Fix for thrashing | More RAM
Pages to swap out | Least recently used
Segment example | Code, data or stack
Paging benefit | No continuous block needed
Segment benefit | Matches program structure
Stack frame | One subroutine call's data
Return address | Where to carry on
Too many calls | Stack overflow
Memory protection | Keeps processes apart
Virtual memory drawback | Much slower than RAM
Memory manager | Tracks free and used memory`);
