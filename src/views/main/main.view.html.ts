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

    {{actionsHtml}}

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