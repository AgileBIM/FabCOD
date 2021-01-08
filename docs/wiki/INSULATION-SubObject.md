# Sub Object: INSULATION
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties
## Properties
The following items are accessed from the base object by a dot notation
### Property: Facing
Get/Set the Facing Name of the INSULATION Object.

Facing Name only is given. Facing Group is not given as part of the value.
##### Returns
STRING
### Property: Gauge
Get/Set the Insulation Gauge of the INSULATION Object.

For Insulation Material Types 'Linear Ductwork' and 'For Machines', Gauge gives the Insulation Thickness.
For Insulation Material Types 'Pipework', 'Electrical Containment' and 'Undefined' Gauge gives the Insualtion Material
Index Number as entered in the Insulation Material (e.g. May be a decimal).
##### Returns
NUMBER
### Property: Material
Get/Set the Insulation Material Name of the INSULATION Object.

Insulation Material Group is not given as part of the value.
##### Returns
STRING
### Property: MaterialLock
Get/Set the Lock Status for the Material property of the INSUALTION Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Status
Get/Set the Insualtion Status of the INSULATION Object.

"OFF", "INSIDE" and "OUTSIDE" are the only values allowed.
##### Returns
STRING
### Property: StatusLock
Get/Set the Lock Status for the Status property of the INSULATION Object.

No additional remarks available
##### Returns
BOOLEAN
## Methods
The following items are invoked from the base object by a dot notation
