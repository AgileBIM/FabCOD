using System;
using System.Diagnostics;

namespace ExecuteInAcad
{
    class Program
    {

        static void Main(string[] args)
        {
            if (args.Length != 1)
                return;
            else if (System.IO.File.Exists(args[0]) == false)
                return;

            Process[] acadProcesses = Process.GetProcessesByName("acad");            
            if (acadProcesses.Length == 0)
                Console.WriteLine("ERROR->No running ACAD processes found!");
            else if (acadProcesses.Length > 1)
                Console.WriteLine("ERROR->More than 1 ACAD process found!");
            else
            {
                try
                {
                    string codInvoke = "(ExecuteScript \"" + args[0].Replace("\\", "\\\\").Trim() + "\") ";
                    dynamic acad = System.Runtime.InteropServices.Marshal.GetActiveObject("AutoCAD.Application");
                    if (acad.visible == true)
                        acad.ActiveDocument.SendCommand(codInvoke);
                    Console.WriteLine("Success");
                }
                catch (Exception)
                {
                    Console.WriteLine("ERROR->Failed to execute script!");
                }
            }
        }


    }
}
