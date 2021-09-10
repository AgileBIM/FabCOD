/* READ FIRST
URL that documents the type of documentation method we are using
https://tsdoc.org/pages/tags/remarks/

Documentation Related Notes: 
	- This document is dual purpose, it defines every object type, property and function within fabrication scripting.
	  Which is going to be used to to generate the ITM interface map and parsed into a JSON object for intellisense
	- The easiest way to do documentation is to define everything and then just ahead of each item hit Ctrl+Spacebar
	  and the very first suggested item should be the snippet for inserting documentation. On methods this will 
	  auto-detect and fill in your @param sequences for you
	- The very first line of all documentation should be a short description. This should be concise, but practice brevity.
	- The @remarks type is intended for being verbose when you need to. This should always be the LAST @ type in the 
	  documentation header, but is entirely optional. You can even even use Markdown syntax if you want a jump start on
	  the formal browser documentation.
	- Function arguments can optionally have a short description if the @param name isn't obvious enough to inform a user
	  how to properly use the function. However, these need to be short and on the same line as the * @param initializer
	- Functions can use the @returns descriptor if you want to say anything more about the return type than what was defined
	  on the actual function. This option has to do with elaborating on special return behaviors. IE, can it return various
	  types under different conditions? Also appropriate to use it for additional context about what it is returning.	  
	- Properties do not need to use the @returns under any circumstances, let the description or @remarks explain those.

URL related to TypeScript core Data Types:
https://www.typescriptlang.org/docs/handbook/basic-types.html
Note: it is preferred to use the OR operator '|' to delineate multiple types something can take/give/return. However,
	  there will certainly be situations where that list epic or very unclear. Those are the situations that the 'Any'
	  type can be used instead of trying to represent all possible applicable data types.

You'll notice I have //#region & //#endregion markers around various things. These are manual collapsible markers and I've
populated all of the ones we could ever need. In some cases purely to provide additional contextual bread crumbs.
*/

/*
Review Notes:
	Removed value type constants (True, False, Null Void)
	Fixed the boolean return types to be Typescript instead of the removed constants
	Changed interfaces representing creatable/usable object types into abstract classes
		Changed their self named constructor functions into actual constructor functions unless they were static
		Also migrated these to the end of this document after the classes.
		Task is a static object and that was represented by it not having a constructor
	Changed Array.Insert return type to boolean instead of Any because that is what the description said it returned
	Moved all the ITEM content to the ITEMSTRUCT class and added "extends ITEMSTRUCT" keywords to the ITEM interface
	Added Keyword const lists for all the stuff we aren't documenting, but is still prefered to be represented here for generated highlighting
	Added the Error function, but not much was actually known about it.
Review Notes (Dyoung - 2021.01.11)
	Changed FileLocator() function to Constructor
	Moved FileLocator object after File object to maintain alphabetical order of objects.
	Added RUN and INCLUDE to SPECIALTYPES Keyword Group
	Minor updates/misspelling in documentation in various locations
Review Notes (DYoung = 2021.01.25)
	Added 'BREAKPOINT' to SPEACIALTYPES
	Added 'OUTPUT()' to Global Functions
	Edited Description for 'ERROR' Global Function
	Added 11 'Add____()' and 11 'Remove____()' Methods to 'PRODUCTENTRY' Object.
	Added 'SEEKENTRY()' and 'SEEKLINE()' Methods to 'FILE' Object.
	Added 'ADDLINK()', 'DELETELINK()' and 'SETDONOTCUTFLAG()' Methods to 'ITEMSTRUCT' Object.
Review Notes (DYoung = 2021.05.16)
	Added 'UTF8' and 'UTF16' Enums to 'FILEMODE' Object.
	Added 'Group' property to 'SEAM' Object. 
	Edited various comments.
Review Notes (DYoung = 2021.06.02)
	Added 'PCFSKEY' Property to 'ITEMSTRUCT' Object.
Review Notes (DYoung = 2021.06.13)
	Various comment edits/spelling corrections.
	Added 'Group' property to 'AIRTURN', 'SPLITTER' and 'STIFFENER' Objects. 
	Added 'FacingLock' property to 'INSULATION' Object.
Review Notes (DYoung = 2021.06.24)
	Added 'Rotation' property to 'DAMPER' Object.
Review Notes (DYoung = 2021.09.07)
	Added 'ABS()' to Global Functions.
	Added 'GETFILEPATH()' to Global Functions
	Edited notes/context help for 'GETFILENAME()' in Global Functions
	Edited notes/context help for 'GETFILEEXT()' in Global Functions
*/

// IMPORTANT: Anywhere (in code) you are representing an actual value of a string, please use single quotes. This does not apply to the /** documentation areas */


// This namespace represents a template of the entire Autodesk Fabrication scripting environment
// There are some caveats to this for OPERATORS, NUMBERS & STRINGS
export namespace FABRICATION {

	//#region Fabrication Keyword Groups

	export const FLOWCONTROL: Array<string> = [
		'If',
		'Then', 
		'Else', 
		'Else If', 
		'ElseIf', 
		'End If', 
		'EndIf', 
		'While', 
		'End While', 
		'EndWhile', 
		'For', 
		'To', 
		'Step', 
		'Next', 
		'Do', 
		'Until', 
		'Loop', 
		'Select', 
		'Case', 
		'End Select', 
		'EndSelect', 
		'Function', 
		'Return', 
		'End Function', 
		'EndFunction',		
	];
	
	// Note: The entire enumeration section further below is merged into this list for highlighting purposes when generating codscript-tmLanguage.json
	export const VALUETYPES: Array<string> = [
		'True',
		'False', 
		'Null', 
		'Void'
	];

	export const SPECIALTYPES: Array<string> = [
		'And', 
		'Or', 
		'Not', 
		'As', 
		'Is', 
		'New', 
		'Dim', 
		'Object', 
		'Requires',
		'Include',
		'Run',
		'Breakpoint'
	];

	//#endregion Fabrication Keyword Groups


	// --------------------------------------------- Section Separator ---------------------------------------------


	//#region Fabrication Global Constants

	/**
	 * The 'BACKUP' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_BACKUP: string = 'MAPPATH_BACKUP';

	/**
	 * The 'BLOCKS' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_BLOCKS: string = 'MAPPATH_BLOCKS';

	/**
	 * The 'CNC' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_CNC: string = 'MAPPATH_CNC';

	/**
	 * The 'DATABASE' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_DATABASE: string = 'MAPPATH_DATABASE';

	/**
	 * The 'DXF' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_DXF: string = 'MAPPATH_DXF';

	/**
	 * The 'FILTER' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_FILTER: string = 'MAPPATH_FILTER';

	/**
	 * The current working directory of the Fabrication Database
	 */
	let MAPPATH_HOME: string = 'MAPPATH_HOME';

	/**
	 * The 'IMAGES' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_IMAGES: string = 'MAPPATH_IMAGES';
	
	/**
	 * The 'INSTALL' directory of the Fabrication Database where MAP.INI is located
	 */
	let MAPPATH_INSTALL: string = 'MAPPATH_INSTALL';
	
	/**
	 * The 'ITEMS' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_ITEMS: string = 'MAPPATH_ITEMS';
	
	/**
	 * The 'PARTS' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_PARTS: string = 'MAPPATH_PARTS';
	
	/**
	 * The 'PROJECT' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_PROJECT: string = 'MAPPATH_PROJECT';
	
	/**
	 * The 'REMNANTS' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_REMNANTS: string = 'MAPPATH_REMNANTS';
	
	/**
	 * The 'REPORTS' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_REPORTS: string = 'MAPPATH_REPORTS';
	
	/**
	 * The 'SCRIPTS' directory of the Fabrication Database as configured in MAP.INI
	 */
	let MAPPATH_SCRIPTS: string = 'MAPPATH_SCRIPTS';
	
	/**
	 * The value of the mathamatical constant PI
	 */
	let PI: number = 3.141592653589793238;
	
	/**
	 * Unknown Constant / Purpose Unknown
	 */
	let EO_NEVER: number = 2;
		
	//#endregion Fabrication Global Constants


	// --------------------------------------------- Section Separator ---------------------------------------------


	//#region Fabrication Property/Function expected value Enumerators


	// NOTE: There could be more opportunities to package possible arguments into enums, but we shouldn't do this if they aren't actually constants. 
	//		 A fine example of one not to do this with is the item.EndLocation(index, xyz)
	//		 The reason XYZ is a bad one is the fact that it is a string rather than a true constant. 
	//		 Some function could have duality accepting both quoted and non-quoted versions, those we can package into enums for sure.
	//		 Ultimately, if there are a lot of opportunities for string constants, we can come up with a mechanism for parsing actual string
	//		 For Example, JS/TS use single and double quotes interchangeably so '"X"' would be an excellent way to represent constant values that
	//		 must be wrapped in double quotes.

	/**
	 * Represents value options for various FILE functions.
	 */
	enum DBLOCKCAN {
		LOCK_USER = 'LOCK_USER',
		LOCK_OWNER = 'LOCK_OWNER'
	}
	
	/**
	 * Represents value options for the ShowFlags argument of EXEC().
	 */
	enum EXECFLAG {
		EXEC_DEFAULT = 'EXEC_DEFAULT',
		EXEC_WAIT = 'EXEC_WAIT',
		EXEC_SHOW_NORMAL = 'EXEC_SHOW_NORMAL',
		EXEC_SHOW_MAX = 'EXEC_SHOW_MAX',
		EXEC_SHOW_MIN = 'EXEC_SHOW_MIN'
	}

	/**
	 * Represents value options for various FILE functions.
	 */
	enum FILEMODE {
		FORINPUT = 'FORINPUT',
		FOROUTPUT = 'FOROUTPUT',
		ISTEXT = 'ISTEXT',
		UNICODETEXT = 'UNICODETEXT',
		UTF8 = 'UTF8',
		UTF16 = 'UTF16'
	}

	/**
	 * Represents value options for the FILE.POSITION property.
	 */
	enum FILEPOS {
		FILE_END = 'FILE_END',
		FILE_START = 'FILE_START'
	}

	/**
	 * Represents value options for time unit related properties.
	 */
	enum TIMEUNITS {
		TIME_SECS = 'TIME_SECS',
		TIME_MINS = 'TIME_MINS',
		TIME_HOURS = 'TIME_HOURS'
	}
	

	//#endregion Fabrication Property/Function expected value Enumerators


	// --------------------------------------------- Section Separator ---------------------------------------------


	//#region Fabrication Global Functions

	/**
	 * Get the inverse Cosine angle of Adj/Hyp.
	 * @param Adjacent 
	 * @param Hypotenuse 
	 * @returns number
	 */
	function ACos(Adjacent: number, Hypotenuse: number): number	{ 
		return 0; 
	}

	/**
	 * Get the inverse Sine angle of Opp/Hyp.
	 * @param Opposite 
	 * @param Hypotenuse 
	 * @returns number
	 */
	function ASin(Opposite: number, Hypotenuse: number): number	{ 
		return 0; 
	}

	/**
	 * Get the inverse Tangent angle of Opp/Adj.
	 * @param Opposite 
	 * @param Adjacent
	 * @returns number
	 */
	function ATan(Opposite: number, Adjacent: number): number { 
		return 0; 
	}

	/**
	 * Get the Cosine of angle.
	 * @param Angle
	 * @returns number
	 */
	function Cos(Angle: number): number	{ 
		return 0; 
	}

	/**
	 * Get the Sine of angle.
	 * @param Angle
	 * @returns number
	 */
	function Sin(Angle: number): number	{ 
		return 0; 
	}

	/**
	 * Get the Tangent of angle.
	 * @param Angle
	 * @returns number
	 */
	function Tan(Angle: number): number	{
		return 0; 
	}

	/**
	 * Get the Inverse log of value (10 to the power of value).
	 * @param Value
	 * @returns number
	 */
	function Exp(Value: number): number	{
		return 0; 
	}

	/**
	 * Get the log of value (base 10).
	 * @param Value
	 * @returns number
	 */
	function Log(Value: number): number	{
		return 0; 
	}

	/**
	 * Get the absolute value of value.
	 * @param Value
	 * @returns number
	 */
	 function Abs(Value: number): number	{
		return 0; 
	}

	/**
	 * Forces extraction of Number from variable data types.
	 * @param Value
	 * @returns number
	 */
	function Number(Value: any): number	{
		return 0; 
	}

	/**
	 * Get the value to the power of n.
	 * @param Value
	 * @param N
	 * @returns number
	 */
	function Pow(Value: number, N: number): number	{
		return 0; 
	}

	/**
	 * Get the sign of a number.
	 * @param Value
	 * @returns +1, -1, or 0 depending if value is positive, negative or very close to zero respectively.
	 */
	function Sign(Value: number): number { 
		return 0; 
	}

	/**
	 * Get the Square root of the number.
	 * @param Value
	 * @returns number
	 */
	function Sqrt(Value: number): number { 
		return 0; 
	}

	/**
	 * Get the Square of the number passed (ie value x value).
	 * @param Value
	 * @returns number
	 */
	function Sqr(Value: number): number	{ 
		return 0; 
	}

	/**
	 * Get the value rounded number of decimalplaces (nearest up or down).
	 * @param Value
	 * @param DecimalPlaces Optional and defaults to zero (0).
	 * @returns Number rounded to the nearest number of decimal places.
	 */
	function Round(Value: number, DecimalPlaces?: number): number { 
		return 0; 
	}

	/**
	 * Get the number rounded down to number of decimal places.
	 * @param Value
	 * @param DecimalPlaces Optional and defaults to zero (0).
	 * @returns Number rounded down to the nearest number of decimal places.
	 */
	function RoundDown(Value: number, DecimalPlaces?: number): number { 
		return 0; 
	}
	
	/**
	 * Get the value rounded up to number of decimal places.
	 * @param Value
	 * @param DecimalPlaces Optional and defaults to zero (0).
	 * @returns Number rounded up to the nearest number of decimal places.
	 */
	function RoundUp(Value: number, DecimalPlaces?: number): number { 
		return 0; 
	}

	/**
	 * Gets the ASCII numeric code from a string character.
	 * @param FirstChar Can be any length string,- but only the first character is evaluated.
	 * @returns A number representing the ASCII code of the first character in the provided string.
	 * @remarks
	 * This does not work with unicode characters. If you want an ASCII code from an index other than the first character
	 * then you will have to use the MID() function to carve it out.
	 */
	function Asc(FirstChar: string): number	{ 
		return 0; 
	}

	/**
	 * Create a string with a non-enterable character code.
	 * @param CharacterCode A number representing an ASCII character.
	 * @returns A single character String, code or non-enterable text represented by an ASCII character code.
	 * @remarks
	 * This does not work with unicode characters, but is ideal generating tabs, line-feeds and other things
	 * that aren't easily represented in double quoted strings.
	 */
	function Ascii(CharacterCode: number): string { 
		return ''; 
	}

	/**
	 * Returns string containing the character at the specified 1-based index of String txt. 
	 * @param TextString The base string to be searched.
	 * @param CharacterPosition The numeric index of the character to return.
	 * @returns A single character String.
	 * @remarks
	 * The CharacterPosition argument is a 1-Based index: 1 = first character, 2 = second character, etc.
	 */
	function Chr(TextString: string, CharacterPosition: number): string { 
		return ''; 
	}

	/**
	 * Extract file extension (including .) from filename / full path + filename.
	 * @param FileName A String representing a file name with or without the full path.
	 * @returns A String of the file extension (including '.') of the specified filename/path.
	 * @remarks
	 * File extension is returned including the dot [.] If no extension is specified, will return an empty string [""].
	 * Optional path may use either backslash [\] or forwardslash [/] seperators between directories.
	 */
	function GetFileExt(FileName: string): string { 
		return ''; 
	}

	/**
	 * Extract file name (including extension) from filename / full path + filename.
	 * @param FilePathAndName A String representing a file full path and name.
	 * @returns A String of the file name including extension.
	 * @remarks
	 * File name is returned including the extension.
	 * Path may use either backslash [\] or forwardslash [/] seperators between directories.
	 */
	function GetFileName(FilePathAndName: string): string { 
		return ''; 
	}

	/**
	 * Extract file path from full path + filename,
	 * @param FilePathAndName A String representing a file full path and name.
	 * @returns A String of the file path including extension.
	 * @remarks
	 * Path may use either backslash [\] or forwardslash [/] seperators between directories.
	 */
	 function GetFilePath(FilePathAndName: string): string { 
		return ''; 
	}

	/**
	 * Extracts the first index location of a string if completely found within another string.
     * @param StartingFrom The numeric index of the character to begin the search.
     * @param SearchIn The base string to be searched.
     * @param SearchFor The value string to be located.
     * @param IsCaseSensitive Optional and defaults to FALSE. If provided as TRUE, then "CaSe SeNsItIvE" would not match "Case Sensitive".
     * @returns A Number representing the first occurrence the SearchFor value was found in the SearchIn string or 0 if not found.
     * @remarks
     * The StartingFrom argument and the subsequent return values are a 1-Based index: 1 = first character, 2 = second character, etc.
     */
    function InStr(StartingFrom: number, SearchIn: string, SearchFor: string, IsCaseSensitive?: boolean): number { 
        return 0; 
    }

	/**
	 * Get a SubString from the start of text String which is the specified number of characters in length.
	 * @param TextString The text String to extract a SubString from.
	 * @param Length A number representing the length of the SubString desired.
	 * @returns A String the specified length starting from the beginning of the original text String.
	 */
	function Left(TextString: string, Length: number): string { 
		return ''; 
	}

	/**
	 * Get the length of String.
	 * @param TextString A String to find the length of.
	 * @returns A Number specifying the length of the String.
	 */
	function Len(TextString: string): number { 
		return 0; 
	}

	/**
	 * Convert a text String to all lower case.
	 * @param TextString A String to convert to lower case.
	 * @returns A String converted to all lower case.
	 */
	function Lower(TextString: string): string { 
		return ''; 
	}

	/**
	 * Get a text String with any leading spaces removed.
	 * @param TextString A String to trim leading spaces from (if any).
	 * @returns A String with any leading spaces removed.
	 */
	function LTrim(TextString: string): string { 
		return ''; 
	}

	/**
	 * Get a SubString from the middle of another string by specifying the start position and length.
	 * @param SearchString The text String to extract a SubString from.
	 * @param StartingFrom A Number (1-based index) for the starting character position to get the SubString from.
	 * @param Length A number representing the length of the SubString desired.
	 * @returns A String the specified length starting from the specified character position.
	 * @remarks
	 * The StartingFrom argument is a 1-Based index: 1 = first character, 2 = second character, etc.
	 * Similar to SubString() except you specify a starting position and length.
	 */
	function Mid(SearchString: string, StartingIndex: number, Length: number): string { 
		return ''; 
	}

	/**
	 * Get a SubString from the end of a text String which is the specified number of characters in length.
	 * @param TextString The text String to extract a SubString from.
	 * @param Length A number representing the length of the SubString desired.
	 * @returns A String the specified length starting from the end of the original text String.
	 */
	function Right(TextString: string, Length: number): string { 
		return ''; 
	}

	/**
	 * Get a text String with any trailing spaces removed.
	 * @param TextString A String to trim trailing spaces from (if any).
	 * @returns A String with any trailing spaces removed.
	 */
	function RTrim(TextString: string): string { 
		return ''; 
	}

	/**
	 * Get a SubString, starting and ending at specified index positions.
	 * @param TextString The text String to extract a SubString from.
	 * @param StartingFrom A Number (1-based index) for the starting character position to get the SubString from.
	 * @param EndingAt A number (1-based index) for the ending character position to get the substrinbg from.
	 * @returns A String the specified length starting from the specified character position.
	 * @remarks
	 * The StartingFrom and EndingAt arguments are a 1-Based index: 1 = first character, 2 = second character, etc.
	 * Similar to Mid() except you specify a starting position and length.
	 * 0 or even negative values can be used for the index which is interpreted as 'from the end of the string (inclusive)'
	 */
	function SubString(TextString: string, StartingFrom: number, EndingAt: number): string { 
		return ''; 
	}

	/**
	 * Get a text String with any leading and trailing spaces.
	 * @param TextString A String to trim leading and trailing spaces from (if any).
	 * @returns A String with any leading and trailing spaces removed.
	 */
	function Trim(TextString: string): string { 
		return ''; 
	}

	/**
	 * Convert a text String to all upper case.
	 * @param TextString A String to convert to upper case.
	 * @returns A String converted to all upper case.
	 */
	function Upper(TextString: string): string { 
		return ''; 
	}

	/**
	 * Test if text String matches a wildcard string.
	 * @param SearchString A String to text against a wildcard match.
	 * @param WildcardString A Wildcard String to match against.
	 * @returns A Boolean flag if wildcard string was found.
	 */
	function WildCard(SearchString: string, WildcardString: string): boolean {
		return false;
	}
	
	/**
	 * Display an Alert message box with a single OK button used to dismiss the message.
	 * @param MessageText A String Label to display in the dialog title bar.
	 * @returns Nothing
	 * @remarks
	 * This can be called with 'DEBUG()' and without 'DEBUG' parenthesis.
	 */
	function Debug(MessageTest: string): void {
		return null;
	}

	/**
	 * Execute an external Application, Document or Link.
	 * @param FullFilePath String represnting full path and name of EXE, Document or Link.
	 * @param ShowFlags Number (ENUM) to configure how to display the external application.
	 * @param AppParams  String paramaters to pass to the external application.
	 * @param AppWorkingDir String full path to the working directory for the external application.
	 */
	function Exec(FullFilePath: string, ShowFlags: EXECFLAG, AppParams: string, AppWorkingDir: string): void {
		return null;
	}

	/**
	 * Display a Dialog with an Editbox for the user to enter data.
	 * @param TitleText A String Label to display in the dialog title bar.
	 * @param PromptText A String message instructing the user what to enter.
	 * @param DefaultText A String to use as default Text in the Editbox.
	 * @returns Text String as entered by the user.
	 * @remarks
	 * Message box provides an 'OK' and 'CANCEL' button for the user to accept or dismiss the dialog and
	 * user entered data. Clicking 'CANCEL' will return an empty string.
	 */
	function InputBox(TitleText: string, PromptText: string, DefaultText: string): string {
		return "";
	}

	/**
	 * Display a simple dialog for the user to select 'YES' or 'NO'.
	 * @param PromptText A String message instructing the user what to enter.
	 * @returns Text String as entered by the user.
	 */
	function Query(PromptText: string): boolean {
		return false;
	}

	/**
	 * Dispalys to the User, a custom error message as desired by your code.
	 * @param Input Accepts just about any 1 item.
	 * @returns Nothing
	 */
	function Error(Input: any): void {
		return null;
	}

	/**
	 * Outputs a message to the Console window.
	 * @param TextMessage Text to output to the console window.
	 * @remarks
	 * Applies to the Console Window of ESTmep and CAMduct. Does nothing
	 * in CADmep.
	 * This function displays a text string only. It can not be used to automate
	 * or issue commands to or automate from the Console Window.
	 */
	function Output(TextMessage: any): void {
		return null;
	}
	
	//#endregion Fabrication Global Functions


	// --------------------------------------------- Section Separator ---------------------------------------------
	

	//#region Fabrication Sub-Object Definitions


	interface AIRTURN {

		//#region AIRTURN Properties Group

		/**
		 * Get the Airturn Group for the AIRTURN Object.
		 * @readonly
		 * @remarks Airturn Group property available only in 2022 and later versions of Autodesk Fabrication.
		 */
		 Group: String;

		/**
		 * Get/Set the Lock Status of the AIRTURN Object.
		 */
		Locked: boolean;

		/**
		 * Get/Set the Name of the AIRTURN Object. 
 		 * @remarks
		 * Only Airturn Name is given. Airturn Group is not given as part of the value.
		 * Airturn can be set using either an Index or Name.
		 */
		Value: string;
	
		//#endregion AIRTURN Properties Group

		//#region AIRTURN Methods Group
		// Not Applicable
		//#endregion AIRTUEN Methods Group

	}
	
	interface CONNECTOR {

		//#region CONNECTOR Properties Group

		/**
		 * Get/Set the Alternate Code of the CONNECTOR Object.
		 * @remarks Alternate Code is used for enforcing Alternate Connector values using the Specifications.
		 */
		Alt: string;

		/**
		 * Get the Connector Group for the CONNECTOR Object.
		 * @readonly
		 */
		Group: String;
		
		/**
		 * Get/Set the Lock Status of the CONNECTOR Object.
		 */
		Locked: boolean;

		/**
		 * Get/Set the Connector Material of the CONNECTOR Object.
		 * @remarks Property only exists on Pattern Numbers 522, 1522 and 2522 (coupling patterns) to allow for
		 * transitions to alternate material types. When set to "None", scripts return the value of "Error" however
		 * the value can be set to "None" using Item.Connector[index].Material = "None".
		 * If duct coupling pattern 522 is Doublewall, an Error will also result for the Skin Connector Material.
		 * Skin Connector Material property can not be set via UI but can be reset via code using
		 * Item.SkinConnector[index].Material = "None".
		 */
		Material: string;

		/**
		 * Get the Connector Library Type of the CONNECTOR Object.
		 * @readonly
		 */
		Type: string;

		/**
		 * Get/Set the Name of the Connector. 
		 * @remarks Group is given by the Group property.
		 */
		Value: string;
	
		//#endregion CONNECTOR Properties Group

		//#region CONNECTOR Methods Group
		// Not Applicable
		//#endregion CONNECTOR Methods Group
	
	}
	
	interface CUSTOMDEF {
	
		//#region CUSTOMDEF Properties Group
	
		/**
		 * Get/Set the value of the Custom Data field, which could be Nothing
		 */
		Value: string|number|null;
	
		/**
		 * Get the index number as defined in the Fabrication Database
		 * @readonly
		 */
		Id: number;
	
		//#endregion CUSTOMDEF Properties Group
	
		//#region CUSTOMDEF Methods Group
		// Not Applicable
		//#endregion CUSTOMDEF Methods Group

	}
	
	interface DAMPER {

		//#region DAMPER Properties Group

		/**
		 * Get/Set the Lock Status of the DAMPER Object.
		 */
		Locked: boolean;

		/**
		 * Get/Set the Rotation Adjuect of the DAMPER Object. 
		 * @remarks
		 * Property is only available in Autodesk Fabrication 2017 and later. It acts upon a damper as an 'Adjust' not an
		 * 'Override'. It was added to support Dynamic Damper Rotation from within in Revit. The value of  the rotation
		 *  override will be added to the damper 'Angle' on the Damper database object.
		 * e.g. If a Damper database definition has an angle of 90 degrees, and the Damper Rotation property is 90 degrees, 
		 * the Damper will be rotated 180 degrees on the ITM.
		 */
		Rotation: number;

		/**
		 * Get/Set the name of the DAMPER Object. 
		 */
		Value: string;
	
		//#endregion DAMPER Properties Group

		//#region DAMPER Methods Group
		// Not Applicable
		//#endregion DAMPER Methods Group
	
	}
	
	interface DBLOCKHISTORY {
	
		//#region DBLOCKHISTORY Properties Group

		/**
		 * Get the Date/Time Stamp of the Version Record of the DBLOCKHISTORY Object.
		 * @readonly
		 */
		Changed: string;

		/**
		 * Get the History Object of the DBLOCKHISTORY Object.
		 * @remarks 
		 * History object is recursive. Each History Object contains another History object. This continues until the
		 * Histroy object returns a NULL value. Do NOT interate through the nested History objects using the Version
		 * property as that property can be rolled back/forward and many not indicate the number of history entries accurately. 
		 */
		History: DBLOCKHISTORY;

		/**
		 * Get the Information Data of the Version Record of the DBLOCKHISTORY Object.
		 * @readonly
		 */
		Info: string;

		/**
		 * Get the Previous Owner of DBLOCKHISTORY Object.
		 * @readonly
		 */
		Owner: string;

		/**
		 * Get the Previous Version of the DBLOCKHISTORY Object.
		 * @readonly
		 */
		Version: number;

		//#endregion DBLOCKHISTORY Properties Group
	
		//#region DBLOCKHISTORY Methods Group
		// Not Applicable
		//#endregion DBLOCKHISTORY Methods Group
	
	}
	
	interface DBLOCKINFO {
	
		//#region DBLOCKINFO Properties Group

		/**
		 * Get the History Object of the ITEM Object.
		 * @remarks
		 * History object is recursive. Each History Object contains another History object. This continues until the
		 * Histroy object returns a NULL value. Do NOT interate through the nested History objects using the Version
		 * property as that property can be rolled back/forward and many not indicate the number of history entries accurately. 
		 */
		History: DBLOCKHISTORY;

		/**
		 * Get the Previous Owner of the DBLOCKINFO Object.
		 * @readonly
		 */
		Owner: string;

		/**
		 * Get the Previous Version of the DBLOCKINFO Object
		 * @readonly
		 */
		Version: number;

		//#endregion DBLOCKINFO Properties Group
	
		//#region DBLOCKINFO Methods Group

		/**
		 * Indicates if the Item's current Owner allows access to History/Versioning.
		 * @param LockType Enum/Number for access type to check. 
		 */
		Can(LockType: DBLOCKCAN): boolean;

		/**
		 * Changes the current owner.
		 * @param NewOwner String representing the new owner.
		 * @param Reason String description of the reason for the change.
		 * @returns Boolean Flag is successful or not.
		 * @remarks
		 * Only returns TRUE if allowed to change and change is different than current owner.
		 */
		SetOwner(NewOwner: string, Reason: string): boolean;

		/**
		 * Changes the current version.
		 * @param NewVersion Number representing the new version.
		 * @param Reason String description of the reason for the change.
		 * @remarks
		 * Only returns TRUE if allowed to change an change is different than current version.
		 */
		SetVersion(NewVersion: number, Reason: string): boolean;

		//#endregion DBLOCKINFO Methods Group
	
	}
	
	interface DECOILERINFO {
	
		//#region DECOILERINFO Properties Group

		/**
		 * Get the Beading Flag of the DECOILERINFO Object.
		 * @readonly
		 */
		Beading: boolean;

		/**
		 * Get the cofigured Decoiler Width of the DECOILERINFO Object.
		 * @readonly
		 */
		CoilWidth: number;

		/**
		 * Get the remainder of straight length of the DECOILERINFO Object. 
		 * @readonly
		 * @remards Remainder of straight length is calculated as a remainder of straight after
		 * the length is broken down into standard straight lengths.
		 */
		SmallLength: number;

		/**
		 * Get the standard straight length that the entered length is broken into of the DECOILERINFO Object.
		 * @readonly
		 * @remarks Standard Length may be smaller than the Coil Width depending on connector adjusts, etc.
		 */
		StdLength: number;

		/**
		 * Get the quantity of standard lengths that the entered length is broken into for the DECOILER Object.
		 * @readonly
		 */
		StqQty:	number;

		//#endregion DECOILERINFO Properties Group
	
		//#region DECOILERINFO Methods Group
		// Not Applicable
		//#endregion DECOILERINFO Methods Group
	
	}
	
	interface DIM {
	
		//#region DIM Properties Group

		/**
		 * Get the Annotation of the DIM Object.
		 * @readonly
		 * @remarks Annotations of the Dimension are the A, B, C, etc. text strings related to the dimension.
		 */
		Annotation: string;

		/**
		 * Get/Set the Lock Status of the DIM Object.
		 */
		Locked: boolean;

		/**
		 * Get the Dimension Name of the DIM Object.
		 * @readonly
		 */
		Name: string;

		/**
		 * Get the Calculated Numerical Value of the DIM Object.
		 * @readonly
		 * @remarks Some Dimension values have settings like "Auto", "Dependent", "Calculated". This property retuns
		 * the calculated value of the dimension with those settings.
		 */
		NumValue: number;

		/**
		 * Get the Status of the Dimension of the DIM Object.
		 * @readonly
		 * @remarks Status values are "Input", "Display", "Not Used" or "Fixed".
		 */
		Status: string;

		/**
		 * Get/Set the Value of the DIM Object.
		 */
		Value: string|number;

		//#endregion DIM Properties Group
	
		//#region DIM Methods Group
		// Not Applicable
		//#endregion DIM Methods Group
	
	}
	
	interface INSULATION {
	
		//#region INSULATION Properties Group

		/**
		 * Get/Set the Facing Name of the INSULATION Object.
		 * @remarks Facing Name only is given. Facing Group is not given as part of the value.
		 */
		Facing: string;

		/**
		 * Get/Set the Lock Status of the Facing property of the INSULATION Object.
		 */
		 FacingLock: boolean;

		/**
		 * Get/Set the Insulation Gauge of the INSULATION Object.
		 * @remarks For Insulation Material Types 'Linear Ductwork' and 'For Machines', Gauge gives the Insulation Thickness.
		 * For Insulation Material Types 'Pipework', 'Electrical Containment' and 'Undefined' Gauge gives the Insualtion Material
		 * Index Number as entered in the Insulation Material (e.g. May be a decimal).
		 */
		Gauge: number;

		/**
		 * Get/Set the Insulation Material Name of the INSULATION Object.
		 * @remarks Insulation Material Group is not given as part of the value. 
		 */
		Material: string;

		/**
		 * Get/Set the Lock Status for the Material property of the INSUALTION Object.
		 */
		MaterialLock: boolean;

		/**
		 * Get/Set the Insualtion Status of the INSULATION Object.
		 * @remarks "OFF", "INSIDE" and "OUTSIDE" are the only values allowed.
		 */
		Status: string;

		/**
		 * Get/Set the Lock Status for the Status property of the INSULATION Object.
		 * @remarks Appears to not be functional in many (newer) versions of Autodesk Fabrication.
		 */
		StatusLock: boolean;

		//#endregion INSULATION Properties Group
	
		//#region INSULATION Methods Group
		// Not Applicable
		//#endregion INSULATION Methods Group
	
	}
	
	interface JOB {
		
		//#region JOB Properties Group
	
		/**
		 * Get/Set the Job Color value of the JOB Object.
		 * @remarks
		 * Value is given as an integer representing AutoCAD's Color index (0 - 255).
		 */
		Colour: number;
	
		/**
		 * If applicable, this gets an array of CUSTOM DATA Objects for the JOB Object.
		 * @remarks 
		 * There is no way to itterate over this array, you need to be aware of the custom data indices or names that exist in your database.
		 */
		CustomData: Array<CUSTOMDEF>;
	
		/**
		 * Get the Job Creation Date value of the JOB Object.
		 * @readonly
		 */
		Date: string;
		
		/**
		 * Get/Set the generic utility field #1 of JOB Object.
		 * @remarks
		 * Field can be used for any user defined purpose.
		 */
		Field1: string;
	
		/**
		 * Get/Set the generic utility field #2 of JOB Object.
		 * @remarks
		 * Field can be used for any user defined purpose.
		 */
		Field2: string;

		/**
		 * Get the Number of Items in job of the JOB Object.
		 * @readonly
		 */
		Items: number;
		
		/**
		 * If applicable, this gets an array of ITEM Objects for the JOB Object.
		 * @remarks
		 * Always check to see if the 'Items' property returns a value >= 1 before using Job.Item[index#]
		 */
		Item: Array<ITEM>;
	
		/**
		 * Get the Job Name of the JOB Object.
		 * @readonly
		 */
		Name: string;
	
		/**
		 * Get/Set the Notes property of the JOB Object.
		 */
		Notes: string;
	
		/**
		 * Get the Job Path { relative to PROJECT path } of the JOB Object.
		 * @readonly
		 */
		Project: string;
	
		/**
		 * Get the Job Ref property of the JOB Object.
		 * @readonly
		 */
		Reference: string;

		/**
		 * Get the number of Statuses of the JOB Object.
		 * @readonly
		 */
		Statuses: number;

		/**
		 * If applicable, this gets an array of JOBSTATUS Objects for the JOB Object.
		 */
		Status: Array<JOBSTATUS>;
		
		//#endregion JOB Properties Group
		
		//#region JOB Methods Group
	
		/**
		 * This alters the Active Flag of a Job Status
		 * @param NameOrIndex Number or String of Status to be altered.
		 * @param Active Boolean Flag indicating if Status should be made Active.
		 * @returns Boolean Flag indicating is status activation was successful.
		 * @remarks
		 * Returns False if there was an error during Status Activation, True otherwise.
		 */
		SetStatus(NameOrIndex: number|string, Active: boolean): boolean;
	
		//#endregion JOB Methods Group
	}
	
	interface JOBSTATUS {
	
		//#region JOBSTATUS Properties Group
	
		/**
		 * Get the Status Active flag of the JOBSTATUS Object.
		 * @readonly
		 */
		Active: boolean;
	
		/**
		 * Get the Date status was last activated in short-date string format of the JOBSTATUS Object.
		 * @readonly
		 */
		LastActivated: string;
	
		/**
		 * Get the Status Name of the JOBSTATUS Object.
		 * @readonly
		 */
		Name: string;
	
		//#endregion JOBSTATUS Properties Group
		
		//#region JOBSTATUS Methods Group
		// Not Applicable
		//#endregion JOBSTATUS Methods Group
		
	}
	
	interface LINK {
	
		//#region LINK Properties Group

		/**
		 * Get/Set the Link Name of the LINK Object.
		 */
		Name: string;

		/**
		 * Get/Set the Parameters of the LINK Object.
		 */
		Param: string;

		/**
		 * Get/Set the URL Target of the LINK Object.
		 */
		Target: string;

		//#endregion LINK Properties Group
	
		//#region LINK Methods Group
		// Not Applicable
		//#endregion LINK Methods Group
	
	}
	
	interface OPTION {
	
		//#region OPTION Properties Group

		/**
		 * Get/Set the Lock Status of the OPTION Object.
		 */
		Locked: boolean;

		/**
		 * Get the Name of the OPTION Object.
		 * @readonly
		 */
		Name: string;

		/**
		 * Get the Status of the OPTION Object.
		 * @readonly
		 * @remarks Valid values are 'Hidden' and 'Input'.
		 */
		Status: string;

		/**
		 * Get/Set the Value of the OPTION Object.
		 */
		Value: number|string;

		//#endregion OPTION Properties Group
	
		//#region OPTION Methods Group
		// Not Applicable
		//#endregion OPTION Methods Group
	
	}

	interface PRODUCTENTRY {
	
		//#region PRODUCTENTRY Properties Group

		/**
		 * Get/Set the Alias property of the PRODUCTENTRY Object.
		 */
		Alias: string;

		/**
		 * Get/Set the Area property of the PRODUCTENTRY Object.
		 */
		Area: number;

		/**
		 * Get/Set the BoughtOut flag of the PRODUCTENTRY Object.
		 */
		BoughtOut: boolean;

		/**
		 * Get/Set the CAD Block name of the PRODUCTENTRY Object.
		 */
		CadBlock: string;

		/**
		 * This gets an array of CUSTOMDEF Objects of the PRODUCTENTRY Object.
		 */
		CustomData: Array<CUSTOMDEF>;

		/**
		 * Get/Set the Database ID property of the PRODUCTENTRY Object.
		 */
		DatabaseID: string;

		/**
		 * This Gets an array of DIM Objects of the PRODUCTENTRY Object.
		 * @remarks Available properties of the DIM Object are limited within the PRODUCTENTRY Object.
		 */
		Dim: Array<number|string>;

		/**
		 * Get/Set the Maximum Flow value of the PRODUCTENTRY Object.
		 */
		FlowMax: number;

		/**
		 * Get/Set the Minimum Flow value of the PRODUCTENTRY Object.
		 */
		FlowMin: number;

		/**
		 * Get/Set the Model Name property of the PRODUCTENTRY Object.
		 */
		Model: string;

		/**
		 * Get/Set the Product Entry name of the PRODUCTENTRY Object.
		 */
		Name: string;

		/**
		 * This Gets an array of OPTION Objects of the PRODUCTENTRY Object.
		 * @remarks Available properties of the OPTION Object are limited within the PRODUCTENTRY Object.
		 */
		Option: Array<number|string>;

		/**
		 * Get/Set the Order property of the PRODUCTENTRY Object.
		 */
		Order: string;

		/**
		 * Get/Set the SKey property of the PRODUCTENTRY Object.
		 * @remarks
		 * Available in Fabrication 2018.2 versions and later.
		 */
		SKey: string;

		/**
		 * Get/Set the Weight value of the PRODUCTENTRY Object.
		 */
		Weight: number;

		//#endregion PRODUCTENTRY Properties Group
	
		//#region PRODUCTENTRY Methods Group

		/**
		 * Adds the 'ALIAS' Column to Product List.
		 * @returns Boolean flag indicating if adding column was successful or not.
		*/
	    AddAlias(): boolean;

		/**
		 * Adds the 'AREA' Column to Product List.
		 * @returns Boolean flag indicating if adding column was successful or not.
		 */
		AddArea(): boolean;

		/**
		 * Adds the 'BOUGHTOUT' Column to Product List.
		 * @returns Boolean flag indicating if adding column was successful or not.
		 */
		AddBoughtOut(): boolean;

		/**
		 * Adds the 'CADBLOCK' Column to Product List.
		 * @returns Boolean flag indicating if adding column was successful or not.
		 */
		AddCADBlock(): boolean;
		
		/**
		 * Adds the 'CUSTOMDATA[<dataname>]' Column to Product List.
		 * @param CustomDataName Text Name of Custom Data field to add.
		 * @returns Boolean flag indicating if adding column was successful or not.
		 */
		AddCustomData(CustomDataName: string): boolean;
		
		/**
		 * Adds the 'ID' Column to Product List.
		 * @returns Boolean flag indicating if adding column was successful or not.
		 */
		AddDatabaseID(): boolean;
		
		/**
		 * Adds the 'DIM' Column(s) to Product List.
		 * @param DimName Optional Upper Case Name of Dimension to add.
		 * @returns Boolean flag indicating if adding column was successful or not.
		 * @remarks
		 * Function is very buggy. Repeated calls with improper syntax will cause
		 * predictability of this function to be sporatic at best. Repeated calls without
		 * specifying the dimension name to add sequentially adds the next dimension
		 * as they are listed in the pattern.
		 */
		AddDim(DimName?: string): boolean;
		
		/**
		 * Adds the 'FLOWMIN' and 'FLOWMAX' Columns to Product List.
		 * @returns Boolean flag indicating if adding columns was successful or not.
		 */
		AddFlow(): boolean;
		
		/**
		 * Adds the 'OPTION' Column(s) to Product List.
		 * @param OptionName Optional Upper Case Name of Option to add.
		 * @returns Boolean flag indicating if adding column was successful or not.
		 * @remarks
		 * Function is very buggy. Repeated calls with improper syntax will cause
		 * predictability of this function to be sporatic at best. Repeated calls without
		 * specifying the dimension name to add sequentially adds the next dimension
		 * as they are listed in the pattern.
		 */
		AddOption(OptionNmae?: string): boolean;
		
		/**
		 * Adds the 'ORDER' Column to Product List.
		 * @returns Boolean flag indicating if adding columns was successful or not.
		 */
		AddOrder(): boolean;
		
		/**
		 * Adds the 'WEIGHT' Column to Product List.
		 * @returns Boolean flag indicating if adding columns was successful or not.
		 */
		AddWeight(): boolean;

		/**
		 * Removes the 'ALIAS' Column from the Product List.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 */
	    RemoveAlias(): boolean;

		/**
		 * Removes the 'AREA' Column from the Product List.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 */
		RemoveArea(): boolean;

		/**
		 * Removes the 'BOUGHTOUT' Column from the Product List.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 */
		RemoveBoughtOut(): boolean;
		
		/**
		 * Removes the 'CADBLOCK' Column from the Product List.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 */
		RemoveCADBlock(): boolean;
		
		/**
		 * Removes the 'CUSTOMDATA[<dataname>]' Column from the Product List.
		 * @param CustomDataName Text Name of Custom Data field to remove.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 */
		RemoveCustomData(Name: string): boolean;
		
		/**
		 * Removes the 'ID' Column from the Product List.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 */
		RemoveDatabaseID(): boolean;
		
		/**
		 * Removes the 'DIM' Column(s) from the Product List.
		 * @param DimIndex Zero based index of Dimension column to remove.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 * @remarks
		 * Function is very buggy. Repeated calls with improper syntax will cause
		 * predictability of this function to be sporatic at best. Calls without
		 * specifying the Dimension index appear to do nothing.
		 */
	    RemoveDim(DimIndex: number): boolean;
		
		/**
		 * Removes the 'FLOWMIN' and 'FLOWMAX' Columns from the Product List.
		 * @returns Boolean flag indicating if removing columns was successful or not.
		 */
		RemoveFlow(): boolean;

		/**
		 * Removes the 'OPTION' Column(s) from the Product List.
		 * @param OptionIndex Zero based index of Option column to remove.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 * @remarks
		 * Function is very buggy. Repeated calls with improper syntax will cause
		 * predictability of this function to be sporatic at best. Calls without
		 * specifying the Option index appear to do nothing.
		 */	
		RemoveOption(OptionIndex: number): boolean;
		
		/**
		 * Removes the 'ORDER' Column from the Product List.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 */
		RemoveOrder(): boolean;
		
		/**
		 * REmoves the 'WEIGHT' Column from the Product List.
		 * @returns Boolean flag indicating if removing column was successful or not.
		 */
	    RemoveWeight(): boolean;

		//#endregion PRODUCTENTRY Methods Group
	
	}
	
	interface PRODUCTINFO {
	
		//#region PRODUCTINFO Properties Group
		
		/**
		 * Gets the Number of Product List Entries of the PRODUCTINFO Object.
		 * @readonly
		 */
		Entries: number;

		/**
		 * This gets an array of PRODUCTENTRY Objects of the PRODUCTINFO Object.
		 */
		Entry: Array<PRODUCTENTRY>;

		/**
		 * Gets the HasAlias flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains an Alias column as part of its data.
		 */
		HasAlias: boolean;

		/**
		 * Gets the HasArea Flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains an Area column as part of its data.
		 */
		HasArea: boolean;

		/**
		 * Gets the HasBoughtOut Flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains a BoughtOut column as part of its data.
		 */
		HasBoughtOut: boolean;

		/**
		 * Gets the HasCadBlock Flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains a CAD Block column as part of its data.
		 */
		HasCADBlock: boolean;

		/**
		 * Gets the HasCustomData Flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains any Custom Data columns as part of its data.
		 */
		HasCustomData: boolean;

		/**
		 * Gets the number of Custom Data columns of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Number indicates the number of custom data columns in the Product List.
		 */
		HasCustomDatas: number;

		/**
		 * Gets the HasDatabaseID Flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains a Database ID column as part of its data.
		 */
		HasDatabaseID: boolean;

		/**
		 * Gets the number of DIM columns of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Number indicates the number of Dimension columns in the Product List.
		 */
		HasDims: number;

		/**
		 * Gets the HasFlow Flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains the Min & Max Flow columns as part of its data.
		 */
		HasFlow: boolean;

		/**
		 * Gets the number of OPTION columns of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Number indicates the number of Option columns in the Product List.
		 */
		HasOptions: number;

		/**
		 * Gets the HasOrder Flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains the Order column as part of its data.
		 */
		HasOrder: boolean;

		/**
		 * Gets the HasSKey Flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains the SKey column as part of its data.
		 * Available in Fabrication 2018.2 versions and later.
		 */	
		HasSKey: boolean;

		/**
		 * Gets the HasWeight Flag of the PRODUCTINFO Object.
		 * @readonly
		 * @remarks Flag indicates if the Product List contains the Weight column as part of its data.
		 */
		HasWeight: boolean;

		/**
		 * Gets the Revision property of the PRODUCTINFO Object.
		 * @readonly
		 */
		Revision: string;

		//#endregion PRODUCTINFO Properties Group
	
		//#region PRODUCTINFO Methods Group
		// Not Applicable
		//#endregion PRODUCTINFO Methods Group
	
	}
	
	interface SEALENT {
	
		//#region SEALENT Properties Group

		/**
		 * Get/Set the Lock Status of the Sealent Value of the SEALENT Object.
		 */
		Locked: boolean;

		/**
		 * Get/Set the Sealent Name of the SEALENT Object.
		 * @renaarks Only Sealent name is returned, not the group. No way to retrieve the Sealent Group
		 * at this time.
		 */
		Value: string;

		//#endregion SEALENT Properties Group
	
		//#region SEALENT Methods Group
		// Not Applicable
		//#endregion SEALENT Methods Group
	
	}
	
	interface SEAM {
	
		//#region SEAM Properties Group

		/**
		 * Get/Set the Alternatge Code of the SEAM Object.
		 * @remarks Alternate Code is used for enforcing Alternate Seam values using the Specifications.
		 */
		Alt: string;

		/**
		 * Get the Seam Group for the SEAM Object.
		 * @readonly
		 * @remarks Seam Group propoerty is available only in 2022 and later versions of Autodesk Fabrication.
		 */
		Group: String;

		/**
		 * Get/Set the Lock Status flag for the Seam Name property of the SEAM Object.
		 */
		Locked: boolean;

		/**
		 * Get/Set the Seam Name value of the SEAM Object.
		 * @remarks
		 * Only Seam Name is given. Seam Group is not given as part of the value.
		 * Seam can be set using either an Index or Name.
		 */
		Value: string;

		//#endregion SEAM Properties Group
	
		//#region SEAM Methods Group
		// Not Applicable
		//#endregion SEAM Methods Group
	
	}
	
	interface SPLITTER {
	
		//#region SPLITTER Properties Group

		/**
		 * Get the Splitter Group for the SPLITTER Object.
		 * @readonly
		 * @remarks Splitter Group propoerty is available only in 2022 and later versions of Autodesk Fabrication.
		 */
		 Group: String;

		/**
		 * Get/Set the Splitter Name of the ITEM Object.
		 * @remarks
		 * Only Splitter Name is given. Splitter Group is not given as part of the value.
		 * Splitter can be set using the 'Name' or 'Index'.
		 */
		Value: string;

		/**
		 * Get/Set the Lock Status flag for the Splitter property of the SPLITTER Object.
		 */
		Locked: boolean;

		//#endregion SPLITTER Properties Group
	
		//#region SPLITTER Methods Group
		// Not Applicable
		//#endregion SPLITTER Methods Group
	
	}
	
	interface STATUS {
	
		//#region STATUS Properties Group

		/**
		 * Get the Date and Time Stamp of the STATUS Object.
		 * @readonly
		 * @remarks Date and Time Stamp reflect the Date and Time when the Status changed.
		 * A value of 'Default' is the first (unchanged) Status.
		 */
		DateTime: string;

		/**
		 * Get the Status ID of the STATUS Object.
		 * @readonly
		 */
		Id: number;

		/**
		 * Get the User ID of the user who changed the Status of the STATUS Object.
		 * @readonly
		 * @remarks Does not appear to change or work. Does not appear to be Read/Write as Autodesk's documentation suggests.
		 */
		UserId: number;

		/**
		 * 	Get the Status Description of the STATUS Object.
		 * @readonly
		 */
		Value: string;

		//#endregion STATUS Properties Group
	
		//#region STATUS Methods Group
		// Not Applicable
		//#endregion STATUS Methods Group
	
	}
	
	interface STIFFENER {
	
		//#region STIFFENER Properties Group

		/**
		 * Get the Stiffener Group for the STIFFENER Object.
		 * @readonly
		 * @remarks Stiffener Group propoerty is available only in 2022 and later versions of Autodesk Fabrication.
		 */
		 Group: String;

		/**
		 * Get/Set the Lock Status flag for the Stiffener property of the STIFFENER Object.
		 */
		Locked: boolean;

		/**
		 * Get/Set the Number of Stiffeners required (excluding End Stiffeners) of the STIFFENER Object.
		 */
		Qty: number;

		/**
		 * Get the Spacing between Stiffeners of the STIFFENER Object.
		 * @readonly
		 */
		Spacing: number;

		/**
		 * Get/Set the Splitter Name value of the SPLITTER Object.
		 * @remarks
		 * Stiffener Name only is given. Stiffener Group is not given as part of the value.
		 * Stiffener can be set using the 'Name' only.
		 */
		Value: string;
		
		//#endregion STIFFENER Properties Group
	
		//#region STIFFENER Methods Group
		// Not Applicable
		//#endregion STIFFENER Methods Group
	
	}
	
	interface SUPPORT {
	
		//#region SUPPORT Properties Group

		/**
		 * Get/Set the Lock Status flag of the Support property of the SUPPORT Object.
		 */
		Locked: boolean;

		/**
		 * Get/Set the Quantity of Supports required of the SUPPORT Object.
		 */
		Qty: number;

		/**
		 * Get/Set the Spacing between Supports of the SUPPORT Object.
		 * @remarks
		 * If set, this will change the value of the 'Qty'.
		 */
		Spacing: number;

		/**
		 * Get/Set the Support Name of the SUPPORT Object.
		 * @remarks
		 * Support Name only is given. Support Group is not given as part of the value.
		 * Support can be set using the 'Name' or Index.
		 */
		Value: string;

		//#endregion SUPPORT Properties Group
	
		//#region SUPPORT Methods Group
		// Not Applicable
		//#endregion SUPPORT Methods Group
	
	}
	
	interface TASKSELECTION {

		//#region TASKSELECTION Properties Group

		/**
		 * Get/Set a Count (Number of Items) in the Selection for the TASKSELECTION Object.
		 */
		Count: number;

		//#endregion TASKSELECTION Properties Group

		//#region TASKSELECTION Methods Group
		// Not Applicable
		//#endregion TASKSELECTION Methods Group

	}

	//#endregion Fabrication Sub-Object Definitions


	// --------------------------------------------- Section Separator ---------------------------------------------


	//#region Fabrication Objects

	abstract class ARRAY {

		/**
		 * Constructs an Array Object.
		 * @param NumberOfItems Optional Number of items to initialize the Array Object to hold.
		 * @returns Nothing.
		 * @remarks
		 * Constructs an Array object with the number of inital elements as specified. Each element's
		 * value will be NULL/False.
		 * If optional NumberOfItems is not specifcied, a default value of 0 (zero) is used.
		 */
		constructor(NumberOfItems?: number) {}

	
		//#region ARRAY Properties Group

		/**
		 * Get/Set the Number of elements in the array of the ARRAY Object.
		 * @remarks
		 * If changed, new elements are set to NULL/False.
		 */
		Count: number;

		//#endregion ARRAY Properties Group

		//#region ARRAY Methods Group

		/**
		 * Adds/appends the specified data items to an array.
		 * @param ArrayData 
		 * @returns Number of elements added to the array.
		 */
		abstract Add(ArrayData: any[]): number;

		/**
		 * Removes the specified item from an array.
		 * @param ArrayIndex Optional Number specifying the index number of the element to remove from the array.
		 * @returns Boolean Flag indicating if element removal was successful.
		 * @remarks
		 * Index is a '1-based' meaning the first item in the Array is index # 1.
		 * Default when ArrayIndex is missing is the last item in the Array.
		 * Array is dynamically resized, removing an item from the beginning or middle of the array
		 * results in the array being smaller and the other elements moving up in position. 
		 */
		abstract Delete(ArrayIndex?: number): boolean;

		/**
		 * Inserts a piece of data into an Array at the specified index.
		 * @param ArrayData Any type of data to insert into an array.
		 * @param ArrayIndex Optional Index position to insert data into.
		 * @return Boolead Flag indicating if data insertion was successful of not.
		 * @remarks
		 * When inserting data into an Array at a sepecific index, the previous data and all other
		 * downstream data are shifed down in the index chain.
		 * Default when ArrayIndex is missing is to insert at the end of the array.
		 */
		abstract Insert(ArrayData: any, ArrayIndex?: number): boolean;
		
		//#endregion ARRAY Methods Group
	}

	abstract class FILE {

		/**
		 * Constructs a File Object.
		 * @param FileName Optional String Name of the file to open.
		 * @param AccessMode Optional Mode(s) for the file open.
		 * @returns Nothing
		 * @remarks
		 * If optional parameters are not specified when constructing the FILE Object,
		 * use the FILE.Open method to specify them.
		 */
		constructor(FileName?: string, AccessMode?: FILEMODE) {}
	
		//#region FILE Properties Group

		/**
		 * Get the End of File flag for the FILE Object.
		 * @readonly
		 */
		EOF: boolean;

		/**
		 * Get the Flag indicating if the file exist or not for the FILE Object.
		 * @readonly
		 */
		Exists: boolean;

		/**
		 * Get/Set the File Name of file to open for the FILE Object.
		 */
		FileName: string;

		/**
		 * Get the Flag indicating if the file is open for the FILE Object.
		 * @readonly
		 */
		IsOpen: boolean;

		/**
		 * Get the Flag indicating if the file is Unicode for the FILE Object.
		 * @readonly
		 * @remarks
		 * File is ANSI encoded if not Unicode.
		 */
		IsUnicode: boolean;

		/**
		 * Get the Length of file (in Bytes) for the FILE Object.
		 * @readonly
		 */
		Length: number;

		/**
		 * Get/Set the File Open Mode (flags) for the FILE Object.
		 */
		Mode: FILEMODE;

		/**
		 * Get/Set the current File Position (in Bytes) for the FILE Object.
		 */
		Position: number;

		//#endregion FILE Properties Group
	
		//#region FILE Methods Group

		/**
		 * Closes an open File.
		 * @returns Boolean Flag indicating if file closure was successful or not.
		 * @remarks
		 * Any open file needs to be closed before any other application can access it in Read/Write mode.
		 */
		abstract Close(): boolean;

		/**
		 * Deletes a file.
		 * @param UseRecycleBin Optional Boolean Flag to add deleted file to the Windows Recycle Bin
		 * @returns Boolead Flag indicating of file deletion was successful or not.
		 * @remakrs
		 * If UseRecycleBin is not specified, False is default. 
		 */
		abstract Delete(UseRecycleBin?: boolean): boolean;
		
		/**
		 * Opens a file for access based on file mode.
		 * @param FileName String Name of file to open.
		 * @param AccessMode Mode(s) for file open.
		 * @returns Boolean Flag indicating if file was successfully opened for the specified access mode/type.
		 * @remarks
		 * This function is not needed if the FILE Object Constructor was called with parameters specifying the
		 * file name and access mode/type.
		 */
		abstract Open(Filename: string, AccessMode: FILEMODE): boolean;

		/**
		 * Read an 8-but Byte (0-255) from a binary file. 
		 * @returns Number read from the open file.
		 * @remarks File must be opened as non-text.
		 */
		abstract ReadByte(): number;

		/**
		 * Reads a character from a binary file.
		 * @return String read from file.
		 * @remarks
		 * File must be opened as non-text.
		 * Will read a BYTE for ANSI files and a WORD for Unicode Files. 
		 */
		abstract ReadChar(): string;

		/**
		 * Read a 32-bit signed integer from a binary file.
		 * @returns Number read fronm file.
		 * @remarks
		 * File must be opened as non-text.
		 */
		abstract ReadInt(): number;

		/**
		 * Read a line of text (minsus CR/LF) from a text file.
		 * @returns String read from file.
		 * @remarks
		 * File must be opened as text (Unicode or ANSI).
		 * Each call reads up into the next CR (Carriage Return), LF (Line Feed) or EOF (End of File) marker.
		 * Returned String does not contain CR/LR or EOF characters. 
		 */
		abstract ReadLine(): string;

		/**
		 * Read a C-Style double precision floating point number from a binary file.
		 * @returns Number read from file.
		 * @remarks
		 * File must be opened as non-text.
		 */
		abstract ReadReal(): number;

		/**
		 * Read a String from a binary file.
		 * @returns String read from file.
		 * @remarks
		 * File must be opened as non-text.
		 * Will read BTYEs for ANSI files and WORDs for Unicode files.
		 */
		abstract ReadString(): string;

		/**
		 * Read a 16-bit WORD (0-65535) from a binary file.
		 * @returns Number read from file.
		 * @remarks
		 * File must be opened as non-text.
		 */
		abstract ReadWord(): number;

		/**
		 * Renames the current file held by the FILE object.
		 * @param FileName String representing the name of the file to rename to.
		 * @returns Boolean Flag indicating is file rename was successful or not.
		 * @remarks
		 * Current File Name must be assigned but file must not be opened for access.
		 */
		abstract Rename(FileName: string): boolean;

		/**
		 * Positions the file reader to the position after the specified data in the file.
		 * @param DataToGoTo Data to position the file reader to.
		 * @returns Nothing.
		 * @remarks
		 * File reader positions to just after the data that's specified by the function.
		 * Subsequent calls to functions that read data will return the data immediantely after
		 * the data that was specified.
		 */
		abstract SeekEntry(DataToGoTo: any): void;

		/**
		 * Returns Boolean flag if specified data was found in the file.
		 * @param DataToFind
		 * @returns Boolean Flag indicating if data was found or not.
		 */
		abstract SeekLine(DataToFind: any): void;

		/**
		 * Write an 8-bit BYTE (0-255) to a binary file.
		 * @param ByteToWrite BYTE to write to file.
		 * @returns Boolean Flag indicating if write was successful or not.
		 * @remarks
		 * File must be opened as non-text.
		 */
		abstract WriteByte(ByteToWrite: number): boolean;

		/**
		 * Wtite a Character to a binary file.
		 * @param CharacterToWrite String character to write to file.
		 * @retuns Boolean Flag indicating if write was successful or not.
		 * @remarks
		 * File must be opened as non-text.
		 * Will write a BYTE for ANSI files or WORK for Unicodes files.
		 */
		abstract WriteChar(CharacterToWrite: string): boolean;

		/**
		 * Write a 32-bit signed integer to a binary file.
		 * @param IntegerToWrite Number to write to file.
		 * @returns Boolean Flag indicating if write was successful or not.
		 * @remarks
		 * File must be opened as non-text.
		 */
		abstract WriteInt(IntegerToWrite: number): boolean;

		/**
		 * Write a line of text to a text file.
		 * @param StringToWrite String to write to file.
		 * @param AppendCR Optional Boolean Flag to automatically append a CR+LF to and of line.
		 * @returns Boolead Flag indicating if write was successful or not.
		 * @remarks
		 * If optional AppendCR paramater missing, True is default and will automatically append
		 * a Carrage Return (CR) and Line Feed (LR) character to the end of the specified string.
		 */
		abstract WriteLine(StringToWrite: string, AppendCR?: boolean): boolean;

		/**
		 * Write a C-Style double precision floating point number to a binary file.
		 * @param RealToWrite Number to write to file.
		 * @returns Boolean Flag indicating if write was successful or not.
		 * @remarks
		 * File must be opened as non-text.
		 */
		abstract WriteReal(RealToWrite: number): boolean;

		/**
		 * Write a string to a text file.
		 * @param StringToWrite String to write to file.
		 * @returns	Boolean Flag indicating if write was successful or not.
		 * @remarks
		 * File must be opened as non-text.
		 * Will write BYTEs for ANSI files and WORDs for Unicode files.
		 */
		abstract WriteString(StringToWrite: string): boolean;

		/**
		 * Write a 16-bit WORD (0-65535) to a binary file.
		 * @param WordToWrite Number to write to file.
		 * @returns Boolean Flag indicating if write was successful or not.
		 * @remarks
		 * File must be opened as non-text.
		 */
		abstract WriteWord(WordToWrite: number): boolean;

		//#endregion FILE Methods Group
	
	}

	abstract class FILELOCATOR {
	
		/**
		 * Constructs a FileLocator Object.
		 * @param RootPath Optional String of Root Path to Search.
		 * @param SearchWildcard Optional String Wildcard to match against.
		 * @param SearchFiles Optional Boolean Flag to search against Files.
		 * @param SearchFolders Optional Boolean Flag to search against Folders.
		 * @returns Nothing.
		 * @remarks
		 * If optional parameters are not specified when constructing the FILELOCATOR object,
		 * use the FILELOCATOR.Scan method to specify them.
		 */
		constructor(RootPath?: string, SearchWildcard?: string, SearchFiles?: boolean, SearchFolders?: boolean) {}

		//#region FILELOCATOR Properties Group

		/**
		 * This gets an array of File Names of found files for the FILELOCATOR Object.
		 */
		File: Array<string>;

		/**
		 * Get the Number of Files that were found for the FILELOCATOR Object.
		 * @readonly
		 */
		FileCount: number;

		/**
		 * This gets an array of Folder Names of found folders for the FILELOCATOR Object.
		 */
		Folder: Array<string>;

		/**
		 * Get the Number of Folders that were found for the FILELOCATOR Object.
		 * @readonly
		 */
		FolderCount: number;

		/**
		 * Get/Set the full Path of Folder being scanned for the FILELOCATOR Object.
		 */
		Path: string;

		//#endregion FILELOCATOR Properties Group
	
		//#region FILELOCATOR Methods Group

		/**
		 * Scan a root path for Files and/or Folders matching a Wildcard string.
		 * @param RootPath Optional String of Root Path to Search.
		 * @param SearchWildcard Optional String Wildcard to match against.
		 * @param SearchFiles Optional Boolean Flag to search against Files.
		 * @param SearchFolders Optional Boolean Flag to search against Folders.
		 * @returns Number indicating how many files and/or folders matched the search.
		 * @remarks
		* This function is not needed if the FILELOCATOR Object Constructor was called with parameters specifying the
		* path, search wildcard, file and folder search flags.
		 */
		abstract Scan(RootPath: string, SearchWildcard: string, SearchFiles: boolean, SearchFolders: boolean): number;

		//#endregion FILELOCATOR Methods Group
	
	}

	abstract class ITEMSTRUCT {

		/**
		 * Constructs an ItemStruct Object.
		 * @returns ITEMSTRUCT
		 * @remarks
		 * Represents a dynamically loaded ITM file and acts nearly identical to a native ITEM reference
		 */
		constructor() {}
		
		//#region ITEM Properties Group

		/**
		 * Get the number of AirTurns in the AIRTURN Array of the ITEM Object.
		 * @readonly 
		 */
		Airturns: number;

		/**
		 * If applicable, this gets an array of AIRTURN Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Airturns' property returns a value >= 1 before using Item.Airturn[index#/name]
		 */
		Airturn: Array<AIRTURN>;

		/**
		 * Get/Set the Alias property of the ITEM Object.
		 */
		Alias: string;

		/**
		 * Get/Set the Alternate property of the ITEM Object.
		 */
		Alternate: string;

		/**
		 * Get/Set the Bitmap (Image File Name) of the ITEM Object.
		 * @remarks
		 * May be full, relative Path, just Filename or blank for default. May be a BMP or PNG image type.
		 * PNG image type recommended for reduced file size and performance.
		 */
		Bitmap: string;

		/**
		 * Get/Set the BoughtOut Flag of the ITEM Object.
		 */
		BoughtOut: boolean;

		/**
		 * Get/Set the Box property of the ITEM Object.
		 */
		Box: number;

		/**
		 * Get/Set the Button Code Alias that the ITEM Object was taken off with.
		 */
		ButtonAlias: string;

		/**
		 * Get/Set the ButtonCode that the ITEM Object was taken off with.
		 */
		ButtonCode: string;

		/**
		 * Get/Set the CADBlock name associated with the ITEM Object.
		 */
		CADBlock: string;

		/**
		 * Get the Catalog Flag of the ITEM Object.
		 * @readonly
		 */
		Catalogue: boolean;

		/**
		 * Get/Set the CID number of the ITEM Object.
		 * @remarks
		 * CID is not guarenteed to be the same as the Pattern Number. Best practice is to not
		 * change the CID value which defaults to the Pattern Number without very specific reasons and
		 * knowledge of it's impact. 
		 */
		CID: number;

		/**
		 * Get/Set the Comment text of the ITEM Object.
		 * @remarks
		 * Supports multi-line text and may contain Carriage Returns.
		 */
		Comment: string;

		/**
		 * Get the number of Connectors in the CONNECTOR Array of the ITEM Object.
		 * @readonly 
		 */
		Connectors: number;

		/**
		 * If applicable, this gets an array of CONNECTOR Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Connectors' property returns a value >= 1 before using Item.Connector[index#/name]
		 */
		Connector: Array<CONNECTOR>;

		/**
		 * Get/Set the CostByLength (Cost Units) Flag of the ITEM Object.
		 * @remarks
		 * Cost Units are set by the CostByLength flag. 0 = Cost by Qty, 1 = Cost by Ft.
		 */
		CostByLength: boolean;

		/**
		 * Get/Set the CostType property of the ITEM Object.
		 * @remarks
		 * Valid CostType values are...'Demolition', 'Free Issue', 'Normal', 'Relocation' and 'Supply Only'.
		 */
		CostType: string;

		/**
		 * If applicable, this gets an array of CUSTOM DATA Objects for the ITEM Object.
		 * @remarks 
		 * There is no way to itterate over this array, you need to be aware of the custom data indices or names that exist in your database.
		 */
		CustomData: Array<CUSTOMDEF>;

		/**
		 * Get/Set the CutType property of the ITEM Object.
		 * @remarks
		 * Alowwed values of CutType vary depending on the ITM's Pattern Number.
		 */
		CutType: string;

		/**
		 * Get the number of Dampers in the DAMPER Array of the ITEM Object.
		 * @readonly
		 */
		Dampers: number;

		/**
		 * If applicable, this gets an array of DAMPER Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Dampers' property returns a value >= 1 before using Item.Dampers[index#/name]
		 */
		Damper: Array<DAMPER>;

		/**
		 * Get/Set the Database ID property of the ITEM Object.
		 */
		DatabaseID: string;

		/**
		 * This gets the DBLOCKINFO Object of the ITEM Object.
		 */
		DBLock: DBLOCKINFO;

		/**
		 * This gets the DECOILERINFO Object of the ITEM Object.
		 */
		Decoiler: DECOILERINFO;

		/**
		 * Get/Set the Description of the ITEM Object.
		 */
		Description: string;

		/**
		 * Get the number of Dimensions in the DIM Array of the ITEM Object.
		 * @readonly
		 */
		Dims: number;

		/**
		 * If applicable, this gets an array of DIM Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Dims' property returns a value >= 1 before using Item.Dim[index#/name]
		 */
		Dim: Array<DIM>;

		/**
		 * Get/Set the Dimension Side Flag of the ITEM Object.
		 * @remarks
		 * Possible values are 'Inside', 'Outside' and 'None'.
		 * If DoubleWall, this flag controls whether dimensions are inside or outside sizes.
		 * If not DoubleWall and Insulation is inside, this also controls whether dimensions
		 * are inside or outside sizes. This setting is remembered seperately for DoubleWall
		 * or not DoubleWall. Ensure DoubleWall is set correctly before changing.
		 */
		DimSide: string;

		/**
		 * Get/Set the Lock Status of the DimSide Flag of the ITEM Object.
		 */
		DimSideLock: boolean;

		/**
		 * Get/Set the DoubleWall Flag of the ITEM Object.
		 */
		DoubleWall: boolean;

		/**
		 * Get/Set the Drawing property of the ITEM Object.
		 */
		Drawing: string;

		/**
		 * Get/Set the Lock Status for the DoubleWall Flag of the ITEM Object.
		 */
		DWLock: boolean;

		/**
		 * Get/Set the E-Tag property of the ITEM Object.
		 */
		ETag: string;

		/**
		 * Get/Set the Extra Install Time of the ITEM Object.
		 * @remarks
		 * The 'E' in ETime stands for 'Erection' or Installation Time.
		 * Extra ETime is expressed in terms of units specified by the ExtraETimeUnits property.
		 */
		ExtraETime: number;

		/**
		 * Get/Set the Extra Install Time Rate of the ITEM Object.
		 * @remarks
		 * The 'E' in ETime stands for 'Erection' or Installation Time.
		 * ExtraETimeRate can be specified by Rate 'Name' or Index.
		 */
		ExtraETimeRate: string;

		/**
		 * Get/Set the Extra Install Time Units of the ITEM Object.
		 * @remarks
		 * The 'E' in ETime stands for 'Erection' or Installation Time.
		 */
		ExtraETimeUnits: TIMEUNITS;

		/**
		 * Get/Set the Extra Fabrication Time of the ITEM Object.
		 * @remarks
		 * The 'F' in FTime stands for 'Fabrication'.
		 * Extra FTime is expressed in terms of units specified by the ExtraFTimeUnits property.
		 */
		ExtraFTime: number;

		/**
		 * Get/Set the Extra Fabrication Time Rate of the ITEM Object.
		 * @remarks
		 * The 'F' in FTime stands for 'Fabrication'.
		 * ExtraFTimeRate can be specified by Rate 'Name' or Index.
		 */
		ExtraFTimeRate: string;

		/**
		 * Get/Set the Extra Fabrication Time Units of the ITEM Object.
		 * @remarks
		 * The 'F' in FTime stands for 'Fabrication'.
		 */
		ExtraFTimeUnits: TIMEUNITS;

		/**
		 * Get/Set the Fabrication Table Name property of the ITEM Object.
		 * @remarks
		 * Only the Table Name is given, not the Group. Autodesk documentation INCORRECTLY
		 * indicates the Table Name includes the Group (e.g. 'Group: Name'). Value is subject to
		 * change if this Autodesk defect is corrected in future releases.
		 */
		FabTable: string;

		/**
		 * Get/Set the Lock Status of the Fabrication Table property of the ITEM Object.
		 */
		FabTableLock: boolean;

		/**
		 * Get/Set the Facing Name of the ITEM Object.
		 * @remarks
		 * Facing Name only is given. Facing Group is not given as part of the value.
		 */
		Facing: string;

		/**
		 * Get/Set the Lock Status of the Facing property of the ITEM Object.
		 */
		FacingLock: boolean;

		/**
		 * Get/Set the ITM Filename of the ITEM Object.
		 * @remarks
		 * Filename is given without the ITM file extension.
		 */
		Filename: string;

		/**
		 * Get/Set the FixRelative Flag of the ITEM Object.
		 */
		FixRelative: boolean;

		/**
		 * Get/Set the Material Gauge of the ITEM Object.
		 * @remarks
		 * For Material Types 'Linear Ductwork' and 'For Machines', Gauge gives the Material Thickness.
		 * For Material Types 'Pipework', 'Electrical Containment' and 'Undefined' Gauge gives the
		 * Material Index Number as entered in the material (e.g. May be a decimal).
		 */
		Gauge: number;

		/**
		 * Get/Set the Lock Status of the Gauge property of the ITEM Object.
		 */
		GaugeLock: boolean;

		/**
		 * Get the 32-Bit GUID Scan Code of the ITEM Object.
		 * @readonly
		 */
		Guid: string;

		/**
		 * Get the 64-Bit GUID Scan Code of the ITEM Object.
		 * @readonly
		 */
		Guid64: string;

		/**
		 * Get the Handle of the ITEM Object.
		 * @readonly
		 */
		Handle: number;

		/**
		 * Get the HasProduct Flag of the ITEM Object.
		 * @readonly
		 * @remarks
		 * A value of True or 0 indicates the ITEM is product listed.
		 */
		HasProduct: boolean;

		/**
		 * Get/Set the Insualtion Specification Group & Name (e.g. 'Group: Name') of the ITEM Object.
		 * @remarks
		 * Property may also be set to 'Not Set' or 'Off' preset values.
		 */
		InsSpec: string;

		/**
		 * Get/Set the Installation Table Name property of the ITEM Object.
		 * @remarks
		 * Only the Table Name is given, not the Group. Autodesk documentation INCORRECTLY
		 * indicates the Table Name includes the Group (e.g. 'Group: Name'). Value is subject to
		 * change if Autodesk defect is corrected in future releases.
		 */
		InstallTable: string;

		/**
		 * Get/Set the Lock Status of the InstallTable property of the ITEM OBject.
		 */
		InstallTableLock: boolean;

		/**
		 * Get Insulation Object of the ITEM Object.
		 * @readonly
		 */
		Insulation: INSULATION;

		/**
		 * Get/Set the Lock Status of the Insualtion Specification property of the ITEM Object.
		 */
		ISpecLock: boolean;

		/**
		 * Get the Library property of the ITEM OBject.
		 * @readonly
		 * @remarks
		 * The dominant library for the ITM. Possible values are 'Ductboard', 'Electrical', 'Equipment',
		 * 'Fabrication', 'Flat Oval', Free Entry', 'Furniture', 'Pipework', 'Profiled', 'Rectangular',
		 * 'Round', 'Standard', 'Structure', 'Sub Assembly' or 'Unknown'.
		 */
		Library: string;

		/**
		 * Get/Set the Lifespan (in Years) of the ITEM Object.
		 */
		Lifespan: number;

		/**
		 * Get the number of Links in the LINK Array of the ITEM Object.
		 * @readonly
		 */
		Links: number;

		/**
		 * If applicable, this gets an array of LINK Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Links' property returns a value >= 1 before using Item.Link[index#/name]
		 */		
		Link: Array<LINK>;

		/**
		 * Get the number of Old Statuses in the History of the ITEM Object.
		 * @readonly
		 */
		ManyOldStatus: number;

		/**
		 * Get the Material Abreviation of the ITEM Object.
		 * @readonly
		 */
		MatAbrv: string;

		/**
		 * Get/Set the Material Name & Group (e.g. 'Group: Name') of the ITEM Object.
		 */
		Material: string;

		/**
		 * Get/Set the Nest Priority of the ITEM Object.
		 * @remarks
		 * Items with a higher number nest first giving preference to those items in the nesting process.
		 */
		NestPriority: number;

		/**
		 * Get/Set the Notes property of the ITEM Object.
		 */
		Notes: string;

		/**
		 * Get/Set the Number property of the ITEM Object.
		 */
		Number: string;

		/**
		 * If applicable, this gets an array of STATUS Objects of the ITEM Object.
		 */
		OldStatus: Array<STATUS>;

		/**
		 * Get/Set the Operating Cost (per Year) of the ITEM Object.
		 */
		OperatingCost: number;

		/**
		 * Get the number of Options in the OPTION Array of the ITEM Object.
		 * @readonly
		 */
		Options: number;

		/**
 		 * If applicable, this gets an array of OPTION Objects of the ITEM Object.
 		 * @remarks 
		 * Always check to see if the 'Options' property returns a value >= 1 before using Item.Option[index#/name]
		 */
		Option: Array<OPTION>;

		/**
		 * Get/Set the Order property of the ITEM Object.
		 */
		Order: string;

		/**
		 * Get/Set the Pallet property of the ITEM Object.
		 */
		Pallet: string;

		/**
		 * Get the Number of Parts to Cut of the ITEM Object.
		 * @readonly
		 */
		PartsCut: number;

		/**
		 * If applicable, this gets an array of Cut Statuses of the ITEM Object.
		 * @readonly
		 */
		PartCut: Array<boolean>;

		/**
		 * Get/Set the Path property of the ITEM Object.
		 * @remarks
		 * Path includes the terminating slash (/). Note that folder seperators are
		 * forward slashes (/) as opposed to backslashes (\) which are more commonly seen.
		 */
		Path: string;

		/**
		 * Get the Pattern Number of the ITEM Object.
		 * @readonly
		 * @remarks
		 * Unlike CID, Pattern Number is the true Pattern for the ITM and can not be changed.
		 * This property is only available in Fabrication 2019.1 versions and later.
		 */
		PatNo: number;

		/**
		 * Get/Set the PCF SKey property of the ITEM Object.
		 * @remarks
		 * Available in Fabrication 2017 versions and later.
		 */
		PCFSKey: string;

		/**
		 * Get/Set the Price List Name & Group (e.g. 'Group: Name') of the ITEM Object.
		 */
		PriceList: string;

		/**
		 * Get/Set the Lock Status for the Price List property of the ITEM Object.
		 */
		PriceTableLock: boolean;

		/**
		 * This gets the PRODUCTINFO Object of the ITEM Object.
		 */
		Product: PRODUCTINFO;

		/**
		 * Get/Set the Item Quantity property of the ITEM Object.
		 */
		Qty: number;

		/**
		 * Get/Set the Scale Factor of the ITEM Object.
		 */
		Scale: number;

		/**
		 * This gets the SEALENT Object of the ITEM Object.
		 */
		Sealant: SEALENT;

		/**
		 * If applicable gets the number of Seams in the SEAM Array of the ITEM Object.
		 * @readonly
		 */
		Seams: number;
	
		/**
		 * If applicable, this gets an array of SEAM Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Seams' property returns a value >= 1 before using Item.Seam[index#]
		 */
		Seam: Array<SEAM>;

		/**
		 * Get/Set the Section Name & Group (e.g. 'Group: Name') of the ITEM Object.
		 * @remarks
		 * Can be set by specifying 'Name' or 'Group:Name'. Can be reset by setting
		 * to 'None' or empty string ''.
		 */
		Section: string;

		/**
		 * Get/Set the Service Name & Group (e.g. 'Group: Name') of the ITEM Object.
		 */
		Service: string;

		/**
		 * Get/Set the ServiceType property of the ITEM Object.
		 * @remarks
		 * ServiceType can be set using the 'Name' or 'Index' of the desired ServieType.
		 */
		ServiceType: string;

		/**
		 * If applicable, this gets an array of Skin CONNECTOR Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Connectors' property returns a value >= 1 before using Item.SkinConnector[index#]
		 */
		SkinConnector: Array<CONNECTOR>;

		/**
		 * This gets the Skin DECOILERINFO Object of the ITEM Object.
		 */
		SkinDecoiler: DECOILERINFO;

		/**
		 * Get/Set the Skin Gauge (thinckness) for the Skin Material of the ITEM Object.
		 * @remarks
		 * Only valid if DoubleWall flag is set.
		 */
		SkinGauge: number;

		/**
		 * Get/Set the Skin Material Name & Group (e.g. 'Group: Name') of the ITEM Object.
		 * @remarks
		 * Only valid if DoubleWall flag is set.
		 */
		SkinMaterial: string;

		/**
		 * Get/Set the Lock Status flag for the Skin Material property of the ITEM Object.
		 */
		SkinMaterialLock: boolean;

		/**
		 * If applicable this gets an array of Skin SEAM Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Seams' property returns a value >= 1 before using Item.SkinSeam[index#]
		 */
		SkinSeam: Array<SEAM>;

		/**
		 * Get/Set the Skin Side property of the ITEM OBject.
		 * @remarks
		 * Only valid if DoubleWall flag is set. Possible values are 'Inside' or 'Outside'.
		 */
		SkinSide: string;

		/**
		 * Get/Set the Specification Name & Group (e.g. 'Group: Name') of the ITEM Object.
		 * @remarks
		 * Can be set by specifying 'Name' or 'Group:Name'. Can be reset by setting
		 * to 'None' or empty string ''.
		 */
		Specification: string;

		/**
		 * Get/Set the Lock Status flag for the Specification property of the ITEM Object.
		 */
		SpecLock: boolean;

		/**
		 * Get the number of Splitters in the SPLITTER Array of the ITEM Object.
		 * @readonly
		 */
		Splitters: number;

		/**
		 * If applicable this gets an array of SPLITTER Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Splitters' property returns a value >= 1 before using Item.Splitter[index#]
		 */
		Splitter: Array<SPLITTER>;

		/**
		 * Get/Set the Spool Name property of the ITEM Object.
		 */
		Spool: string;

		/**
		 * Get/Set the Spool Color property of the ITEM Object.
		 */
		SpoolColour: number;

		/**
		 * Get/Set the Status property of the ITEM Object.
		 * @remarks
		 * Status can be set using the 'Name' or 'Index' of the desired Status.
		 */
		Status: string;

		/**
		 * Get the number of Stiffeners in the STIFFENER Array of the ITEM Object.
		 * @readonly
		 */
		Stiffeners: number;

		/**
		 * If applicable this gets an array of STIFFENER Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'Stiffeners' property returns a value >= 1 before using Item.Stiffener[index#]
		 */
		Stiffener: Array<STIFFENER>;

		/**
		 * Get/Set the Structure Type of ITEM Object.
		 * @remarks
		 * StructureType can be set using the 'Name' or 'Index' however this property is not able to be
		 * read. It can only be set in Autodesk Fabrication versions 2022 and later. Earlier versions
		 * the property is 'Write-Only'.
		 */
		StructureType: string;

		/**
		 * Get the number of Sub Items in a Sub Assembly for the SUBITEM Array of the ITEM Object.
		 * @readonly
		 */
		SubItems: number;

		/**
		 * If applicable this gets an array of ITEM Objects of the ITEM Object.
		 * @remarks 
		 * Always check to see if the 'SubItems' property returns a value >= 1 before using Item.SubItem[index#]
		 */
		SubItem: Array<ITEM>;

		/**
		 * This gets the SUPPORT Object of the ITEM Object.
		 */
		Support: SUPPORT;

		/**
		 * Get the Type property of the ITEM Object.
		 * @readonly
		 * @remarks
		 * Property can list one or more library types combined and seperated by a slash. Possible values
		 * are 'Ductboard','Electrical', 'Equipment', 'Fabrication', 'Flat Oval', Free Entry', 'Furniture',
		 * 'Pipework', 'Profiled', 'Rectangular', 'Round', 'Standard', 'Structure', 'Sub Assembly' or 'Unknown'.
		 */
		Type: string;

		/**
		 * Get/Set the Weight (in base units) of the ITEM Object. 
		 * @remarks
		 * If Costed by Length, Weight will be returned as per Meter/Foot otherwise by Quantity.
		 */
		Weight: number;

		/**
		 * Get/Set the Lock Status of the Weight property of the ITEM Object.
		 */
		WeightLock: boolean;

		/**
		 * Get/Set the Material Wire Gauge of the ITEM Object.
		 */
		WireGauge: number;

		/**
		 * GetSet the Zone property of the ITEM Object.
		 */
		Zone: string;
	
		//#endregion ITEM Properties Group
		

		//#region ITEM Methods Group
	
		/**
		 * Dynamically adds Custom Data to the item (for 'User' custom data types) 
		 * @param NameOrIndex 
		 * @returns Nothing
		 * @remarks
		 * This function merely added the specified 'User' Custom Data 'Field' to the Item. Once the
		 * field is added, you can set a value using the Custom Data property Item.CustomData[name/index#].Value
		 */
		abstract AddCustomData(NameOrIndex: string|number): void;

		/**
		 * Adds a Hyperlink to the Links tab of the Item Properties.
		 * @param Link String of the URL to use for the Link.
		 * @param Description String description of the Link.
		 * @param Page String page on the link to go to. e.g. '#Page=2'.
		 * @returns Number representing the number of the link added.
		 */
		abstract AddLink(Link: string, Description: string, Page: string): number;

		/**
		 * Gets the file name of the Image used for a ITM.
		 * @param ItmFilePath 
		 * @returns String representing path and name of the image file.
		 * Despite the function name, a PNG file (not BMP) may be returned.
		 */
		abstract BitmapFile(ItmFilePath: string): string;

		/**
		 * Indicates if the Item supports DoubleWall entry or not.
		 * @returns Boolean
		 */
		abstract CanDoubleWall(): boolean;

		/**
		 * Indicates if the Item supports Rotary Nesting or not.
		 * @returns Boolean
		 */
		abstract CanRotary(): boolean;
	
		/**
		 * Removes a Link from the Links tab of the Item Properties.
		 * @param LinkNumber Number of link to remove from the Item.
		 * @returns Boolean Flag indicating if link deletion was successful or not.
		 */
		abstract DeleteLink(LinkNumber: number): boolean;

		/**
		 * Gets a string representing the location of a connectors X, Y and/or Z value.
		 * @param ConnectorIndex This index number is associated with the connector number shown in the edit item dialog.
		 * @param XYZ Optional string representing an X, Y or Z portion of the connector centerline coordinate.
		 * @returns String representing the X, Y, Z or all 3 if XYZ was not provided.
		 * @remarks
		 * Supported values are...'XYZ', 'X', 'Y', 'Z', 'TOP' and 'BTM'.
		 * The string 'XYZ', missing parameters, empty strings or any other non supported value returns
		 * a string representing the X, Y & Z coordinates seperated by spaces (e.g. '1.25 4.54 0.00').
		 * If the string 'X', 'Y' or 'Z' is speified, a string representing just that compoentent of the
		 * endpoint is returned.
		 * If the string 'TOP' or 'BTM' is specified, a string representing the Z coordinate of the connector's
		 * Top or Bottom is returned.
		 */
		abstract EndLocation(ConnectorIndex: number, XYZ?: string): string;

		/**
		 * Get the Level value of the specified Item based on it's section.
		 * @param LevelName Allowed values are "Soffit" and "Floor".
		 * @returns Number representing the Soffit/Floor level of the Item's Section.
		 */
		abstract Level(LevelName: string): number;

		/**
		 * Loads an ITM file from disk
		 * @param ItemFile String of full path and file name including '.ITM' extension.
		 * @returns Boolean Flag indicating if loading of ITM file was successful.
		 */
		abstract Load(ItemFile: string): boolean;

		/**
		 * Refreshes all costs of the Item.
		 * @returns Nothing
		 * @remarks
		 * Call after making any change to the Item that may affect cost.
		 */
		abstract RefreshCosts(): void;

		/**
		 * Remove all holes added to Item.
		 * @returns Boolean Flag indicating if hole removal was successful.
		 */
		abstract RemoveHoles(): boolean;

		/**
		 * Save an ITM file to disk.
		 * @param ItemFile 
		 * @returns Boolean Flag indicating if saving of the ITM file was successful.
		 */
		abstract Save(ItemFile: string): boolean;

		/**
		 * Set Flag on a development part indicating if it should not be cut.
		 * @param DevNumber Number of development part to set the flag of.
		 * @param DoNotCut Boolean flag toggling the 'Do Not Cut' property of the development.
		 * @returns Boolean Flag indicating of toggling flag was successful or not.
		 * @remarks
		 * Use the 'Item.PartsCut' property first to determine the number of parts available
		 * in the Item to help determine which development number(s) you may want to toggle.
		 */
		abstract SetDevNotCutFlag(DevNumber: number, DoNotCut: boolean): boolean;

		/**
		 * Set Flow Type and Value on an Item. 
		 * @param FlowType Number between 0 and 3. 0='Not Set', 1='Supply', 2='Return', 3='None' 
		 * @param FlowValue Number representing flow value in standard flow units.
		 * @returns Boolean Flag indicating success or failure. Failure implies an invalid type.
		 */
		abstract SetFlow(FlowType: number, FlowValue: number): boolean;

		/**
		 * Refreshes Item's developments.
		 * @returns Nothing
		 * @remarks
		 * Call after making any change to the Item that may developments, specifiction or model.
		 */
		abstract Update(): void;

		/**
		 * Save Item's Developments as DXF File(s).
		 * @param DXFFile String of full path and file name to export.
		 * @param IncludeLeads Optional Boolean Flag indicating if Lead Ins/Outs should be written to DXF.
		 * @remarks
		 * File to save should exclude the '.DXF' file extension.
		 * Flag for writing Lead Ins/Outs defaults to TRUE if ommited.
		 * Each development is appended with a '-1', '-2', '-3', etc. suffix to the specified file name.
		 */
		abstract WriteDXF(DXFFile: string, IncludeLeads?: boolean): boolean;

		//#endregion ITEM Methods Group
	}

	abstract class ITEM extends ITEMSTRUCT {}

	abstract class TASK {

		//#region TASK Properties Group
		
		/**
		 * Get the Task Status Flag indicating if Task was aborted for the TASK Object.
		 * @readonly
		 */
		Aborted: boolean;

		/**
		 * Get/Set the Message Text for the progress dialog for the TASK Object.
		 */
		Message: string;

		/**
		 * Get/Set the Progress Bar for the progress dialog for the TASK Object.
		 */
		Progress: number;

		/**
		 * Gets an array of TASKSELECTION Objects of the TASK Object.
		 * @remarks 
		 * Always check to see if the 'Task.Selection.Count' property returns a value >= 1 before
		 * using Task.Selection[index#]
		 */
		Selection: Array<TASKSELECTION>;
		
		//#endregion TASK Properties Group

		//#region TASK Methods Group

		/**
		 * Initialize and display progress bars setting maximum task length.
		 * @param NumberOfTasks Number indicating the number of tasks to perform.
		 * @returns Nothing
		 * @remarks
		 * NumberofTasks should ideally specify the number of iterations you go through so that the progress bars
		 * dialog shows a progress relative to the tasks you're performing. You must use the Task.Progress
		 * property to move the progress bars as your tasks processes.
		 */
		abstract BeginProgress(NumberOfTasks: number): void;

		/**
		 * Terminate the display of the progress bars dialog.
		 * @returns Nothing
		 * @remarks
		 * Call to end the display of the progress bars dialog when tasks are finished processing.
		 * You may use the Task.Aborted proeprty to determine if the user canceled the process. When the
		 * user cancels the progress bars, this does not stop your tasks from processing, merely sets the
		 * Aborted property. You must monitor the Aborted flag and exit the task processing in your code
		 * to propertly terminate a task by a user.
		 */
		abstract EndProgress(): void;

		//#endregion TASK Methods Group

	}

	//#endregion Fabrication Objects


} // END of Fabrication Namespace

