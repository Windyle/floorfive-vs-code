export const HTML: string = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>KBS6 Dev</title>

  <style>
    {{css}}
  </style>
</head>

<body>

  <div class="collapsible">
    <h1>Angular Development</h1>
    <div class="chevron-arrow"></div>
  </div>
  <div class="btns-container">
    <button id="dev-kbs6-serve">Serve</button>
    <button id="dev-kbs6-test">Test</button>
    <button id="dev-kbs6-build">Build</button>
    <button id="dev-kbs6-build-watch">Build Watch</button>
  </div>

  <div class="collapsible">
    <h1>Angular Deploy</h1>
    <div class="chevron-arrow"></div>
  </div>
  <div class="btns-container">
    <button id="dev-kbs6-deploy">Deploy</button>
  </div>

  <div class="collapsible">
    <h1>KBS6 Lib</h1>
    <div class="chevron-arrow"></div>
  </div>
  <div class="btns-container">
    <button id="dev-kbs6-lib-install">Install Latest</button>
    <button id="dev-kbs6-lib-compare">Compare Version</button>
    <button id="dev-kbs6-lib-publish">Publish</button>
  </div>

  <div class="collapsible">
    <h1>Lint</h1>
    <div class="chevron-arrow"></div>
  </div>
  <div class="btns-container">
    <h2>Full Project</h2>
    <button id="dev-kbs6-lint-full-project">Lint</button>
    <button id="dev-kbs6-lint-full-project-fix">Fix</button>

    <h2>Staged Files</h2>
    <button id="dev-kbs6-lint-staged-files">Lint</button>
    <button id="dev-kbs6-lint-staged-files-fix">Fix</button>

    <h2>Current File</h2>
    <button id="dev-kbs6-lint-current-file">Lint</button>
    <button id="dev-kbs6-lint-current-file-fix">Fix</button>
  </div>

  <div class="collapsible">
    <h1>KBS Mobile</h1>
    <div class="chevron-arrow"></div>
  </div>
  <div class="btns-container">
    <button id="dev-kbs6-mobile-set-env">Set Environment</button>
    <button id="dev-kbs6-mobile-increment-version">Increment Version</button>
    <button class="btn-span-2" id="dev-kbs6-mobile-configurations-routes">Configurations Routes</button>
    <button class="btn-span-2" id="dev-kbs6-mobile-entities-properties-list">Entities Properties List</button>
    <button id="dev-kbs6-mobile-global-variables">Global Variables</button>
  </div>


  <script>
    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {

            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
                content.style.maxHeight = null;
                content.style.padding = "0";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                content.style.padding = "10px";
            }

            var j;
            for (j = 0; j < coll.length; j++) {
                if (coll[j] != this) {
                    coll[j].classList.remove("active");
                    var content = coll[j].nextElementSibling;
                    content.style.maxHeight = null;
                    content.style.padding = "0";
                }
            }

        });
    }
  </script>
</body>

</html>`;