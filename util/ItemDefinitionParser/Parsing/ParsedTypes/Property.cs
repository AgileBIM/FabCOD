using System;
using System.Collections.Generic;
using System.Linq;

namespace ItemDefinitionParser.Parsing.ParsedTypes
{
    public class PROPERTY : FabNamedObject, IValueType
    {
        public override ParseType Type => ParseType.PROPERTY;
        
        public string[] Returns { get; set; }
        
        public Dictionary<string, object> Info { get; set; }
        
        public string AsMarkdown(LanguageLibrary lib)
        {
            return MarkdownGenerator.AsMarkdown(this, lib);
        }
        
        public PROPERTY(ref int i, IList<string> lines, DOCUMENTATION doc)
        {
            var parts = valueTypeTextInterpreter(lines[i], doc, out var isArray);
            Info = doc.toDictionary();
            Id = parts[0];
            var suffix = isArray ? "[]" : "";
            Returns = parts[1].Split("|".ToCharArray(), StringSplitOptions.RemoveEmptyEntries).Select(p => $"{p.ToUpper()}{suffix}").ToArray();             
        }

    }
}