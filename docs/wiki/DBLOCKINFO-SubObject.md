# Sub Object: DBLOCKINFO
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties
## Properties
The following items are accessed from the base object by a dot notation
### Property: History
Get the History Object of the ITEM Object.

No additional remarks available
##### Returns
[DBLOCKHISTORY](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/DBLOCKHISTORY-SubObject.md)
### Property: Owner
Get the Previous Owner of DBLOCKINFO Object.

No additional remarks available
##### Returns
STRING
### Property: Version
Get the Previous Version of the DBLOCKINFO Object

No additional remarks available
##### Returns
NUMBER
## Methods
The following items are invoked from the base object by a dot notation
### Function: Can
Indicates if the Items's current Owner allows access to History/Versioning.

No additional remarks available
##### Signature
Can(LockType: DBLOCKCAN)
##### Arguments
- **LockType** as: DBLOCKCAN
  - LOCK_USER
  - LOCK_OWNER
  - Remarks: Enum/Number for access type to check.
##### Returns
BOOLEAN
### Function: SetOwner
Changes the current owner.

No additional remarks available
##### Signature
SetOwner(NewOwner: STRING, Reason: STRING)
##### Arguments
- **NewOwner** as: STRING
  - Remarks: String representing new owner.
- **Reason** as: STRING
  - Remarks: String description of the reason for the change.
##### Returns
BOOLEAN
### Function: SetVersion
Changes the current version.

No additional remarks available
##### Signature
SetVersion(NewVersion: NUMBER, Reason: STRING)
##### Arguments
- **NewVersion** as: NUMBER
  - Remarks: Number representing new version.
- **Reason** as: STRING
  - Remarks: String description of the reason for the change.
##### Returns
BOOLEAN
