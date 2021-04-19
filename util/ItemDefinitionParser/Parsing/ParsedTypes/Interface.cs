using System;
using System.Collections.Generic;
using System.Linq;

namespace ItemDefinitionParser.Parsing.ParsedTypes
{
    public class INTERFACE: FabNamedObject, IObjectType
    {
        public override ParseType Type => ParseType.INTERFACE;
        
        public List<METHOD> Methods { get; set; } = new List<METHOD>();
        
        public List<PROPERTY> Properties { get; set; } = new List<PROPERTY>();
        
        public string Link => $"{FabConstants.WikiUrl}{Id}-SubObject.md";
        
        public string AsMarkdown(LanguageLibrary lib)
        {
            return MarkdownGenerator.AsMarkdown(this, lib);
        }

        public void WriteWiki(string path, string content)
        {
            System.IO.File.WriteAllText(path, content);
        }
        
        public void WriteWiki(string path, LanguageLibrary lib)
        {
            WriteWiki(path, AsMarkdown(lib));
        }

        public INTERFACE(ref int i, IList<string> lines)
        {
            List<DOCUMENTATION> comments = new List<DOCUMENTATION>();
            var splitChars = new [] {' ', '{'};
            for (; i < lines.Count; i++)
            {
                string current = lines[i].Trim().ToUpper();
                if (current == "}")
                    break;
                
                if (current.StartsWith("INTERFACE"))
                    Id = current.Split(splitChars, StringSplitOptions.RemoveEmptyEntries)[1];
                else if (current.StartsWith("/*"))
                    comments.Add(new DOCUMENTATION(ref i, lines));
                else if (current.Contains("("))
                    Methods.Add(new METHOD(ref i, lines, comments.Last()));
                else if (!string.IsNullOrWhiteSpace(current) && current.StartsWith("/") == false)
                    Properties.Add(new PROPERTY(ref i, lines, comments.Last()));
            }
        }
        
        
    }
}