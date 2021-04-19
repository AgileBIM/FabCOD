using System;
using System.Collections.Generic;
using System.Linq;

namespace ItemDefinitionParser.Parsing.ParsedTypes
{
    public class FUNCTION: FabNamedObject, IMethodType
    {
        public override ParseType Type => ParseType.FUNCTION;
        
        public string[] Returns { get; set; }
        
        public List<ARGUMENT> Args { get; set; } = new List<ARGUMENT>();
        
        public Dictionary<string, object> Info { get; set; }
        
        public string AsMarkdown(LanguageLibrary lib)
        {
            return MarkdownGenerator.AsMarkdown(this, lib);
        }
        
        public FUNCTION(ref int i, IList<string> lines, DOCUMENTATION doc)
        {
            Info = doc.toDictionary();
            var root = lines[i].Trim();
            for (; i < lines.Count; i++)
                if (lines[i].Contains("}"))
                    break;
            var splitChars = new [] { ',', '(', ')', '{', '}', ';' };
            var splitWhiteSpace = new[] {' ', '\t'};
            var parts = root.Replace(" |", "|").Replace("| ", "|").Split(splitChars, StringSplitOptions.RemoveEmptyEntries).ToList();
            Id = parts[0].Split(splitWhiteSpace, StringSplitOptions.RemoveEmptyEntries)[1];
            Returns = parts.Last().Trim(':').Trim().ToUpper().Split('|').ToArray();
            for (int k = 1; k < parts.Count - 1; k++)
                Args.Add(new ARGUMENT(parts[k], doc));
        }

        
    }
}