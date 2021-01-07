# Object: FILE
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
Constructs a File Object
No additional remarks available
#### Signature
New FILE([FileName: STRING], [AccessMode: FILEMODE])
#### Arguments
- **FileName** as Optional: STRING
  - Remarks: Optional String Name of file to open.
- **AccessMode** as Optional: FILEMODE
  - FORINPUT
  - FOROUTPUT
  - ISTEXT
  - UNICODETEXT
  - Remarks: Optional Mode(s) for file open.
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
Get the Flag indicating if the file Unicode for the FILE Object.
No additional remarks available
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
### Close
Closes an open File.
No additional remarks available
##### Signature
Close()
##### Arguments
##### Returns
BOOLEAN
### Delete
Deletes a file.
No additional remarks available
##### Signature
Delete([UseRecycleBin: BOOLEAN])
##### Arguments
- **UseRecycleBin** as Optional: BOOLEAN
  - Remarks: Optional Boolean Flag to add deleted file to the Windows Recycle Bin
##### Returns
BOOLEAN
### Open
Opens a file for access based on file mode.
No additional remarks available
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
  - Remarks: Mode(s) for file open.
##### Returns
BOOLEAN
### ReadByte
Read an 8-but Byte (0-255) from a binary file.
File must be opened as non-text.
##### Signature
ReadByte()
##### Arguments
##### Returns
NUMBER
### ReadChar
Reads a character from a binary file.
No additional remarks available
##### Signature
ReadChar()
##### Arguments
##### Returns
STRING
### ReadInt
Read a 32-bit signed integer from a binary file.
No additional remarks available
##### Signature
ReadInt()
##### Arguments
##### Returns
NUMBER
### ReadLine
Read a line of text (minsus CR/LF) from a text file.
No additional remarks available
##### Signature
ReadLine()
##### Arguments
##### Returns
STRING
### ReadReal
Read a C-Style double precision floating point number from a binary file.
No additional remarks available
##### Signature
ReadReal()
##### Arguments
##### Returns
NUMBER
### ReadString
Read a String from a binary file.
No additional remarks available
##### Signature
ReadString()
##### Arguments
##### Returns
STRING
### ReadWord
Read a 16-bit WORD (0-65535) from a binary file.
No additional remarks available
##### Signature
ReadWord()
##### Arguments
##### Returns
NUMBER
### Rename
Renames the current file held by the FILE object.
No additional remarks available
##### Signature
Rename(FileName: STRING)
##### Arguments
- **FileName** as: STRING
  - Remarks: String representing the name of the file to rename to.
##### Returns
BOOLEAN
### WriteByte
Write an 8-bit BYTE (0-255) to a binary file.
No additional remarks available
##### Signature
WriteByte(ByteToWrite: NUMBER)
##### Arguments
- **ByteToWrite** as: NUMBER
  - Remarks: BYTE to write to file.
##### Returns
BOOLEAN
### WriteChar
Wtite a Character to a binary file.
No additional remarks available
##### Signature
WriteChar(CharacterToWrite: STRING)
##### Arguments
- **CharacterToWrite** as: STRING
  - Remarks: String character to write to file.
##### Returns
BOOLEAN
### WriteInt
Write a 32-bit signed integer to a binary file.
No additional remarks available
##### Signature
WriteInt(IntegerToWrite: NUMBER)
##### Arguments
- **IntegerToWrite** as: NUMBER
  - Remarks: Number to write to file.
##### Returns
BOOLEAN
### WriteLine
Write a line of text to a text file.
No additional remarks available
##### Signature
WriteLine(StringToWrite: STRING, [AppendCR: BOOLEAN])
##### Arguments
- **StringToWrite** as: STRING
  - Remarks: String to write to file.
- **AppendCR** as Optional: BOOLEAN
  - Remarks: Optional Boolean Flag to automatically append a CR+LF to and of line.
##### Returns
BOOLEAN
### WriteReal
Write a C-Style double precision floating point number to a binary file.
No additional remarks available
##### Signature
WriteReal(RealToWrite: NUMBER)
##### Arguments
- **RealToWrite** as: NUMBER
  - Remarks: Number to write to file.
##### Returns
BOOLEAN
### WriteString
Write a string to a text file.
No additional remarks available
##### Signature
WriteString(StringToWrite: STRING)
##### Arguments
- **StringToWrite** as: STRING
  - Remarks: String to write to file.
##### Returns
BOOLEAN
### WriteWord
Write a 16-bit WORD (0-65535) to a binary file.
No additional remarks available
##### Signature
WriteWord(WordToWrite: NUMBER)
##### Arguments
- **WordToWrite** as: NUMBER
  - Remarks: Number to write to file.
##### Returns
BOOLEAN
