# Sub Object: JOB
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties
## Properties
The following items are accessed from the base object by a dot notation
### Property: Colour
Get/Set the Job Color value of the JOB Object.

Value is given as an integer representing AutoCAD's Color index (0 - 255).
##### Returns
NUMBER
### Property: CustomData
If applicable, this gets an array of CUSTOM DATA Objects for the JOB Object.

There is no way to itterate over this array, you need to be aware of the custom data indices or names that exist in your database.
##### Returns
[CUSTOMDEF](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/CUSTOMDEF-SubObject.md)[]
### Property: Date
Get the Job Creation Date value of the JOB Object.

No additional remarks available
##### Returns
STRING
### Property: Field1
Get/Set the generic utility field #1 of JOB Object.

Field can be used for any user defined purpose.
##### Returns
STRING
### Property: Field2
Get/Set the generic utility field #2 of JOB Object.

Field can be used for any user defined purpose.
##### Returns
STRING
### Property: Items
Get the Number of Items in job of the JOB Object.

No additional remarks available
##### Returns
NUMBER
### Property: Item
If applicable, this gets an array of ITEM Objects for the JOB Object.

Always check to see if the 'Items' property returns a value >= 1 before using Job.Item[index#]
##### Returns
ITEM[]
### Property: Name
Get the Job Name of the JOB Object.

No additional remarks available
##### Returns
STRING
### Property: Notes
Get/Set the Notes property of the JOB Object.

No additional remarks available
##### Returns
STRING
### Property: Project
Get the Job Path { relative to PROJECT path } of the JOB Object.

No additional remarks available
##### Returns
STRING
### Property: Reference
Get the Job Ref property of the JOB Object.

No additional remarks available
##### Returns
STRING
### Property: Statuses
Get the number of Statuses of the JOB Object.

No additional remarks available
##### Returns
NUMBER
### Property: Status
If applicable, this gets an array of JOBSTATUS Objects for the JOB Object.

No additional remarks available
##### Returns
[JOBSTATUS](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/JOBSTATUS-SubObject.md)[]
## Methods
The following items are invoked from the base object by a dot notation
### Function: SetStatus
This alters the Active Flag of a Job Status

Returns False if there was an error during Status Activation, True otherwise.
##### Signature
SetStatus(NameOrIndex: NUMBER|STRING, Active: BOOLEAN)
##### Arguments
- **NameOrIndex** as: NUMBER or STRING
  - Remarks: Number or String of Status to be altered.
- **Active** as: BOOLEAN
  - Remarks: Boolean Flag indicating if Status should be made Active.
##### Returns
BOOLEAN
