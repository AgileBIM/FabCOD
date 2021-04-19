using System;
using System.Linq;

namespace ItemDefinitionParser.Parsing.ParsedTypes
{

    // An Argument is only used in the literal sense; IE, for FUNCTION & METHOD definitions
    public class ARGUMENT : FabNamedObject
    {
        public override ParseType Type => ParseType.ARGUMENT;
        
        [Newtonsoft.Json.JsonProperty("types")]
        public string[] Types { get; }
        
        [Newtonsoft.Json.JsonProperty("optional")]
        public bool Optional { get; }
        
        [Newtonsoft.Json.JsonProperty("notes")]
        public string Notes { get; }
        
        // This replicates what the FabCOD extension would show and only exists to enhance our debugging experience
        public override string ToString()
        {
            return Optional 
                ? $"[{Id}: {string.Join("|", Types)}]" 
                : $"{Id}: {string.Join("|", Types)}";
        }

        public ARGUMENT(string pair, DOCUMENTATION info)
        {
            var splitChar1 = new [] {':', '?'};
            var splitChar2 = new [] {' ', '|'};
            var parts = pair.Split(splitChar1, StringSplitOptions.RemoveEmptyEntries).Select(p=> p.Trim()).ToList();
            Id = parts.Count == 2 ? parts[0].Trim() : "<ERROR>";
            
            #if DEBUG
            if (Id == "<ERROR>")
                System.Diagnostics.Debugger.Break();
            #endif
            
            Types = parts.Count == 2 ? parts[1].ToUpper().Split(splitChar2, StringSplitOptions.RemoveEmptyEntries).ToArray() : new [] { "ANY" };
            Optional = pair.Contains("?");
            Notes = "";
            foreach (var item in info.Args)
            {
                if (item.Key.ToUpper() == Id.ToUpper())
                    Notes = item.Value;
            }
        }
        
    }
}