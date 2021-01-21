# FabCOD

This VSCode extension provides language support for COD Scripting. This scripting language is specifically intended for automation tasks related to the Autodesk Fabrication software package. The COD language has a lot in common with the VBA scripting language, but with less of its features, unique constraints, various deviations and even laziness. The Repo-Wiki will eventually be built out with documentation related to this extension and probably some introductory COD language tutorials.

## Features

- Generated COD Language [Documentation](https://github.com/AgileBIM/FabCOD/tree/main/docs/wiki) in MD format
- Syntax Highlighting
- Auto-Completion
  - Snippets are fully managed and currently prevent user-defined versions.
  - Includes type information if applicable
  - Includes descriptions for properties/methods
  - Includes unique symbols for different named types
  - Unique path assistance behavior for INCLUDE statements; requires CTRL+SPACE for activation
    - Actually importing functions as auto-completion values is a work in progress
- Mouse Hover Documentation
  - Markdown enhanced
  - Includes dotted sequences
  - Includes variable types if they are Object types
  - Object types have links to generated help MD files
- Function signature assistance
  - Markdown enhanced
  - Includes dotted sequences
  - Includes rudimentary versions for user-defined functions

- ExecuteScript in AutoCAD (see requirements)
  - Accessible from F5 shortcut or right click context menu
- Fully managed folding regions
  - Right click context menu has a "surround" style user-defined folding region

- Item.Dim[] & Item.Option[] lookup assistance accessible from right click menu
  - Currently only using default values
  - Added holes, branches and option differentials are a work in progress.

## Requirements

For script execution, you will need to be running on the Windows OS, have AutoCAD opened and Fabrication loaded.

This isn't 100% confirmed, but I do not believe COD supports Unicode languages. I know it is very common practice to generate a linefeed, tab or any other non-standard character using  the ASCII() function.

## Extension Settings

No extension settings at this time

## Known Issues

This is still in an Alpha release, please [report issues](https://github.com/AgileBIM/FabCOD/issues) that you find. 

## Contributions

Read these if you would like to use this extension in a developer context or contribute to the project.

[devReadFirst.md](https://github.com/AgileBIM/FabCOD/blob/main/docs/devReadFirst.md)

[devContributer.md](https://github.com/AgileBIM/FabCOD/blob/main/docs/devContributer.md)