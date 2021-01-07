# Object: ARRAY
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
Constructs an Array Object
No additional remarks available
#### Signature
New ARRAY([NumberOfItems: NUMBER])
#### Arguments
- **NumberOfItems** as Optional: NUMBER
  - Remarks: Optional Number of items to initialize Array Object to hold.
## Properties
The following items are accessed from the base object by a dot notation
### Property: Count
Get/Set the Number of elements in the array of the ARRAY Object.
No additional remarks available
##### Returns
NUMBER
## Methods
The following items are invoked from the base object by a dot notation
### Add
Adds/appends the specified data items to an array.
No additional remarks available
##### Signature
Add(ArrayData: ANY[])
##### Arguments
- **ArrayData** as: ANY[]
##### Returns
NUMBER
### Delete
Removes the specified item from an array.
No additional remarks available
##### Signature
Delete([ArrayIndex: NUMBER])
##### Arguments
- **ArrayIndex** as Optional: NUMBER
  - Remarks: Optional Number specifying the index number of the element to remove from the array.
##### Returns
BOOLEAN
### Insert
Inserts a piece of data into an Array at specified index.
No additional remarks available
##### Signature
Insert(ArrayData: ANY, [ArrayIndex: NUMBER])
##### Arguments
- **ArrayData** as: ANY
  - Remarks: Any type of data to insert into an array.
- **ArrayIndex** as Optional: NUMBER
##### Returns
BOOLEAN
