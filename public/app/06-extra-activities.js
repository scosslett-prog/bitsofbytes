/* ================= extra activities: every lesson has at least three =================
   Generic generators: xsort (drag into boxes) and xorder (put steps in order), driven by the data on each activity. */
GEN.xsort=function(){const Z=Object.keys(this.sets),per=this.per||Math.max(2,Math.floor(8/Z.length)),it=[];
  Z.forEach(z=>shuffle(this.sets[z]).slice(0,per).forEach(text=>it.push({kind:"sort",text,z,zones:Z,zl:this.zl})));return shuffle(it)};
GEN.xorder=function(){const S=this.steps,n=S.length;let st;do{st=shuffle([...Array(n).keys()])}while(st.filter((o,i)=>o===i).length>1);return S.map((text,pos)=>({kind:"order",pos,text,start:st}))};
/* order five random 8-bit binary numbers from smallest to largest */
GEN.binorder=function(){const v=new Set();while(v.size<5)v.add(1+Math.floor(Math.random()*254));const vs=[...v].sort((a,b)=>a-b),n=vs.length;let st;
  do{st=shuffle([...Array(n).keys()])}while(st.filter((o,i)=>o===i).length>1);
  return vs.map((d,pos)=>({kind:"order",pos,text:`<span class="mono">${d.toString(2).padStart(8,"0")}</span>`,flex:`= ${d}`,start:st}))};
/* order five storage sizes written in different units */
GEN.qtyorder=function(){const U=[["bytes",0],["KiB",1],["MiB",2],["GiB",3],["TiB",4]];let items,ok;
  do{items=[];const used=new Set();while(items.length<5){const u=U[1+Math.floor(Math.random()*4)],k=[1,2,3,4,5,8,16,64,256,512,1024,2048][Math.floor(Math.random()*12)],b=k*Math.pow(1024,u[1]);if(used.has(b))continue;used.add(b);items.push({t:`${k} ${u[0]}`,b})}
    items.sort((a,b)=>a.b-b.b);ok=items.every((x,i)=>!i||x.b>items[i-1].b)}while(!ok);
  const n=5;let st;do{st=shuffle([...Array(n).keys()])}while(st.filter((o,i)=>o===i).length>1);
  return items.map((x,pos)=>({kind:"order",pos,text:x.t,flex:`= ${x.b>=1024?(x.b/1024).toLocaleString("en-GB")+" KiB":x.b+" bytes"}`,start:st}))};
/* order five bitmap images by file size */
GEN.imgorder=function(){let items;do{items=[];const used=new Set();while(items.length<5){const w=[8,16,32,40,50,64,100,128][Math.floor(Math.random()*8)],h=[8,10,16,20,25,32,50,64][Math.floor(Math.random()*8)],d=[1,2,4,8,16,24][Math.floor(Math.random()*6)],b=w*h*d;if(used.has(b))continue;used.add(b);items.push({t:`${w} × ${h} pixels, ${d}-bit colour depth`,b})}}while(false);
  items.sort((a,b)=>a.b-b.b);const n=5;let st;do{st=shuffle([...Array(n).keys()])}while(st.filter((o,i)=>o===i).length>1);
  return items.map((x,pos)=>({kind:"order",pos,text:x.t,flex:`= ${x.b.toLocaleString("en-GB")} bits`,start:st}))};

/* ---- new question banks (original wording) ---- */
Object.assign(BANKS,{
 binary:[{t:"mc",q:"Why do computers use binary?",a:"Their circuits have switches that are either on or off",w:["Binary numbers are shorter than denary numbers","Binary uses less electricity than any other system","Binary is easier for people to read"]},
  {t:"mc",q:"What is the place value of the leftmost bit in an 8-bit binary number?",a:"128",w:["256","64","8"]},
  {t:"mc",q:"What is the largest denary number that can be stored in 8 bits?",a:"255",w:["256","128","999"]},
  {t:"mc",q:"How many different values can 8 bits represent?",a:"256",w:["255","8","128"]},
  {t:"mc",q:"What is 00001010 in denary?",a:"10",w:["5","12","20"]},
  {t:"mc",q:"What is 25 in 8-bit binary?",a:"00011001",w:["00010101","00011010","00100101"]},
  {t:"mc",q:"Which binary number is the largest?",a:"10000000",w:["01111111","01010101","00111111"]},
  {t:"mc",q:"What base does the binary number system use?",a:"Base 2",w:["Base 10","Base 8","Base 16"]},
  {t:"mc",q:"Each extra bit on the left of a binary number…",a:"doubles the place value",w:["adds 10 to the place value","adds 1 to the place value","halves the place value"]},
  {t:"mc",q:"A binary number ends in 1. What does this tell you about its denary value?",a:"It is odd",w:["It is even","It is greater than 128","It is a multiple of 4"]},
  {t:"blank",q:"The smallest unit of data, a single 0 or 1, is called a ___.",a:["bit"]},
  {t:"blank",q:"Binary 11111111 is ___ in denary.",a:["255"]}],
 hexcol:[{t:"mc",q:"Which colour does #FF0000 show?",a:"Red",w:["Green","Blue","White"]},
  {t:"mc",q:"Which colour does #00FF00 show?",a:"Green",w:["Red","Blue","Black"]},
  {t:"mc",q:"Which colour does #0000FF show?",a:"Blue",w:["Red","Yellow","Green"]},
  {t:"mc",q:"Which colour does #FFFFFF show?",a:"White",w:["Black","Grey","Red"]},
  {t:"mc",q:"Which colour does #000000 show?",a:"Black",w:["White","Blue","Grey"]},
  {t:"mc",q:"Which colour does #FFFF00 show?",a:"Yellow (red and green at full)",w:["Blue","Purple","Cyan"]},
  {t:"mc",q:"#808080 has the same amount of red, green and blue at about half strength. What colour is it?",a:"Grey",w:["White","Black","Brown"]},
  {t:"mc",q:"In #A0C83C, which pair of digits sets the amount of green?",a:"C8",w:["A0","3C","A0 and 3C"]},
  {t:"mc",q:"How many bits are used for one HTML colour code like #1E90FF?",a:"24 bits",w:["8 bits","16 bits","6 bits"]},
  {t:"mc",q:"Which change makes #330000 a brighter red?",a:"#CC0000",w:["#3300CC","#000033","#333333"]},
  {t:"mc",q:"How many different values can each pair of hex digits in a colour code store?",a:"256 (00 to FF)",w:["16 (0 to F)","100 (00 to 99)","255 (01 to FF)"]}],
 binadd:[{t:"mc",q:"What is 1 + 1 in binary?",a:"10 (write 0, carry 1)",w:["2","11","1 (carry 0)"]},
  {t:"mc",q:"What is 1 + 1 + 1 in binary?",a:"11 (write 1, carry 1)",w:["3","10","100"]},
  {t:"mc",q:"Which direction do you work in when adding binary numbers?",a:"From right to left",w:["From left to right","Starting with the biggest place value","It doesn't matter"]},
  {t:"mc",q:"What is an overflow error?",a:"A result too large to fit in the number of bits available",w:["A carry into the next column","A negative result","Adding a number to itself"]},
  {t:"mc",q:"How can you spot an overflow when adding two 8-bit numbers?",a:"There is a carry out of the leftmost (8th) bit",w:["The answer starts with 0","There is a carry in the rightmost column","The answer has more 1s than 0s"]},
  {t:"mc",q:"Two 8-bit numbers add to 300 in denary. What happens in an 8-bit register?",a:"Overflow: the result can't be stored correctly",w:["It stores 300 correctly","It stores 255","The register grows to 9 bits"]},
  {t:"mc",q:"What is 0011 + 0101?",a:"1000",w:["0110","0111","1001"]},
  {t:"mc",q:"Which of these sums of 8-bit numbers would cause an overflow?",a:"200 + 100",w:["100 + 100","127 + 127","50 + 200"]},
  {t:"mc",q:"What is the largest result an 8-bit register can store without overflow?",a:"255",w:["256","511","128"]},
  {t:"mc",q:"A register is…",a:"a small, fast store in the CPU with a fixed number of bits",w:["the part of RAM where programs are stored","a type of secondary storage","a list of instructions"]},
  {t:"blank",q:"In binary addition, 1 + 0 = ___.",a:["1"]}],
 shiftq:[{t:"mc",q:"What does a logical shift of one place to the left do to a binary number?",a:"Multiplies it by 2",w:["Divides it by 2","Adds 1","Multiplies it by 10"]},
  {t:"mc",q:"What does a logical shift of two places to the right do?",a:"Divides it by 4",w:["Divides it by 2","Multiplies it by 4","Subtracts 2"]},
  {t:"mc",q:"What fills the empty places after a logical shift?",a:"0s",w:["1s","The bits that fell off","Copies of the leftmost bit"]},
  {t:"mc",q:"When does a left shift give the wrong answer?",a:"When a 1 is shifted out of the leftmost bit",w:["When a 0 is shifted out","When the number is odd","Never"]},
  {t:"mc",q:"Shift 00010110 left by 1 place.",a:"00101100",w:["00001011","00010111","01011000"]},
  {t:"mc",q:"Shift 01100000 right by 3 places.",a:"00001100",w:["00011000","11000000","00000110"]},
  {t:"mc",q:"A right shift of 3 places divides a number by…",a:"8",w:["3","6","9"]},
  {t:"mc",q:"What is lost when a 1 falls off the right-hand end in a right shift?",a:"Accuracy: the result is rounded down",w:["Nothing","The leftmost bit","The number becomes negative"]},
  {t:"mc",q:"Which shift multiplies a number by 8?",a:"Left by 3 places",w:["Left by 8 places","Right by 3 places","Left by 4 places"]},
  {t:"mc",q:"00000101 is shifted left 2 places. What is the result in denary?",a:"20",w:["10","7","40"]}],
 fsizeq:[{t:"mc",q:"What is the formula for the file size of a bitmap image, in bits?",a:"width × height × colour depth",w:["width × height","width × colour depth","resolution ÷ colour depth"]},
  {t:"mc",q:"What is the formula for the file size of a sound file, in bits?",a:"sample rate × sample resolution × length in seconds",w:["sample rate × length in seconds","sample resolution × length in seconds","sample rate ÷ sample resolution"]},
  {t:"mc",q:"How do you turn a file size in bits into bytes?",a:"Divide by 8",w:["Multiply by 8","Divide by 1024","Multiply by 1024"]},
  {t:"mc",q:"How do you turn bytes into KiB?",a:"Divide by 1024",w:["Divide by 1000","Multiply by 1024","Divide by 8"]},
  {t:"mc",q:"An image is 10 × 10 pixels with a 8-bit colour depth. What is its size in bytes?",a:"100 bytes",w:["800 bytes","80 bytes","10 bytes"]},
  {t:"mc",q:"Doubling the colour depth of an image…",a:"doubles its file size",w:["halves its file size","doesn't change its file size","multiplies its file size by 4"]},
  {t:"mc",q:"Doubling both the width and the height of an image…",a:"multiplies its file size by 4",w:["doubles its file size","doesn't change its file size","multiplies its file size by 8"]},
  {t:"mc",q:"A sound is sampled 1000 times a second at 8 bits for 4 seconds. What is its size in bytes?",a:"4000 bytes",w:["32 000 bytes","1000 bytes","8000 bytes"]},
  {t:"mc",q:"Which sound file would be largest?",a:"44 100 Hz, 16-bit, 10 seconds",w:["22 050 Hz, 16-bit, 10 seconds","44 100 Hz, 8-bit, 10 seconds","44 100 Hz, 16-bit, 5 seconds"]},
  {t:"mc",q:"Why are real files often a little bigger than the calculated size?",a:"They also store metadata, such as the dimensions or the date",w:["The calculation is always wrong","Computers round up to the next GiB","Compression adds extra data"]},
  {t:"blank",q:"8 bits make 1 ___.",a:["byte"]}]
});

/* ---- the new activities, by lesson ---- */
const XS=(desc,explain,zl,sets,extra)=>Object.assign({desc:desc+" · drag and drop",gen:"xsort",type:"sort",explain,zl,sets},extra||{});
const XO=(desc,explain,steps)=>({desc:desc+" · drag and drop",gen:"xorder",type:"order",explain,steps});
const XB=(desc,explain,bank)=>({desc:desc+" · 8 questions",gen:"bank",explain,bank});
const EXTRA_ACTS={
 "1-1-binary":[{desc:"Binary ↔ denary · 8 questions",gen:"conv",mode:"bd",explain:"Convert binary numbers into denary, and denary numbers into binary. Draw out the place value table (128, 64, 32, 16, 8, 4, 2, 1) to help you. Leading zeros are optional. New numbers every try."},
  {desc:"Smallest to largest · drag and drop",gen:"binorder",type:"order",explain:"Drag the five binary numbers into order, from the smallest at the top to the largest at the bottom. Compare them from the left: the first place they differ decides which is bigger. New numbers every try."},
  XB("Binary quiz","Questions on why computers use binary, place values and the range of 8 bits. Every try picks a different set.","binary")],
 "1-1-hexuses":[XS("Where is hex used?","Drag each example into the box for the place it comes from.",{C:"HTML colour code",M:"MAC address",E:"Error code",A:"Memory address"},
   {C:["#FF8C00","#1E90FF","#2E8B57","#FFFFFF"],M:["00:1A:2B:3C:4D:5E","A4-5E-60-E8-1F-32","3C:22:FB:9A:07:C1","F0-DE-F1-12-34-AB"],E:["Error 0x0000007B","Stop code 0xC000021A","HTTP error 0x80070005","Exception 0x0000009F"],A:["Address 0x7FFE0010","Location 3A2F in RAM","Pointer to 0x00400000","Jump to address FF00"]}),
  XB("Colour codes","Work out the colour from its hex code. Each pair of digits is the amount of red, green and blue, from 00 (none) to FF (full). Every try picks a different set.","hexcol")],
 "1-1-addition":[XB("Binary addition quiz","Questions on the rules of binary addition, carries and overflow. Every try picks a different set.","binadd")],
 "1-1-shifts":[XB("Shifts quiz","Questions on what left and right shifts do, and when they give the wrong answer. Every try picks a different set.","shiftq")],
 "1-2-charsets":[XS("ASCII or Unicode?","Drag each statement into the box for the character set it describes.",{A:"ASCII",U:"Unicode"},
   {A:["Uses 7 bits for each character","Can represent 128 characters","Covers the English alphabet, digits and some symbols","Takes up less storage per character","Can't represent most other languages"],U:["Uses up to 32 bits for each character","Can represent over a million characters","Includes emoji","Covers almost every written language","Uses more storage per character"]})],
 "1-2-sound":[XS("Bigger or smaller file?","Decide whether each change makes a sound file bigger or smaller.",{B:"Bigger file",S:"Smaller file"},
   {B:["Increasing the sample rate","Increasing the sample resolution","Recording for longer","Recording in stereo instead of mono","Taking more samples each second"],S:["Reducing the sample rate","Reducing the sample resolution","Shortening the recording","Using fewer bits for each sample","Recording in mono instead of stereo"]})],
 "1-2-images":[{desc:"Smallest to largest file · drag and drop",gen:"imgorder",type:"order",explain:"Drag the five images into order of file size, smallest at the top. File size = width × height × colour depth. New images every try."}],
 "1-3-measurement":[{desc:"Order the sizes · drag and drop",gen:"qtyorder",type:"order",explain:"Drag the five storage sizes into order, smallest at the top. Each unit is 1024 times the one before it: 1024 bytes = 1 KiB, 1024 KiB = 1 MiB, 1024 MiB = 1 GiB, 1024 GiB = 1 TiB. New sizes every try."}],
 "1-3-filesize":[XB("File size quiz","Questions on the image and sound file size formulas, and converting between units. Every try picks a different set.","fsizeq")],
 "2-1-transmission":[XS("Simplex, half or full duplex?","Drag each example into the box for its direction of transmission.",{S:"Simplex",H:"Half-duplex",F:"Full-duplex"},
   {S:["A computer sending data to a printer","A TV broadcast","A sensor sending readings to a controller","A radio station transmitting music"],H:["A walkie-talkie conversation","A shared cable where devices take turns","A two-way radio where you press to talk","Two devices that must wait for each other to finish"],F:["A phone call","A video call","Broadband internet","A network link sending and receiving at once"]},{per:3})],
 "2-1-packets":[XO("Packet switching steps","The steps for sending a file by packet switching have been jumbled. Drag them into the correct order.",
   ["The data is split into packets","Each packet is given a header with the destination address and a packet number","The packets are sent onto the network","Routers send each packet along the best route available at that moment","The packets arrive, possibly out of order","The receiving device uses the packet numbers to reassemble the data"])],
 "2-1-usb":[XO("Plugging in a USB device","What happens when a USB device is plugged in? Drag the steps into the correct order.",
   ["The device is plugged into a USB port","The computer detects that a device has been connected","The device tells the computer what type of device it is","The computer loads the correct driver, or downloads it","The device is ready to use and data can be sent serially"])],
 "2-2-checksums":[XO("How a checksum works","Drag the steps of a checksum check into the correct order.",
   ["The sender calculates a checksum from the data using an agreed algorithm","The checksum is sent with the data","The receiver calculates its own checksum from the data it received","The receiver compares the two checksums","If they are different, an error has happened and the data is sent again"])],
 "2-2-echo":[XO("How an echo check works","Drag the steps of an echo check into the correct order.",
   ["The sender transmits the data","The receiver stores the data","The receiver sends a copy of the data back to the sender","The sender compares the returned copy with the original","If they don't match, the data is sent again"])],
 "2-2-checkdigits":[XO("Using a check digit","Drag the steps for creating and using a check digit into the correct order.",
   ["A calculation is done on the digits of the number, for example a weighted sum","The check digit is worked out from the result of the calculation","The check digit is added to the end of the number","When the number is entered, the same calculation is done again","If the result doesn't match the check digit, an error is reported"])],
 "2-2-arq":[XO("ARQ step by step","Drag the steps of an automatic repeat query into the correct order.",
   ["The sender transmits a packet and starts a timer","The receiver checks the packet for errors, for example with a checksum","If there are no errors, the receiver sends a positive acknowledgement","If there is an error, the receiver sends a negative acknowledgement, or nothing","If the sender gets a negative acknowledgement or the timer runs out, it sends the packet again"])],
 "2-3-encryption":[XO("Sending a message with a symmetric key","Drag the steps into the correct order.",
   ["The sender and receiver agree on a secret key","The sender writes the message in plaintext","The sender encrypts the plaintext with the key","The ciphertext is sent across the network","The receiver decrypts the ciphertext with the same key"])],
 "2-3-asymmetric":[XO("Sending a message with asymmetric keys","Drag the steps into the correct order.",
   ["The receiver creates a public key and a private key","The receiver shares the public key","The sender encrypts the message with the receiver's public key","The ciphertext is sent across the network","The receiver decrypts it with their private key, which has never been shared"])],
 "3-1-vonneumann":[XO("Order the fetch stage","Drag the steps of the fetch stage of the fetch–decode–execute cycle into order.",
   ["The address in the PC is copied into the MAR","The address is sent along the address bus to RAM","The instruction at that address is sent along the data bus","The instruction is copied into the MDR","The instruction is copied from the MDR into the CIR","The PC is incremented to point to the next instruction"])],
 "3-1-buses":[XS("Which bus does this?","Drag each description into the box for the bus it describes.",{A:"Address bus",D:"Data bus",C:"Control bus"},
   {A:["Carries memory locations from the CPU","Only goes one way: from the CPU","Goes from the MAR to memory","Says where data should be read from or written to"],D:["Carries the actual data and instructions","Goes both ways between the CPU and memory","Fills the MDR with an instruction","Carries a value being written to RAM"],C:["Carries read and write signals","Carries the timing signals from the clock","Carries signals from the control unit","Tells memory whether to read or write"]},{per:3})],
 "3-1-instructions":[XS("Opcode or operand?","Each item is part of a machine code or assembly instruction. Drag it into the right box.",{O:"Opcode",P:"Operand"},
   {O:["LDA (load)","ADD","STO (store)","OUT","The part that says what to do","JMP (jump)"],P:["The address 25","The value #7","The memory location to store into","The data or address the instruction works on","The address to jump to","The number to add"]})],
 "3-2-input":[XS("Input or output?","Drag each device into the right box.",{I:"Input device",O:"Output device"},
   {I:["Barcode scanner","Microphone","Keyboard","Digital camera","Mouse","QR code scanner","Scanner"],O:["Speaker","Inkjet printer","Actuator","LED screen","Projector","3D printer","Headphones"]})],
 "3-2-sensors":[XS("Which sensor?","Drag each use into the box for the sensor it needs.",{T:"Temperature",L:"Light",M:"Moisture",P:"Pressure"},
   {T:["Keeping a greenhouse warm","Controlling central heating","Checking a fridge is cold enough"],L:["Turning street lights on at dusk","Adjusting phone screen brightness","Closing blinds when it's sunny"],M:["Watering plants when soil is dry","Turning on a car's wipers","Checking a bathroom for damp"],P:["Detecting a car at traffic lights","A burglar alarm under a mat","Counting people through a door"]},{per:2})],
 "3-4-nicmac":[XS("MAC or IP address?","Drag each statement into the box for the type of address it describes.",{M:"MAC address",I:"IP address"},
   {M:["Set when the NIC is made","48 bits, written as 6 pairs of hex digits","Identifies a device on a local network","Usually stays the same","Made up of a manufacturer code and a serial number"],I:["Can change when a device joins a different network","Used by routers to send data across the internet","IPv4 has 4 denary numbers separated by dots","Can be static or dynamic","Given by the network or ISP"]})],
 "4-1-osjobs":[XS("Name the job","Drag each example into the box for the operating system job it shows.",{F:"Managing files",M:"Managing memory",P:"Managing peripherals",S:"Security"},
   {F:["Letting you rename a folder","Saving a document to a chosen folder","Deleting a file to the recycle bin"],M:["Moving data between RAM and virtual memory","Stopping two programs using the same memory","Freeing memory when a program closes"],P:["Using a driver to talk to a printer","Queuing documents waiting to print","Recognising a new USB keyboard"],S:["Asking for a password at login","Setting up user accounts","Installing security updates"]},{per:2})],
 "4-2-assembly":[XS("High-level or low-level?","Drag each statement into the right box.",{H:"High-level language",L:"Low-level language"},
   {H:["Easy for people to read and write","Portable between different types of computer","One statement may become many machine code instructions","Needs a compiler or interpreter","Examples include Python and Java"],L:["Can directly control the hardware","Written for one type of processor","Each instruction usually matches one machine code instruction","Assembly language needs an assembler","Can be very fast and use little memory"]})],
 "4-2-ides":[XS("Syntax, logic or runtime error?","Drag each example into the box for the type of error.",{S:"Syntax error",L:"Logic error",R:"Runtime error"},
   {S:["Spelling PRINT as PRNIT","Missing a closing bracket","Forgetting ENDIF","Using a keyword as a variable name"],L:["Using > instead of >=","Adding when you meant to subtract","A loop that runs one time too few","Calculating an average with the wrong count"],R:["Dividing by zero","Opening a file that doesn't exist","Using an array index that's too big","Running out of memory"]},{per:3})],
 "5-1-web":[XS("Parts of a URL","Drag each part into the box for the part of a URL it is.",{P:"Protocol",D:"Domain name",F:"File or page name"},
   {P:["https","http","https://","http://"],D:["www.example.com","bitsofbytes.co","news.bbc.co.uk","www.cambridge.org"],F:["index.html","/about.html","/news/today.html","contact.htm"]},{per:3})],
 "5-1-pages":[XS("Who does this?","Drag each job into the box for the thing that does it.",{B:"Web browser",D:"DNS server",W:"Web server"},
   {B:["Renders HTML into a page you can see","Stores bookmarks and history","Sends the domain name to be looked up","Manages cookies"],D:["Looks up the IP address for a domain name","Stores a list of domain names and IP addresses","Passes the request to another DNS server if it doesn't know"],W:["Stores the files for a website","Sends the web page back as HTML","Responds to requests for pages"]},{per:3})],
 "5-1-cookies":[XO("How a cookie is used","Drag the steps for a shopping site using a cookie into the correct order.",
   ["You visit an online shop for the first time","The web server sends a small cookie file to your browser","Your browser stores the cookie","You come back to the site later","Your browser sends the cookie back to the server","The site uses it to remember you, for example your basket or login"])],
 "6-2-robots":[XS("Robot characteristics","Drag each example into the box for the characteristic of a robot it shows.",{M:"Mechanical structure",E:"Electrical components",P:"Programmable"},
   {M:["Wheels on a delivery robot","A robotic arm with joints","A gripper at the end of an arm","Legs on a walking robot"],E:["Sensors that detect obstacles","Motors that move the joints","A battery that powers it","A microprocessor that processes data"],P:["It follows a set of instructions","It can be given a new task by changing its program","It can be told where to move","Its behaviour is controlled by software"]},{per:3})],
 "6-2-roles":[XS("Advantage or disadvantage?","Drag each statement about using robots into the right box.",{A:"Advantage",D:"Disadvantage"},
   {A:["Can work 24 hours a day without breaks","Can work in dangerous places","Gives consistent results every time","Doesn't get tired or bored","Can be more accurate than a person"],D:["Expensive to buy and set up","Can replace people's jobs","Needs regular maintenance","Can only do what it has been programmed to do","Can stop working if it develops a fault"]})],
 "6-3-ai":[XS("AI or not AI?","Decide whether each system shows artificial intelligence.",{Y:"Artificial intelligence",N:"Not artificial intelligence"},
   {Y:["A chatbot that answers questions in natural language","A system that recognises faces in photos","A streaming service that learns what you like","A car that learns to recognise road signs","An expert system that diagnoses illnesses"],N:["A calculator adding two numbers","A light that switches on with a timer","A spreadsheet totalling a column","A washing machine following a fixed programme","A website showing the same page to everyone"]})],
 "6-3-ml":[XO("How machine learning works","Drag the stages of machine learning into the correct order.",
   ["Collect a large amount of data","Prepare the data, for example labelling examples","Train the model on the data","Test the model on new data it hasn't seen","Use the model to make predictions","Keep improving the model as it gets more data and feedback"])],
 "7-1-valver":[XS("Validation or verification?","Drag each statement into the right box.",{A:"Validation",E:"Verification"},
   {A:["A range check on an age","Checking a postcode is in the right format","A presence check on a required field","Done automatically by the computer","Checks the data is sensible or reasonable"],E:["Typing a new password twice","Reading back data to check it was copied correctly","A visual check against the original document","Checks the data matches what was intended","Double entry"]})],
 "7-1-trace":[XO("Doing a dry run","Drag the steps for completing a trace table into the correct order.",
   ["Draw a column for each variable, and one for output","Write in any starting values","Follow the algorithm one line at a time","Write a new value in a column each time a variable changes","Write anything that is output in the output column","Stop when the algorithm ends, and check the final values"])],
 "8-1-selection":[XS("IF or CASE?","Decide which statement is the better choice for each task.",{I:"IF … THEN … ELSE",C:"CASE OF"},
   {I:["Checking if an age is 18 or over","Checking if a password is correct","Testing two conditions joined with AND","Checking if a number is between 1 and 10"],C:["Choosing an action from a menu option 1 to 5","Printing the day name for a day number 1 to 7","Choosing a grade message for grade A, B, C or D","Picking a reply for a single key the user presses"]},{per:3})],
 "8-1-strings":[XS("Which function?","Drag each task into the box for the string function you'd use.",{S:"SUBSTRING",L:"LENGTH",U:"UCASE",W:"LCASE"},
   {S:["Getting the first 3 letters of a name","Taking the area code out of a phone number","Finding the 5th character of a word"],L:["Checking a password has at least 8 characters","Counting how many characters a message has","Looping through every character in a string"],U:["Turning 'cat' into 'CAT'","Making a username all capitals","Converting 'Yes' and 'yes' to 'YES' before comparing"],W:["Turning 'HELLO' into 'hello'","Storing every email address in small letters","Making a whole sentence lower case"]},{per:2})],
 "8-1-validation":[XS("Which check?","Drag each example into the box for the validation check it shows.",{R:"Range check",L:"Length check",T:"Type check",P:"Presence check"},
   {R:["Age must be from 11 to 18","Mark must be between 0 and 100","Month must be 1 to 12"],L:["A password must be at least 8 characters","A phone number must be 11 digits","A username can have at most 20 characters"],T:["Quantity must be a whole number","Price must be a number","Height must be a real number"],P:["Email address can't be left blank","A name must be entered","A required field must not be empty"]},{per:2})],
 "8-2-uses":[XS("1D or 2D array?","Decide which kind of array suits each set of data.",{O:"One-dimensional (1D) array",T:"Two-dimensional (2D) array"},
   {O:["The names of 30 students","A list of 7 daily temperatures","The prices of 10 items","The scores in a single game"],T:["A noughts and crosses board","Test marks for 30 students in 5 subjects","Hourly temperatures for each day of a week","Seats in a cinema arranged in rows and columns"]},{per:4})],
 "8-3-files":[XO("Writing to a file","Drag the pseudocode lines into the correct order to save a name to a file.",
   ["DECLARE Name : STRING","INPUT Name","OPENFILE \"Names.txt\" FOR WRITE","WRITEFILE \"Names.txt\", Name","CLOSEFILE \"Names.txt\""])],
 "10-1-universal":[XS("NAND, NOR or NOT?","Drag each expression into the box for the single gate it is the same as.",{N:"NAND",R:"NOR",T:"NOT A"},
   {N:["NOT (A AND B)","(NOT A) OR (NOT B)","A NAND B","NOT (B AND A)"],R:["NOT (A OR B)","(NOT A) AND (NOT B)","A NOR B","NOT (B OR A)"],T:["A NAND A","A NOR A","NOT A","NOT (A AND A)"]},{per:3})]
};
/* attach them, numbering on from the lesson's existing activities */
ALL_LESSONS.forEach(l=>{const add=EXTRA_ACTS[l.id];if(!add)return;l.acts=l.acts||[];
  add.forEach(a=>{const n=l.acts.length+1;l.acts.push(Object.assign({id:"act"+n,title:"Activity "+n},a))})});
