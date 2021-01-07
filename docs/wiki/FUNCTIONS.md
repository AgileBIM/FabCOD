# Global Functions
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## ACos
Get the inverse Cosine angle of Adj/Hyp
No additional remarks available
#### Signature
ACos(Adjacent: NUMBER, Hypotenuse: NUMBER)
#### Arguments
- **Adjacent** as: NUMBER
- **Hypotenuse** as: NUMBER
#### Returns
NUMBER
## Asc
Gets the ASCII numeric code from a string.
No additional remarks available
#### Signature
Asc(FirstChar: STRING)
#### Arguments
- **FirstChar** as: STRING
  - Remarks: Can be any length string,- but only the first character is evaluated.
#### Returns
NUMBER
## Ascii
Create a string with a non-enterable character code.
No additional remarks available
#### Signature
Ascii(CharacterCode: NUMBER)
#### Arguments
- **CharacterCode** as: NUMBER
  - Remarks: A number representing an ASCII character.
#### Returns
STRING
## ASin
Get the inverse Sine angle of Opp/Hyp
No additional remarks available
#### Signature
ASin(Opposite: NUMBER, Hypotenuse: NUMBER)
#### Arguments
- **Opposite** as: NUMBER
- **Hypotenuse** as: NUMBER
#### Returns
NUMBER
## ATan
Get the inverse Tangent angle of Opp/Adj
No additional remarks available
#### Signature
ATan(Opposite: NUMBER, Adjacent: NUMBER)
#### Arguments
- **Opposite** as: NUMBER
- **Adjacent** as: NUMBER
#### Returns
NUMBER
## Chr
Returns string containing the character at the specified 1-based index of String txt.
No additional remarks available
#### Signature
Chr(TextString: STRING, CharacterPosition: NUMBER)
#### Arguments
- **TextString** as: STRING
  - Remarks: The base string to be searched.
- **CharacterPosition** as: NUMBER
  - Remarks: The numeric index of the character to return.
#### Returns
STRING
## Cos
Get the Cosine of angle.
No additional remarks available
#### Signature
Cos(Angle: NUMBER)
#### Arguments
- **Angle** as: NUMBER
#### Returns
NUMBER
## Debug
Display an Alert message box with a single OK button used to dismiss the message.
No additional remarks available
#### Signature
Debug(MessageTest: STRING)
#### Arguments
- **MessageTest** as: STRING
#### Returns
VOID
## Error
How to use this function works is currently unknown
No additional remarks available
#### Signature
Error(Input: ANY)
#### Arguments
- **Input** as: ANY
  - Remarks: Accepts just about any 1 item
#### Returns
VOID
## Exec
Execute an external Application, Document or Link
No additional remarks available
#### Signature
Exec(FullFilePath: STRING, ShowFlags: EXECFLAG, AppParams: STRING, AppWorkingDir: STRING)
#### Arguments
- **FullFilePath** as: STRING
  - Remarks: String represnting fill path and name of EXE, Document or Link.
- **ShowFlags** as: EXECFLAG
  - EXEC_DEFAULT
  - EXEC_WAIT
  - EXEC_SHOW_NORMAL
  - EXEC_SHOW_MAX
  - EXEC_SHOW_MIN
  - Remarks: Number (ENUM) to configure how to display external application.
- **AppParams** as: STRING
  - Remarks: String paramaters to pass to the external application.
- **AppWorkingDir** as: STRING
  - Remarks: String full path to the working directory for the external application.
#### Returns
VOID
## Exp
Get the Inverse log of value (10 to the power of value).
No additional remarks available
#### Signature
Exp(Value: NUMBER)
#### Arguments
- **Value** as: NUMBER
#### Returns
NUMBER
## GetFileExt
Extract file extension (including .) from filename / full path + filename.
No additional remarks available
#### Signature
GetFileExt(FileName: STRING)
#### Arguments
- **FileName** as: STRING
  - Remarks: A String representing a file name with or without the full path.
#### Returns
STRING
## GetFileName
Extract filename path (including extension) full path + filename.
No additional remarks available
#### Signature
GetFileName(FilePathAndName: STRING)
#### Arguments
- **FilePathAndName** as: STRING
  - Remarks: A String representing a file full path and name.
#### Returns
STRING
## InputBox
Display a Dialog with an Editbox for the user to enter data.
No additional remarks available
#### Signature
InputBox(TitleText: STRING, PromptText: STRING, DefaultText: STRING)
#### Arguments
- **TitleText** as: STRING
  - Remarks: A String Label to display in the dialog title bar.
- **PromptText** as: STRING
  - Remarks: A String message instructing the user what to enter.
- **DefaultText** as: STRING
  - Remarks: A String to use as default Text in the Editbox.
#### Returns
STRING
## InStr
Extracts the first index location of a string if completely found within another string.
No additional remarks available
#### Signature
InStr(StartingFrom: NUMBER, SearchIn: STRING, SearchFor: STRING, [IsCaseSensitive: BOOLEAN])
#### Arguments
- **StartingFrom** as: NUMBER
  - Remarks: The numeric index of the character to begin the search at
- **SearchIn** as: STRING
  - Remarks: The base string to be searched
- **SearchFor** as: STRING
  - Remarks: The value string to be located
- **IsCaseSensitive** as Optional: BOOLEAN
  - Remarks: Optional and defaults to FALSE. If provided as TRUE, then "CaSe SeNsItIvE" would not match "Case Sensitive"
#### Returns
NUMBER
## Left
Get a Sub String from the start of text String which is the specified number of characters in length.
No additional remarks available
#### Signature
Left(TextString: STRING, Length: NUMBER)
#### Arguments
- **TextString** as: STRING
  - Remarks: The text String to extract a SubString from.
- **Length** as: NUMBER
  - Remarks: A number representing the length of the SubString desired.
#### Returns
STRING
## Len
Get length of String.
No additional remarks available
#### Signature
Len(TextString: STRING)
#### Arguments
- **TextString** as: STRING
  - Remarks: A String to find the length of.
#### Returns
NUMBER
## Log
Get the log of value (base 10).
No additional remarks available
#### Signature
Log(Value: NUMBER)
#### Arguments
- **Value** as: NUMBER
#### Returns
NUMBER
## Lower
Convert text String to all lower case.
No additional remarks available
#### Signature
Lower(TextString: STRING)
#### Arguments
- **TextString** as: STRING
  - Remarks: A String to convert to lower case.
#### Returns
STRING
## LTrim
Get text String with any leading spaces removed.
No additional remarks available
#### Signature
LTrim(TextString: STRING)
#### Arguments
- **TextString** as: STRING
  - Remarks: A String to trim leading spaces from (if any).
#### Returns
STRING
## Mid
Get Sub String from the middle of another string by specifying the start position and length.
No additional remarks available
#### Signature
Mid(SearchString: STRING, StartingIndex: NUMBER, Length: NUMBER)
#### Arguments
- **SearchString** as: STRING
  - Remarks: The text String to extract a SubString from.
- **StartingIndex** as: NUMBER
- **Length** as: NUMBER
  - Remarks: A number representing the length of the SubString desired.
#### Returns
STRING
## Number
Forces extraction of Number from variable data types.
No additional remarks available
#### Signature
Number(Value: ANY)
#### Arguments
- **Value** as: ANY
#### Returns
NUMBER
## Pow
Get the value to the power of n.
No additional remarks available
#### Signature
Pow(Value: NUMBER, N: NUMBER)
#### Arguments
- **Value** as: NUMBER
- **N** as: NUMBER
#### Returns
NUMBER
## Query
Display a simple dialog for the user to select "YES" or "NO".
No additional remarks available
#### Signature
Query(PromptText: STRING)
#### Arguments
- **PromptText** as: STRING
  - Remarks: A String message instructing the user what to enter.
#### Returns
BOOLEAN
## Right
Get a Sub String from the end of text String which is the specified number of characters in length.
No additional remarks available
#### Signature
Right(TextString: STRING, Length: NUMBER)
#### Arguments
- **TextString** as: STRING
  - Remarks: The text String to extract a SubString from.
- **Length** as: NUMBER
  - Remarks: A number representing the length of the SubString desired.
#### Returns
STRING
## Round
Get the value rounded number of decimalplaces (nearest up or down).
No additional remarks available
#### Signature
Round(Value: NUMBER, [DecimalPlaces: NUMBER])
#### Arguments
- **Value** as: NUMBER
- **DecimalPlaces** as Optional: NUMBER
  - Remarks: Optional and defaults to zero (0).
#### Returns
NUMBER
## RoundDown
Get the number rounded down to number of decimalplaces.
No additional remarks available
#### Signature
RoundDown(Value: NUMBER, [DecimalPlaces: NUMBER])
#### Arguments
- **Value** as: NUMBER
- **DecimalPlaces** as Optional: NUMBER
  - Remarks: Optional and defaults to zero (0).
#### Returns
NUMBER
## RoundUp
Get the value rounded up to number of decimalplaces.
No additional remarks available
#### Signature
RoundUp(Value: NUMBER, [DecimalPlaces: NUMBER])
#### Arguments
- **Value** as: NUMBER
- **DecimalPlaces** as Optional: NUMBER
  - Remarks: Optional and defaults to zero (0).
#### Returns
NUMBER
## RTrim
Get text String with and trailing spaces removed.
No additional remarks available
#### Signature
RTrim(TextString: STRING)
#### Arguments
- **TextString** as: STRING
  - Remarks: A String to trim trailing spaces from (if any).
#### Returns
STRING
## Sign
Get the sign of a number.
No additional remarks available
#### Signature
Sign(Value: NUMBER)
#### Arguments
- **Value** as: NUMBER
#### Returns
NUMBER
## Sin
Get the Sine of angle.
No additional remarks available
#### Signature
Sin(Angle: NUMBER)
#### Arguments
- **Angle** as: NUMBER
#### Returns
NUMBER
## Sqr
Get the Square of the number passed (ie value x value).
No additional remarks available
#### Signature
Sqr(Value: NUMBER)
#### Arguments
- **Value** as: NUMBER
#### Returns
NUMBER
## Sqrt
Get the Square root of the number
No additional remarks available
#### Signature
Sqrt(Value: NUMBER)
#### Arguments
- **Value** as: NUMBER
#### Returns
NUMBER
## SubString
Get a Sub String, starting and ending at specified indexes.
No additional remarks available
#### Signature
SubString(TextString: STRING, StartingFrom: NUMBER, EndingAt: NUMBER)
#### Arguments
- **TextString** as: STRING
  - Remarks: The text String to extract a SubString from.
- **StartingFrom** as: NUMBER
  - Remarks: A Number (1-based index) for the starting character position to get the substring from.
- **EndingAt** as: NUMBER
  - Remarks: A number (1-based index) for the ending character position to get the substrinbg from.
#### Returns
STRING
## Tan
Get the Tangent of angle.
No additional remarks available
#### Signature
Tan(Angle: NUMBER)
#### Arguments
- **Angle** as: NUMBER
#### Returns
NUMBER
## Trim
Get text String with any leading and trailing spaces.
No additional remarks available
#### Signature
Trim(TextString: STRING)
#### Arguments
- **TextString** as: STRING
  - Remarks: A String to trim leadibng and trailing spaces from (if any).
#### Returns
STRING
## Upper
Convert text String to all upper case.
No additional remarks available
#### Signature
Upper(TextString: STRING)
#### Arguments
- **TextString** as: STRING
  - Remarks: A String to convert to upper case.
#### Returns
STRING
## WildCard
Test if text String contains wildcard string.
No additional remarks available
#### Signature
WildCard(SearchString: STRING, WildcardString: STRING)
#### Arguments
- **SearchString** as: STRING
  - Remarks: A String to text against a wildcard match.
- **WildcardString** as: STRING
  - Remarks: A Wildcard String to match against.
#### Returns
BOOLEAN
