using System;
using System.Collections.Generic;
using System.Linq;

namespace ItemDefinitionParser.Parsing.ParsedTypes
{
    public class OBJECT: FabNamedObject, IObjectType
    {
        public override ParseType Type => ParseType.OBJECT;
        
        [Newtonsoft.Json.JsonProperty("constructor")]
        public METHOD Constructor { get; }
        
        public List<METHOD> Methods { get; set; } = new List<METHOD>();
        
        public List<PROPERTY> Properties { get; set; } = new List<PROPERTY>();
        
        public string Link => $"{FabConstants.WikiUrl}{Id}-Object.md";

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

        public OBJECT(ref int i, IList<string> lines, LanguageLibrary lib)
        {
            List<DOCUMENTATION> comments = new List<DOCUMENTATION>();
            var splitChars = new[] { ' ', '\t' };
            for (; i < lines.Count; i++)
            {
                var current = lines[i].Trim().ToUpper();
                if (current == "}")
                    break;
                
                if (current.StartsWith("/*"))
                    comments.Add(new DOCUMENTATION(ref i, lines));
                else if (current.StartsWith("ABSTRACT CLASS"))
                {
                    var parts = current.Split(splitChars, StringSplitOptions.RemoveEmptyEntries).ToList();
                    Id = parts[2];
                    if (parts.Contains("EXTENDS"))
                    {
                        var exType = parts[parts.IndexOf("EXTENDS") + 1];
                        if (lib.OBJECTS.ContainsKey(exType))
                        {
                            Methods.AddRange(lib.OBJECTS[exType].Methods);
                            Properties.AddRange(lib.OBJECTS[exType].Properties);
                        }
                        if (current.EndsWith("}"))
                            break;
                    }   
                }
                else if (current.Contains("("))
                {
                    var m = new METHOD(ref i, lines, comments.Last());
                    if (m.Id.Equals("CONSTRUCTOR", StringComparison.OrdinalIgnoreCase))
                        Constructor = m;
                    else
                        Methods.Add(m);
                }
                else if (!string.IsNullOrWhiteSpace(current) && current.StartsWith("/") == false)
                    Properties.Add(new PROPERTY(ref i, lines, comments.Last()));
            }
        }
        
        
    }
}