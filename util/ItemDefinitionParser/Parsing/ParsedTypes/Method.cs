using System;
using System.Collections.Generic;
using System.Linq;

namespace ItemDefinitionParser.Parsing.ParsedTypes
{
    public class METHOD: FabNamedObject, IMethodType
    {       
        public override ParseType Type => ParseType.METHOD;
        
        public string[] Returns { get; set; }
        
        public List<ARGUMENT> Args { get; set; } = new List<ARGUMENT>();
        
        public Dictionary<string, object> Info { get; set; }
        
        public string AsMarkdown(LanguageLibrary lib)
        {
            return MarkdownGenerator.AsMarkdown(this, lib);
        }
        
        public METHOD(ref int i, IList<string> lines, DOCUMENTATION doc)
        {
            Info = doc.toDictionary();
            var root = lines[i].Trim();
            var splitChars = new [] { ',', '(', ')', '{', '}', ';' }; 
            var parts = root.Replace(" |", "|").Replace("| ", "|").Split(splitChars, StringSplitOptions.RemoveEmptyEntries).ToList();
            if (parts[0].ToUpper().Trim().StartsWith("ABSTRACT"))
                parts[0] = parts[0].Split(new [] { ' ' }, StringSplitOptions.RemoveEmptyEntries)[1];
            Id = parts[0];
            Returns = parts.Last().Trim(':').Trim().ToUpper().Split('|').Select(p => p.ToUpper()).ToArray();
            for (int k = 1; k < parts.Count - 1; k++)
                Args.Add(new ARGUMENT(parts[k], doc));
        }

    }
}