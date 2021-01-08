# Object: ITEM
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
This first-class object cannot be directly created, but is in fact Static and can be accessed at any time without constructing.
## Properties
The following items are accessed from the base object by a dot notation
### Property: Airturns
Get the number of AirTurns in the AIRTURN Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Airturn
If applicable, this gets an array of AIRTURN Objects of the ITEM Object.

Always check to see if the 'Airturns' property returns a value >= 1 before using Item.Airturn[index#/name]
##### Returns
[AIRTURN](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/AIRTURN-SubObject.md)[]
### Property: Alias
Get/Set the Alias property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: Alternate
Get/Set the Alternate property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: Bitmap
Get/Set the Bitmap (Image File Name) of the ITEM Object.

May be full, relative Path, just Filename or blank for default. May be a BMP or PNG image type.
PNG image type recommended for reduced file size and performance.
##### Returns
STRING
### Property: BoughtOut
Get/Set the BoughtOut Flag of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Box
Get/Set the Box property of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: ButtonAlias
Get/Set the Button Code Alias that the ITEM Object was taken off with.

No additional remarks available
##### Returns
STRING
### Property: ButtonCode
Get/Set the ButtonCode that the ITEM Object was taken off with.

No additional remarks available
##### Returns
STRING
### Property: CADBlock
Get/Set the CADBlock name associated with the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: Catalogue
Get the Catalog Flag of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: CID
Get/Set the CID number of the ITEM Object.

CID is not guarenteed to be the same as the Pattern Number. Best practice is to not
change the CID value which defaults to the Pattern Number without very specific reasons and
knowledge of it's impact.
##### Returns
NUMBER
### Property: Comment
Get/Set the Comment text of the ITEM Object.

Supports multi-line text and may contain Carriage Returns.
##### Returns
STRING
### Property: Connectors
Get the number of Connectors in the CONNECTOR Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Connector
If applicable, this gets an array of CONNECTOR Objects of the ITEM Object.

Always check to see if the 'Connectors' property returns a value >= 1 before using Item.Connector[index#/name]
##### Returns
[CONNECTOR](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/CONNECTOR-SubObject.md)[]
### Property: CostByLength
Get/Set the CostByLength (Cost Units) Flag of the ITEM Object.

Cost Units are set by the CostByLength flag. 0 = Cost by Qty, 1 Cost by Ft.
##### Returns
BOOLEAN
### Property: CostType
Get/Set the CostType property of the ITEM Object.

Valid CostType values are...'Demolition', 'Free Issue', 'Normal', 'Relocation' and 'Supply Only'.
##### Returns
STRING
### Property: CustomData
If applicable, this gets an array of CUSTOM DATA Objects for the ITEM Object.

There is no way to itterate over this array, you need to be aware of the custom data indices or names that exist in your database.
##### Returns
[CUSTOMDEF](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/CUSTOMDEF-SubObject.md)[]
### Property: CutType
Get/Set the CutType property of the ITEM Object.

Alowwed values of CutType vary depending on the ITM's Pattern Number.
##### Returns
STRING
### Property: Dampers
Get the number of Dampers in the DAMPER Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Damper
If applicable, this gets an array of DAMPER Objects of the ITEM Object.

Always check to see if the 'Dampers' property returns a value >= 1 before using Item.Dampers[index#/name]
##### Returns
[DAMPER](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/DAMPER-SubObject.md)[]
### Property: DatabaseID
Get/Set the Database ID property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: DBLock
This gets the DBLOCKINFO Object of the ITEM Object.

No additional remarks available
##### Returns
[DBLOCKINFO](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/DBLOCKINFO-SubObject.md)
### Property: Decoiler
This gets the DECOILERINFO Object of the ITEM Object.

No additional remarks available
##### Returns
[DECOILERINFO](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/DECOILERINFO-SubObject.md)
### Property: Description
Get/Set the Description of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: Dims
Get the number of Dimensions in the DIM Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Dim
If applicable, this gets an array of DIM Objects of the ITEM Object.

Always check to see if the 'Dims' property returns a value >= 1 before using Item.Dim[index#/name]
##### Returns
[DIM](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/DIM-SubObject.md)[]
### Property: DimSide
Get/Set the Dimension Side Flag of the ITEM Object.

Possible values are 'Inside', 'Outside' and 'None'.
If DoubleWall, this flag controls whether dimensions are inside or outside sizes.
If not DoubleWall and Insulation is inside, this also controls whether dimensions
are inside or outside sizes. This setting is remembered seperately for DoubleWall
or not DoubleWall. Ensure DoubleWall is set correctly before changing.
##### Returns
STRING
### Property: DimSideLock
Get/Set the Lock Status of the DimSide Flag of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: DoubleWall
Get/Set the DoubleWall Flag of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Drawing
Get/Set the Drawing property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: DWLock
Get/Set the Lock Status for the DoubleWall Flag of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: ETag
Get/Set the E-Tag property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: ExtraETime
Get/Set the Extra Install Time of the ITEM Object.

The 'E' in ETime stands for 'Erection' or Installation Time.
Extra ETime is expressed in terms of units specified by the ExtraETimeUnits property.
##### Returns
NUMBER
### Property: ExtraETimeRate
Get/Set the Extra Install Time Rate of the ITEM Object.

The 'E' in ETime stands for 'Erection' or Installation Time.
ExtraETimeRate can be specified by Rate 'Name' or Index.
##### Returns
STRING
### Property: ExtraETimeUnits
Get/Set the Extra Install Time Units of the ITEM Object.

The 'E' in ETime stands for 'Erection' or Installation Time.
##### Returns
TIMEUNITS
### Property: ExtraFTime
Get/Set the Extra Fabrication Time of the ITEM Object.

The 'F' in FTime stands for 'Fabrication'.
Extra FTime is expressed in terms of units specified by the ExtraFTimeUnits property.
##### Returns
NUMBER
### Property: ExtraFTimeRate
Get/Set the Extra Fabrication Time Rate of the ITEM Object.

The 'F' in FTime stands for 'Fabrication'.
ExtraFTimeRate can be specified by Rate 'Name' or Index.
##### Returns
STRING
### Property: ExtraFTimeUnits
Get/Set the Extra Fabrication Time Units of the ITEM Object.

The 'F' in FTime stands for 'Fabrication'.
##### Returns
TIMEUNITS
### Property: FabTable
Get/Set the Fabrication Table Name property of the ITEM Object.

Only the Table Name is given, not the Group. Autodesk documentation INCORRECTLY
indicates the Table Name includes the Group (e.g. 'Group: Name'). Value is subject to
change if this Autodesk defect is corrected in future releases.
##### Returns
STRING
### Property: FabTableLock
Get/Set the Lock Status of the Fabrication Table property of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Facing
Get/Set the Facing Name of the ITEM Object.

Facing Name only is given. Facing Group is not given as part of the value.
##### Returns
STRING
### Property: FacingLock
Get/Set the Lock Status of the Facing property of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Filename
Get/Set the ITM Filename of the ITEM Object.

Filename is given without the ITM file extension.
##### Returns
STRING
### Property: FixRelative
Get/Set the FixRelative Flag of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Gauge
Get/Set the Material Gauge of the ITEM Object.

For Material Types 'Linear Ductwork' and 'For Machines', Gauge gives the Material Thickness.
For Material Types 'Pipework', 'Electrical Containment' and 'Undefined' Gauge gives the
Material Index Number as entered in the material (e.g. May be a decimal).
##### Returns
NUMBER
### Property: GaugeLock
Get/Set the Lock Status of the Gauge property of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Guid
Get the 32-Bit GUID Scan Code of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: Guid64
Get the 64-Bit GUID Scan Code of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: Handle
Get the Handle of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: HasProduct
Get the HasProduct Flag of the ITEM Object.

A value of True or 0 indicates the ITEM is product listed.
##### Returns
BOOLEAN
### Property: InsSpec
Get/Set the Insualtion Specification Group & Name (e.g. 'Group: Name') of the ITEM Object.

Property may also be set to 'Not Set' or 'Off' preset values.
##### Returns
STRING
### Property: InstallTable
Get/Set the Installation Table Name property of the ITEM Object.

Only the Table Name is given, not the Group. Autodesk documentation INCORRECTLY
indicates the Table Name includes the Group (e.g. 'Group: Name'). Value is subject to
change if Autodesk defect is corrected in future releases.
##### Returns
STRING
### Property: InstallTableLock
Get/Set the Lock Status of the InstallTable property of the ITEM OBject.

No additional remarks available
##### Returns
BOOLEAN
### Property: Insulation
Get Insulation Object of the ITEM Object.

No additional remarks available
##### Returns
[INSULATION](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/INSULATION-SubObject.md)
### Property: ISpecLock
Get/Set the Lock Status of the Insualtion Specification property of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Library
Get the Library property of the ITEM OBject.

The dominant library for the ITM. Possible values are 'Ductboard', 'Electrical', 'Equipment',
'Fabrication', 'Flat Oval', Free Entry', 'Furniture', 'Pipework', 'Profiled', 'Rectangular',
'Round', 'Standard', 'Structure', 'Sub Assembly' or 'Unknown'.
##### Returns
STRING
### Property: Lifespan
Get/Set the Lifespan (in Years) of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Links
Get the number of Links in the LINK Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Link
If applicable, this gets an array of LINK Objects of the ITEM Object.

Always check to see if the 'Links' property returns a value >= 1 before using Item.Link[index#/name]
##### Returns
[LINK](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/LINK-SubObject.md)[]
### Property: ManyOldStatus
Get the number of Old Statuses in the History of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: MatAbrv
Get Material Abreviation of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: Material
Get/Set the Material Name & Group (e.g. 'Group: Name') of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: NestPriority
Get/Set the Nest Priority of the ITEM Object.

Items with a higher number nest first giving preference to those itesm in the nesting process.
##### Returns
NUMBER
### Property: Notes
Get/Set the Notes property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: Number
Get/Set the Number property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: OldStatus
If applicable, this gets an array of STATUS Objects of the ITEM Object.

No additional remarks available
##### Returns
[STATUS](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/STATUS-SubObject.md)[]
### Property: OperatingCost
Get/Set the Operating Cost (per Year) of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Options
Get the number of Options in the OPTION Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Option
If applicable, this gets an array of OPTION Objects of the ITEM Object.

Always check to see if the 'Options' property returns a value >= 1 before using Item.Option[index#/name]
##### Returns
[OPTION](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/OPTION-SubObject.md)[]
### Property: Order
Get/Set the Order property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: Pallet
Get/Set the Pallet property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: PartsCut
Get the Number of Parts to Cut of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: PartCut
If applicable, this gets an array of Cut Statuses of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN[]
### Property: Path
Get/Set the Path property of the ITEM Object.

Path includes the terminating slash (/). Note that folder seperators are
forward slashes (/) as opposed to backslashes (/) which are more commonly seen.
##### Returns
STRING
### Property: PatNo
Get the Pattern Number of rthe ITEM Object.

Unlike CID, Pattern Number is the true Pattern for the ITM and can not be changed.
This property is only available in Fabrication 2019.1 versions and later.
##### Returns
NUMBER
### Property: PriceList
Get/Set the Price List Name & Group (e.g. 'Group: Name') of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: PriceTableLock
Get/Set the Lock Status for the Price List property of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Product
This gets the PRODUCTINFO Object of the ITEM Object.

No additional remarks available
##### Returns
[PRODUCTINFO](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/PRODUCTINFO-SubObject.md)
### Property: Qty
Get/Set the Item Quantity property of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Scale
Get/Set the Scale Factor of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Sealant
This gets the SEALENT Object of the ITEM Object.

No additional remarks available
##### Returns
[SEALENT](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/SEALENT-SubObject.md)
### Property: Seams
If applicable gets the number of Seams in the SEAM Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Seam
If applicable, this gets an array of SEAM Objects of the ITEM Object.

Always check to see if the 'Seams' property returns a value >= 1 before using Item.Seam[index#]
##### Returns
[SEAM](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/SEAM-SubObject.md)[]
### Property: Section
Get/Set the Section Name & Group (e.g. 'Group: Name') of the ITEM Object.

Can be set by specifying 'Name' or 'Group:Name'. Can be reset by setting
to 'None' or empty string ''.
##### Returns
STRING
### Property: Service
Get/Set the Service Name & Group (e.g. 'Group: Name') of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: ServiceType
Get/Set the ServiceType property of the ITEM Object.

ServiceType can be set using the 'Name' or 'Index' of the desired ServieType.
##### Returns
STRING
### Property: SkinConnector
If applicable, this gets an array of Skin CONNECTOR Objects of the ITEM Object.

Always check to see if the 'Connectors' property returns a value >= 1 before using Item.SkinConnector[index#]
##### Returns
[CONNECTOR](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/CONNECTOR-SubObject.md)[]
### Property: SkinDecoiler
This gets the Skin DECOILERINFO Object of the ITEM Object.

No additional remarks available
##### Returns
[DECOILERINFO](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/DECOILERINFO-SubObject.md)
### Property: SkinGauge
Get/Set the Skin Gauge (thinckness) for the Skin Material of the ITEM Object.

Only valid if DoubleWall flag is set.
##### Returns
NUMBER
### Property: SkinMaterial
Get/Set the Skin Material Name & Group (e.g. 'Group: Name') of the ITEM Object.

Only valid if DoubleWall flag is set.
##### Returns
STRING
### Property: SkinMaterialLock
Get/Set the Lock Status flag for the Skin Material property of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: SkinSeam
If applicable this gets an array of Skin SEAM Objects of the ITEM Object.

Always check to see if the 'Seams' property returns a value >= 1 before using Item.SkinSeam[index#]
##### Returns
[SEAM](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/SEAM-SubObject.md)[]
### Property: SkinSide
Get/Set the Skin Side property of the ITEM OBject.

Only valid if DoubleWall flag is set. Possible values are 'Inside' or 'Outside'.
##### Returns
STRING
### Property: Specification
Get/Set the Specification Name & Group (e.g. 'Group: Name') of the ITEM Object.

Can be set by specifying 'Name' or 'Group:Name'. Can be reset by setting
to 'None' or empty string ''.
##### Returns
STRING
### Property: SpecLock
Get/Set the Lock Status flag for the Specification property of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: Splitters
Get the number of Splitters in the SPLITTER Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Splitter
If applicable this gets an array of SPLITTER Objects of the ITEM Object.

Always check to see if the 'Splitters' property returns a value >= 1 before using Item.Splitter[index#]
##### Returns
[SPLITTER](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/SPLITTER-SubObject.md)[]
### Property: Spool
Get/Set the Spool Name property of the ITEM Object.

No additional remarks available
##### Returns
STRING
### Property: SpoolColour
Get/Set the Spool Color property of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Status
Get/Set the Status property of the ITEM Object.

Status can be set using the 'Name' or 'Index' of the desired Status.
##### Returns
STRING
### Property: Stiffeners
Get the number of Stiffeners in the STIFFENER Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Stiffener
If applicable this gets an array of STIFFENER Objects of the ITEM Object.

Always check to see if the 'Stiffeners' property returns a value >= 1 before using Item.Stiffener[index#]
##### Returns
[STIFFENER](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/STIFFENER-SubObject.md)[]
### Property: StructureType
Set Structure Type of ITEM Object.

StructureType can be set using the 'Name' or 'Index' however this property is not able to be
read. It can only be set.
##### Returns
STRING
### Property: SubItems
Get the number of Sub Items in a Sub Assembly for the SUBITEM Array of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: SubItem
If applicable this gets an array of ITEM Objects of the ITEM Object.

Always check to see if the 'SubItems' property returns a value >= 1 before using Item.SubItem[index#]
##### Returns
ITEM[]
### Property: Support
This gets the SUPPORT Object of the ITEM Object.

No additional remarks available
##### Returns
[SUPPORT](https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/SUPPORT-SubObject.md)
### Property: Type
Get the Type property of the ITEM Object.

Property can list one or more library types combined and seperated by a slash. Possible values
are 'Ductboard','Electrical', 'Equipment', 'Fabrication', 'Flat Oval', Free Entry', 'Furniture',
'Pipework', 'Profiled', 'Rectangular', 'Round', 'Standard', 'Structure', 'Sub Assembly' or 'Unknown'.
##### Returns
STRING
### Property: Weight
Get/Set the Weight (in base units) of the ITEM Object.

If Costed by Length, Weight will be returned as per Meter/Foot otherwise by Quantity.
##### Returns
NUMBER
### Property: WeightLock
Get/Set the Lock Status of the Weight property of the ITEM Object.

No additional remarks available
##### Returns
BOOLEAN
### Property: WireGauge
Get/Set the Material Wire Gauge of the ITEM Object.

No additional remarks available
##### Returns
NUMBER
### Property: Zone
GetSet the Zone property of the ITEM Object.

No additional remarks available
##### Returns
STRING
## Methods
The following items are invoked from the base object by a dot notation
### Function: AddCustomData
Dynamically adds Custom Data to the item (for 'User' custom data types)

This function merely added the specified 'User' Custom Data 'Field' to the Item. Once the
field is added, you can set a value using the Custom Data property Item.CustomData[name/index#].Value
##### Signature
AddCustomData(NameOrIndex: STRING|NUMBER)
##### Arguments
- **NameOrIndex** as: STRING or NUMBER
##### Returns
VOID
### Function: BitmapFile
Gets the file name of the Image used for a ITM.

No additional remarks available
##### Signature
BitmapFile(ItmFilePath: STRING)
##### Arguments
- **ItmFilePath** as: STRING
##### Returns
STRING
### Function: CanDoubleWall
Indicates if Item supports DoubleWall entry or not.

No additional remarks available
##### Signature
CanDoubleWall()
##### Arguments
##### Returns
BOOLEAN
### Function: CanRotary
Indicates if Item supports Rotary Nesting or not.

No additional remarks available
##### Signature
CanRotary()
##### Arguments
##### Returns
BOOLEAN
### Function: EndLocation
Gets a string representing the location of a connectors X, Y and/or Z value.

Supported values are...'XYZ', 'X', 'Y', 'Z', 'TOP' and 'BTM'.
The string 'XYZ', missing parameters, empty strings or any other non supported value returns
a string representing the X, Y & Z coordinates seperated by spaces (e.g. '1.25 4.54 0.00').
If the string 'X', 'Y' or 'Z' is speified, a string representing just tha compoentent of the
endpoint is returned.
If the string 'TOP' or 'BTM' is specified, a string representing the Z coordinate of the connector's
Top or Bottom is returned.
##### Signature
EndLocation(ConnectorIndex: NUMBER, [XYZ: STRING])
##### Arguments
- **ConnectorIndex** as: NUMBER
  - Remarks: This index number is associated with the connector number shown in the edit item dialog
- **XYZ** as Optional: STRING
  - Remarks: Optional string representing an X, Y or Z portion of the connector centerline coordinate.
##### Returns
STRING
### Function: Level
Get the Level value of the specified Item based on it's section.

No additional remarks available
##### Signature
Level(LevelName: STRING)
##### Arguments
- **LevelName** as: STRING
  - Remarks: Allowed values are "Soffit" and "Floor"
##### Returns
NUMBER
### Function: Load
Loads an ITM file from disk

No additional remarks available
##### Signature
Load(ItemFile: STRING)
##### Arguments
- **ItemFile** as: STRING
  - Remarks: String of full path and file name including '.ITM' extension.
##### Returns
BOOLEAN
### Function: RefreshCosts
Refreshes all costs to Item

Call after making any change to the Item that may affect cost.
##### Signature
RefreshCosts()
##### Arguments
##### Returns
VOID
### Function: RemoveHoles
Remove all holes added to Item.

No additional remarks available
##### Signature
RemoveHoles()
##### Arguments
##### Returns
BOOLEAN
### Function: Save
Save an ITM file to disk

No additional remarks available
##### Signature
Save(ItemFile: STRING)
##### Arguments
- **ItemFile** as: STRING
##### Returns
BOOLEAN
### Function: SetFlow
Set Flow Type and Value on an Item.

No additional remarks available
##### Signature
SetFlow(FlowType: NUMBER, FlowValue: NUMBER)
##### Arguments
- **FlowType** as: NUMBER
  - Remarks: Number between 0 and 3. 0='Not Set', 1='Supply', 2='Return', 3='None'
- **FlowValue** as: NUMBER
  - Remarks: Number representing flow value in standard flow units.
##### Returns
BOOLEAN
### Function: Update
Refreshes Item's developments.

Call after making any change to the Item that may developments, specifiction or model
##### Signature
Update()
##### Arguments
##### Returns
VOID
### Function: WriteDXF
Save Item's Developments as DXF File(s).

File to save should exclude the '.DXF' file extension.
Flag for writing Lead Ins/Outs defaults to TRUE if ommited.
Each development is appended with a '-1', '-2', '-3', etc. suffix to the specified file name.
##### Signature
WriteDXF(DXFFile: STRING, [IncludeLeads: BOOLEAN])
##### Arguments
- **DXFFile** as: STRING
  - Remarks: String of full path and file name to export
- **IncludeLeads** as Optional: BOOLEAN
  - Remarks: Optional Boolead Flag indicating if Lead Ins/Outs should be written to DXF.
##### Returns
BOOLEAN
