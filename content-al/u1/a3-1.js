/* 3.1 Network fundamentals and 3.2 Encryption */
L("a3-1",[
{slug:"components",title:"Network components and media",covers:[1],
 v:[["Network interface card (NIC)","Hardware that connects a device to a network; it has a unique MAC address."],
  ["Switch","Connects devices on a local network and sends each frame only to the device it is addressed to, using MAC addresses."],
  ["Home router","A single box combining a router, switch, wireless access point, modem and firewall for a home network."],
  ["Router","Forwards packets between different networks, using IP addresses."],
  ["Modem","Converts between the digital signals of a computer and the signals used on the line to the internet service provider."],
  ["Wireless access point (WAP)","Lets wireless devices join a wired network."],
  ["Transmission media","What carries the signal: copper cable (electricity), fibre-optic cable (light) or wireless (radio waves)."],
  ["Firewall","Hardware or software that checks traffic coming into or leaving a network and blocks traffic that breaks its rules."]],
 q:[["Which device forwards data between different networks?","Router","Switch","NIC","Wireless access point"],
  ["Which medium carries data as pulses of light?","Fibre-optic cable","Copper cable","Wireless","Coaxial cable"],
  ["What does a switch use to decide where to send a frame?","The MAC address","The IP address","The URL","The port number"],
  ["What is a firewall for?","Blocking traffic that breaks a set of rules","Speeding up the network","Converting signals for the phone line","Giving out IP addresses"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Components · 8 questions",gen:"bank",bank:"al-netcomp",explain:"Questions on network hardware, transmission media and firewalls. Every try picks a different set."}]},
{slug:"performance",title:"Bandwidth, transfer rate and latency",covers:[2],
 v:[["Bandwidth","The maximum amount of data that can be sent over a connection per second, measured in bits per second."],
  ["Transfer rate","The amount of data actually transferred per second; usually less than the bandwidth."],
  ["Latency","The delay between data being sent and arriving, measured in milliseconds."],
  ["Range","How far a signal can travel before it becomes too weak to use."],
  ["Transfer time","Time = file size in bits ÷ transfer rate in bits per second."],
  ["Congestion","Too much traffic on a network at once, which reduces transfer rates and increases latency."]],
 q:[["A 10 MB file is sent at 20 Mbps. How long does it take? (1 MB = 1,000,000 bytes)","4 seconds","0.5 seconds","2 seconds","200 seconds"],
  ["What is latency?","The delay before data arrives","The amount of data sent per second","The distance a signal travels","The size of a packet"],
  ["Which matters most for online gaming?","Low latency","High range","Large file sizes","Many switches"],
  ["Why is the actual transfer rate usually lower than the bandwidth?","Congestion, interference and extra data such as packet headers","Bandwidth is measured in bytes","Latency is always zero","Files get larger when they're sent"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Transfer time · 8 questions",gen:"alxfer",type:"mixed",explain:"Calculate transfer times and file sizes. Convert the file size to bits (× 8) first, then time = bits ÷ rate. New numbers every try."}]},
{slug:"addressing",title:"IP and MAC addresses",covers:[3],
 v:[["IP address","A logical address given to a device on a network, used to route packets between networks. It can change."],
  ["IPv4","A 32-bit IP address written as four denary numbers 0–255, e.g. 192.168.1.20."],
  ["IPv6","A 128-bit IP address written as eight groups of four hex digits separated by colons."],
  ["MAC address","A 48-bit physical address burned into a NIC by the manufacturer, written as six pairs of hex digits."],
  ["Network address","The part of an IP address shared by every device on the same network."],
  ["Host address","The part of an IP address that identifies one device on the network."],
  ["Subnet mask","A pattern that shows which bits of an IP address are the network part (1s) and which are the host part (0s)."]],
 q:[["How many bits are in an IPv4 address?","32","48","128","64"],
  ["Why was IPv6 introduced?","IPv4 was running out of addresses","IPv4 was too slow","MAC addresses were running out","To encrypt data"],
  ["Which address is used to deliver frames within a local network?","MAC address","IPv4 address","IPv6 address","URL"],
  ["192.168.1.20 with subnet mask 255.255.255.0. What is the network address?","192.168.1.0","192.168.0.0","0.0.0.20","255.255.255.20"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Addressing · 8 questions",gen:"bank",bank:"al-addressing",explain:"Questions on IPv4, IPv6 and MAC addresses, including network addresses and Python that works with addresses. Every try picks a different set."}]}]);

L("a3-2",[
{slug:"keys",title:"Symmetric and asymmetric encryption",covers:[1,2],
 v:[["Encryption","Scrambling data with an algorithm and a key so that only someone with the right key can read it."],
  ["Plaintext","The original, readable data."],
  ["Ciphertext","The encrypted, unreadable data."],
  ["Key","A value used by the encryption algorithm; without the right key the ciphertext can't be decrypted."],
  ["Symmetric encryption","The same key is used to encrypt and decrypt; both sides must already share it."],
  ["Key exchange","The problem (and methods) of sharing a symmetric key safely before encrypted communication begins."],
  ["Asymmetric encryption","Uses a key pair: data encrypted with the public key can only be decrypted with the matching private key."],
  ["Public key","The key of a pair that is shared openly, used by others to encrypt data for the key's owner."],
  ["Private key","The key of a pair kept secret by its owner, used to decrypt data encrypted with their public key."]],
 q:[["In symmetric encryption, how many keys are used?","One shared key","A public and a private key","None","One per character"],
  ["Ana wants to send Ben a message using asymmetric encryption. Which key does she encrypt it with?","Ben's public key","Ben's private key","Ana's private key","Ana's public key"],
  ["What is the main problem with symmetric encryption?","The key must be shared safely in advance","It is very slow","It can't encrypt text","It needs two keys"],
  ["Does encryption stop data being intercepted?","No, it stops intercepted data being understood","Yes, encrypted data can't be intercepted","Only on wireless networks","Only for passwords"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Keys · 8 questions",gen:"bank",bank:"al-keys",explain:"Questions on why data is encrypted and on symmetric and asymmetric encryption. Every try picks a different set."}]},
{slug:"ciphers",title:"Substitution and Vernam ciphers",covers:[3,4],
 v:[["Monoalphabetic substitution cipher","Each letter of the alphabet is always replaced by the same different letter, given by a key."],
  ["Frequency analysis","Breaking a substitution cipher by matching the most common ciphertext letters to the most common letters in the language (E, T, A…)."],
  ["Vernam cipher","Encrypts each bit (or character) of the plaintext by XORing it with the matching bit of a one-time pad key."],
  ["One-time pad","A key that is truly random, at least as long as the message, kept secret and used only once."],
  ["XOR","Exclusive OR: the result is 1 when the two bits are different. XORing twice with the same key gives back the original."],
  ["Perfect secrecy","When the ciphertext gives no information at all about the plaintext; the Vernam cipher has it if the rules are followed."]],
 q:[["What is 0110 XOR 1100?","1010","0100","1110","0010"],
  ["Why is a monoalphabetic substitution cipher easy to break?","Letter frequencies are kept, so frequency analysis works","The key is always public","It uses XOR","It can only encrypt numbers"],
  ["How is Vernam ciphertext decrypted?","XOR it with the same key again","XOR it with the plaintext","Shift each letter back","Use the public key"],
  ["Which rule must the Vernam key follow?","It must be used only once","It must be shorter than the message","It must be a word","It must be public"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Substitution · 8 questions",gen:"almono",type:"mixed",explain:"Encrypt and decrypt with a monoalphabetic substitution key. Find the plaintext letter in the top row and read the cipher letter under it; reverse it to decrypt. A new key every try."},
  {id:"act2",title:"Activity 2",desc:"Vernam cipher · 8 questions",gen:"alvernam",type:"mixed",explain:"Encrypt and decrypt with the Vernam cipher by XORing each bit with the key. XOR gives 1 when the bits differ. New messages and keys every try."}]}]);

B("al-netcomp",[
 {t:"mc",q:"What does every NIC have that is unique?",a:"A MAC address",w:["An IPv4 address","A domain name","A subnet mask"]},
 {t:"mc",q:"Which device connects a home network to the ISP's line by converting signals?",a:"Modem",w:["Switch","NIC","Wireless access point"]},
 {t:"mc",q:"Why is a switch better than sending every frame to every device?",a:"Less unnecessary traffic, and devices don't receive data meant for others",w:["It encrypts all data","It gives out IP addresses","It converts light to electricity"]},
 {t:"mc",q:"Which is a benefit of fibre-optic over copper cable?",a:"Higher bandwidth over much longer distances, with no electrical interference",w:["It's cheaper to buy and fit","It's easier to bend round corners","It carries electricity to devices"]},
 {t:"mc",q:"Which is a drawback of wireless connections?",a:"Interference and walls reduce speed and range",w:["Devices can't move about","Cables are needed for every device","They can't connect to the internet"]},
 {t:"mc",q:"What's the difference between a hardware and a software firewall?",a:"A hardware firewall protects the whole network; a software firewall protects the device it's installed on",w:["Only software firewalls can block traffic","Hardware firewalls only work on Wi-Fi","There is no difference"]},
 {t:"mc",q:"Which devices are usually combined in a home router?",a:"Router, switch, wireless access point, modem and firewall",w:["Only a NIC","A server and a printer","A CPU and RAM"]},
 {t:"mc",q:"A school adds laptops that need to connect to its wired network without cables. What is needed?",a:"Wireless access points",w:["More switches","Fibre-optic cable","Modems"]},
 {t:"mc",q:"Which address does a router use to forward packets between networks?",a:"IP address",w:["MAC address","Port number","Code point"]},
 {t:"mc",q:"A firewall rule blocks all incoming traffic on a port except from known addresses. What is this protecting against?",a:"Unauthorised access from outside the network",w:["Hard disk failure","Power cuts","Slow transfer rates"]},
 {t:"blank",q:"Fibre-optic cable carries data as pulses of ___.",a:["light"]},
 {t:"blank",q:"NIC stands for network interface ___.",a:["card","controller"]}]);

B("al-addressing",[
 {t:"mc",q:"How many bits are in a MAC address?",a:"48",w:["32","128","64"]},
 {t:"mc",q:"How many bits are in an IPv6 address?",a:"128",w:["32","48","64"]},
 {t:"mc",q:"Which is a valid IPv4 address?",a:"172.16.254.3",w:["256.10.1.1","10.0.1","FE80::1"]},
 {t:"mc",q:"Which is written as six pairs of hex digits?",a:"A MAC address",w:["An IPv4 address","An IPv6 address","A subnet mask"]},
 {t:"mc",q:"Which statement is true?",a:"A device's IP address can change; its MAC address normally doesn't",w:["MAC addresses change every time you connect","IP addresses are burned into the NIC","Both always stay the same"]},
 {t:"mc",q:"How many different IPv4 addresses are possible?",a:"2³² (about 4.3 billion)",w:["2⁴⁸","2¹²⁸","256"]},
 {t:"mc",q:"Subnet mask 255.255.255.0. How many bits are in the host part?",a:"8",w:["24","16","32"]},
 {t:"mc",q:"10.1.4.77 with subnet mask 255.255.0.0. What is the network address?",a:"10.1.0.0",w:["10.0.0.0","10.1.4.0","0.0.4.77"]},
 {t:"mc",q:"Two devices have IP addresses 192.168.5.12 and 192.168.6.12, both with mask 255.255.255.0. Are they on the same network?",a:"No: the network parts differ",w:["Yes: the host parts match","Yes: all 192.168 addresses are one network","It depends on their MAC addresses"]},
 {t:"mc",html:`<pre class="pc py">ip = "192.168.1.20"
parts = ip.split(".")
print(len(parts), parts[-1])</pre>`,q:"What does this Python print?",a:"4 20",w:["3 20","4 192","12 0"]},
 {t:"mc",html:`<pre class="pc py">ip = [192, 168, 1, 20]
mask = [255, 255, 255, 0]
net = [ip[i] &amp; mask[i] for i in range(4)]
print(net)</pre>`,q:"What does this Python print?",a:"[192, 168, 1, 0]",w:["[255, 255, 255, 0]","[192, 168, 1, 20]","[0, 0, 0, 20]"]},
 {t:"mc",html:`<pre class="pc py">print(format(168, "08b"))</pre>`,q:"What does this print?",a:"10101000",w:["10100100","01010100","10001010"]}]);

B("al-keys",[
 {t:"mc",q:"Why are online payments encrypted?",a:"So card details can't be read if they're intercepted",w:["So the payment goes through faster","So the bank can't see them","To make the data smaller"]},
 {t:"mc",q:"Which is a drawback of encryption?",a:"If the key is lost, the data can't be recovered",w:["Encrypted data can't be sent over a network","It stops data being intercepted","It makes files easier to read"]},
 {t:"mc",q:"Ben receives a message encrypted with his public key. Which key decrypts it?",a:"Ben's private key",w:["Ben's public key","The sender's private key","The sender's public key"]},
 {t:"mc",q:"Why can a public key be shared with anyone?",a:"It can only encrypt; only the private key can decrypt",w:["It's too long to guess","It changes every second","It's only used once"]},
 {t:"mc",q:"Which is an advantage of symmetric encryption over asymmetric?",a:"It is much faster",w:["No key needs to be shared","It uses two keys","It's impossible to break"]},
 {t:"mc",q:"How do secure websites often use both kinds of encryption?",a:"Asymmetric encryption is used to share a symmetric key, which then encrypts the data",w:["Symmetric for the URL, asymmetric for images","They take turns for each packet","They never use both"]},
 {t:"mc",q:"An attacker intercepts some ciphertext. What do they need to read it?",a:"The decryption key",w:["The plaintext","The sender's IP address","A faster computer only"]},
 {t:"mc",q:"Twenty people each want to message each other privately with symmetric keys. What's the problem?",a:"Lots of keys must be shared safely between every pair",w:["Only one message can be sent","Symmetric keys can't be used by groups","They need twenty private keys each"]},
 {t:"mc",q:"Which data is it most important to encrypt on a lost laptop?",a:"Personal and confidential files",w:["The operating system's help files","Public web pages","Programs downloaded from the internet"]},
 {t:"mc",q:"What does encryption NOT protect against?",a:"Data being deleted or the network being flooded",w:["Intercepted data being read","Stolen files being read","Passwords being read in transit"]},
 {t:"blank",q:"The readable form of a message, before encryption, is called ___.",a:["plaintext","plain text"]},
 {t:"blank",q:"In asymmetric encryption, the key that is kept secret is the ___ key.",a:["private"]}]);

P("a3-1-components",`NIC | Connects a device to a network
Switch | Forwards frames by MAC address
Router | Links different networks
Modem | Converts signals for the ISP
Wireless access point | Joins wireless to wired
Home router | Many devices in one box
Firewall | Blocks traffic by rules
Hardware firewall | Protects the whole network
Software firewall | Protects one device
Copper cable | Electrical signals
Fibre-optic cable | Pulses of light
Wireless | Radio waves
Fibre benefit | Long range, high bandwidth
Copper benefit | Cheap and easy to fit
Wireless benefit | Devices can move
Wireless drawback | Interference and walls
Unique to each NIC | MAC address
Router uses | IP addresses`);

P("a3-1-performance",`Bandwidth | Maximum bits per second
Transfer rate | Actual bits per second
Latency | Delay before data arrives
Range | How far a signal reaches
Time | Size in bits ÷ rate
File size in bits | Bytes × 8
1 Mbps | 1,000,000 bits per second
10 MB at 20 Mbps | 4 seconds
1 MB at 8 Mbps | 1 second
100 Mbps for 8 s | 100 MB
Congestion | Too much traffic at once
Gaming needs | Low latency
Streaming needs | High transfer rate
Latency unit | Milliseconds
Lower than bandwidth | Real transfer rate
Packet headers | Extra data sent
Fibre range | Kilometres
Wi-Fi range | Tens of metres`);

P("a3-1-addressing",`IPv4 | 32 bits
IPv6 | 128 bits
MAC address | 48 bits
IPv4 written as | Four numbers 0 to 255
IPv6 written as | Eight groups of hex
MAC written as | Six pairs of hex
Why IPv6? | IPv4 addresses ran out
IP address | Logical, can change
MAC address set by | The manufacturer
Network address | Shared by the network
Host address | Identifies one device
Subnet mask | Marks the network bits
255.255.255.0 | 24 network bits
Network part found by | IP AND mask
192.168.1.20 /24 network | 192.168.1.0
Used within a LAN | MAC to deliver frames
Used between networks | IP to route packets
2 to the 32 | Number of IPv4 addresses`);

P("a3-2-keys",`Encryption | Scrambles data with a key
Plaintext | Readable data
Ciphertext | Scrambled data
Key | Value used by the algorithm
Symmetric | One shared key
Asymmetric | Public and private keys
Key exchange | Sharing a symmetric key
Public key | Shared with anyone
Private key | Kept secret
Encrypt for Ben with | Ben's public key
Ben decrypts with | Ben's private key
Symmetric benefit | Fast
Symmetric drawback | Key must be shared safely
Asymmetric benefit | No secret key to share
Asymmetric drawback | Slower
HTTPS uses both | Asymmetric shares a key
Encryption stops | Data being understood
Encryption doesn't stop | Interception`);

P("a3-2-ciphers",`Substitution cipher | Each letter swapped
Monoalphabetic | Same swap every time
Frequency analysis | Breaks substitution ciphers
Most common English letter | E
Vernam cipher | XOR with a one-time pad
0 XOR 0 | 0
1 XOR 0 | 1
1 XOR 1 | 0 (same bits)
0110 XOR 1100 | 1010
Decrypt Vernam | XOR with the key again
Key must be | Truly random
Key length | At least the message
Key reuse | Never
Perfect secrecy | Vernam used correctly
Vernam drawback | Sharing such a long key
Substitution key | A shuffled alphabet
Number of shuffled keys | 26 factorial
Caesar cipher | A shift of the alphabet`);
