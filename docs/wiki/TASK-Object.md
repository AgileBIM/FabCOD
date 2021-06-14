# Object: TASK
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This first-class object cannot be directly created, but is Static and can be used at any time without constructing.
## Properties
The following items are accessed from the base object by a dot notation
### Property: Aborted
Get the Task Status Flag indicating if Task was aborted for the TASK Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Message
Get/Set the Message Text for the progress dialog for the TASK Object.

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

Always check to see if the 'Task.Selection.Count' property returns a value >= 1 before
using Task.Selection[index#]
##### Returns
[TASKSELECTION](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/TASKSELECTION-SubObject.md)[]
## Methods
The following items are invoked from the base object by a dot notation
### Function: BeginProgress
Initialize and display progress bars setting maximum task length.

NumberofTasks should ideally specify the number of iterations you go through so that the progress bars
dialog shows a progress relative to the tasks you're performing. You must use the Task.Progress
property to move the progress bars as your tasks processes.
##### Signature
BeginProgress(NumberOfTasks: NUMBER)
##### Arguments
- **NumberOfTasks** as: NUMBER
  - Remarks: Number indicating the number of tasks to perform.
##### Returns
VOID
### Function: EndProgress
Terminate the display of the progress bars dialog.

Call to end the display of the progress bars dialog when tasks are finished processing.
You may use the Task.Aborted proeprty to determine if the user canceled the process. When the
user cancels the progress bars, this does not stop your tasks from processing, merely sets the
Aborted property. You must monitor the Aborted flag and exit the task processing in your code
to propertly terminate a task by a user.
##### Signature
EndProgress()
##### Arguments
##### Returns
VOID
