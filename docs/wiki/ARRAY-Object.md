# Object: ARRAY
**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file
## Constructor
Constructs an Array Object
Constructs an Array object with the number of inital elements as specified. Each element's
value will be NULL/False.
If optional NumberOfItems is not specifcied, a default value of 0 (zero) is used.
#### Signature
New ARRAY([NumberOfItems: NUMBER])
#### Arguments
- **NumberOfItems** as Optional: NUMBER
  - Remarks: Optional Number of items to initialize Array Object to hold.
## Properties
The following items are accessed from the base object by a dot notation
### Property: Count
Get/Set the Number of elements in the array of the ARRAY Object.

If changed, new elements are set to NULL/False
##### Returns
NUMBER
## Methods
The following items are invoked from the base object by a dot notation
### Function: Add
Adds/appends the specified data items to an array.

No additional remarks available
##### Signature
Add(ArrayData: ANY[])
##### Arguments
- **ArrayData** as: ANY[]
##### Returns
NUMBER
### Function: Delete
Removes the specified item from an array.

Index is a '1-based' meaning the first item in the Array is index # 1.
Default when ArrayIndex is missing is the last item in the Array.
Array is dynamically resized, removing an item from the beginning or middle of the array
results in the array being smaller and the other elements moving up in position.
##### Signature
Delete([ArrayIndex: NUMBER])
##### Arguments
- **ArrayIndex** as Optional: NUMBER
  - Remarks: Optional Number specifying the index number of the element to remove from the array.
##### Returns
BOOLEAN
### Function: Insert
Inserts a piece of data into an Array at specified index.

When inserting data into an Array at a sepecific index, the previous data and all other
downstream data are shifed down in the index chain.
Default when ArrayIndex is missing is to insert at the end of the array.
##### Signature
Insert(ArrayData: ANY, [ArrayIndex: NUMBER])
##### Arguments
- **ArrayData** as: ANY
  - Remarks: Any type of data to insert into an array.
- **ArrayIndex** as Optional: NUMBER
##### Returns
BOOLEAN
