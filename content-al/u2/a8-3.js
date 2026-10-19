/* 8.3 Using SQL with SQLite in Python */
const SQL_SETUP = "import sqlite3\ncon = sqlite3.connect(\":memory:\")\ncur = con.cursor()\n";
const SQL_PETS = SQL_SETUP + "cur.execute(\"CREATE TABLE Owner (OwnerID INTEGER PRIMARY KEY, Name TEXT, Town TEXT)\")\n" +
 "cur.execute(\"CREATE TABLE Pet (PetID INTEGER PRIMARY KEY, Name TEXT, Species TEXT, Age INTEGER, OwnerID INTEGER, FOREIGN KEY (OwnerID) REFERENCES Owner(OwnerID))\")\n" +
 "cur.executemany(\"INSERT INTO Owner VALUES (?, ?, ?)\", [(1, \"Ana\", \"Leeds\"), (2, \"Ben\", \"York\"), (3, \"Cai\", \"Leeds\")])\n" +
 "cur.executemany(\"INSERT INTO Pet VALUES (?, ?, ?, ?, ?)\", [(1, \"Rex\", \"Dog\", 5, 1), (2, \"Tom\", \"Cat\", 3, 1), (3, \"Bubbles\", \"Fish\", 1, 2), (4, \"Luna\", \"Cat\", 8, 3), (5, \"Max\", \"Dog\", 2, 3)])\n" +
 "con.commit()\n";

L("a8-3",[
{slug:"sqlcreate",title:"Creating a database with SQLite",covers:[1],
 v:[["SQLite","A small database engine built into Python's sqlite3 library; the whole database is one file."],
  ["Connection","The link to a database file, made with sqlite3.connect(\"name.db\")."],
  ["Cursor","An object that runs SQL statements and holds their results: cur = con.cursor()."],
  ["CREATE TABLE","SQL that defines a new table with its fields and their data types."],
  ["Primary key","A field that uniquely identifies each record in a table."],
  ["Foreign key","A field that holds the primary key of a record in another table, linking the two."],
  ["commit()","Saves the changes made since the last commit to the database file."]],
 q:[["Which Python line opens (or creates) a database file?","con = sqlite3.connect(\"shop.db\")","con = open(\"shop.db\")","con = sqlite3.create(\"shop.db\")","import shop.db"],
  ["Which SQLite data type stores a price like 4.99?","REAL","INTEGER","TEXT","PRICE"],
  ["What does a foreign key do?","Links a record to a record in another table","Makes each record unique","Encrypts the table","Sorts the table"],
  ["What happens if you never call con.commit() after inserting?","The changes may not be saved to the file","The table is deleted","Python raises an error","Nothing ever goes wrong"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Setting up a database · 8 questions",gen:"bank",bank:"al-sqlc",explain:"Questions on connecting to SQLite, creating tables, data types and keys. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Create tables · 2 tasks",type:"py",explain:"Create tables in an SQLite database. The database is held in memory, so nothing is saved between runs. Press Run to try your code, then Check to test it.",
   tasks:[{title:"A Book table",brief:"Create a table <span class='mono'>Book</span> with fields <span class='mono'>BookID</span> (INTEGER, primary key), <span class='mono'>Title</span> (TEXT), <span class='mono'>Author</span> (TEXT) and <span class='mono'>Price</span> (REAL).",
     starter:SQL_SETUP+"\n# create the Book table here\n",
     tests:[{name:"Book table exists",py:"assert cur.execute(\"SELECT name FROM sqlite_master WHERE name='Book'\").fetchone(), 'no Book table'"},
      {name:"has the four fields",py:"cols = [c[1] for c in cur.execute('PRAGMA table_info(Book)')]; assert cols == ['BookID', 'Title', 'Author', 'Price'], cols"},
      {name:"correct types",py:"assert [c[2] for c in cur.execute('PRAGMA table_info(Book)')] == ['INTEGER', 'TEXT', 'TEXT', 'REAL']"},
      {name:"BookID is the primary key",py:"assert [c[1] for c in cur.execute('PRAGMA table_info(Book)') if c[5]] == ['BookID']"}],
     hint:"cur.execute(\"CREATE TABLE Book (BookID INTEGER PRIMARY KEY, Title TEXT, Author TEXT, Price REAL)\")",
     solution:SQL_SETUP+"\ncur.execute(\"CREATE TABLE Book (BookID INTEGER PRIMARY KEY, Title TEXT, Author TEXT, Price REAL)\")\ncon.commit()\n"},
    {title:"Linked tables",brief:"Create <span class='mono'>Member</span> (MemberID INTEGER primary key, Name TEXT) and <span class='mono'>Loan</span> (LoanID INTEGER primary key, BookTitle TEXT, MemberID INTEGER) where Loan's MemberID is a <b>foreign key</b> referencing Member.",
     starter:SQL_SETUP+"\n",
     tests:[{name:"Member table",py:"assert [c[1] for c in cur.execute('PRAGMA table_info(Member)')] == ['MemberID', 'Name']"},
      {name:"Loan table",py:"assert [c[1] for c in cur.execute('PRAGMA table_info(Loan)')] == ['LoanID', 'BookTitle', 'MemberID']"},
      {name:"foreign key to Member",py:"fk = cur.execute('PRAGMA foreign_key_list(Loan)').fetchall(); assert fk and fk[0][2] == 'Member' and fk[0][3] == 'MemberID', fk"}],
     hint:"End the Loan definition with: FOREIGN KEY (MemberID) REFERENCES Member(MemberID)",
     solution:SQL_SETUP+"cur.execute(\"CREATE TABLE Member (MemberID INTEGER PRIMARY KEY, Name TEXT)\")\ncur.execute(\"CREATE TABLE Loan (LoanID INTEGER PRIMARY KEY, BookTitle TEXT, MemberID INTEGER, FOREIGN KEY (MemberID) REFERENCES Member(MemberID))\")\ncon.commit()\n"}]}]},
{slug:"sqlmodify",title:"Inserting, updating and deleting",covers:[2],
 v:[["INSERT INTO","SQL that adds a new record: INSERT INTO Pet VALUES (6, 'Rio', 'Bird', 1, 2)."],
  ["UPDATE … SET","SQL that changes fields in existing records: UPDATE Pet SET Age = 6 WHERE PetID = 1."],
  ["DELETE FROM","SQL that removes records: DELETE FROM Pet WHERE PetID = 3."],
  ["WHERE","The condition that chooses which records a statement affects."],
  ["Placeholder (?)","A ? in SQL that is filled from a tuple of values, so user input is never pasted into the SQL."],
  ["SQL injection","An attack where input is written so that it changes the meaning of an SQL statement."],
  ["executemany()","Runs one SQL statement once for each tuple in a list."]],
 q:[["What happens if you run UPDATE Pet SET Age = 1 with no WHERE?","Every pet's age becomes 1","Only the first pet changes","Nothing changes","An error"],
  ["Which is the safe way to insert a name typed by the user?","cur.execute(\"INSERT INTO Owner (Name) VALUES (?)\", (name,))","cur.execute(\"INSERT INTO Owner (Name) VALUES ('\" + name + \"')\")","cur.execute(f\"INSERT INTO Owner (Name) VALUES ('{name}')\")","cur.insert(name)"],
  ["Which removes only the pet with PetID 4?","DELETE FROM Pet WHERE PetID = 4","DELETE Pet 4","DELETE FROM Pet","REMOVE FROM Pet WHERE PetID = 4"],
  ["Why is (name,) written with a comma?","It makes a tuple of one item","It's a typing mistake","It adds a blank field","It ends the SQL statement"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Changing data · 8 questions",gen:"bank",bank:"al-sqlm",explain:"Work out what INSERT, UPDATE and DELETE statements do, and how to run them safely. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Change the data · 3 tasks",type:"py",explain:"The Owner and Pet tables are already created and filled. Press Run to try your code, then Check to test it.",
   tasks:[{title:"New pet",brief:"Insert a new pet: PetID 6, Name \"Rio\", Species \"Bird\", Age 1, OwnerID 2. Use <span class='mono'>?</span> placeholders and commit.",
     starter:SQL_PETS+"\n# insert Rio here\n",
     tests:[{name:"Rio is in the table",py:"assert cur.execute('SELECT * FROM Pet WHERE PetID = 6').fetchone() == (6, 'Rio', 'Bird', 1, 2)"},{name:"six pets",py:"assert cur.execute('SELECT COUNT(*) FROM Pet').fetchone()[0] == 6"},{name:"uses placeholders",py:"assert '?' in __code__.split('# insert Rio here')[-1]"}],
     hint:"cur.execute(\"INSERT INTO Pet VALUES (?, ?, ?, ?, ?)\", (6, \"Rio\", \"Bird\", 1, 2))",
     solution:SQL_PETS+"\n# insert Rio here\ncur.execute(\"INSERT INTO Pet VALUES (?, ?, ?, ?, ?)\", (6, \"Rio\", \"Bird\", 1, 2))\ncon.commit()\n"},
    {title:"Birthdays",brief:"Every <b>cat</b> has had a birthday. Use one UPDATE statement to add 1 to the Age of every cat, and nothing else.",
     starter:SQL_PETS+"\n",
     tests:[{name:"Tom is 4, Luna is 9",py:"assert cur.execute(\"SELECT Age FROM Pet WHERE Species = 'Cat' ORDER BY PetID\").fetchall() == [(4,), (9,)]"},{name:"dogs unchanged",py:"assert cur.execute(\"SELECT Age FROM Pet WHERE Species = 'Dog' ORDER BY PetID\").fetchall() == [(5,), (2,)]"}],
     hint:"UPDATE Pet SET Age = Age + 1 WHERE Species = 'Cat'",
     solution:SQL_PETS+"cur.execute(\"UPDATE Pet SET Age = Age + 1 WHERE Species = 'Cat'\")\ncon.commit()\n"},
    {title:"Rehome",brief:"Ask for a pet's name and delete that pet from the table, using a placeholder. Then print how many pets are left, e.g. <span class='mono'>4 pets left</span>.",
     stdin:["Bubbles"],starter:SQL_PETS+"name = input(\"Pet to remove: \")\n",
     tests:[{name:"Bubbles removed",stdin:["Bubbles"],expect:"4 pets left"},{name:"Max removed",stdin:["Max"],expect:"4 pets left"},{name:"unknown name",stdin:["Nemo"],expect:"5 pets left"}],
     hint:"cur.execute(\"DELETE FROM Pet WHERE Name = ?\", (name,)) then count with SELECT COUNT(*) FROM Pet.",
     solution:SQL_PETS+"name = input(\"Pet to remove: \")\ncur.execute(\"DELETE FROM Pet WHERE Name = ?\", (name,))\ncon.commit()\nleft = cur.execute(\"SELECT COUNT(*) FROM Pet\").fetchone()[0]\nprint(f\"{left} pets left\")\n"}]}]},
{slug:"sqlselect",title:"Selecting data",covers:[3],
 v:[["SELECT … FROM","SQL that retrieves fields from a table: SELECT Name, Age FROM Pet."],
  ["*","Means every field: SELECT * FROM Pet."],
  ["ORDER BY","Sorts the results; add DESC for largest or latest first."],
  ["LIKE","Pattern matching in WHERE: % matches any number of characters, _ exactly one."],
  ["fetchall()","Returns every row of the result as a list of tuples."],
  ["fetchone()","Returns the next row of the result as one tuple, or None."],
  ["Result set","The rows returned by a SELECT."]],
 q:[["What does SELECT Name FROM Pet WHERE Age > 4 return?","The names of pets older than 4","Every field of pets older than 4","The number of pets older than 4","Ages greater than 4"],
  ["Which sorts pets oldest first?","ORDER BY Age DESC","ORDER BY Age","SORT BY Age DESC","ORDER Age DOWN"],
  ["Which finds names starting with B?","WHERE Name LIKE 'B%'","WHERE Name = 'B%'","WHERE Name LIKE '%B'","WHERE Name STARTS 'B'"],
  ["What type does fetchall() return?","A list of tuples","A single string","A dictionary","A table object"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Write and read queries · 8 questions",gen:"bank",bank:"al-sqls",explain:"Work out what SELECT queries return from the Pet table, and which query does a job. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Queries · 3 tasks",type:"py",explain:"The Owner and Pet tables are already created and filled. Press Run to try your code, then Check to test it.",
   tasks:[{title:"All the dogs",brief:"Store the names of all the dogs, in alphabetical order, as a list of strings called <span class='mono'>dogs</span>.",
     starter:SQL_PETS+"\ndogs = []\n",
     tests:[{name:"dogs",py:"assert dogs == ['Max', 'Rex'], dogs"},{name:"uses ORDER BY",py:"assert 'ORDER BY' in __code__.upper()"}],
     hint:"rows = cur.execute(\"SELECT Name FROM Pet WHERE Species = 'Dog' ORDER BY Name\").fetchall(), then take row[0] from each row.",
     solution:SQL_PETS+"\nrows = cur.execute(\"SELECT Name FROM Pet WHERE Species = 'Dog' ORDER BY Name\").fetchall()\ndogs = [row[0] for row in rows]\n"},
    {title:"Search by species",brief:"Ask for a species and print each matching pet as <span class='mono'>Name (Age)</span>, oldest first. If none match, print <span class='mono'>None found</span>.",
     stdin:["Cat"],starter:SQL_PETS+"species = input(\"Species: \")\n",
     tests:[{name:"Cat",stdin:["Cat"],expect:["Luna (8)","Tom (3)"]},{name:"Fish",stdin:["Fish"],expect:"Bubbles (1)"},{name:"none",stdin:["Horse"],expect:"None found"}],
     hint:"cur.execute(\"SELECT Name, Age FROM Pet WHERE Species = ? ORDER BY Age DESC\", (species,)).fetchall(); then loop, or print None found if the list is empty.",
     solution:SQL_PETS+"species = input(\"Species: \")\nrows = cur.execute(\"SELECT Name, Age FROM Pet WHERE Species = ? ORDER BY Age DESC\", (species,)).fetchall()\nif not rows:\n    print(\"None found\")\nfor name, age in rows:\n    print(f\"{name} ({age})\")\n"},
    {title:"Pattern match",brief:"Store in <span class='mono'>found</span> the names of pets whose name contains the letter <b>u</b> and who are younger than 5, using LIKE.",
     starter:SQL_PETS+"\nfound = []\n",
     tests:[{name:"found",py:"assert sorted(found) == ['Bubbles'], found"},{name:"uses LIKE",py:"assert 'LIKE' in __code__.upper()"}],
     hint:"WHERE Name LIKE '%u%' AND Age < 5",
     solution:SQL_PETS+"\nfound = [r[0] for r in cur.execute(\"SELECT Name FROM Pet WHERE Name LIKE '%u%' AND Age < 5\").fetchall()]\n"}]}]},
{slug:"sqljoin",title:"Joins and aggregate functions",covers:[3],
 v:[["INNER JOIN","Combines rows from two tables where the linking fields match."],
  ["ON","Gives the join condition, e.g. ON Pet.OwnerID = Owner.OwnerID."],
  ["Table.Field","Names a field by its table, needed when both tables have a field with the same name."],
  ["COUNT()","Aggregate function: the number of rows."],
  ["SUM() / AVG()","Aggregate functions: the total and the mean of a numeric field."],
  ["MIN() / MAX()","Aggregate functions: the smallest and largest value."],
  ["GROUP BY","Splits rows into groups so an aggregate is worked out for each group."]],
 q:[["What does SELECT COUNT(*) FROM Pet WHERE Species = 'Dog' return?","The number of dogs","The names of the dogs","Every field of every dog","The oldest dog"],
  ["Why is Pet.Name written instead of Name in a join with Owner?","Both tables have a Name field","It runs faster","Name is a reserved word","SQLite requires it in every query"],
  ["What does GROUP BY Species do with COUNT(*)?","Counts the pets of each species","Counts the species","Sorts by species","Removes duplicate species"],
  ["Which gives the average age of all pets?","SELECT AVG(Age) FROM Pet","SELECT MEAN(Age) FROM Pet","SELECT Age / COUNT FROM Pet","SELECT AVERAGE Age FROM Pet"]],
 acts:[{id:"act1",title:"Activity 1",desc:"Joins and aggregates · 8 questions",gen:"bank",bank:"al-sqlj",explain:"Work out the results of joins and aggregate queries on the Owner and Pet tables. Every try picks a different set."},
  {id:"py1",title:"Code it",desc:"Joins and aggregates · 3 tasks",type:"py",explain:"The Owner and Pet tables are already created and filled. Press Run to try your code, then Check to test it.",
   tasks:[{title:"Statistics",brief:"Using aggregate functions, store the number of pets in <span class='mono'>n</span>, the oldest age in <span class='mono'>oldest</span> and the average age in <span class='mono'>mean</span>.",
     starter:SQL_PETS+"\nn = 0\noldest = 0\nmean = 0\n",
     tests:[{name:"n is 5",py:"assert n == 5, n"},{name:"oldest is 8",py:"assert oldest == 8, oldest"},{name:"mean is 3.8",py:"assert abs(mean - 3.8) < 0.001, mean"},{name:"uses SQL aggregates",py:"u = __code__.upper(); assert 'COUNT(' in u and 'MAX(' in u and 'AVG(' in u"}],
     hint:"n, oldest, mean = cur.execute(\"SELECT COUNT(*), MAX(Age), AVG(Age) FROM Pet\").fetchone()",
     solution:SQL_PETS+"\nn, oldest, mean = cur.execute(\"SELECT COUNT(*), MAX(Age), AVG(Age) FROM Pet\").fetchone()\n"},
    {title:"Who owns what",brief:"Join the tables to store in <span class='mono'>pairs</span> a list of (pet name, owner name) tuples for every pet, sorted by pet name.",
     starter:SQL_PETS+"\npairs = []\n",
     tests:[{name:"pairs",py:"assert pairs == [('Bubbles', 'Ben'), ('Luna', 'Cai'), ('Max', 'Cai'), ('Rex', 'Ana'), ('Tom', 'Ana')], pairs"},{name:"uses JOIN",py:"assert 'JOIN' in __code__.upper()"}],
     hint:"SELECT Pet.Name, Owner.Name FROM Pet INNER JOIN Owner ON Pet.OwnerID = Owner.OwnerID ORDER BY Pet.Name",
     solution:SQL_PETS+"\npairs = cur.execute(\"SELECT Pet.Name, Owner.Name FROM Pet INNER JOIN Owner ON Pet.OwnerID = Owner.OwnerID ORDER BY Pet.Name\").fetchall()\n"},
    {title:"Pets per town",brief:"Ask for a town and print how many pets are owned by people who live there, e.g. Leeds prints <span class='mono'>Leeds: 4 pets</span>.",
     stdin:["Leeds"],starter:SQL_PETS+"town = input(\"Town: \")\n",
     tests:[{name:"Leeds",stdin:["Leeds"],expect:"Leeds: 4 pets"},{name:"York",stdin:["York"],expect:"York: 1 pets"},{name:"Hull",stdin:["Hull"],expect:"Hull: 0 pets"}],
     hint:"SELECT COUNT(*) FROM Pet INNER JOIN Owner ON Pet.OwnerID = Owner.OwnerID WHERE Owner.Town = ?",
     solution:SQL_PETS+"town = input(\"Town: \")\nn = cur.execute(\"SELECT COUNT(*) FROM Pet INNER JOIN Owner ON Pet.OwnerID = Owner.OwnerID WHERE Owner.Town = ?\", (town,)).fetchone()[0]\nprint(f\"{town}: {n} pets\")\n"}]}]}]);

/* ---------- banks (questions refer to the Owner and Pet tables shown in the lessons) ---------- */
const PETTAB = `<div class="tscroll"><table class="pvt deftab"><tr><th colspan="5">Pet</th></tr><tr><th>PetID</th><th>Name</th><th>Species</th><th>Age</th><th>OwnerID</th></tr><tr><td>1</td><td>Rex</td><td>Dog</td><td>5</td><td>1</td></tr><tr><td>2</td><td>Tom</td><td>Cat</td><td>3</td><td>1</td></tr><tr><td>3</td><td>Bubbles</td><td>Fish</td><td>1</td><td>2</td></tr><tr><td>4</td><td>Luna</td><td>Cat</td><td>8</td><td>3</td></tr><tr><td>5</td><td>Max</td><td>Dog</td><td>2</td><td>3</td></tr></table></div>`;
const OWNTAB = `<div class="tscroll"><table class="pvt deftab"><tr><th colspan="3">Owner</th></tr><tr><th>OwnerID</th><th>Name</th><th>Town</th></tr><tr><td>1</td><td>Ana</td><td>Leeds</td></tr><tr><td>2</td><td>Ben</td><td>York</td></tr><tr><td>3</td><td>Cai</td><td>Leeds</td></tr></table></div>`;
const sq = (s) => `<pre class="pc py">${s}</pre>`;

B("al-sqlc",[
 {t:"mc",q:"Which line must come before you can use sqlite3 in Python?",a:"import sqlite3",w:["include sqlite3","sqlite3.start()","open sqlite3"]},
 {t:"mc",q:"What does sqlite3.connect(\"school.db\") do if school.db doesn't exist?",a:"Creates a new, empty database file",w:["Raises FileNotFoundError","Returns None","Downloads it"]},
 {t:"mc",q:"What is a cursor used for?",a:"Running SQL statements and getting their results",w:["Moving the mouse","Saving the file","Storing the primary key"]},
 {t:"mc",q:"Which SQLite type should store a surname?",a:"TEXT",w:["INTEGER","REAL","CHAR(1)"]},
 {t:"mc",q:"Which SQLite type should store a number of items in stock?",a:"INTEGER",w:["REAL","TEXT","BOOLEAN"]},
 {t:"mc",q:"Which field is the best primary key for a Student table?",a:"StudentID",w:["Surname","DateOfBirth","Form"]},
 {t:"mc",q:"A Loan table has a MemberID field that matches Member.MemberID. In Loan, MemberID is…",a:"a foreign key",w:["a primary key","a composite key","an index"]},
 {t:"mc",html:sq(`cur.execute("CREATE TABLE Pet (PetID INTEGER PRIMARY KEY, Name TEXT)")
cur.execute("CREATE TABLE Pet (PetID INTEGER PRIMARY KEY, Name TEXT)")`),q:"What happens when this runs on a new database?",a:"The second line raises an error: the table already exists",w:["Two Pet tables are made","The second line replaces the first","Nothing at all"]},
 {t:"mc",q:"How can CREATE TABLE avoid an error if the table already exists?",a:"CREATE TABLE IF NOT EXISTS …",w:["CREATE NEW TABLE …","CREATE OR SKIP TABLE …","REPLACE TABLE …"]},
 {t:"mc",q:"Which call closes the connection when you've finished?",a:"con.close()",w:["cur.end()","sqlite3.close()","con.commit(False)"]},
 {t:"mc",q:"Which statement removes a whole table, structure and all?",a:"DROP TABLE Pet",w:["DELETE FROM Pet","REMOVE TABLE Pet","CLEAR Pet"]},
 {t:"blank",q:"The method that saves changes to the database file is con.___().",a:["commit"]}]);

B("al-sqlm",[
 {t:"mc",html:PETTAB+sq(`cur.execute("UPDATE Pet SET Age = 4 WHERE Name = 'Tom'")`),q:"What is Tom's age afterwards?",a:"4",w:["3","7","Every pet is now 4"]},
 {t:"mc",html:PETTAB+sq(`cur.execute("UPDATE Pet SET Age = Age + 1 WHERE Species = 'Dog'")`),q:"What are Rex's and Max's ages afterwards?",a:"6 and 3",w:["5 and 2","1 and 1","6 and 2"]},
 {t:"mc",html:PETTAB+sq(`cur.execute("DELETE FROM Pet WHERE Age &lt; 3")`),q:"How many pets are left?",a:"3",w:["2","4","0"]},
 {t:"mc",html:PETTAB+sq(`cur.execute("DELETE FROM Pet WHERE Species = 'Cat' AND Age &gt; 5")`),q:"Which pet is removed?",a:"Luna",w:["Tom","Tom and Luna","None"]},
 {t:"mc",html:PETTAB+sq(`cur.execute("DELETE FROM Pet")`),q:"What happens?",a:"Every record is deleted, but the table remains",w:["The table is dropped","Nothing: WHERE is required","Only the last record is deleted"]},
 {t:"mc",html:PETTAB+sq(`cur.execute("INSERT INTO Pet (PetID, Name, Species) VALUES (6, 'Kiwi', 'Bird')")`),q:"What is stored in Kiwi's Age field?",a:"NULL (no value)",w:["0","An error stops the insert","1"]},
 {t:"mc",q:"Which inserts a record safely using a value in the variable name?",a:"cur.execute(\"INSERT INTO Owner (Name) VALUES (?)\", (name,))",w:["cur.execute(\"INSERT INTO Owner (Name) VALUES (name)\")","cur.execute(\"INSERT INTO Owner (Name) VALUES ('\" + name + \"')\")","cur.execute(\"INSERT INTO Owner (Name) VALUES (?)\", name)"]},
 {t:"mc",q:"Why are ? placeholders used instead of joining input into the SQL string?",a:"To prevent SQL injection",w:["They make the query run twice as fast","SQLite can't read strings","To avoid needing commit()"]},
 {t:"mc",q:"Inserting a record with a PetID that already exists…",a:"fails, because the primary key must be unique",w:["replaces the old record","adds a duplicate","is silently ignored"]},
 {t:"mc",q:"Which runs one INSERT for every tuple in a list called rows?",a:"cur.executemany(\"INSERT INTO Pet VALUES (?, ?, ?, ?, ?)\", rows)",w:["cur.execute(\"INSERT INTO Pet VALUES rows\")","cur.insertall(rows)","for r in rows: con.commit(r)"]},
 {t:"mc",q:"Which statement changes Ben's town to Hull?",a:"UPDATE Owner SET Town = 'Hull' WHERE Name = 'Ben'",w:["UPDATE Owner Town = 'Hull' WHERE Name = 'Ben'","SET Owner.Town = 'Hull' WHERE Name = 'Ben'","INSERT INTO Owner (Town) VALUES ('Hull')"]},
 {t:"mc",q:"A program inserts five records and then crashes before con.commit(). What is in the database file?",a:"None of the five records",w:["All five records","The first four","Only the last record"]}]);

B("al-sqls",[
 {t:"mc",html:PETTAB+sq(`cur.execute("SELECT Name FROM Pet WHERE Species = 'Cat'")
print(cur.fetchall())`),q:"What is printed?",a:"[('Tom',), ('Luna',)]",w:["['Tom', 'Luna']","[('Tom', 'Cat'), ('Luna', 'Cat')]","('Tom', 'Luna')"]},
 {t:"mc",html:PETTAB+sq(`cur.execute("SELECT Name FROM Pet ORDER BY Age DESC")
print(cur.fetchone())`),q:"What is printed?",a:"('Luna',)",w:["('Bubbles',)","('Rex',)","Luna"]},
 {t:"mc",html:PETTAB+sq(`rows = cur.execute("SELECT Name FROM Pet WHERE Age &gt;= 3").fetchall()
print(len(rows))`),q:"What is printed?",a:"3",w:["2","4","5"]},
 {t:"mc",html:PETTAB+sq(`rows = cur.execute("SELECT Name FROM Pet WHERE Name LIKE '%a%'").fetchall()`),q:"How many rows are returned?",a:"2 (Luna and Max)",w:["1 (Max)","3","0"]},
 {t:"mc",html:PETTAB+sq(`rows = cur.execute("SELECT Name FROM Pet WHERE Species = 'Dog' OR Age &lt; 2").fetchall()`),q:"Which names are returned?",a:"Rex, Bubbles, Max",w:["Rex, Max","Bubbles","Rex"]},
 {t:"mc",html:PETTAB+sq(`rows = cur.execute("SELECT Name FROM Pet WHERE Species = 'Dog' AND Age &lt; 2").fetchall()
print(rows)`),q:"What is printed?",a:"[]",w:["[('Max',)]","None","An error"]},
 {t:"mc",html:PETTAB,q:"Which query lists the names of pets aged 2 to 5 inclusive?",a:"SELECT Name FROM Pet WHERE Age BETWEEN 2 AND 5",w:["SELECT Name FROM Pet WHERE Age &gt; 2 AND Age &lt; 5","SELECT Name FROM Pet WHERE Age = 2 TO 5","SELECT Name WHERE Age BETWEEN 2 AND 5"]},
 {t:"mc",html:PETTAB,q:"Which query lists every field of every pet, youngest first?",a:"SELECT * FROM Pet ORDER BY Age",w:["SELECT ALL FROM Pet ORDER BY Age","SELECT * FROM Pet ORDER BY Age DESC","SELECT * FROM Pet SORT Age"]},
 {t:"mc",html:PETTAB,q:"Which pattern matches names ending in x?",a:"LIKE '%x'",w:["LIKE 'x%'","LIKE '_x'","LIKE 'x'"]},
 {t:"mc",html:PETTAB+sq(`row = cur.execute("SELECT Name, Age FROM Pet WHERE PetID = 9").fetchone()
print(row)`),q:"What is printed?",a:"None",w:["()","An error","[]"]},
 {t:"mc",html:PETTAB+sq(`for name, age in cur.execute("SELECT Name, Age FROM Pet WHERE Species = 'Dog'"):
    print(name, age)`),q:"What is printed first?",a:"Rex 5",w:["('Rex', 5)","Max 2","Rex"]},
 {t:"mc",q:"What does SELECT DISTINCT Species FROM Pet return for the Pet table?",a:"Dog, Cat, Fish (each once)",w:["All five species values","3","Dog and Cat"]}]);

B("al-sqlj",[
 {t:"mc",html:PETTAB+sq(`print(cur.execute("SELECT COUNT(*) FROM Pet WHERE Species = 'Cat'").fetchone()[0])`),q:"What is printed?",a:"2",w:["(2,)","Tom, Luna","5"]},
 {t:"mc",html:PETTAB+sq(`print(cur.execute("SELECT SUM(Age) FROM Pet").fetchone()[0])`),q:"What is printed?",a:"19",w:["5","3.8","8"]},
 {t:"mc",html:PETTAB+sq(`print(cur.execute("SELECT AVG(Age) FROM Pet WHERE Species = 'Dog'").fetchone()[0])`),q:"What is printed?",a:"3.5",w:["7","2","3"]},
 {t:"mc",html:PETTAB+sq(`print(cur.execute("SELECT MIN(Age), MAX(Age) FROM Pet").fetchone())`),q:"What is printed?",a:"(1, 8)",w:["1 8","(8, 1)","[1, 8]"]},
 {t:"mc",html:PETTAB+sq(`rows = cur.execute("SELECT Species, COUNT(*) FROM Pet GROUP BY Species ORDER BY Species").fetchall()
print(rows)`),q:"What is printed?",a:"[('Cat', 2), ('Dog', 2), ('Fish', 1)]",w:["[('Cat', 2), ('Dog', 2)]","[3]","[('Dog', 2), ('Cat', 2), ('Fish', 1)]"]},
 {t:"mc",html:PETTAB+OWNTAB+sq(`rows = cur.execute("""SELECT Pet.Name FROM Pet
    INNER JOIN Owner ON Pet.OwnerID = Owner.OwnerID
    WHERE Owner.Name = 'Ana'""").fetchall()`),q:"Which pets are returned?",a:"Rex and Tom",w:["Luna and Max","Bubbles","Rex only"]},
 {t:"mc",html:PETTAB+OWNTAB+sq(`rows = cur.execute("""SELECT Pet.Name FROM Pet
    INNER JOIN Owner ON Pet.OwnerID = Owner.OwnerID
    WHERE Owner.Town = 'Leeds' AND Pet.Species = 'Dog'""").fetchall()`),q:"How many rows are returned?",a:"2",w:["1","3","4"]},
 {t:"mc",html:PETTAB+OWNTAB+sq(`row = cur.execute("""SELECT Owner.Name FROM Owner
    INNER JOIN Pet ON Pet.OwnerID = Owner.OwnerID
    WHERE Pet.Name = 'Bubbles'""").fetchone()
print(row[0])`),q:"What is printed?",a:"Ben",w:["Bubbles","2","York"]},
 {t:"mc",html:PETTAB+OWNTAB+sq(`rows = cur.execute("""SELECT Owner.Name, COUNT(*) FROM Owner
    INNER JOIN Pet ON Pet.OwnerID = Owner.OwnerID
    GROUP BY Owner.Name ORDER BY Owner.Name""").fetchall()`),q:"What is rows?",a:"[('Ana', 2), ('Ben', 1), ('Cai', 2)]",w:["[('Ana', 5), ('Ben', 5), ('Cai', 5)]","[3]","[('Leeds', 4), ('York', 1)]"]},
 {t:"mc",q:"Which part of a join says which fields must match?",a:"ON Pet.OwnerID = Owner.OwnerID",w:["WHERE Pet = Owner","GROUP BY OwnerID","FROM Pet, Owner"]},
 {t:"mc",q:"What happens to a pet whose OwnerID doesn't match any owner in an INNER JOIN?",a:"It's left out of the results",w:["It appears with a blank owner","The query fails","It appears twice"]},
 {t:"mc",q:"Which query counts how many owners live in each town?",a:"SELECT Town, COUNT(*) FROM Owner GROUP BY Town",w:["SELECT COUNT(Town) FROM Owner","SELECT Town FROM Owner ORDER BY COUNT","SELECT DISTINCT COUNT(*) FROM Owner"]}]);

/* ---------- third activities ---------- */
O("o-sqlpy",["import sqlite3","Connect to the database file","Create a cursor","Execute the SQL statement with any ? values","Commit the changes","Close the connection"]);
A("a8-3-sqlcreate",[ord("o-sqlpy","Using SQLite from Python","Put the steps a Python program follows to change a database in order.")]);
S("s-sqlstmt",{"Adds records":["INSERT INTO Pet VALUES (…)","cur.executemany(\"INSERT …\", rows)"],"Changes records":["UPDATE Pet SET Age = 6 WHERE PetID = 1","UPDATE Owner SET Town = 'Hull'"],"Removes records":["DELETE FROM Pet WHERE PetID = 3","DELETE FROM Pet"],"Doesn't change any data":["SELECT * FROM Pet","SELECT COUNT(*) FROM Pet"]},2);
A("a8-3-sqlmodify",[srt("s-sqlstmt","What does the statement do?","Drag each statement to what it does to the data.")]);
O("o-select",["SELECT Name, Age","FROM Pet","WHERE Species = 'Cat'","ORDER BY Age DESC"]);
A("a8-3-sqlselect",[ord("o-select","Build the query","Put the parts of this query in the order SQL needs them: the names and ages of the cats, oldest first.")]);
O("o-join",["SELECT Pet.Name, Owner.Name","FROM Pet","INNER JOIN Owner","ON Pet.OwnerID = Owner.OwnerID","WHERE Owner.Town = 'Leeds'","ORDER BY Pet.Name"]);
A("a8-3-sqljoin",[ord("o-join","Build the join","Put the parts of this query in order: every pet owned by someone in Leeds, with its owner's name, sorted by pet name.")]);

P("a8-3-sqlcreate",`import sqlite3 | Load the library
sqlite3.connect("a.db") | Open or create a file
con.cursor() | Runs SQL statements
CREATE TABLE | Defines a new table
INTEGER | Whole number type
REAL | Decimal number type
TEXT | String type
PRIMARY KEY | Uniquely identifies a record
Foreign key | Links to another table
REFERENCES Owner(OwnerID) | Says what it links to
con.commit() | Saves the changes
con.close() | Ends the connection
IF NOT EXISTS | Avoids a duplicate error
DROP TABLE | Deletes a whole table
SQLite database | A single file
":memory:" | Database held in RAM
cur.execute(sql) | Runs one statement
Field | A column`);

P("a8-3-sqlmodify",`INSERT INTO | Adds a record
UPDATE … SET | Changes fields
DELETE FROM | Removes records
WHERE | Chooses which records
UPDATE without WHERE | Changes every record
DELETE without WHERE | Empties the table
? | Placeholder
(name,) | Tuple of one value
SQL injection | Input changes the SQL
executemany() | One statement, many rows
Age = Age + 1 | Adds one to each age
Missing field | Stored as NULL
Duplicate primary key | Insert fails
Crash before commit | Changes lost
Placeholders | Stop SQL injection
Joining input into SQL | Unsafe
SET Town = 'Hull' | New value for Town
VALUES (6, 'Rio', …) | The new record's data`);

P("a8-3-sqlselect",`SELECT | Chooses the fields
FROM | Names the table
* | Every field
ORDER BY Age | Youngest first
ORDER BY Age DESC | Oldest first
LIKE 'B%' | Starts with B
LIKE '%x' | Ends with x
LIKE '%u%' | Contains u
_ in LIKE | Exactly one character
AND | Both conditions true
OR | Either condition true
BETWEEN 2 AND 5 | 2 to 5 inclusive
fetchall() | List of tuples
fetchone() | One tuple
No matching row | fetchone() gives None
No matching rows | fetchall() gives []
DISTINCT | Removes repeated values
row[0] | First field of a row`);

P("a8-3-sqljoin",`INNER JOIN | Matching rows from two tables
ON | The join condition
Pet.Name | Name field of Pet
COUNT(*) | Number of rows
SUM(Age) | Total of the ages
AVG(Age) | Mean age
MIN(Age) | Youngest age
MAX(Age) | Oldest age
GROUP BY | One result per group
GROUP BY Species | Count per species
Unmatched row | Left out of the join
Aggregate function | Works on many rows
fetchone()[0] | A single value
Pet.OwnerID = Owner.OwnerID | Foreign key = primary key
Join and WHERE | Filter combined rows
COUNT for each owner | GROUP BY Owner.Name
Total pets: 5 | SELECT COUNT(*) FROM Pet
Average age: 3.8 | SELECT AVG(Age) FROM Pet`);
