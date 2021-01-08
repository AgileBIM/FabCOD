# Object: FILELOCATOR
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This first-class object cannot be directly created, but is in fact Static and can be accessed at any time without constructing.
## Properties
The following items are accessed from the base object by a dot notation
### Property: File
This gets an array of File Names of found files for the FILELOCATOR Object.

No additional remarks available
##### Returns
STRING[]
### Property: FileCount
Get the Number of Files that were found for the FILELOCATOR Object.

No additional remarks available
##### Returns
NUMBER
### Property: Folder
This gets an array of Folder Names of found folders for the FILELOCATOR Object.

No additional remarks available
##### Returns
STRING[]
### Property: FolderCount
Get the Number of Folders that were found for the FILELOCATOR Object.

No additional remarks available
##### Returns
NUMBER
### Property: Path
Get/Set full Path of Folder being scanned for the FILELOCATOR Object.

No additional remarks available
##### Returns
STRING
## Methods
The following items are invoked from the base object by a dot notation
### Function: FileLocator
Constructs a FileLocator Object.

If optional parameters are not specified when constructing the FILELOCATOR object,
use the FILELOCATOR.Scan method to specify them.
##### Signature
FileLocator([RootPath: STRING], [SearchWildcard: STRING], [SearchFiles: BOOLEAN], [SearchFolders: BOOLEAN])
##### Arguments
- **RootPath** as Optional: STRING
  - Remarks: Optional String of Root Path to Search.
- **SearchWildcard** as Optional: STRING
  - Remarks: Optional String Wildcard to match against.
- **SearchFiles** as Optional: BOOLEAN
  - Remarks: Optional Boolean Flag to search against Files.
- **SearchFolders** as Optional: BOOLEAN
  - Remarks: Optional Boolean Flag to search against Folders.
##### Returns
VOID
### Function: Scan
Scan a root path for Files and/or Folders matching a Wildcard string.

This function is not needed if the FILELOCATOR Object Constructor was called with parameters specifying the
path, search wildcard, file and folder search flags.
##### Signature
Scan(RootPath: STRING, SearchWildcard: STRING, SearchFiles: BOOLEAN, SearchFolders: BOOLEAN)
##### Arguments
- **RootPath** as: STRING
  - Remarks: Optional String of Root Path to Search.
- **SearchWildcard** as: STRING
  - Remarks: Optional String Wildcard to match against.
- **SearchFiles** as: BOOLEAN
  - Remarks: Optional Boolean Flag to search against Files.
- **SearchFolders** as: BOOLEAN
  - Remarks: Optional Boolean Flag to search against Folders.
##### Returns
NUMBER
