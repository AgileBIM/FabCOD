# Sub Object: DIM
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties
## Properties
The following items are accessed from the base object by a dot notation
### Property: Annotation
Get the Annotation of the DIM Object.

Annotations of the Dimension are the A, B, C, etc. text strings related to the dimension.
##### Returns
STRING
### Property: Locked
Get/Set the Lock Status of the DIM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Name
Get the Dimension Name of the DIM Object.

No additional remarks available
##### Returns
STRING
### Property: NumValue
Get the Calculated Numerical Value of the DIM Object.

Some Dimension values have settings like "Auto", "Dependent", "Calculated". This property retuns
the calculated value of the dimension with those settings.
##### Returns
NUMBER
### Property: Status
Get the Status of the Dimension of the DIM Object.

Status values are "Input", "Display", "Not Used" or "Fixed"
##### Returns
STRING
### Property: Value
Get/Set the Value of the DIM Object.

No additional remarks available
##### Returns
STRING or NUMBER
## Methods
The following items are invoked from the base object by a dot notation
