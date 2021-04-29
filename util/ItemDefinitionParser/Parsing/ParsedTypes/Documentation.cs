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

                var current = lines[i].TrimStart(trimChars).Trim();
                if (!string.IsNullOrEmpty(Remarks))
                    // This only works because we've standardized on remarks being the last part of our TSDoc
                    // to do this properly we would have to first remove check to see if a new @ type started
                    Remarks += $"{Environment.NewLine}{current}";
                else if (!string.IsNullOrWhiteSpace(Description))
                {
                    // Again, a process special rule makes this work because we standardized around implied
                    // or non-tagged descriptions appearing as the first item and was restricted to 1 line
                    if (current.StartsWith("@PARAM", StringComparison.OrdinalIgnoreCase))
                    {
                        var parts = current.Split(splitChars, 3, StringSplitOptions.RemoveEmptyEntries);
                        if (parts.Length == 3)
                            Args.Add(parts[1], parts[2]);
                        else if (parts.Length == 2)
                            Args.Add(parts[1], "");
                    }
                    else if (current.StartsWith("@READONLY", StringComparison.OrdinalIgnoreCase))
                        ReadWrite = false;
                    else if (current.StartsWith("@REMARKS", StringComparison.OrdinalIgnoreCase))
                        Remarks = current;
                    else if (current.StartsWith("@RETURNS", StringComparison.OrdinalIgnoreCase))
                        Returns = current.Substring(8).Trim();
                }
                else if (current.Length >= 4)
                    Description = current;
            }
            
            if (!string.IsNullOrWhiteSpace(Remarks))
                Remarks = Remarks.Substring(8).Trim();
        }

        // This produces the output for TypeScript to USE in the actual FabCOD extension.
        // Interfaces in the FabCOD extension handle the "possible" existence of a property. 
        // Purpose: Reduces the JSON size by excluding redundant things that simply don't apply.
        public Dictionary<string, object> toDictionary()
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            if (!string.IsNullOrWhiteSpace(Description))
                result.Add("desc", Description);
            
            if (Args.Count >= 1)
                result.Add("args", Args);
            
            if (!string.IsNullOrWhiteSpace(Returns))
                result.Add("returns", Returns.Trim());
            
            if (ReadWrite == false)
                result.Add("readonly", true);
            
            if (!string.IsNullOrWhiteSpace(Remarks))
                result.Add("remarks", Remarks.Trim());
            return result;
        }
    }
}