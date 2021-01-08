# Object: TASK
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This first-class object cannot be directly created, but is in fact Static and can be accessed at any time without constructing.
## Properties
The following items are accessed from the base object by a dot notation
### Property: Aborted
Get Task Status Flag indicating if Task was aborted for the TASK Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Message
Get/Set the Message Text for the progress dialog for the TASK Object

No additional remarks available
##### Returns
STRING
### Property: Progress
Get/Set the Progress Bar for the progress dialog for the TASK Object.

No additional remarks available
##### Returns
NUMBER
### Property: Selection
Gets an array of TASKSELECTION Objects of the TASK Object.

No additional remarks available
##### Returns
[TASKSELECTION](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/TASKSELECTION-SubObject.md)[]
## Methods
The following items are invoked from the base object by a dot notation
### Function: BeginProgress
Initialize and display progress bars setting maximum task length

No additional remarks available
##### Signature
BeginProgress(NumberOfTasks: NUMBER)
##### Arguments
- **NumberOfTasks** as: NUMBER
  - Remarks: Number indicating the number of tasks to perform.
##### Returns
VOID
### Function: EndProgress
Terminate the display of the progress bars dialog

No additional remarks available
##### Signature
EndProgress()
##### Arguments
##### Returns
VOID
