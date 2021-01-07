using Microsoft.Win32;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace ItemDefinitionParser
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        System.IO.DirectoryInfo root;    
        public string Documentation { get { return confirmExists(root.FullName + "\\docs\\wiki\\", false); } set { } }
        public string tmTemplate { get { return confirmExists(root.FullName + "\\configurations\\codscript-tmLanguage.template.json"); } set { } }
        public string tmTarget { get { return confirmExists(root.FullName + "\\configurations\\codscript-tmLanguage.json"); } set { } }
        public string jsonObject { get { return confirmExists(root.FullName + "\\src\\data\\FabricationDefinition.json"); } set { } }
        public string tsObject { get { return confirmExists(root.FullName + "\\src\\support\\FabricationDefinition.ts"); } set { } }

        private string confirmExists(string path, bool isFile = true)
        {
            if (isFile)
                return System.IO.File.Exists(path) ? path : "";
            else
                return System.IO.Directory.Exists(path) ? path : "";
        }

        public MainWindow()
        {
            root = new System.IO.DirectoryInfo(Environment.CurrentDirectory).Parent.Parent;
            if (root.Name.ToUpper() != "FABCOD")
            {
                MessageBox.Show("This must be executed from the /FabCOD/util/Builds/ directory");
                this.Close();
            }
            InitializeComponent();
        }

    

        private void btnStart_Click(object sender, RoutedEventArgs e)
        {
            var blocks = tsParser.ExtractLibrary(System.IO.File.ReadAllLines(tbxDefPath.Text).ToList());
            blocks.Pack("C:\\Autodesk\\Blocks.json");
            blocks.ApplyData(tmTemplate, tmTarget);
            blocks.createWikis(Documentation);
        }
    }









    public static class Serializer
    {
        public static void Pack(this object obj, string path)
        {
            JsonSerializer ser = new JsonSerializer();
            ser.NullValueHandling = NullValueHandling.Include;
            ser.Formatting = Formatting.Indented;
            using (System.IO.StreamWriter sw = new System.IO.StreamWriter(path))
            {
                using (JsonWriter jw = new JsonTextWriter(sw))
                {
                    ser.Serialize(jw, obj);
                }
            }
        }
        public static T UnPack<T>(this string path)
        {
            if (System.IO.File.Exists(path) == true)
            {
                JsonSerializer ser = new JsonSerializer();
                ser.NullValueHandling = NullValueHandling.Include;
                using (System.IO.StreamReader sw = new System.IO.StreamReader(path))
                {
                    using (JsonTextReader jw = new JsonTextReader(sw))
                    {
                        return ser.Deserialize<T>(jw);
                    }
                }
            }
            else
            {
                return JsonConvert.DeserializeObject<T>(path);
            }

        }
    }
}
