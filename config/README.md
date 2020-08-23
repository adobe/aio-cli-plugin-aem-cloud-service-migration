# Configurations

## Development

In order to run the aio-cli commands and execute the underlying migration tools, you need to create
a copy of [aem-migration-config.yaml](./aem-migration-config.yaml) file (with the same name) in your local file system's CLI
config directory.

-   Unix: `~/.config/@adobe/aio-cli`
-   Windows: `%LOCALAPPDATA%\@adobe\aio-cli`

## Configuring the migration tools

### dispatcher-converter
The dispatcher converter configuration uses YAML to define necessary configurations. Due to the
 known nature of Adobe Managed Services (AMS) dispatcher configurations, the configurations
 required for converting them to be AEM as a Cloud Service compatible dispatcher configurations,
 are relatively simple. However, since there are fewer restrictions to on-premise implementations,
 more specific configurations are necessary.

| Property | Description |
|---|---|
| sdkSrc* | The absolute path to your dispatcher sdk source code.  You must include the `src` folder itself in the path. |
| onPremise/dispatcherAnySrc | Path to the dispatcher.any file - required if you want to convert dispatcher configs |
| onPremise/httpdSrc | Path to the httpd.conf file - If `vhostsToConvert` is not specified you can use this property to find vhosts by parsing the main apache file |
| onPremise/vhostsToConvert | Array of paths to vhosts files you wish to convert to cloud service configurations |
| onPremise/variablesToReplace | Array of mapped objects that replace existing variables with new variables.  The original variable is first and the variable to replace is second |
| onPremise/appendToVhosts | This can be a file that you want to append to every vhost file in case you need logic added to all configurations - this is useful to replace logic that was once stored in your main apache config file |
| onPremise/pathToPrepend | This is required if you are converting your dispatcher configurations - this is used to help map includes in the configurations to their current location in the provided folder structure |
| onPremise/portsToMap | Only port 80 is supported in AEM as a Cloud Service - if you were using a non standard port here and need it mapped in AEM - provide it here - all other vhosts with non default ports will be removed. |
| ams/cfg* | The path to your configuration folder |
| * denotes required field | |

Example :

```$yaml
dispatcherConverter:
    sdkSrc: "/Users/{username}/some/path/to/dispatcher-sdk-2.0.21/src"
    onPremise:
        dispatcherAnySrc: "/Users/{username}/some/path/to/dispatcher.any"
        httpdSrc: "/Users/{username}/some/path/to/httpd.conf"
        vhostsToConvert:
            - "/Users/{username}/some/path/to/mywebsite.vhost"
            - "/Users/{username}/some/path/to/myotherwebsite.vhost"
        variablesToReplace:
            TIER: "ENVIRONMENT_TYPE"
        appendToVhosts:
            - "/Users/{username}/some/path/to/appendedContent.conf"
        pathToPrepend:
            - "/Users/{username}/some/path/to/your/httpd/content"
        portsToMap:
            - 8000
            - 8080
    ams:
        cfg: "/Users/{username}/some/path/to/dispatcher/folder"
```


### repository-modernizer

The repository modernizer expects the following configurations to be specified for execution :

-   `newGroupId` : The `groupId` to be used for newly created artifacts
-   `projects` : Add the required information about all the projects you want to restructure.
    Please create additional blocks for adding information about more than one project.
    -   `projectPath` : The absolute path to the project folder.
    -   `existingContentPackageFolderName` : The folder name of the existing content package that
        needs to be restructured.
    -   `newArtifactId` : The prefix that is to be used to set the artifactId for all newly
        created ui.apps and ui.content packages

NOTE : All configurations are required for proper functioning of the tool.

Example:

```@yaml
repositoryModernizer:
    # groupId to be used for newly created packages
    newGroupId: xyz.abc.com
    # information about projects
    projects:
        - # absolute path to the project folder
          projectPath: "/Users/{username}/some/path/to/xyz-aem"
          # folder name of the existing content package that needs to be restructured
          existingContentPackageFolderName: "content"
          # prefix that is to be used to set the artifactId for all newly created ui.apps and ui.content packages
          newArtifactId: xyz-aem
        - # absolute path to the project folder
          projectPath: "/Users/{username}/some/path/to/xyz-aem-core"
          # folder name of the existing content package that needs to be restructured
          existingContentPackageFolderName: "content"
          # prefix that is to be used to set the artifactId for all newly created ui.apps and ui.content packages
          newArtifactId: xyz-aem-core
```
