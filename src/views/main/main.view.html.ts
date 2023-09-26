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
  </div>

  <script>
    {{iconsVariables}}
  </script>

  <script>
    {{js}}
  </script>
</body>

</html>`;