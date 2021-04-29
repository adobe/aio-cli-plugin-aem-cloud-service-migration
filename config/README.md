# Configurations

## Development

In order to run the aio-cli commands and execute the underlying migration tools, you need to create a copy of 
[aem-migration-config.yaml](./aem-migration-config.yaml) file (with the SAME NAME). This file can be placed either in the local
file system, or in the CLI config directory :

**Local Project Location**:

- `./.aio-cli`

**CLI config directory**:

-   Unix: `~/.config/@adobe/aio-cli`
-   Windows: `%LOCALAPPDATA%\@adobe\aio-cli`

NOTE : Please create the required CLI config directory structure if it is not already present,
 and create a copy of the [aem-migration-config.yaml](./aem-migration-config.yaml) file inside.

## Configuring the migration tools
The [aem-migration-config.yaml](./aem-migration-config.yaml) contains the configuration template for
 all the code refactoring tools. Please configure only the relevant section for each tool that you want to
  execute (other tools' configuration sections do not need to be filled) .

### dispatcher-converter
The dispatcher converter configuration uses YAML to define necessary configurations. Due to the
 known nature of Adobe Managed Services (AMS) dispatcher configurations, the configurations
 required for converting them to be AEM as a Cloud Service compatible dispatcher configurations,
 are relatively simple. However, since there are fewer restrictions to on-premise implementations,
 more specific configurations are necessary.

| Property | Description |
|---|---|
| sdkSrc* | Path to your dispatcher sdk source code.  You must include the `src` folder itself in the path. |
| onPremise/dispatcherAnySrc | Path to the dispatcher.any file. |
| onPremise/httpdSrc | Path to the httpd.conf file (the main apache config file) - If `vhostsToConvert` is not specified you can use this property to find vhosts by parsing the main apache file. |
| onPremise/vhostsToConvert | Array of paths to vhosts files and/or vhost folders containing vhost files you wish to convert to cloud service configurations. |
| onPremise/variablesToReplace | Array of mapped objects that replace existing variables with new variables. The original variable is first and the variable to replace is second. |
| onPremise/appendToVhosts | This can be a file that you want to append to every vhost file in case you need logic added to all configurations. This is useful to replace logic that was once stored in your main apache config file. |
| onPremise/pathToPrepend | Array of paths to existing dispatcher configuration root folders to scan for the included files. These paths help to map includes in the configurations to their current location in the provided folder structure. |
| onPremise/portsToMap | Only port 80 is supported in AEM as a Cloud Service - if you were using a non standard port here and need it mapped in AEM, provide it here - all other vhosts with non default ports will be removed. |
| ams/cfg* | Path to dispatcher configuration folder (expected immediate subfolders - `conf`, `conf.d`, `conf.dispatcher.d` and `conf.modules.d`) |
| * denotes required field | |

Example :

```$yaml
dispatcherConverter:
    # Path to the src folder of the dispatcher sdk. You must include the src folder itself in the path.
    sdkSrc: "/Users/{username}/some/path/to/dispatcher-sdk-2.0.21/src"
    # Add information about on-premise dispatcher configuration here
    onPremise:
        # Path to the dispatcher.any file
        dispatcherAnySrc: "/Users/{username}/some/path/to/dispatcher.any"
        # Path to the httpd.conf file (the main apache config file)
        # If `vhostsToConvert` is not specified you can use this property to find vhosts by parsing the main apache file
        httpdSrc: "/Users/{username}/some/path/to/httpd.conf"
        # Array of paths to vhosts files and/or vhost folders containing vhost files you wish to convert to cloud service configurations
        vhostsToConvert:
            - "/Users/{username}/some/path/to/mywebsite.vhost"
            - "/Users/{username}/some/path/to/myotherwebsite.vhost"
            - "/Users/{username}/some/path/to/vhostfolder"
        # Array of mapped objects that replace existing variables with new variables.
        # The original variable is first and the variable to replace is second
        variablesToReplace:
            TIER: "ENVIRONMENT_TYPE"
        # This can be a file that you want to append to every vhost file in case you need logic added to all configurations.
        # This is useful to replace logic that was once stored in your main apache config file.
        appendToVhosts:
            - "/Users/{username}/some/path/to/appendedContent.conf"
        # Array of paths to existing dispatcher configuration root folders to scan for the included files.
        # These paths help to map includes in the configurations to their current location in the provided folder structure.
        pathToPrepend:
            - "/Users/{username}/some/path/to/your/httpd/content/"
        # Only port 80 is supported in AEM as a Cloud Service - if you were using a non standard port here and need it mapped
        # in AEM, provide it here - all other vhosts with non default ports will be removed.
        portsToMap:
            - 8000
            - 8080
    # Add information about Adobe Managed Services dispatcher configuration here
    ams:
        # Path to dispatcher configuration folder
        # (expected immediate subfolders - conf, conf.d, conf.dispatcher.d and conf.modules.d)
        cfg: "/Users/{username}/some/path/to/dispatcher/folder"
```
### repository-modernizer

The repository modernizer expects the following configurations to be specified for execution :

-   `groupId` : The `groupId` to be used for newly created artifacts.
-   `parentPom` : Add the required information about parent pom
    - `path` : The absolute path to the existing parent pom file.
    - `artifactId` : The `artifactId` to be set for the parent pom.
    - `appTitle` : The application title to be set for the parent pom.
    - `version` : The version to be set for the parent pom.
-   `all` : Add the required information for `all` and `analyse` packages
    - `artifactId` : The prefix that is to be used to set the artifactId for the `all` and `analyse` packages.
    - `appTitle` : The application title.
    - `version` : The version to be set for the `all` pom.
-   `projects` : Add the required information about all the projects you want to restructure.
    (NOTE : Expects an array of project details objects.)
    (NOTE : For multiple projects create separate copies of the info section for each project)
    -   `projectPath` : The absolute path to the project folder.
    -   `existingContentPackageFolder` : relative path(s) (w.r.t. the project folder) to the existing
     content package(s) that needs to be restructured. (NOTE : Expects an array of relative paths to 
     existing content packages, NOT bundle/jar artifacts.)
    -   `relativePathToExistingFilterXml` : The relative path (w.r.t. the existing content package
        folder) to the vault filter.xml file. For example : `/src/main/content/META-INF/vault/filter.xml`
    -   `relativePathToExistingJcrRoot` : The relative path (w.r.t. the existing content package
        folder) to the jcr_root directory. For example : `/src/main/content/jcr_root`
    -   `artifactId` : The prefix that is to be used to set the artifactId for all newly
        created `ui.apps` and `ui.content` packages.
    -   `appTitle` : The application title.
    -   `appId` : The application Id (will be used for config and package folder names)
    -   `version` : The version used for content packages.
    -   `coreBundles` : Array of relative path(s) (w.r.t. the project folder) to the existing code bundles
        (these bundles will be embedded in the `all` package).
    -   `osgiFoldersToRename` : OSGi config folders that need to be renamed. The existing/source OSGi
	    config folder PATH (JCR path starting from '/apps') is expected as key, and the replacement OSGi
		folder NAME is expected as value.

        (NOTE 1 : All OSGi config folders under the same path and with same replacement name will be MERGED.)

        (NOTE 2 : If there exists OSGi config files with the same pid/filename in more than one config folders
                  which are to be merged, they will not be overwritten. A warning regrading the same will be
                  generated in the summary report and result log file. User would need to manually evaluate
                  which config to persist.)

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
    # version to be to be set for the parent pom
    version: 1.0.0-SNAPSHOT
  # information required for all and analyse packages
  all:
    # prefix that is to be used to set the artifactId for all and analyse packages
    artifactId: xyz-aem
    # application title
    appTitle: XYZ-AEM Code Repository
    # version to be set for all pom
    version: 1.0.0-SNAPSHOT
  # information about projects (expects an array of project information)
  # NOTE : For multiple projects create separate copies of the info section for each project
  projects:
    - # absolute path to the XYZ project folder
      projectPath: /Users/{username}/some/path/to/xyz-aem
      # Array of relative path(s) (w.r.t. the project folder) to the existing content package(s) that needs to be restructured.
      # NOTE : only content packages are expected here, NOT bundle/jar artifacts
      existingContentPackageFolder:
        - /ui.apps
        - /ui.content
        - /ui.permissions
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
      # application ID (will be used for config and package folder names)
      appId: xyz-app
      # project specific version to be used for content packages
      version: 2.0.0-SNAPSHOT
      # Array of relative path(s) (w.r.t. the project folder) to the existing code bundles (will be embedded in the all package).
      coreBundles:
          - /core
          - /api
      # OSGi config folders that need to be renamed.
      # The existing/source OSGi config folder PATH (JCR path starting from '/apps') is expected as key
      # and the replacement OSGi folder NAME is expected as value. See examples below :
      #    /apps/xyz/config.prod : config.publish.prod
      #    /apps/system/config.author.dev1 : config.author.dev
      #    /apps/system/config.author.dev2 : config.author.dev
      # NOTE :
      #    1. All OSGi config folders under the same path and with same replacement name will be MERGED
      #       (as configured in above example).
      #    2. If there exists OSGi config files with the same pid/filename in more than one config folders
      #       which are to be merged, they will not be overwritten. A warning regrading the same will be
      #       generated in the summary report and result log file. User would need to manually evaluate
      #       which config to persist
      osgiFoldersToRename:
          /apps/xyz/config.dev1: config.author.dev
          /apps/xyz/config.dev2: config.author.dev
          /apps/system/config.author.localdev: config.author.dev
          /apps/system/config.author.dev1: config.author.dev
          /apps/system/config.prod: config.publish.prod
          /apps/system/config.publish: config.publish.prod
    - # absolute path to the ABC project folder
      projectPath: /Users/{username}/some/path/to/abc-aem
      # Array of relative path(s) (w.r.t. the project folder) to the existing content package(s) that needs to be restructured.
      # NOTE : only content packages are expected here, NOT bundle/jar artifacts
      existingContentPackageFolder:
        - /content
        - /oak-index-definitions
      # relative path (w.r.t. the existing content package folder) to the filter.xml file
      # (If not specified, default path `/src/main/content/META-INF/vault/filter.xml` will be used.)
      relativePathToExistingFilterXml:
      # relative path (w.r.t. the existing content package folder) to the jcr_root directory
      # (If not specified, default path `/src/main/content/jcr_root` will be used)
      relativePathToExistingJcrRoot:
      # prefix that is to be used to set the artifactId for newly created ui.apps and ui.content packages
      artifactId: abc-content-aem
      # application title
      appTitle: ABC
      # application ID (will be used for config and package folder names)
      appId: abc-app
      # project specific version to be used for content packages
      version: 2.0.0-SNAPSHOT
      # Array of relative path(s) (w.r.t. the project folder) to the existing code bundles (will be embedded in the all package).
      coreBundles:
          - /core
      # OSGi config folders that need to be renamed.
      # The existing/source OSGi config folder PATH (JCR path starting from '/apps') is expected as key
      # and the replacement OSGi folder NAME is expected as value. See examples below :
      #    /apps/my-appId/config.prod : config.publish.prod
      #    /apps/system/config.author.dev1 : config.author.dev
      #    /apps/system/config.author.dev2 : config.author.dev
      # NOTE :
      #    1. All OSGi config folders under the same path and with same replacement name will be MERGED
      #       (as configured in above example).
      #    2. If there exists OSGi config files with the same pid/filename in more than one config folders
      #       which are to be merged, they will not be overwritten. A warning regrading the same will be
      #       generated in the summary report and result log file. User would need to manually evaluate
      #       which config to persist
      osgiFoldersToRename:
          /apps/abc/config.author.dev1: config.author.dev
          /apps/abc/config.author.dev2: config.author.dev
          /apps/abc/config.author.localdev: config.author.dev
          /apps/abc/config.prod: config.publish.prod
          /apps/abc/config.publish: config.publish.prod
```

### index-converter

The index converter expects the following configurations to be specified for execution :
-   `ensureIndexDefinitionContentPackageJcrRootPath` : Path to the jcr_root directory of the package
 containing the **Ensure Index Definitions** (please ignore if there are no Ensure Index Definitions).
-   `ensureIndexDefinitionConfigPackageJcrRootPath` : Path to the jcr_root directory of the package
 containing the **Ensure Index OSGI Configuration** (please ignore if there are no Ensure Index Definitions).
-   `aemVersion` : Version of AEM customer is on, used to determine the baseline index definitions.
-   `customOakIndexDirectoryPath` : Path to the customer OAK Index Definition directory.
-   `filterXMLPath` : Path to the existing package `filter.xml` file.

Example:

```@yaml
indexConverter:
    # Path to the jcr_root directory of the package containing the Ensure Index Definitions
    # (please ignore if there are no Ensure Index Definitions)
    # eg. /Users/xyz/sampleCode/content/src/main/content/jcr_root
    ensureIndexDefinitionContentPackageJcrRootPath: "/Users/xyz/sampleCode/content/src/main/content/jcr_root"
    # Path to the jcr_root directory of the package containing the Ensure Oak Index OSGI Configuration
    # (please ignore if there are no Ensure Index Definitions)
    # eg. /Users/xyz/sampleCode/CONFIG/src/main/content/jcr_root
    ensureIndexDefinitionConfigPackageJcrRootPath: "/Users/xyz/sampleCode/CONFIG/src/main/content/jcr_root"
    # Version of AEM customer is on, used to determine the baseline index definitions
    aemVersion: 64
    # Path to the customer OAK Index Definition directory
    # (please ignore if there are no Oak Index Definitions)
    # eg /Users/xyz/sampleCode/ui.apps/src/main/content/jcr_root/_oak_index
    customIndexDirectoryPath:"/Users/xyz/sampleCode/ui.apps/src/main/content/jcr_root/_oak_index"
    # Path to the existing package `filter.xml` file
    # eg /Users/xyz/sampleCode/ui.apps/src/main/content/META-INF/vault/filter.xml
    filterXMLPath:"/Users/xyz/sampleCode/ui.apps/src/main/content/META-INF/vault/filter.xml"
```
