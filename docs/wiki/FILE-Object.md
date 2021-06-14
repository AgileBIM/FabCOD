# Object: FILE
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
Constructs a File Object.
If optional parameters are not specified when constructing the FILE Object,
use the FILE.Open method to specify them.
#### Signature
New FILE([FileName: STRING], [AccessMode: FILEMODE])
#### Arguments
- **FileName** as Optional: STRING
  - Remarks: Optional String Name of the file to open.
- **AccessMode** as Optional: FILEMODE
  - FORINPUT
  - FOROUTPUT
  - ISTEXT
  - UNICODETEXT
  - UTF8
  - UTF16
  - Remarks: Optional Mode(s) for the file open.
## Properties
The following items are accessed from the base object by a dot notation
### Property: EOF
Get the End of File flag for the FILE Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Exists
Get the Flag indicating if the file exist or not for the FILE Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: FileName
Get/Set the File Name of file to open for the FILE Object.

No additional remarks available
##### Returns
STRING
### Property: IsOpen
Get the Flag indicating if the file is open for the FILE Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: IsUnicode
Get the Flag indicating if the file is Unicode for the FILE Object.

File is ANSI encoded if not Unicode.
##### Returns
BOOLEAN
### Property: Length
Get the Length of file (in Bytes) for the FILE Object.

No additional remarks available
##### Returns
NUMBER
### Property: Mode
Get/Set the File Open Mode (flags) for the FILE Object.

No additional remarks available
##### Returns
FILEMODE
### Property: Position
Get/Set the current File Position (in Bytes) for the FILE Object.

No additional remarks available
##### Returns
NUMBER
## Methods
The following items are invoked from the base object by a dot notation
### Function: Close
Closes an open File.

Any open file needs to be closed before any other application can access it in Read/Write mode.
##### Signature
Close()
##### Arguments
##### Returns
BOOLEAN
### Function: Delete
Deletes a file.

No additional remarks available
##### Signature
Delete([UseRecycleBin: BOOLEAN])
##### Arguments
- **UseRecycleBin** as Optional: BOOLEAN
  - Remarks: Optional Boolean Flag to add deleted file to the Windows Recycle Bin
##### Returns
BOOLEAN
### Function: Open
Opens a file for access based on file mode.

This function is not needed if the FILE Object Constructor was called with parameters specifying the
file name and access mode/type.
##### Signature
Open(Filename: STRING, AccessMode: FILEMODE)
##### Arguments
- **Filename** as: STRING
  - Remarks: String Name of file to open.
- **AccessMode** as: FILEMODE
  - FORINPUT
  - FOROUTPUT
  - ISTEXT
  - UNICODETEXT
  - UTF8
  - UTF16
  - Remarks: Mode(s) for file open.
##### Returns
BOOLEAN
### Function: ReadByte
Read an 8-but Byte (0-255) from a binary file.

File must be opened as non-text.
##### Signature
ReadByte()
##### Arguments
##### Returns
NUMBER
### Function: ReadChar
Reads a character from a binary file.

File must be opened as non-text.
Will read a BYTE for ANSI files and a WORD for Unicode Files.
##### Signature
ReadChar()
##### Arguments
##### Returns
STRING
### Function: ReadInt
Read a 32-bit signed integer from a binary file.

File must be opened as non-text.
##### Signature
ReadInt()
##### Arguments
##### Returns
NUMBER
### Function: ReadLine
Read a line of text (minsus CR/LF) from a text file.

File must be opened as text (Unicode or ANSI).
Each call reads up into the next CR (Carriage Return), LF (Line Feed) or EOF (End of File) marker.
Returned String does not contain CR/LR or EOF characters.
##### Signature
ReadLine()
##### Arguments
##### Returns
STRING
### Function: ReadReal
Read a C-Style double precision floating point number from a binary file.

File must be opened as non-text.
##### Signature
ReadReal()
##### Arguments
##### Returns
NUMBER
### Function: ReadString
Read a String from a binary file.

File must be opened as non-text.
Will read BTYEs for ANSI files and WORDs for Unicode files.
##### Signature
ReadString()
##### Arguments
##### Returns
STRING
### Function: ReadWord
Read a 16-bit WORD (0-65535) from a binary file.

File must be opened as non-text.
##### Signature
ReadWord()
##### Arguments
##### Returns
NUMBER
### Function: Rename
Renames the current file held by the FILE object.

Current File Name must be assigned but file must not be opened for access.
##### Signature
Rename(FileName: STRING)
##### Arguments
- **FileName** as: STRING
  - Remarks: String representing the name of the file to rename to.
##### Returns
BOOLEAN
### Function: SeekEntry
Positions the file reader to the position after the specified data in the file.

File reader positions to just after the data that's specified by the function.
Subsequent calls to functions that read data will return the data immediantely after
the data that was specified.
##### Signature
SeekEntry(DataToGoTo: ANY)
##### Arguments
- **DataToGoTo** as: ANY
  - Remarks: Data to position the file reader to.
##### Returns
VOID
### Function: SeekLine
Returns Boolean flag if specified data was found in the file.

No additional remarks available
##### Signature
SeekLine(DataToFind: ANY)
##### Arguments
- **DataToFind** as: ANY
##### Returns
VOID
### Function: WriteByte
Write an 8-bit BYTE (0-255) to a binary file.

File must be opened as non-text.
##### Signature
WriteByte(ByteToWrite: NUMBER)
##### Arguments
- **ByteToWrite** as: NUMBER
  - Remarks: BYTE to write to file.
##### Returns
BOOLEAN
### Function: WriteChar
Wtite a Character to a binary file.

File must be opened as non-text.
Will write a BYTE for ANSI files or WORK for Unicodes files.
##### Signature
WriteChar(CharacterToWrite: STRING)
##### Arguments
- **CharacterToWrite** as: STRING
  - Remarks: String character to write to file.
##### Returns
BOOLEAN
### Function: WriteInt
Write a 32-bit signed integer to a binary file.

File must be opened as non-text.
##### Signature
WriteInt(IntegerToWrite: NUMBER)
##### Arguments
- **IntegerToWrite** as: NUMBER
  - Remarks: Number to write to file.
##### Returns
BOOLEAN
### Function: WriteLine
Write a line of text to a text file.

If optional AppendCR paramater missing, True is default and will automatically append
a Carrage Return (CR) and Line Feed (LR) character to the end of the specified string.
##### Signature
WriteLine(StringToWrite: STRING, [AppendCR: BOOLEAN])
##### Arguments
- **StringToWrite** as: STRING
  - Remarks: String to write to file.
- **AppendCR** as Optional: BOOLEAN
  - Remarks: Optional Boolean Flag to automatically append a CR+LF to and of line.
##### Returns
BOOLEAN
### Function: WriteReal
Write a C-Style double precision floating point number to a binary file.

File must be opened as non-text.
##### Signature
WriteReal(RealToWrite: NUMBER)
##### Arguments
- **RealToWrite** as: NUMBER
  - Remarks: Number to write to file.
##### Returns
BOOLEAN
### Function: WriteString
Write a string to a text file.

File must be opened as non-text.
Will write BYTEs for ANSI files and WORDs for Unicode files.
##### Signature
WriteString(StringToWrite: STRING)
##### Arguments
- **StringToWrite** as: STRING
  - Remarks: String to write to file.
##### Returns
BOOLEAN
### Function: WriteWord
Write a 16-bit WORD (0-65535) to a binary file.

File must be opened as non-text.
##### Signature
WriteWord(WordToWrite: NUMBER)
##### Arguments
- **WordToWrite** as: NUMBER
  - Remarks: Number to write to file.
##### Returns
BOOLEAN
