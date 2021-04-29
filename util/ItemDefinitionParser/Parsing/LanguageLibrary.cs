using System.Collections.Generic;
using ItemDefinitionParser.Parsing.ParsedTypes;


namespace ItemDefinitionParser.Parsing
{
    
    // This class exists primarily for the purpose of holding data to be used (as a JSON object) within
    // the Fabrication COD Language Extension.
    
    public class LanguageLibrary
    {
        public Dictionary<string, KEYWORDS> KEYWORDS { get; set; } = new Dictionary<string, KEYWORDS>();
        public Dictionary<string, FUNCTION> FUNCTIONS { get; set; } = new Dictionary<string, FUNCTION>();
        public Dictionary<string, CONSTANT> CONSTANTS { get; set; } = new Dictionary<string, CONSTANT>();
        public Dictionary<string, ENUM> ENUMS { get; set; } = new Dictionary<string, ENUM>();
        public Dictionary<string, INTERFACE> INTERFACES { get; set; } = new Dictionary<string, INTERFACE>();
        public Dictionary<string, OBJECT> OBJECTS { get; set; } = new Dictionary<string, OBJECT>();
    }
}