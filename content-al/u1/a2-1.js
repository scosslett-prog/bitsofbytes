/* 2.1 Numbers */
L("a2-1",[
{slug:"bases",title:"Binary, denary and hexadecimal",covers:[1],
 v:[["Denary","Base 10: the number system people use, with digits 0 to 9."],
  ["Binary","Base 2: the number system computers use, with digits 0 and 1."],
  ["Hexadecimal","Base 16: digits 0 to 9 and A to F, where A = 10 and F = 15. One hex digit stands for 4 bits."],
  ["Place value","The value of a digit's position: powers of 2 in binary (1, 2, 4, 8…) and powers of 16 in hex (1, 16, 256…)."],
  ["Most significant bit (MSB)","The leftmost bit, which has the largest place value."],
  ["Least significant bit (LSB)","The rightmost bit, worth 1."],
  ["Unsigned integer","A whole number with no sign, so every bit adds to the value (0 to 255 in 8 bits)."]],
 q:[["What is 1011 0101 in denary?","181","173","191","117"],
  ["What is 200 in 8-bit binary?","1100 1000","1010 0000","1000 1100","1100 0100"],
  ["What is 0011 1110 in hexadecimal?","3E","3D","E3","62"],
  ["Why do programmers use hexadecimal?","It's shorter and easier to read than binary, and converts easily","Computers process hex faster","It uses less memory","It can store negative numbers"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Number bases · 8 questions",gen:"albase",type:"mixed",explain:"Convert unsigned integers between binary, denary and hexadecimal. Use place values 128, 64, 32, 16, 8, 4, 2, 1 for binary, and split into nibbles for hex. New numbers every try."}]},
{slug:"units",title:"Units and number of states",covers:[2],
 v:[["Bit (b)","A single binary digit, 0 or 1. The smallest unit of data."],
  ["Nibble","4 bits: exactly one hexadecimal digit."],
  ["Byte (B)","8 bits."],
  ["IEC binary prefixes","Prefixes based on powers of 2: kibi (Ki) = 2¹⁰ = 1024, mebi (Mi) = 2²⁰, gibi (Gi) = 2³⁰, tebi (Ti) = 2⁴⁰. Used for memory and file sizes."],
  ["SI decimal prefixes","Prefixes based on powers of 10: kilo (k) = 10³, mega (M) = 10⁶, giga (G) = 10⁹, tera (T) = 10¹². Used for transmission speeds."],
  ["Number of states","How many different values n bits can represent: 2ⁿ."]],
 q:[["How many bytes are in 1 KiB?","1024","1000","8","8192"],
  ["How many different values can 10 bits represent?","1024","10","100","512"],
  ["Which unit is larger?","1 GiB","1 GB","They're the same","1 MiB"],
  ["Which prefix is normally used for network speeds?","Decimal (SI), e.g. Mbps","Binary (IEC), e.g. MiB","Hexadecimal","Nibbles"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Units · 8 questions",gen:"alunits",type:"mixed",explain:"Convert between units, using ×1024 for binary prefixes and ×1000 for decimal prefixes, and work out how many states n bits can represent (2ⁿ). New numbers every try."}]},
{slug:"twos",title:"Two's complement",covers:[3],
 v:[["Signed integer","A whole number that can be positive or negative."],
  ["Two's complement","A way of representing signed integers in which the MSB has a negative place value (−128 in 8 bits)."],
  ["Sign bit","The MSB in two's complement: 0 means positive (or zero), 1 means negative."],
  ["Negation","Changing the sign of a number. In two's complement: flip every bit, then add 1."],
  ["Range (8-bit two's complement)","−128 to +127."],
  ["Range (n-bit two's complement)","−2ⁿ⁻¹ to 2ⁿ⁻¹ − 1."]],
 q:[["What is 1111 1111 in 8-bit two's complement?","−1","255","−127","−255"],
  ["What is the range of 8-bit two's complement?","−128 to +127","−127 to +127","0 to 255","−255 to +255"],
  ["How do you negate a two's complement number?","Flip all the bits, then add 1","Flip the MSB only","Add 128","Shift it left"],
  ["What is −5 in 8-bit two's complement?","1111 1011","1000 0101","1111 1010","0000 0101"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Two's complement · 8 questions",gen:"altc",type:"mixed",explain:"Convert between denary and 8-bit two's complement, and negate numbers. The MSB is worth −128. To negate, flip the bits and add 1. New numbers every try."}]},
{slug:"fixed",title:"Fixed-point binary",covers:[4],
 v:[["Fixed-point binary","A way of storing fractional numbers with the binary point in a fixed position, chosen in advance."],
  ["Binary point","The point separating the whole-number bits from the fractional bits."],
  ["Fractional place values","After the binary point: ½ (0.5), ¼ (0.25), ⅛ (0.125), 1/16 (0.0625)…"],
  ["Precision","How finely numbers can be stored; more fractional bits gives more precision."],
  ["Range","The smallest to largest values that can be stored; more whole-number bits gives a bigger range."],
  ["Signed fixed point","Fixed point using two's complement, so the MSB has a negative place value."]],
 q:[["What is the place value of the first bit after the binary point?","½","¼","2","1"],
  ["What is 0101.1000 (signed, 4.4 fixed point) in denary?","5.5","5.25","−2.5","11"],
  ["Moving the binary point one place right (same number of bits)…","increases range and reduces precision","increases precision and range","reduces range and precision","changes nothing"],
  ["Why can't 0.1 be stored exactly in fixed-point binary?","It isn't a sum of powers of ½","It's negative","It needs a sign bit","It's too large"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Fixed point · 8 questions",gen:"alfixed",type:"mixed",explain:"Convert between denary and signed fixed-point binary. The MSB is negative; after the point the place values are ½, ¼, ⅛ and so on. New numbers every try."}]}]);

P("a2-1-bases",`Denary | Base 10
Binary | Base 2
Hexadecimal | Base 16
1111 1111 | 255
1000 0000 | 128
0001 0000 | 16 in denary
Hex A | 10
Hex F | 15
Hex 3E | 0011 1110
Hex 1F | 31
Hex 2A | 42
200 | 1100 1000
100 | 0110 0100
MSB | Leftmost bit
LSB | Rightmost bit, worth 1
One hex digit | 4 bits
Why hex? | Short and easy to read
Place values in hex | 1, 16, 256`);

P("a2-1-units",`Bit | 0 or 1
Nibble | 4 bits
Byte | 8 bits
1 KiB | 1024 bytes
1 kB | 1000 bytes
1 MiB | 1024 KiB
1 MB | 1000 kB
1 GiB | 1024 MiB
1 TiB | 1024 GiB
Kibi | 2 to the 10
Mega | 10 to the 6
Binary prefixes for | Memory and file sizes
Decimal prefixes for | Network speeds
8 bits of states | 256
10 bits of states | 1024
n bits of states | 2 to the n
Mbps | Million bits per second
Tera | 10 to the 12`);

P("a2-1-twos",`Two's complement | Signed integers
MSB in 8 bits | Worth −128
Sign bit 1 | Negative
Sign bit 0 | Positive or zero
1111 1111 | −1
1000 0000 | −128
0111 1111 | +127
1111 1110 | −2
1111 1011 | −5
1000 0001 | −127
8-bit range | −128 to +127
16-bit lowest value | −32768
Negate | Flip bits, add 1
Negate 0000 0011 | 1111 1101
Negate 1111 1111 | 0000 0001
Zero | 0000 0000
Only one zero | Unlike sign and magnitude
Add a sign bit | Halves the positive range`);

P("a2-1-fixed",`Binary point | Fixed position
First bit after point | ½
Second bit after point | ¼
Third bit after point | ⅛
0.75 | .11
0.375 | .011
0101.1000 | 5.5
0010.0100 | 2.25
1111.1000 | −0.5
1000.0000 | −8
0001.0010 | 1.125
More fractional bits | More precision
More whole bits | More range
0.1 in binary | Can't be exact
Signed fixed point MSB | Negative place value
Fixed point benefit | Simple, fast arithmetic
Fixed point drawback | Limited range
Point moved right | Range up, precision down`);
