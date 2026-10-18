/* ================= tarsia puzzle pairs, one set per lesson =================
   Each line is "one half | the other half". Halves are kept short so they fit along a triangle edge,
   and every half must have exactly one partner in its lesson. Challenge uses 18 pairs and Easy 9.
   A few number lessons make fresh pairs every time (TZGEN), mixed with some fixed pairs. */
const TZTXT={};
const TZGEN={};
const tzRand=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const tzB=(v,bits)=>{const s=(v>>>0).toString(2).padStart(bits,"0");return bits===8?s.slice(0,4)+" "+s.slice(4):s};
const tzHx=v=>v.toString(16).toUpperCase().padStart(2,"0");
/* fresh number pairs: make() returns [a,b] or null; texts are never repeated */
function tzUniq(make,count){const out=[],seen=new Set();let tries=0;
  while(out.length<count&&tries++<2000){const p=make();if(!p||seen.has(p[0])||seen.has(p[1]))continue;seen.add(p[0]);seen.add(p[1]);out.push(p)}return out}
function tzMix(lid,make,count){const num=tzUniq(make,count),seen=new Set(num.flat());
  const ok=shuffle(TZTXT[lid]||[]).filter(p=>!seen.has(p[0])&&!seen.has(p[1])),m=Math.min(ok.length,Math.round(count/3));
  return num.slice(0,count-m).concat(ok.slice(0,m))}
TZGEN["1-1-binary"]=n=>tzMix("1-1-binary",()=>{const v=tzRand(1,255);return [String(v),tzB(v,8)]},n);
TZGEN["1-1-hex"]=n=>tzMix("1-1-hex",()=>{const v=tzRand(10,255);return Math.random()<.5?[tzHx(v)+" (hex)",String(v)]:[tzHx(v),tzB(v,8)]},n);
TZGEN["1-1-addition"]=n=>tzMix("1-1-addition",()=>{const a=tzRand(1,15),b=tzRand(1,15);return [tzB(a,4)+" + "+tzB(b,4),tzB(a+b,a+b>15?5:4)]},n);
TZGEN["1-1-shifts"]=n=>tzMix("1-1-shifts",()=>{const v=tzRand(1,255),k=tzRand(1,3),l=Math.random()<.5;return [tzB(v,8)+(l?" left ":" right ")+k,tzB(l?(v<<k)&255:v>>k,8)]},n);
TZGEN["8-1-sequence"]=n=>tzMix("8-1-sequence",()=>{const a=tzRand(7,60),b=tzRand(2,9);return Math.random()<.5?[a+" DIV "+b,String(Math.floor(a/b))]:[a+" MOD "+b,String(a%b)]},n);
TZGEN["1-1-negative"]=n=>tzMix("1-1-negative",()=>{const v=tzRand(-128,-1);return ["−"+(-v),tzB(v&255,8)]},n);

const TZRAW={
"1-1-binary":`Binary | Base 2: only 0 and 1
Denary | Base 10: digits 0 to 9
Bit | A single 1 or 0
Byte | A group of 8 bits
Transistor | Tiny switch: on or off
Biggest 8-bit number | 255
Place values in binary | 1, 2, 4, 8, 16…`,
"1-1-hex":`Hexadecimal | Base 16
Nibble | 4 bits: one hex digit
A to F | Denary 10 to 15
Hex place values | 1, 16, 256, 4096
F (hex) | 1111 in binary
FF (hex) | 255 in denary`,
"1-1-hexuses":`HTML colour code | # then 6 hex digits
#FF0000 | Pure red
#00FF00 | Pure green
#0000FF | Pure blue
#FFFFFF | White
#000000 | Black
RGB | Red, green and blue light
Bits per RGB colour | 8 (24 in total)
MAC address | 48 bits, 6 pairs of hex
IPv6 address | 128 bits, 8 hex groups
Memory dump | Copy of RAM to find a crash
Error code | Short hex code for a fault
Why use hex? | Shorter than binary
Hex vs binary errors | Fewer mistakes when read
One hex digit | One nibble
Two hex digits | One byte
Computers store hex as | Binary
Hex is easier for | Humans to read`,
"1-1-addition":`Carry | A 1 moved to the next column
1 + 1 | 0 carry 1
1 + 1 + 1 | 1 carry 1
Overflow error | Result too big for register
Largest 8-bit result | 255
Most significant bit | Leftmost bit
Least significant bit | Rightmost bit
Addition starts at the | LSB
Register | Small fixed-size CPU store`,
"1-1-shifts":`Logical shift | Gaps filled with 0s
Left shift 1 place | Multiply by 2
Left shift 2 places | Multiply by 4
Right shift 1 place | Divide by 2
Right shift 3 places | Divide by 8
Lost first in a left shift | The MSB
Lost first in a right shift | The LSB
Loss of precision | A 1 falls off the end`,
"1-1-negative":`Two's complement | Flip the bits, add 1
Sign bit | Leftmost bit: 1 is negative
8-bit two's complement range | −128 to 127
Most negative 8-bit value | 1000 0000
−1 in 8 bits | 1111 1111
Sign and magnitude | MSB is just a sign
Positive numbers | Start with a 0`,
"1-2-charsets":`Character set | All characters + codes
ASCII | 7 or 8 bits per character
Extended ASCII | 256 characters
7-bit ASCII | 128 characters
Unicode | Up to 32 bits per character
Unicode can store | Emojis and all languages
Character code | Number for a character
UTF-8 | 8 to 32 bits per character
'A' in ASCII | 65
'a' in ASCII | 97
One extended ASCII character | 1 byte
Why Unicode? | Many more characters
Drawback of Unicode | Bigger file sizes
Codes for A, B, C | Run in order
Text file size | Characters × bits each
Same code everywhere | Text can be shared
'0' in ASCII | 48
Space in ASCII | 32`,
"1-2-sound":`Analogue | Continuous signal
Digital | Separate, discrete values
Sampling | Measuring amplitude regularly
Amplitude | Height of the wave
Sample rate | Samples per second
Sample rate unit | Hertz (Hz)
Sample resolution | Bits per sample
ADC | Analogue to digital converter
Higher sample rate | Closer to the real wave
Higher sample resolution | More accurate amplitude
Cost of better quality | Larger file size
CD-quality sample rate | 44 100 Hz
Lower sample rate | Smaller file, worse sound
Microphone captures | Analogue sound
Speaker needs | Analogue signal again
DAC | Digital to analogue converter
16-bit sample resolution | 65 536 levels
Sound file size | Rate × resolution × time`,
"1-2-images":`Bitmap | Grid of pixels
Pixel | Smallest part of an image
Colour depth | Bits per pixel
Resolution | Number of pixels
1 bit colour depth | 2 colours
2 bit colour depth | 4 colours
8 bit colour depth | 256 colours
24 bit colour depth | About 16.7 million colours
Higher resolution | More detail, bigger file
Higher colour depth | More colours, bigger file
Image size in bits | Width × height × depth
1920 × 1080 | A resolution
Pixelated | Blocky: too few pixels
Each pixel stores | A binary colour code
Metadata | Data about the file
Width and height | Stored in metadata
Black and white image | 1 bit per pixel
3 bit colour depth | 8 colours`,
"1-3-measurement":`Bit | A single 1 or 0
Nibble | 4 bits
Byte | 8 bits
Kibibyte (KiB) | 1024 bytes
Mebibyte (MiB) | 1024 KiB
Gibibyte (GiB) | 1024 MiB
Tebibyte (TiB) | 1024 GiB
Pebibyte (PiB) | 1024 TiB
Exbibyte (EiB) | 1024 PiB
2¹⁰ bytes | 1 kibibyte
2²⁰ bytes | 1 mebibyte
2³⁰ bytes | 1 gibibyte
16 bits | 2 bytes
4096 bytes | 4 KiB
2048 KiB | 2 MiB
32 bits | 4 bytes
3 GiB | 3072 MiB
Bytes → KiB | Divide by 1024`,
"1-3-filesize":`Image file size | W × H × colour depth
Sound file size | Rate × resolution × secs
Bits to bytes | Divide by 8
Bytes to KiB | Divide by 1024
MiB to KiB | Multiply by 1024
Metadata | Makes real files bigger
100 × 100 px, 8-bit | 10 000 bytes
10 × 10 px, 1-bit | 100 bits
8 × 8 px, 2-bit | 16 bytes
1 s at 1000 Hz, 8-bit | 1000 bytes
2 s at 100 Hz, 16-bit | 400 bytes
4 × 4 px, 8-bit | 128 bits
16 × 16 px, 4-bit | 128 bytes
8192 bits | 1 KiB
1 048 576 bytes | 1 MiB
Colour depth | Bits per pixel
Sample resolution | Bits per sample
Sample rate | Samples per second`,
"1-3-compression":`Compression | Makes a file smaller
Lossy | Data removed for good
Lossless | Original rebuilt exactly
RLE | Run length encoding
RLE stores | Count then value
AAAABB in RLE | 4A 2B
Lossy example | JPEG photo
Lossless example | Text file or code
Motion estimation | Stores movement only
Perceptual music shaping | Removes sounds we can't hear
Why compress? | Less storage and bandwidth
Bandwidth | Data sent per second
Faster transfer | Smaller file to send
Use lossless for | Programs and documents
Use lossy for | Music, photos, video
Lower resolution | A lossy method
Fewer colours | Also lossy
RLE works best with | Long runs of repeats`,
"2-1-transmission":`Serial | One bit at a time
Parallel | Several bits at once
Simplex | One direction only
Half-duplex | Both ways, one at a time
Full-duplex | Both ways at once
Skew | Bits arrive out of step
Crosstalk | Interference between wires
Serial is better for | Long distances
Parallel is better for | Short, fast links
Bandwidth | Data per second
Example of simplex | Computer to printer
Example of half-duplex | Walkie-talkie
Example of full-duplex | Phone call
USB uses | Serial transmission
Wires in serial | Just one
Data transmission | Moving data between points
Parallel inside a computer | Data bus
Serial benefit | Cheaper cabling`,
"2-1-packets":`Packet | Small chunk of a file
Packet header | Addresses and packet number
Payload | The actual data
Trailer | Marks the packet's end
Packet number | Puts packets back in order
Destination address | Where the packet is going
Originator's address | Where it came from
Hop count | Max routers to pass
Packet switching | Packets take own routes
Router | Picks each packet's route
Protocol | Rules for sending data
Packets arrive | Possibly out of order
Lost packet | Requested again
Why split into packets? | Routes around congestion
Hop count reaches 0 | Packet is deleted
Header, payload, trailer | Parts of a packet
Small packets | Easier to resend
Reassembled at | The destination`,
"2-1-usb":`USB | Universal Serial Bus
USB transmission | Serial
Plug and play | Works when plugged in
Device driver | Lets OS talk to device
Backwards compatible | Works with older devices
Hub | Adds extra USB ports
Peripheral | Mouse, printer, keyboard
USB connector | Only fits one way
USB benefit | Supplies power too
USB drawback | Limited cable length
Driver installed | Automatically
USB is an | Industry standard
USB 3 in a USB 2 port | Still works, slower
USB-C | Reversible connector
Detected by computer | When plugged in
Charging phones | USB power
USB stick | Plugs into a USB port
Data and power | One USB cable`,
"2-2-parity":`Transmission error | Data changed in transit
Interference | Signals disturb the data
Data collision | Two devices send at once
Flipped bit | 1 became 0, or 0 became 1
Parity bit | Makes 1s odd or even
Odd parity | Odd number of 1s
Even parity | Even number of 1s
Parity check | Count the 1s
Parity block | Parity for rows and columns
Parity block finds | Which bit flipped
Two bits flipped | Parity may miss it
1011 0110, even parity | Parity bit 1
Parity check fails | Error detected
Parity checks are | Error detection
Parity byte | Column parity bits
Error found | Data is resent
Where parity bit goes | Usually the MSB
Agreed in advance | Odd or even parity`,
"2-2-checksums":`Checksum | Value calculated from data
Checksum sent | With the data
Receiver recalculates | Its own checksum
Checksums match | No error found
Checksums differ | Data is resent
Checksum algorithm | Steps to make a checksum
Both sides must use | The same algorithm
Hash | Code made by the algorithm
MD5 and SHA-1 | Checksum algorithms
Corrupted | Changed by an error
Download check | Compare checksums
Checksum covers | A whole block of data
Checksum weakness | Can miss some errors
Checksum strength | Finds most changes
Checksum calculated by | The sender first
Sent after the data | The checksum value
Checksum is not | Encryption
Changed file | New checksum`,
"2-2-echo":`Echo check | Receiver sends data back
Original data | Sender's own copy
Returned data | The echo
Echo matches | No error found
Echo differs | Data is resent
Retransmission | Sending data again
Echo check drawback | Data travels twice
Error on the way back | Looks like an error too
Echo compares | Whole data, not a value
Who compares? | The sender
Slows the network | Double the traffic
Can't tell | Which way it failed
Echo check is | Slow but simple
Echo check detects | Errors, not fixes
Echo is sent by | The receiver
Compared by the sender | Original vs echo
Errors in both directions | Can cancel out
Echo check vs parity | Checks all the data`,
"2-2-checkdigits":`Check digit | Calculated from other digits
Where it goes | At the end of the number
Data entry error | Mistake typing a number
Transposition error | Two digits swapped
Modulo 10 | Barcode check digit method
Barcode weights | 1 and 3 alternately
ISBN | Book number with check digit
Check digit catches | Typing mistakes
Barcode | Bars that store a number
Remainder 0 | Check digit 0
Remainder 7 (mod 10) | Check digit 3
Remainder 2 (mod 10) | Check digit 8
Weight | What each digit is × by
Recalculated by | The receiving computer
Check digit is not | Encryption
Detects | Data entry errors
Checked when | The number is entered
Check digit recalculated | Matches if correct`,
"2-2-arq":`ARQ | Automatic repeat request
Acknowledgement | Receiver's reply
Positive acknowledgement | Arrived OK
Negative acknowledgement | Arrived with an error
Timeout | Time to wait for a reply
No reply before timeout | Data is resent
ARQ uses | Acks and a timeout
After a negative ack | Send again
ARQ combines with | An error check
Repeats until | Positive ack received
Sender starts | A timer
Retransmission | Sending data again
Positive ack lost | Data sent again
Duplicate data | Receiver discards it
ARQ is | Error detection + resend
Timeout too short | Needless resends
ARQ needs | A timer and acks
Acks travel from | Receiver to sender`,
"2-3-encryption":`Interception | Data captured in transit
Encryption | Scrambling data
Plaintext | Before encryption
Ciphertext | After encryption
Key | Used to encrypt or decrypt
Encryption algorithm | Steps to scramble data
Decryption | Ciphertext to plaintext
Symmetric encryption | Same key both ways
Symmetric is also | Private key encryption
Caesar cipher | Shift each letter
HELLO with key 1 | IFMMP
CAT with key 3 | FDW
Symmetric problem | Sharing the key safely
Encryption doesn't | Stop interception
Intercepted ciphertext | Can't be understood
Longer key | Harder to crack
ABC with key 2 | CDE
Shift back by the key | Decrypt a Caesar cipher`,
"2-3-asymmetric":`Asymmetric encryption | Two different keys
Public key | Encrypts the data
Private key | Decrypts the data
Public key is | Shared with anyone
Private key is | Kept secret
Key pair | Public and private keys
Who makes the key pair? | The receiver
Sender encrypts with | Receiver's public key
Receiver decrypts with | Their private key
Asymmetric is also | Public key encryption
Benefit | Private key is never sent
Intercepted public key | Can't decrypt
Decryption | Back to plaintext
Plaintext | The readable message
Ciphertext | The scrambled message
Two keys | Asymmetric
One key | Symmetric
Public key can't | Decrypt the data`,
"2-3-cracking":`Cryptanalysis | Decoding without the key
Brute force attack | Try every possible key
Key length | Bits in the key
8-bit key | 256 possible keys
10-bit key | 1024 possible keys
n-bit key | 2ⁿ possible keys
Adding 1 bit to a key | Doubles the keys
Frequency analysis | Count letter use
Most common English letter | E
Non brute force | Cleverer than guessing
Caesar cipher keys | Only 25 useful
Defence against brute force | Longer keys
Weakness of Caesar | Letter patterns stay
Ciphertext only | Attacker's starting point
4-bit key | 16 possible keys
Time to brute force | Grows with key length
Guessing a password | Brute force
Letter E in a Caesar text | Clue to the shift`,
"3-1-vonneumann":`Von Neumann | Data and instructions together
Stored program concept | Program kept in memory
FDE cycle | Fetch, decode, execute
Fetch | Copy instruction from RAM
Decode | CU works out the instruction
Execute | Carry out the instruction
RAM | Holds programs in use
PC → MAR | First step of fetch
MAR | Address to read or write
MDR | Data read from memory
CIR | Instruction being decoded
PC increments | Points to next instruction
Address bus carries | MAR's address to RAM
Data bus carries | Instruction to the MDR
Control unit | Decodes and coordinates
ALU | Does the calculations
Accumulator | Holds ALU results
Repeats | Until the program ends`,
"3-1-cpu":`CPU | Processes instructions
Microprocessor | CPU on a single chip
Control unit | Decodes, sends signals
ALU | Calculations and logic
Register | Tiny, fast CPU memory
Program counter | Next instruction's address
MAR | Address to read from
MDR | Data fetched from memory
CIR | Current instruction
Accumulator | Result of calculations
Comparing two numbers | Done by the ALU
Control signals | Sent by the CU
Holds an address | MAR or PC
Holds data | MDR or ACC
Fastest storage | Registers
CPU stands for | Central processing unit
ALU stands for | Arithmetic logic unit
CIR stands for | Current instruction reg.`,
"3-1-buses":`Bus | Parallel wires between parts
Address bus | Carries memory addresses
Data bus | Carries data and instructions
Control bus | Read, write, timing signals
Unidirectional | One direction only
Bidirectional | Both directions
Address bus direction | CPU to memory only
Data bus direction | Both ways
Control bus direction | Two-way as well
Wider address bus | More memory addresses
Wider data bus | More bits at once
16-bit address bus | 65 536 addresses
Bus width | Number of wires
Buses connect | CPU, memory, I/O
32-bit data bus | 32 bits at once
Address bus width | Sets max memory
Wires in a bus | Run in parallel
Bus speed | Affects performance`,
"3-1-cores":`Core | Independent processing unit
Multi-core | More than one core
Dual-core | Two cores
Quad-core | Four cores
Clock | Sends regular pulses
Clock speed | Cycles per second
Hertz | One cycle per second
Gigahertz | 1 billion cycles a second
3.2 GHz | 3.2 billion cycles a second
Higher clock speed | More instructions per second
Overclocking | Running above rated speed
Overclocking risk | Overheating
More cores helps | Running many tasks
Not all programs | Can use many cores
Each core can | Fetch, decode, execute
Cores share | L3 cache
Doubling cores | Not always twice as fast
Performance factors | Cores, cache, clock`,
"3-1-cache":`Cache | Tiny fast memory in CPU
Cache stores | Frequently used data
L1 cache | Fastest, smallest
L2 cache | Larger, slower than L1
L3 cache | Largest, shared by cores
Cache hit | Data found in cache
Cache miss | Fetch from RAM instead
Bottleneck | Slow part holds back fast
More cache | Fewer trips to RAM
Cache vs RAM | Cache is faster
Cache is | Volatile
Cache cost | Expensive per byte
Each core has its own | L1 and L2 cache
Checked first | The fastest cache level
Cache speeds up | The fetch stage
Cache is built | Inside the CPU
Cache size | Kilobytes to megabytes
Cache needs | Fewer RAM accesses`,
"3-1-instructions":`Instruction set | All commands a CPU knows
Opcode | Which operation to do
Operand | Value or its address
Machine code | Binary the CPU runs
Hard-wired | Built into circuits
ADD | An opcode
Instruction sets differ | Between CPU types
Opcode + operand | One instruction
Operand can be | A memory address
CPU executes | Machine code directly
Instruction set is | Fixed in the CPU
Example opcodes | LOAD, ADD, STORE
Different CPU families | Different instruction sets
Programs must be | Translated to machine code
LOAD | Copies a value in
STORE | Saves a value to memory
Instruction stored in | RAM before fetch
Decoded by | The control unit`,
"3-1-embedded":`Embedded system | Computer inside a device
Dedicated function | One specific job
General purpose computer | Many different jobs
Microcontroller | Processor + memory chip
Firmware | Program stored in ROM
Actuator | Output that moves things
Washing machine | Runs wash programs
Laptop | General purpose
Embedded benefit | Small and cheap
Embedded power use | Low
Embedded drawback | Hard to upgrade
Central heating | Embedded control
Sensor in embedded system | Gives readings
Firmware stored in | ROM or flash
Traffic lights | Timed light sequence
Microwave oven | Timer and power control
Smart thermostat | Controls heating
Embedded in a car | Engine management`,
"3-2-input":`Input device | Sends data in
Barcode scanner | Reads reflected light
QR code | 2D squares, lots of data
Optical mouse | LED and tiny camera
Resistive touch screen | Two layers pressed
Capacitive touch screen | Finger changes charge
Infra-red touch screen | Breaks a beam grid
3D scanner | Builds a digital 3D model
Braille keyboard | Raised dots on keys
Keyboard | Keys complete a circuit
Microphone | Sound to signal
Digital camera | Light onto a sensor
Works with gloves | Resistive screen
Needs bare finger | Capacitive screen
QR stores more than | A barcode
Webcam | Video input
Scans a whole page | 2D scanner
Trackpad | Capacitive input`,
"3-2-output":`Output device | Data out to the user
Actuator | Signal into movement
Inkjet printer | Droplets of liquid ink
Laser printer | Drum, toner and heat
3D printer | Builds layer by layer
DLP projector | Millions of tiny mirrors
LCD projector | Light through crystals
LCD screen | Backlight + liquid crystals
LED screen | Each pixel makes light
Speaker | Signal into sound
Toner | Powder used by lasers
Speaker cone | Vibrates to make sound
Projector | Large image on a wall
Touch screen | Both input and output
Liquid crystals | Twist to block light
Headphones | Personal sound output
Monitor | Visual output
LED backlight | Thinner LCD screens`,
"3-2-sensors":`Sensor | Measures a physical quantity
Sensors capture | Analogue data
ADC | Analogue to digital
Monitoring system | Keeps track only
Control system | Makes something happen
Humidity sensor | Water vapour in air
Moisture sensor | Water in soil
Accelerometer | Movement and tilt
Temperature sensor | Heat in a greenhouse
Light sensor | Street lamps at dusk
Infra-red sensor | Detects body heat
Pressure sensor | Force or weight
Gas sensor | Carbon monoxide alarm
pH sensor | Acid in a fish tank
Acoustic sensor | Detects sound
Proximity sensor | Parking sensors
Magnetic field sensor | Phone compass
Level sensor | Liquid in a tank`,
"3-3-primary":`Primary storage | Accessed directly by CPU
RAM | Programs and data in use
ROM | Start-up instructions
Volatile | Loses data without power
Non-volatile | Keeps data without power
Registers and cache | Faster than RAM
Flash BIOS | Can be updated
BIOS | Basic input output system
Bootloader | Loads the OS at start
RAM can be | Read and written
ROM can only be | Read in normal use
Virtual memory | Storage used as RAM
Virtual memory used when | RAM is full
Pages | Blocks moved to and from RAM
Too much virtual memory | Slow: disk thrashing
More RAM | Less virtual memory
RAM stands for | Random access memory
ROM stands for | Read only memory`,
"3-3-secondary":`Secondary storage | Long-term, non-volatile
Magnetic storage | Magnetised areas
HDD | Hard disk drive
Platter | Spinning magnetic disk
Read/write head | Electromagnet on an arm
Track | Ring round a platter
Sector | Wedge of a platter
Latency | Waiting for the disk to spin
SSD | No moving parts
Solid-state storage | Uses flash memory
Floating gate | Traps electrons
NAND and NOR | Types of flash memory
SSD benefit | Faster access
SSD benefit 2 | Less power, no noise
HDD benefit | Cheaper per GB
Damaged by knocks | Spinning hard disks
Fragmentation slows | An HDD
SSD access time | Near-instant`,
"3-3-offline":`Off-line storage | Not always connected
Optical storage | Read with lasers
Pit | Dip burned into the disc
Land | Flat area on the disc
Spiral track | One track from the centre
CD, DVD, Blu-ray | Optical discs
Blu-ray laser | Blue-violet light
Largest optical disc | Blu-ray
Magnetic tape | Huge capacity reel
Serial access | Search from the start
Tape is used for | Backups and archives
USB flash drive | Portable solid state
Scratches | Damage optical discs
Direct access | Jump straight to data
Optical read | Reflection of a laser
Flash drive | No moving parts
Tape cartridge | Data stored on a reel
Off-line example | External backup drive`,
"3-3-cloud":`Cloud storage | Files on remote servers
Local storage | Your own device
Data centre | Building full of servers
Redundancy | Copies in several places
Scalability | Easy to add more space
Synchronisation | Files updated everywhere
Uptime | Time a system works
Cloud needs | An internet connection
Cloud benefit | Access from anywhere
Cloud drawback | Third party holds data
Cloud cost | Ongoing subscription
Local benefit | No internet needed
Local drawback | Can be lost or stolen
Backups in the cloud | Off-site copies
Shared editing | Cloud collaboration
Physical servers | Still used by the cloud
Cloud provider | Runs the data centre
Cloud security | Depends on the provider`,
"3-4-nicmac":`NIC | Network interface card
WNIC | Wireless NIC
WNIC connects using | Radio waves (Wi-Fi)
MAC address | Unique ID for a NIC
MAC address given | When the NIC is made
MAC address length | 48 bits
MAC address written as | 12 hex digits
First half of a MAC | Manufacturer code
Second half of a MAC | Serial code
MAC addresses | Don't usually change
Every device needs | A NIC to join a network
Written in hex | MAC and IPv6
00:1A:2B:3C:4D:5E | A MAC address
MAC stands for | Media access control
Physical address | Another name for a MAC
Same MAC on two devices | Should never happen
NIC built into | The motherboard
Changing a MAC | MAC spoofing`,
"3-4-iprouter":`IP address | Given by the network
Static IP | Never changes
Dynamic IP | Can change each time
IPv4 | 32 bits, 4 denary numbers
IPv6 | 128 bits, hex groups
192.168.1.24 | An IPv4 address
IPv4 numbers range | 0 to 255
Why IPv6? | IPv4 is running out
Router | Links a LAN to the internet
Router assigns | IP addresses
Web servers use | Static IP addresses
Home devices usually get | Dynamic IP addresses
IP address can | Change
MAC address | Stays the same
Router sends data to | Its destination
Groups in IPv6 | 8
Numbers in IPv4 | 4
IP stands for | Internet protocol`,
"4-1-software":`Hardware | Physical parts
Software | Programs that run
System software | Runs the computer
Application software | Does the user's tasks
Operating system | Manages the hardware
Utility software | Maintains the computer
Firmware | Software in ROM
Bootloader | Loads the OS
Word processor | Writing documents
Anti-virus | Finds and removes malware
Defragmenter | Joins up file fragments
Web browser | Displays web pages
Compression tool | Shrinks files
OS runs on | The hardware
Apps run on | The operating system
Firmware runs | Straight on hardware
Backup software | Copies files to restore
Spreadsheet | Calculations in a grid`,
"4-1-os":`Operating system | Manages hardware
User interface | How users control it
GUI | Graphical user interface
WIMP | Windows icons menus pointers
CLI | Command line interface
CLI commands | Typed in as text
Menu-driven | Choose from options
ATM | Uses a menu-driven UI
Voice interface | Control by speaking
GUI benefit | Easy for beginners
CLI benefit | Fast for experts
CLI drawback | Commands must be learnt
GUI drawback | Uses more memory
Smart speaker | Spoken commands
Touch screen apps | Icons you tap
Windows, macOS | Operating systems
Android, iOS | Mobile operating systems
OS provides | The user interface`,
};
const TZRAW2={};
Object.assign(TZRAW2,{
"4-1-osjobs":`Memory management | Decides where data goes in RAM
Stops programs | Overwriting each other
Virtual memory | Storage used as extra RAM
Multitasking | Many programs at once
Time slice | Short turn on the CPU
Peripheral | Printer or other device
Device driver | Lets OS talk to hardware
Print buffer | Queue of documents to print
File management | Save, open, rename, delete
Folders | Organise files
Access rights | Who can see or change files
User accounts | Separate logins
Security | Passwords and firewalls
Interrupt handling | Responds to events
Platform for apps | Provided by the OS
Manages the CPU | Schedules processes
Error messages | OS tells the user
Utilities | Some come with the OS`,
"4-1-interrupts":`Interrupt | Signal asking for attention
ISR | Interrupt service routine
Hardware interrupt | From a physical device
Software interrupt | From a program or the OS
Save state | Store the registers
Program counter saved | So it can resume
Priority | How urgent it is
Interrupt queue | Priority, then FIFO
FIFO | First in, first out
Checked for interrupts | End of each FDE cycle
Lower priority interrupt | Waits its turn
Polling | CPU keeps checking devices
Polling drawback | Wastes processing time
After the ISR | Restore saved state
Mouse click | Generates an interrupt
ISR runs | After saving state
Priority check | Is it more urgent?
Error in a program | Can cause an interrupt`,
"4-2-levels":`High-level language | Close to human language
Low-level language | Close to what CPU runs
Python and Java | High-level languages
Assembly language | Uses mnemonics
Machine code | Binary CPU instructions
Machine independent | Runs on many CPUs
High-level benefit | Easy to read and debug
Low-level benefit | Direct hardware control
Low-level benefit 2 | Fast, small programs
High-level drawback | Must be translated
Low-level drawback | Hard to write
Instruction set | All a CPU's instructions
Opcode | What to do
Operand | What to do it to
Device drivers | Often low-level code
Machine code needs | No translation
Translator needed for | High-level code
Low-level code is | Machine dependent`,
"4-2-assembly":`Assembly language | Uses mnemonics
Mnemonic | Short code like LDA
Assembler | Assembly to machine code
LDA | Load into accumulator
ADD | Add to accumulator
STO | Store accumulator
Machine dependent | One type of CPU only
One assembly instruction | One machine code instruction
Assembly used for | Device drivers
Assembly benefit | Precise hardware control
Assembly drawback | Hard to learn
Assembly is | Low-level
Assembler is a | Translator
Easier to remember | Mnemonics than binary
Assembly vs machine code | Same instructions, as words
Translated by | An assembler
Embedded systems | Often use assembly
Mnemonic stands for | An opcode`,
"4-2-translators":`Translator | Converts code to machine code
Compiler | Translates all at once
Interpreter | Line by line
Executable file | Compiled program
Object code | Machine code output
Error report | All errors at the end
Interpreter stops | At the first error
Compiled program runs | Without the compiler
Interpreted program needs | The interpreter each time
Compiler benefit | Fast to run
Compiler benefit 2 | Code kept hidden
Interpreter benefit | Easy to debug
Interpreter drawback | Slower to run
Compiler drawback | Errors shown at end
Use while writing code | Line-by-line testing
Use to distribute | Compiled executable
Assembler | Translates assembly
Source code | What the programmer writes`,
"4-2-ides":`IDE | Integrated dev. environment
Code editor | Where code is written
Line numbers | Help find errors
Syntax highlighting | Keywords in colour
Run-time environment | Runs code inside the IDE
Error diagnostics | Highlights errors
Auto-completion | Suggests keywords
Auto-correction | Fixes misspellings
Prettyprint | Neat indentation and colour
Breakpoint | Pauses the program
Stepping | Runs one line at a time
Variable watch | Shows values while running
Translator in an IDE | Compiler or interpreter
Debugger | Helps find logic errors
IDE benefit | All tools in one place
Shows the line | Of an error
Formats code | Prettyprint does this
Check variables | At a breakpoint`,
"5-1-web":`Internet | Network of networks
World wide web | Websites and web pages
ISP | Internet service provider
Web browser | Displays web pages
URL | Address of a web page
Domain name | Web server's name
HTTP | Rules for sending pages
HTTPS | HTTP with encryption
Padlock icon | HTTPS in use
https:// | Protocol part of a URL
www.example.com | Domain name part
/index.html | File name part
Browser stores | Bookmarks and history
Browser feature | Tabs
Browser renders | HTML
Web is accessed using | The internet
Internet is | The infrastructure
Browser check | Address bar`,
"5-1-ip":`IP address | Identifies a device
IPv4 | 32 bits
IPv6 | 128 bits
IPv4 format | 4 numbers, 0 to 255
IPv6 format | 8 groups of hex
IPv4 separator | Full stop
IPv6 separator | Colon
Static IP | Permanent
Dynamic IP | Changes each connection
Public IP address | Reachable on the internet
Private IP address | Only in a local network
Why IPv6? | More addresses
Web server | Needs a static IP
192.168.0.10 | A private IPv4 address
Router gives devices | Dynamic IP addresses
Numbers in an IPv4 address | 4
Groups in an IPv6 address | 8
2001:db8::1 | An IPv6 address`,
"5-1-pages":`Web server | Stores and sends pages
DNS | Domain name server
DNS converts | Domain name to IP
First step | Look up the domain name
DNS replies with | The IP address
Browser then requests | Page from web server
Web server sends | HTML files
HTML | Code for web pages
Render | Turn HTML into a page
DNS can't find it | Asks another DNS
Page shown | In the browser
IP address | Locates the server
URL typed | Into the browser
HTML file contains | Tags and content
Images and styles | Also requested
Domain name | Easy for people to remember
IP address is | Used by computers
Page error | 404 not found`,
"5-1-cookies":`Cookie | Small text file
Cookies are stored | By the browser
Session cookie | Deleted when browser closes
Persistent cookie | Has an expiry date
Session cookie stored | In memory (RAM)
Persistent cookie stored | On secondary storage
Tracking cookie | Follows you across sites
Targeted adverts | Tracking cookies
Language setting | Persistent cookie use
Cookie benefit | Site remembers you
Cookie concern | Privacy
Cookie law | Must ask permission
Expiry date | When a cookie is deleted
Cookies sent by | The website
Personalisation | Cookies remember preferences
Clearing cookies | Logs you out of sites
Cookie holds | User ID or settings
Third-party cookie | From another site`,
"5-2-crypto":`Digital currency | Money only in electronic form
Cryptocurrency | Decentralised digital currency
Blockchain | Ledger that can't be altered
Digital ledger | Record of all transactions
Block | Group of transactions
Each block stores | Hash of previous block
Hash | Value from a block's contents
Change a block | Its hash changes
Distributed ledger | Copied across many nodes
Node | A computer in the network
Timestamp | When the block was made
Private key | Authorises payments
Digital wallet | Holds your keys
Decentralised | No bank in control
Blockchain benefit | Hard to tamper with
Cryptocurrency drawback | Value can swing wildly
Bitcoin | A cryptocurrency
Tampering spotted | Hashes stop matching`,
"5-3-threats":`Brute-force attack | Try every password
Data interception | Stealing data in transit
Packet sniffing | Intercepting packets
DDoS attack | Botnet floods a server
Botnet | Network of infected PCs
Hacking | Unauthorised access
Virus | Hides in files you open
Worm | Spreads on its own
Trojan horse | Disguised as genuine software
Spyware | Secretly monitors you
Keylogger | Records key presses
Adware | Unwanted adverts
Ransomware | Encrypts files for payment
Phishing | Fake email, fake website
Pharming | Redirects to a fake site
Social engineering | Tricking people
Malware | Harmful software
Shoulder surfing | Watching someone type`,
"5-3-solutions":`Authentication | Proving who you are
Biometrics | Fingerprint or face
Two-step verification | Password plus a code
Anti-malware | Scans and removes malware
Quarantine | Isolates infected files
Firewall | Filters network traffic
Proxy server | Hides your IP address
SSL | Encrypts browser to server
Access levels | Different permissions
Privacy settings | Who sees your information
Strong password | Long, mixed characters
Automated updates | Fix security holes
Check URLs | Spot fake websites
Spot phishing | Check the sender
Stops DDoS | Proxy server filtering
Backup | Restore after ransomware
Encryption | Makes stolen data useless
Ignore unknown attachments | Avoid viruses`,
"6-1-auto":`Automated system | Works without people
Sensor | Measures and sends readings
Microprocessor | Compares with set values
Actuator | Carries out an action
ADC | Analogue to digital
Microcontroller | Computer on one chip
Monitoring system | Reports only
Control system | Changes the process
Feedback | Output affects next reading
Pre-set value | What readings are compared to
Too hot in a greenhouse | Open a window
Too dark outside | Switch on a light
Motor | An actuator
Valve | Opens or closes a pipe
Loop repeats | Continuously
Sensor readings are | Analogue
Microprocessor decides | What to do
Buzzer or alarm | Warning output`,
"6-1-uses":`LiDAR | Lasers map surroundings
Radar | Radio waves for distance
Ultrasonic sensor | High-pitched sound
Adaptive cruise control | Keeps a safe distance
Data logger | Records readings over time
Self-driving car | Automated transport
Automated irrigation | Waters crops
Weather station | Automated monitoring
Smart lighting | Turns lights on and off
Automated factory | Industry
Benefit of automation | Works 24/7
Benefit 2 | Fewer human errors
Drawback of automation | Expensive to set up
Drawback 2 | Can replace jobs
Science experiments | Logged automatically
Gaming | Automated effects
Parking sensors | Ultrasonic
Drone crop spraying | Automated agriculture`,
"6-2-robots":`Robotics | Designing and building robots
Robot | Programmable machine
Mechanical structure | Robot's body or frame
Electrical components | Sensors, CPU, actuators
Programmable | Can follow instructions
Independent robot | Acts without human control
Dependent robot | Human involved
Robot vacuum | Works on its own
Bomb robot | Driven by an operator
End effector | Tool on a robot arm
Robots sense with | Sensors
Robots move with | Actuators
Robots decide with | A microprocessor
Robot arm | Industrial robot
Not a robot | A washing machine
Characteristic | Has a mechanical structure
Robot example | Mars rover
Robots need | A program`,
"6-2-roles":`Industrial robot | Welding and assembly
Surgical robot | Precise operations
Domestic robot | Household chores
Drone | Unmanned flying robot
Animatronics | Theme park characters
Delivery robot | Takes parcels to homes
Warehouse robot | Picks and moves stock
Agricultural robot | Harvests crops
Robot benefit | Works without breaks
Robot benefit 2 | Consistent quality
Robot benefit 3 | Safe in dangerous places
Robot drawback | Expensive
Robot drawback 2 | Can't adapt easily
Robot drawback 3 | Job losses
Bomb disposal | Keeps people safe
Robot in medicine | Smaller incisions
Robot lawnmower | Cuts grass by itself
Space exploration | Rovers and probes`,
"6-3-ai":`Artificial intelligence | Machines acting intelligently
AI has | Data and rules
Reasoning | Rules to reach a conclusion
Learning | Changes its own rules
Adapting | Improves with experience
Chatbot | AI that holds conversations
Voice assistant | Understands speech
Expert system | Imitates a human expert
Machine learning | Learns from data
Facial recognition | AI in phones
Recommendations | AI suggests films
Spam filter | AI sorts email
Self-driving car | AI on the road
AI concern | Bias in decisions
AI concern 2 | Privacy of data
AI benefit | Fast decisions
Narrow AI | Good at one task
AI needs | Lots of data`,
"6-3-expert":`Expert system | Imitates an expert
Knowledge base | Store of facts
Rule base | IF-THEN rules
Inference engine | Applies rules to facts
Interface | How the user communicates
Explanation system | Shows how it decided
Forward chaining | Facts to conclusion
Backward chaining | Goal back to facts
Medical diagnosis | Expert system use
Car fault finding | Expert system use too
Expert system asks | Yes/no questions
Expert system gives | A probability
Expert system benefit | Always available
Expert system drawback | No common sense
Built from | Experts' knowledge
Expert system output | Diagnosis or advice
Rules written as | IF … THEN …
Chess expert system | Game strategy`,
"6-3-ml":`Machine learning | Adapts its own processes
Training data | Examples to learn from
Supervised learning | Trained on labelled examples
Unsupervised learning | Finds patterns itself
Pattern | Regular feature in data
Weighting | How important a property is
Bias | Unfair training data
More training data | Better predictions
Labelled data | Tagged with the answer
Spam detection | Learns from marked emails
Customer groups | Found without labels
Machine learning vs expert | Learns rules itself
Model | What learning produces
Testing data | Checks the model
Wrong prediction | Weights are adjusted
Bias leads to | Unfair decisions
Image recognition | Trained on many photos
Machine learning needs | Lots of data`,
"7-1-pdlc":`Analysis | What the problem is
Design | Planning the solution
Coding | Writing the program
Testing | Checking it works
Requirements specification | What the system must do
Abstraction | Remove unneeded details
Decomposition | Break into smaller parts
Iterative testing | Test each part as written
Sub-system | Part of a larger system
Structure diagram | Shows sub-systems
Inputs | Data going in
Processes | What is done to data
Outputs | Results produced
Storage | Data that is kept
Flowchart | A design tool
Pseudocode | Design in code-like text
Order of PDLC | Analysis, design, code, test
Map of the Underground | Abstraction example`,
"7-1-flowcharts":`Algorithm | Step-by-step instructions
Flowchart | Steps as symbols and arrows
Terminator | START and STOP
Terminator shape | Rounded rectangle
Process | Calculation or assignment
Process shape | Rectangle
Decision | Yes or No question
Decision shape | Diamond
Input/output | Parallelogram
Flow line | Arrow
Subroutine | Rectangle, double sides
Pseudocode | Code-like text
Purpose of an algorithm | What it achieves
OUTPUT "Hello" | An output statement
Total ← Total + 1 | An assignment
IF X > 10 THEN | A decision in pseudocode
Loop in a flowchart | Arrow goes back up
INPUT Name | An input statement`,
"7-1-standard":`Totalling | Total ← Total + Value
Counting | Count ← Count + 1
Maximum | Largest value
Minimum | Smallest value
Average | Total ÷ number of values
Linear search | Check each item in turn
Flag | Boolean like Found
Found ← TRUE | Item has been found
Max starts at | The first value
Total starts at | 0
Count increases by | 1 each time
Linear search stops | When found or at end
List 4, 9, 2: max | 9
List 4, 9, 2: min | 2
List 4, 9, 2: total | 15
List 4, 9, 2: average | 5
List 4, 9, 2: count | 3
Standard method | Well-known algorithm`,
"7-1-bubble":`Bubble sort | Compare and swap neighbours
Pass | One run through the list
Swap | Exchange two items
Temporary variable | Needed for a swap
Ascending | Smallest to largest
Descending | Largest to smallest
A to Z | Ascending order
Z to A | Descending order
No swaps in a pass | List is sorted
After pass 1 (ascending) | Largest at the end
Compares items | Next to each other
Swap if | In the wrong order
5, 1, 4 after one pass | 1, 4, 5
3, 2, 1 after one pass | 2, 1, 3
n items need at most | n − 1 passes
Bubble sort drawback | Slow for big lists
Bubble sort benefit | Simple to write
Flag in bubble sort | Records a swap`,
"7-1-valver":`Validation | Is data reasonable?
Verification | Was data entered accurately?
Range check | Between two limits
Length check | Right number of characters
Type check | Right data type
Presence check | Something entered
Format check | Matches a pattern
Check digit | Detects typing errors
Double entry | Enter twice, compare
Visual check | User looks it over
Validation is | Automatic
Validation can't check | Data is correct
Validation happens | As data is input
Verification happens | After data is entered
Check digits used on | Barcodes and ISBNs
Validation fails | Data is rejected
Range check needs | Upper and lower limits
Verification can't stop | Wrong but valid data`,
"7-1-testing":`Test data | Chosen to test a program
Normal data | Should be accepted
Abnormal data | Should be rejected
Extreme data | Largest or smallest accepted
Boundary data | Limit and just beyond
Range 1–10: normal | 5
Range 1–10: extreme | 10
Range 1–10: boundary | 11
Range 1–10: abnormal | "ten"
Test plan | Tests and expected results
Syntax error | Breaks grammar rules
Logic error | Runs but gives wrong result
Runtime error | Crashes while running
Divide by zero | Program crashes
Missing bracket | Won't translate
< instead of <= | Wrong result, no crash
Expected result | What should happen
Actual result | What did happen`,
"7-1-trace":`Trace table | Records values at each step
Dry run | Work through by hand
Rogue value | Stops an input loop
−1 or 999 | Typical rogue values
Each column | A variable or output
New row | When a value changes
Trace tables find | Logic errors
X ← 3, X ← X * 2 | X is 6
Y ← 10, Y ← Y − 3 | Y is 7
FOR i ← 1 TO 3: output i | 1, 2, 3
Count after 4 loops | 4
Total of 2, 3, 5 | 10
Output column | What is displayed
Test data | Inputs for a dry run
Trace table purpose | See how values change
Loop ends | When condition is met
REPEAT loop runs | At least once
Dry run needs | No computer`,
"7-1-writing":`Requirement | What the algorithm must do
Amend | Change an existing algorithm
Precise | Exact enough to code
Read the question | Find the requirements
Meaningful names | Clear identifiers
Comments | Explain the code
Indentation | Shows structure
Check every requirement | Before finishing
Use a loop | To repeat
Use selection | To make choices
Use an array | For many values
Input validation | Reject bad data
Initialise variables | Before the loop
Test your algorithm | With a dry run
Pseudocode keywords | In capitals
Assignment arrow | ←
Output results | Clearly labelled
Keep what works | When amending`,
"8-1-variables":`Variable | Value can change
Constant | Value can't change
Identifier | Name of a variable
Declaration | DECLARE Score : INTEGER
Assignment | Store a value using ←
Initialisation | Giving a first value
INTEGER | Whole number
REAL | Has a decimal part
CHAR | Single character
STRING | Zero or more characters
BOOLEAN | TRUE or FALSE
Concatenation | Joining strings
42 | An INTEGER
3.14 | A REAL
'Y' | A CHAR
"Hello" | A STRING
TRUE | A BOOLEAN
CONSTANT Pi ← 3.14 | Declares a constant`,
"8-1-sequence":`Sequence | One after another
INPUT | Takes data from the user
OUTPUT | Displays data
DIV | Whole number division
MOD | Remainder
17 DIV 5 | 3
17 MOD 5 | 2
20 MOD 4 | 0
9 DIV 2 | 4
Relational operator | Compares two values
<> | Not equal to
>= | Greater than or equal
Logical operators | AND, OR, NOT
^ | To the power of
2 ^ 3 | 8
7 + 3 * 2 | 13
(7 + 3) * 2 | 20
10 / 4 | 2.5`,
"8-1-selection":`Selection | Choose which code runs
IF | Runs code if TRUE
ELSE | Runs if condition is FALSE
ENDIF | Ends an IF
Nested IF | IF inside an IF
CASE | One variable, many values
OTHERWISE | No value matched
ENDCASE | Ends a CASE
CASE OF Day | Checks Day's value
Condition | TRUE or FALSE test
IF Age >= 18 THEN | Checks adults
Use CASE when | Many fixed values
Use IF when | A range of values
THEN | Follows the condition
X ← 5: IF X > 3 | TRUE branch runs
X ← 2: IF X > 3 | ELSE branch runs
Grade by mark | Nested IF or ELSE IF
AND in a condition | Both must be TRUE`,
"8-1-iteration":`Iteration | Repeating code
FOR loop | Repeats a set number of times
WHILE loop | Checks before each repeat
REPEAT loop | Checks at the end
May not run at all | Pre-condition loop
Runs at least once | Post-condition loop
FOR i ← 1 TO 5 | Runs 5 times
NEXT i | Ends a FOR loop
ENDWHILE | Ends a WHILE loop
UNTIL | Ends a REPEAT loop
Unknown number of repeats | Use WHILE or REPEAT
Totalling | Adds each value
Counting | Adds 1 each time
Validate input repeatedly | REPEAT … UNTIL
STEP 2 | Counts up in twos
Infinite loop | Condition never met
FOR i ← 10 TO 1 STEP −1 | Counts down
Loop body | Code that repeats`,
"8-1-strings":`LENGTH | Number of characters
UCASE | Upper case
LCASE | Lower case
SUBSTRING | Part of a string
ROUND | Rounds a number
RANDOM | Number from 0 to 1
Library routine | Ready-made code
LENGTH("Cat") | 3
UCASE("hi") | "HI"
LCASE("BYTE") | "byte"
SUBSTRING("Computer",1,4) | "Comp"
SUBSTRING("Python",3,2) | "th"
ROUND(3.456, 1) | 3.5
ROUND(7.5, 0) | 8
First character position | 1 in pseudocode
LENGTH("") | 0
"Hello" & "!" | "Hello!"
Library benefit | Already tested`,
"8-1-validation":`Validation | Checks data is reasonable
Range check | Between limits
Presence check | Not empty
Length check | Right number of characters
Format check | Matches a pattern
Type check | Right data type
Character check | No forbidden characters
Verification | Entered accurately
Validation loop | REPEAT … UNTIL valid
Double entry | A verification check
Error message | Tells the user to retry
Validation doesn't prove | Data is correct
LENGTH(PIN) = 4 | Checks a 4-digit PIN
Mark < 0 OR Mark > 100 | Mark out of range
Name = "" | Nothing typed in
Validation in code uses | IF statements
Character check uses | Each letter in turn
Format check uses | SUBSTRING on parts`,
"8-1-maintain":`Maintainable program | Easy to read and change
Meaningful identifier | Describes what it stores
Comment | Note for humans
// in pseudocode | Starts a comment
Magic number | Unexplained value
Use instead of magic number | A constant
Subroutine | Named block of code
Procedure | No value returned
Function | Returns a value
CALL | Runs a procedure
Parameter | Value passed in
Argument | Actual value given
RETURN | Sends a value back
Local variable | Only inside a subroutine
Global variable | Usable anywhere
ENDPROCEDURE | Ends a procedure
ENDFUNCTION | Ends a function
Subroutine benefit | Reuse code`,
"8-2-onedim":`Array | Many items, one name
Element | One item in an array
Index | Position of an element
Lower bound | First index
Upper bound | Last index
Lower bound in pseudocode | Usually 1
Lower bound in Python | 0
DECLARE Ages : ARRAY[1:30] | 30 elements
Same data type | All elements share one
Names[3] | Third element
Names[1] ← "Ali" | Assigns an element
Array benefit | One name for many values
ARRAY[1:5] OF INTEGER | 5 whole numbers
Index can be | A variable
Out of range index | Runtime error
Marks[i] | Element at position i
1D array | One row of data
Array size | Fixed when declared`,
"8-2-loops":`FOR loop | Visits each element
FOR i ← 1 TO 10 | Covers ARRAY[1:10]
Running total | Each value added
Total ← Total + Marks[i] | Totals an array
Search an array | Compare each element
Find the max | Keep the biggest so far
Fill an array | INPUT Names[i]
Output every element | OUTPUT Names[i]
Loop counter | Used as the index
Count matches | IF … THEN Count ← Count + 1
Average of array | Total / number of items
Nested loop | Loop inside a loop
Iteration | Repeating with a loop
Index starts at | Lower bound
Loop ends at | Upper bound
Linear search on array | Stops when found
WHILE for search | Can stop early
Copy an array | Element by element`,
"8-2-twodim":`2D array | Rows and columns
First index | Row
Second index | Column
Grid[2,3] | Row 2, column 3
ARRAY[1:3,1:4] | 12 elements
Nested iteration | Loop inside a loop
Outer loop | Rows
Inner loop | Columns
2D array use | A table of scores
Seating plan | 2D array example
Board game | Grid of squares
Total a whole 2D array | Two nested loops
Total one row | Fix the row, loop columns
Total one column | Fix the column, loop rows
DECLARE Grid : ARRAY[1:5,1:5] | 25 elements
Element | One cell of the grid
All elements | Same data type
Grid[1,1] | Top-left element`,
"8-2-uses":`Parallel arrays | Same index, same item
Names[3] and Ages[3] | Same person
Parallel arrays size | The same
Store names and marks | Two parallel arrays
Search a name | Use its index for marks
Highest mark's name | Same index in Names
Sorting parallel arrays | Swap in both
Array of totals | Running totals per item
Count per category | Array of counters
Lookup table | Array of fixed values
Days in each month | Array of 12
Scores of 5 tests | ARRAY[1:5]
2D array instead | Rows of records
Array index | Links data together
Arrays + loops | Process lots of data
Store a list | Use an array
Average of array | Total ÷ items
Max of array | Compare each element`,
"8-3-files":`File | Data kept after program ends
Why use files? | Data isn't lost
OPENFILE | Opens a file
READFILE | Reads the next line
WRITEFILE | Writes a new line
CLOSEFILE | Closes the file
FOR READ | Mode to read from a file
FOR WRITE | Mode to write to a file
File mode | READ or WRITE
Files are stored | In secondary storage
Close a file | When finished with it
Read a whole file | Loop until EOF
EOF | End of file
Each WRITEFILE | Adds a line
Opening FOR WRITE | Overwrites the file
Data in a file | Can be shared
Variables are lost | When program ends
Text file | Lines of characters`,
"9-1-intro":`Database | Organised, searchable data
Table | Fields and records
Field | A column
Record | A row
Primary key | Unique for each record
Single-table database | All data in one table
Query | Search for data
StudentID | Good primary key
Surname | Bad primary key
Why a primary key? | Identify each record
Field name | Heading of a column
Database benefit | Fast searching
Database benefit 2 | Easy sorting
Adding a pupil | New record
Adding a phone number | New field
One customer's details | One record
Duplicates in primary key | Not allowed
Every record has | The same fields`,
"9-1-types":`Text / alphanumeric | Letters, digits, symbols
Date / time | Dates and times
Phone number | Text: keeps the leading 0
Price £3.99 | Real: has a decimal
Number of pets | Integer: whole number
Paid? | Boolean: yes or no
Date of birth | Date/time type
Grade A–E | Character: one letter
Postcode | Text: letters and digits
Height 1.65 m | Real number
Number of goals | Integer count
Is a member? | Boolean field
Validation | Data is sensible
Verification | Data entered accurately
Range check on Age | Is it 0 to 120?
Double entry | Typed twice, compared
Why text for phone numbers? | No maths needed
Choose a data type | Think about the data`,
"9-1-sql":`SQL | Structured query language
SELECT | Fields to show
FROM | Table to search
WHERE | Condition to meet
* | Every field
<> | Not equal to
= | Equal to
SELECT Name | Shows the Name field
FROM Students | Searches Students
WHERE Age > 15 | Only over 15s
WHERE Form = '10A' | Only form 10A
SELECT * | Shows every field
AND in WHERE | Both conditions true
OR in WHERE | Either condition true
Text in SQL | Quotes '10A'
Query result | Matching records
>= | Greater than or equal
Ends a statement | ;`,
"9-1-sql2":`ORDER BY | Sorts results
ASC | Smallest first
DESC | Largest first
COUNT | How many records
SUM | Adds up a field
ORDER BY Name ASC | A to Z by name
ORDER BY Score DESC | Highest score first
SELECT COUNT(*) | Number of records
SELECT SUM(Cost) | Total cost
Default order | Ascending
SUM needs | A number field
COUNT with WHERE | Counts matches
ORDER BY comes | After WHERE
Sort by two fields | ORDER BY A, B
SUM(Points) of 3, 4, 5 | 12
COUNT of 3 matches | 3
Z to A | Descending order
ORDER BY Age | Youngest first`,
"10-1-gates":`Boolean logic | TRUE (1) or FALSE (0)
Logic gate | Binary output from inputs
NOT | Opposite of the input
AND | 1 only if both are 1
OR | 1 if either is 1
NAND | 0 only if both are 1
NOR | 1 only if both are 0
XOR | 1 if inputs differ
NOT 1 | 0
1 AND 0 | False: 0
1 OR 0 | True: 1
1 XOR 1 | Same inputs: 0
0 NOR 0 | Both 0: gives 1
1 NAND 1 | Both 1: gives 0
Gate with one input | Only the NOT gate
Triangle with a circle | NOT symbol
D-shaped symbol | AND symbol
Curved back, pointed tip | OR symbol`,
"10-1-tables":`Truth table | Every input combination
Input | 0 or 1 going in
Output | Value produced
Working space | Columns for each gate
2 inputs | 4 rows
3 inputs | 8 rows
4 inputs | 16 rows
n inputs | 2ⁿ rows
Rows start at | 000
Rows end at | 111
AND table: 1s in output | Only the 11 row
OR table: 0s in output | Just the 00 row
XOR outputs | 0, 1, 1, 0
NAND outputs | 1, 1, 1, 0
NOR outputs | 1, 0, 0, 0
AND outputs | 0, 0, 0, 1
OR outputs | 0, 1, 1, 1
NOT outputs (0, 1) | 1, 0`,
"10-1-circuits":`Logic circuit | Gates joined together
Logic statement | Logic in words
Logic expression | Logic with gate names
X = A AND B | Output 1 if both are 1
X = NOT A | Output is opposite of A
X = A OR (NOT B) | A, or B is 0
Brackets | Show which gate first
Inputs on the left | Output on the right
Each gate's output | Can feed another gate
Draw from expression | Innermost bracket first
A=1, B=1: A AND B | Gives 1
A=0, B=1: A OR B | Gives 1 too
A=1, B=0: NOT B | Results in 1
A=1, B=1: A XOR B | Results in 0
A=0, B=0: A NOR B | Outputs 1
A=1, B=1: A NAND B | Outputs 0
Statement to expression | Words to gate names
Circuit to table | Work through each gate`,
"10-1-universal":`Universal gate | Can build any circuit
NAND | AND then NOT
NOR | OR then NOT
Universal gates | NAND and NOR
NOT from NAND | Join both inputs
NAND symbol | AND with a circle
NOR symbol | OR with a circle
Circle on a symbol | Means NOT
Why use universal gates? | Cheaper to make
NAND outputs 0 when | Both inputs are 1
NOR outputs 1 when | Both inputs are 0
1 NAND 0 | Output 1
0 NOR 1 | Output 0
NOT A | Opposite of A
AND from NAND | NAND then NOT
OR from NOR | NOR then NOT
Chips built from | NAND gates
Only one gate type | Universal design`,
});
for(const [k,v] of Object.entries({...TZRAW,...TZRAW2}))TZTXT[k]=v.trim().split("\n").map(r=>r.split(" | ").map(s=>s.trim()));

/* what the puzzle engine (06q-tarsia.js) reads: a list of pairs, or a function that makes them */
const TZP=Object.assign({},TZTXT,TZGEN);
