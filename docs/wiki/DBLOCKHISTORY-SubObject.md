# Sub Object: DBLOCKHISTORY
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties
## Properties
The following items are accessed from the base object by a dot notation
### Property: Changed
Get the Date/Time Stamp of the Version Record of the DBLOCKHISTORY Object.

No additional remarks available
##### Returns
STRING
### Property: History
Get the History Object of the DBLOCKHISTORY Object.

History object is recursive. Each History Object contains another History object. This continues until the
Histroy object returns a NULL value. Do NOT interate through the nested History objects using the Version
property as that property can be rolled back/forward and many not indicate the number of history entries accurately.
##### Returns
[DBLOCKHISTORY](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/DBLOCKHISTORY-SubObject.md)
### Property: Info
Get the Information Data of the Version Record of the DBLOCKHISTORY Object.

No additional remarks available
##### Returns
STRING
### Property: Owner
Get the Previous Owner of DBLOCKHISTORY Object.

No additional remarks available
##### Returns
STRING
### Property: Version
Get the Previous Version of the DBLOCKHISTORY Object

No additional remarks available
##### Returns
NUMBER
## Methods
The following items are invoked from the base object by a dot notation
