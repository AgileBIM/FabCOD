using System;
using System.Collections.Generic;

namespace ItemDefinitionParser.Parsing.ParsedTypes
{
    
    // This is the only parsed type that is NOT inheriting FabNamedObject
    // This type is frequently used by all the other types to enhance their own
    // value output, but is otherwise just representing TypeScript decorations
    
    public class DOCUMENTATION
    {
        private string Description { get; }
        
        private string Returns { get; }
        
        private string Remarks { get; }
        
        public Dictionary<string, string> Args { get; } = new Dictionary<string, string>();
        
        public bool ReadWrite { get; set; } = true;
        
        public DOCUMENTATION(ref int i, IList<string> lines)
        {
            Description = Returns = Remarks = "";
            var trimChars = new [] { '\t', ' ', '/', '*' };
            var splitChars = new [] {' '};
            for (; i < lines.Count; i++)
            {
                if (lines[i].Trim().StartsWith("*/"))
                    break;

                if (Remarks != "")
                    Remarks += $"{Environment.NewLine}{lines[i].TrimStart(trimChars).Trim()}";
                else if (Description != "")
                {
                    string current = lines[i].TrimStart(trimChars).Trim();
                    string upper = current.ToUpper();
                    if (upper.StartsWith("@PARAM"))
                    {
                        var parts = current.Split(splitChars, 3, StringSplitOptions.RemoveEmptyEntries);
                        if (parts.Length == 3)
                            Args.Add(parts[1], parts[2]);
                        else if (parts.Length == 2)
                            Args.Add(parts[1], "");
                    }
                    else if (upper.StartsWith("@READONLY"))
                        ReadWrite = false;
                    else if (upper.StartsWith("@REMARKS"))
                        Remarks = current;
                    else if (upper.StartsWith("@RETURNS"))
                        Returns = current.Substring(8).Trim();
                }
                else if (lines[i].Trim(trimChars).Length >= 4)
                    Description = lines[i].Trim(trimChars);
            }
            if (Remarks != "")
                Remarks = Remarks.Substring(8).Trim();
        }

        // This produces the output for TypeScript to USE in the actual FabCOD extension.
        // Interfaces in the FabCOD extension handle the "possible" existence of a property. 
        // Purpose: Reduces the JSON size by excluding redundant things that simply don't apply.
        public Dictionary<string, object> toDictionary()
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            if (Description != "")
                result.Add("desc", Description);
            if (Args.Count >= 1)
                result.Add("args", Args);
            if (Returns.Trim() != "")
                result.Add("returns", Returns.Trim());
            if (ReadWrite == false)
                result.Add("readonly", true);
            if (Remarks.Trim() != "")
                result.Add("remarks", Remarks.Trim());
            return result;
        }
    }
}