# Sub Object: DAMPER
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties
## Properties
The following items are accessed from the base object by a dot notation
### Property: Locked
Get/Set the Lock Status of the DAMPER Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Rotation
Get/Set the Rotation Adjuect of the DAMPER Object.

Property is only available in Autodesk Fabrication 2017 and later. It acts upon a damper as an 'Adjust' not an
'Override'. It was added to support Dynamic Damper Rotation from within in Revit. The value of  the rotation
override will be added to the damper 'Angle' on the Damper database object.
e.g. If a Damper database definition has an angle of 90 degrees, and the Damper Rotation property is 90 degrees,
the Damper will be rotated 180 degrees on the ITM.
##### Returns
NUMBER
### Property: Value
Get/Set the name of the DAMPER Object.

No additional remarks available
##### Returns
STRING
## Methods
The following items are invoked from the base object by a dot notation
