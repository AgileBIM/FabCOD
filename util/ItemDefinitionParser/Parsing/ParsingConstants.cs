namespace ItemDefinitionParser.Parsing
{
    
    internal static class FabConstants
    {
        public const string WikiUrl = "https://github.com/AgileBIM/FabCOD/blob/main/docs/wiki/";
        public const string SourceWarning = "**NOTE:** This documentation was auto-generated from the FabricationDefinition.ts file and any errors within this text needs to be resolved within that source file";
        public const string AccessNote = "The following items are accessed from the base object by a dot notation";
        public const string InvokeNote = "The following items are invoked from the base object by a dot notation";
    }
    
    // These Enum names and the associated classes are UpperCase to avoid protected name conflicts with C# & TypeScript
    public enum ParseType
    {
        ARGUMENT,
        CONSTANT,
        ENUM,
        FUNCTION,
        INTERFACE,
        KEYWORD,
        METHOD,
        OBJECT,
        PROPERTY
    }
}