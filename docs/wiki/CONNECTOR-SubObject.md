# Sub Object: CONNECTOR
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties
## Properties
The following items are accessed from the base object by a dot notation
### Property: Alt
Get/Set Alternatge Code of the CONNECTOR Object.

Alternate Code is used for enforcing Alternate Connector values using the Specifications.
##### Returns
STRING
### Property: Group
Get the Connector Group for the CONNECTOR Object.

No additional remarks available
##### Returns
STRING
### Property: Locked
Get/Set the Lock Status of the CONNECTOR Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Material
Get/Set the Connector Material of the CONNECTOR Object.

Property only exists on Pattern Numbers 522, 1522 and 2522 (coupling patterns) to allow for
transitions to alternate material types. When set to "None", scripts return the value of "Error" however
the value can be set to "None" using Item.Connector[index].Material = "None".
If duct coupling pattern 522 is Doublewall, an Error will also result for the Skin Connector Material.
Skin Connector Material property can not be set via UI but can be reset via code using
Item.SkinConnector[index].Material = "None"
##### Returns
STRING
### Property: Type
Get the Connector Library Type of the CONNECTOR Object.

No additional remarks available
##### Returns
STRING
### Property: Value
Get/Set the Name of the Connector.

Group is given by the Group property.
##### Returns
STRING
## Methods
The following items are invoked from the base object by a dot notation
