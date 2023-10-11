export const HTML: string = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">

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

  <div id="modal-overlay"></div>
  <div id="modal">
    <h1 id="modal-title">Modal Title</h1>
    <p id="modal-description">Modal Description</p>
    
    <div id="modal-actions">
        <button id="modal-cancel">Cancel</button>
        <button id="modal-confirm">Confirm</button>
    </div>
  </div>

  <script>
    {{iconsVariables}}
  </script>

  <script>
    {{js}}
  </script>
</body>

</html>`;