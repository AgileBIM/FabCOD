using System;
using System.Linq;
using System.Windows;
using ItemDefinitionParser.Parsing;

namespace ItemDefinitionParser
{

    public partial class MainWindow : Window
    {
        private readonly System.IO.DirectoryInfo _root = new System.IO.DirectoryInfo(Environment.CurrentDirectory).Parent?.Parent;
        public string DocumentationDirPath => confirmExists($"{_root.FullName}\\docs\\wiki\\", false);
        public string TmTemplateFilePath => confirmExists($"{_root.FullName}\\configurations\\codscript-tmLanguage.template.json");
        public string TmTargetFilePath => confirmExists($"{_root.FullName}\\configurations\\codscript-tmLanguage.json");
        public string JsonObjectFilePath => confirmExists($"{_root.FullName}\\src\\support\\FabricationDefinition.json");
        public string TypeScriptDefinitionFilePath => confirmExists($"{_root.FullName}\\src\\support\\FabricationDefinition.ts");


        public MainWindow()
        {   
            if (_root == null || !_root.Name.Equals("FABCOD", StringComparison.OrdinalIgnoreCase))
            {
                MessageBox.Show("This must be executed from the /FabCOD/util/Builds/ directory");
                this.Close();
            }
            InitializeComponent();
        }
        
        
        private static string confirmExists(string path, bool isFile = true)
        {
            if (isFile)
                return System.IO.File.Exists(path) ? path : "";

            return System.IO.Directory.Exists(path) ? path : "";
        }

        
        private void btnStart_Click(object sender, RoutedEventArgs e)
        {
            // Generate the LanguageLibrary that the FabCOD extension uses as its primary data source 
            var lib = TypeScriptParser.BuildLanguageLibrary(System.IO.File.ReadAllLines(tbxDefPath.Text).ToList());
            
            // Create/Overwrite the LanguageLibrary to the pre-designated JSON object path
            lib.Pack(JsonObjectFilePath);
            
            // Create/Overwrite the release version of the "codscript-tmLanguage.json" color highlighting definition.
            LanguageConfiguration.GenerateTextMateColoringJson(lib, TmTemplateFilePath, TmTargetFilePath);
            
            // Create/Overwrite the non-tutorial based COD Language wiki documentation.
            LanguageConfiguration.GenerateAllWikis(lib, DocumentationDirPath);
        }
    }


}
