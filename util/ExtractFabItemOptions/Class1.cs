using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using Autodesk.AutoCAD.ApplicationServices;
using Autodesk.AutoCAD.DatabaseServices;
using Autodesk.AutoCAD.EditorInput;
using Autodesk.AutoCAD.Runtime;
using Autodesk.AutoCAD.Geometry;
using Autodesk.Fabrication;

[assembly: ExtensionApplication(typeof(ExtractFabItemOptions.FabCOD_ini))]
[assembly: CommandClass(typeof(ExtractFabItemOptions.FabCOD_commands))]

namespace ExtractFabItemOptions
{
    //Initialization
    public class FabCOD_ini : IExtensionApplication
    {
        public Assembly assymblyRef;
        public void Initialize()
        {
            var acadpath = System.Diagnostics.Process.GetProcessesByName("acad").FirstOrDefault().MainModule.FileName;
            var year = new String(acadpath.ToCharArray().Where(p => char.IsDigit(p) == true).ToArray());
            try
            { assymblyRef = Assembly.LoadFrom("C:\\Program Files\\Autodesk\\Fabrication " + year.ToString() + "\\CADmep\\FabricationAPI.dll"); }
            catch (System.Exception ex)
            { Autodesk.AutoCAD.ApplicationServices.Application.DocumentManager.MdiActiveDocument.Editor.WriteMessage(ex.Message); }
        }
        public void Terminate() { }
    }


    public class FabCOD_commands
    {
        [CommandMethod("ExtractFabItemOptions")]
        public void CreateCreate()
        {
            List<CIDitem> output = new List<CIDitem>();
            var dir = new System.IO.DirectoryInfo(Assembly.GetExecutingAssembly().Location);
            dir = findParentDir(dir, "FabCOD") ?? dir;
            var dlg = new System.Windows.Forms.SaveFileDialog();
            dlg.InitialDirectory = dir.FullName;
            dlg.Title = "Extract CID Dim & Option Names";
            dlg.Filter = "JSON Files|*.json";
            dlg.FileName = "DimOptionChoices.json";
            dlg.CheckPathExists = true;
            if (dlg.ShowDialog() == System.Windows.Forms.DialogResult.OK)
            {
                for (int i = 0; i < 100000; i++)
                {
                    var ITM = Autodesk.Fabrication.Content.ContentManager.CreateItem(i);
                    if (ITM != null)
                    {
                        var dims = ITM.Dimensions.Select(p => p.Name).ToList();
                        var options = ITM.Options.Select(p => p.Name).ToList();
                        output.Add(new CIDitem(ITM.CID, dims, options));
                    }
                }
                string value = Newtonsoft.Json.JsonConvert.SerializeObject(output, Newtonsoft.Json.Formatting.Indented);
                output.Clear();
                System.IO.File.WriteAllText(dlg.FileName, value);
            }
        }

        private System.IO.DirectoryInfo findParentDir(System.IO.DirectoryInfo source, string name)
        {
            if (source.Parent == null)
                return null;
            else if (source.Parent.Name.ToUpper() == name.ToUpper())
                return source.Parent;
            else
                return findParentDir(source.Parent, name);
        }


        private class CIDitem
        {
            public int id { get; set; }
            public string sortId { get; set; }
            public List<string> dimensions { get; set; }
            public List<string> options { get; set; }
            public CIDitem(int CID, List<string> dimList, List<string> opList)
            {
                dimensions = dimList;
                options = opList;
                id = CID;
                sortId = CID.ToString();
                sortId = sortId.PadLeft(5, '!');
            }
        }
    }






    public static class helpers
    {
        public static TSource Find<TSource>(this System.Collections.ObjectModel.ReadOnlyCollection<TSource> enumerable, Predicate<TSource> compareMethod)
        {
            foreach (TSource item in enumerable)
                if (compareMethod(item))
                    return item;
            return default(TSource);
        }
        public static int FindIndexOf<TSource>(this System.Collections.ObjectModel.ReadOnlyCollection<TSource> enumerable, Predicate<TSource> compareMethod)
        {
            foreach (TSource item in enumerable)
                if (compareMethod(item))
                    return enumerable.IndexOf(item);
            return -1;
        }
    }




}
