using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ItemDefinitionParser
{
    public struct argument
    {
        public string id;
        public string[] types;
        public bool optional;
        public string notes;

        public argument(string pair, DOCUMENTATION info)
        {
            var parts = pair.Split(new char[] { ':', '?' }, StringSplitOptions.RemoveEmptyEntries).Select(p=> p.Trim()).ToList();
            id = parts.Count == 2 ? parts[0].Trim() : "<ERROR>";
            if (id == "<ERROR>")
                System.Diagnostics.Debugger.Break();
            types = parts.Count == 2 ? parts[1].ToUpper().Split(new char[] { ' ', '|' }, StringSplitOptions.RemoveEmptyEntries).ToArray() : new string[] { "ANY" };
            optional = pair.Contains("?");
            notes = "";
            foreach (var item in info.args)
            {
                if (item.id.ToUpper() == id.ToUpper())
                    notes = item.content;
            }
        }

        // used in signatures
        public override string ToString()
        {
            if (optional)
                return "[" + id + ": " + string.Join("|", types) + "]";
            else
                return id + ": " + string.Join("|", types);
        }
    }

    public struct TSDocParam
    {   
        public string id;
        public string content;

        public TSDocParam(string id, string content)
        {
            this.id = id;
            this.content = content;
        }
    }
    
    public class FUNCTION
    {
        private char[] splitchrs = new char[] { ',', '(', ')', '{', '}', ';' };
        public string id { get; set; }
        public string[] returns { get; set; }
        public List<argument> args { get; set; } = new List<argument>();
        public Dictionary<string, object> info { get; set; }
        public FUNCTION(ref int i, List<string> Lines, DOCUMENTATION doc)
        {
            info = doc.toDictionary();
            var root = Lines[i].Trim();
            for (; i < Lines.Count; i++)
                if (Lines[i].Trim().EndsWith("}"))
                    break;
            var parts = root.Replace(" |", "|").Replace("| ", "|").Split(splitchrs, StringSplitOptions.RemoveEmptyEntries).ToList();
            id = parts[0].Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).ToArray()[1];
            returns = parts.Last().Trim(':').Trim().ToUpper().Split('|').Select(p => p.ToUpper()).ToArray();
            for (int k = 1; k < parts.Count - 1; k++)
                args.Add(new argument(parts[k], doc));
        }

        public string toMarkdown(codLibrary lib)
        {
            string result = "## Function: " + id + Environment.NewLine;
            result += (info.ContainsKey("desc") ? info["desc"] : "No description available") + Environment.NewLine + Environment.NewLine;
            result += (info.ContainsKey("remarks") ? info["remarks"] : "No additional remarks available") + Environment.NewLine;
            result += "#### Signature" + Environment.NewLine;
            result += id + "(" + string.Join(", ", args) + ")" + Environment.NewLine;
            result += "#### Arguments" + Environment.NewLine;
            foreach (var item in args)
            {   
                result += "- **" + item.id + (item.optional ? "** as Optional: " : "** as: ") + lib.JOIN(" or ", item.types) + Environment.NewLine;
                foreach (var typ in item.types)
                    if (lib.ENUMS.ContainsKey(typ))
                        foreach (var constant in lib.ENUMS[typ].values)
                            result += "  - " + constant + Environment.NewLine;
                if (item.notes != "")
                    result += "  - " + "Remarks: " + item.notes + Environment.NewLine;
            }
            result += "#### Returns" + Environment.NewLine;
            result += lib.JOIN(" or ", returns) + Environment.NewLine;
            return result;
        }
    }

    public class METHOD
    {
        private char[] splitchrs = new char[] { ',', '(', ')', '{', '}', ';' };        
        public string id { get; set; }
        public string[] returns { get; set; }
        public List<argument> args { get; set; } = new List<argument>();
        public Dictionary<string, object> info { get; set; }
        public METHOD(ref int i, List<string> Lines, DOCUMENTATION doc)
        {
            info = doc.toDictionary();
            var root = Lines[i].Trim();
            var parts = root.Replace(" |", "|").Replace("| ", "|").Split(splitchrs, StringSplitOptions.RemoveEmptyEntries).ToList();
            if (parts[0].ToUpper().Trim().StartsWith("ABSTRACT"))
                parts[0] = parts[0].Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)[1];
            id = parts[0];
            returns = parts.Last().Trim(':').Trim().ToUpper().Split('|').Select(p => p.ToUpper()).ToArray();
            for (int k = 1; k < parts.Count - 1; k++)
                args.Add(new argument(parts[k], doc));
        }


        public string toMarkdown(codLibrary lib)
        {
            string result = "### Function: " + id + Environment.NewLine;
            result += (info.ContainsKey("desc") ? info["desc"] : "No description available") + Environment.NewLine + Environment.NewLine;
            result += (info.ContainsKey("remarks") ? info["remarks"] : "No additional remarks available") + Environment.NewLine;
            result += "##### Signature" + Environment.NewLine;
            result += id + "(" + string.Join(", ", args) + ")" + Environment.NewLine;
            result += "##### Arguments" + Environment.NewLine;
            foreach (var item in args)
            {
                result += "- **" + item.id + (item.optional ? "** as Optional: " : "** as: ") + lib.JOIN(" or ", item.types) + Environment.NewLine;
                foreach (var typ in item.types)
                    if (lib.ENUMS.ContainsKey(typ))
                        foreach (var constant in lib.ENUMS[typ].values)                            
                                result += "  - " + constant + Environment.NewLine;
                if (item.notes != "")
                    result += "  - " + "Remarks: " + item.notes + Environment.NewLine;
            }
            result += "##### Returns" + Environment.NewLine;
            result += lib.JOIN(" or ", returns) + Environment.NewLine;
            return result;
        }
    }

    public class DOCUMENTATION
    {
        private char[] tchars = new char[] { '\t', ' ', '/', '*' };
        public string desc { get; set; } = "";
        public List<TSDocParam> args { get; set; } = new List<TSDocParam>();
        public string returns { get; set; } = "";
        public string remarks { get; set; } = "";
        public bool rw { get; set; } = true;
        public string source { get; set; } = "";
        public DOCUMENTATION(ref int i, List<string> Lines, string source)
        {
            this.source = source;
            for (; i < Lines.Count; i++)
            {
                if (Lines[i].Trim().StartsWith("*/"))
                    break;
                else if (remarks != "")
                    remarks += "\n" + Lines[i].TrimStart(tchars).Trim();
                else if (desc != "")
                {
                    string current = Lines[i].TrimStart(tchars).Trim();
                    string upper = current.ToUpper();
                    if (upper.StartsWith("@PARAM"))
                    {
                        var parts = current.Split(new char[] { ' ' }, 3, StringSplitOptions.RemoveEmptyEntries);
                        if (parts.Length == 3)
                            args.Add(new TSDocParam(parts[1], parts[2]));
                        else if (parts.Length == 2)
                            args.Add(new TSDocParam(parts[1], ""));
                    }
                    else if (upper.StartsWith("@READONLY"))
                        rw = false;
                    else if (upper.StartsWith("@REMARKS"))
                        remarks = current;
                    else if (upper.StartsWith("@RETURNS"))
                        returns = current.Substring(8).Trim();
                }
                else if (Lines[i].Trim(tchars).Length >= 4)
                    desc = Lines[i].Trim(tchars);
            }
            if (remarks != "")
                remarks = remarks.Substring(8).Trim();
        }

        public Dictionary<string, object> toDictionary()
        {
            Dictionary<string, object> result = new Dictionary<string, object>();
            if (desc != "")
                result.Add("desc", desc);
            if (args.Count >= 1)
            {
                Dictionary<string, string> aobj = new Dictionary<string, string>();
                foreach (var item in args)
                    aobj.Add(item.id, item.content);
                result.Add("args", aobj);
            }
            if (returns.Trim() != "")
                result.Add("returns", returns.Trim());
            if (rw == false)
                result.Add("readonly", true);
            if (remarks.Trim() != "")
                result.Add("remarks", remarks.Trim());
            return result;
        }
    }

    public class ENUM
    {
        public string id { get; set; }
        public List<string> values { get; set; } = new List<string>();
        public Dictionary<string, object> info { get; set; }
        public ENUM(ref int i, List<string> Lines, DOCUMENTATION doc)
        {
            doc.rw = false;
            info = doc.toDictionary();
            for (; i < Lines.Count; i++)
            {
                string current = Lines[i].Trim();
                if (current.ToUpper().StartsWith("ENUM"))
                    id = current.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).ToArray()[1];
                else if (current == "}")
                    break;
                else
                    values.Add(current.Split('=')[1].Trim(new char[] { '\'', ' ', ',', ';' }));
            }
        }
    }

    public class CONSTANT
    {   
        public string id { get; set; }
        public string[] returns { get; set; }
        public Dictionary<string, object> info { get; set; }
        public CONSTANT(ref int i, List<string> Lines, DOCUMENTATION doc)
        {
            bool isArray = false;
            var current = Lines[i].Trim().Replace(" |", "|").Replace("| ", "|");
            List<string> parts;
            if (current.Contains("Array<"))
            {
                current = current.Replace("Array<", "").Replace(">", "");
                parts = current.Split(new char[] { ' ', ':', ';' }, StringSplitOptions.RemoveEmptyEntries).ToList();
                isArray = true;
            }
            else
            {
                parts = current.Split(new char[] { ' ', ':', ';' }, StringSplitOptions.RemoveEmptyEntries).ToList();
            }
            if (parts[0].ToUpper() == "LET")
            { 
                parts.RemoveAt(0);
                doc.rw = false;
            }
            info = doc.toDictionary();
            id = parts[0];
            returns = parts[1].Split(new char[] { '|' }, StringSplitOptions.RemoveEmptyEntries).Select(p => p.ToUpper() + (isArray ? "[]" : "")).ToArray();            
        }

        public string toMarkdown(codLibrary lib, bool isChild)
        {
            string result = (isChild ? "### Property: " : "## Property: ") + id + Environment.NewLine;            
            result += (info.ContainsKey("desc") ? info["desc"] : "No description available") + Environment.NewLine + Environment.NewLine;
            result += (info.ContainsKey("remarks") ? info["remarks"] : "No additional remarks available") + Environment.NewLine;            
            result += (isChild ? "##### Returns" : "#### Returns") + Environment.NewLine;
            result += lib.JOIN(" or ", returns) + Environment.NewLine;
            return result;
        }
    }

    public class KEYWORDS
    {
        private char[] tchars = new char[] { '\t', ' ', ',', '\'' };
        public string id { get; set; }
        public List<string> values { get; set; } = new List<string>();
        public KEYWORDS(ref int i, List<string> Lines)
        {
            for (; i < Lines.Count; i++)
            {
                string current = Lines[i].Trim().ToUpper();
                if (current.StartsWith("]"))
                    break;
                else if (current.StartsWith("CONST "))
                    id = current.Split(' ').Where(p => p != "").ToArray()[1].Trim(':');
                else if (current.StartsWith("EXPORT CONST "))
                    id = current.Split(' ').Where(p => p != "").ToArray()[2].Trim(':');
                else if (current.StartsWith("'"))
                    values.Add(current.Trim(tchars));
            }
        }
    }


    public class INTERFACE
    {
        public string id { get; set; } = "";
        public List<METHOD> methods { get; set; } = new List<METHOD>();
        public List<CONSTANT> properties { get; set; } = new List<CONSTANT>();
        public string link { get { return "https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/" + id + "-SubObject.md"; } }

        public INTERFACE(ref int i, List<string> Lines)
        {
            List<DOCUMENTATION> comments = new List<DOCUMENTATION>();
            for (; i < Lines.Count; i++)
            {
                string current = Lines[i].Trim().ToUpper();
                if (current == "}")
                    break;
                else if (current.StartsWith("INTERFACE"))
                    id = current.Split(new char[] { ' ', '{' }, StringSplitOptions.RemoveEmptyEntries).ToList()[1];
                else if (current.StartsWith("/*"))
                    comments.Add(new DOCUMENTATION(ref i, Lines, "INTERFACE"));
                else if (current.StartsWith("INTERFACE") && id != "")
                    System.Diagnostics.Debugger.Break();
                else if (current.Contains("("))
                    methods.Add(new METHOD(ref i, Lines, comments.Last()));
                else if (current != "" && current.StartsWith("/") == false)
                    properties.Add(new CONSTANT(ref i, Lines, comments.Last()));
            }
        }

        public void writeWiki(codLibrary lib, string path)
        {
            string result = "# Sub Object: " + id + Environment.NewLine;
            result += "**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file" + Environment.NewLine;
            result += "## Constructor" + Environment.NewLine;
            result += "This second-class object cannot be directly created. These types of sub-objects are retrieved from first-class object properties" + Environment.NewLine;
            result += "## Properties" + Environment.NewLine;
            result += "The following items are accessed from the base object by a dot notation" + Environment.NewLine;
            foreach (var prop in properties)
                result += prop.toMarkdown(lib, true);
            result += "## Methods" + Environment.NewLine;
            result += "The following items are invoked from the base object by a dot notation" + Environment.NewLine;
            foreach (var meth in methods)
                result += meth.toMarkdown(lib);
            System.IO.File.WriteAllText(path, result);
        }
    }

    public class OBJECT
    {
        public string id { get; set; } = "";
        public METHOD constructor { get; set; } = null;
        public List<METHOD> methods { get; set; } = new List<METHOD>();
        public List<CONSTANT> properties { get; set; } = new List<CONSTANT>();
        public string link { get { return "https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/" + id + "-Object.md"; } }

        public OBJECT(ref int i, List<string> Lines, codLibrary lib)
        {
            List<DOCUMENTATION> comments = new List<DOCUMENTATION>();
            for (; i < Lines.Count; i++)
            {
                string current = Lines[i].Trim().ToUpper();
                if (current == "}")
                    break;
                else if (current.StartsWith("/*"))
                    comments.Add(new DOCUMENTATION(ref i, Lines, "OBJECT"));
                else if (current.StartsWith("ABSTRACT CLASS") && id != "")
                    System.Diagnostics.Debugger.Break();
                else if (current.StartsWith("ABSTRACT CLASS"))
                {
                    var parts = current.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).ToList();
                    id = parts[2];
                    if (parts.Contains("EXTENDS"))
                    {
                        string extype = parts[parts.IndexOf("EXTENDS") + 1];
                        if (lib.OBJECTS.ContainsKey(extype))
                        {
                            methods.AddRange(lib.OBJECTS[extype].methods.ToList());
                            properties.AddRange(lib.OBJECTS[extype].properties.ToList());
                        }
                        if (current.EndsWith("}"))
                            break;
                    }   
                }
                else if (current.Contains("("))
                {
                    var m = new METHOD(ref i, Lines, comments.Last());
                    if (m.id.ToUpper() == "CONSTRUCTOR")
                        constructor = m;
                    else
                        methods.Add(m);
                }   
                else if (current != "" && current.StartsWith("/") == false)
                    properties.Add(new CONSTANT(ref i, Lines, comments.Last()));
            }
        }

        public void writeWiki(codLibrary lib, string path)
        {
            string result = "# Object: " + id + Environment.NewLine;
            result += "**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file" + Environment.NewLine;
            
            result += "## Constructor" + Environment.NewLine;
            if (constructor != null)
            {
                result += (constructor.info.ContainsKey("desc") ? constructor.info["desc"] : "No description available") + Environment.NewLine;
                result += (constructor.info.ContainsKey("remarks") ? constructor.info["remarks"] : "No additional remarks available") + Environment.NewLine;
                result += "#### Signature" + Environment.NewLine;
                result += "New " + id + "(" + string.Join(", ", constructor.args) + ")" + Environment.NewLine;
                result += "#### Arguments" + Environment.NewLine;
                foreach (var item in constructor.args)
                {
                    result += "- **" + item.id + (item.optional ? "** as Optional: " : "** as: ") + lib.JOIN(" or ", item.types) + Environment.NewLine;
                    foreach (var typ in item.types)
                        if (lib.ENUMS.ContainsKey(typ))
                            foreach (var constant in lib.ENUMS[typ].values)
                                result += "  - " + constant + Environment.NewLine;
                    if (item.notes != "")
                        result += "  - " + "Remarks: " + item.notes + Environment.NewLine;
                }
            } else
                result += "This first-class object cannot be directly created, but is in fact Static and can be accessed at any time without constructing." + Environment.NewLine;

            result += "## Properties" + Environment.NewLine;
            result += "The following items are accessed from the base object by a dot notation" + Environment.NewLine;
            foreach (var prop in properties)
                result += prop.toMarkdown(lib, true);
            result += "## Methods" + Environment.NewLine;
            result += "The following items are invoked from the base object by a dot notation" + Environment.NewLine;
            foreach (var meth in methods)
                result += meth.toMarkdown(lib);
            System.IO.File.WriteAllText(path, result);
        }
    }


    public class codLibrary
    {
        public Dictionary<string, KEYWORDS> KEYWORDS { get; set; } = new Dictionary<string, KEYWORDS>();
        public Dictionary<string, FUNCTION> FUNCTIONS { get; set; } = new Dictionary<string, FUNCTION>();
        public Dictionary<string, CONSTANT> CONSTANTS { get; set; } = new Dictionary<string, CONSTANT>();
        public Dictionary<string, ENUM> ENUMS { get; set; } = new Dictionary<string, ENUM>();
        public Dictionary<string, INTERFACE> INTERFACES { get; set; } = new Dictionary<string, INTERFACE>();
        public Dictionary<string, OBJECT> OBJECTS { get; set; } = new Dictionary<string, OBJECT>();

        /// Replace Constants
        //"%%%OBJMETHODS%%%",         // Any class or interface function
        //"%%%OBJCOLLECTIONS%%%",     // Any class or interface property that is an Array type
        //"%%%OBJPROPERTIES%%%",      // Anything within a class or interface not meeting the prior 2 criteria
        //"%%%OBJECTS%%%",            // Any class, if no constructor is found then it is assumed static
        //"%%%FUNCTIONS%%%",          // Any function not within a class or interface.
        //"%%%CONSTANTS%%%",          // Any declaration starting with LET
        //"%%%FLOWCONTROL%%%",        // The "const FLOWCONTROL" array
        //"%%%VALUETYPES%%%",         // The "const VALUETYPES" array
        //"%%%SPECIALTYPES%%%"        // The "const SPECIALTYPES" array
        public void ApplyData(string template, string output)
        {
            string source = System.IO.File.ReadAllText(template);
            string targ, items;

            foreach (var kw in KEYWORDS.Keys)
            {
                targ = "%%%" + kw + "%%%";
                if (kw == "VALUETYPES")
                { 
                    var lst = KEYWORDS[kw].values.ToList();
                    foreach (var key in ENUMS.Keys)
                        lst.AddRange(ENUMS[key].values);
                    items = string.Join("|", lst);
                }
                else
                    items = string.Join("|", KEYWORDS[kw].values);
                source = source.Replace(targ, items);
            }

            targ = "%%%FUNCTIONS%%%";
            items = string.Join("|", FUNCTIONS.Keys.Select(p => p.ToUpper()));
            source = source.Replace(targ, items);

            targ = "%%%CONSTANTS%%%";
            items = string.Join("|", CONSTANTS.Keys.Select(p => p.ToUpper()));
            source = source.Replace(targ, items);

            targ = "%%%OBJECTS%%%";
            items = string.Join("|", OBJECTS.Keys.Select(p => p.ToUpper()));
            source = source.Replace(targ, items);

            List<string> meth = new List<string>();
            List<string> coll = new List<string>();
            List<string> prop = new List<string>();
            foreach (var key in OBJECTS.Keys)
            {
                foreach (var item in OBJECTS[key].methods)
                    meth.Add(item.id.ToUpper());
                foreach (var item in OBJECTS[key].properties)
                {
                    if (item.returns.Any(p => p.EndsWith("]")))
                        coll.Add(item.id.ToUpper());
                    else
                        prop.Add(item.id.ToUpper());
                }   
            }
            foreach (var key in INTERFACES.Keys)
            {
                foreach (var item in INTERFACES[key].methods)
                    meth.Add(item.id.ToUpper());
                foreach (var item in INTERFACES[key].properties)
                {
                    if (item.returns.Any(p => p.EndsWith("]")))
                        coll.Add(item.id.ToUpper());
                    else
                        prop.Add(item.id.ToUpper());
                }
            }

            targ = "%%%OBJPROPERTIES%%%";
            prop.Sort();
            items = string.Join("|", prop.Distinct());
            source = source.Replace(targ, items);

            targ = "%%%OBJMETHODS%%%";
            meth.Sort();
            items = string.Join("|", meth.Distinct());
            source = source.Replace(targ, items);

            targ = "%%%OBJCOLLECTIONS%%%";
            coll.Sort();
            items = string.Join("|", coll.Distinct());
            source = source.Replace(targ, items);

            System.IO.File.WriteAllText(output, source);
        }


        public void createWikis(string dir)
        {
            foreach (var item in INTERFACES.Values)
                item.writeWiki(this, dir + item.id + "-SubObject.md");
            foreach (var item in OBJECTS.Values)
                item.writeWiki(this, dir + item.id + "-Object.md");

            string output = "# Global Functions" + Environment.NewLine;
            output += "**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file" + Environment.NewLine;
            foreach (var key in FUNCTIONS.Keys.OrderBy(p => p))
                output += FUNCTIONS[key].toMarkdown(this);
            System.IO.File.WriteAllText(dir + "FUNCTIONS.md", output);

            output = "# Global Constants" + Environment.NewLine;
            output += "**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file" + Environment.NewLine;
            foreach (var key in CONSTANTS.Keys.OrderBy(p => p))
                output += CONSTANTS[key].toMarkdown(this, false);
            System.IO.File.WriteAllText(dir + "CONSTANTS.md", output);
        }


        public string JOIN(string separator, IEnumerable<string> lst)
        {
            var result = string.Join(separator, lst);
            foreach (var item in lst)
                if (INTERFACES.ContainsKey(item.Replace("[]", "").ToUpper()))
                    result = result.Replace(item.Replace("[]", ""), "[" + item.Replace("[]", "") + "](" + "https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/" + item.Replace("[]", "") + "-SubObject.md)");
            return result;
        }


    }

    static class tsParser
    {
        public static codLibrary ExtractLibrary (List<string> Lines)
        {
            codLibrary output = new codLibrary();
            List<DOCUMENTATION> comments = new List<DOCUMENTATION>();
            int i = 0;
            for (; i < Lines.Count; i++)
            {
                string current = Lines[i].Trim().ToUpper();
                if (current.StartsWith("/*"))
                    comments.Add(new DOCUMENTATION(ref i, Lines, "ROOT"));
                else if (current.StartsWith("FUNCTION"))
                {
                    var obj = new FUNCTION(ref i, Lines, comments.Last());
                    output.FUNCTIONS.Add(obj.id, obj);
                }
                else if (current.StartsWith("CONST "))
                {
                    var obj = new KEYWORDS(ref i, Lines);
                    output.KEYWORDS.Add(obj.id, obj);
                }
                else if (current.StartsWith("EXPORT CONST "))
                {
                    var obj = new KEYWORDS(ref i, Lines);
                    output.KEYWORDS.Add(obj.id, obj);
                }
                else if (current.StartsWith("LET "))
                {
                    var obj = new CONSTANT(ref i, Lines, comments.Last());
                    output.CONSTANTS.Add(obj.id, obj);
                }
                else if (current.StartsWith("ENUM"))
                {
                    var obj = new ENUM(ref i, Lines, comments.Last());
                    output.ENUMS.Add(obj.id, obj);
                }
                else if (current.StartsWith("INTERFACE"))
                {
                    var obj = new INTERFACE(ref i, Lines);
                    output.INTERFACES.Add(obj.id, obj);
                }
                else if (current.StartsWith("ABSTRACT CLASS"))
                {
                    var obj = new OBJECT(ref i, Lines, output);
                    output.OBJECTS.Add(obj.id, obj);
                }
            }
            return output;
        }

        


    }

   


}
