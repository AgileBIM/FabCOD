# Sub Object: PRODUCTENTRY
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties
## Properties
The following items are accessed from the base object by a dot notation
### Property: Alias
Get/Set the Alias property of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
STRING
### Property: Area
Get/Set the Area property of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
NUMBER
### Property: BoughtOut
Get/Set the BoughtOut flag of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: CadBlock
Get/Set the CAD Block name of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
STRING
### Property: CustomData
This gets an array of CUSTOMDEF Objects of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
[CUSTOMDEF](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/CUSTOMDEF-SubObject.md)[]
### Property: DatabaseID
Get/Set the Database ID property of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
STRING
### Property: Dim
This Gets an array of DIM Objects of the PRODUCTENTRY Object.

Available properties of the DIM Object are limited within the PRODUCTENTRY Object.
##### Returns
NUMBER[] or STRING[]
### Property: FlowMax
Get/Set the Maximum Flow value of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
NUMBER
### Property: FlowMin
Get/Set the Minimum Flow value of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
NUMBER
### Property: Model
Get/Set the Model Name property of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
STRING
### Property: Name
Get/Set the Product Entry name of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
STRING
### Property: Option
This Gets an array of OPTION Objects of the PRODUCTENTRY Object.

Available properties of the OPTION Object are limited within the PRODUCTENTRY Object.
##### Returns
NUMBER[] or STRING[]
### Property: Order
Get/Set the Order property of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
STRING
### Property: SKey
Get/Set the SKey property of the PRODUCTENTRY Object.

Available in Fabrication 2018.2 versions and later.
##### Returns
STRING
### Property: Weight
Get/Set the Weight value of the PRODUCTENTRY Object.

No additional remarks available
##### Returns
NUMBER
## Methods
The following items are invoked from the base object by a dot notation
### Function: AddAlias
Adds the 'ALIAS' Column to Product List.

No additional remarks available
##### Signature
AddAlias()
##### Arguments
##### Returns
BOOLEAN
### Function: AddArea
Adds the 'AREA' Column to Product List.

No additional remarks available
##### Signature
AddArea()
##### Arguments
##### Returns
BOOLEAN
### Function: AddBoughtOut
Adds the 'BOUGHTOUT' Column to Product List.

No additional remarks available
##### Signature
AddBoughtOut()
##### Arguments
##### Returns
BOOLEAN
### Function: AddCADBlock
Adds the 'CADBLOCK' Column to Product List.

No additional remarks available
##### Signature
AddCADBlock()
##### Arguments
##### Returns
BOOLEAN
### Function: AddCustomData
Adds the 'CUSTOMDATA[<dataname>]' Column to Product List.

No additional remarks available
##### Signature
AddCustomData(CustomDataName: STRING)
##### Arguments
- **CustomDataName** as: STRING
  - Remarks: Text Name of Custom Data field to add.
##### Returns
BOOLEAN
### Function: AddDatabaseID
Adds the 'ID' Column to Product List.

No additional remarks available
##### Signature
AddDatabaseID()
##### Arguments
##### Returns
BOOLEAN
### Function: AddDim
Adds the 'DIM' Column(s) to Product List.

Function is very buggy. Repeated calls with improper syntax will cause
predictability of this function to be sporatic at best. Repeated calls without
specifying the dimension name to add sequentially adds the next dimension
as they are listed in the pattern.
##### Signature
AddDim([DimName: STRING])
##### Arguments
- **DimName** as Optional: STRING
  - Remarks: Optional Upper Case Name of Dimension to add.
##### Returns
BOOLEAN
### Function: AddFlow
Adds the 'FLOWMIN' and 'FLOWMAX' Columns to Product List.

No additional remarks available
##### Signature
AddFlow()
##### Arguments
##### Returns
BOOLEAN
### Function: AddOption
Adds the 'OPTION' Column(s) to Product List.

Function is very buggy. Repeated calls with improper syntax will cause
predictability of this function to be sporatic at best. Repeated calls without
specifying the dimension name to add sequentially adds the next dimension
as they are listed in the pattern.
##### Signature
AddOption([OptionNmae: STRING])
##### Arguments
- **OptionNmae** as Optional: STRING
##### Returns
BOOLEAN
### Function: AddOrder
Adds the 'ORDER' Column to Product List.

No additional remarks available
##### Signature
AddOrder()
##### Arguments
##### Returns
BOOLEAN
### Function: AddWeight
Adds the 'WEIGHT' Column to Product List.

No additional remarks available
##### Signature
AddWeight()
##### Arguments
##### Returns
BOOLEAN
### Function: RemoveAlias
Removes the 'ALIAS' Column from the Product List.

No additional remarks available
##### Signature
RemoveAlias()
##### Arguments
##### Returns
BOOLEAN
### Function: RemoveArea
Removes the 'AREA' Column from the Product List.

No additional remarks available
##### Signature
RemoveArea()
##### Arguments
##### Returns
BOOLEAN
### Function: RemoveBoughtOut
Removes the 'BOUGHTOUT' Column from the Product List.

No additional remarks available
##### Signature
RemoveBoughtOut()
##### Arguments
##### Returns
BOOLEAN
### Function: RemoveCADBlock
Removes the 'CADBLOCK' Column from the Product List.

No additional remarks available
##### Signature
RemoveCADBlock()
##### Arguments
##### Returns
BOOLEAN
### Function: RemoveCustomData
Removes the 'CUSTOMDATA[<dataname>]' Column from the Product List.

No additional remarks available
##### Signature
RemoveCustomData(Name: STRING)
##### Arguments
- **Name** as: STRING
##### Returns
BOOLEAN
### Function: RemoveDatabaseID
Removes the 'ID' Column from the Product List.

No additional remarks available
##### Signature
RemoveDatabaseID()
##### Arguments
##### Returns
BOOLEAN
### Function: RemoveDim
Removes the 'DIM' Column(s) from the Product List.

Function is very buggy. Repeated calls with improper syntax will cause
predictability of this function to be sporatic at best. Calls without
specifying the Dimension index appear to do nothing.
##### Signature
RemoveDim(DimIndex: NUMBER)
##### Arguments
- **DimIndex** as: NUMBER
  - Remarks: Zero based index of Dimension column to remove.
##### Returns
BOOLEAN
### Function: RemoveFlow
Removes the 'FLOWMIN' and 'FLOWMAX' Columns from the Product List.

No additional remarks available
##### Signature
RemoveFlow()
##### Arguments
##### Returns
BOOLEAN
### Function: RemoveOption
Removes the 'OPTION' Column(s) from the Product List.

Function is very buggy. Repeated calls with improper syntax will cause
predictability of this function to be sporatic at best. Calls without
specifying the Option index appear to do nothing.
##### Signature
RemoveOption(OptionIndex: NUMBER)
##### Arguments
- **OptionIndex** as: NUMBER
  - Remarks: Zero based index of Option column to remove.
##### Returns
BOOLEAN
### Function: RemoveOrder
Removes the 'ORDER' Column from the Product List.

No additional remarks available
##### Signature
RemoveOrder()
##### Arguments
##### Returns
BOOLEAN
### Function: RemoveWeight
REmoves the 'WEIGHT' Column from the Product List.

No additional remarks available
##### Signature
RemoveWeight()
##### Arguments
##### Returns
BOOLEAN
