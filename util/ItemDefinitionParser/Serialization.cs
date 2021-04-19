using Newtonsoft.Json;

namespace ItemDefinitionParser
{
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