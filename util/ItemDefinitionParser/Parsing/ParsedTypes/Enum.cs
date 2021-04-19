using System;
using System.Collections.Generic;
using System.Linq;

namespace ItemDefinitionParser.Parsing.ParsedTypes
{
    // The way the FabricationDefinition.ts file was designed. An ENUM are relatively accurate to the 
    // accepted paradigm. They themselves may or may not be global constants and the FabCOD markdown
    // implementation is to document them inline with each place they are used rather than summarized
    // together. This is why there is no direct C# markdown representation of Enums.
    public class ENUM : FabNamedObject, IValueListType
    {
        public override ParseType Type => ParseType.ENUM;
    
        public List<string> Values { get; } = new List<string>();
    
        public ENUM(ref int i, IList<string> lines, DOCUMENTATION doc)
        {
            doc.ReadWrite = false;
            var splitChar1 = new [] {' '};
            var splitChar2 = new [] {'='};
            var trimChars = new [] {'\'', ' ', ',', ';'};
            for (; i < lines.Count; i++)
            {
                string current = lines[i].Trim();
                if (current.ToUpper().StartsWith("ENUM"))
                    Id = current.Split(splitChar1, StringSplitOptions.RemoveEmptyEntries).ToArray()[1];
                else if (current == "}")
                    break;
                else
                    Values.Add(current.Split(splitChar2, StringSplitOptions.RemoveEmptyEntries)[1].Trim(trimChars));
            }
        }
        
    }
    
}