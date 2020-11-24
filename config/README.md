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

-   `groupId` : The `groupId` to be used for newly created artifacts.
-   `parentPom` : Add the required information about parent pom
    - `path` : The absolute path to the existing parent pom file.
    - `artifactId` : The `artifactId` to be set for the parent pom.
    - `appTitle` : The application title to be set for the parent pom.
-   `all` : Add the required information for `all` package
    - `artifactId` : The prefix that is to be used to set the artifactId for the `all` package.
    - `appTitle` : The application title.
-   `projects` : Add the required information about all the projects you want to restructure.
    (NOTE : Expects an array of project details objects.)
    -   `projectPath` : The absolute path to the project folder.
    -   `existingContentPackageFolder` : relative path(s) (w.r.t. the project folder) to the existing
     content package(s) that needs to be restructured. (NOTE : Expects an array of relative paths.)
    -   `relativePathToExistingFilterXml` : The relative path (w.r.t. the existing content package
        folder) to the vault filter.xml file. For example : `/src/main/content/META-INF/vault/filter.xml`
    -   `relativePathToExistingJcrRoot` : The relative path (w.r.t. the existing content package
        folder) to the jcr_root directory. For example : `/src/main/content/jcr_root`
    -   `artifactId` : The prefix that is to be used to set the artifactId for all newly
        created `ui.apps` and `ui.content` packages.
    -   `appTitle` : The application title.

Example:

```@yaml
repositoryModernizer:
  # groupId to be used for newly created packages
  groupId: com-xyz-aem
  # information about parent pom
  parentPom:
    # absolute path to the parent pom file
    path: /Users/{username}/some/path/to/xyz-aem/pom.xml
    # the artifactId to be set for the parent pom
    artifactId: xyz-aem-parent
    # the application title to be set for the parent pom
    appTitle: XYZ-AEM Parent
  # information required for all package
  all:
    # prefix that is to be used to set the artifactId for all package
    artifactId: xyz-aem
    # application title
    appTitle: XYZ-AEM Code Repository
  # information about projects
  projects:
    - # absolute path to the project folder
      projectPath: /Users/{username}/some/path/to/xyz-aem
      # relative path(s) (w.r.t. the project folder) to the existing content package(s) that needs to be restructured
      # (expects one or more relative paths to be provided in array format)
      existingContentPackageFolder:
        - /ui.apps
        - /ui.content
        - /ui.permissions
        - /oak-index-definitions
      # relative path (w.r.t. the existing content package folder) to the filter.xml file
      # (If not specified, default path `/src/main/content/META-INF/vault/filter.xml` will be used.)
      relativePathToExistingFilterXml:
      # relative path (w.r.t. the existing content package folder) to the jcr_root directory
      # (If not specified, default path `/src/main/content/jcr_root` will be used)
      relativePathToExistingJcrRoot:
      # prefix that is to be used to set the artifactId for newly created ui.apps and ui.content packages
      artifactId: xyz-content-aem
      # application title
      appTitle: XYZ
```

### index-converter

The repository modernizer expects the following configurations to be specified for execution :
-   `ensureIndexDefinitionContentPackageJcrRootPath` : Absolute path to the jcr_root directory
 of the package containing the Ensure Index Definitions (please ignore if there are no Ensure Index Definitions).
-   `aemVersion` : Version of AEM customer is on, used to determine the baseline index definitions.
-   `xmlPath` : Path to the customer OAK Index Definition xml file.
-   `filterXMLPath` : Path to the existing package `filter.xml` file.

Example:

```@yaml
indexConverter:
    # Absolute path to the jcr_root directory of the package containing the Ensure Index Definitions
    # (please ignore if there are no Ensure Index Definitions)
    # eg. /Users/xyz/sampleCode/content/src/main/content/jcr_root
    ensureIndexDefinitionContentPackageJcrRootPath: "/Users/xyz/sampleCode/content/src/main/content/jcr_root"
    # Version of AEM customer is on, used to determine the baseline index definitions
    aemVersion: 64
    # Path to the customer OAK Index Definition xml file
    # eg /Users/xyz/sampleCode/ui.apps/src/main/content/jcr_root/_oak_index
    xmlPath:"/Users/xyz/sampleCode/ui.apps/src/main/content/jcr_root/_oak_index"
    # Path to the existing package `filter.xml` file
    # eg /Users/xyz/sampleCode/ui.apps/src/main/content/META-INF/vault/filter.xml
    filterXMLPath:"/Users/xyz/sampleCode/ui.apps/src/main/content/META-INF/vault/filter.xml"
```
