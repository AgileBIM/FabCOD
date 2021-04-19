using System;
using System.Collections.Generic;
using System.Linq;
using ItemDefinitionParser.Parsing.ParsedTypes;

namespace ItemDefinitionParser.Parsing
{
    
    // This very basic TypeScript parser exists only to centralize documentation and extract
    // the structural data about the Fabrication COD language. We intentionally documented the
    // Fabrication COD Language with TypeScript for the purpose of recycling for a future fully
    // synthetic VSCode mock debugger.
    // This parser cannot be used to actually interpret TypeScript. 
    
    internal static class TypeScriptParser
    {
        internal static LanguageLibrary BuildLanguageLibrary (IList<string> tsLines)
        {
            var output = new LanguageLibrary();
            var comments = new List<DOCUMENTATION>();
            var i = 0;
            for (; i < tsLines.Count; i++)
            {
                var current = tsLines[i].Trim();
                if (current.StartsWith("/*"))
                    comments.Add(new DOCUMENTATION(ref i, tsLines));
                else if (current.StartsWith("FUNCTION", StringComparison.OrdinalIgnoreCase))
                {
                    var obj = new FUNCTION(ref i, tsLines, comments.Last());
                    output.FUNCTIONS.Add(obj.Id, obj);
                }
                else if (current.StartsWith("CONST ", StringComparison.OrdinalIgnoreCase) 
                         || current.StartsWith("EXPORT CONST ", StringComparison.OrdinalIgnoreCase))
                {
                    var obj = new KEYWORDS(ref i, tsLines);
                    output.KEYWORDS.Add(obj.Id, obj);
                }
                else if (current.StartsWith("LET ", StringComparison.OrdinalIgnoreCase))
                {
                    var obj = new CONSTANT(ref i, tsLines, comments.Last());
                    output.CONSTANTS.Add(obj.Id, obj);
                }
                else if (current.StartsWith("ENUM", StringComparison.OrdinalIgnoreCase))
                {
                    var obj = new ENUM(ref i, tsLines, comments.Last());
                    output.ENUMS.Add(obj.Id, obj);
                }
                else if (current.StartsWith("INTERFACE", StringComparison.OrdinalIgnoreCase))
                {
                    var obj = new INTERFACE(ref i, tsLines);
                    output.INTERFACES.Add(obj.Id, obj);
                }
                else if (current.StartsWith("ABSTRACT CLASS", StringComparison.OrdinalIgnoreCase))
                {
                    var obj = new OBJECT(ref i, tsLines, output);
                    output.OBJECTS.Add(obj.Id, obj);
                }
            }
            return output;
        }
    }
}