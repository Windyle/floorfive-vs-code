export const HTML: string = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>KBS6 Dev</title>

  <style>
    {{css}}
  </style>
  <style>
    {{animationsCss}}
  </style>
</head>

<body>

  <div class="container">

    <div class="collapsible" id="angular-deploy-collapsible">
      <h1>Angular Deploy</h1>
      <div class="chevron-arrow"></div>
    </div>
    <div class="btns-container" id="angular-deploy-btns-container">
      <button class="command-button" id="angular-deploy">Deploy</button>
    </div>

    <div class="collapsible" id="kbs6-lib-collapsible">
      <h1>KBS6 Lib</h1>
      <div class="chevron-arrow"></div>
    </div>
    <div class="btns-container" id="kbs6-lib-btns-container">
      <button class="command-button icon-button" id="kbs6-lib-install"><icon name="download-cloud"></icon> <label>Install Latest</label></button>
      <button class="command-button icon-button" id="kbs6-lib-compare"><icon name="arrows-right-left"></icon> <label>Compare Version</label></button>
      <button class="command-button icon-button" id="kbs6-lib-publish"><icon name="upload-cloud"></icon> <label>Publish</label></button>
    </div>

    <div class="collapsible">
      <h1>Lint</h1>
      <div class="chevron-arrow"></div>
    </div>
    <div class="btns-container">
      <h2>Full Project</h2>
      <button class="command-button" id="lint-full-project">Lint</button>
      <button class="command-button" id="lint-full-project-fix">Fix</button>

      <h2>Staged Files</h2>
      <button class="command-button" id="lint-staged-files">Lint</button>
      <button class="command-button" id="lint-staged-files-fix">Fix</button>

      <h2>Current File</h2>
      <button class="command-button" id="lint-current-file">Lint</button>
      <button class="command-button" id="lint-current-file-fix">Fix</button>
    </div>

    <div class="collapsible" id="kbs-mobile-collapsible">
      <h1>KBS Mobile</h1>
      <div class="chevron-arrow"></div>
    </div>
    <div class="btns-container" id="kbs-mobile-btns-container">
      <button class="command-button" id="dev-kbs6-mobile-set-env">Set Environment</button>
      <button class="command-button" id="dev-kbs6-mobile-increment-version">Increment Version</button>
      <button class="command-button" class="btn-span-2" id="dev-kbs6-mobile-configurations-routes">Configurations Routes</button>
      <button class="command-button" class="btn-span-2" id="dev-kbs6-mobile-entities-properties-list">Entities Properties List</button>
      <button class="command-button" id="dev-kbs6-mobile-global-variables">Global Variables</button>
    </div>

    <div class="collapsible settings">
      <icon name="settings"></icon>
      <h1>Settings</h1>
      <div class="chevron-arrow"></div>
    </div>
    <div class="btns-container">
      <button class="command-button" id="kbs6-lib-install">Button</button>
    </div>
    
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
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }

            var j;
            for (j = 0; j < coll.length; j++) {
                if (coll[j] != this) {
                    coll[j].classList.remove("active");
                    var content = coll[j].nextElementSibling;
                    content.style.maxHeight = null;
                }
            }

        });
    }
  </script>

  <script>
    {{iconsVariables}}
  </script>

  <script>
    {{js}}
  </script>
</body>

</html>`;