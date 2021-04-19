using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using ItemDefinitionParser.Parsing.ParsedTypes;

namespace ItemDefinitionParser.Parsing
{
    internal static class MarkdownGenerator
    {
        
        internal static string AsMarkdown(FabNamedObject source, LanguageLibrary lib)
        {
            switch (source.Type)
            {
                //#region These types are handled inline or otherwise not intended for use with Markdown generation
                //case ParseType.ARGUMENT:
                //case ParseType.KEYWORD:
                //case ParseType.ENUM:
                //#endregion
                case ParseType.CONSTANT://OR
                case ParseType.PROPERTY:
                    return CreateConstantMarkdown(source, lib);
                case ParseType.FUNCTION://OR
                case ParseType.METHOD:
                    return CreateFunctionMarkdown(source, lib);
                case ParseType.INTERFACE:
                    return CreateInterfaceMarkdown(source, lib);
                case ParseType.OBJECT:
                    return CreateObjectMarkdown(source, lib);
                default:
                    return $"No processing took place for {source.Id} of type {Enum.GetName(source.GetType(), source.Type)}";
            }
        }

        private static string CreateObjectMarkdown(FabNamedObject source, LanguageLibrary lib)
        {
            if (!(source is OBJECT objectType))
                return $"#Error converting {source.Id} to markdown!";

            return new StringBuilder()
                .Append($"# Object: {objectType.Id}")
                .Append(Environment.NewLine)
                .Append(FabConstants.SourceWarning)
                .Append(Environment.NewLine)
                .Append("## Constructor")
                .Append(Environment.NewLine)
                .Append(objectType.Constructor != null ? CreateConstructorMarkdown(objectType.Constructor, lib, objectType.Id)
                    : $"This first-class object cannot be directly created, but is Static and can be used at any time without constructing.{Environment.NewLine}")
                .Append("## Properties")
                .Append(Environment.NewLine)
                .Append(FabConstants.AccessNote)
                .Append(Environment.NewLine)
                .Append(string.Join("", objectType.Properties.Select(p => p.AsMarkdown(lib))))
                .Append("## Methods")
                .Append(Environment.NewLine)
                .Append(FabConstants.InvokeNote)
                .Append(Environment.NewLine)
                .Append(string.Join("", objectType.Methods.Select(m => m.AsMarkdown(lib))))
                .ToString();
        }

        private static string CreateInterfaceMarkdown(FabNamedObject source, LanguageLibrary lib)
        {
            if (!(source is INTERFACE objectType))
                return $"#Error converting {source.Id} to markdown!";
            
            return new StringBuilder()
                .Append($"# Sub Object: {objectType.Id}")
                .Append(Environment.NewLine)
                .Append(FabConstants.SourceWarning)
                .Append(Environment.NewLine)
                .Append("## Constructor")
                .Append(Environment.NewLine)
                .Append("This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties")
                .Append(Environment.NewLine)
                .Append("## Properties")
                .Append(Environment.NewLine)
                .Append(FabConstants.AccessNote)
                .Append(Environment.NewLine)
                .Append(string.Join("", objectType.Properties.Select(p => p.AsMarkdown(lib))))
                .Append("## Methods")
                .Append(Environment.NewLine)
                .Append(FabConstants.InvokeNote)
                .Append(Environment.NewLine)
                .Append(string.Join("", objectType.Methods.Select(m => m.AsMarkdown(lib))))
                .ToString();
        }
        

        private static string CreateConstantMarkdown(FabNamedObject source, LanguageLibrary lib)
        {
            if (!(source is IValueType valueType))
                return $"#Error converting {source.Id} to markdown!";
            
            var isChild = source.Type == ParseType.PROPERTY;
            return new StringBuilder()
                .Append(isChild ? $"### Property: {source.Id}" : $"## Property: {source.Id}")
                .Append(Environment.NewLine)
                .Append(valueType.Info.ContainsKey("desc") ? valueType.Info["desc"] : "No description available")
                .Append(Environment.NewLine)
                .Append(Environment.NewLine)
                .Append(valueType.Info.ContainsKey("remarks") ? valueType.Info["remarks"] : "No additional remarks available")
                .Append(Environment.NewLine)
                .Append(isChild ? $"##### Returns" : "#### Returns")
                .Append(Environment.NewLine)
                .Append(LinkedJoin(lib, " or ", valueType.Returns))
                .Append(Environment.NewLine)
                .ToString();
        }

        
        private static string CreateConstructorMarkdown(FabNamedObject source, LanguageLibrary lib, string objectName)
        {
            if (!(source is IMethodType methodType))
                return $"#Error converting {source.Id} to markdown!";
            
            if (source.Id.ToUpper() != "CONSTRUCTOR")
                return "";
            
            var separator = ", ";
            var initHeader = "##";
            return new StringBuilder()
                .Append(methodType.Info.ContainsKey("desc") ? methodType.Info["desc"] : "No description available")
                .Append(Environment.NewLine)
                .Append(methodType.Info.ContainsKey("remarks") ? methodType.Info["remarks"] : "No additional remarks available")
                .Append(Environment.NewLine)
                .Append($"{initHeader}## Signature")
                .Append(Environment.NewLine)
                .Append($"New {objectName}({string.Join(separator, methodType.Args)})")
                .Append(Environment.NewLine)
                .Append($"{initHeader}## Arguments")
                .Append(Environment.NewLine)
                .Append(CreateArgsBlock(methodType.Args, lib))
                .ToString();
        }

        private static string CreateFunctionMarkdown(FabNamedObject source, LanguageLibrary lib)
        {
            if (!(source is IMethodType methodType))
                return $"#Error converting {source.Id} to markdown!";
            
            var separator = ", ";
            var isConstructor = source.Id.ToUpper() == "CONSTRUCTOR";
            var initHeader = source.Type == ParseType.METHOD && !isConstructor ? "###" : "##";
            return new StringBuilder()
                .Append($"{initHeader} Function: {source.Id}")
                .Append(Environment.NewLine)
                .Append(methodType.Info.ContainsKey("desc") ? methodType.Info["desc"] : "No description available")
                .Append(Environment.NewLine)
                .Append(Environment.NewLine)
                .Append(methodType.Info.ContainsKey("remarks") ? methodType.Info["remarks"] : "No additional remarks available")
                .Append(Environment.NewLine)
                .Append($"{initHeader}## Signature")
                .Append(Environment.NewLine)
                .Append($"{source.Id}({string.Join(separator, methodType.Args)})")
                .Append(Environment.NewLine)
                .Append($"{initHeader}## Arguments")
                .Append(Environment.NewLine)
                .Append(CreateArgsBlock(methodType.Args, lib))
                .Append($"{initHeader}## Returns")
                .Append(Environment.NewLine)
                .Append(LinkedJoin(lib, " or ", methodType.Returns))
                .Append(Environment.NewLine)
                .ToString();
        }
        
        private static string CreateArgsBlock(IList<ARGUMENT> args, LanguageLibrary lib)
        {
            if (args == null || args.Count == 0)
                return "";
            
            var sb = new StringBuilder();
            foreach (var item in args)
            {
                sb.Append($"- **{item.Id}");
                sb.Append(item.Optional ? "** as Optional: " : "** as: ");
                sb.Append(LinkedJoin(lib, " or ", item.Types));
                sb.Append(Environment.NewLine);
                
                foreach (var typ in item.Types)
                    if (lib.ENUMS.ContainsKey(typ))
                        foreach (var constant in lib.ENUMS[typ].Values)
                            sb.Append($"  - {constant}").Append(Environment.NewLine);

                if (item.Notes != "")
                    sb.Append($"  - Remarks: {item.Notes}").Append(Environment.NewLine);
            }
            return sb.ToString();
        }

        
        private static string LinkedJoin(LanguageLibrary lib, string separator, IList<string> entries)
        {
            var result = string.Join(separator, entries);
            foreach (var item in entries)
            {
                var name = item.Replace("[]", "");
                if (lib.INTERFACES.ContainsKey(name))
                    result = result.Replace(name,$"[{name}]({lib.INTERFACES[name].Link})");
            }
            return result;
        }
        
    }
}