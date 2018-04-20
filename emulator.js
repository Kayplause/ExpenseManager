/**---------------WORK FLOW
 * Hit the PlugPortal Database with the payload
 * Get the name of the tab to be created/deleted from url query
 *
 * In case of creation:
 * Create the tab directory
 * Create the necessary files
 *
 * In case of deletion:
 * Delete the necessary files
 * Delete the tab directory
 *
 * For creation and deletion:
 * Edit the app.module.ts file
 *
 * In all cases:
 * Edit the routing.module.ts file
 *
 * Return to the frontend
 */

// GET DEPENDENCIES
const express = require('express');
const fs = require('fs');
const http = require('http');
const path = require('path');

const app = express();

// APP VARIABLES
const angular = 'src/app';
const ngModuleFile = `${angular}/app.module.ts`;
const ngRouteFile = `${angular}/routing.module.ts`;
const url = '/tabMgt';

// HANDLE CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Method', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
})

// CREATE COMPONENT
app.get(`${url}/create`, (req, res) => {
  var folder = req.query.dir;
  var tab = req.query.newurl;
  var component = toPascalCase(tab);
  // Create angular component
  createComponent(res, angular, folder, tab, ngModuleFile, ngRouteFile);

})

// DELETE COMPONENT
app.get(`${url}/delete`, (req, res) => {
  var folder = req.query.dir;
  var tab = req.query.newurl;
  var component = toPascalCase(tab);
  // Create angular component
  deleteComponent(res, angular, folder, tab, ngModuleFile, ngRouteFile);

})

// EDIT ROUTE
app.get(`${url}/edit`, (req, res) => {
  var oldRoute = req.query.oldurl;
  var newRoute = req.query.newurl;
  fs.readFile(ngRouteFile, (err, data) => {
    var ngRouteContent = data.toString();
    // Replace old route with new route
    var newContent = ngRouteContent.replace(`'${oldRoute}',`, `'${newRoute}',`);
    // Write new content back to file
    fs.writeFile(ngRouteFile, newContent, (err) => {
      if (err) {
        res.json('Error changing route url in routing.module.ts file');
      }

      res.json('Voila')

    })

  })

})

// SET PORT
const port = process.env.PORT || '4000';
app.set('port', port);

// CREATE SERVER
const server = http.createServer(app);
server.listen(port, () => {console.log(`Listening on port: ${port}`)});



/*-------------------------------------------------------------------------------
                            USEFUL && REQUIRED FUNCTIONS
---------------------------------------------------------------------------------*/

// PASCAL CASE
function toPascalCase(tab) {
  var tabArr = tab.split('-');
  var pascalCasedTab = '';
  for (var i = 0; i < tabArr.length; i++) {
    var firstLetter = tabArr[i].substr(0, 1);
    var otherLetters = tabArr[i].substr(1);
    var newWord = firstLetter.toUpperCase() + otherLetters;
    pascalCasedTab += newWord;
  }
  return pascalCasedTab;
}

// HTML CONTENT
function htmlComponent(tab) {
var content =
`<p>
  ${tab} works!
</p>
`
return content;
}

// TS CONTENT
function tsComponent(tab) {
var content =
`import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-${tab}',
  templateUrl: './${tab}.component.html',
  styleUrls: ['./${tab}.component.css']
})
export class ${toPascalCase(tab)}Component implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
`
return content
}

// COMPONENT IMPORT STATEMENT
function componentImport(folder, tab) {
var folderName = '';
folder.length > 0 ? folderName = `${folder}/${tab}` : folderName = `${tab}`;
var content =
`import { ${toPascalCase(tab)}Component } from './${folderName}/${tab}.component';\r\n`
return content;
}

// COMPONENT DECLARATION IN NGMODULE
function componentDeclaration(tab) {
var content =
`\r\n    ${toPascalCase(tab)}Component,`
return content;
}

// COMPONENT ROUTE STATEMENT IN ROUTING MODULE
function routeStatement(tab) {
var content =
`{ path: '${tab}', component: ${toPascalCase(tab)}Component,
     canActivate: [AuthService], canDeactivate: [AuthoutService] },\r\n\r\n  `
return content;
}

// CREATE ANGULAR COMPONENT
function createComponent(res, angular, folder, tab, ngModuleFile, ngRouteFile) {
  // Create the directory to house the components
  fs.mkdir(`${angular}/${folder}/${tab}`, (err) => {
    if (err) {
      res.json("Error creating components folder");
    }

    // If folder creation is successful, create the contents
    var folderName = `${angular}/${folder}/${tab}`;

    // Create css file
    var css = fs.createWriteStream(`${folderName}/${tab}.component.css`);
    css.end();

    // Create html file
    var html = fs.createWriteStream(`${folderName}/${tab}.component.html`);
    html.write(htmlComponent(tab));
    html.end();

    // Create ts file
    var ts = fs.createWriteStream(`${folderName}/${tab}.component.ts`);
    ts.write(tsComponent(tab));
    ts.end();

    //-------------------------- UPDATE ANGULAR'S APP MODULE FILE
    // Read app.module.ts
    fs.readFile(ngModuleFile, (err, data) => {
      if (err) {
        res.json("Could not read app.module.ts file");
      }

      var appModuleOldContent = data.toString();
      // Look for insertion point for component import
      var lookup = '@NgModule({';
      var index = appModuleOldContent.indexOf(lookup);
      var preLookup = appModuleOldContent.substring(0, index);
      var postLookup = appModuleOldContent.substring(index);
      // Look for insertion point for component declaration
      var lookup2 = 'AppComponent,';
      var index2 = postLookup.indexOf(lookup2) + 13;
      var preLookup2 = postLookup.substring(0, index2);
      var postLookup2 = postLookup.substring(index2);

      var appModuleNewContent =
        preLookup + componentImport(folder, tab) + preLookup2 + componentDeclaration(tab) + postLookup2;
      // Write to app.module.ts
      fs.writeFile(ngModuleFile, appModuleNewContent, (err) => {
        if (err) {
          res.json("Could not write to app.module.ts");
        }

        //-----------------------------UPDATE THE ROUTING MODULE FILE
        fs.readFile(ngRouteFile, (err, data) => {
          if (err) {
            res.json("Could not read routing.module.ts file");
          }

          var routingModuleOldContent = data.toString();
          // Look for insertion point for routing declaration
          var lookup = `{ path: '**', component: Page404Component }`;
          var index = routingModuleOldContent.indexOf(lookup);
          var preLookup = routingModuleOldContent.substring(0, index);
          var postLookup = routingModuleOldContent.substring(index);

          var routingModuleNewContent =
            componentImport(folder, tab) + preLookup + routeStatement(tab) + postLookup;
          // Write to routing.module.ts
          fs.writeFile(ngRouteFile, routingModuleNewContent, (err) => {
            if (err) {
              res.json("Could not write to routing.module.ts");
            }

            res.json("Voila");
          })

        })

      })

    })

  })
}

// DELETE ANGULAR COMPONENT
function deleteComponent(res, angular, folder, tab, ngModuleFile, ngRouteFile) {
  var folderName = '';
  folder.length > 0 ? folderName = `${angular}/${folder}/${tab}` : folderName = `${angular}/${tab}`;
  // Delete css file...
  fs.unlink(`${folderName}/${tab}.component.css`, (err) => {
    if (err) {
      res.json('Could not delete css file');
    }
    // Delete html file...
    fs.unlink(`${folderName}/${tab}.component.html`, (err) => {
      if (err) {
        res.json('Could not delete html file');
      }
      // Delete ts file...
      fs.unlink(`${folderName}/${tab}.component.ts`, (err) => {
        if (err) {
          res.json('Could not delete ts file');
        }
        // Delete spec.ts file if exist...
        fs.exists(`${folderName}/${tab}.component.spec.ts`, (exists) => {
          if (exists) {
            fs.unlink(`${folderName}/${tab}.component.spec.ts`, (err) => {
              if (err) {
                res.json('Could not delete spec.ts file');
              }
              // Delete directory
              fs.rmdir(`${folderName}`, (err) => {
                if (err) {
                  res.json('Could not remove directory');
                }
                // Remove component statements from app.module.ts and routing.module.ts files
                removeComponentStatement(res, angular, folder, tab, ngModuleFile, ngRouteFile);
              })

            })
          }

          if (!exists) {
            // Delete directory
            fs.rmdir(`${folderName}`, (err) => {
              if (err) {
                res.json('Could not remove directory');
              }
              // Remove component statements from app.module.ts and routing.module.ts files
              removeComponentStatement(res, angular, folder, tab, ngModuleFile, ngRouteFile);
            })

          }

        })

      })

    })

  })

}

// WORKS WITH deleteComponent(args...) function to remove statements from module files
function removeComponentStatement(res, angular, folder, tab, ngModuleFile, ngRouteFile) {
  fs.readFile(ngModuleFile, (err, data) => {
    var ngModuleContent = data.toString();
    // Set string to empty
    var contentState1 = ngModuleContent.replace(componentImport(folder, tab), '');
    var contentState2 = contentState1.replace(componentDeclaration(tab), '');
    // Write new content back to file
    fs.writeFile(ngModuleFile, contentState2, (err) => {
      if (err) {
        res.json('Error removing statements from app.module.ts file');
      }
      // Statements exist and replaced or statements do not exist but no error
      //Remove component statements from routing.module.ts
      fs.readFile(ngRouteFile, (err, data) => {
        var ngRouteContent = data.toString();
        // Set string to empty
        var contentState3 = ngRouteContent.replace(componentImport(folder, tab), '');
        var contentState4 = contentState3.replace(routeStatement(tab), '');
        // Write new content back to file
        fs.writeFile(ngRouteFile, contentState4, (err) => {
          if (err) {
            res.json('Error removing statements from routing.module.ts file');
          }

          res.json('Voila')

        })

      })

    })

  })
}
