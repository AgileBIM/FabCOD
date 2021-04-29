using System;
using System.Collections.Generic;
using System.Linq;

namespace ItemDefinitionParser.Parsing.ParsedTypes
{
    // The way the FabricationDefinition.ts file was designed. A Keyword represents extremely core language
    // constructs such as IF, THEN, ELSE, TRUE, FALSE, AND, OR, WHILE, etcetera
    // These features are documented in the non-generated wiki and do not have C# markdown representations
    public class KEYWORDS : FabNamedObject, IValueListType
    {
        public override ParseType Type => ParseType.KEYWORD;
        
        public List<string> Values { get; } = new List<string>();
        
        public KEYWORDS(ref int i, IList<string> lines)
        {
            var trimChars = new [] { '\t', ' ', ',', '\'' };
            var splitChars = new [] {' '};
            for (; i < lines.Count; i++)
            {
                var current = lines[i].Trim().ToUpper();
                if (current.StartsWith("]"))
                    break;
                
                if (current.StartsWith("CONST "))
                    Id = current.Split(splitChars, StringSplitOptions.RemoveEmptyEntries)[1].Trim(':');
                else if (current.StartsWith("EXPORT CONST "))
                    Id = current.Split(splitChars, StringSplitOptions.RemoveEmptyEntries)[2].Trim(':');
                else if (current.StartsWith("'"))
                    // we standardized around using single quotes for our values
                    Values.Add(current.Trim(trimChars));
            }
        }

        
    }
}