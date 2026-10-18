/* 2.2 Binary arithmetic and 2.3 Text */
L("a2-2",[
{slug:"addsub",title:"Binary addition, subtraction and overflow",covers:[1,3],
 v:[["Binary addition rules","0+0=0, 0+1=1, 1+1=0 carry 1, 1+1+1=1 carry 1."],
  ["Carry","A 1 passed to the next column on the left when a column adds up to 2 or more."],
  ["Binary subtraction","In two's complement, a − b is worked out as a + (−b): negate b, then add."],
  ["Overflow","When the result of a calculation is too large to fit in the number of bits available."],
  ["Underflow","When the result is too small (too negative, or closer to zero than can be represented) to be stored."],
  ["Overflow flag","A bit in the status register that is set when a signed calculation overflows."],
  ["Carry flag","A bit in the status register set when a carry goes out of the MSB."]],
 q:[["What is 0110 1010 + 0001 0111?","1000 0001","0111 1001","1000 0011","0111 0001"],
  ["How do you work out a − b in two's complement?","Add a to the two's complement of b","Subtract each bit separately","Flip a then add b","Add 128 to both"],
  ["In 8-bit unsigned, 200 + 100 gives…","overflow, because 300 is more than 255","underflow","the correct answer, 300","a negative number"],
  ["Two positive two's complement numbers add to give a negative result. What happened?","Overflow","Underflow","A carry into the LSB","Nothing: this is normal"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Binary arithmetic · 8 questions",gen:"alarith",type:"mixed",explain:"Add and subtract 8-bit binary numbers, and spot overflow. To subtract in two's complement, negate the second number and add, ignoring any carry out of the 8th bit. New numbers every try."},
  {id:"act2",title:"Activity 2",desc:"Overflow and underflow · 8 questions",gen:"bank",bank:"al-overflow",explain:"Questions on overflow, underflow and the status flags, including some Python to read. Every try picks a different set."}]},
{slug:"shifts",title:"Shifts and bit masks",covers:[2],
 v:[["Logical shift","Moves every bit left or right; the empty places are filled with 0s and bits shifted off the end are lost."],
  ["Arithmetic shift right","Moves bits right but copies the sign bit into the empty places, so a two's complement number keeps its sign."],
  ["Shift left by n","Multiplies by 2ⁿ (if no 1s are lost off the left)."],
  ["Shift right by n","Divides by 2ⁿ, rounding down (losing any remainder)."],
  ["Bit mask","A binary pattern combined with a value using AND, OR or XOR, to check or change particular bits."],
  ["AND mask","Clears bits (where the mask has 0) and checks bits (where the mask has 1)."],
  ["OR mask","Sets bits to 1 where the mask has 1."],
  ["XOR mask","Toggles (flips) bits where the mask has 1."]],
 q:[["0001 0110 logical shift left 2 gives…","0101 1000","0000 0101","0101 1001","1011 0000"],
  ["Which mask operation sets a bit to 1?","OR","AND","XOR","NOT"],
  ["1100 1010 AND 0000 1111 gives…","0000 1010","1100 1111","1100 0101","0000 0101"],
  ["Why use an arithmetic shift right on a negative number?","It keeps the sign bit, so the result stays negative","It's faster","It multiplies by 2","It flips the bits"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Shifts and masks · 8 questions",gen:"alshift",type:"mixed",explain:"Carry out logical and arithmetic shifts and apply AND, OR and XOR masks. AND clears, OR sets, XOR flips. New numbers every try."},
  {id:"act2",title:"Activity 2",desc:"Bitwise Python · 8 questions",gen:"bank",bank:"al-bitwise",explain:"Read short Python programs that use the bitwise operators &, |, ^, << and >>, and work out what they do. Every try picks a different set."}]}]);

L("a2-3",[
{slug:"encoding",title:"Character encoding",covers:[1],
 v:[["Character set","A defined list of characters, each with a unique binary code."],
  ["ASCII","A 7-bit character set with 128 characters: English letters, digits, punctuation and control codes."],
  ["Extended ASCII","An 8-bit version of ASCII with 256 characters; the extra 128 vary between code pages (e.g. accented letters)."],
  ["Unicode","A standard that gives every character in every writing system its own code point, e.g. U+0041 for A."],
  ["Code point","The unique number Unicode gives a character, written U+ followed by hex."],
  ["UTF-8","A variable-length encoding of Unicode using 1 to 4 bytes per character. ASCII characters use 1 byte and keep their ASCII codes."],
  ["Control character","A non-printing code such as line feed (10) or carriage return (13)."]],
 q:[["How many characters can 7-bit ASCII represent?","128","256","127","65,536"],
  ["Why was Unicode introduced?","To represent the characters of every language","To make files smaller","To replace binary","Because ASCII couldn't store digits"],
  ["How many bytes does UTF-8 use for an ASCII character like 'A'?","1","2","4","It varies by computer"],
  ["The ASCII code for 'a' is 97. What is the code for 'd'?","100","98","68","101"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Character sets · 8 questions",gen:"bank",bank:"al-encoding",explain:"Questions on ASCII, extended ASCII, Unicode and UTF-8, with some Python using ord() and chr(). Every try picks a different set."}]}]);

B("al-overflow",[
 {t:"mc",q:"8-bit unsigned: 1111 0000 + 0010 0000. What happens?",a:"Overflow: a 1 is carried out of the 8th bit",w:["Underflow","The answer is 1 0001 0000 and fits","Nothing unusual"]},
 {t:"mc",q:"8-bit two's complement: 0110 0000 + 0110 0000 = 1100 0000. Why is this wrong?",a:"96 + 96 = 192 is above +127, so it has overflowed into the sign bit",w:["The addition rules were broken","1100 0000 is correct","It underflowed"]},
 {t:"mc",q:"8-bit two's complement: 1000 0000 − 0000 0001. What happens?",a:"Underflow: −129 is below −128",w:["The answer is −129","Overflow of the carry flag only","The answer is 0"]},
 {t:"mc",q:"When adding two's complement numbers with different signs, can overflow happen?",a:"No, the result is always between the two numbers",w:["Yes, always","Only if both are large","Only with subtraction"]},
 {t:"mc",q:"What is the largest number an 8-bit unsigned addition can produce without overflow?",a:"255",w:["127","256","128"]},
 {t:"mc",q:"A program keeps adding to an 8-bit unsigned counter. What happens after 255?",a:"It wraps round to 0",w:["It becomes 256","It stops at 255","It becomes −1"]},
 {t:"mc",q:"How can a program avoid overflow?",a:"Use more bits for the variable, or check the range before calculating",w:["Use hexadecimal","Shift the number left","Use an AND mask"]},
 {t:"mc",q:"Which status register flag shows that a signed result is wrong because of overflow?",a:"Overflow flag (V)",w:["Zero flag (Z)","Carry flag (C)","Negative flag (N)"]},
 {t:"mc",html:`<pre class="pc py">x = 250
x = (x + 10) % 256    # simulate an 8-bit register
print(x)</pre>`,q:"What does this Python print?",a:"4",w:["260","10","250"]},
 {t:"mc",html:`<pre class="pc py">a, b = 100, 60
total = a + b
if total > 127:
    print("overflow")
else:
    print(total)</pre>`,q:"This program checks for 8-bit signed overflow. What does it print?",a:"overflow",w:["160","−96","127"]},
 {t:"blank",q:"When a result is too large for the number of bits available, it is called ___.",a:["overflow"]},
 {t:"blank",q:"In binary, 1 + 1 = 0 carry ___.",a:["1","one"]}]);

B("al-bitwise",[
 {t:"mc",html:`<pre class="pc py">print(0b1100 &amp; 0b1010)</pre>`,q:"What is printed?",a:"8",w:["14","6","12"]},
 {t:"mc",html:`<pre class="pc py">print(0b1100 | 0b1010)</pre>`,q:"What is printed?",a:"14",w:["8","6","10"]},
 {t:"mc",html:`<pre class="pc py">print(0b1100 ^ 0b1010)</pre>`,q:"What is printed?",a:"6",w:["14","8","2"]},
 {t:"mc",html:`<pre class="pc py">print(5 &lt;&lt; 3)</pre>`,q:"What is printed?",a:"40",w:["15","8","53"]},
 {t:"mc",html:`<pre class="pc py">print(200 &gt;&gt; 2)</pre>`,q:"What is printed?",a:"50",w:["800","100","198"]},
 {t:"mc",html:`<pre class="pc py">status = 0b0010_0110
if status &amp; 0b0000_0100:
    print("bit 2 is set")
else:
    print("bit 2 is clear")</pre>`,q:"What is printed?",a:"bit 2 is set",w:["bit 2 is clear","An error","Nothing"]},
 {t:"mc",html:`<pre class="pc py">flags = 0b1011_0000
flags = flags | 0b0000_0001
print(bin(flags))</pre>`,q:"What is printed?",a:"0b10110001",w:["0b10110000","0b1","0b1011"]},
 {t:"mc",html:`<pre class="pc py">value = 0b1111_1111
value = value &amp; 0b1111_0000
print(value)</pre>`,q:"What is printed?",a:"240",w:["15","255","0"]},
 {t:"mc",q:"Which mask and operation clear the lower 4 bits of a byte and keep the rest?",a:"AND with 1111 0000",w:["OR with 1111 0000","XOR with 0000 1111","AND with 0000 1111"]},
 {t:"mc",q:"Which mask and operation flip every bit of a byte?",a:"XOR with 1111 1111",w:["AND with 1111 1111","OR with 1111 1111","AND with 0000 0000"]},
 {t:"mc",q:"What is 0110 1100 logical shift right 3?",a:"0000 1101",w:["0110 0000","1000 1101","0011 0110"]},
 {t:"mc",q:"What is 1110 0000 (−32) arithmetic shift right 2?",a:"1111 1000 (−8)",w:["0011 1000 (56)","1000 0000 (−128)","0111 1000 (120)"]}]);

B("al-encoding",[
 {t:"mc",q:"Why does ASCII use 7 bits?",a:"2⁷ = 128 codes is enough for English characters and control codes",w:["Computers can't store 8 bits","To leave space for Unicode","To save one byte per character"]},
 {t:"mc",q:"What is the problem with extended ASCII?",a:"The upper 128 characters differ between code pages, so text can display wrongly",w:["It can't store digits","It uses 4 bytes per character","It has no capital letters"]},
 {t:"mc",q:"Which is a benefit of UTF-8?",a:"It's backwards compatible with ASCII",w:["Every character is exactly 2 bytes","It can only store English","It needs no code points"]},
 {t:"mc",q:"Which is a drawback of Unicode compared with ASCII?",a:"Text can take more storage space",w:["It has fewer characters","It can't represent emoji","It isn't a standard"]},
 {t:"mc",q:"The ASCII code for 'A' is 65. What is the code for 'a'?",a:"97",w:["66","32","91"]},
 {t:"mc",q:"What are the codes for the digits '0' to '9' in ASCII?",a:"48 to 57",w:["0 to 9","65 to 74","30 to 39"]},
 {t:"mc",q:"Why is '9' < 'A' true when comparing characters?",a:"The ASCII code of '9' (57) is less than that of 'A' (65)",w:["Digits always come last","'9' is a number","It's false"]},
 {t:"mc",html:`<pre class="pc py">print(ord("C") - ord("A"))</pre>`,q:"What is printed?",a:"2",w:["3","67","CA"]},
 {t:"mc",html:`<pre class="pc py">print(chr(ord("m") - 32))</pre>`,q:"What is printed?",a:"M",w:["m","77","l"]},
 {t:"mc",html:`<pre class="pc py">word = "Hi"
print(len(word.encode("utf-8")))</pre>`,q:"How many bytes does UTF-8 use for this string?",a:"2",w:["4","1","8"]},
 {t:"mc",html:`<pre class="pc py">print(len("é".encode("utf-8")))</pre>`,q:"'é' is not an ASCII character. What is printed?",a:"2",w:["1","4","0"]},
 {t:"blank",q:"The unique number Unicode gives each character is called its code ___.",a:["point"]},
 {t:"blank",q:"Extended ASCII uses ___ bits per character.",a:["8","eight"]}]);

P("a2-2-addsub",`0 + 0 | 0
1 + 0 | 1
1 + 1 | 0 carry 1
1 + 1 + 1 | 1 carry 1
Carry | Passed to the next column
a − b | a + (−b)
Overflow | Result too large for the bits
Underflow | Result too small to store
Unsigned 8-bit maximum | 255
Signed 8-bit maximum | 127
255 + 1 in 8 bits | Wraps to 0
Positive + positive = negative | Signed overflow
Different signs added | Never overflows
Overflow flag | V in the status register
Carry flag | C in the status register
Avoid overflow | Use more bits
0011 + 0101 | 1000
0110 − 0010 | 0100`);

P("a2-2-shifts",`Logical shift left | Fill with 0s on the right
Logical shift right | Fill with 0s on the left
Arithmetic shift right | Copy the sign bit in
Shift left 1 | Multiply by 2
Shift left 3 | Multiply by 8
Shift right 1 | Divide by 2
Bits shifted off the end | Lost
AND mask | Clear or check bits
OR mask | Set bits to 1
XOR mask | Flip bits
1010 AND 0110 | 0010
1010 OR 0110 | 1110
1010 XOR 0110 | 1100
Check bit 0 | AND with 0000 0001
Flip all 8 bits | XOR with 1111 1111
Python left shift | <<
Python bitwise AND | &
Python bitwise XOR | ^`);

P("a2-3-encoding",`Character set | Codes for each character
ASCII | 7 bits, 128 characters
Extended ASCII | 8 bits, 256 characters
Unicode | Every writing system
Code point | U+ then hex
UTF-8 | 1 to 4 bytes per character
UTF-8 benefit | Backwards compatible
Unicode drawback | Can need more storage
ASCII drawback | English only
Code pages | Differ for extended ASCII
'A' | 65
'a' | 97
'0' | 48
Space | 32
Line feed | 10
Python ord() | Character to code
Python chr() | Code to character
Emoji | Needs Unicode`);
