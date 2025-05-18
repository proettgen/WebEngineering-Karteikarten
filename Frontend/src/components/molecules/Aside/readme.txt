for backend:

all folders and their structure are stored in a single json (see mockFolders.json)
=> this file includes all folders in a flat (non-nested) structure with their parent id
=> all folders have a v4 UUID for identification.
    => these can easily be generated with a package (see doc: https://www.npmjs.com/package/uuid)
=> all folders include the UUID of their parent (except of course top-level folders)

=> later card stacks can be stored in a folder by assigning each card stack their correct folder UUID