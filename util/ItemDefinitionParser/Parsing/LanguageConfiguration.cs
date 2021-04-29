using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ItemDefinitionParser.Parsing
{
    
    // This class passively adds even more value to the centralized TypeScript definitions of
    // the Fabrication COD Language. Currently supporting these processes:
    //      dynamically building all the VSCode keyword coloring groups
    //      generates pretty user-centric documentation from the TypeScript dev-centric documentation 
    
    internal static class LanguageConfiguration
    {
        
        // This function facilitates the generation of the Wiki documentation
        // as defined by the TypeScript Fabrication COD Language schema.
        internal static void GenerateAllWikis(LanguageLibrary lib, string localWikiDirectory)
        {
            // You may notice that the KEYWORDS & ENUMS LanguageLibrary dictionaries are missing
            // from this generation process. Enums are specifically documented inline with the
            // functions that depend on them and Keywords are fundamental structural items that
            // will be handled in the non-generated "getting started" tutorials; working as intended.

            var sbFunctions = new StringBuilder()
                .Append("# Global Functions")
                .Append(Environment.NewLine)
                .Append(FabConstants.SourceWarning)
                .Append(Environment.NewLine);
            foreach (var key in lib.FUNCTIONS.Keys.OrderBy(p => p))
                sbFunctions.Append(lib.FUNCTIONS[key].AsMarkdown(lib));
            

            var sbConstants = new StringBuilder()
                .Append("# Global Constants")
                .Append(Environment.NewLine)
                .Append(FabConstants.SourceWarning)
                .Append(Environment.NewLine);
            foreach (var key in lib.CONSTANTS.Keys.OrderBy(p => p))
                sbConstants.Append(lib.CONSTANTS[key].AsMarkdown(lib));
            
            
            System.IO.File.WriteAllText($"{localWikiDirectory}FUNCTIONS.md", sbFunctions.ToString());
            System.IO.File.WriteAllText($"{localWikiDirectory}CONSTANTS.md", sbConstants.ToString());
            
            
            foreach (var item in lib.INTERFACES.Values)
                item.WriteWiki($"{localWikiDirectory}{item.Id}-SubObject.md", lib);
            
            
            foreach (var item in lib.OBJECTS.Values)
                item.WriteWiki($"{localWikiDirectory}{item.Id}-Object.md", lib);
            
        }
        
        
        
        
        
        
        // GenerateTextMateColoringJson() is responsible for converting our TextMate coloring template file into an
        //                                official release/functional version based almost entirely on the Fabrication
        //                                COD TypeScript definition file.
        //
        // Replaceable Constant Targets
        // ------------------------------------------------------------------------------------------------------
        //"%%%OBJMETHODS%%%",         // Any class or interface defined function
        //"%%%OBJCOLLECTIONS%%%",     // Any class or interface property that is an Array type
        //"%%%OBJPROPERTIES%%%",      // Anything within a class or interface not meeting the prior 2 criteria
        //"%%%OBJECTS%%%",            // Any class, if no constructor is found then it is assumed static
        //"%%%FUNCTIONS%%%",          // Any function not within a class or interface. IE, globally available
        //"%%%CONSTANTS%%%",          // Any declaration starting with LET, IE globally available and not categorized under an Enum Group 
        //"%%%FLOWCONTROL%%%",        // The "const FLOWCONTROL" array, primitives keywords like IF, ELSE, WHILE
        //"%%%VALUETYPES%%%",         // The "const VALUETYPES" array, primitive keywords like TRUE, FALSE, NULL & true Enum names
        //"%%%SPECIALTYPES%%%"        // The "const SPECIALTYPES" array, primitive keywords like AND, OR, DIM, NEW
        
        internal static void GenerateTextMateColoringJson(LanguageLibrary lib, string templatePath, string productionPath)
        {
            string source = System.IO.File.ReadAllText(templatePath);
            string target, items;

            foreach (var kw in lib.KEYWORDS.Keys)
            {
                target = $"%%%{kw}%%%";
                if (kw == "VALUETYPES")
                { 
                    var lst = lib.KEYWORDS[kw].Values.ToList();
                    foreach (var key in lib.ENUMS.Keys)
                        lst.AddRange(lib.ENUMS[key].Values);
                    items = string.Join("|", lst);
                }
                else
                    items = string.Join("|", lib.KEYWORDS[kw].Values);
                source = source.Replace(target, items);
            }

            target = "%%%FUNCTIONS%%%";
            items = string.Join("|", lib.FUNCTIONS.Keys.Select(p => p.ToUpper()));
            source = source.Replace(target, items);

            target = "%%%CONSTANTS%%%";
            items = string.Join("|", lib.CONSTANTS.Keys.Select(p => p.ToUpper()));
            source = source.Replace(target, items);

            target = "%%%OBJECTS%%%";
            items = string.Join("|", lib.OBJECTS.Keys.Select(p => p.ToUpper()));
            source = source.Replace(target, items);

            var meth = new List<string>();
            var coll = new List<string>();
            var prop = new List<string>();
            foreach (var key in lib.OBJECTS.Keys)
            {
                foreach (var item in lib.OBJECTS[key].Methods)
                    meth.Add(item.Id.ToUpper());
                foreach (var item in lib.OBJECTS[key].Properties)
                {
                    if (item.Returns.Any(p => p.EndsWith("]")))
                        coll.Add(item.Id.ToUpper());
                    else
                        prop.Add(item.Id.ToUpper());
                }   
            }
            foreach (var key in lib.INTERFACES.Keys)
            {
                foreach (var item in lib.INTERFACES[key].Methods)
                    meth.Add(item.Id.ToUpper());
                foreach (var item in lib.INTERFACES[key].Properties)
                {
                    if (item.Returns.Any(p => p.EndsWith("]")))
                        coll.Add(item.Id.ToUpper());
                    else
                        prop.Add(item.Id.ToUpper());
                }
            }

            target = "%%%OBJPROPERTIES%%%";
            prop.Sort();
            items = string.Join("|", prop.Distinct());
            source = source.Replace(target, items);

            target = "%%%OBJMETHODS%%%";
            meth.Sort();
            items = string.Join("|", meth.Distinct());
            source = source.Replace(target, items);

            target = "%%%OBJCOLLECTIONS%%%";
            coll.Sort();
            items = string.Join("|", coll.Distinct());
            source = source.Replace(target, items);

            System.IO.File.WriteAllText(productionPath, source);
        }
        
    }
}