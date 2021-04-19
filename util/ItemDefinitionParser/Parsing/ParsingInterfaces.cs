using System;
using System.Collections.Generic;
using System.Linq;
using ItemDefinitionParser.Parsing.ParsedTypes;

namespace ItemDefinitionParser.Parsing
{
    public abstract class FabNamedObject
    {
        [Newtonsoft.Json.JsonProperty("id")]
        public string Id { get; protected set; } = "";
        
        [Newtonsoft.Json.JsonIgnore]
        public abstract ParseType Type { get; }

        // This ToString override exists purely for an enhanced debugging experience
        public override string ToString()
        {
            return $"{Id} of type {Enum.GetName(Type.GetType(), Type)}";
        }

        // This chunk of code was abstracted away from CONSTANT & PROPERTY constructors since it was identical
        protected string[] valueTypeTextInterpreter(string line, DOCUMENTATION doc, out bool isArray)
        {
            string[] result;
            var current = line.Trim().Replace(" |", "|").Replace("| ", "|");
            var separators = new [] { ' ', ':', ';' };
            if (current.Contains("Array<"))
            {
                current = current.Replace("Array<", "").Replace(">", "");
                result = current.Split(separators, StringSplitOptions.RemoveEmptyEntries).ToArray();
                isArray = true;
            }
            else
            {
                result = current.Split(separators, StringSplitOptions.RemoveEmptyEntries).ToArray();
                isArray = false;
            }

            // The TypeScript is slightly goofy in that the Const keyword was used to define category lists
            // of various core COD language native keywords like AND, OR, IF, ELSE, TRUE, FALSE & VOID
            // In this instance, 'Let' was used in the root namespace to denote COD property constants.
            // This made them distinguishable from the core/fundemental COD language constants.
            if (result[0].ToUpper() != "LET") return result;
            
            // Else this must be a root level property constant and should be ReadOnly 
            doc.ReadWrite = false;
            return result.Skip(1).ToArray();
        }
    }

    public interface IValueListType
    {
        [Newtonsoft.Json.JsonProperty("values")]
        List<string> Values { get; }
    }

    public interface IValueType: IMarkdownConverter
    {
        [Newtonsoft.Json.JsonProperty("returns")]
        string[] Returns { get; set; }
        
        [Newtonsoft.Json.JsonProperty("info")]
        Dictionary<string, object> Info { get; set; }
    }

    public interface IMethodType : IValueType
    {
        [Newtonsoft.Json.JsonProperty("args")]
        List<ARGUMENT> Args { get; set; }
    }

    public interface IObjectType: IMarkdownConverter, IWikiWriter
    {
        [Newtonsoft.Json.JsonProperty("methods")]
        List<METHOD> Methods { get; set; }
        
        [Newtonsoft.Json.JsonProperty("properties")]
        List<PROPERTY> Properties { get; set; }
        
        [Newtonsoft.Json.JsonProperty("link")]
        string Link { get; }
    }

    public interface IMarkdownConverter
    {
        string AsMarkdown(LanguageLibrary lib);
    }
    
    public interface IWikiWriter
    {
        void WriteWiki(string path, string content);
        void WriteWiki(string path, LanguageLibrary lib);
    }
    
}